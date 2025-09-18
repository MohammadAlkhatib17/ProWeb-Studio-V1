#!/usr/bin/env node

/**
 * Environment Variable Consumer Validation Script
 * Checks if all environment variable usage in the codebase matches the required list
 * Fails CI if critical env vars are consumed but not listed in src/lib/env.required.mjs
 */

const fs = require('fs');
const path = require('path');

// Import the canonical environment variable lists
const ENV_REQUIRED_PATH = path.resolve('site/src/lib/env.required.mjs');

/**
 * Extract environment variable names from code files
 */
function extractEnvVarsFromFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const envVars = new Set();

  // Match process.env.VARIABLE_NAME patterns
  const envPattern = /process\.env\.([A-Z_][A-Z0-9_]*)/g;
  let match;

  while ((match = envPattern.exec(content)) !== null) {
    const envVar = match[1];
    
    // Skip standard Node.js environment variables
    if (!['NODE_ENV', 'VERCEL_ENV', 'VERCEL_URL'].includes(envVar)) {
      envVars.add(envVar);
    }
  }

  return Array.from(envVars);
}

/**
 * Recursively find files with given extensions
 */
function findFiles(dir, extensions, excludeDirs = []) {
  const files = [];
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip excluded directories
        if (!excludeDirs.includes(item) && !item.startsWith('.')) {
          files.push(...findFiles(fullPath, extensions, excludeDirs));
        }
      } else if (stat.isFile()) {
        // Check if file has one of the target extensions
        const ext = path.extname(item);
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    // Skip directories we can't read
  }
  
  return files;
}

/**
 * Load the canonical environment variable lists
 */
async function loadRequiredEnvVars() {
  try {
    // Use dynamic import for ES modules
    const envModule = await import('file://' + ENV_REQUIRED_PATH);
    
    return {
      critical: envModule.CRITICAL_ENV_VARS || [],
      url: envModule.URL_VARS || [],
      recommended: envModule.RECOMMENDED_ENV_VARS || [],
      optional: envModule.OPTIONAL_ENV_VARS || [],
      development: envModule.DEVELOPMENT_ENV_VARS || [],
      placeholder: envModule.PLACEHOLDER_VALUES || []
    };
  } catch (error) {
    console.error(`❌ Failed to load environment variables from ${ENV_REQUIRED_PATH}:`, error.message);
    process.exit(1);
  }
}

/**
 * Find all relevant source files
 */
function findSourceFiles() {
  const files = [];
  
  // Search in site/src directory
  if (fs.existsSync('site/src')) {
    files.push(...findFiles('site/src', ['.ts', '.tsx', '.js', '.jsx'], ['node_modules', '.next', 'dist']));
  }
  
  // Add specific config files
  const configFiles = [
    'site/next.config.mjs',
    'site/middleware.ts'
  ];
  
  configFiles.forEach(file => {
    if (fs.existsSync(file)) {
      files.push(file);
    }
  });

  // Filter out test files and the env.required file itself
  return files.filter(file => 
    !file.includes('.test.') && 
    !file.includes('.spec.') && 
    !file.includes('env.required.')
  );
}

/**
 * Get all environment variables used in the codebase
 */
function getAllUsedEnvVars(files) {
  const allEnvVars = new Set();
  const fileUsage = {};

  files.forEach(file => {
    const envVars = extractEnvVarsFromFile(file);
    if (envVars.length > 0) {
      fileUsage[file] = envVars;
      envVars.forEach(envVar => allEnvVars.add(envVar));
    }
  });

  return {
    allVars: Array.from(allEnvVars),
    fileUsage
  };
}

/**
 * Categorize environment variables
 */
function categorizeEnvVars(usedVars, requiredLists) {
  const allRequired = [
    ...requiredLists.critical,
    ...requiredLists.url,
    ...requiredLists.recommended,
    ...requiredLists.optional,
    ...requiredLists.development
  ];

  const categories = {
    critical: usedVars.filter(v => requiredLists.critical.includes(v)),
    url: usedVars.filter(v => requiredLists.url.includes(v)),
    recommended: usedVars.filter(v => requiredLists.recommended.includes(v)),
    optional: usedVars.filter(v => requiredLists.optional.includes(v)),
    development: usedVars.filter(v => requiredLists.development.includes(v)),
    unlisted: usedVars.filter(v => !allRequired.includes(v))
  };

  // Find required variables that are NOT being used
  categories.unusedRequired = requiredLists.critical.filter(v => !usedVars.includes(v));

  return categories;
}

/**
 * Main validation function
 */
async function validateEnvironmentConsumers() {
  console.log('🔍 Validating environment variable usage consistency...\n');

  // Load required environment variables
  const requiredLists = await loadRequiredEnvVars();
  console.log(`📋 Loaded canonical env var lists from ${ENV_REQUIRED_PATH}`);
  console.log(`   Critical: ${requiredLists.critical.length} vars`);
  console.log(`   URL: ${requiredLists.url.length} vars`);
  console.log(`   Recommended: ${requiredLists.recommended.length} vars`);
  console.log(`   Optional: ${requiredLists.optional.length} vars`);
  console.log(`   Development: ${requiredLists.development.length} vars\n`);

  // Find all source files
  const sourceFiles = findSourceFiles();
  console.log(`📁 Scanning ${sourceFiles.length} source files for env var usage...\n`);

  // Extract all used environment variables
  const { allVars, fileUsage } = getAllUsedEnvVars(sourceFiles);
  console.log(`🔎 Found ${allVars.length} unique environment variables in use:\n`);

  // Categorize the variables
  const categories = categorizeEnvVars(allVars, requiredLists);

  // Display results
  console.log('📊 Environment Variable Analysis:');
  console.log('================================\n');

  console.log(`✅ Critical variables in use: ${categories.critical.length}`);
  if (categories.critical.length > 0) {
    categories.critical.forEach(v => console.log(`   • ${v}`));
    console.log('');
  }

  console.log(`🔗 URL variables in use: ${categories.url.length}`);
  if (categories.url.length > 0) {
    categories.url.forEach(v => console.log(`   • ${v}`));
    console.log('');
  }

  console.log(`📝 Recommended variables in use: ${categories.recommended.length}`);
  if (categories.recommended.length > 0) {
    categories.recommended.forEach(v => console.log(`   • ${v}`));
    console.log('');
  }

  console.log(`📄 Optional variables in use: ${categories.optional.length}`);
  if (categories.optional.length > 0) {
    categories.optional.forEach(v => console.log(`   • ${v}`));
    console.log('');
  }

  console.log(`🔧 Development variables in use: ${categories.development.length}`);
  if (categories.development.length > 0) {
    categories.development.forEach(v => console.log(`   • ${v}`));
    console.log('');
  }

  // Check for issues
  let hasErrors = false;

  // Issue 1: Variables used but not in required lists
  if (categories.unlisted.length > 0) {
    hasErrors = true;
    console.log(`❌ Unlisted variables found (${categories.unlisted.length}):`);
    console.log('   These environment variables are used in code but not declared in env.required.mjs:\n');
    
    categories.unlisted.forEach(envVar => {
      console.log(`   🔴 ${envVar}`);
      console.log('      Used in:');
      Object.entries(fileUsage).forEach(([file, vars]) => {
        if (vars.includes(envVar)) {
          console.log(`         • ${file}`);
        }
      });
      console.log('');
    });
  }

  // Issue 2: Critical variables declared but not used
  if (categories.unusedRequired.length > 0) {
    console.log(`⚠️  Unused critical variables (${categories.unusedRequired.length}):`);
    console.log('   These critical variables are declared but not used in code:\n');
    categories.unusedRequired.forEach(v => console.log(`   • ${v}`));
    console.log('\n   This might indicate missing functionality or outdated requirements.\n');
  }

  // Summary
  if (hasErrors) {
    console.log('🚨 Environment Variable Validation Failed!\n');
    console.log('💡 Resolution:');
    console.log('   1. Add unlisted environment variables to site/src/lib/env.required.mjs');
    console.log('   2. Categorize them as CRITICAL_ENV_VARS, URL_VARS, RECOMMENDED_ENV_VARS,');
    console.log('      OPTIONAL_ENV_VARS, or DEVELOPMENT_ENV_VARS');
    console.log('   3. Update .env.example with documentation for new variables');
    console.log('   4. Consider if any unlisted variables should be removed from code\n');
    console.log('   This ensures the deployment validation matches actual code usage.\n');
    
    process.exit(1);
  }

  console.log('✅ Environment Variable Validation Passed!');
  console.log('   All environment variables in use are properly declared.');
  console.log('   Deployment validation will match actual code requirements.\n');
}

// Run the validation
validateEnvironmentConsumers().catch(error => {
  console.error('❌ Validation failed:', error.message);
  process.exit(1);
});