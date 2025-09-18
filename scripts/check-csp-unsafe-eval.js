#!/usr/bin/env node

/**
 * CSP unsafe-eval Detection Script
 * Checks if unsafe-eval directive is present in CSP configurations
 * Fails CI if unsafe-eval is found after it was intentionally removed
 */

const fs = require('fs');
const path = require('path');

const CSP_CONFIG_FILES = [
  'site/next.config.mjs',
  'site/src/middleware.ts',
  'site/next.config.js'
];

const CSP_PATTERNS = [
  /Content-Security-Policy['"]?\s*:\s*['"`]([^'"`]*unsafe-eval[^'"`]*)/gi,
  /Content-Security-Policy-Report-Only['"]?\s*:\s*['"`]([^'"`]*unsafe-eval[^'"`]*)/gi,
  /'unsafe-eval'/gi,
  /"unsafe-eval"/gi,
  /script-src[^;]*unsafe-eval/gi
];

/**
 * Check a file for unsafe-eval usage in CSP
 */
function checkFileForUnsafeEval(filePath) {
  if (!fs.existsSync(filePath)) {
    return { found: false, matches: [] };
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const matches = [];

  // Check each pattern
  for (const pattern of CSP_PATTERNS) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const lines = content.substring(0, match.index).split('\n');
      const lineNumber = lines.length;
      const lineContent = lines[lineNumber - 1].trim();
      
      matches.push({
        pattern: pattern.source,
        lineNumber,
        lineContent,
        match: match[0]
      });
    }
    // Reset regex global state
    pattern.lastIndex = 0;
  }

  return {
    found: matches.length > 0,
    matches
  };
}

/**
 * Check for exceptions (commented code, documentation)
 */
function isExceptionLine(lineContent) {
  const trimmed = lineContent.trim();
  
  // Skip commented lines
  if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
    return true;
  }
  
  // Skip documentation blocks
  if (trimmed.includes('* Removed unsafe-eval') || 
      trimmed.includes('// Removed unsafe-eval') ||
      trimmed.includes('monitoring for violations')) {
    return true;
  }
  
  return false;
}

/**
 * Main validation function
 */
function validateCSPConfiguration() {
  let violations = [];
  let filesChecked = 0;

  console.log('🔍 Checking CSP configuration for unsafe-eval directive...\n');

  for (const filePath of CSP_CONFIG_FILES) {
    const fullPath = path.resolve(filePath);
    const result = checkFileForUnsafeEval(fullPath);
    
    if (fs.existsSync(fullPath)) {
      filesChecked++;
      console.log(`📁 Checking: ${filePath}`);
      
      if (result.found) {
        // Filter out exceptions
        const realViolations = result.matches.filter(match => 
          !isExceptionLine(match.lineContent)
        );
        
        if (realViolations.length > 0) {
          violations.push({
            file: filePath,
            violations: realViolations
          });
          
          console.log(`   ❌ Found unsafe-eval in ${filePath}:`);
          realViolations.forEach(violation => {
            console.log(`      Line ${violation.lineNumber}: ${violation.lineContent}`);
          });
        } else {
          console.log(`   ✅ No active unsafe-eval found (only in comments/docs)`);
        }
      } else {
        console.log(`   ✅ No unsafe-eval found`);
      }
    } else {
      console.log(`   ⏭️  File not found: ${filePath}`);
    }
  }

  console.log(`\n📊 Summary: Checked ${filesChecked} files\n`);

  if (violations.length > 0) {
    console.log('🚨 CSP Validation Failed!\n');
    console.log('   The following files contain unsafe-eval directive in active CSP policies:\n');
    
    violations.forEach(({ file, violations: fileViolations }) => {
      console.log(`   📄 ${file}:`);
      fileViolations.forEach(violation => {
        console.log(`      • Line ${violation.lineNumber}: ${violation.match}`);
      });
      console.log('');
    });
    
    console.log('💡 Resolution:');
    console.log('   1. Remove unsafe-eval from all active CSP policies');
    console.log('   2. Use nonces, hashes, or strict-dynamic for dynamic scripts');
    console.log('   3. If eval() is absolutely necessary, consider refactoring');
    console.log('   4. Check reports/security/csp-status.md for guidance\n');
    
    process.exit(1);
  }

  console.log('✅ CSP Configuration Clean!');
  console.log('   No unsafe-eval directive found in active CSP policies.');
  console.log('   Security posture maintained.\n');
}

// Run the validation
validateCSPConfiguration();