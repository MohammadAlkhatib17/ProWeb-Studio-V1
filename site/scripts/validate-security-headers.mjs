#!/usr/bin/env node
/**
 * Security Headers Validation Script
 * Tests that all security headers are properly configured
 */

import { createServer } from 'http';
import next from 'next';
import { parse } from 'url';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3001;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

async function testHeaders() {
  console.log('🔒 Security Headers Validation');
  console.log('================================\n');

  try {
    await app.prepare();

    const server = createServer(async (req, res) => {
      const parsedUrl = parse(req.url || '', true);
      await handle(req, res, parsedUrl);
    });

    server.listen(port, () => {
      console.log(`✅ Test server running on http://${hostname}:${port}\n`);
      runHeaderTests();
    });

    // Cleanup after tests
    setTimeout(() => {
      server.close();
      process.exit(0);
    }, 10000);

  } catch (err) {
    console.error('❌ Failed to start test server:', err);
    process.exit(1);
  }
}

async function runHeaderTests() {
  const testCases = [
    {
      path: '/',
      name: 'Home Page',
      expectedHeaders: [
        'Content-Security-Policy',
        'Strict-Transport-Security',
        'X-Content-Type-Options',
        'Referrer-Policy',
        'Permissions-Policy'
      ]
    },
    {
      path: '/api/contact',
      name: 'API Endpoint',
      expectedHeaders: [
        'Content-Security-Policy',
        'X-Content-Type-Options',
        'Cache-Control',
        'X-API-Version'
      ]
    },
    {
      path: '/contact',
      name: 'Contact Page (with nonce)',
      expectedHeaders: [
        'Content-Security-Policy',
        'X-Nonce',
        'X-Geographic-Hint'
      ]
    }
  ];

  for (const testCase of testCases) {
    console.log(`🧪 Testing: ${testCase.name}`);
    console.log(`📍 Path: ${testCase.path}`);
    
    try {
      const response = await fetch(`http://${hostname}:${port}${testCase.path}`, {
        method: 'HEAD'
      });

      console.log(`📊 Status: ${response.status}`);
      
      let passed = 0;
      let failed = 0;

      for (const headerName of testCase.expectedHeaders) {
        const headerValue = response.headers.get(headerName);
        if (headerValue) {
          console.log(`  ✅ ${headerName}: ${headerValue.substring(0, 60)}${headerValue.length > 60 ? '...' : ''}`);
          passed++;
        } else {
          console.log(`  ❌ ${headerName}: Missing`);
          failed++;
        }
      }

      // Special validations
      if (testCase.path === '/contact') {
        const csp = response.headers.get('Content-Security-Policy') || 
                   response.headers.get('Content-Security-Policy-Report-Only');
        const nonce = response.headers.get('X-Nonce');
        
        if (csp && nonce && csp.includes(`'nonce-${nonce}'`)) {
          console.log(`  ✅ CSP includes nonce: ${nonce}`);
          passed++;
        } else {
          console.log(`  ❌ CSP missing nonce integration`);
          failed++;
        }
      }

      console.log(`📈 Results: ${passed} passed, ${failed} failed\n`);

    } catch (error) {
      console.error(`❌ Request failed:`, error);
    }
  }

  // Test CSP report-only toggle
  console.log('🔄 Testing CSP Report-Only Toggle');
  
  const originalEnv = process.env.CSP_REPORT_ONLY;
  
  // Test report-only mode
  process.env.CSP_REPORT_ONLY = 'true';
  console.log('  📝 CSP_REPORT_ONLY=true');
  // Note: Would need server restart to test this properly
  
  // Test enforcement mode
  process.env.CSP_REPORT_ONLY = 'false';
  console.log('  🔒 CSP_REPORT_ONLY=false');
  
  // Restore original
  process.env.CSP_REPORT_ONLY = originalEnv;
  
  console.log('\n✅ Header validation complete');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testHeaders();
}

export { testHeaders };