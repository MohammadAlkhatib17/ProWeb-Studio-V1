#!/usr/bin/env node

/**
 * Complete 3D Asset Optimization Pipeline
 * 
 * Orchestrates the complete process:
 * 1. Export procedural geometries to GLTF
 * 2. Compress GLTF models with Meshopt
 * 3. Convert textures to KTX2 format
 * 4. Generate asset manifests
 * 5. Report optimization results
 */

const { GeometryExporter } = require('./export-geometries');
const { GLTFOptimizer } = require('./gltf-optimizer');
const { KTX2Converter } = require('./ktx2-converter');
const path = require('path');
const fs = require('fs').promises;

class Asset3DOptimizer {
  constructor(options = {}) {
    this.options = {
      inputDir: './public/assets',
      outputDir: './public/assets/optimized',
      tempDir: './temp/3d-export',
      enableKTX2: true,
      enableMeshopt: true,
      enableDraco: false, // Use Meshopt as primary
      quality: 0.85,
      verbose: true,
      cleanTemp: true,
      ...options
    };
    
    this.stats = {
      startTime: Date.now(),
      originalSize: 0,
      optimizedSize: 0,
      filesProcessed: 0
    };
  }

  /**
   * Run the complete optimization pipeline
   */
  async optimize() {
    console.log('🚀 Starting 3D Asset Optimization Pipeline...\n');
    
    try {
      // Step 1: Export geometries
      console.log('📦 Step 1: Exporting procedural geometries...');
      const geometryResults = await this.exportGeometries();
      
      // Step 2: Optimize GLTF models
      console.log('\n🗜️  Step 2: Compressing GLTF models...');
      const gltfResults = await this.optimizeGLTF();
      
      // Step 3: Convert textures (if any exist)
      console.log('\n🖼️  Step 3: Converting textures to KTX2...');
      const textureResults = await this.optimizeTextures();
      
      // Step 4: Generate manifests
      console.log('\n📋 Step 4: Generating asset manifests...');
      await this.generateManifests(geometryResults, gltfResults, textureResults);
      
      // Step 5: Generate report
      console.log('\n📊 Step 5: Generating optimization report...');
      const report = await this.generateReport(geometryResults, gltfResults, textureResults);
      
      // Step 6: Cleanup
      if (this.options.cleanTemp) {
        console.log('\n🧹 Step 6: Cleaning temporary files...');
        await this.cleanup();
      }
      
      return report;
      
    } catch (error) {
      console.error('❌ Optimization pipeline failed:', error.message);
      throw error;
    }
  }

  /**
   * Export procedural geometries to GLTF
   */
  async exportGeometries() {
    await fs.mkdir(this.options.tempDir, { recursive: true });
    
    const exporter = new GeometryExporter({
      binary: true,
      verbose: this.options.verbose
    });
    
    const results = await exporter.exportAll(this.options.tempDir);
    
    // Calculate original sizes
    for (const result of results) {
      this.stats.originalSize += result.size;
      this.stats.filesProcessed++;
    }
    
    return results;
  }

  /**
   * Optimize GLTF models with Meshopt compression
   */
  async optimizeGLTF() {
    const optimizer = new GLTFOptimizer({
      enableMeshopt: this.options.enableMeshopt,
      enableDraco: this.options.enableDraco,
      enableKTX2: false, // Handle textures separately
      qualityLevel: this.options.quality,
      verbose: this.options.verbose
    });
    
    const modelOutputDir = path.join(this.options.outputDir, 'models');
    await fs.mkdir(modelOutputDir, { recursive: true });
    
    const results = await optimizer.processDirectory(this.options.tempDir, modelOutputDir);
    
    // Update compressed size stats
    for (const result of results) {
      this.stats.optimizedSize += result.compressedSize;
    }
    
    return results;
  }

  /**
   * Convert textures to KTX2 format
   */
  async optimizeTextures() {
    // Check if textures directory exists
    const textureInputDir = path.join(this.options.inputDir, 'textures');
    
    try {
      await fs.access(textureInputDir);
    } catch {
      console.log('   No textures directory found, skipping texture optimization.');
      return [];
    }
    
    if (!this.options.enableKTX2) {
      console.log('   KTX2 compression disabled, skipping texture optimization.');
      return [];
    }
    
    const converter = new KTX2Converter({
      quality: Math.round(this.options.quality * 255),
      enableMultiformat: true,
      verbose: this.options.verbose
    });
    
    // Check if toktx is available
    if (!(await converter.checkDependencies())) {
      console.log('   KTX2 tools not available, skipping texture optimization.');
      return [];
    }
    
    const textureOutputDir = path.join(this.options.outputDir, 'textures');
    return await converter.processDirectory(textureInputDir, textureOutputDir);
  }

  /**
   * Generate asset manifests for runtime loading
   */
  async generateManifests(geometryResults, gltfResults, textureResults) {
    const manifestDir = path.join(this.options.outputDir, 'manifests');
    await fs.mkdir(manifestDir, { recursive: true });
    
    // Model manifest
    const modelManifest = {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      compression: {
        meshopt: this.options.enableMeshopt,
        draco: this.options.enableDraco
      },
      models: {}
    };
    
    gltfResults.forEach(result => {
      const basename = path.basename(result.inputPath, path.extname(result.inputPath));
      const originalResult = geometryResults.find(g => g.name === basename);
      
      modelManifest.models[basename] = {
        original: {
          path: path.relative(this.options.outputDir, result.inputPath),
          size: originalResult?.size || 0
        },
        optimized: {
          path: path.relative(this.options.outputDir, result.outputPath),
          size: result.compressedSize,
          compression: result.reduction.toFixed(1) + '%'
        },
        meshopt: this.options.enableMeshopt,
        format: 'glb'
      };
    });
    
    await fs.writeFile(
      path.join(manifestDir, 'models.json'),
      JSON.stringify(modelManifest, null, 2)
    );
    
    // Combined asset manifest for loader
    const assetManifest = {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      basePath: '/assets/optimized/',
      models: modelManifest.models,
      textures: textureResults.length > 0 ? this.generateTextureManifest(textureResults) : {},
      loaderConfig: {
        meshoptDecoder: '/assets/optimized/decoders/meshopt_decoder.js',
        ktx2Loader: this.options.enableKTX2,
        dracoLoader: this.options.enableDraco
      }
    };
    
    await fs.writeFile(
      path.join(this.options.outputDir, 'asset-manifest.json'),
      JSON.stringify(assetManifest, null, 2)
    );
    
    console.log(`   Generated manifests in ${manifestDir}`);
  }

  /**
   * Generate texture manifest from results
   */
  generateTextureManifest(textureResults) {
    const manifest = {};
    
    textureResults.forEach(result => {
      const basename = path.basename(result.inputPath, path.extname(result.inputPath));
      manifest[basename] = {
        original: {
          path: path.relative(this.options.outputDir, result.inputPath),
          size: result.originalSize
        },
        compressed: result.results.reduce((acc, r) => {
          const format = r.format.toLowerCase();
          acc[format] = {
            path: path.relative(this.options.outputDir, r.path),
            size: r.size,
            compression: ((result.originalSize - r.size) / result.originalSize * 100).toFixed(1) + '%'
          };
          return acc;
        }, {})
      };
    });
    
    return manifest;
  }

  /**
   * Generate comprehensive optimization report
   */
  async generateReport(geometryResults, gltfResults, textureResults) {
    const endTime = Date.now();
    const duration = (endTime - this.stats.startTime) / 1000;
    
    const totalReduction = this.stats.originalSize > 0 
      ? ((this.stats.originalSize - this.stats.optimizedSize) / this.stats.originalSize) * 100 
      : 0;
    
    const report = {
      pipeline: {
        version: '1.0.0',
        completedAt: new Date().toISOString(),
        duration: `${duration.toFixed(2)}s`,
        status: 'success'
      },
      summary: {
        filesProcessed: this.stats.filesProcessed,
        originalSize: this.formatBytes(this.stats.originalSize),
        optimizedSize: this.formatBytes(this.stats.optimizedSize),
        totalReduction: `${totalReduction.toFixed(1)}%`,
        compressionRatio: `${(this.stats.originalSize / this.stats.optimizedSize).toFixed(2)}:1`,
        targetAchieved: totalReduction >= 30
      },
      geometry: {
        exported: geometryResults.length,
        totalSize: this.formatBytes(geometryResults.reduce((sum, r) => sum + r.size, 0)),
        formats: ['glb']
      },
      gltf: {
        optimized: gltfResults.length,
        meshoptEnabled: this.options.enableMeshopt,
        dracoEnabled: this.options.enableDraco,
        averageReduction: gltfResults.length > 0 
          ? (gltfResults.reduce((sum, r) => sum + r.reduction, 0) / gltfResults.length).toFixed(1) + '%'
          : '0%'
      },
      textures: {
        converted: textureResults.length,
        ktx2Enabled: this.options.enableKTX2,
        formats: textureResults.length > 0 ? ['etc1s', 'astc', 'bc7'] : []
      },
      output: {
        directory: this.options.outputDir,
        structure: {
          models: path.join(this.options.outputDir, 'models'),
          textures: path.join(this.options.outputDir, 'textures'),
          manifests: path.join(this.options.outputDir, 'manifests'),
          assetManifest: path.join(this.options.outputDir, 'asset-manifest.json')
        }
      }
    };
    
    // Save report
    const reportPath = path.join(this.options.outputDir, 'optimization-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    // Display summary
    console.log('\n🎉 Optimization Complete!');
    console.log('=========================');
    console.log(`Duration: ${duration.toFixed(2)}s`);
    console.log(`Files processed: ${report.summary.filesProcessed}`);
    console.log(`Original size: ${report.summary.originalSize}`);
    console.log(`Optimized size: ${report.summary.optimizedSize}`);
    console.log(`Total reduction: ${report.summary.totalReduction}`);
    console.log(`Target (≥30%): ${report.summary.targetAchieved ? '✅ ACHIEVED' : '❌ NOT MET'}`);
    console.log(`Report saved: ${reportPath}`);
    
    return report;
  }

  /**
   * Cleanup temporary files
   */
  async cleanup() {
    try {
      await fs.rm(this.options.tempDir, { recursive: true, force: true });
      console.log('   Temporary files cleaned');
    } catch (error) {
      console.warn('   Warning: Could not clean temporary files:', error.message);
    }
  }

  /**
   * Format bytes to human readable format
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

/**
 * CLI Interface
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    console.log(`
3D Asset Optimization Pipeline
===============================

Usage: node optimize-3d-assets.js [options]

Options:
  --input=<dir>        Input assets directory (default: ./public/assets)
  --output=<dir>       Output directory (default: ./public/assets/optimized)
  --temp=<dir>         Temporary directory (default: ./temp/3d-export)
  --quality=<0.0-1.0>  Quality level (default: 0.85)
  --no-meshopt         Disable Meshopt compression
  --no-ktx2            Disable KTX2 texture compression
  --enable-draco       Enable Draco compression (alternative to Meshopt)
  --keep-temp          Don't clean temporary files
  --quiet              Disable verbose output
  --help               Show this help

Examples:
  node optimize-3d-assets.js
  node optimize-3d-assets.js --quality=0.9 --enable-draco
  node optimize-3d-assets.js --output=./dist/assets --no-ktx2
    `);
    process.exit(0);
  }

  // Parse options
  const options = {
    inputDir: args.find(arg => arg.startsWith('--input='))?.split('=')[1] || './public/assets',
    outputDir: args.find(arg => arg.startsWith('--output='))?.split('=')[1] || './public/assets/optimized',
    tempDir: args.find(arg => arg.startsWith('--temp='))?.split('=')[1] || './temp/3d-export',
    quality: parseFloat(args.find(arg => arg.startsWith('--quality='))?.split('=')[1] || '0.85'),
    enableMeshopt: !args.includes('--no-meshopt'),
    enableKTX2: !args.includes('--no-ktx2'),
    enableDraco: args.includes('--enable-draco'),
    cleanTemp: !args.includes('--keep-temp'),
    verbose: !args.includes('--quiet')
  };

  const optimizer = new Asset3DOptimizer(options);
  
  try {
    const report = await optimizer.optimize();
    
    if (!report.summary.targetAchieved) {
      console.log('\n⚠️  Warning: Target reduction of ≥30% was not achieved.');
      console.log('   Consider adjusting quality settings or enabling additional compression options.');
      process.exit(1);
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Optimization failed:', error.message);
    process.exit(1);
  }
}

// Export for programmatic use
module.exports = { Asset3DOptimizer };

// Run CLI if called directly
if (require.main === module) {
  main().catch(console.error);
}