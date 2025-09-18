#!/usr/bin/env node

/**
 * Test script for bundle comparison functionality
 * This can be used to validate the bundle comparison logic
 */

const { analyzeChunkChanges, calculatePercentageChange } = require('./bundle-compare');

function runTests() {
  console.log('🧪 Testing bundle comparison functionality...\n');

  // Test percentage calculation
  console.log('Testing percentage calculation:');
  console.log(`100 → 110: ${calculatePercentageChange(100, 110).toFixed(2)}% (expected: 10.00%)`);
  console.log(`100 → 90: ${calculatePercentageChange(100, 90).toFixed(2)}% (expected: -10.00%)`);
  console.log(`0 → 100: ${calculatePercentageChange(0, 100).toFixed(2)}% (expected: 100.00%)`);
  console.log(`100 → 0: ${calculatePercentageChange(100, 0).toFixed(2)}% (expected: -100.00%)\n`);

  // Test chunk analysis
  const currentData = {
    topChunks: [
      { filename: 'vendors-123.js', sizeBytes: 1100000, category: 'vendors' },
      { filename: 'three-456.js', sizeBytes: 800000, category: 'three-core' },
      { filename: 'new-chunk-789.js', sizeBytes: 150000, category: 'app' }
    ]
  };

  const baseData = {
    topChunks: [
      { filename: 'vendors-123.js', sizeBytes: 1000000, category: 'vendors' },
      { filename: 'three-456.js', sizeBytes: 800000, category: 'three-core' },
      { filename: 'removed-chunk-999.js', sizeBytes: 50000, category: 'other' }
    ]
  };

  console.log('Testing chunk analysis:');
  const changes = analyzeChunkChanges(currentData, baseData);
  
  changes.forEach(change => {
    const status = change.isNew ? 'NEW' : change.isRemoved ? 'REMOVED' : 'CHANGED';
    console.log(`${status}: ${change.filename} (${change.percentChange.toFixed(2)}%)`);
  });

  console.log('\n✅ Bundle comparison tests completed');
}

if (require.main === module) {
  runTests();
}