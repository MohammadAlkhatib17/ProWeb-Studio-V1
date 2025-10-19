#!/bin/bash

# Cookie Consent Testing Script
# Run this to verify the implementation

set -e

echo "🍪 Cookie Consent Implementation Test"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test
test_file() {
    local file=$1
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file exists"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $file missing"
        ((FAILED++))
    fi
}

echo "1. Checking component files..."
echo "------------------------------"
test_file "site/src/components/cookies/types.ts"
test_file "site/src/components/cookies/cookie-utils.ts"
test_file "site/src/components/cookies/useCookieConsent.ts"
test_file "site/src/components/cookies/CookieConsentBanner.tsx"
test_file "site/src/components/cookies/CookieSettingsModal.tsx"
test_file "site/src/components/cookies/ConsentAwareAnalytics.tsx"
test_file "site/src/components/cookies/CookieSettingsButton.tsx"
test_file "site/src/components/cookies/index.ts"
test_file "site/src/components/cookies/README.md"
echo ""

echo "2. Checking integrations..."
echo "---------------------------"
if grep -q "CookieConsentBanner" site/src/app/layout.tsx; then
    echo -e "${GREEN}✓${NC} CookieConsentBanner integrated in layout.tsx"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} CookieConsentBanner not found in layout.tsx"
    ((FAILED++))
fi

if grep -q "ConsentAwareAnalytics" site/src/app/layout.tsx; then
    echo -e "${GREEN}✓${NC} ConsentAwareAnalytics integrated in layout.tsx"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} ConsentAwareAnalytics not found in layout.tsx"
    ((FAILED++))
fi

if grep -q "CookieSettingsButton" site/src/components/Footer.tsx; then
    echo -e "${GREEN}✓${NC} CookieSettingsButton integrated in Footer.tsx"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} CookieSettingsButton not found in Footer.tsx"
    ((FAILED++))
fi

# Check that old analytics script is removed
if ! grep -q "plausible.io/js/script.js" site/src/app/layout.tsx | grep -v "ConsentAwareAnalytics"; then
    echo -e "${GREEN}✓${NC} Direct Plausible script removed (consent-aware now)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} Direct Plausible script still present (should be removed)"
    ((FAILED++))
fi
echo ""

echo "3. Checking build..."
echo "--------------------"
cd site
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Build successful"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Build failed"
    ((FAILED++))
fi
cd ..
echo ""

echo "4. Checking animations..."
echo "-------------------------"
if grep -q "animate-slide-up" site/src/app/globals.css; then
    echo -e "${GREEN}✓${NC} Cookie banner animation defined"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Cookie banner animation missing"
    ((FAILED++))
fi
echo ""

echo "======================================"
echo "Test Results:"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed! Implementation complete.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Test in browser: npm run dev"
    echo "2. Open http://localhost:3000"
    echo "3. Clear cookies: document.cookie = \"pws_cookie_consent=; expires=Thu, 01 Jan 1970\""
    echo "4. Reload page to see banner"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please review the errors above.${NC}"
    exit 1
fi
