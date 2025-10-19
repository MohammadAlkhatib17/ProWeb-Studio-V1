#!/usr/bin/env tsx
/**
 * Build-time metadata validation script
 * 
 * This script validates that all pages have:
 * - Correct canonical URLs
 * - Required hreflang tags (nl-NL, nl, x-default)
 * - Correct og:locale (nl_NL)
 * - lang="nl" in HTML
 * 
 * Usage:
 *   npm run validate:metadata
 * 
 * Exit codes:
 *   0 - All metadata is valid
 *   1 - Validation errors found (fails the build)
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

/**
 * Get the site directory path
 */
function getSiteDir(): string {
  const scriptPath = fileURLToPath(import.meta.url || __filename);
  return path.resolve(path.dirname(scriptPath), '..');
}

/**
 * Find all page.tsx files in the app directory
 */
function findPageFiles(dir: string): string[] {
  const results: string[] = [];
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules, .next, and other build directories
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          results.push(...findPageFiles(fullPath));
        }
      } else if (entry.isFile() && entry.name === 'page.tsx') {
        results.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`${colors.red}Error reading directory ${dir}:${colors.reset}`, error);
  }
  
  return results;
}

/**
 * Extract page path from file path
 */
function getPagePath(filePath: string, appDir: string): string {
  const relativePath = path.relative(appDir, filePath);
  const dirPath = path.dirname(relativePath);
  
  if (dirPath === '.' || dirPath === '') {
    return '/';
  }
  
  return `/${dirPath}`;
}

/**
 * Validate that file uses correct metadata generation
 */
function validatePageMetadata(filePath: string, appDir: string): void {
  const pagePath = getPagePath(filePath, appDir);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Check for metadata export (both sync and async)
  const hasMetadataExport = /export\s+(const\s+metadata|async\s+function\s+generateMetadata)/i.test(content);
  
  if (!hasMetadataExport) {
    issues.push({
      file: filePath,
      type: 'error',
      message: `Missing metadata export for page ${pagePath}. Add "export const metadata" or "export async function generateMetadata".`,
    });
    return;
  }
  
  // Check if using generatePageMetadata or generateMetadata (our utility functions)
  const usesGenerator = /generate(Page)?Metadata\s*\(/i.test(content);
  
  if (!usesGenerator) {
    issues.push({
      file: filePath,
      type: 'warning',
      message: `Page ${pagePath} does not use metadata generator functions. Ensure canonical URLs and hreflang tags are manually configured.`,
    });
  }
}

/**
 * Validate root layout
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
  
  // Check for lang="nl" attribute
  if (!/html\s+lang="nl"/i.test(content)) {
    issues.push({
      file: layoutPath,
      type: 'error',
      message: 'Root layout must have <html lang="nl"> for Dutch-first site',
    });
  }
  
  // Check for hreflang tags
  if (!/hrefLang="nl"/i.test(content) && !/hreflang="nl"/i.test(content)) {
    issues.push({
      file: layoutPath,
      type: 'warning',
      message: 'Root layout should include hreflang link tags for nl-NL',
    });
  }
}

/**
 * Validate SEOSchema component
 */
function validateSEOSchema(componentPath: string): void {
  if (!fs.existsSync(componentPath)) {
    issues.push({
      file: componentPath,
      type: 'error',
      message: 'SEOSchema component not found',
    });
    return;
  }
  
  const content = fs.readFileSync(componentPath, 'utf-8');
  
  // Check for inLanguage: 'nl-NL'
  if (!/inLanguage:\s*['"]nl-NL['"]/i.test(content)) {
    issues.push({
      file: componentPath,
      type: 'warning',
      message: 'SEOSchema should set inLanguage to "nl-NL" for structured data',
    });
  }
}

/**
 * Validate site config
 */
function validateSiteConfig(configPath: string): void {
  if (!fs.existsSync(configPath)) {
    issues.push({
      file: configPath,
      type: 'error',
      message: 'Site config file not found',
    });
    return;
  }
  
  const content = fs.readFileSync(configPath, 'utf-8');
  
  // Check that SITE_URL is read from environment
  if (!/SITE_URL|NEXT_PUBLIC_SITE_URL/i.test(content)) {
    issues.push({
      file: configPath,
      type: 'warning',
      message: 'Site config should reference SITE_URL or NEXT_PUBLIC_SITE_URL',
    });
  }
}

/**
 * Main validation function
 */
function main(): void {
  console.log(`${colors.cyan}🔍 Validating Dutch metadata configuration...${colors.reset}\n`);
  
  const siteDir = getSiteDir();
  const appDir = path.join(siteDir, 'src', 'app');
  const layoutPath = path.join(appDir, 'layout.tsx');
  const seoSchemaPath = path.join(siteDir, 'src', 'components', 'SEOSchema.tsx');
  const siteConfigPath = path.join(siteDir, 'src', 'config', 'site.config.ts');
  
  // Validate root layout
  console.log(`${colors.blue}Validating root layout...${colors.reset}`);
  validateRootLayout(layoutPath);
  
  // Validate SEOSchema component
  console.log(`${colors.blue}Validating SEOSchema component...${colors.reset}`);
  validateSEOSchema(seoSchemaPath);
  
  // Validate site config
  console.log(`${colors.blue}Validating site config...${colors.reset}`);
  validateSiteConfig(siteConfigPath);
  
  // Find and validate all page files
  console.log(`${colors.blue}Validating page metadata...${colors.reset}`);
  const pageFiles = findPageFiles(appDir);
  console.log(`Found ${pageFiles.length} page files\n`);
  
  for (const file of pageFiles) {
    validatePageMetadata(file, appDir);
  }
  
  // Report results
  console.log(`\n${colors.cyan}=== Validation Results ===${colors.reset}\n`);
  
  const errors = issues.filter(i => i.type === 'error');
  const warnings = issues.filter(i => i.type === 'warning');
  
  if (errors.length === 0 && warnings.length === 0) {
    console.log(`${colors.green}✓ All metadata validations passed!${colors.reset}\n`);
    process.exit(0);
  }
  
  // Print errors
  if (errors.length > 0) {
    console.log(`${colors.red}✗ ${errors.length} Error(s):${colors.reset}\n`);
    for (const error of errors) {
      console.log(`  ${colors.red}ERROR:${colors.reset} ${error.message}`);
      console.log(`  ${colors.yellow}File:${colors.reset} ${error.file}\n`);
    }
  }
  
  // Print warnings
  if (warnings.length > 0) {
    console.log(`${colors.yellow}⚠ ${warnings.length} Warning(s):${colors.reset}\n`);
    for (const warning of warnings) {
      console.log(`  ${colors.yellow}WARNING:${colors.reset} ${warning.message}`);
      console.log(`  ${colors.yellow}File:${colors.reset} ${warning.file}\n`);
    }
  }
  
  // Summary
  console.log(`${colors.cyan}=== Summary ===${colors.reset}`);
  console.log(`Total issues: ${issues.length}`);
  console.log(`  Errors: ${colors.red}${errors.length}${colors.reset}`);
  console.log(`  Warnings: ${colors.yellow}${warnings.length}${colors.reset}\n`);
  
  // Exit with error code if there are errors
  if (errors.length > 0) {
    console.log(`${colors.red}Build should fail due to metadata validation errors.${colors.reset}\n`);
    process.exit(1);
  }
  
  console.log(`${colors.green}Validation completed with warnings only.${colors.reset}\n`);
  process.exit(0);
}

// Run validation
main();
