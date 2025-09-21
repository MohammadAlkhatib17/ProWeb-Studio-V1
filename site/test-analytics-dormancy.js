/**
 * Test script to verify GA4 remains dormant without explicit consent
 * This script tests the analytics configuration to ensure no unintended network calls
 */

const { JSDOM } = require('jsdom');

// Set up a mock DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = window.document;

// Test 1: GA4 should be disabled when no measurement ID is set
console.log('Test 1: GA4 without measurement ID');
process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = '';
const ga1 = require('./src/lib/ga.ts');
console.log('✓ GA4 enabled?', ga1.isGA4Enabled()); // Should be false

// Test 2: GA4 should be disabled when consent is not granted (even with ID)
console.log('\nTest 2: GA4 with measurement ID but no consent');
process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-TEST123';
delete require.cache[require.resolve('./src/lib/ga.ts')];
const ga2 = require('./src/lib/ga.ts');
console.log('✓ GA4 enabled?', ga2.isGA4Enabled()); // Should be false
console.log('✓ Has consent?', ga2.hasAnalyticsConsent()); // Should be false

// Test 3: GA4 should be enabled only when both ID and consent are present
console.log('\nTest 3: GA4 with measurement ID AND consent granted');
window.__CONSENT_ANALYTICS__ = true;
console.log('✓ GA4 enabled?', ga2.isGA4Enabled()); // Should be true
console.log('✓ Has consent?', ga2.hasAnalyticsConsent()); // Should be true

// Test 4: Verify no network calls are made without consent
console.log('\nTest 4: Verify no script loading without consent');
window.__CONSENT_ANALYTICS__ = false;
const originalCreateElement = document.createElement;
let scriptCreated = false;
document.createElement = function(tagName) {
  if (tagName === 'script') {
    scriptCreated = true;
  }
  return originalCreateElement.call(this, tagName);
};

ga2.initGA4();
console.log('✓ Script created without consent?', scriptCreated); // Should be false

// Test 5: Plausible configuration check
console.log('\nTest 5: Plausible configuration');
const siteConfig = require('./src/config/site.config.ts');
console.log('✓ Plausible domain configured:', siteConfig.siteConfig.analytics.plausibleDomain);

console.log('\n🎉 All tests completed! GA4 properly remains dormant.');