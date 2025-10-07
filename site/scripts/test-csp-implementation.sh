#!/bin/bash

# CSP Implementation Test Script
# Tests various pages to ensure CSP is properly enforced without violations

echo "🔒 Testing CSP Implementation"
echo "=============================="

# Get the site URL from environment or use default
SITE_URL="${SITE_URL:-https://prowebstudio.nl}"
if [[ "$SITE_URL" == "https://prowebstudio.nl" ]]; then
    echo "⚠️  Testing against production. Use SITE_URL=http://localhost:3000 for local testing"
fi

echo "Testing site: $SITE_URL"
echo ""

# Function to test CSP headers
test_csp_headers() {
    local path="$1"
    local expected_type="$2"
    
    echo "Testing: $path"
    
    # Get CSP headers
    csp_header=$(curl -s -I "$SITE_URL$path" | grep -i "content-security-policy:")
    csp_report_header=$(curl -s -I "$SITE_URL$path" | grep -i "content-security-policy-report-only:")
    
    if [[ -n "$csp_header" ]]; then
        echo "  ✅ Enforced CSP found"
        if [[ "$expected_type" == "enforced" ]]; then
            echo "  ✅ Expected enforcement - PASS"
        else
            echo "  ⚠️  Unexpected enforcement"
        fi
    elif [[ -n "$csp_report_header" ]]; then
        echo "  📋 Report-only CSP found"
        if [[ "$expected_type" == "report-only" ]]; then
            echo "  ✅ Expected report-only - PASS"
        else
            echo "  ⚠️  Unexpected report-only mode"
        fi
    else
        echo "  ❌ No CSP header found - FAIL"
    fi
    
    # Check for nonce in CSP
    if [[ -n "$csp_header" || -n "$csp_report_header" ]]; then
        if echo "$csp_header$csp_report_header" | grep -q "nonce-"; then
            echo "  ✅ Nonce found in CSP"
        else
            echo "  ❌ No nonce found in CSP"
        fi
    fi
    
    echo ""
}

# Test non-interactive pages (should have enforced CSP)
echo "Non-interactive pages (enforced CSP expected):"
test_csp_headers "/privacy" "enforced"
test_csp_headers "/voorwaarden" "enforced"
test_csp_headers "/over-ons" "enforced"
test_csp_headers "/diensten" "enforced"
test_csp_headers "/diensten/website-laten-maken" "enforced"

# Test interactive pages (should have enforced CSP with frame-src)
echo "Interactive pages (enforced CSP expected):"
test_csp_headers "/contact" "enforced"

# Test other pages (should have report-only CSP)
echo "Other pages (report-only CSP expected):"
test_csp_headers "/" "report-only"
test_csp_headers "/portfolio" "report-only"

# Test CSP report endpoint
echo "Testing CSP report endpoint:"
csp_report_response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$SITE_URL/api/csp-report" \
    -H "Content-Type: application/json" \
    -d '{"blocked-uri": "test", "document-uri": "test", "violated-directive": "script-src"}')

if [[ "$csp_report_response" == "204" ]]; then
    echo "  ✅ CSP report endpoint working - HTTP 204"
else
    echo "  ❌ CSP report endpoint issue - HTTP $csp_report_response"
fi

echo ""
echo "🔍 Check for CSP violations in browser console after visiting pages"
echo "📊 Monitor /api/csp-report logs for the next 48 hours"
echo "✅ Test complete"