#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Parse Lighthouse CI manifest and generate compact Markdown summary
 * for GitHub Actions job summary
 */
function generateLighthouseSummary() {
  const manifestPath = path.join(process.cwd(), 'site', '.lighthouseci', 'manifest.json');
  
  if (!fs.existsSync(manifestPath)) {
    console.log('❌ No Lighthouse manifest found. Skipping summary.');
    return;
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    if (!manifest || !manifest.length) {
      console.log('❌ Empty Lighthouse manifest. Skipping summary.');
      return;
    }

    // Generate markdown summary
    let summary = '# 🚀 Lighthouse CI Results\n\n';
    summary += '| Route | Performance | SEO | Best Practices | Bundle Size (KB) | Response Time (ms) |\n';
    summary += '|-------|-------------|-----|----------------|------------------|--------------------|\n';

    for (const result of manifest) {
      const { url, summary: resultSummary, jsonPath } = result;
      
      // Extract route from URL
      const route = new URL(url).pathname || '/';
      
      // Read the full report to get detailed metrics
      let detailedMetrics = {};
      if (jsonPath && fs.existsSync(path.join(process.cwd(), 'site', '.lighthouseci', jsonPath))) {
        try {
          const reportPath = path.join(process.cwd(), 'site', '.lighthouseci', jsonPath);
          const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
          
          // Extract key metrics
          const audits = report.audits || {};
          detailedMetrics = {
            totalByteWeight: audits['total-byte-weight']?.numericValue || 0,
            serverResponseTime: audits['server-response-time']?.numericValue || 0
          };
        } catch (err) {
          console.warn(`Warning: Could not read detailed report for ${url}:`, err.message);
        }
      }

      // Format scores (0-100 to 0-1 for display)
      const performance = Math.round((resultSummary.performance || 0) * 100);
      const seo = Math.round((resultSummary.seo || 0) * 100);
      const bestPractices = Math.round((resultSummary['best-practices'] || 0) * 100);
      
      // Format bundle size (bytes to KB)
      const bundleSize = Math.round((detailedMetrics.totalByteWeight || 0) / 1024);
      
      // Format response time
      const responseTime = Math.round(detailedMetrics.serverResponseTime || 0);

      // Add score emojis
      const getScoreEmoji = (score) => {
        if (score >= 90) return '🟢';
        if (score >= 80) return '🟡';
        return '🔴';
      };

      summary += `| ${route} | ${getScoreEmoji(performance)} ${performance} | ${getScoreEmoji(seo)} ${seo} | ${getScoreEmoji(bestPractices)} ${bestPractices} | ${bundleSize} | ${responseTime} |\n`;
    }

    summary += '\n## 📊 Score Legend\n';
    summary += '🟢 90-100 (Excellent) | 🟡 80-89 (Good) | 🔴 0-79 (Needs Improvement)\n\n';
    
    summary += '## 📁 Detailed Reports\n';
    summary += 'Download the `lhci-report` artifact from this workflow run for detailed HTML reports.\n\n';
    
    summary += '---\n';
    summary += `*Generated on ${new Date().toISOString()} with ${manifest.length} route(s)*\n`;

    // Write to GitHub Step Summary
    const summaryFile = process.env.GITHUB_STEP_SUMMARY;
    if (summaryFile) {
      fs.appendFileSync(summaryFile, summary);
      console.log('✅ Lighthouse summary added to job summary');
    } else {
      console.log('Summary would be:\n', summary);
    }

    // Also output summary to console for debugging
    console.log('\n🔍 Lighthouse CI Summary Generated:');
    console.log(`- Analyzed ${manifest.length} routes`);
    console.log(`- Results written to: ${summaryFile || 'console (no GITHUB_STEP_SUMMARY)'}`);

  } catch (error) {
    console.error('❌ Error generating Lighthouse summary:', error.message);
    process.exit(1);
  }
}

// Run the summary generation
generateLighthouseSummary();