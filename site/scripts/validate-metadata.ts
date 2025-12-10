#!/usr/bin/env tsx
/**
 * Build-time metadata validation script
 * 
 * "Perfection Protocol" Update:
 * This script now STRICTLY enforces 'nl-NL' to ensure Dutch market dominance.
 * It will FAIL if it encounters 'nl' (generic) or 'en' (English).
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

interface ValidationIssue {
  file: string;
  type: 'error' | 'warning';
  message: string;
}

const issues: ValidationIssue[] = [];

function getSiteDir(): string {
  const scriptPath = fileURLToPath(import.meta.url || __filename);
  return path.resolve(path.dirname(scriptPath), '..');
}

/**
 * Validate root layout - STRICT MODE
 */
function validateRootLayout(layoutPath: string): void {
  if (!fs.existsSync(layoutPath)) {
    issues.push({
      file: layoutPath,
      type: 'error',
      message: 'Root layout file not found',
    });
    return;
  }

  const content = fs.readFileSync(layoutPath, 'utf-8');

  // STRICT check for lang="nl-NL"
  // Fails on lang="nl" or lang="en"
  const hasStrictDutch = /html\s+lang="nl-NL"/i.test(content);
  const hasGenericDutch = /html\s+lang="nl"/i.test(content) && !hasStrictDutch;
  const hasEnglish = /html\s+lang="en"/i.test(content);

  if (hasStrictDutch) {
    // Pass - This is the Gold Standard
  } else if (hasGenericDutch) {
    issues.push({
      file: layoutPath,
      type: 'error',
      message: '❌ UNSUPPORTED LOCALE: Found lang="nl". Standard requires lang="nl-NL" for Dutch SEO supremacy.',
    });
  } else if (hasEnglish) {
    issues.push({
      file: layoutPath,
      type: 'error',
      message: '❌ UNSUPPORTED LOCALE: Found lang="en". Site must be Dutch-first (nl-NL).',
    });
  } else {
    issues.push({
      file: layoutPath,
      type: 'error',
      message: '❌ MISSING LOCALE: Root layout must have <html lang="nl-NL">.',
    });
  }

  // Check for hreflang tags - Force nl-NL
  if (!/hrefLang="nl-NL"/i.test(content) && !/hreflang="nl-NL"/i.test(content)) {
    issues.push({
      file: layoutPath,
      type: 'warning',
      message: 'Root layout should include specific hreflang="nl-NL" tag.',
    });
  }
}

function main(): void {
  console.log(`${colors.cyan}🔍 Validating STRICT Dutch metadata configuration...${colors.reset}\n`);

  const siteDir = getSiteDir();
  const appDir = path.join(siteDir, 'src', 'app');
  const layoutPath = path.join(appDir, 'layout.tsx');

  // Validate root layout
  console.log(`${colors.blue}Validating root layout locale...${colors.reset}`);
  validateRootLayout(layoutPath);

  // Report results
  console.log(`\n${colors.cyan}=== Validation Results ===${colors.reset}\n`);

  const errors = issues.filter(i => i.type === 'error');
  const warnings = issues.filter(i => i.type === 'warning');

  if (errors.length === 0) {
    console.log(`${colors.green}✓ SEO Standards Met: lang="nl-NL" confirmed.${colors.reset}\n`);
    if (warnings.length > 0) {
      console.log(`${colors.yellow}⚠ ${warnings.length} Warning(s) remain, but build can proceed.${colors.reset}`);
    }
    process.exit(0);
  } else {
    console.log(`${colors.red}✗ ${errors.length} Critical SEO Error(s):${colors.reset}\n`);
    for (const error of errors) {
      console.log(`  ${colors.red}ERROR:${colors.reset} ${error.message}`);
      console.log(`  ${colors.yellow}File:${colors.reset} ${error.file}\n`);
    }
    console.log(`${colors.red}Build FAILED to protect SEO standards.${colors.reset}\n`);
    process.exit(1);
  }
}

main();
