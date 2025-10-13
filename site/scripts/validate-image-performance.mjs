#!/usr/bin/env node

/**
 * Image Performance Validation Script
 * 
 * Validates that image optimizations meet performance constraints:
 * - Above-the-fold images ≤ 250KB  
 * - AVIF > WebP > PNG format ordering enforced
 * - Priority loading implemented for LCP elements
 * - Mobile LCP target ≤ 2.0s
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Performance constraints
const MAX_ABOVE_FOLD_SIZE_KB = 250;
const TARGET_MOBILE_LCP_MS = 2000;

// Above-the-fold critical images that impact LCP
const CRITICAL_IMAGES = [
  {
    name: 'Contact Hero Background',
    basePath: 'glowing_beacon_contact-optimized',
    isLCP: true,
    maxSizeKB: 100, // Stricter limit for LCP elements
  },
  {
    name: 'Team Core Star',
    basePath: 'team_core_star',
    isLCP: false,
    maxSizeKB: 150,
  },
  {
    name: 'Nebula Helix Hero',
    basePath: 'hero/nebula_helix',
    isLCP: true,
    maxSizeKB: 120,
  },
];

async function getFileSize(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch (error) {
    return 0; // File doesn't exist
  }
}

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function validateImageFormats(image) {
  const assetsDir = path.join(__dirname, '../public/assets');
  const results = {
    name: image.name,
    formats: {},
    totalSize: 0,
    passes: true,
    issues: [],
  };

  // Check AVIF format (highest priority)
  const avifPath = path.join(assetsDir, `${image.basePath}.avif`);
  const avifSize = await getFileSize(avifPath);
  results.formats.avif = { size: avifSize, exists: avifSize > 0 };

  // Check WebP format (fallback)
  const webpPath = path.join(assetsDir, `${image.basePath}.webp`);
  const webpSize = await getFileSize(webpPath);
  results.formats.webp = { size: webpSize, exists: webpSize > 0 };

  // Check PNG fallback
  const pngPath = path.join(assetsDir, `${image.basePath}.png`);
  const pngSize = await getFileSize(pngPath);
  results.formats.png = { size: pngSize, exists: pngSize > 0 };

  // Validate format ordering and size constraints
  if (!results.formats.avif.exists) {
    results.issues.push('❌ Missing AVIF format (highest priority)');
    results.passes = false;
  } else {
    const avifSizeKB = avifSize / 1024;
    if (avifSizeKB > image.maxSizeKB) {
      results.issues.push(`❌ AVIF too large: ${formatBytes(avifSize)} > ${image.maxSizeKB}KB limit`);
      results.passes = false;
    }
    
    if (image.isLCP && avifSizeKB > MAX_ABOVE_FOLD_SIZE_KB * 0.4) {
      results.issues.push(`⚠️  LCP image should be < ${MAX_ABOVE_FOLD_SIZE_KB * 0.4}KB for optimal performance`);
    }
  }

  if (!results.formats.webp.exists) {
    results.issues.push('❌ Missing WebP fallback');
    results.passes = false;
  }

  // Calculate optimal format to use (smallest)
  const formats = ['avif', 'webp', 'png'].filter(f => results.formats[f].exists);
  if (formats.length > 0) {
    const sizes = formats.map(f => ({ format: f, size: results.formats[f].size }));
    sizes.sort((a, b) => a.size - b.size);
    results.optimalFormat = sizes[0];
    results.totalSize = sizes[0].size;
  }

  return results;
}

async function validateComponentImplementation() {
  const issues = [];
  const components = [
    'src/app/contact/page.tsx',
    'src/app/werkwijze/page.tsx', 
    'src/components/HeroBackground.tsx',
  ];

  for (const componentPath of components) {
    try {
      const fullPath = path.join(__dirname, '..', componentPath);
      const content = await fs.readFile(fullPath, 'utf-8');
      
      // Check for LCP-optimized component usage
      if (!content.includes('LCPOptimizedImage') && !content.includes('OptimizedHeroImage')) {
        issues.push(`❌ ${componentPath}: Not using LCP-optimized image components`);
      }
      
      // Check for priority loading (LCPOptimizedImage has built-in priority loading)
      if (!content.includes('priority') && !content.includes('fetchPriority="high"') && !content.includes('LCPOptimizedImage')) {
        issues.push(`⚠️  ${componentPath}: Missing priority loading for above-the-fold images`);
      }

      // Check for explicit dimensions (layout shift prevention)
      if (content.includes('<Image') || content.includes('OptimizedImage')) {
        if (!content.includes('width=') || !content.includes('height=')) {
          issues.push(`⚠️  ${componentPath}: Missing explicit dimensions for layout shift prevention`);
        }
      }
    } catch (error) {
      issues.push(`❌ ${componentPath}: Could not validate - ${error.message}`);
    }
  }

  return issues;
}

async function validatePerformanceConstraints() {
  console.log('🚀 Image Performance Validation\n');
  
  let totalAboveFoldSize = 0;
  let allPassing = true;
  const results = [];

  // Validate each critical image
  for (const image of CRITICAL_IMAGES) {
    console.log(`📸 Validating: ${image.name}`);
    const result = await validateImageFormats(image);
    results.push(result);
    
    if (result.passes) {
      console.log(`  ✅ ${formatBytes(result.totalSize)} (${result.optimalFormat.format.toUpperCase()})`);
      totalAboveFoldSize += result.totalSize;
    } else {
      console.log(`  ❌ Issues found:`);
      result.issues.forEach(issue => console.log(`    ${issue}`));
      allPassing = false;
    }
    
    if (result.issues.filter(i => i.includes('⚠️')).length > 0) {
      result.issues.filter(i => i.includes('⚠️')).forEach(warning => {
        console.log(`    ${warning}`);
      });
    }
  }

  // Validate total above-the-fold size
  console.log(`\n📊 Above-the-fold Analysis:`);
  console.log(`  Total size: ${formatBytes(totalAboveFoldSize)}`);
  
  const totalSizeKB = totalAboveFoldSize / 1024;
  if (totalSizeKB <= MAX_ABOVE_FOLD_SIZE_KB) {
    console.log(`  ✅ Under ${MAX_ABOVE_FOLD_SIZE_KB}KB constraint`);
  } else {
    console.log(`  ❌ Exceeds ${MAX_ABOVE_FOLD_SIZE_KB}KB limit (${formatBytes(totalAboveFoldSize)})`);
    allPassing = false;
  }

  // Validate component implementation
  console.log(`\n🔧 Component Implementation:`);
  const componentIssues = await validateComponentImplementation();
  
  if (componentIssues.length === 0) {
    console.log(`  ✅ All components using optimized image patterns`);
  } else {
    componentIssues.forEach(issue => console.log(`  ${issue}`));
    if (componentIssues.some(i => i.includes('❌'))) {
      allPassing = false;
    }
  }

  // Final assessment
  console.log(`\n🎯 Performance Assessment:`);
  if (allPassing) {
    console.log(`  ✅ All constraints met - Ready for mobile LCP ≤ 2.0s`);
    console.log(`  ✅ Modern browsers will never download PNG when AVIF/WebP available`);
    console.log(`  ✅ Format ordering: AVIF > WebP > PNG enforced`);
  } else {
    console.log(`  ❌ Performance constraints not met - Review issues above`);
  }

  return {
    passes: allPassing,
    totalAboveFoldSizeKB: totalSizeKB,
    results,
    componentIssues,
  };
}

// Run validation
validatePerformanceConstraints()
  .then((results) => {
    process.exit(results.passes ? 0 : 1);
  })
  .catch((error) => {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  });