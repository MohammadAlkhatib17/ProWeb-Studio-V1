#!/usr/bin/env node

import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Optimized settings for above-the-fold images (prioritizing file size over perfect quality)
const QUALITY_AVIF_OPTIMIZED = 75; // Lower quality for smaller size
const QUALITY_WEBP_OPTIMIZED = 85;
const EFFORT_AVIF = 6; // Max compression effort
const EFFORT_WEBP = 6;

// Target maximum size for above-the-fold images
const TARGET_SIZE_KB = 200; // Under 250KB limit with margin

const HERO_IMAGES = [
  {
    input: '../public/assets/hero_portal_background.png',
    baseName: 'hero_portal_background',
    output: 'hero_portal_background-optimized',
    targetWidth: 1440, // Reduce from 1920 for mobile-first
    targetHeight: 810   // Maintain aspect ratio
  },
  {
    input: '../public/assets/glowing_beacon_contact.avif',
    baseName: 'glowing_beacon_contact',
    output: 'glowing_beacon_contact-optimized', 
    targetWidth: 1440,
    targetHeight: 810
  },
  {
    input: '../public/assets/nebula_services_background.avif',
    baseName: 'nebula_services_background',
    output: 'nebula_services_background-optimized',
    targetWidth: 1440,
    targetHeight: 810
  }
];

async function optimizeForAboveFold(inputPath, outputDir, outputName, targetWidth, targetHeight) {
  const results = [];
  
  try {
    // Generate highly optimized AVIF
    const avifPath = path.join(outputDir, `${outputName}.avif`);
    
    let sharpInstance = sharp(inputPath)
      .resize(targetWidth, targetHeight, {
        fit: 'cover',
        position: 'center'
      })
      .avif({
        quality: QUALITY_AVIF_OPTIMIZED,
        effort: EFFORT_AVIF,
        chromaSubsampling: '4:2:0' // More aggressive compression
      });
    
    await sharpInstance.toFile(avifPath);
    
    const stats = await fs.stat(avifPath);
    const sizeKB = Math.round(stats.size / 1024);
    
    results.push({
      format: 'avif',
      filename: `${outputName}.avif`,
      bytes: stats.size,
      kb: sizeKB,
      dimensions: `${targetWidth}x${targetHeight}`
    });
    
    console.log(`✅ Generated optimized ${outputName}.avif (${sizeKB}KB) at ${targetWidth}x${targetHeight}`);
    
    // Generate WebP fallback
    const webpPath = path.join(outputDir, `${outputName}.webp`);
    
    await sharp(inputPath)
      .resize(targetWidth, targetHeight, {
        fit: 'cover',
        position: 'center'
      })
      .webp({
        quality: QUALITY_WEBP_OPTIMIZED,
        effort: EFFORT_WEBP,
        method: 6
      })
      .toFile(webpPath);
    
    const webpStats = await fs.stat(webpPath);
    const webpSizeKB = Math.round(webpStats.size / 1024);
    
    results.push({
      format: 'webp',
      filename: `${outputName}.webp`, 
      bytes: webpStats.size,
      kb: webpSizeKB,
      dimensions: `${targetWidth}x${targetHeight}`
    });
    
    console.log(`✅ Generated optimized ${outputName}.webp (${webpSizeKB}KB) at ${targetWidth}x${targetHeight}`);
    
  } catch (error) {
    console.error(`❌ Error optimizing ${outputName}:`, error.message);
  }
  
  return results;
}

async function main() {
  console.log('🎯 Generating above-the-fold optimized images...\n');
  console.log(`Target: Each image under ${TARGET_SIZE_KB}KB for LCP optimization\n`);
  
  const outputDir = path.resolve(__dirname, '../public/assets');
  let totalGeneratedSize = 0;
  
  for (const image of HERO_IMAGES) {
    const inputPath = path.resolve(__dirname, image.input);
    
    console.log(`📸 Processing: ${image.baseName}`);
    console.log(`   Input: ${inputPath}`);
    console.log(`   Target dimensions: ${image.targetWidth}x${image.targetHeight}`);
    
    try {
      // Check if input exists
      await fs.access(inputPath);
      
      const results = await optimizeForAboveFold(
        inputPath, 
        outputDir, 
        image.output, 
        image.targetWidth, 
        image.targetHeight
      );
      
      const avifResult = results.find(r => r.format === 'avif');
      if (avifResult) {
        totalGeneratedSize += avifResult.bytes;
        
        if (avifResult.kb <= TARGET_SIZE_KB) {
          console.log(`   ✅ Within target size: ${avifResult.kb}KB ≤ ${TARGET_SIZE_KB}KB`);
        } else {
          console.log(`   ⚠️  Over target size: ${avifResult.kb}KB > ${TARGET_SIZE_KB}KB`);
        }
      }
      
      console.log('');
      
    } catch (error) {
      console.error(`❌ Could not process ${image.baseName}: ${error.message}\n`);
    }
  }
  
  console.log('📊 Summary:');
  console.log(`   Total optimized AVIF size: ${Math.round(totalGeneratedSize / 1024)}KB`);
  console.log(`   Average per image: ${Math.round(totalGeneratedSize / (HERO_IMAGES.length * 1024))}KB`);
  
  console.log('\n🔧 Next steps:');
  console.log('   1. Update image preloader to use optimized versions');
  console.log('   2. Update component imports to use optimized files');
  console.log('   3. Test with Lighthouse mobile audit');
  console.log('   4. Verify LCP ≤ 2.0s on 3G connection');
}

main().catch(console.error);