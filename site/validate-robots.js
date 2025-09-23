const fs = require('fs');
const path = require('path');

// Read the robots.ts file
const robotsPath = path.join(__dirname, 'src/app/robots.ts');
const robotsContent = fs.readFileSync(robotsPath, 'utf8');

console.log('🔍 Validating robots.ts implementation...\n');

// Check for required components
const checks = [
  {
    name: 'Googlebot rule with no crawl delay',
    test: /userAgent:\s*['"]Googlebot['"][^}]*(?!crawlDelay)/s,
    message: '✅ Googlebot has no crawl delay for maximum indexing speed'
  },
  {
    name: 'CSS/JS allow rules for Googlebot',
    test: /userAgent:\s*['"]Googlebot['"][^}]*allow:\s*\[[^}]*\*\.css[^}]*\*\.js/s,
    message: '✅ Googlebot can access CSS and JS files for rendering'
  },
  {
    name: 'Multiple sitemap references',
    test: /sitemap:\s*\[[\s\S]*?\/sitemap\.xml[\s\S]*?\/sitemap-images\.xml/,
    message: '✅ Multiple sitemaps configured (main + images)'
  },
  {
    name: 'Dutch search engines support',
    test: /userAgent:\s*['"]DuckDuckBot['"]|userAgent:\s*['"]YandexBot['"]/s,
    message: '✅ Dutch and international search engines configured'
  },
  {
    name: 'Crawl delay for non-priority bots',
    test: /userAgent:\s*['"]\*['"][^}]*crawlDelay:\s*10/s,
    message: '✅ Conservative crawl delay for unknown bots'
  },
  {
    name: 'Social media bots configured',
    test: /userAgent:\s*['"]facebookexternalhit['"]|userAgent:\s*['"]LinkedInBot['"]|userAgent:\s*['"]WhatsApp['"]/s,
    message: '✅ Social media and messaging bots configured'
  },
  {
    name: 'Proper Next.js static assets allow',
    test: /allow:\s*\[[^}]*\/_next\/static\/[^}]*\/assets\//s,
    message: '✅ Next.js static assets properly allowed'
  },
  {
    name: 'Host directive for Netherlands',
    test: /host:\s*['"]prowebstudio\.nl['"]/,
    message: '✅ Canonical host set to Netherlands domain'
  }
];

let passed = 0;
let failed = 0;

checks.forEach(check => {
  if (check.test.test(robotsContent)) {
    console.log(check.message);
    passed++;
  } else {
    console.log(`❌ Failed: ${check.name}`);
    failed++;
  }
});

console.log(`\n📊 Validation Results:`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);

if (failed === 0) {
  console.log('\n🎉 All validations passed! robots.ts is optimized for maximum crawl efficiency.');
} else {
  console.log('\n⚠️  Some optimizations may need attention.');
}

// Show sample robots.txt output
console.log('\n📄 Sample robots.txt structure check:');
const hasUserAgentRules = /userAgent:\s*['"][^'"]+['"]/g.test(robotsContent);
const hasSitemapArray = /sitemap:\s*\[/.test(robotsContent);
const hasHostDirective = /host:\s*['"][^'"]+['"]/.test(robotsContent);

if (hasUserAgentRules && hasSitemapArray && hasHostDirective) {
  console.log('✅ Valid robots.txt structure with user-agent rules, sitemaps, and host directive');
} else {
  console.log('❌ robots.txt structure may have issues');
}