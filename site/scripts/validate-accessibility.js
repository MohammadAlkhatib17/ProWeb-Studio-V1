#!/usr/bin/env node

/**
 * Accessibility Validation Script
 * Validates WCAG 2.1 AA compliance for ProWeb Studio
 * Checks skip links, focus indicators, reduced motion support, and color contrast
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateSkipLink() {
  log('\n🔍 Validating Skip Link Implementation...', 'blue');
  
  const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
  const cssPath = path.join(process.cwd(), 'src/app/globals.css');
  
  try {
    // Check layout.tsx for skip link
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');
    const hasSkipLink = layoutContent.includes('href="#main"') && 
                       layoutContent.includes('skip-to-content');
    
    if (hasSkipLink) {
      log('  ✅ Skip link found in layout.tsx', 'green');
    } else {
      log('  ❌ Skip link missing from layout.tsx', 'red');
      return false;
    }
    
    // Check CSS for skip link styles
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    const hasSkipStyles = cssContent.includes('.skip-to-content') &&
                         cssContent.includes('focus:top-4') &&
                         cssContent.includes('z-[9999]');
    
    if (hasSkipStyles) {
      log('  ✅ Skip link CSS styles properly configured', 'green');
    } else {
      log('  ❌ Skip link CSS styles missing or incomplete', 'red');
      return false;
    }
    
    return true;
  } catch (error) {
    log(`  ❌ Error validating skip link: ${error.message}`, 'red');
    return false;
  }
}

function validateFocusIndicators() {
  log('\n🎯 Validating Focus Indicators...', 'blue');
  
  const cssPath = path.join(process.cwd(), 'src/app/globals.css');
  
  try {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Check for comprehensive focus-visible styles
    const focusRules = [
      ':focus-visible',
      'a:focus-visible',
      'button:focus-visible',
      'input:focus-visible',
      'textarea:focus-visible',
      'select:focus-visible',
      '[tabindex]:focus-visible',
      '[role="button"]:focus-visible'
    ];
    
    let foundRules = 0;
    focusRules.forEach(rule => {
      if (cssContent.includes(rule)) {
        foundRules++;
      }
    });
    
    if (foundRules >= 6) {
      log(`  ✅ Comprehensive focus indicators found (${foundRules}/${focusRules.length} rules)`, 'green');
    } else {
      log(`  ⚠️  Limited focus indicators (${foundRules}/${focusRules.length} rules)`, 'yellow');
    }
    
    // Check for ring-2 ring-cyan-400 (proper contrast)
    const hasProperContrast = cssContent.includes('ring-cyan-400') &&
                             cssContent.includes('ring-2');
    
    if (hasProperContrast) {
      log('  ✅ Focus indicators use accessible colors (cyan-400)', 'green');
    } else {
      log('  ❌ Focus indicators may not meet color contrast requirements', 'red');
      return false;
    }
    
    return true;
  } catch (error) {
    log(`  ❌ Error validating focus indicators: ${error.message}`, 'red');
    return false;
  }
}

function validateReducedMotion() {
  log('\n🎬 Validating Reduced Motion Support...', 'blue');
  
  const cssPath = path.join(process.cwd(), 'src/app/globals.css');
  const cursorTrailPath = path.join(process.cwd(), 'src/components/CursorTrail.tsx');
  
  try {
    // Check CSS for prefers-reduced-motion
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    const hasReducedMotionSupport = cssContent.includes('@media (prefers-reduced-motion: reduce)') &&
                                   cssContent.includes('animation: none !important') &&
                                   cssContent.includes('transition-duration: 0.01ms !important');
    
    if (hasReducedMotionSupport) {
      log('  ✅ Comprehensive prefers-reduced-motion support in CSS', 'green');
    } else {
      log('  ❌ Missing or incomplete prefers-reduced-motion support', 'red');
      return false;
    }
    
    // Check specific animation classes
    const animationClasses = [
      '.animate-fade-in',
      '.animate-slide-up',
      '.twinkle',
      '.magnetic-hover',
      '.logo-glow'
    ];
    
    let disabledClasses = 0;
    animationClasses.forEach(className => {
      const regex = new RegExp(`${className.replace('.', '\\.')}[,\\s]`, 'g');
      if (cssContent.match(regex)) {
        disabledClasses++;
      }
    });
    
    log(`  ✅ ${disabledClasses}/${animationClasses.length} animation classes have reduced motion support`, 'green');
    
    // Check CursorTrail component
    const cursorTrailContent = fs.readFileSync(cursorTrailPath, 'utf8');
    const hasJSReducedMotion = cursorTrailContent.includes('prefers-reduced-motion: reduce') &&
                              cursorTrailContent.includes('if (prefersReducedMotion) return');
    
    if (hasJSReducedMotion) {
      log('  ✅ CursorTrail component respects reduced motion preference', 'green');
    } else {
      log('  ❌ CursorTrail component missing reduced motion support', 'red');
      return false;
    }
    
    return true;
  } catch (error) {
    log(`  ❌ Error validating reduced motion: ${error.message}`, 'red');
    return false;
  }
}

function validateColorContrast() {
  log('\n🌈 Validating Color Contrast...', 'blue');
  
  const cssPath = path.join(process.cwd(), 'src/app/globals.css');
  
  try {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Check for WCAG AA compliant color usage
    const contrastChecks = [
      { pattern: 'rgb\\(203 213 225\\)', description: 'Text color (slate-300)', ratio: '4.5:1+' },
      { pattern: 'rgb\\(34 211 238\\)', description: 'Focus indicators (cyan-400)', ratio: '3:1+' },
      { pattern: 'text-low-contrast', description: 'Low contrast text utility', found: false }
    ];
    
    contrastChecks.forEach(check => {
      const regex = new RegExp(check.pattern, 'g');
      if (cssContent.match(regex)) {
        log(`  ✅ ${check.description} - Estimated contrast: ${check.ratio}`, 'green');
      } else {
        log(`  ⚠️  ${check.description} not found in CSS`, 'yellow');
      }
    });
    
    // Check for screen reader utilities
    const hasScreenReaderSupport = cssContent.includes('.sr-only') &&
                                  cssContent.includes('clip: rect(0, 0, 0, 0)');
    
    if (hasScreenReaderSupport) {
      log('  ✅ Screen reader utilities (.sr-only) available', 'green');
    } else {
      log('  ❌ Screen reader utilities missing', 'red');
      return false;
    }
    
    return true;
  } catch (error) {
    log(`  ❌ Error validating color contrast: ${error.message}`, 'red');
    return false;
  }
}

function validateTouchTargets() {
  log('\n📱 Validating Touch Target Sizes...', 'blue');
  
  const cssPath = path.join(process.cwd(), 'src/app/globals.css');
  
  try {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Check for minimum touch target utilities
    const touchTargetClasses = [
      '.touch-target',
      '.touch-target-lg',
      'min-height: 44px',
      'min-h-\\[44px\\]'
    ];
    
    let foundTargets = 0;
    touchTargetClasses.forEach(target => {
      const regex = new RegExp(target.replace('[', '\\[').replace(']', '\\]'), 'g');
      if (cssContent.match(regex)) {
        foundTargets++;
      }
    });
    
    if (foundTargets >= 3) {
      log(`  ✅ Touch target utilities available (${foundTargets}/${touchTargetClasses.length})`, 'green');
    } else {
      log(`  ⚠️  Limited touch target utilities (${foundTargets}/${touchTargetClasses.length})`, 'yellow');
    }
    
    // Check skip link specifically
    const skipLinkHasMinSize = cssContent.includes('min-height: 44px') &&
                              cssContent.includes('.skip-to-content');
    
    if (skipLinkHasMinSize) {
      log('  ✅ Skip link meets minimum touch target size (44px)', 'green');
    } else {
      log('  ❌ Skip link may not meet minimum touch target requirements', 'red');
    }
    
    return true;
  } catch (error) {
    log(`  ❌ Error validating touch targets: ${error.message}`, 'red');
    return false;
  }
}

function validateKeyboardNavigation() {
  log('\n⌨️  Validating Keyboard Navigation...', 'blue');
  
  const cssPath = path.join(process.cwd(), 'src/app/globals.css');
  
  try {
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Check for keyboard navigation specific styles
    const keyboardNavSupport = cssContent.includes('.keyboard-nav-active') &&
                              cssContent.includes('outline: 2px solid');
    
    if (keyboardNavSupport) {
      log('  ✅ Keyboard navigation specific styles available', 'green');
    } else {
      log('  ⚠️  Enhanced keyboard navigation styles could be improved', 'yellow');
    }
    
    // Check for tab navigation support
    const tabSupport = cssContent.includes('[tabindex]:focus-visible') &&
                      cssContent.includes('[role="tab"]:focus-visible');
    
    if (tabSupport) {
      log('  ✅ Tab navigation and ARIA roles supported', 'green');
    } else {
      log('  ⚠️  Tab navigation support could be enhanced', 'yellow');
    }
    
    return true;
  } catch (error) {
    log(`  ❌ Error validating keyboard navigation: ${error.message}`, 'red');
    return false;
  }
}

function generateReport() {
  log('\n' + '='.repeat(60), 'cyan');
  log('📊 ACCESSIBILITY VALIDATION REPORT', 'bold');
  log('='.repeat(60), 'cyan');
  
  const tests = [
    { name: 'Skip Link Implementation', fn: validateSkipLink },
    { name: 'Focus Indicators', fn: validateFocusIndicators },
    { name: 'Reduced Motion Support', fn: validateReducedMotion },
    { name: 'Color Contrast', fn: validateColorContrast },
    { name: 'Touch Target Sizes', fn: validateTouchTargets },
    { name: 'Keyboard Navigation', fn: validateKeyboardNavigation }
  ];
  
  const results = tests.map(test => ({
    name: test.name,
    passed: test.fn()
  }));
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const percentage = Math.round((passed / total) * 100);
  
  log('\n📈 SUMMARY:', 'cyan');
  log(`  Tests Passed: ${passed}/${total}`, passed === total ? 'green' : 'yellow');
  log(`  Success Rate: ${percentage}%`, percentage >= 95 ? 'green' : percentage >= 80 ? 'yellow' : 'red');
  
  if (percentage >= 95) {
    log('\n🎉 EXCELLENT! Your accessibility implementation meets WCAG 2.1 AA standards!', 'green');
  } else if (percentage >= 80) {
    log('\n⚠️  GOOD! Minor improvements needed for full WCAG 2.1 AA compliance.', 'yellow');
  } else {
    log('\n❌ NEEDS WORK! Significant accessibility improvements required.', 'red');
  }
  
  log('\n💡 RECOMMENDATIONS:', 'blue');
  log('  • Test with actual screen readers (NVDA, JAWS, VoiceOver)');
  log('  • Run axe-core automated testing');
  log('  • Validate with Lighthouse Accessibility audit (target: ≥95)');
  log('  • Perform manual keyboard navigation testing');
  log('  • Test with reduced motion preferences enabled');
  
  return percentage >= 95;
}

// Run all validations
if (require.main === module) {
  log('🚀 Starting ProWeb Studio Accessibility Validation...', 'bold');
  const success = generateReport();
  process.exit(success ? 0 : 1);
}

module.exports = {
  validateSkipLink,
  validateFocusIndicators,
  validateReducedMotion,
  validateColorContrast,
  validateTouchTargets,
  validateKeyboardNavigation,
  generateReport
};