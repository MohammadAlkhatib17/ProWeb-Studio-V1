#!/bin/bash
# CSP Nonce Implementation Verification Script
# Run this after deployment to verify the implementation

echo "🔍 CSP Nonce Implementation Verification"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URL to test (change this to your deployment URL)
TEST_URL="${1:-http://localhost:3000}"

echo "Testing URL: $TEST_URL"
echo ""

# Test 1: Check CSP header presence
echo "📋 Test 1: CSP Header Presence"
CSP_HEADER=$(curl -s -I "$TEST_URL" | grep -i "content-security-policy:" | grep -v "Report-Only")
if [ ! -z "$CSP_HEADER" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Enforced CSP header present"
    echo "  $CSP_HEADER"
else
    echo -e "${RED}✗ FAIL${NC} - No enforced CSP header found"
fi
echo ""

# Test 2: Check for nonce in CSP
echo "📋 Test 2: Nonce in CSP Policy"
if echo "$CSP_HEADER" | grep -q "nonce-"; then
    NONCE=$(echo "$CSP_HEADER" | grep -o "nonce-[A-Za-z0-9+/=]*" | head -1)
    echo -e "${GREEN}✓ PASS${NC} - Nonce found in CSP: $NONCE"
else
    echo -e "${RED}✗ FAIL${NC} - No nonce found in CSP policy"
fi
echo ""

# Test 3: Check for strict-dynamic
echo "📋 Test 3: Strict-Dynamic Directive"
if echo "$CSP_HEADER" | grep -q "strict-dynamic"; then
    echo -e "${GREEN}✓ PASS${NC} - 'strict-dynamic' directive present"
else
    echo -e "${YELLOW}⚠ WARNING${NC} - 'strict-dynamic' not found (recommended for production)"
fi
echo ""

# Test 4: Check x-nonce response header
echo "📋 Test 4: X-Nonce Response Header"
X_NONCE=$(curl -s -I "$TEST_URL" | grep -i "x-nonce:" | cut -d' ' -f2 | tr -d '\r')
if [ ! -z "$X_NONCE" ]; then
    echo -e "${GREEN}✓ PASS${NC} - x-nonce header present: $X_NONCE"
else
    echo -e "${RED}✗ FAIL${NC} - x-nonce header not found"
fi
echo ""

# Test 5: Check for csp-nonce meta tag in HTML
echo "📋 Test 5: CSP Nonce Meta Tag"
HTML=$(curl -s "$TEST_URL")
if echo "$HTML" | grep -q 'property="csp-nonce"'; then
    META_NONCE=$(echo "$HTML" | grep -o 'property="csp-nonce" content="[^"]*"' | cut -d'"' -f4)
    echo -e "${GREEN}✓ PASS${NC} - csp-nonce meta tag found: $META_NONCE"
else
    echo -e "${RED}✗ FAIL${NC} - csp-nonce meta tag not found in HTML"
fi
echo ""

# Test 6: Check for unsafe-inline in production
echo "📋 Test 6: Production Security (No unsafe-inline for scripts)"
if echo "$CSP_HEADER" | grep "script-src" | grep -q "unsafe-inline"; then
    echo -e "${YELLOW}⚠ WARNING${NC} - 'unsafe-inline' found in script-src (not recommended for production)"
else
    echo -e "${GREEN}✓ PASS${NC} - No 'unsafe-inline' in script-src"
fi
echo ""

# Test 7: Check for unsafe-eval in production
echo "📋 Test 7: Production Security (unsafe-eval check)"
if echo "$CSP_HEADER" | grep "script-src" | grep -q "unsafe-eval"; then
    echo -e "${YELLOW}⚠ INFO${NC} - 'unsafe-eval' found (OK in development, should be removed in production)"
else
    echo -e "${GREEN}✓ PASS${NC} - No 'unsafe-eval' in script-src (production-ready)"
fi
echo ""

# Test 8: Cookie banner presence in HTML
echo "📋 Test 8: Cookie Banner in HTML"
if echo "$HTML" | grep -q "cookie.*banner\|CookieConsentBanner"; then
    echo -e "${GREEN}✓ PASS${NC} - Cookie banner component found in HTML"
else
    echo -e "${YELLOW}⚠ WARNING${NC} - Cookie banner not clearly visible in HTML"
fi
echo ""

# Test 9: Analytics script nonce attribute
echo "📋 Test 9: Analytics Script Nonce"
if echo "$HTML" | grep -q 'plausible.io' && echo "$HTML" | grep 'plausible.io' | grep -q 'nonce='; then
    echo -e "${GREEN}✓ PASS${NC} - Plausible script has nonce attribute"
elif echo "$HTML" | grep -q 'plausible.io'; then
    echo -e "${RED}✗ FAIL${NC} - Plausible script found but missing nonce attribute"
else
    echo -e "${YELLOW}ℹ INFO${NC} - Plausible script not loaded (may require consent first)"
fi
echo ""

# Summary
echo "========================================"
echo "✅ Verification Complete"
echo ""
echo "Next steps:"
echo "1. Test in incognito mode manually"
echo "2. Check browser DevTools Console for CSP violations"
echo "3. Verify cookie banner appears on first load"
echo "4. Test analytics consent flow"
echo "5. Run Lighthouse security audit"
echo ""
echo "For detailed implementation info, see:"
echo "  site/CSP_NONCE_IMPLEMENTATION_SUMMARY.md"
