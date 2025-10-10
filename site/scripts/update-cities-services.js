const fs = require('fs');
const path = require('path');

// Read the cities.ts file
const citiesPath = path.join(__dirname, '../src/data/cities.ts');
let content = fs.readFileSync(citiesPath, 'utf8');

// Replace all occurrences of limited relatedServices with ALL_SERVICES
const replacements = [
  "relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie'],",
  "relatedServices: ['website-laten-maken', 'webshop-laten-maken', 'seo-optimalisatie', '3d-website-ervaringen'],"
];

replacements.forEach(oldPattern => {
  content = content.replaceAll(oldPattern, 'relatedServices: ALL_SERVICES,');
});

// Write the updated content back
fs.writeFileSync(citiesPath, content, 'utf8');

console.log('✅ Updated all cities to have ALL_SERVICES available');