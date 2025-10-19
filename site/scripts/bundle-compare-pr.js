#!/usr/bin/env node

/**
 * Bundle Size Comparison for Pull Requests
 * Compares current PR bundle against main branch and generates PR comment
 */

const fs = require('fs');
const path = require('path');

const THRESHOLD_PERCENT = parseInt(process.env.BUNDLE_SIZE_THRESHOLD || '5');

function loadBundleReport(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Failed to load bundle report from ${filePath}:`, error.message);
    return null;
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

function calculateDelta(oldSize, newSize) {
  const diff = newSize - oldSize;
  const percentChange = oldSize === 0 ? 100 : ((diff / oldSize) * 100);
  
  return {
    diff,
    percentChange,
    isRegression: percentChange > THRESHOLD_PERCENT,
    isSignificant: Math.abs(percentChange) > 1
  };
}

function generatePRComment(currentReport, baseReport) {
  let comment = '## 📦 Bundle Size Report\n\n';
  
  const totalDelta = calculateDelta(baseReport.totalSize, currentReport.totalSize);
  
  // Overall status
  if (totalDelta.isRegression) {
    comment += '### ❌ Bundle Size Regression Detected\n\n';
    comment += `Total bundle size increased by **${formatBytes(totalDelta.diff)}** (+${totalDelta.percentChange.toFixed(2)}%)\n\n`;
  } else if (totalDelta.diff < 0) {
    comment += '### ✅ Bundle Size Reduced\n\n';
    comment += `Total bundle size decreased by **${formatBytes(Math.abs(totalDelta.diff))}** (${totalDelta.percentChange.toFixed(2)}%)\n\n`;
  } else {
    comment += '### ℹ️ Bundle Size Changed\n\n';
    comment += `Total bundle size changed by **${formatBytes(totalDelta.diff)}** (+${totalDelta.percentChange.toFixed(2)}%)\n\n`;
  }
  
  // Per-route comparison table
  comment += '### Per-Route Comparison\n\n';
  comment += '| Route | Current | Baseline | Delta | Change % | Status |\n';
  comment += '|-------|---------|----------|-------|----------|--------|\n';
  
  const routeComparisons = [];
  
  currentReport.routeSizes.forEach(currentRoute => {
    const baseRoute = baseReport.routeSizes.find(r => r.route === currentRoute.route);
    
    if (baseRoute) {
      const delta = calculateDelta(baseRoute.totalSize, currentRoute.totalSize);
      routeComparisons.push({
        route: currentRoute.route,
        current: currentRoute.totalSize,
        baseline: baseRoute.totalSize,
        delta: delta.diff,
        percentChange: delta.percentChange,
        isRegression: delta.isRegression,
        status: delta.isRegression ? '❌' : delta.diff < 0 ? '✅' : delta.isSignificant ? '⚠️' : '➖'
      });
    } else {
      // New route
      routeComparisons.push({
        route: currentRoute.route,
        current: currentRoute.totalSize,
        baseline: 0,
        delta: currentRoute.totalSize,
        percentChange: 100,
        isRegression: false,
        status: '🆕'
      });
    }
  });
  
  // Check for removed routes
  baseReport.routeSizes.forEach(baseRoute => {
    const exists = currentReport.routeSizes.find(r => r.route === baseRoute.route);
    if (!exists) {
      routeComparisons.push({
        route: baseRoute.route,
        current: 0,
        baseline: baseRoute.totalSize,
        delta: -baseRoute.totalSize,
        percentChange: -100,
        isRegression: false,
        status: '🗑️'
      });
    }
  });
  
  // Sort by significance (regressions first, then by absolute change)
  routeComparisons.sort((a, b) => {
    if (a.isRegression && !b.isRegression) return -1;
    if (!a.isRegression && b.isRegression) return 1;
    return Math.abs(b.delta) - Math.abs(a.delta);
  });
  
  routeComparisons.forEach(comp => {
    const deltaStr = comp.delta > 0 ? `+${formatBytes(comp.delta)}` : formatBytes(comp.delta);
    const percentStr = comp.percentChange > 0 ? `+${comp.percentChange.toFixed(1)}%` : `${comp.percentChange.toFixed(1)}%`;
    
    comment += `| ${comp.route} | ${formatBytes(comp.current)} | ${formatBytes(comp.baseline)} | ${deltaStr} | ${percentStr} | ${comp.status} |\n`;
  });
  
  // Budget violations
  if (currentReport.violations && currentReport.violations.length > 0) {
    comment += '\n### ⚠️ Budget Violations\n\n';
    currentReport.violations.forEach(v => {
      comment += `- **${v.route}** (${v.resourceType}): ${formatBytes(v.actual * 1024)} exceeds ${v.budget} KB budget by ${formatBytes(v.exceeded * 1024)}\n`;
    });
    comment += '\n';
  }
  
  // Legend
  comment += '\n### Legend\n\n';
  comment += '- ❌ Regression (exceeds threshold)\n';
  comment += '- ✅ Improvement (size reduced)\n';
  comment += '- ⚠️ Significant change (within threshold)\n';
  comment += '- ➖ No significant change\n';
  comment += '- 🆕 New route\n';
  comment += '- 🗑️ Removed route\n';
  
  // Summary metrics
  comment += '\n### Summary\n\n';
  comment += `- **Total Size:** ${formatBytes(currentReport.totalSize)} (baseline: ${formatBytes(baseReport.totalSize)})\n`;
  comment += `- **Routes Analyzed:** ${currentReport.routeSizes.length}\n`;
  comment += `- **Threshold:** ${THRESHOLD_PERCENT}%\n`;
  
  const regressions = routeComparisons.filter(c => c.isRegression);
  if (regressions.length > 0) {
    comment += `- **Regressions:** ${regressions.length}\n`;
  }
  
  return comment;
}

function main() {
  const currentReportPath = process.argv[2] || path.join(__dirname, '..', '..', 'reports', 'bundles', 'bundle-report.json');
  const baseReportPath = process.argv[3] || path.join(__dirname, '..', '..', 'reports', 'bundles', 'bundle-report-base.json');
  const outputPath = process.argv[4] || path.join(__dirname, '..', '..', 'reports', 'bundles', 'pr-comment.md');
  
  console.log('🔍 Comparing bundle reports for PR...');
  console.log(`Current: ${currentReportPath}`);
  console.log(`Base: ${baseReportPath}`);
  
  const currentReport = loadBundleReport(currentReportPath);
  const baseReport = loadBundleReport(baseReportPath);
  
  if (!currentReport || !baseReport) {
    console.error('❌ Failed to load one or both bundle reports');
    process.exit(1);
  }
  
  const comment = generatePRComment(currentReport, baseReport);
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write comment to file
  fs.writeFileSync(outputPath, comment);
  console.log(`✅ PR comment generated: ${outputPath}`);
  
  // Also output to stdout for GitHub Actions
  console.log('\n--- PR COMMENT ---\n');
  console.log(comment);
  console.log('\n--- END PR COMMENT ---\n');
  
  // Check if there are regressions
  const totalDelta = calculateDelta(baseReport.totalSize, currentReport.totalSize);
  const hasViolations = currentReport.violations && currentReport.violations.length > 0;
  
  if (totalDelta.isRegression || hasViolations) {
    console.error('\n❌ Bundle size check failed');
    process.exit(1);
  }
  
  console.log('\n✅ Bundle size check passed');
}

if (require.main === module) {
  main();
}

module.exports = { generatePRComment, calculateDelta };
