#!/usr/bin/env node

/**
 * KTX2 Texture Conversion Pipeline
 * 
 * Converts images to KTX2 format with GPU-specific compression:
 * - Desktop: BC7 (high quality)
 * - Mobile: ASTC (universal mobile support)
 * - Fallback: ETC1S (universal compression)
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs').promises;
const glob = require('glob');

const execAsync = promisify(exec);

class KTX2Converter {
  constructor(options = {}) {
    this.options = {
      quality: 128,        // ETC1S quality (1-255)
      astcQuality: 'medium', // ASTC quality (fast, medium, thorough)
      bc7Quality: 'medium',  // BC7 quality (fast, medium, slow)
      enableMipMaps: true,
      enableMultiformat: true,
      verbose: false,
      ...options
    };
    
    this.stats = {
      originalSize: 0,
      compressedSize: 0,
      filesProcessed: 0
    };
  }

  /**
   * Check if toktx command is available
   */
  async checkDependencies() {
    try {
      await execAsync('toktx --version');
      return true;
    } catch (error) {
      console.error('❌ toktx command not found. Please install KTX-Software tools:');
      console.error('   https://github.com/KhronosGroup/KTX-Software/releases');
      console.error('   Or: brew install ktx2ktx2 (macOS)');
      console.error('   Or: apt-get install ktx-tools (Ubuntu)');
      return false;
    }
  }

  /**
   * Convert a single image to KTX2 with multiple compression formats
   */
  async convertImage(inputPath, outputDir) {
    const basename = path.basename(inputPath, path.extname(inputPath));
    const results = [];

    // Get original file size
    const originalStat = await fs.stat(inputPath);
    this.stats.originalSize += originalStat.size;

    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    try {
      // Generate different compression variants for different device types
      
      // 1. ETC1S Universal (for broad compatibility)
      const etc1sPath = path.join(outputDir, `${basename}_etc1s.ktx2`);
      await this.compressETC1S(inputPath, etc1sPath);
      results.push({ format: 'ETC1S', path: etc1sPath });

      // 2. ASTC (for mobile devices)
      if (this.options.enableMultiformat) {
        const astcPath = path.join(outputDir, `${basename}_astc.ktx2`);
        await this.compressASTC(inputPath, astcPath);
        results.push({ format: 'ASTC', path: astcPath });

        // 3. BC7 (for desktop/high-end devices)
        const bc7Path = path.join(outputDir, `${basename}_bc7.ktx2`);
        await this.compressBCTex(inputPath, bc7Path);
        results.push({ format: 'BC7', path: bc7Path });
      }

      // Calculate compressed sizes
      for (const result of results) {
        const compressedStat = await fs.stat(result.path);
        result.size = compressedStat.size;
        this.stats.compressedSize += compressedStat.size;
      }

      this.stats.filesProcessed++;

      if (this.options.verbose) {
        console.log(`✅ Converted: ${basename}`);
        console.log(`   Original: ${this.formatBytes(originalStat.size)}`);
        results.forEach(r => {
          const reduction = ((originalStat.size - r.size) / originalStat.size) * 100;
          console.log(`   ${r.format}: ${this.formatBytes(r.size)} (${reduction.toFixed(1)}% reduction)`);
        });
      }

      return {
        inputPath,
        originalSize: originalStat.size,
        results
      };

    } catch (error) {
      console.error(`❌ Error converting ${inputPath}:`, error.message);
      throw error;
    }
  }

  /**
   * Compress using ETC1S (universal compression)
   */
  async compressETC1S(inputPath, outputPath) {
    const mipmapFlag = this.options.enableMipMaps ? '--genmipmap' : '';
    const cmd = `toktx ${mipmapFlag} --bcmp --clevel 1 --qlevel ${this.options.quality} "${outputPath}" "${inputPath}"`;
    
    await execAsync(cmd);
  }

  /**
   * Compress using ASTC (mobile-optimized)
   */
  async compressASTC(inputPath, outputPath) {
    const mipmapFlag = this.options.enableMipMaps ? '--genmipmap' : '';
    const qualityMap = { fast: 'fast', medium: 'medium', thorough: 'thorough' };
    const quality = qualityMap[this.options.astcQuality] || 'medium';
    
    const cmd = `toktx ${mipmapFlag} --encode astc --astc-quality ${quality} "${outputPath}" "${inputPath}"`;
    
    await execAsync(cmd);
  }

  /**
   * Compress using BC7 (desktop-optimized)
   */
  async compressBCTex(inputPath, outputPath) {
    const mipmapFlag = this.options.enableMipMaps ? '--genmipmap' : '';
    const cmd = `toktx ${mipmapFlag} --encode basis-lz --clevel 1 "${outputPath}" "${inputPath}"`;
    
    await execAsync(cmd);
  }

  /**
   * Process multiple images
   */
  async processDirectory(inputDir, outputDir, pattern = '**/*.{png,jpg,jpeg,webp}') {
    const files = glob.sync(pattern, { cwd: inputDir, absolute: true });
    
    if (files.length === 0) {
      console.log(`⚠️  No image files found in ${inputDir}`);
      return [];
    }

    console.log(`🔄 Processing ${files.length} texture files...`);
    
    const results = [];
    for (const file of files) {
      try {
        const result = await this.convertImage(file, outputDir);
        results.push(result);
      } catch (error) {
        console.error(`Failed to process ${file}:`, error.message);
      }
    }

    return results;
  }

  /**
   * Generate texture manifest for runtime loading
   */
  generateTextureManifest(results, outputPath) {
    const manifest = {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      textures: {}
    };

    results.forEach(result => {
      const basename = path.basename(result.inputPath, path.extname(result.inputPath));
      manifest.textures[basename] = {
        original: {
          path: path.relative(path.dirname(outputPath), result.inputPath),
          size: result.originalSize
        },
        compressed: result.results.reduce((acc, r) => {
          const format = r.format.toLowerCase();
          acc[format] = {
            path: path.relative(path.dirname(outputPath), r.path),
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
Usage: node ktx2-converter.js <input> <output> [options]

Options:
  --quality=128        ETC1S quality level (1-255)
  --astc-quality=medium ASTC quality (fast, medium, thorough)
  --bc7-quality=medium BC7 quality (fast, medium, slow)
  --no-mipmaps        Disable mipmap generation
  --single-format     Only generate ETC1S (universal) format
  --verbose           Enable verbose output

Examples:
  node ktx2-converter.js ./textures ./optimized --verbose
  node ktx2-converter.js texture.png texture.ktx2 --quality=200
    `);
    process.exit(1);
  }

  const [input, output] = args;
  
  // Parse options
  const options = {
    quality: parseInt(args.find(arg => arg.startsWith('--quality='))?.split('=')[1] || '128'),
    astcQuality: args.find(arg => arg.startsWith('--astc-quality='))?.split('=')[1] || 'medium',
    bc7Quality: args.find(arg => arg.startsWith('--bc7-quality='))?.split('=')[1] || 'medium',
    enableMipMaps: !args.includes('--no-mipmaps'),
    enableMultiformat: !args.includes('--single-format'),
    verbose: args.includes('--verbose')
  };

  const converter = new KTX2Converter(options);
  
  // Check dependencies
  if (!(await converter.checkDependencies())) {
    process.exit(1);
  }
  
  try {
    let results;
    
    // Check if input is file or directory
    const inputStat = await fs.stat(input);
    
    if (inputStat.isDirectory()) {
      results = await converter.processDirectory(input, output);
    } else {
      results = [await converter.convertImage(input, path.dirname(output))];
    }

    // Generate texture manifest
    const manifestPath = path.join(output, 'texture-manifest.json');
    const manifest = converter.generateTextureManifest(results, manifestPath);
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

    // Display results
    const totalReduction = converter.stats.originalSize > 0 
      ? ((converter.stats.originalSize - converter.stats.compressedSize) / converter.stats.originalSize) * 100 
      : 0;

    console.log('\n📊 KTX2 Conversion Report:');
    console.log('===========================');
    console.log(`Files processed: ${converter.stats.filesProcessed}`);
    console.log(`Original size: ${converter.formatBytes(converter.stats.originalSize)}`);
    console.log(`Compressed size: ${converter.formatBytes(converter.stats.compressedSize)}`);
    console.log(`Average reduction: ${totalReduction.toFixed(1)}%`);
    console.log(`Texture manifest: ${manifestPath}`);

  } catch (error) {
    console.error('❌ Conversion failed:', error.message);
    process.exit(1);
  }
}

// Export for programmatic use
module.exports = { KTX2Converter };

// Run CLI if called directly
if (require.main === module) {
  main().catch(console.error);
}