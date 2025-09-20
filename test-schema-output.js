#!/usr/bin/env node

// Simple test to validate schema structure
const fs = require('fs');
const path = require('path');

// Read the SEOSchema component
const schemaPath = path.join(__dirname, 'site/src/components/SEOSchema.tsx');
const schemaContent = fs.readFileSync(schemaPath, 'utf8');

console.log('✅ SEOSchema.tsx exists and can be read');

// Check for key implementations
const checks = [
  { name: 'WebPage schema per pageType', pattern: /getPagePath.*pageType/ },
  { name: 'ImageObject for primary images', pattern: /getPrimaryImage/ },
  { name: 'Logo ImageObject', pattern: /logoImageSchema/ },
  { name: 'Social profiles filtering', pattern: /getSocialProfiles/ },
  { name: 'Primary image reference in WebPage', pattern: /primaryImageOfPage/ },
  { name: 'Logo reference in Organization', pattern: /#logo/ },
  { name: 'Schema graph includes all elements', pattern: /logoImageSchema.*primaryImageSchema/ },
];

console.log('\n🔍 Checking schema implementations:');
checks.forEach(check => {
  const found = check.pattern.test(schemaContent);
  console.log(`${found ? '✅' : '❌'} ${check.name}`);
});

// Check for specific page types
const pageTypes = ['homepage', 'services', 'werkwijze'];
console.log('\n📄 Checking page type implementations:');
pageTypes.forEach(pageType => {
  const found = schemaContent.includes(`'${pageType}':`);
  console.log(`${found ? '✅' : '❌'} ${pageType} page type`);
});

console.log('\n✨ Schema validation complete!');