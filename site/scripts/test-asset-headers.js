#!/usr/bin/env node

/**
 * Test script to verify asset caching headers are properly configured
 * This script can be run after deployment to validate the headers
 */

const testUrls = [
  // Test image assets
  { url: '/assets/logo.png', type: 'image' },
  { url: '/assets/hero-bg.jpg', type: 'image' },
  { url: '/assets/icon.webp', type: 'image' },
  { url: '/assets/favicon.ico', type: 'image' },
  { url: '/assets/logo.svg', type: 'image' },
  
  // Test 3D assets
  { url: '/assets/models/scene.glb', type: '3D asset' },
  { url: '/assets/models/character.gltf', type: '3D asset' },
  { url: '/assets/textures/normal.ktx2', type: '3D asset' },
  { url: '/assets/models/geometry.bin', type: '3D asset' },
  { url: '/assets/hdri/environment.hdr', type: '3D asset' },
];

const expectedHeaders = {
  'cache-control': 'public, max-age=31536000, immutable',
  'x-content-type-options': 'nosniff'
};

async function testHeaders(baseUrl = 'http://localhost:3000') {
  console.log('🧪 Testing asset caching headers...\n');
  
  const results = {
    passed: 0,
    failed: 0,
    errors: []
  };

  for (const testCase of testUrls) {
    const fullUrl = `${baseUrl}${testCase.url}`;
    
    try {
      console.log(`Testing ${testCase.type}: ${testCase.url}`);
      
      const response = await fetch(fullUrl, { method: 'HEAD' });
      const headers = response.headers;
      
      // Check cache-control header
      const cacheControl = headers.get('cache-control');
      const expectedCacheControl = expectedHeaders['cache-control'];
      
      if (cacheControl && cacheControl.includes('max-age=31536000') && cacheControl.includes('immutable')) {
        console.log(`  ✅ Cache-Control: ${cacheControl}`);
        results.passed++;
      } else {
        console.log(`  ❌ Cache-Control: ${cacheControl || 'missing'} (expected: ${expectedCacheControl})`);
        results.failed++;
        results.errors.push(`${testCase.url}: Invalid Cache-Control header`);
      }
      
      // Check x-content-type-options
      const contentTypeOptions = headers.get('x-content-type-options');
      if (contentTypeOptions === 'nosniff') {
        console.log(`  ✅ X-Content-Type-Options: ${contentTypeOptions}`);
      } else {
        console.log(`  ⚠️  X-Content-Type-Options: ${contentTypeOptions || 'missing'}`);
      }
      
      console.log('');
      
    } catch (error) {
      console.log(`  ❌ Error testing ${testCase.url}: ${error.message}`);
      results.failed++;
      results.errors.push(`${testCase.url}: ${error.message}`);
      console.log('');
    }
  }
  
  // Summary
  console.log('📊 Test Results:');
  console.log(`  ✅ Passed: ${results.passed}`);
  console.log(`  ❌ Failed: ${results.failed}`);
  
  if (results.errors.length > 0) {
    console.log('\n🚨 Errors:');
    results.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  if (results.failed === 0) {
    console.log('\n🎉 All asset caching headers are properly configured!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please check the configuration.');
    process.exit(1);
  }
}

// Allow custom base URL via command line argument
const baseUrl = process.argv[2] || 'http://localhost:3000';

testHeaders(baseUrl).catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});