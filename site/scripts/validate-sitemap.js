#!/usr/bin/env node

/**
 * Sitemap Validation Script
 * 
 * Tests the segmented sitemap implementation locally
 * Run with: node scripts/validate-sitemap.js
 */

import {
  generatePagesSegment,
  generateServicesSegment,
  generateLocationsSegment,
  generateCompleteSitemap,
  validateSitemapEntries,
  getSitemapStats,
} from '../src/lib/sitemap-advanced.ts';

console.log('🔍 Validating Sitemap Implementation\n');

// Generate segments
const pages = generatePagesSegment();
const services = generateServicesSegment();
const locations = generateLocationsSegment();
const complete = generateCompleteSitemap();

// Get stats
const stats = getSitemapStats();

console.log('📊 Sitemap Statistics:');
console.log(`   Total URLs: ${stats.total}`);
console.log(`   - Pages: ${stats.pages}`);
console.log(`   - Services: ${stats.services}`);
console.log(`   - Locations: ${stats.locations}\n`);

// Validate each segment
console.log('✅ Validating Pages Segment:');
const pagesValidation = validateSitemapEntries(pages);
if (pagesValidation.valid) {
  console.log('   ✓ Pages segment is valid');
} else {
  console.log('   ✗ Pages segment has errors:');
  pagesValidation.errors.forEach(err => console.log(`     - ${err}`));
}

console.log('\n✅ Validating Services Segment:');
const servicesValidation = validateSitemapEntries(services);
if (servicesValidation.valid) {
  console.log('   ✓ Services segment is valid');
} else {
  console.log('   ✗ Services segment has errors:');
  servicesValidation.errors.forEach(err => console.log(`     - ${err}`));
}

console.log('\n✅ Validating Locations Segment:');
const locationsValidation = validateSitemapEntries(locations);
if (locationsValidation.valid) {
  console.log('   ✓ Locations segment is valid');
} else {
  console.log('   ✗ Locations segment has errors:');
  locationsValidation.errors.forEach(err => console.log(`     - ${err}`));
}

console.log('\n✅ Validating Complete Sitemap:');
const completeValidation = validateSitemapEntries(complete);
if (completeValidation.valid) {
  console.log('   ✓ Complete sitemap is valid');
} else {
  console.log('   ✗ Complete sitemap has errors:');
  completeValidation.errors.forEach(err => console.log(`     - ${err}`));
}

// Check for duplicates
console.log('\n🔎 Checking for Duplicate URLs:');
const urls = complete.map(entry => entry.url);
const uniqueUrls = new Set(urls);
if (urls.length === uniqueUrls.size) {
  console.log('   ✓ No duplicate URLs found');
} else {
  console.log(`   ✗ Found ${urls.length - uniqueUrls.size} duplicate(s)`);
  const duplicates = urls.filter((url, index) => urls.indexOf(url) !== index);
  duplicates.forEach(url => console.log(`     - ${url}`));
}

// Check priority distribution
console.log('\n📈 Priority Distribution:');
const priorities = complete.reduce((acc, entry) => {
  const key = entry.priority.toString();
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {});
Object.entries(priorities)
  .sort(([a], [b]) => parseFloat(b) - parseFloat(a))
  .forEach(([priority, count]) => {
    console.log(`   ${priority}: ${count} URL(s)`);
  });

// Check change frequency distribution
console.log('\n📅 Change Frequency Distribution:');
const frequencies = complete.reduce((acc, entry) => {
  acc[entry.changeFrequency] = (acc[entry.changeFrequency] || 0) + 1;
  return acc;
}, {});
Object.entries(frequencies)
  .sort(([, a], [, b]) => b - a)
  .forEach(([freq, count]) => {
    console.log(`   ${freq}: ${count} URL(s)`);
  });

// Sample URLs
console.log('\n🔗 Sample URLs:');
console.log(`   Home: ${complete[0].url}`);
console.log(`   Service: ${services[0]?.url || 'N/A'}`);
console.log(`   Location: ${locations[1]?.url || 'N/A'}`);

// Overall status
console.log('\n' + '='.repeat(50));
if (
  pagesValidation.valid &&
  servicesValidation.valid &&
  locationsValidation.valid &&
  completeValidation.valid &&
  urls.length === uniqueUrls.size
) {
  console.log('✅ All validations passed! Sitemap is ready for production.');
} else {
  console.log('❌ Some validations failed. Please fix errors above.');
  process.exit(1);
}
