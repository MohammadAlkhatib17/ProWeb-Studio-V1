# Scripts Directory

This directory contains various build and analysis scripts for the ProWeb Studio project.

## Bundle Analysis Scripts

### `analyze-bundle-data.js`
Generates structured JSON data from Next.js bundle analysis for CI comparison.

**Usage:**
```bash
npm run analyze:generate
```

**Output:** `../reports/bundles/analysis-data.json`

**Features:**
- Analyzes chunk sizes and categorizes them
- Identifies critical routes and components
- Generates metadata for comparison

### `bundle-compare.js`
Compares bundle sizes between branches to detect regressions.

**Usage:**
```bash
npm run bundle:compare current-bundle.json base-bundle.json
```

**Features:**
- Detects size regressions > 10% threshold
- Categorizes chunks (vendors, three-core, etc.)
- Provides detailed change analysis
- Exits with error code on regressions

### `test-bundle-compare.js`
Test script for validating bundle comparison logic.

**Usage:**
```bash
node scripts/test-bundle-compare.js
```

## Other Scripts

### `gen-icons.ts`
Generates PWA icons from source images.

### `validate-env.js`
Validates environment variables before production builds.

### `performance-test.sh`
Runs performance testing with Lighthouse.

### `security-test.sh`
Runs security checks and validations.

## CI Integration

These scripts are integrated into the CI pipeline:

- **Quality Checks**: TypeScript, ESLint, Prettier, Tests
- **Bundle Analysis**: Automatic size regression detection
- **Performance**: Lighthouse scoring and metrics

See `/reports/ci/quality-gates.md` for detailed documentation.

## Local Development

Run all quality checks locally:
```bash
npm run ci:quality-check
```

Generate and compare bundles:
```bash
npm run ci:build
npm run bundle:compare old-bundle.json reports/bundles/analysis-data.json
```