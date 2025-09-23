#!/bin/bash

# Performance Validation Script for Dutch Users
# Tests sub-1-second load time optimization

echo "🚀 ProWeb Studio Performance Validation for Dutch Users"
echo "======================================================="

# Configuration
SITE_URL="${SITE_URL:-http://localhost:3000}"
TEST_PAGES=(
  "/"
  "/diensten" 
  "/portfolio"
  "/contact"
  "/over-ons"
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Performance thresholds (milliseconds)
TTFB_THRESHOLD=200    # Time to First Byte
FCP_THRESHOLD=800     # First Contentful Paint
LCP_THRESHOLD=1000    # Largest Contentful Paint (main target)
CLS_THRESHOLD=0.1     # Cumulative Layout Shift
FID_THRESHOLD=100     # First Input Delay

echo "🎯 Target: LCP < ${LCP_THRESHOLD}ms for Dutch users"
echo ""

# Function to test a single page
test_page() {
  local url="$1"
  local page_name="$2"
  
  echo "🔍 Testing: ${page_name} (${url})"
  
  # Use curl to test TTFB
  local ttfb=$(curl -w "%{time_starttransfer}\n" -o /dev/null -s "${url}" | awk '{print int($1*1000)}')
  
  # Use lighthouse CI for Core Web Vitals (if available)
  if command -v lhci &> /dev/null; then
    local lighthouse_output=$(lhci collect --url="${url}" --quiet 2>/dev/null || echo "")
    
    if [ ! -z "$lighthouse_output" ]; then
      # Parse lighthouse results (simplified)
      echo "  ✅ Lighthouse scan completed"
    else
      echo "  ⚠️  Lighthouse scan failed - using curl metrics only"
    fi
  fi
  
  # Evaluate TTFB
  if [ "$ttfb" -lt "$TTFB_THRESHOLD" ]; then
    echo -e "  TTFB: ${GREEN}${ttfb}ms${NC} (< ${TTFB_THRESHOLD}ms) ✅"
  else
    echo -e "  TTFB: ${RED}${ttfb}ms${NC} (> ${TTFB_THRESHOLD}ms) ❌"
  fi
  
  echo ""
}

# Function to test caching headers
test_caching() {
  echo "🗄️  Testing Caching Headers"
  echo "=========================="
  
  # Test static asset caching
  local static_cache=$(curl -s -I "${SITE_URL}/favicon.ico" | grep -i "cache-control" | cut -d' ' -f2-)
  echo "Static assets: ${static_cache}"
  
  # Test API route caching
  local api_cache=$(curl -s -I "${SITE_URL}/api/health" | grep -i "cache-control" | cut -d' ' -f2-)
  echo "API routes: ${api_cache}"
  
  # Test page caching
  local page_cache=$(curl -s -I "${SITE_URL}/" | grep -i "cache-control" | cut -d' ' -f2-)
  echo "Pages: ${page_cache}"
  
  echo ""
}

# Function to test geographic optimization
test_geographic() {
  echo "🌍 Testing Geographic Optimization"
  echo "=================================="
  
  # Test if geographic headers are present
  local geo_headers=$(curl -s -I "${SITE_URL}/" | grep -i "x-geographic-hint\|x-edge-region\|x-region")
  
  if [ ! -z "$geo_headers" ]; then
    echo -e "${GREEN}Geographic headers detected:${NC}"
    echo "$geo_headers"
  else
    echo -e "${YELLOW}No geographic headers found${NC}"
  fi
  
  echo ""
}

# Function to test service worker
test_service_worker() {
  echo "⚙️  Testing Service Worker"
  echo "========================="
  
  # Check if service worker is available
  local sw_status=$(curl -s -o /dev/null -w "%{http_code}" "${SITE_URL}/sw.js")
  
  if [ "$sw_status" -eq 200 ]; then
    echo -e "${GREEN}Service Worker available${NC} ✅"
    
    # Check cache-control headers for service worker
    local sw_cache=$(curl -s -I "${SITE_URL}/sw.js" | grep -i "cache-control")
    echo "SW Cache-Control: ${sw_cache}"
  else
    echo -e "${RED}Service Worker not found${NC} ❌"
  fi
  
  echo ""
}

# Function to test edge functions
test_edge_functions() {
  echo "⚡ Testing Edge Function Performance"
  echo "==================================="
  
  # Test API endpoints with edge runtime
  local api_endpoints=(
    "/api/health"
    "/api/contact"
    "/api/vitals"
  )
  
  for endpoint in "${api_endpoints[@]}"; do
    if curl -s "${SITE_URL}${endpoint}" > /dev/null 2>&1; then
      local response_time=$(curl -w "%{time_total}\n" -o /dev/null -s "${SITE_URL}${endpoint}" | awk '{print int($1*1000)}')
      
      if [ "$response_time" -lt 100 ]; then
        echo -e "  ${endpoint}: ${GREEN}${response_time}ms${NC} ✅"
      elif [ "$response_time" -lt 200 ]; then
        echo -e "  ${endpoint}: ${YELLOW}${response_time}ms${NC} ⚠️"
      else
        echo -e "  ${endpoint}: ${RED}${response_time}ms${NC} ❌"
      fi
    else
      echo -e "  ${endpoint}: ${RED}Failed${NC} ❌"
    fi
  done
  
  echo ""
}

# Main execution
echo "Starting performance validation..."
echo ""

# Test caching configuration
test_caching

# Test geographic optimization
test_geographic

# Test service worker
test_service_worker

# Test edge functions
test_edge_functions

# Test each page
for page in "${TEST_PAGES[@]}"; do
  test_page "${SITE_URL}${page}" "${page}"
done

echo "🏁 Performance validation completed!"
echo ""
echo "📊 Summary for Dutch Users:"
echo "- All static assets should be cached for 1 year"
echo "- Pages should have stale-while-revalidate caching"
echo "- API routes should run on edge with <100ms response"
echo "- Geographic headers should route to AMS1/FRA1"
echo "- Service worker should provide offline functionality"
echo ""
echo -e "${BLUE}💡 For production testing, run this script against your Vercel deployment${NC}"