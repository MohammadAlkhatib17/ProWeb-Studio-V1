#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.resolve(__dirname, '../public/assets');

async function getFileSize(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 KB';
  const kb = bytes / 1024;
  return `${Math.round(kb)}KB`;
}

async function validateImageOptimization() {
  console.log('🔍 Validating image optimization...\n');
  
  const images = [
    {
      name: 'Hero Portal Background',
      base: 'hero_portal_background',
      originalDimensions: '1920x1080'
    },
    {
      name: 'Team Core Star',
      base: 'team_core_star', 
      originalDimensions: '800x800'
    }
  ];
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let aboveFoldSize = 0;
  
  for (const image of images) {
    console.log(`📸 ${image.name} (${image.originalDimensions})`);
    
    // Check original PNG
    const pngPath = path.join(assetsDir, `${image.base}.png`);
    const pngSize = await getFileSize(pngPath);
    totalOriginalSize += pngSize;
    
    console.log(`   Original PNG: ${formatBytes(pngSize)}`);
    
    // Check optimized formats
    const avifPath = path.join(assetsDir, `${image.base}.avif`);
    const webpPath = path.join(assetsDir, `${image.base}.webp`);
    
    const avifSize = await getFileSize(avifPath);
    const webpSize = await getFileSize(webpPath);
    
    if (avifSize > 0) {
      console.log(`   Optimized AVIF: ${formatBytes(avifSize)} (${Math.round(((pngSize - avifSize) / pngSize) * 100)}% smaller)`);
      totalOptimizedSize += avifSize;
      aboveFoldSize += avifSize; // Assuming both are above-the-fold
    }
    
    if (webpSize > 0) {
      console.log(`   Optimized WebP: ${formatBytes(webpSize)} (${Math.round(((pngSize - webpSize) / pngSize) * 100)}% smaller)`);
    }
    
    // Check responsive variants
    const sizes = [320, 640, 750, 828, 1080, 1200, 1920];
    let responsiveAvifSize = 0;
    let responsiveWebpSize = 0;
    let responsiveCount = 0;
    
    for (const size of sizes) {
      const responsiveAvif = path.join(assetsDir, `${image.base}-${size}w.avif`);
      const responsiveWebp = path.join(assetsDir, `${image.base}-${size}w.webp`);
      
      const avifResponsiveSize = await getFileSize(responsiveAvif);
      const webpResponsiveSize = await getFileSize(responsiveWebp);
      
      if (avifResponsiveSize > 0) {
        responsiveAvifSize += avifResponsiveSize;
        responsiveCount++;
      }
      if (webpResponsiveSize > 0) {
        responsiveWebpSize += webpResponsiveSize;
      }
    }
    
    if (responsiveCount > 0) {
      console.log(`   Responsive AVIF variants: ${responsiveCount} files, ${formatBytes(responsiveAvifSize)} total`);
      console.log(`   Responsive WebP variants: ${responsiveCount} files, ${formatBytes(responsiveWebpSize)} total`);
    }
    
    console.log('');
  }
  
  // Performance metrics
  console.log('📊 Performance Summary:');
  console.log(`   Total original size: ${formatBytes(totalOriginalSize)}`);
  console.log(`   Total optimized size (AVIF): ${formatBytes(totalOptimizedSize)}`);
  console.log(`   Total savings: ${formatBytes(totalOriginalSize - totalOptimizedSize)} (${Math.round(((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) * 100)}%)`);
  console.log(`   Above-the-fold image size: ${formatBytes(aboveFoldSize)}`);
  
  // Check acceptance criteria
  console.log('\n✅ Acceptance Criteria Check:');
  
  const maxAboveFoldSize = 250 * 1024; // 250 KB
  if (aboveFoldSize <= maxAboveFoldSize) {
    console.log(`   ✅ Above-the-fold images ≤ 250 KB: ${formatBytes(aboveFoldSize)}`);
  } else {
    console.log(`   ❌ Above-the-fold images > 250 KB: ${formatBytes(aboveFoldSize)}`);
  }
  
  // Check Next.js configuration
  console.log('\n🔧 Next.js Image Configuration:');
  try {
    const configPath = path.resolve(__dirname, '../next.config.mjs');
    const configContent = await fs.readFile(configPath, 'utf8');
    
    if (configContent.includes("'image/avif'")) {
      console.log('   ✅ AVIF format enabled in Next.js config');
    } else {
      console.log('   ❌ AVIF format not found in Next.js config');
    }
    
    if (configContent.includes("'image/webp'")) {
      console.log('   ✅ WebP format enabled in Next.js config');
    } else {
      console.log('   ❌ WebP format not found in Next.js config');
    }
    
    const deviceSizes = configContent.match(/deviceSizes:\s*\[([\d\s,]+)\]/);
    if (deviceSizes) {
      console.log(`   ✅ Device sizes configured: [${deviceSizes[1].trim()}]`);
    }
    
  } catch (error) {
    console.log('   ⚠️  Could not read Next.js config');
  }
  
  console.log('\n🚀 Recommendations:');
  console.log('   1. Run Lighthouse audit to verify LCP ≤ 2.0s');
  console.log('   2. Test bundle size impact with `npm run analyze`');
  console.log('   3. Monitor Core Web Vitals in production');
  console.log('   4. Consider lazy loading for below-the-fold images');
}

validateImageOptimization().catch(console.error);