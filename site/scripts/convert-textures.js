#!/usr/bin/env node

/**
 * Texture Conversion Script
 * Converts PNG/WebP textures to KTX2 format using BasisU
 * 
 * Usage:
 *   node scripts/convert-textures.js [options]
 * 
 * Options:
 *   --source <dir>      Source texture directory (default: public/assets)
 *   --output <dir>      Output directory (default: public/textures)
 *   --quality <level>   Compression quality: etc1s or uastc (default: etc1s)
 *   --max-size <px>     Maximum texture dimension (default: 2048)
 *   --help              Show help
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  sourceDir: 'public/assets',
  outputDir: 'public/textures',
  quality: 'etc1s', // or 'uastc'
  maxSize: 2048,
  formats: ['.png', '.jpg', '.jpeg', '.webp'],
};

// Parse command line arguments
process.argv.slice(2).forEach((arg, i, arr) => {
  if (arg === '--source' && arr[i + 1]) config.sourceDir = arr[i + 1];
  if (arg === '--output' && arr[i + 1]) config.outputDir = arr[i + 1];
  if (arg === '--quality' && arr[i + 1]) config.quality = arr[i + 1];
  if (arg === '--max-size' && arr[i + 1]) config.maxSize = parseInt(arr[i + 1]);
  if (arg === '--help') {
    console.log(`
Texture Conversion Script
Converts textures to KTX2 format using BasisU

Usage:
  node scripts/convert-textures.js [options]

Options:
  --source <dir>      Source texture directory (default: public/assets)
  --output <dir>      Output directory (default: public/textures)
  --quality <level>   Compression quality: etc1s or uastc (default: etc1s)
  --max-size <px>     Maximum texture dimension (default: 2048)
  --help              Show help

Quality Levels:
  etc1s: Best compression, lower quality (recommended for most textures)
  uastc: Higher quality, larger file size (for normal maps, detail textures)

Examples:
  # Convert all textures with ETC1S compression
  node scripts/convert-textures.js

  # Convert with UASTC for better quality
  node scripts/convert-textures.js --quality uastc

  # Custom source and output directories
  node scripts/convert-textures.js --source public/assets/hero --output public/textures/hero
    `);
    process.exit(0);
  }
});

// Check for toktx tool (from KTX-Software)
function checkDependencies() {
  try {
    execSync('toktx --version', { stdio: 'ignore' });
    return true;
  } catch (err) {
    console.error('❌ Error: toktx tool not found!');
    console.error('\nPlease install KTX-Software:');
    console.error('  macOS:   brew install khronosgroup/toktx/toktx');
    console.error('  Linux:   https://github.com/KhronosGroup/KTX-Software/releases');
    console.error('  Windows: https://github.com/KhronosGroup/KTX-Software/releases');
    console.error('\nOr use Docker:');
    console.error('  docker pull khronosgroup/ktx-software');
    return false;
  }
}

// Get all texture files recursively
function getTextureFiles(dir, baseDir = dir) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️  Directory not found: ${dir}`);
    return files;
  }

  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getTextureFiles(fullPath, baseDir));
    } else {
      const ext = path.extname(item).toLowerCase();
      if (config.formats.includes(ext)) {
        files.push({
          input: fullPath,
          relative: path.relative(baseDir, fullPath),
        });
      }
    }
  });

  return files;
}

// Convert texture to KTX2
function convertTexture(inputPath, outputPath) {
  const outputDir = path.dirname(outputPath);
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Also create WebP fallback
  const webpPath = outputPath.replace(/\.[^.]+$/, '.webp');
  
  try {
    // Determine compression settings
    const isNormalMap = inputPath.includes('normal') || inputPath.includes('_n.');
    const quality = isNormalMap ? 'uastc' : config.quality;
    
    // Build toktx command
    let cmd = 'toktx';
    
    // Compression mode
    if (quality === 'uastc') {
      cmd += ' --uastc 2'; // UASTC quality level 2 (good balance)
      cmd += ' --uastc_rdo_l 0.5'; // Rate-distortion optimization
    } else {
      cmd += ' --bcmp'; // BasisU compression
      cmd += ' --clevel 4'; // Compression level 0-5
      cmd += ' --qlevel 128'; // Quality level 1-255
    }
    
    // Additional flags
    cmd += ' --t2'; // Use newer basis format
    cmd += ` --resize ${config.maxSize}x${config.maxSize}`;
    cmd += ' --mipmap'; // Generate mipmaps
    cmd += ' --normalize'; // Normalize normal maps if detected
    
    if (isNormalMap) {
      cmd += ' --normal_map';
    }
    
    cmd += ` "${outputPath}"`;
    cmd += ` "${inputPath}"`;
    
    // Convert to KTX2
    execSync(cmd, { stdio: 'pipe' });
    
    // Create WebP fallback using Sharp or ImageMagick
    try {
      const convertCmd = `convert "${inputPath}" -resize ${config.maxSize}x${config.maxSize}> -quality 90 "${webpPath}"`;
      execSync(convertCmd, { stdio: 'pipe' });
    } catch (err) {
      // Fallback: copy original
      fs.copyFileSync(inputPath, webpPath);
    }
    
    const ktx2Size = fs.statSync(outputPath).size;
    const originalSize = fs.statSync(inputPath).size;
    const ratio = ((1 - ktx2Size / originalSize) * 100).toFixed(1);
    
    return {
      success: true,
      input: inputPath,
      output: outputPath,
      originalSize,
      compressedSize: ktx2Size,
      compressionRatio: ratio,
    };
  } catch (err) {
    return {
      success: false,
      input: inputPath,
      error: err.message,
    };
  }
}

// Main execution
function main() {
  console.log('🎨 Texture Conversion to KTX2/BasisU\n');
  
  if (!checkDependencies()) {
    process.exit(1);
  }

  console.log('Configuration:');
  console.log(`  Source:      ${config.sourceDir}`);
  console.log(`  Output:      ${config.outputDir}`);
  console.log(`  Quality:     ${config.quality}`);
  console.log(`  Max Size:    ${config.maxSize}px`);
  console.log('');

  const files = getTextureFiles(config.sourceDir);
  
  if (files.length === 0) {
    console.log('❌ No texture files found!');
    process.exit(0);
  }

  console.log(`Found ${files.length} texture(s) to convert\n`);

  const results = [];
  let successCount = 0;
  let failCount = 0;
  let totalOriginal = 0;
  let totalCompressed = 0;

  files.forEach((file, index) => {
    const outputPath = path.join(
      config.outputDir,
      file.relative.replace(/\.[^.]+$/, '.ktx2')
    );
    
    process.stdout.write(`[${index + 1}/${files.length}] ${file.relative}... `);
    
    const result = convertTexture(file.input, outputPath);
    results.push(result);
    
    if (result.success) {
      successCount++;
      totalOriginal += result.originalSize;
      totalCompressed += result.compressedSize;
      console.log(`✓ ${result.compressionRatio}% smaller`);
    } else {
      failCount++;
      console.log(`✗ ${result.error}`);
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log('Conversion Summary:');
  console.log(`  Success:     ${successCount}/${files.length}`);
  console.log(`  Failed:      ${failCount}/${files.length}`);
  console.log(`  Original:    ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Compressed:  ${(totalCompressed / 1024 / 1024).toFixed(2)} MB`);
  
  if (totalOriginal > 0) {
    const overallRatio = ((1 - totalCompressed / totalOriginal) * 100).toFixed(1);
    console.log(`  Savings:     ${overallRatio}%`);
  }
  
  console.log('='.repeat(60));
  
  if (failCount > 0) {
    console.log('\n⚠️  Some conversions failed. Check errors above.');
  }
  
  console.log('\n✨ Done! Textures are in:', config.outputDir);
  console.log('\nNext steps:');
  console.log('  1. Copy BasisU transcoder to public/basis/');
  console.log('  2. Use loadTexture() from assetPipeline in your components');
  console.log('  3. Test with: npm run dev');
}

main();
