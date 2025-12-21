#!/bin/bash

# Security Headers Validation Script
# Tests CSP report-only mode, HSTS, and other security headers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="${1:-http://localhost:3000}"
REPORT_FILE="security-headers-validation-$(date +%Y%m%d-%H%M%S).txt"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       Security Headers Validation Script                  ║${NC}"
echo -e "${BLUE}║       Testing: $BASE_URL${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Initialize report
exec > >(tee -a "$REPORT_FILE")
exec 2>&1

echo "Validation started at: $(date)"
echo "Testing URL: $BASE_URL"
echo ""

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

# Test function
test_header() {
    local route="$1"
    local header_name="$2"
    local expected_pattern="$3"
    local test_name="$4"
    
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    
    echo -e "${BLUE}[TEST $TESTS_TOTAL]${NC} $test_name"
    echo "  Route: $route"
    echo "  Checking: $header_name"
    
    # Fetch headers
    local response=$(curl -s -I "$BASE_URL$route" 2>&1)
    
    if [ $? -ne 0 ]; then
        echo -e "  ${RED}✗ FAILED${NC} - Could not connect to server"
        echo "  Error: $response"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        echo ""
        return 1
    fi
    
    # Extract header value (case-insensitive)
    local header_value=$(echo "$response" | grep -i "^$header_name:" | head -1 | cut -d: -f2- | sed 's/^[[:space:]]*//' | tr -d '\r\n')
    
    if [ -z "$header_value" ]; then
        echo -e "  ${RED}✗ FAILED${NC} - Header not found"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    elif echo "$header_value" | grep -qE "$expected_pattern"; then
        echo -e "  ${GREEN}✓ PASSED${NC}"
        echo "  Value: $header_value"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "  ${RED}✗ FAILED${NC} - Pattern not matched"
        echo "  Expected pattern: $expected_pattern"
        echo "  Actual value: $header_value"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    
    echo ""
}

# Test absence of header
test_header_absent() {
    local route="$1"
    local header_name="$2"
    local test_name="$3"
    
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    
    echo -e "${BLUE}[TEST $TESTS_TOTAL]${NC} $test_name"
    echo "  Route: $route"
    echo "  Checking absence of: $header_name"
    
    local response=$(curl -s -I "$BASE_URL$route" 2>&1)
    
    if [ $? -ne 0 ]; then
        echo -e "  ${RED}✗ FAILED${NC} - Could not connect to server"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        echo ""
        return 1
    fi
    
    local header_value=$(echo "$response" | grep -i "^$header_name:" | head -1)
    
    if [ -z "$header_value" ]; then
        echo -e "  ${GREEN}✓ PASSED${NC} - Header correctly absent"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "  ${RED}✗ FAILED${NC} - Header should not be present"
        echo "  Found: $header_value"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
    
    echo ""
}

# ==================== CSP Tests ====================
echo -e "${YELLOW}═══ Content Security Policy Tests ═══${NC}"
echo ""

# Check CSP Report-Only mode (during monitoring phase)
test_header "/" "Content-Security-Policy-Report-Only" "default-src 'self'" \
    "CSP Report-Only Header Present"

test_header "/" "Content-Security-Policy-Report-Only" "script-src.*'nonce-" \
    "CSP includes nonce in script-src"

test_header "/" "Content-Security-Policy-Report-Only" "script-src.*'strict-dynamic'" \
    "CSP includes strict-dynamic"

test_header "/" "Content-Security-Policy-Report-Only" "https://plausible\.io" \
    "CSP whitelists Plausible Analytics"

test_header "/" "Content-Security-Policy-Report-Only" "https://fonts\.googleapis\.com" \
    "CSP whitelists Google Fonts"

test_header "/" "Content-Security-Policy-Report-Only" "frame-ancestors 'none'" \
    "CSP prevents clickjacking with frame-ancestors"

test_header "/" "Content-Security-Policy-Report-Only" "object-src 'none'" \
    "CSP blocks objects/embeds"

test_header "/" "Content-Security-Policy-Report-Only" "upgrade-insecure-requests" \
    "CSP enforces HTTPS upgrades"

test_header "/" "Content-Security-Policy-Report-Only" "report-uri" \
    "CSP includes report-uri"

# Check that enforced CSP is NOT present during monitoring
test_header_absent "/" "Content-Security-Policy" \
    "Enforced CSP correctly absent (report-only phase)"

# ==================== HSTS Tests ====================
echo -e "${YELLOW}═══ HSTS (HTTP Strict Transport Security) Tests ═══${NC}"
echo ""

test_header "/" "Strict-Transport-Security" "max-age=63072000" \
    "HSTS max-age set to 2 years"

test_header "/" "Strict-Transport-Security" "includeSubDomains" \
    "HSTS includes subdomains"

test_header "/" "Strict-Transport-Security" "preload" \
    "HSTS includes preload directive"

# ==================== X-Frame-Options Tests ====================
echo -e "${YELLOW}═══ X-Frame-Options Tests ═══${NC}"
echo ""

test_header "/" "X-Frame-Options" "DENY" \
    "X-Frame-Options set to DENY"

test_header "/diensten/webontwikkeling" "X-Frame-Options" "DENY" \
    "X-Frame-Options DENY on /diensten routes"

# ==================== X-Content-Type-Options Tests ====================
echo -e "${YELLOW}═══ X-Content-Type-Options Tests ═══${NC}"
echo ""

test_header "/" "X-Content-Type-Options" "nosniff" \
    "X-Content-Type-Options set to nosniff"

# ==================== Referrer-Policy Tests ====================
echo -e "${YELLOW}═══ Referrer-Policy Tests ═══${NC}"
echo ""

test_header "/" "Referrer-Policy" "strict-origin-when-cross-origin" \
    "Referrer-Policy set correctly"

# ==================== Nonce Tests ====================
echo -e "${YELLOW}═══ CSP Nonce Tests ═══${NC}"
echo ""

test_header "/" "x-nonce" ".+" \
    "Nonce header present in response"

# ==================== Additional Security Headers ====================
echo -e "${YELLOW}═══ Additional Security Headers ═══${NC}"
echo ""

test_header "/" "Permissions-Policy" "camera=\(\)" \
    "Permissions-Policy blocks camera"

test_header "/" "Permissions-Policy" "microphone=\(\)" \
    "Permissions-Policy blocks microphone"

test_header "/" "Cross-Origin-Opener-Policy" "same-origin" \
    "COOP set to same-origin"

test_header "/" "Cross-Origin-Resource-Policy" "same-origin" \
    "CORP set to same-origin"

test_header "/" "X-DNS-Prefetch-Control" "on" \
    "DNS prefetch enabled"

test_header "/" "X-Permitted-Cross-Domain-Policies" "none" \
    "Cross-domain policies restricted"

# ==================== API Route Security ====================
echo -e "${YELLOW}═══ API Route Security Headers ═══${NC}"
echo ""

test_header "/api/csp-report" "Cache-Control" "no-cache.*no-store" \
    "API routes have no-cache policy"

test_header "/api/csp-report" "X-Content-Type-Options" "nosniff" \
    "API routes have nosniff"

# ==================== Static Asset Headers ====================
echo -e "${YELLOW}═══ Static Asset Caching ═══${NC}"
echo ""

test_header "/_next/static/css/test.css" "Cache-Control" "public.*immutable" \
    "Static assets have immutable caching (if available)" || true

# ==================== Results Summary ====================
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    Test Results Summary                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo "Total Tests: $TESTS_TOTAL"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""

PASS_RATE=$((TESTS_PASSED * 100 / TESTS_TOTAL))

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed! (100%)${NC}"
    echo -e "${GREEN}Security headers implementation is correct.${NC}"
    EXIT_CODE=0
elif [ $PASS_RATE -ge 90 ]; then
    echo -e "${YELLOW}⚠ Most tests passed ($PASS_RATE%)${NC}"
    echo -e "${YELLOW}Some issues detected. Review failed tests above.${NC}"
    EXIT_CODE=1
else
    echo -e "${RED}✗ Many tests failed ($PASS_RATE%)${NC}"
    echo -e "${RED}Critical issues detected. Review implementation.${NC}"
    EXIT_CODE=2
fi

echo ""
echo "Validation completed at: $(date)"
echo "Report saved to: $REPORT_FILE"
echo ""

# ==================== Recommendations ====================
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                      Recommendations                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo "✓ Ready for production deployment"
    echo "✓ Monitor CSP reports for 7 days"
    echo "✓ Run browser testing across all pages"
    echo "✓ Verify analytics tracking still works"
else
    echo "⚠ Fix failed tests before production deployment"
    echo "⚠ Review SECURITY_HEADERS_IMPLEMENTATION.md"
    echo "⚠ Check middleware.ts and next.config.mjs"
fi

echo ""
echo "Next Steps:"
echo "1. Review this report: $REPORT_FILE"
echo "2. Test in browser DevTools console"
echo "3. Monitor /api/csp-report endpoint"
echo "4. Run Lighthouse audit after deployment"
echo ""

exit $EXIT_CODE
