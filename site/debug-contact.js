// Debug script to test the contact route
import { NextRequest } from 'next/server';

// Mock NextRequest
const mockRequest = {
  json: () => Promise.resolve({
    name: 'Test User',
    email: 'test@example.com',
    projectTypes: ['website'],
    message: 'Test message',
    recaptchaToken: 'test-token',
    timestamp: Date.now()
  }),
  headers: new Map([
    ['x-forwarded-for', '127.0.0.1'],
    ['origin', 'http://localhost:3000']
  ])
};

async function testContactRoute() {
  try {
    console.log('🔍 Testing contact route imports...');
    
    // Test rate limit import
    const rateLimitModule = await import('./src/lib/rateLimit.ts');
    console.log('✅ Rate limit module imported');
    console.log('Available exports:', Object.keys(rateLimitModule));
    
    // Test contact route import
    const contactModule = await import('./src/app/api/contact/route.ts');
    console.log('✅ Contact route module imported');
    console.log('Available exports:', Object.keys(contactModule));
    
    // Test POST function
    if (contactModule.POST) {
      console.log('✅ POST function found');
    } else {
      console.log('❌ POST function not found');
    }
    
  } catch (error) {
    console.error('❌ Error testing contact route:', error);
  }
}

testContactRoute();