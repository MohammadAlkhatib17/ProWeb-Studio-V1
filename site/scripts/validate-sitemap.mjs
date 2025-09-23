#!/usr/bin/env node

/**
 * Sitemap validation script for ProWeb Studio
 * Validates the sitemap against Google's requirements and best practices
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the sitemap functions (requires compilation)
async function validateSitemapGeneration() {
  console.log('🔍 Validating ProWeb Studio Sitemap Implementation\n');
  
  try {
    // Import sitemap module (this will need to be built first)
    const sitemapModule = await import('../src/app/sitemap.ts');
    
    console.log('✓ Sitemap module loaded successfully');
    
    // Generate sitemap
    const sitemap = await sitemapModule.default();
    console.log(`✓ Generated sitemap with ${sitemap.length} URLs`);
    
    // Validate sitemap
    const validation = sitemapModule.validateSitemap(sitemap);
    
    if (validation.isValid) {
      console.log('✅ Sitemap validation PASSED');
    } else {
      console.log('❌ Sitemap validation FAILED');
      validation.errors.forEach(error => {
        console.log(`   ERROR: ${error}`);
      });
    }
    
    if (validation.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      validation.warnings.forEach(warning => {
        console.log(`   WARNING: ${warning}`);
      });
    }
    
    // Check if sitemap index is needed
    const sitemapIndex = await sitemapModule.generateSitemapIndex();
    if (sitemapIndex) {
      console.log('\n📋 Sitemap index generated (large sitemap detected)');
    } else {
      console.log('\n📄 Single sitemap file is sufficient');
    }
    
    // Analyze URL distribution
    console.log('\n📊 URL Analysis:');
    const priorities = {};
    const changeFreqs = {};
    
    sitemap.forEach(entry => {
      const priority = entry.priority || 0;
      const changeFreq = entry.changeFrequency || 'unknown';
      
      priorities[priority] = (priorities[priority] || 0) + 1;
      changeFreqs[changeFreq] = (changeFreqs[changeFreq] || 0) + 1;
    });
    
    console.log('   Priority distribution:');
    Object.entries(priorities)
      .sort(([a], [b]) => parseFloat(b) - parseFloat(a))
      .forEach(([priority, count]) => {
        console.log(`     ${priority}: ${count} URLs`);
      });
    
    console.log('   Change frequency distribution:');
    Object.entries(changeFreqs).forEach(([freq, count]) => {
      console.log(`     ${freq}: ${count} URLs`);
    });
    
    // Show sample URLs by category
    console.log('\n🔗 Sample URLs by category:');
    
    const categories = {
      'Core Pages (1.0)': sitemap.filter(entry => entry.priority === 1.0),
      'Services (0.95)': sitemap.filter(entry => entry.priority === 0.95),
      'High Priority (0.9)': sitemap.filter(entry => entry.priority === 0.9),
      'Major Cities (0.8)': sitemap.filter(entry => entry.priority === 0.8 && entry.url.includes('/locaties/')),
      'Other Locations (0.7)': sitemap.filter(entry => entry.priority === 0.7),
    };
    
    Object.entries(categories).forEach(([category, urls]) => {
      if (urls.length > 0) {
        console.log(`   ${category}: ${urls.length} URLs`);
        urls.slice(0, 3).forEach(url => {
          console.log(`     - ${url.url}`);
        });
        if (urls.length > 3) {
          console.log(`     ... and ${urls.length - 3} more`);
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Error validating sitemap:', error.message);
    process.exit(1);
  }
}

// Google Sitemap Requirements Checklist
function printGoogleRequirements() {
  console.log('\n📋 Google Sitemap Requirements Checklist:');
  console.log('   ✓ Use absolute URLs with protocol (https://)');
  console.log('   ✓ Maximum 50,000 URLs per sitemap file');
  console.log('   ✓ Maximum 50MB uncompressed size per sitemap');
  console.log('   ✓ Priority values between 0.0 and 1.0');
  console.log('   ✓ Valid lastModified dates (not in future)');
  console.log('   ✓ No duplicate URLs');
  console.log('   ✓ Valid URL format and length (< 2048 chars)');
  console.log('   ✓ Proper XML encoding (UTF-8)');
  console.log('\n📈 SEO Best Practices:');
  console.log('   ✓ Homepage priority: 1.0');
  console.log('   ✓ Key business pages: 0.9+');
  console.log('   ✓ Location pages for local SEO');
  console.log('   ✓ Service pages for business keywords');
  console.log('   ✓ Regular update frequency for dynamic content');
  console.log('   ✓ Realistic lastModified dates based on file changes');
}

// Manual validation checklist
function printManualChecklist() {
  console.log('\n✅ Manual Validation Checklist:');
  console.log('   □ Submit sitemap to Google Search Console');
  console.log('   □ Monitor indexing status in GSC');
  console.log('   □ Check for crawl errors');
  console.log('   □ Verify robots.txt allows sitemap');
  console.log('   □ Test sitemap URL accessibility');
  console.log('   □ Validate XML format in browser/validator');
  console.log('   □ Compare indexed pages vs sitemap URLs');
  console.log('\n🔧 Next Steps:');
  console.log('   1. Build the Next.js application');
  console.log('   2. Test sitemap at /sitemap.xml');
  console.log('   3. Submit to Google Search Console');
  console.log('   4. Monitor indexing progress');
  console.log('   5. Update sitemap when adding new pages');
}

// Main execution
async function main() {
  await validateSitemapGeneration();
  printGoogleRequirements();
  printManualChecklist();
  
  console.log('\n🎉 Sitemap validation complete!');
}

main().catch(console.error);