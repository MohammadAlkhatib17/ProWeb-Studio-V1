/**
 * Content Generation Examples
 * 
 * Demonstrates how to use the CMS content generation system.
 * Run this file to see example output.
 * 
 * Usage:
 *   npx tsx site/src/lib/content/examples.ts
 */

import {
  composeCityServicePage,
  getAllCityServiceCombinations,
  getFeaturedCityServices,
  formatCurrency,
  formatNumber,
  formatPercentage,
  validateAllCityServiceContent,
  getCityServiceSEO,
  getCityServiceStructuredData,
} from './index';

console.log('🎨 ProWeb Studio - Content Generation Examples\n');
console.log('='.repeat(60));

// Example 1: Format Dutch numbers and currency
console.log('\n📊 Example 1: Dutch Formatting');
console.log('-'.repeat(60));
console.log('Currency:', formatCurrency(1234.56));
console.log('Currency (no decimals):', formatCurrency(2500, false));
console.log('Number:', formatNumber(1234567.89));
console.log('Percentage:', formatPercentage(0.875, 1));

// Example 2: Get all available combinations
console.log('\n\n📋 Example 2: All City-Service Combinations');
console.log('-'.repeat(60));
const combinations = getAllCityServiceCombinations();
console.log(`Total combinations: ${combinations.length}\n`);

combinations.slice(0, 5).forEach((combo, index) => {
  console.log(`${index + 1}. ${combo.cityName} × ${combo.serviceName}`);
  console.log(`   Slug: /diensten/${combo.serviceSlug}/${combo.citySlug}`);
  console.log(`   Featured: ${combo.featured ? '⭐' : '  '} | Priority: ${combo.priority}\n`);
});

// Example 3: Get featured combinations
console.log('\n⭐ Example 3: Featured Combinations');
console.log('-'.repeat(60));
const featured = getFeaturedCityServices(3);
featured.forEach((combo, index) => {
  console.log(`${index + 1}. ${combo.cityName} - ${combo.serviceName}`);
});

// Example 4: Generate complete page content
console.log('\n\n📄 Example 4: Generate Page Content for Amsterdam × Website');
console.log('-'.repeat(60));
const page = composeCityServicePage('amsterdam', 'website-laten-maken');

if (page) {
  console.log(`✅ Generated successfully!`);
  console.log(`   Word count: ${page.metadata.wordCount} words`);
  console.log(`   Valid: ${page.metadata.isValid ? '✓' : '✗'}`);
  console.log(`   City: ${page.metadata.city.name}`);
  console.log(`   Service: ${page.metadata.service.name}`);
  console.log(`   Has overrides: ${page.metadata.cityService ? 'Yes' : 'No'}`);
  
  if (page.metadata.cityService) {
    console.log(`   Project count: ${page.metadata.cityService.projectCount || 'N/A'}`);
    console.log(`   Featured: ${page.metadata.cityService.featured ? '⭐' : 'No'}`);
  }
  
  console.log('\n   Content preview (first 300 chars):');
  console.log('   ' + '-'.repeat(58));
  console.log('   ' + page.content.substring(0, 300) + '...');
}

// Example 5: SEO Metadata
console.log('\n\n🔍 Example 5: SEO Metadata for Rotterdam × Webshop');
console.log('-'.repeat(60));
const seo = getCityServiceSEO('rotterdam', 'webshop-laten-maken');

if (seo) {
  console.log(`Title: ${seo.title}`);
  console.log(`Description: ${seo.description}`);
  console.log(`Canonical: ${seo.canonical}`);
  console.log(`Keywords (first 5): ${seo.keywords.slice(0, 5).join(', ')}`);
}

// Example 6: Structured Data
console.log('\n\n📋 Example 6: JSON-LD Structured Data for Utrecht × SEO');
console.log('-'.repeat(60));
const structuredData = getCityServiceStructuredData('utrecht', 'seo-optimalisatie');

if (structuredData) {
  console.log(JSON.stringify(structuredData, null, 2));
}

// Example 7: Validate all content
console.log('\n\n✅ Example 7: Validate All Content');
console.log('-'.repeat(60));
const validation = validateAllCityServiceContent();

console.log(`Total pages: ${validation.total}`);
console.log(`Valid pages: ${validation.valid} ✓`);
console.log(`Invalid pages: ${validation.invalid} ${validation.invalid > 0 ? '✗' : ''}`);

if (validation.invalid > 0) {
  console.log('\n⚠️  Pages with issues:');
  validation.details
    .filter(d => !d.isValid)
    .forEach(detail => {
      console.log(`   - ${detail.citySlug}/${detail.serviceSlug}`);
      console.log(`     Word count: ${detail.wordCount}`);
      console.log(`     Errors: ${detail.errors.join(', ')}`);
    });
} else {
  console.log('\n✅ All pages meet quality requirements!');
}

// Example 8: Word count distribution
console.log('\n\n📊 Example 8: Word Count Distribution');
console.log('-'.repeat(60));
const wordCounts = validation.details.map(d => d.wordCount);
const avgWords = Math.round(wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length);
const minWords = Math.min(...wordCounts);
const maxWords = Math.max(...wordCounts);

console.log(`Average: ${avgWords} words`);
console.log(`Minimum: ${minWords} words`);
console.log(`Maximum: ${maxWords} words`);
console.log(`Target: 350+ words`);

// Summary
console.log('\n\n' + '='.repeat(60));
console.log('✨ Summary');
console.log('='.repeat(60));
console.log(`✅ ${combinations.length} city-service combinations available`);
console.log(`✅ ${featured.length} featured combinations for homepage`);
console.log(`✅ ${validation.valid}/${validation.total} pages validated successfully`);
console.log(`✅ Average ${avgWords} words per page (target: 350+)`);
console.log(`✅ All content in Dutch (nl-NL) with local context`);
console.log('\n🎉 Content generation system is ready to use!');
console.log('='.repeat(60) + '\n');
