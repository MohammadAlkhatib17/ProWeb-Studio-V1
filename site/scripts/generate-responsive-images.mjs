#!/usr/bin/env node

import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Responsive breakpoints aligned with Next.js deviceSizes
const RESPONSIVE_SIZES = [320, 640, 750, 828, 1080, 1200, 1920];
const QUALITY_AVIF = 85; // Higher quality for better visual fidelity
const QUALITY_WEBP = 90; // Slightly higher for WebP
const EFFORT_AVIF = 6; // Maximum compression effort
const EFFORT_WEBP = 6; // Maximum compression effort

const IMAGES_TO_PROCESS = [
  {
    input: '../public/assets/hero_portal_background.png',
    baseName: 'hero_portal_background',
    width: 1920,
    height: 1080
  },
  {
    input: '../public/assets/team_core_star.png', 
    baseName: 'team_core_star',
    width: 800,
    height: 800
  }
];

async function generateResponsiveImage(inputPath, outputDir, baseName, format, originalWidth, originalHeight) {
  const results = [];
  
  for (const size of RESPONSIVE_SIZES) {
    // Skip sizes larger than original for upscaling prevention
    if (size > originalWidth) continue;
    
    // Calculate proportional height maintaining aspect ratio
    const aspectRatio = originalHeight / originalWidth;
    const height = Math.round(size * aspectRatio);
    
    const outputFileName = `${baseName}-${size}w.${format}`;
    const outputPath = path.join(outputDir, outputFileName);
    
    try {
      let sharpInstance = sharp(inputPath)
        .resize(size, height, {
          fit: 'cover',
          position: 'center'
        });
      
      if (format === 'avif') {
        sharpInstance = sharpInstance.avif({
          quality: QUALITY_AVIF,
          effort: EFFORT_AVIF,
          chromaSubsampling: '4:4:4' // Better quality
        });
      } else if (format === 'webp') {
        sharpInstance = sharpInstance.webp({
          quality: QUALITY_WEBP,
          effort: EFFORT_WEBP,
          method: 6 // Best compression
        });
      }
      
      await sharpInstance.toFile(outputPath);
      
      const stats = await fs.stat(outputPath);
      results.push({
        size,
        format,
        filename: outputFileName,
        bytes: stats.size,
        kb: Math.round(stats.size / 1024)
      });
      
      console.log(`✅ Generated ${outputFileName} (${Math.round(stats.size / 1024)}KB)`);
    } catch (error) {
      console.error(`❌ Error generating ${outputFileName}:`, error.message);
    }
  }
  
  return results;
}

async function generateBaseFormats(inputPath, outputDir, baseName, originalWidth, originalHeight) {
  const results = [];
  
  // Generate base AVIF
  const avifPath = path.join(outputDir, `${baseName}.avif`);
  try {
    await sharp(inputPath)
      .avif({
        quality: QUALITY_AVIF,
        effort: EFFORT_AVIF,
        chromaSubsampling: '4:4:4'
      })
      .toFile(avifPath);
    
    const stats = await fs.stat(avifPath);
    results.push({
      format: 'avif',
      filename: `${baseName}.avif`,
      bytes: stats.size,
      kb: Math.round(stats.size / 1024)
    });
    console.log(`✅ Generated ${baseName}.avif (${Math.round(stats.size / 1024)}KB)`);
  } catch (error) {
    console.error(`❌ Error generating ${baseName}.avif:`, error.message);
  }
  
  // Generate base WebP
  const webpPath = path.join(outputDir, `${baseName}.webp`);
  try {
    await sharp(inputPath)
      .webp({
        quality: QUALITY_WEBP,
        effort: EFFORT_WEBP,
        method: 6
      })
      .toFile(webpPath);
    
    const stats = await fs.stat(webpPath);
    results.push({
      format: 'webp',
      filename: `${baseName}.webp`,
      bytes: stats.size,
      kb: Math.round(stats.size / 1024)
    });
    console.log(`✅ Generated ${baseName}.webp (${Math.round(stats.size / 1024)}KB)`);
  } catch (error) {
    console.error(`❌ Error generating ${baseName}.webp:`, error.message);
  }
  
  return results;
}

async function main() {
  console.log('🚀 Generating responsive optimized images...\n');
  
  const outputDir = path.resolve(__dirname, '../public/assets');
  let totalSaved = 0;
  
  for (const image of IMAGES_TO_PROCESS) {
    const inputPath = path.resolve(__dirname, image.input);
    
    console.log(`\n📸 Processing: ${image.baseName}`);
    console.log(`   Input: ${inputPath}`);
    console.log(`   Dimensions: ${image.width}x${image.height}`);
    
    try {
      // Check original file size
      const originalStats = await fs.stat(inputPath);
      const originalSizeKB = Math.round(originalStats.size / 1024);
      console.log(`   Original PNG: ${originalSizeKB}KB\n`);
      
      // Generate base formats (for existing components)
      const baseResults = await generateBaseFormats(inputPath, outputDir, image.baseName, image.width, image.height);
      
      // Generate responsive sizes for modern usage
      const avifResults = await generateResponsiveImage(inputPath, outputDir, image.baseName, 'avif', image.width, image.height);
      const webpResults = await generateResponsiveImage(inputPath, outputDir, image.baseName, 'webp', image.width, image.height);
      
      // Calculate savings
      const totalOptimizedSize = [...baseResults, ...avifResults, ...webpResults]
        .reduce((sum, result) => sum + result.bytes, 0);
      const savedBytes = originalStats.size - (baseResults.find(r => r.format === 'avif')?.bytes || 0);
      const savedPercentage = Math.round((savedBytes / originalStats.size) * 100);
      totalSaved += savedBytes;
      
      console.log(`\n   💾 Compression summary for ${image.baseName}:`);
      console.log(`      Original PNG: ${originalSizeKB}KB`);
      if (baseResults.find(r => r.format === 'avif')) {
        console.log(`      Optimized AVIF: ${baseResults.find(r => r.format === 'avif').kb}KB (${savedPercentage}% smaller)`);
      }
      if (baseResults.find(r => r.format === 'webp')) {
        console.log(`      Optimized WebP: ${baseResults.find(r => r.format === 'webp').kb}KB`);
      }
      console.log(`      Responsive variants: ${avifResults.length + webpResults.length} files generated`);
      
    } catch (error) {
      console.error(`❌ Error processing ${image.baseName}:`, error.message);
    }
  }
  
  console.log(`\n🎉 Image optimization complete!`);
  console.log(`💾 Total space saved: ${Math.round(totalSaved / 1024)}KB`);
  console.log(`\n🔧 Next steps:`);
  console.log(`   1. Update components to use Next.js Image component`);
  console.log(`   2. Add responsive sizes and priority props`);
  console.log(`   3. Test with Lighthouse for performance validation`);
}

main().catch(console.error);