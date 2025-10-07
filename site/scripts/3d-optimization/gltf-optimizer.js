#!/usr/bin/env node

/**
 * GLTF Compression Pipeline with Meshopt and KTX2 Texture Support
 * 
 * This script automates the process of optimizing GLTF models with:
 * - Meshopt compression for geometry
 * - KTX2 texture compression
 * - Draco compression fallback
 * - Bundle size reporting
 */

const { NodeIO, GLTFTransform } = require('@gltf-transform/core');
const { 
  meshopt, 
  draco, 
  textureCompress, 
  dedup, 
  prune, 
  weld,
  simplify
} = require('@gltf-transform/functions');
const path = require('path');
const fs = require('fs').promises;

class GLTFOptimizer {
  constructor(options = {}) {
    this.options = {
      enableMeshopt: true,
      enableDraco: true,
      enableKTX2: true,
      qualityLevel: 0.8,
      compressionLevel: 6,
      verbose: false,
      ...options
    };
    
    this.io = new NodeIO();
    this.stats = {
      originalSize: 0,
      compressedSize: 0,
      compressionRatio: 0,
      filesProcessed: 0
    };
  }

  /**
   * Process a single GLTF file with all optimizations
   */
  async processFile(inputPath, outputPath) {
    try {
      if (this.options.verbose) {
        console.log(`Processing: ${inputPath}`);
      }

      // Load the GLTF document
      const document = await this.io.read(inputPath);
      
      // Get original size
      const originalBuffer = await fs.readFile(inputPath);
      this.stats.originalSize += originalBuffer.length;

      // Apply optimizations in sequence
      await document.transform(
        // Clean up duplicate materials, textures, and nodes
        dedup(),
        
        // Remove unused materials, textures, and nodes
        prune(),
        
        // Weld vertices (merge duplicate vertices)
        weld({ tolerance: 0.0001 }),
        
        // Simplify geometry if enabled
        this.options.enableSimplify ? simplify({ ratio: this.options.qualityLevel }) : null,
        
        // Compress textures to KTX2 format
        this.options.enableKTX2 ? textureCompress({
          encoder: 'ktx',
          formats: {
            'image/jpeg': 'ktx2',
            'image/png': 'ktx2',
            'image/webp': 'ktx2'
          },
          quality: Math.round(this.options.qualityLevel * 100)
        }) : null,
        
        // Apply Meshopt compression (preferred)
        this.options.enableMeshopt ? meshopt({
          level: this.options.compressionLevel
        }) : null,
        
        // Apply Draco compression as fallback
        this.options.enableDraco && !this.options.enableMeshopt ? draco({
          quantizationVolume: 'mesh'
        }) : null
      );

      // Ensure output directory exists
      const outputDir = path.dirname(outputPath);
      await fs.mkdir(outputDir, { recursive: true });

      // Write optimized file
      await this.io.write(outputPath, document);
      
      // Get compressed size
      const compressedBuffer = await fs.readFile(outputPath);
      this.stats.compressedSize += compressedBuffer.length;
      this.stats.filesProcessed++;

      const fileSizeReduction = ((originalBuffer.length - compressedBuffer.length) / originalBuffer.length) * 100;
      
      if (this.options.verbose) {
        console.log(`✅ Optimized: ${path.basename(outputPath)}`);
        console.log(`   Original: ${this.formatBytes(originalBuffer.length)}`);
        console.log(`   Compressed: ${this.formatBytes(compressedBuffer.length)}`);
        console.log(`   Reduction: ${fileSizeReduction.toFixed(1)}%`);
      }

      return {
        inputPath,
        outputPath,
        originalSize: originalBuffer.length,
        compressedSize: compressedBuffer.length,
        reduction: fileSizeReduction
      };

    } catch (error) {
      console.error(`❌ Error processing ${inputPath}:`, error.message);
      throw error;
    }
  }

  /**
   * Process multiple GLTF files
   */
  async processDirectory(inputDir, outputDir, pattern = '**/*.{gltf,glb}') {
    const glob = require('glob');
    const files = glob.sync(pattern, { cwd: inputDir });
    
    if (files.length === 0) {
      console.log(`⚠️  No GLTF files found in ${inputDir}`);
      return [];
    }

    console.log(`🔄 Processing ${files.length} GLTF files...`);
    
    const results = [];
    for (const file of files) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file);
      
      try {
        const result = await this.processFile(inputPath, outputPath);
        results.push(result);
      } catch (error) {
        console.error(`Failed to process ${file}:`, error.message);
      }
    }

    return results;
  }

  /**
   * Generate compression report
   */
  generateReport(results) {
    const totalReduction = this.stats.originalSize > 0 
      ? ((this.stats.originalSize - this.stats.compressedSize) / this.stats.originalSize) * 100 
      : 0;

    const report = {
      summary: {
        filesProcessed: this.stats.filesProcessed,
        originalSize: this.formatBytes(this.stats.originalSize),
        compressedSize: this.formatBytes(this.stats.compressedSize),
        totalReduction: `${totalReduction.toFixed(1)}%`,
        compressionRatio: `${(this.stats.originalSize / this.stats.compressedSize).toFixed(2)}:1`
      },
      options: this.options,
      files: results.map(r => ({
        file: path.basename(r.inputPath),
        originalSize: this.formatBytes(r.originalSize),
        compressedSize: this.formatBytes(r.compressedSize),
        reduction: `${r.reduction.toFixed(1)}%`
      }))
    };

    return report;
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
  
  if (args.length < 2) {
    console.log(`
Usage: node gltf-optimizer.js <input> <output> [options]

Options:
  --no-meshopt     Disable Meshopt compression
  --no-draco       Disable Draco compression  
  --no-ktx2        Disable KTX2 texture compression
  --quality=0.8    Set quality level (0.0-1.0)
  --level=6        Set compression level (0-10)
  --simplify       Enable geometry simplification
  --verbose        Enable verbose output

Examples:
  node gltf-optimizer.js ./models ./optimized --verbose
  node gltf-optimizer.js scene.gltf scene-optimized.glb --quality=0.9
    `);
    process.exit(1);
  }

  const [input, output] = args;
  
  // Parse options
  const options = {
    enableMeshopt: !args.includes('--no-meshopt'),
    enableDraco: !args.includes('--no-draco'),
    enableKTX2: !args.includes('--no-ktx2'),
    enableSimplify: args.includes('--simplify'),
    verbose: args.includes('--verbose'),
    qualityLevel: parseFloat(args.find(arg => arg.startsWith('--quality='))?.split('=')[1] || '0.8'),
    compressionLevel: parseInt(args.find(arg => arg.startsWith('--level='))?.split('=')[1] || '6')
  };

  const optimizer = new GLTFOptimizer(options);
  
  try {
    let results;
    
    // Check if input is file or directory
    const inputStat = await fs.stat(input);
    
    if (inputStat.isDirectory()) {
      results = await optimizer.processDirectory(input, output);
    } else {
      results = [await optimizer.processFile(input, output)];
    }

    // Generate and display report
    const report = optimizer.generateReport(results);
    
    console.log('\n📊 Compression Report:');
    console.log('========================');
    console.log(`Files processed: ${report.summary.filesProcessed}`);
    console.log(`Original size: ${report.summary.originalSize}`);
    console.log(`Compressed size: ${report.summary.compressedSize}`);
    console.log(`Total reduction: ${report.summary.totalReduction}`);
    console.log(`Compression ratio: ${report.summary.compressionRatio}`);
    
    if (options.verbose && results.length > 1) {
      console.log('\n📋 File Details:');
      report.files.forEach(file => {
        console.log(`  ${file.file}: ${file.originalSize} → ${file.compressedSize} (${file.reduction})`);
      });
    }

    // Save report to JSON
    const reportPath = path.join(path.dirname(output), 'compression-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Report saved to: ${reportPath}`);

  } catch (error) {
    console.error('❌ Optimization failed:', error.message);
    process.exit(1);
  }
}

// Export for programmatic use
module.exports = { GLTFOptimizer };

// Run CLI if called directly
if (require.main === module) {
  main().catch(console.error);
}