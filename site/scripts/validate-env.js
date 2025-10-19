#!/usr/bin/env node

/**
 * Build-time environment validation script
 * Fails the build if critical environment variables are missing or contain placeholder values
 */

// Import from shared module
const { CRITICAL_ENV_VARS, PLACEHOLDER_VALUES } = require('../src/lib/env.required.cjs');

/**
 * Check if a value is a placeholder or invalid
 */
function isPlaceholderValue(value) {
  if (!value || typeof value !== 'string') return true;
  
  const normalizedValue = value.toLowerCase().trim();
  
  // Check against known placeholder patterns
  return PLACEHOLDER_VALUES.some(placeholder => 
    normalizedValue === placeholder.toLowerCase() ||
    normalizedValue.includes('placeholder') ||
    normalizedValue.includes('example') ||
    normalizedValue.includes('your_') ||
    normalizedValue.includes('changeme') ||
    normalizedValue === 'localhost:3000' ||
    normalizedValue === 'http://localhost:3000'
  );
}

/**
 * Validate critical environment variables
 */
function validateEnvironment() {
  const errors = [];
  const warnings = [];
  
  console.log('🔍 Validating environment variables for production build...\n');
  
  // Check critical environment variables
  for (const envVar of CRITICAL_ENV_VARS) {
    const value = process.env[envVar];
    
    if (!value) {
      errors.push(`❌ ${envVar} is not set`);
    } else if (isPlaceholderValue(value)) {
      errors.push(`❌ ${envVar} contains placeholder value: "${value}"`);
    } else {
      console.log(`✅ ${envVar}: configured`);
    }
  }
  
  // Special validation for URL format
  const siteUrl = process.env.SITE_URL;
  if (siteUrl && !isPlaceholderValue(siteUrl)) {
    try {
      const url = new URL(siteUrl);
      if (url.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
        warnings.push(`⚠️  SITE_URL should use HTTPS in production: ${siteUrl}`);
      }
      if (siteUrl.endsWith('/')) {
        warnings.push(`⚠️  SITE_URL should not end with a slash: ${siteUrl}`);
      }
    } catch (e) {
      errors.push(`❌ SITE_URL is not a valid URL: ${siteUrl}`);
    }
  }
  
  // Check for email format in CONTACT_INBOX
  const contactInbox = process.env.CONTACT_INBOX;
  if (contactInbox && !isPlaceholderValue(contactInbox)) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactInbox)) {
      errors.push(`❌ CONTACT_INBOX is not a valid email address: ${contactInbox}`);
    }
  }
  
  // Display warnings
  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(warning => console.log(`   ${warning}`));
  }
  
  // Display errors and exit if any
  if (errors.length > 0) {
    console.log('\n🚨 Build validation failed! Critical environment variables are missing or invalid:\n');
    errors.forEach(error => console.log(`   ${error}`));
    console.log('\n💡 To fix this:');
    console.log('   1. Set the required environment variables in your deployment platform');
    console.log('   2. Ensure all values are real, not placeholders');
    console.log('   3. For local development, copy .env.example to .env.local and fill in real values');
    console.log('\n📚 See docs/DEPLOY_CHECKLIST.md for detailed setup instructions\n');
    
    process.exit(1);
  }
  
  console.log('\n✅ All critical environment variables are properly configured!');
  console.log('   Build can proceed safely.\n');
}

// Only run validation for production builds
if (process.env.NODE_ENV === 'production') {
  validateEnvironment();
} else {
  console.log('⏭️  Skipping environment validation (not a production build)\n');
}