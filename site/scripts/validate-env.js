#!/usr/bin/env node

/**
 * Build-time environment validation script
 * Quality gate that fails CI/production builds if critical environment variables are missing or contain placeholder values
 * Provides grouped error reporting and remediation hints for better developer experience
 */

// Import from shared module
const {
  CRITICAL_ENV_VARS,
  PLACEHOLDER_VALUES,
  ENV_VAR_GROUPS,
  isProductionBuild,
  isPlaceholderValue
} = require("../src/lib/env.required.cjs");

/**
 * Group errors by configuration area for better reporting
 */
function groupErrorsByCategory(errors) {
  const grouped = {};
  
  for (const error of errors) {
    let category = 'general';
    let group = null;
    
    // Find which group this variable belongs to
    for (const [key, groupConfig] of Object.entries(ENV_VAR_GROUPS)) {
      if (groupConfig.variables.some(v => error.variable === v)) {
        category = key;
        group = groupConfig;
        break;
      }
    }
    
    if (!grouped[category]) {
      grouped[category] = {
        name: group?.name || 'General Configuration',
        description: group?.description || 'General configuration variables',
        guidance: group?.guidance || 'Configure according to deployment documentation',
        errors: []
      };
    }
    
    grouped[category].errors.push(error);
  }
  
  return grouped;
}

/**
 * Format grouped errors for CI/terminal display
 */
function formatGroupedErrors(groupedErrors) {
  const sections = [];
  
  for (const [category, group] of Object.entries(groupedErrors)) {
    sections.push([
      `🔧 ${group.name}`,
      `   ${group.description}`,
      '',
      ...group.errors.map(error => {
        if (error.type === 'missing') {
          return `   ❌ ${error.variable}: Missing required value`;
        } else if (error.type === 'placeholder') {
          return `   ❌ ${error.variable}: Contains placeholder value "${error.value}"`;
        } else if (error.type === 'invalid') {
          return `   ❌ ${error.variable}: ${error.message}`;
        }
        return `   ❌ ${error.variable}: ${error.message || 'Invalid value'}`;
      }),
      '',
      `   💡 Guidance: ${group.guidance}`,
      ''
    ].join('\n'));
  }
  
  return sections.join('\n');
}

/**
 * Validate critical environment variables with grouped error reporting
 */
function validateEnvironment() {
  const errors = [];
  const warnings = [];
  const isProduction = isProductionBuild();
  
  console.log(`🔍 Environment Validation Quality Gate`);
  console.log(`   Mode: ${isProduction ? 'Production Build' : 'Development'}${process.env.CI ? ' (CI)' : ''}`);
  console.log(`   Phase: ${process.env.NEXT_PHASE || 'runtime'}\n`);

  // Check critical environment variables
  for (const envVar of CRITICAL_ENV_VARS) {
    const value = process.env[envVar];

    if (!value) {
      errors.push({
        variable: envVar,
        type: 'missing',
        message: 'Missing required value'
      });
    } else if (isPlaceholderValue(value)) {
      errors.push({
        variable: envVar,
        type: 'placeholder',
        value,
        message: `Contains placeholder value "${value}"`
      });
    } else {
      console.log(`✅ ${envVar}: configured`);
    }
  }

  // Special validation for URL format
  const siteUrl = process.env.SITE_URL;
  if (siteUrl && !isPlaceholderValue(siteUrl)) {
    try {
      const url = new URL(siteUrl);
      if (url.protocol !== "https:" && isProduction) {
        warnings.push(
          `⚠️  SITE_URL should use HTTPS in production: ${siteUrl}`,
        );
      }
      if (siteUrl.endsWith("/")) {
        warnings.push(`⚠️  SITE_URL should not end with a slash: ${siteUrl}`);
      }
    } catch (e) {
      errors.push({
        variable: 'SITE_URL',
        type: 'invalid',
        value: siteUrl,
        message: `Not a valid URL: ${siteUrl}`
      });
    }
  }

  // Check for email format in CONTACT_INBOX
  const contactInbox = process.env.CONTACT_INBOX;
  if (contactInbox && !isPlaceholderValue(contactInbox)) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactInbox)) {
      errors.push({
        variable: 'CONTACT_INBOX',
        type: 'invalid',
        value: contactInbox,
        message: `Not a valid email address: ${contactInbox}`
      });
    }
  }

  // Display warnings
  if (warnings.length > 0) {
    console.log("\n⚠️  Configuration Warnings:");
    warnings.forEach((warning) => console.log(`   ${warning}`));
  }

  // Handle errors with grouped reporting
  if (errors.length > 0) {
    const groupedErrors = groupErrorsByCategory(errors);
    
    console.log("\n🚨 QUALITY GATE FAILED: Environment Validation Errors");
    console.log("=".repeat(60));
    console.log(formatGroupedErrors(groupedErrors));
    
    console.log("� Remediation Steps:");
    console.log("   1. Set all required environment variables in your deployment platform");
    console.log("   2. Replace placeholder values with real configuration");
    console.log("   3. Verify values meet format requirements (URLs, emails, etc.)");
    console.log("   4. For local development: copy .env.example to .env.local");
    console.log("\n📚 Documentation: docs/DEPLOY_CHECKLIST.md");
    console.log("🔗 Environment Setup: docs/GOOGLE_SETUP.md");
    
    if (process.env.CI) {
      console.log("\n::error::Environment validation failed - see logs above for details");
    }

    process.exit(1);
  }

  console.log("\n✅ Environment Validation Quality Gate: PASSED");
  console.log("   All critical environment variables are properly configured");
  console.log("   Build can proceed safely\n");
}

// Run validation based on context
const shouldValidate = isProductionBuild() || process.env.FORCE_ENV_VALIDATION === 'true';

if (shouldValidate) {
  validateEnvironment();
} else {
  console.log("⏭️  Environment Validation Quality Gate: SKIPPED");
  console.log("   (Development mode - validation only runs for production builds)");
  console.log("   To force validation: FORCE_ENV_VALIDATION=true npm run validate-env\n");
}
