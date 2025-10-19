#!/usr/bin/env node
/**
 * Production Environment Validator for CI/CD
 * 
 * Validates that all critical environment variables are set and not placeholders.
 * This script is designed to run in CI pipelines to catch configuration issues
 * before deployment.
 * 
 * Exit codes:
 * - 0: All critical env vars are valid
 * - 1: Missing or placeholder values detected
 * 
 * Usage:
 *   NODE_ENV=production node scripts/validate-production-env.js
 */

import { CRITICAL_ENV_VARS, PLACEHOLDER_VALUES, ENV_VAR_GROUPS } from '../site/src/lib/env.required.mjs';

// Color codes for terminal output (disabled in CI if NO_COLOR is set)
const colors = {
  reset: process.env.NO_COLOR ? '' : '\x1b[0m',
  red: process.env.NO_COLOR ? '' : '\x1b[31m',
  green: process.env.NO_COLOR ? '' : '\x1b[32m',
  yellow: process.env.NO_COLOR ? '' : '\x1b[33m',
  blue: process.env.NO_COLOR ? '' : '\x1b[34m',
  cyan: process.env.NO_COLOR ? '' : '\x1b[36m',
};

/**
 * Check if a value is a placeholder that should be rejected in production
 * @param {string} value - The environment variable value to check
 * @returns {boolean} True if the value is a placeholder
 */
function isPlaceholderValue(value) {
  if (!value || typeof value !== 'string') return true;
  
  const normalizedValue = value.toLowerCase().trim();
  
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
 * Validate production environment variables
 * @returns {boolean} True if all validations pass
 */
function validateProductionEnv() {
  console.log(`${colors.blue}🔍 Validating production environment configuration...${colors.reset}\n`);

  // Group errors by category
  const errorsByGroup = {};
  let hasErrors = false;
  let validCount = 0;
  
  // Check each critical environment variable
  for (const envVar of CRITICAL_ENV_VARS) {
    const value = process.env[envVar];
    let error = null;
    
    if (!value) {
      error = `${envVar} is not set`;
    } else if (isPlaceholderValue(value)) {
      // Mask the actual value to avoid leaking secrets in logs
      const maskedValue = value.length > 20 ? value.substring(0, 20) + '...' : value;
      error = `${envVar} contains placeholder/invalid value`;
    }

    if (error) {
      hasErrors = true;
      // Find which group this variable belongs to
      for (const [groupKey, groupConfig] of Object.entries(ENV_VAR_GROUPS)) {
        if (groupConfig.variables.includes(envVar)) {
          if (!errorsByGroup[groupKey]) {
            errorsByGroup[groupKey] = {
              ...groupConfig,
              errors: []
            };
          }
          errorsByGroup[groupKey].errors.push(error);
          break;
        }
      }
    } else {
      validCount++;
      console.log(`${colors.green}✓${colors.reset} ${envVar} is configured`);
    }
  }

  console.log(''); // Spacing

  if (hasErrors) {
    console.error(`${colors.red}❌ Environment validation failed!${colors.reset}`);
    console.error(`${colors.yellow}Found ${Object.keys(errorsByGroup).length} category(ies) with issues:\n${colors.reset}`);
    
    // Display errors grouped by category
    for (const [groupKey, groupData] of Object.entries(errorsByGroup)) {
      console.error(`${colors.cyan}📁 ${groupData.name}${colors.reset} (${groupData.description})`);
      groupData.errors.forEach(error => console.error(`   ${colors.red}❌${colors.reset} ${error}`));
      console.error(`   ${colors.yellow}💡${colors.reset} ${groupData.guidance}`);
      console.error(''); // Empty line for spacing
    }
    
    console.error(`${colors.blue}📚 For setup instructions, see docs/DEPLOY.md${colors.reset}`);
    console.error(`${colors.blue}🔧 Set these variables in your deployment platform or CI secrets${colors.reset}\n`);
    
    return false;
  }

  console.log(`${colors.green}✅ All ${validCount} critical environment variables are properly configured!${colors.reset}\n`);
  return true;
}

// Only run validation in production mode
if (process.env.NODE_ENV !== 'production') {
  console.log(`${colors.yellow}⚠️  Skipping validation - not in production mode (NODE_ENV=${process.env.NODE_ENV})${colors.reset}`);
  process.exit(0);
}

// Run validation and exit with appropriate code
const isValid = validateProductionEnv();
process.exit(isValid ? 0 : 1);
