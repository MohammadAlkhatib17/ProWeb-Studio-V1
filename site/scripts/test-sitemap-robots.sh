#!/bin/bash

# Test robots.txt and sitemap endpoints
# Usage: ./scripts/test-sitemap-robots.sh [base_url]

BASE_URL="${1:-http://localhost:3000}"

echo "🤖 Testing Sitemap and Robots Implementation"
echo "================================================"
echo "Base URL: $BASE_URL"
echo ""

# Test robots.txt
echo "1️⃣  Testing robots.txt..."
ROBOTS_RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/robots.txt")
ROBOTS_CODE=$(echo "$ROBOTS_RESPONSE" | tail -n 1)
ROBOTS_BODY=$(echo "$ROBOTS_RESPONSE" | head -n -1)

if [ "$ROBOTS_CODE" = "200" ]; then
  echo "   ✅ robots.txt returns 200"
  
  # Check for required content
  if echo "$ROBOTS_BODY" | grep -q "User-agent:"; then
    echo "   ✅ Contains User-agent directives"
  else
    echo "   ❌ Missing User-agent directives"
  fi
  
  if echo "$ROBOTS_BODY" | grep -q "Sitemap:"; then
    echo "   ✅ Contains Sitemap directive"
  else
    echo "   ❌ Missing Sitemap directive"
  fi
  
  if echo "$ROBOTS_BODY" | grep -q "Host:"; then
    echo "   ✅ Contains Host directive"
  else
    echo "   ❌ Missing Host directive"
  fi
  
  # Check for duplicates
  SITEMAP_COUNT=$(echo "$ROBOTS_BODY" | grep -c "Sitemap:")
  if [ "$SITEMAP_COUNT" -eq 1 ]; then
    echo "   ✅ Single Sitemap entry (no duplicates)"
  else
    echo "   ⚠️  Found $SITEMAP_COUNT Sitemap entries"
  fi
else
  echo "   ❌ robots.txt returns $ROBOTS_CODE"
fi

echo ""

# Test main sitemap
echo "2️⃣  Testing /sitemap.xml..."
SITEMAP_RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/sitemap.xml")
SITEMAP_CODE=$(echo "$SITEMAP_RESPONSE" | tail -n 1)
SITEMAP_BODY=$(echo "$SITEMAP_RESPONSE" | head -n -1)

if [ "$SITEMAP_CODE" = "200" ]; then
  echo "   ✅ sitemap.xml returns 200"
  
  if echo "$SITEMAP_BODY" | grep -q "<?xml"; then
    echo "   ✅ Valid XML format"
  else
    echo "   ❌ Invalid XML format"
  fi
  
  if echo "$SITEMAP_BODY" | grep -q "<urlset"; then
    echo "   ✅ Contains urlset"
  else
    echo "   ❌ Missing urlset"
  fi
  
  URL_COUNT=$(echo "$SITEMAP_BODY" | grep -c "<loc>")
  echo "   📊 Contains $URL_COUNT URLs"
  
  if echo "$SITEMAP_BODY" | grep -q "hreflang=\"nl-NL\""; then
    echo "   ✅ Contains nl-NL hreflang"
  else
    echo "   ⚠️  Missing nl-NL hreflang"
  fi
else
  echo "   ❌ sitemap.xml returns $SITEMAP_CODE"
fi

echo ""

# Test segmented sitemaps
echo "3️⃣  Testing /sitemap-pages.xml..."
PAGES_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/sitemap-pages.xml")
if [ "$PAGES_CODE" = "200" ]; then
  echo "   ✅ sitemap-pages.xml returns 200"
else
  echo "   ❌ sitemap-pages.xml returns $PAGES_CODE"
fi

echo ""

echo "4️⃣  Testing /sitemap-services.xml..."
SERVICES_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/sitemap-services.xml")
if [ "$SERVICES_CODE" = "200" ]; then
  echo "   ✅ sitemap-services.xml returns 200"
else
  echo "   ❌ sitemap-services.xml returns $SERVICES_CODE"
fi

echo ""

echo "5️⃣  Testing /sitemap-locations.xml..."
LOCATIONS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/sitemap-locations.xml")
if [ "$LOCATIONS_CODE" = "200" ]; then
  echo "   ✅ sitemap-locations.xml returns 200"
else
  echo "   ❌ sitemap-locations.xml returns $LOCATIONS_CODE"
fi

echo ""
echo "================================================"

# Overall result
if [ "$ROBOTS_CODE" = "200" ] && [ "$SITEMAP_CODE" = "200" ] && \
   [ "$PAGES_CODE" = "200" ] && [ "$SERVICES_CODE" = "200" ] && \
   [ "$LOCATIONS_CODE" = "200" ]; then
  echo "✅ All tests passed!"
  exit 0
else
  echo "❌ Some tests failed"
  exit 1
fi
