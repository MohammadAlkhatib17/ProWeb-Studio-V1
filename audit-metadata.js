#!/usr/bin/env node

/**
 * Metadata Audit Script
 * Analyzes all page metadata for canonical and hreflang consistency
 */

const fs = require('fs');
const path = require('path');

const SITE_ROOT = '/home/mohammadalkhatib/Desktop/personal/ProWeb-Studio-V1/site/src/app';

// Find all page.tsx files
function findPageFiles(dir) {
  const pages = [];
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scan(fullPath);
      } else if (item === 'page.tsx') {
        pages.push(fullPath);
      }
    }
  }
  
  scan(dir);
  return pages;
}

// Extract metadata from a page file
function extractMetadata(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(SITE_ROOT, path.dirname(filePath));
  const routePath = relativePath === '' ? '/' : `/${relativePath}`;
  
  // Extract metadata export
  const metadataMatch = content.match(/export const metadata: Metadata = \{([\s\S]*?)\};/);
  if (!metadataMatch) {
    return { routePath, filePath, hasMetadata: false };
  }
  
  const metadataBlock = metadataMatch[1];
  
  // Extract canonical
  const canonicalMatch = metadataBlock.match(/canonical:\s*['"`]([^'"`]+)['"`]/);
  const canonical = canonicalMatch ? canonicalMatch[1] : null;
  
  // Extract languages
  const languagesMatch = metadataBlock.match(/languages:\s*\{([^}]+)\}/);
  let languages = {};
  if (languagesMatch) {
    const languagesBlock = languagesMatch[1];
    const langMatches = [...languagesBlock.matchAll(/['"`]([^'"`]+)['"`]:\s*['"`]([^'"`]+)['"`]/g)];
    for (const match of langMatches) {
      languages[match[1]] = match[2];
    }
  }
  
  // Extract title
  const titleMatch = metadataBlock.match(/title:\s*['"`]([^'"`]+)['"`]/);
  const title = titleMatch ? titleMatch[1] : null;
  
  return {
    routePath,
    filePath,
    hasMetadata: true,
    canonical,
    languages,
    title
  };
}

// Main analysis
console.log('🔍 Auditing page metadata...\n');

const pageFiles = findPageFiles(SITE_ROOT);
const analysis = pageFiles.map(extractMetadata);

if (process.env.NODE_ENV !== 'production') {
  console.log(`Found ${pageFiles.length} pages:\n`);
}

// Issues tracking
const issues = {
  missingCanonical: [],
  inconsistentCanonical: [],
  missingLanguages: [],
  inconsistentLanguages: [],
  missingXDefault: []
};

analysis.forEach(page => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📄 ${page.routePath}`);
    console.log(`   File: ${path.relative(process.cwd(), page.filePath)}`);
  }
  
  if (!page.hasMetadata) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('   ❌ No metadata export found');
    }
    return;
  }
  
  // Check canonical
  if (!page.canonical) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('   ❌ Missing canonical URL');
    }
    issues.missingCanonical.push(page);
  } else if (page.canonical !== page.routePath) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`   ⚠️  Canonical mismatch: expected "${page.routePath}", got "${page.canonical}"`);
    }
    issues.inconsistentCanonical.push({...page, expected: page.routePath});
  } else {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`   ✅ Canonical: ${page.canonical}`);
    }
  }
  
  // Check languages
  if (!page.languages || Object.keys(page.languages).length === 0) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('   ❌ Missing languages configuration');
    }
    issues.missingLanguages.push(page);
  } else {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`   🌐 Languages: ${JSON.stringify(page.languages)}`);
    }
    
    // Check for nl-NL
    if (!page.languages['nl-NL']) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('   ⚠️  Missing nl-NL language');
      }
      issues.inconsistentLanguages.push({...page, issue: 'missing nl-NL'});
    } else if (page.languages['nl-NL'] !== page.routePath) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`   ⚠️  nl-NL mismatch: expected "${page.routePath}", got "${page.languages['nl-NL']}"`);
      }
      issues.inconsistentLanguages.push({...page, issue: 'nl-NL mismatch', expected: page.routePath});
    }
    
    // Check x-default
    if (!page.languages['x-default']) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('   ⚠️  Missing x-default');
      }
      issues.missingXDefault.push(page);
    } else if (page.languages['x-default'] !== page.routePath) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`   ⚠️  x-default should point to Dutch path "${page.routePath}", got "${page.languages['x-default']}"`);
      }
      issues.missingXDefault.push({...page, issue: 'x-default mismatch', expected: page.routePath});
    }
  }
  
  if (process.env.NODE_ENV !== 'production') {
    console.log();
  }
});

// Summary
console.log('\n📊 SUMMARY\n');

const totalIssues = Object.values(issues).reduce((sum, arr) => sum + arr.length, 0);

if (totalIssues === 0) {
  console.log('✅ All metadata is consistent!');
} else {
  console.log(`❌ Found ${totalIssues} issues:\n`);
  
  if (issues.missingCanonical.length > 0) {
    console.log(`📍 Missing canonical URLs (${issues.missingCanonical.length}):`);
    issues.missingCanonical.forEach(p => console.log(`   - ${p.routePath}`));
    if (process.env.NODE_ENV !== 'production') {
      console.log();
    }
  }
  
  if (issues.inconsistentCanonical.length > 0) {
    console.log(`📍 Inconsistent canonical URLs (${issues.inconsistentCanonical.length}):`);
    issues.inconsistentCanonical.forEach(p => 
      console.log(`   - ${p.routePath}: "${p.canonical}" → should be "${p.expected}"`)
    );
    if (process.env.NODE_ENV !== 'production') {
      console.log();
    }
  }
  
  if (issues.missingLanguages.length > 0) {
    console.log(`🌐 Missing languages configuration (${issues.missingLanguages.length}):`);
    issues.missingLanguages.forEach(p => console.log(`   - ${p.routePath}`));
    if (process.env.NODE_ENV !== 'production') {
      console.log();
    }
  }
  
  if (issues.inconsistentLanguages.length > 0) {
    console.log(`🌐 Inconsistent languages configuration (${issues.inconsistentLanguages.length}):`);
    issues.inconsistentLanguages.forEach(p => 
      console.log(`   - ${p.routePath}: ${p.issue}`)
    );
    if (process.env.NODE_ENV !== 'production') {
      console.log();
    }
  }
  
  if (issues.missingXDefault.length > 0) {
    console.log(`🔗 x-default issues (${issues.missingXDefault.length}):`);
    issues.missingXDefault.forEach(p => 
      console.log(`   - ${p.routePath}: ${p.issue || 'missing x-default'}`)
    );
    if (process.env.NODE_ENV !== 'production') {
      console.log();
    }
  }
}

// Save results for further processing
const reportPath = '/home/mohammadalkhatib/Desktop/personal/ProWeb-Studio-V1/metadata-audit-report.json';
fs.writeFileSync(reportPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  analysis,
  issues,
  summary: {
    totalPages: analysis.length,
    totalIssues,
    byType: {
      missingCanonical: issues.missingCanonical.length,
      inconsistentCanonical: issues.inconsistentCanonical.length,
      missingLanguages: issues.missingLanguages.length,
      inconsistentLanguages: issues.inconsistentLanguages.length,
      missingXDefault: issues.missingXDefault.length
    }
  }
}, null, 2));

if (process.env.NODE_ENV !== 'production') {
  console.log(`📄 Detailed report saved to: ${reportPath}`);
}