#!/usr/bin/env node

/**
 * Enhanced Bundle Analysis Script for ProWeb Studio
 * Analyzes Next.js build output with per-route size tracking and budget enforcement
 */

const fs = require('fs');
const path = require('path');

const CHUNKS_DIR = '.next/static/chunks';
const PAGES_DIR = '.next/static/chunks/pages';
const APP_DIR = '.next/static/chunks/app';
const MANIFEST_PATH = '.next/app-build-manifest.json';
const BUILD_MANIFEST_PATH = '.next/build-manifest.json';
const BUDGETS_PATH = path.join(__dirname, 'budgets.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'reports', 'bundles');
const OUTPUT_JSON = path.join(OUTPUT_DIR, 'bundle-report.json');
const OUTPUT_MD = path.join(OUTPUT_DIR, 'bundle-report.md');

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function loadBudgets() {
  try {
    return JSON.parse(fs.readFileSync(BUDGETS_PATH, 'utf8'));
  } catch (error) {
    console.warn('⚠️  Could not load budgets.json, skipping budget checks');
    return [];
  }
}

function getRouteFiles(route, manifest) {
  const files = {
    js: [],
    css: []
  };

  // Get files from manifest
  if (manifest.pages && manifest.pages[route]) {
    manifest.pages[route].forEach(file => {
      if (file.endsWith('.js')) {
        files.js.push(file);
      } else if (file.endsWith('.css')) {
        files.css.push(file);
      }
    });
  }

  return files;
}

function calculateRouteSize(route, manifest) {
  const files = getRouteFiles(route, manifest);
  let jsSize = 0;
  let cssSize = 0;

  files.js.forEach(file => {
    const filePath = path.join(__dirname, '.next', file);
    jsSize += getFileSize(filePath);
  });

  files.css.forEach(file => {
    const filePath = path.join(__dirname, '.next', file);
    cssSize += getFileSize(filePath);
  });

  return {
    route,
    jsSize,
    cssSize,
    totalSize: jsSize + cssSize,
    files
  };
}

function checkBudgets(routeSizes, budgets) {
  const violations = [];
  const warnings = [];

  routeSizes.forEach(routeSize => {
    const budget = budgets.find(b => b.path === routeSize.route);
    
    if (!budget) {
      warnings.push({
        route: routeSize.route,
        message: 'No budget defined for this route'
      });
      return;
    }

    budget.resourceSizes?.forEach(resourceBudget => {
      const actualSize = resourceBudget.resourceType === 'script' 
        ? routeSize.jsSize / 1024 // Convert to KB
        : resourceBudget.resourceType === 'total'
        ? routeSize.totalSize / 1024
        : 0;

      if (actualSize > resourceBudget.budget) {
        violations.push({
          route: routeSize.route,
          resourceType: resourceBudget.resourceType,
          budget: resourceBudget.budget,
          actual: actualSize,
          exceeded: actualSize - resourceBudget.budget
        });
      }
    });
  });

  return { violations, warnings };
}

function generateMarkdownReport(routeSizes, budgets, violations, baselineData = null) {
  let md = '# Bundle Size Report\n\n';
  md += `Generated: ${new Date().toISOString()}\n\n`;

  // Summary Table
  md += '## Per-Route Bundle Sizes\n\n';
  md += '| Route | JS Size | CSS Size | Total Size | Budget Status |\n';
  md += '|-------|---------|----------|------------|---------------|\n';

  routeSizes.forEach(route => {
    const budget = budgets.find(b => b.path === route.route);
    const scriptBudget = budget?.resourceSizes?.find(r => r.resourceType === 'script')?.budget;
    const jsKB = route.jsSize / 1024;
    const status = scriptBudget && jsKB > scriptBudget ? '❌ Over' : '✅ OK';
    
    let delta = '';
    if (baselineData) {
      const baseline = baselineData.routeSizes.find(r => r.route === route.route);
      if (baseline) {
        const diff = route.totalSize - baseline.totalSize;
        const diffPercent = ((diff / baseline.totalSize) * 100).toFixed(1);
        delta = diff > 0 ? ` (+${formatBytes(diff)}, +${diffPercent}%)` : ` (${formatBytes(diff)}, ${diffPercent}%)`;
      }
    }
    
    md += `| ${route.route} | ${formatBytes(route.jsSize)} | ${formatBytes(route.cssSize)} | ${formatBytes(route.totalSize)}${delta} | ${status} |\n`;
  });

  // Budget Violations
  if (violations.length > 0) {
    md += '\n## ❌ Budget Violations\n\n';
    violations.forEach(v => {
      md += `- **${v.route}** (${v.resourceType}): ${formatBytes(v.actual * 1024)} / ${v.budget} KB budget (exceeded by ${formatBytes(v.exceeded * 1024)})\n`;
    });
  } else {
    md += '\n## ✅ All Routes Within Budget\n\n';
  }

  // Top Chunks
  md += '\n## Largest Chunks\n\n';
  md += '| Rank | File | Size | Category |\n';
  md += '|------|------|------|----------|\n';

  const chunksDir = path.join(__dirname, '.next', 'static', 'chunks');
  if (fs.existsSync(chunksDir)) {
    const chunks = fs.readdirSync(chunksDir)
      .filter(f => f.endsWith('.js'))
      .map(f => ({
        file: f,
        size: getFileSize(path.join(chunksDir, f)),
        category: categorizeChunk(f)
      }))
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);

    chunks.forEach((chunk, i) => {
      md += `| ${i + 1} | ${chunk.file} | ${formatBytes(chunk.size)} | ${chunk.category} |\n`;
    });
  }

  return md;
}

function categorizeChunk(filename) {
  if (filename.includes('polyfills')) return 'polyfills';
  if (filename.includes('vendors') || filename.includes('framework')) return 'vendors';
  if (filename.includes('three') || filename.startsWith('three.')) return 'three-core';
  if (filename.match(/^\d+(-|\.)/)) return 'three-components';
  if (filename.includes('main') || filename.includes('app')) return 'app';
  return 'other';
}

function analyzeBundle(options = {}) {
  const { baseline = null, outputReport = true } = options;
  
  console.log('🔍 ProWeb Studio Bundle Analysis\n');

  // Load budgets
  const budgets = loadBudgets();

  // Load manifests
  let manifest = {};
  try {
    if (fs.existsSync(MANIFEST_PATH)) {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    } else if (fs.existsSync(BUILD_MANIFEST_PATH)) {
      manifest = JSON.parse(fs.readFileSync(BUILD_MANIFEST_PATH, 'utf8'));
    }
  } catch (error) {
    console.error('❌ Failed to load manifest:', error.message);
    process.exit(1);
  }

  // Get all routes
  const routes = Object.keys(manifest.pages || {});
  
  // Calculate sizes for each route
  const routeSizes = routes.map(route => calculateRouteSize(route, manifest));

  // Check budgets
  const { violations, warnings } = checkBudgets(routeSizes, budgets);

  // Display results
  console.log('📊 Per-Route Bundle Sizes:');
  console.log('═'.repeat(80));
  routeSizes.forEach(route => {
    const budget = budgets.find(b => b.path === route.route);
    const scriptBudget = budget?.resourceSizes?.find(r => r.resourceType === 'script')?.budget;
    const jsKB = route.jsSize / 1024;
    const status = scriptBudget && jsKB > scriptBudget ? '❌' : '✅';
    
    console.log(`${status} ${route.route.padEnd(20)} JS: ${formatBytes(route.jsSize).padStart(10)}  CSS: ${formatBytes(route.cssSize).padStart(10)}  Total: ${formatBytes(route.totalSize).padStart(10)}`);
  });

  if (violations.length > 0) {
    console.log('\n❌ Budget Violations:');
    console.log('═'.repeat(80));
    violations.forEach(v => {
      console.log(`   ${v.route} (${v.resourceType}): ${formatBytes(v.actual * 1024)} / ${v.budget} KB (exceeded by ${formatBytes(v.exceeded * 1024)})`);
    });
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(w => {
      console.log(`   ${w.route}: ${w.message}`);
    });
  }

  const totalSize = routeSizes.reduce((acc, r) => acc + r.totalSize, 0);
  console.log(`\n📈 Total Bundle Size: ${formatBytes(totalSize)}`);

  // Generate reports
  if (outputReport) {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const reportData = {
      timestamp: new Date().toISOString(),
      routeSizes,
      violations,
      warnings,
      totalSize
    };

    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(reportData, null, 2));
    
    const markdown = generateMarkdownReport(routeSizes, budgets, violations, baseline);
    fs.writeFileSync(OUTPUT_MD, markdown);

    console.log(`\n✅ Reports saved to ${OUTPUT_DIR}`);
  }

  // Exit with error if there are violations
  if (violations.length > 0) {
    console.error('\n❌ Bundle size budget exceeded!');
    process.exit(1);
  }

  return {
    routeSizes,
    violations,
    warnings,
    totalSize,
    manifest
  };
}

if (require.main === module) {
  analyzeBundle();
}

module.exports = { analyzeBundle, calculateRouteSize, checkBudgets };