#!/usr/bin/env node

/**
 * Verification Script: 3D Consent Independence
 * 
 * Validates that 3D components do not gate rendering on cookie consent.
 * This script performs static analysis on the codebase.
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(message) {
  console.log('\n' + '='.repeat(60));
  log(message, 'cyan');
  console.log('='.repeat(60) + '\n');
}

// Files to check
const filesToCheck = [
  'src/components/Dynamic3DWrapper.tsx',
  'src/components/Scene3D.tsx',
  'src/components/HeroCanvas.tsx',
];

// Patterns that should NOT appear in 3D components
const forbiddenPatterns = [
  {
    pattern: /useCookieConsent/g,
    description: 'Cookie consent hook usage',
    severity: 'error'
  },
  {
    pattern: /cookieConsent/g,
    description: 'Cookie consent variable reference',
    severity: 'error'
  },
  {
    pattern: /hasAccepted.*analytics/gi,
    description: 'Analytics consent check',
    severity: 'error'
  },
  {
    pattern: /shouldRender3D/g,
    description: 'shouldRender3D conditional gate (removed)',
    severity: 'error'
  },
  {
    pattern: /if\s*\([^)]*consent[^)]*\)\s*\{[^}]*return/gi,
    description: 'Conditional return based on consent',
    severity: 'error'
  }
];

// Patterns that SHOULD appear (required features)
const requiredPatterns = [
  {
    pattern: /AdaptiveDpr/,
    file: 'src/components/Scene3D.tsx',
    description: 'AdaptiveDpr performance feature'
  },
  {
    pattern: /PerformanceMonitor/,
    file: 'src/components/Scene3D.tsx',
    description: 'PerformanceMonitor performance feature'
  },
  {
    pattern: /hasWebGL/,
    file: 'src/components/Dynamic3DWrapper.tsx',
    description: 'WebGL capability check (only acceptable gate)'
  }
];

header('3D Consent Independence Verification');

let totalErrors = 0;
let totalWarnings = 0;

// Check for forbidden patterns
filesToCheck.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  
  if (!fs.existsSync(filePath)) {
    log(`⚠️  File not found: ${file}`, 'yellow');
    totalWarnings++;
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  log(`\n📄 Checking: ${file}`, 'blue');
  
  let fileHasIssues = false;
  
  forbiddenPatterns.forEach(({ pattern, description, severity }) => {
    const matches = content.match(pattern);
    if (matches) {
      fileHasIssues = true;
      const color = severity === 'error' ? 'red' : 'yellow';
      log(`  ${severity === 'error' ? '❌' : '⚠️ '} ${description}: Found ${matches.length} occurrence(s)`, color);
      
      if (severity === 'error') {
        totalErrors++;
      } else {
        totalWarnings++;
      }
      
      // Show line numbers
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (pattern.test(line)) {
          log(`     Line ${index + 1}: ${line.trim().substring(0, 80)}`, color);
        }
      });
    }
  });
  
  if (!fileHasIssues) {
    log('  ✅ No forbidden patterns found', 'green');
  }
});

// Check for required patterns
header('Required Features Verification');

requiredPatterns.forEach(({ pattern, file, description }) => {
  const filePath = path.join(__dirname, '..', file);
  
  if (!fs.existsSync(filePath)) {
    log(`⚠️  File not found: ${file}`, 'yellow');
    totalWarnings++;
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  if (pattern.test(content)) {
    log(`✅ ${description} - Present in ${file}`, 'green');
  } else {
    log(`❌ ${description} - Missing from ${file}`, 'red');
    totalErrors++;
  }
});

// Check for WebGL-only gating
header('Rendering Gate Analysis');

const wrapperPath = path.join(__dirname, '..', 'src/components/Dynamic3DWrapper.tsx');
if (fs.existsSync(wrapperPath)) {
  const content = fs.readFileSync(wrapperPath, 'utf8');
  
  // Check that WebGL is the only rendering gate
  const hasWebGLGate = /if\s*\(\s*!hasWebGL\s*\)/.test(content);
  const hasOtherGates = /if\s*\(\s*!hasWebGL\s*\|\|\s*!/.test(content);
  
  if (hasWebGLGate && !hasOtherGates) {
    log('✅ WebGL is the ONLY rendering gate (correct)', 'green');
  } else if (!hasWebGLGate) {
    log('❌ Missing WebGL capability check', 'red');
    totalErrors++;
  } else {
    log('❌ Additional gates found beyond WebGL check', 'red');
    totalErrors++;
  }
} else {
  log('⚠️  Dynamic3DWrapper.tsx not found', 'yellow');
  totalWarnings++;
}

// Suspense independence check
header('Suspense Independence Verification');

filesToCheck.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  
  if (!fs.existsSync(filePath)) {
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check if Suspense fallback depends on any hooks that might wait
  const hasSuspense = /<Suspense/.test(content);
  const suspenseDependsOnConsent = /<Suspense[^>]*fallback[^>]*consent/gi.test(content);
  
  if (hasSuspense) {
    if (!suspenseDependsOnConsent) {
      log(`✅ ${file}: Suspense fallback is independent`, 'green');
    } else {
      log(`❌ ${file}: Suspense fallback depends on consent`, 'red');
      totalErrors++;
    }
  }
});

// Final summary
header('Verification Summary');

if (totalErrors === 0 && totalWarnings === 0) {
  log('🎉 ALL CHECKS PASSED!', 'green');
  log('3D components are fully independent of cookie consent.', 'green');
  process.exit(0);
} else {
  if (totalErrors > 0) {
    log(`❌ ${totalErrors} error(s) found`, 'red');
  }
  if (totalWarnings > 0) {
    log(`⚠️  ${totalWarnings} warning(s) found`, 'yellow');
  }
  
  if (totalErrors > 0) {
    log('\n🔴 VERIFICATION FAILED - Please fix errors above', 'red');
    process.exit(1);
  } else {
    log('\n🟡 VERIFICATION PASSED WITH WARNINGS', 'yellow');
    process.exit(0);
  }
}
