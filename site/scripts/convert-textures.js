#!/usr/bin/env node

/**
 * Texture Conversion Script
 * Converts PNG/WebP textures to KTX2 format with BasisU compression
 * Supports ETC1S and UASTC compression modes with progress reporting
 * 
 * Usage:
 *   node scripts/convert-textures.js [options]
 * 
 * Options:
 *   --source=<dir>      Source texture directory (default: public/assets)
 *   --output=<dir>      Output directory (default: public/textures)
 *   --quality=<level>   Compression quality: etc1s, uastc, uastc-max (default: etc1s)
 *   --max-size=<px>     Maximum texture dimension (default: 2048)
 *   --no-webp           Skip WebP fallback generation
 *   --no-png            Skip PNG fallback generation
 *   --verbose           Show detailed conversion logs
 *   --dry-run           Preview without writing files
 *   --help, -h          Show help
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  sourceDir: process.argv.find(arg => arg.startsWith('--source='))?.split('=')[1] || 'public/assets',
  outputDir: process.argv.find(arg => arg.startsWith('--output='))?.split('=')[1] || 'public/textures',
  quality: process.argv.find(arg => arg.startsWith('--quality='))?.split('=')[1] || 'etc1s',
  maxSize: parseInt(process.argv.find(arg => arg.startsWith('--max-size='))?.split('=')[1] || '2048', 10),
  generateWebP: !process.argv.includes('--no-webp'),
  generatePNG: !process.argv.includes('--no-png'),
  verbose: process.argv.includes('--verbose'),
  dryRun: process.argv.includes('--dry-run'),
  formats: ['.png', '.jpg', '.jpeg', '.webp'],
};

// Compression quality presets
const QUALITY_PRESETS = {
  'etc1s': {
    args: '--bcmp --clevel 4 --qlevel 128',
    description: '~80% compression, good for diffuse/albedo textures',
  },
  'uastc': {
    args: '--uastc 2 --uastc_rdo_l 0.5',
    description: '~60% compression, best for normal maps and detail',
  },
  'uastc-max': {
    args: '--uastc 4 --uastc_rdo_l 0.1',
    description: '~40% compression, maximum visual fidelity',
  },
};

// Show help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🎨 Texture Conversion Tool for KTX2/BasisU

Usage:
  node scripts/convert-textures.js [options]

Options:
  --source=<path>       Source directory (default: public/assets)
  --output=<path>       Output directory (default: public/textures)
  --quality=<mode>      Compression quality: etc1s, uastc, uastc-max (default: etc1s)
  --max-size=<pixels>   Maximum texture dimension (default: 2048)
  --no-webp             Skip WebP fallback generation
  --no-png              Skip PNG fallback generation
  --verbose             Show detailed conversion logs
  --dry-run             Preview without writing files
  --help, -h            Show this help message

Quality Modes:
  etc1s       ~80% compression, good quality (diffuse, albedo, UI)
  uastc       ~60% compression, high quality (normal maps, detail)
  uastc-max   ~40% compression, maximum quality (hero textures)

Examples:
  # Convert all textures with default settings
  node scripts/convert-textures.js

  # High quality conversion for normal maps
  node scripts/convert-textures.js --quality=uastc --source=public/assets/normals

  # Preview without writing files
  node scripts/convert-textures.js --dry-run --verbose

Requirements:
  - toktx (KTX-Software): https://github.com/KhronosGroup/KTX-Software
  - Optional: sharp or imagemagick for WebP/PNG processing
  `);
  process.exit(0);
}

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

// Format file size
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

// Progress bar display
function logProgress(current, total, filename) {
  const percentage = Math.round((current / total) * 100);
  const bar = '█'.repeat(Math.floor(percentage / 2)) + '░'.repeat(50 - Math.floor(percentage / 2));
  process.stdout.write(`\r[${bar}] ${percentage}% - ${filename.slice(0, 40).padEnd(40)}`);
}

// Convert texture to KTX2
function convertTexture(inputPath, outputPath) {
  const outputDir = path.dirname(outputPath);
  
  // Create output directory if it doesn't exist
  if (!config.dryRun && !fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const basePath = outputPath.replace(/\.ktx2$/, '');
  const webpPath = `${basePath}.webp`;
  const pngPath = `${basePath}.png`;
  
  const results = {
    success: true,
    input: inputPath,
    output: outputPath,
    originalSize: 0,
    ktx2Size: 0,
    webpSize: 0,
    pngSize: 0,
    compressionRatio: 0,
    error: null,
  };
  
  try {
    // Get original size
    results.originalSize = fs.statSync(inputPath).size;
    
    // Determine compression settings
    const isNormalMap = inputPath.includes('normal') || inputPath.includes('_n.');
    const preset = QUALITY_PRESETS[config.quality] || QUALITY_PRESETS['etc1s'];
    
    // Build toktx command
    let cmd = `toktx ${preset.args}`;
    
    // Additional flags
    cmd += ' --t2'; // KTX2 format
    cmd += ` --resize ${config.maxSize}x${config.maxSize}`;
    cmd += ' --mipmap'; // Generate mipmaps
    
    if (isNormalMap) {
      cmd += ' --normal_map';
    }
    
    cmd += ` "${outputPath}"`;
    cmd += ` "${inputPath}"`;
    
    if (config.verbose) {
      console.log(`\n  Command: ${cmd}`);
    }
    
    // Convert to KTX2
    if (!config.dryRun) {
      execSync(cmd, { stdio: config.verbose ? 'inherit' : 'pipe' });
      results.ktx2Size = fs.statSync(outputPath).size;
    }
    
    // Create WebP fallback
    if (config.generateWebP && !config.dryRun) {
      try {
        const sharp = require('sharp');
        sharp(inputPath)
          .webp({ quality: 90, effort: 6 })
          .resize(config.maxSize, config.maxSize, { fit: 'inside', withoutEnlargement: true })
          .toFile(webpPath)
          .then(() => {
            results.webpSize = fs.statSync(webpPath).size;
          })
          .catch(() => {});
      } catch {
        // Try imagemagick
        try {
          const convertCmd = `convert "${inputPath}" -resize ${config.maxSize}x${config.maxSize}\\> -quality 90 "${webpPath}"`;
          execSync(convertCmd, { stdio: 'pipe' });
          results.webpSize = fs.statSync(webpPath).size;
        } catch {
          if (config.verbose) {
            console.log('  WebP conversion skipped (sharp/imagemagick not available)');
          }
        }
      }
    }
    
    // Copy PNG fallback
    if (config.generatePNG && !config.dryRun) {
      try {
        const sharp = require('sharp');
        sharp(inputPath)
          .resize(config.maxSize, config.maxSize, { fit: 'inside', withoutEnlargement: true })
          .png({ quality: 100, compressionLevel: 9 })
          .toFile(pngPath)
          .then(() => {
            results.pngSize = fs.statSync(pngPath).size;
          })
          .catch(() => {
            fs.copyFileSync(inputPath, pngPath);
            results.pngSize = fs.statSync(pngPath).size;
          });
      } catch {
        fs.copyFileSync(inputPath, pngPath);
        if (!config.dryRun) {
          results.pngSize = fs.statSync(pngPath).size;
        }
      }
    }
    
    if (!config.dryRun && results.ktx2Size > 0) {
      results.compressionRatio = ((1 - results.ktx2Size / results.originalSize) * 100).toFixed(1);
    }
    
    return results;
  } catch (err) {
    return {
      success: false,
      input: inputPath,
      error: err.message,
      originalSize: results.originalSize,
      ktx2Size: 0,
      webpSize: 0,
      pngSize: 0,
      compressionRatio: 0,
    };
  }
}

// Main execution
function main() {
  console.log('\n🎨 Texture Conversion Tool for KTX2/BasisU\n');
  
  if (!checkDependencies()) {
    process.exit(1);
  }

  const preset = QUALITY_PRESETS[config.quality] || QUALITY_PRESETS['etc1s'];

  console.log('Configuration:');
  console.log(`  Source:       ${config.sourceDir}`);
  console.log(`  Output:       ${config.outputDir}`);
  console.log(`  Quality:      ${config.quality} - ${preset.description}`);
  console.log(`  Max Size:     ${config.maxSize}px`);
  console.log(`  Generate:     KTX2${config.generateWebP ? ' + WebP' : ''}${config.generatePNG ? ' + PNG' : ''}`);
  if (config.dryRun) {
    console.log('  Mode:         DRY RUN (no files will be written)');
  }
  console.log('');

  const files = getTextureFiles(config.sourceDir);
  
  if (files.length === 0) {
    console.log('❌ No texture files found in', config.sourceDir);
    process.exit(0);
  }

  console.log(`Found ${files.length} texture(s) to convert\n`);

  const results = [];
  let successCount = 0;
  let failCount = 0;
  let totalOriginal = 0;
  let totalKTX2 = 0;
  let totalWebP = 0;
  let totalPNG = 0;

  files.forEach((file, index) => {
    const outputPath = path.join(
      config.outputDir,
      file.relative.replace(/\.[^.]+$/, '.ktx2')
    );
    
    const baseName = path.basename(file.relative);
    logProgress(index + 1, files.length, baseName);
    
    if (config.verbose) {
      console.log(`\n\nProcessing [${index + 1}/${files.length}]: ${file.relative}`);
    }
    
    const result = convertTexture(file.input, outputPath);
    results.push(result);
    
    if (result.success) {
      successCount++;
      totalOriginal += result.originalSize;
      totalKTX2 += result.ktx2Size;
      totalWebP += result.webpSize;
      totalPNG += result.pngSize;
      
      if (!config.verbose) {
        // Brief success indicator
      }
    } else {
      failCount++;
      if (!config.verbose) {
        console.log(`\n✗ Failed: ${file.relative} - ${result.error}`);
      }
    }
  });

  // Clear progress line
  process.stdout.write('\r' + ' '.repeat(80) + '\r');

  console.log('\n' + '='.repeat(60));
  console.log('✓ Conversion Complete!');
  console.log('='.repeat(60));
  console.log(`  Processed:       ${successCount}/${files.length} textures`);
  if (failCount > 0) {
    console.log(`  Failed:          ${failCount}`);
  }
  console.log(`  Original size:   ${formatBytes(totalOriginal)}`);
  
  if (totalKTX2 > 0) {
    const ktx2Savings = ((1 - totalKTX2 / totalOriginal) * 100).toFixed(1);
    console.log(`  KTX2 size:       ${formatBytes(totalKTX2)} (${ktx2Savings}% smaller)`);
  }
  
  if (totalWebP > 0) {
    const webpSavings = ((1 - totalWebP / totalOriginal) * 100).toFixed(1);
    console.log(`  WebP size:       ${formatBytes(totalWebP)} (${webpSavings}% smaller)`);
  }
  
  if (totalPNG > 0) {
    console.log(`  PNG size:        ${formatBytes(totalPNG)}`);
  }
  
  const totalOutputSize = totalKTX2 + totalWebP + totalPNG;
  console.log('='.repeat(60));
  
  if (totalOutputSize <= 12 * 1024 * 1024) {
    console.log(`✓ Total output size: ${formatBytes(totalOutputSize)} (within 12 MB budget)`);
  } else {
    const overBudget = formatBytes(totalOutputSize - 12 * 1024 * 1024);
    console.log(`⚠ Total output size: ${formatBytes(totalOutputSize)} (${overBudget} over 12 MB budget)`);
  }
  
  console.log('\n✨ Done! Textures are in:', config.outputDir);
  console.log('\nNext steps:');
  console.log('  1. Copy BasisU transcoder to public/basis/');
  console.log('  2. Update components to use useKTX2Texture() hook');
  console.log('  3. Test in browser: npm run dev');
  console.log('  4. Verify visual quality (ΔE < 3)');
  console.log('  5. Run performance benchmarks\n');
}

main();
