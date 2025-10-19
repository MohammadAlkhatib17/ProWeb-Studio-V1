#!/bin/bash

# CSP Enforcement Validation Script
# Validates that CSP headers are properly configured for public pages

set -e

echo "🔒 CSP Enforcement Validation"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test configuration
SITE_URL="${SITE_URL:-http://localhost:3000}"
PASSED=0
FAILED=0

# Function to check CSP header
check_csp_header() {
  local path="$1"
  local expected_header="$2"
  local description="$3"
  
  echo "Testing: $description"
  echo "Path: $path"
  
  # Fetch headers
  response=$(curl -s -I "$SITE_URL$path" 2>&1)
  
  # Check for enforced CSP
  if echo "$response" | grep -qi "^Content-Security-Policy:"; then
    csp_value=$(echo "$response" | grep -i "^Content-Security-Policy:" | cut -d':' -f2- | tr -d '\r\n' | xargs)
    
    # Verify it's not report-only
    if echo "$response" | grep -qi "^Content-Security-Policy-Report-Only:"; then
      echo -e "${RED}❌ FAIL: Found report-only header instead of enforced${NC}"
      echo "   Found: Content-Security-Policy-Report-Only"
      ((FAILED++))
    else
      echo -e "${GREEN}✓ PASS: Enforced CSP header present${NC}"
      echo "   Value: ${csp_value:0:100}..."
      
      # Check for required directives
      required_directives=("default-src" "script-src" "style-src" "font-src" "img-src" "connect-src")
      
      for directive in "${required_directives[@]}"; do
        if echo "$csp_value" | grep -q "$directive"; then
          echo -e "${GREEN}  ✓ $directive present${NC}"
        else
          echo -e "${RED}  ❌ $directive missing${NC}"
          ((FAILED++))
        fi
      done
      
      # Check for required hosts
      required_hosts=("plausible.io" "vercel-scripts.com" "fonts.googleapis.com" "fonts.gstatic.com")
      
      for host in "${required_hosts[@]}"; do
        if echo "$csp_value" | grep -q "$host"; then
          echo -e "${GREEN}  ✓ $host allowed${NC}"
        else
          echo -e "${YELLOW}  ⚠ $host not found (may not be needed for this page)${NC}"
        fi
      done
      
      # Check for unsafe directives (should not be present on public pages)
      if echo "$csp_value" | grep -q "unsafe-eval"; then
        echo -e "${YELLOW}  ⚠ unsafe-eval found (review if necessary)${NC}"
      fi
      
      ((PASSED++))
    fi
  else
    echo -e "${RED}❌ FAIL: No Content-Security-Policy header found${NC}"
    ((FAILED++))
  fi
  
  echo ""
}

# Function to check report-only CSP
check_report_only_csp() {
  local path="$1"
  local description="$2"
  
  echo "Testing: $description"
  echo "Path: $path"
  
  # Fetch headers
  response=$(curl -s -I "$SITE_URL$path" 2>&1)
  
  # Check for report-only CSP
  if echo "$response" | grep -qi "^Content-Security-Policy-Report-Only:"; then
    csp_value=$(echo "$response" | grep -i "^Content-Security-Policy-Report-Only:" | cut -d':' -f2- | tr -d '\r\n' | xargs)
    echo -e "${GREEN}✓ PASS: Report-only CSP header present${NC}"
    echo "   Value: ${csp_value:0:100}..."
    
    # Check for report-uri
    if echo "$csp_value" | grep -q "report-uri"; then
      echo -e "${GREEN}  ✓ report-uri directive present${NC}"
      ((PASSED++))
    else
      echo -e "${RED}  ❌ report-uri directive missing${NC}"
      ((FAILED++))
    fi
  else
    echo -e "${RED}❌ FAIL: No Content-Security-Policy-Report-Only header found${NC}"
    ((FAILED++))
  fi
  
  echo ""
}

echo "Testing Enforced CSP on Public Pages"
echo "-------------------------------------"
check_csp_header "/" "Content-Security-Policy" "Homepage CSP enforcement"
check_csp_header "/diensten/webontwikkeling" "Content-Security-Policy" "Services page CSP enforcement"

echo ""
echo "Testing Report-Only CSP on API Endpoint"
echo "----------------------------------------"
check_report_only_csp "/api/csp-report" "CSP report endpoint (report-only for monitoring)"

echo ""
echo "=============================="
echo "Results:"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ All CSP enforcement checks passed!${NC}"
  exit 0
else
  echo -e "${RED}✗ Some checks failed. Review the output above.${NC}"
  exit 1
fi
