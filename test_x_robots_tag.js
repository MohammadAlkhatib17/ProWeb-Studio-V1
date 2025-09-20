#!/usr/bin/env node
/**
 * Quick test script to verify X-Robots-Tag header implementation
 * for the /speeltuin route in Next.js middleware
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

async function testHeaders(url, path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    const req = http.request(options, (res) => {
      const headers = res.headers;
      
      resolve({
        statusCode: res.statusCode,
        headers: headers,
        robotsTag: headers['x-robots-tag'] || 'NOT SET'
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

async function runTests() {
  console.log('🚀 Testing X-Robots-Tag Header Implementation');
  console.log('=' .repeat(50));

  const testRoutes = [
    { path: '/speeltuin', expected: 'noindex, follow', description: 'Speeltuin page (should have X-Robots-Tag)' },
    { path: '/', expected: 'NOT SET', description: 'Home page (should NOT have X-Robots-Tag)' },
    { path: '/diensten', expected: 'NOT SET', description: 'Services page (should NOT have X-Robots-Tag)' }
  ];

  const results = [];

  for (const route of testRoutes) {
    try {
      console.log(`\nTesting: ${route.path}`);
      console.log(`Description: ${route.description}`);
      
      const result = await testHeaders('localhost:3002', route.path);
      
      console.log(`✅ Status: ${result.statusCode}`);
      console.log(`🤖 X-Robots-Tag: ${result.robotsTag}`);
      
      const passed = result.robotsTag === route.expected;
      if (passed) {
        console.log(`✅ PASS: Header matches expected value`);
      } else {
        console.log(`❌ FAIL: Expected '${route.expected}', got '${result.robotsTag}'`);
      }

      // Store result for JSON output
      results.push({
        route: route,
        status: result.statusCode,
        robotsTag: result.robotsTag,
        passed: passed,
        headers: result.headers
      });

    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
      
      // Store error result
      results.push({
        route: route,
        status: 'ERROR',
        error: error.message,
        passed: false
      });
      
      if (error.message.includes('ECONNREFUSED')) {
        console.log('💡 Make sure the dev server is running on port 3002');
        console.log('   Run: npm run dev');
        break;
      }
    }
  }

  // Save results to JSON file in reports directory
  const scriptDir = path.dirname(__filename);
  const reportsDir = path.join(scriptDir, 'reports');
  
  // Create reports directory if it doesn't exist
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const outputFile = path.join(reportsDir, 'x_robots_tag_results.json');
  const outputData = {
    timestamp: Date.now(),
    results: results
  };
  
  fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));
  console.log(`\n📊 Results saved to ${outputFile}`);

  console.log('\n' + '=' .repeat(50));
  console.log('✅ Test completed!');
}

// Check if server is accessible first
async function checkServer() {
  try {
    await testHeaders('localhost:3002', '/');
    console.log('✅ Server is accessible on port 3002');
    return true;
  } catch (error) {
    console.log('❌ Server not accessible on port 3002');
    console.log('   Please start the development server:');
    console.log('   cd site && npm run dev');
    return false;
  }
}

// Run the test
checkServer().then(serverOk => {
  if (serverOk) {
    runTests();
  }
});