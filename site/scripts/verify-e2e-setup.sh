#!/bin/bash

##############################################################################
# E2E Test Verification Script
# 
# Purpose: Quick local validation before pushing to CI
# Usage: ./scripts/verify-e2e-setup.sh
##############################################################################

set -e

cd "$(dirname "$0")/.."

echo "🔍 Verifying E2E Test Setup..."
echo ""

# Check 1: Dependencies
echo "1️⃣ Checking dependencies..."
if ! grep -q "@playwright/test" package.json; then
  echo "   ❌ @playwright/test not found in package.json"
  exit 1
fi
echo "   ✅ Playwright dependency present"

# Check 2: Test files
echo ""
echo "2️⃣ Checking test files..."
if [ ! -f "tests/e2e/banner-canvas.spec.ts" ]; then
  echo "   ❌ Test file not found: tests/e2e/banner-canvas.spec.ts"
  exit 1
fi
echo "   ✅ Test file exists"

# Check 3: Config
echo ""
echo "3️⃣ Checking Playwright config..."
if [ ! -f "playwright.config.ts" ]; then
  echo "   ❌ playwright.config.ts not found"
  exit 1
fi
echo "   ✅ Config file exists"

# Check 4: Scripts
echo ""
echo "4️⃣ Checking npm scripts..."
if ! grep -q "test:e2e" package.json; then
  echo "   ❌ test:e2e script not found in package.json"
  exit 1
fi
if ! grep -q "test:e2e:ci" package.json; then
  echo "   ❌ test:e2e:ci script not found in package.json"
  exit 1
fi
echo "   ✅ E2E scripts configured"

# Check 5: CI workflow (check parent directory)
echo ""
echo "5️⃣ Checking CI workflow..."
if [ -f "../.github/workflows/ci.yml" ]; then
  if grep -q "e2e-tests:" "../.github/workflows/ci.yml"; then
    echo "   ✅ E2E job found in CI workflow"
  else
    echo "   ❌ e2e-tests job not found in .github/workflows/ci.yml"
    exit 1
  fi
else
  echo "   ⚠️  CI workflow not found at ../.github/workflows/ci.yml"
fi

# Check 6: Test selectors in components
echo ""
echo "6️⃣ Checking component test IDs..."
MISSING_TESTID=false

# Cookie consent banner
if ! grep -q "data-testid=\"cookie-consent-banner\"" src/components/CookieConsentBanner.tsx 2>/dev/null && \
   ! grep -q "data-testid='cookie-consent-banner'" src/components/CookieConsentBanner.tsx 2>/dev/null; then
  echo "   ⚠️  Consider adding data-testid='cookie-consent-banner' to CookieConsentBanner"
  MISSING_TESTID=true
fi

if [ "$MISSING_TESTID" = false ]; then
  echo "   ✅ Component test IDs look good"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ E2E Test Setup Verified!"
echo ""
echo "Next Steps:"
echo "  1. Install dependencies:  npm install"
echo "  2. Install browsers:      npx playwright install chromium"
echo "  3. Run tests:            npm run test:e2e"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
