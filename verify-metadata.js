#!/usr/bin/env node

/**
 * Comprehensive Metadata Verification Script
 * Checks for duplicate metadata definitions and hard-coded URLs
 */

const fs = require('fs');
const path = require('path');

const SITE_ROOT = '/home/mohammadalkhatib/Desktop/personal/ProWeb-Studio-V1/site/src/app';

// Find all layout.tsx and page.tsx files
function findMetadataFiles(dir) {
  const files = { layouts: [], pages: [] };
  
  function scan(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scan(fullPath);
      } else if (item === 'layout.tsx') {
        files.layouts.push(fullPath);
      } else if (item === 'page.tsx') {
        files.pages.push(fullPath);
      }
    }
  }
  
  scan(dir);
  return files;
}

// Check for hard-coded URLs and metadata conflicts
function analyzeMetadataFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(SITE_ROOT, path.dirname(filePath));
  const routePath = relativePath === '' ? '/' : `/${relativePath}`;
  const fileType = path.basename(filePath).replace('.tsx', '');
  
  const issues = [];
  
  // Check for hard-coded URLs
  const hardCodedMatches = [...content.matchAll(/https:\/\/prowebstudio\.nl[^`'"\s]*/g)];
  if (hardCodedMatches.length > 0) {
    hardCodedMatches.forEach(match => {
      // Ignore if it's in a SITE_URL fallback declaration
      if (!match.input.includes('process.env.SITE_URL') || 
          !match.input.substring(0, match.index).includes('??')) {
        issues.push({
          type: 'hard-coded-url',
          value: match[0],
          context: match.input.substring(Math.max(0, match.index - 50), match.index + match[0].length + 50)
        });
      }
    });
  }
  
  // Check for metadata export
  const hasMetadata = content.includes('export const metadata');
  
  // Extract canonical and languages if metadata exists
  let canonical = null;
  let languages = {};
  
  if (hasMetadata) {
    const metadataMatch = content.match(/export const metadata[^=]*=\s*\{([\s\S]*?)\};/);
    if (metadataMatch) {
      const metadataBlock = metadataMatch[1];
      
      const canonicalMatch = metadataBlock.match(/canonical:\s*['"`]([^'"`]+)['"`]/);
      canonical = canonicalMatch ? canonicalMatch[1] : null;
      
      const languagesMatch = metadataBlock.match(/languages:\s*\{([^}]+)\}/);
      if (languagesMatch) {
        const languagesBlock = languagesMatch[1];
        const langMatches = [...languagesBlock.matchAll(/['"`]([^'"`]+)['"`]:\s*['"`]([^'"`]+)['"`]/g)];
        for (const match of langMatches) {
          languages[match[1]] = match[2];
        }
      }
    }
  }
  
  return {
    filePath,
    routePath,
    fileType,
    hasMetadata,
    canonical,
    languages,
    issues
  };
}

console.log('🔍 Comprehensive metadata verification...\n');

const files = findMetadataFiles(SITE_ROOT);
const allAnalysis = [
  ...files.layouts.map(analyzeMetadataFile),
  ...files.pages.map(analyzeMetadataFile)
];

// Group by route to check for conflicts
const routeGroups = {};
allAnalysis.forEach(analysis => {
  if (!routeGroups[analysis.routePath]) {
    routeGroups[analysis.routePath] = [];
  }
  routeGroups[analysis.routePath].push(analysis);
});

let totalIssues = 0;

console.log('📋 METADATA CONFLICTS ANALYSIS\n');

Object.keys(routeGroups).forEach(route => {
  const group = routeGroups[route];
  const layoutFile = group.find(f => f.fileType === 'layout');
  const pageFile = group.find(f => f.fileType === 'page');
  
  console.log(`📄 Route: ${route}`);
  
  if (layoutFile && pageFile && layoutFile.hasMetadata && pageFile.hasMetadata) {
    console.log('   ⚠️  CONFLICT: Both layout.tsx and page.tsx have metadata exports');
    console.log('   💡 Recommendation: Keep metadata in page.tsx, remove from layout.tsx');
    totalIssues++;
  } else if (layoutFile && layoutFile.hasMetadata) {
    console.log('   ✅ Metadata in layout.tsx only');
  } else if (pageFile && pageFile.hasMetadata) {
    console.log('   ✅ Metadata in page.tsx only');
  } else {
    console.log('   ❌ No metadata found');
    totalIssues++;
  }
  
  // Check canonical consistency
  const metadataFiles = group.filter(f => f.hasMetadata);
  if (metadataFiles.length > 0) {
    const canonicals = metadataFiles.map(f => f.canonical).filter(Boolean);
    if (canonicals.length > 1 && !canonicals.every(c => c === canonicals[0])) {
      console.log(`   ⚠️  Canonical mismatch: ${canonicals.join(' vs ')}`);
      totalIssues++;
    }
  }
  
  console.log();
});

console.log('📋 HARD-CODED URL ANALYSIS\n');

const hardCodedIssues = allAnalysis.filter(a => a.issues.length > 0);

if (hardCodedIssues.length === 0) {
  console.log('✅ No hard-coded URLs found');
} else {
  hardCodedIssues.forEach(file => {
    console.log(`📄 ${file.filePath}`);
    file.issues.forEach(issue => {
      if (issue.type === 'hard-coded-url') {
        console.log(`   ❌ Hard-coded URL: ${issue.value}`);
        console.log(`   📝 Context: ...${issue.context}...`);
        totalIssues++;
      }
    });
    console.log();
  });
}

console.log('📋 HREFLANG CONFIGURATION ANALYSIS\n');

allAnalysis.filter(a => a.hasMetadata).forEach(file => {
  console.log(`📄 ${file.routePath} (${file.fileType})`);
  
  if (Object.keys(file.languages).length === 0) {
    console.log('   ❌ No hreflang configuration');
    totalIssues++;
  } else {
    console.log(`   🌐 Languages: ${JSON.stringify(file.languages)}`);
    
    // Check for required languages
    if (!file.languages['nl-NL']) {
      console.log('   ⚠️  Missing nl-NL');
      totalIssues++;
    }
    
    if (!file.languages['x-default']) {
      console.log('   ⚠️  Missing x-default');
      totalIssues++;
    } else if (file.languages['x-default'] !== file.routePath) {
      console.log(`   ⚠️  x-default should point to Dutch path "${file.routePath}"`);
      totalIssues++;
    }
  }
  
  console.log();
});

console.log('\n📊 FINAL SUMMARY\n');

if (totalIssues === 0) {
  console.log('✅ All metadata is properly configured!');
  console.log('✅ No duplicate metadata exports');
  console.log('✅ No hard-coded URLs');
  console.log('✅ All hreflang configurations are consistent');
} else {
  console.log(`❌ Found ${totalIssues} issues that need attention`);
}

// Save comprehensive report
const reportPath = '/home/mohammadalkhatib/Desktop/personal/ProWeb-Studio-V1/comprehensive-metadata-report.json';
fs.writeFileSync(reportPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  summary: {
    totalFiles: allAnalysis.length,
    totalIssues,
    routeGroups,
    hardCodedIssues: hardCodedIssues.length
  },
  analysis: allAnalysis
}, null, 2));

console.log(`\n📄 Comprehensive report saved to: ${reportPath}`);