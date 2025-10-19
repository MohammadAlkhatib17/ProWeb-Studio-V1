#!/bin/bash

# Test script for monitoring system
# Usage: ./test-monitoring.sh [base_url]

BASE_URL="${1:-http://localhost:3000}"

echo "🧪 Testing Core Web Vitals Monitoring System"
echo "=============================================="
echo ""

# Test 1: POST a vital event
echo "Test 1: POST vital event to API..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  "${BASE_URL}/api/monitoring/core-web-vitals" \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": '$(date +%s000)',
    "url": "'${BASE_URL}'/test",
    "metric": {
      "name": "LCP",
      "value": 2300,
      "rating": "good",
      "id": "test-'$(date +%s)'"
    },
    "viewport": {
      "width": 1920,
      "height": 1080
    }
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ POST succeeded (HTTP $HTTP_CODE)"
  echo "   Response: $BODY"
else
  echo "❌ POST failed (HTTP $HTTP_CODE)"
  echo "   Response: $BODY"
  exit 1
fi

echo ""

# Test 2: GET recent events
echo "Test 2: GET recent events from API..."
RESPONSE=$(curl -s -w "\n%{http_code}" \
  "${BASE_URL}/api/monitoring/core-web-vitals?limit=10")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ GET succeeded (HTTP $HTTP_CODE)"
  EVENT_COUNT=$(echo "$BODY" | grep -o '"count":[0-9]*' | cut -d':' -f2)
  echo "   Events retrieved: $EVENT_COUNT"
else
  echo "❌ GET failed (HTTP $HTTP_CODE)"
  echo "   Response: $BODY"
fi

echo ""

# Test 3: Check dashboard accessibility
echo "Test 3: Check dashboard page..."
RESPONSE=$(curl -s -w "\n%{http_code}" \
  "${BASE_URL}/_internal/monitoring")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Dashboard accessible (HTTP $HTTP_CODE)"
else
  echo "⚠️  Dashboard returned HTTP $HTTP_CODE (may be expected in production)"
fi

echo ""
echo "=============================================="
echo "✅ Monitoring system test complete!"
echo ""
echo "Next steps:"
echo "1. Start dev server: npm run dev"
echo "2. Visit: ${BASE_URL}/_internal/monitoring"
echo "3. Navigate around the site to generate vitals"
echo "4. Refresh dashboard to see captured events"
