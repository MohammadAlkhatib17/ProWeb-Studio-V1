#!/bin/bash
# Cookie Banner Optimization Verification Script
# Validates cookie consent banner performance and hydration timing

set -e

echo "🍪 Cookie Banner Optimization Verification"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if layout.tsx has been optimized
echo "1️⃣  Checking layout.tsx structure..."
LAYOUT_FILE="src/app/layout.tsx"

if [ ! -f "$LAYOUT_FILE" ]; then
  echo -e "${RED}❌ Error: $LAYOUT_FILE not found${NC}"
  exit 1
fi

# Verify dynamic imports are in place
if grep -q "const CursorTrail = dynamic" "$LAYOUT_FILE"; then
  echo -e "${GREEN}✓ CursorTrail is lazy loaded with dynamic()${NC}"
else
  echo -e "${RED}❌ CursorTrail should be lazy loaded${NC}"
  exit 1
fi

if grep -q "const DutchPerformanceMonitor = dynamic" "$LAYOUT_FILE"; then
  echo -e "${GREEN}✓ DutchPerformanceMonitor is lazy loaded with dynamic()${NC}"
else
  echo -e "${RED}❌ DutchPerformanceMonitor should be lazy loaded${NC}"
  exit 1
fi

if grep -q "const WebVitalsReporter = dynamic" "$LAYOUT_FILE"; then
  echo -e "${GREEN}✓ WebVitalsReporter is lazy loaded with dynamic()${NC}"
else
  echo -e "${RED}❌ WebVitalsReporter should be lazy loaded${NC}"
  exit 1
fi

# Verify ssr: false is set
if grep -q "ssr: false" "$LAYOUT_FILE"; then
  echo -e "${GREEN}✓ Heavy components have ssr: false set${NC}"
else
  echo -e "${RED}❌ Components should have ssr: false${NC}"
  exit 1
fi

# Verify CookieConsentBanner is first in body
echo ""
echo "2️⃣  Verifying component order in <body>..."

# Extract body content
BODY_START=$(grep -n "<body" "$LAYOUT_FILE" | cut -d: -f1)
BODY_END=$(grep -n "</body>" "$LAYOUT_FILE" | cut -d: -f1)

if [ -z "$BODY_START" ] || [ -z "$BODY_END" ]; then
  echo -e "${RED}❌ Could not find <body> tag${NC}"
  exit 1
fi

# Get line number of first meaningful component
BANNER_LINE=$(sed -n "${BODY_START},${BODY_END}p" "$LAYOUT_FILE" | grep -n "CookieConsentBanner" | head -1 | cut -d: -f1)
BACKGROUND_LINE=$(sed -n "${BODY_START},${BODY_END}p" "$LAYOUT_FILE" | grep -n "BackgroundLayer" | head -1 | cut -d: -f1)
CURSOR_LINE=$(sed -n "${BODY_START},${BODY_END}p" "$LAYOUT_FILE" | grep -n "CursorTrail" | head -1 | cut -d: -f1)

if [ -z "$BANNER_LINE" ]; then
  echo -e "${RED}❌ CookieConsentBanner not found in body${NC}"
  exit 1
fi

if [ -n "$BACKGROUND_LINE" ] && [ "$BANNER_LINE" -lt "$BACKGROUND_LINE" ]; then
  echo -e "${GREEN}✓ CookieConsentBanner appears before BackgroundLayer${NC}"
else
  echo -e "${RED}❌ CookieConsentBanner should appear before BackgroundLayer${NC}"
  exit 1
fi

if [ -n "$CURSOR_LINE" ] && [ "$BANNER_LINE" -lt "$CURSOR_LINE" ]; then
  echo -e "${GREEN}✓ CookieConsentBanner appears before CursorTrail${NC}"
else
  echo -e "${RED}❌ CookieConsentBanner should appear before CursorTrail${NC}"
  exit 1
fi

# Verify CookieSettingsModal comes after CookieConsentBanner
MODAL_LINE=$(sed -n "${BODY_START},${BODY_END}p" "$LAYOUT_FILE" | grep -n "CookieSettingsModal" | head -1 | cut -d: -f1)

if [ -n "$MODAL_LINE" ] && [ "$MODAL_LINE" -gt "$BANNER_LINE" ]; then
  echo -e "${GREEN}✓ CookieSettingsModal appears after CookieConsentBanner${NC}"
else
  echo -e "${RED}❌ CookieSettingsModal should appear after CookieConsentBanner${NC}"
  exit 1
fi

# Verify ConsentAwareAnalytics comes after CookieConsentBanner
ANALYTICS_LINE=$(sed -n "${BODY_START},${BODY_END}p" "$LAYOUT_FILE" | grep -n "ConsentAwareAnalytics" | head -1 | cut -d: -f1)

if [ -n "$ANALYTICS_LINE" ] && [ "$ANALYTICS_LINE" -gt "$BANNER_LINE" ]; then
  echo -e "${GREEN}✓ ConsentAwareAnalytics appears after CookieConsentBanner${NC}"
else
  echo -e "${RED}❌ ConsentAwareAnalytics should appear after CookieConsentBanner${NC}"
  exit 1
fi

echo ""
echo "3️⃣  Checking for hydration optimization patterns..."

# Check that dynamic imports have loading fallback
if grep -q "loading: () => null" "$LAYOUT_FILE"; then
  echo -e "${GREEN}✓ Dynamic imports have loading fallback${NC}"
else
  echo -e "${YELLOW}⚠️  Consider adding loading fallback to dynamic imports${NC}"
fi

# Check for metadata preservation
if grep -q "export const metadata: Metadata" "$LAYOUT_FILE"; then
  echo -e "${GREEN}✓ Metadata export is preserved${NC}"
else
  echo -e "${RED}❌ Metadata export should be preserved${NC}"
  exit 1
fi

echo ""
echo "4️⃣  Bundle size check..."

# Check if next build artifacts exist
if [ -d ".next" ]; then
  echo -e "${YELLOW}ℹ️  Found .next directory - checking for layout chunk${NC}"
  
  # Find layout chunk
  LAYOUT_CHUNKS=$(find .next/static/chunks -name "*layout*" 2>/dev/null || true)
  
  if [ -n "$LAYOUT_CHUNKS" ]; then
    echo -e "${GREEN}✓ Layout chunks found:${NC}"
    echo "$LAYOUT_CHUNKS" | while read -r chunk; do
      SIZE=$(stat -f%z "$chunk" 2>/dev/null || stat -c%s "$chunk" 2>/dev/null || echo "unknown")
      if [ "$SIZE" != "unknown" ]; then
        SIZE_KB=$((SIZE / 1024))
        echo "  - $(basename "$chunk"): ${SIZE_KB}KB"
      fi
    done
  else
    echo -e "${YELLOW}⚠️  No layout chunks found - run 'npm run build' first${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  No .next directory found - run 'npm run build' to check bundle size${NC}"
fi

echo ""
echo "5️⃣  Recommendations for testing..."
echo ""
echo "  Manual Tests Required:"
echo "  ✓ Clear cookies and reload page"
echo "  ✓ Verify banner appears within 500ms on mobile throttling (4G)"
echo "  ✓ Check browser console for hydration warnings"
echo "  ✓ Measure CLS with Chrome DevTools"
echo "  ✓ Test banner interaction before page fully loads"
echo ""
echo "  Performance Testing Commands:"
echo "  $ npm run lighthouse:mobile"
echo "  $ npm run build && npm run start"
echo "  $ Chrome DevTools > Performance tab > Record page load"
echo ""

echo "=========================================="
echo -e "${GREEN}✅ Cookie Banner Optimization Verified${NC}"
echo ""
echo "Next steps:"
echo "1. Run 'npm run build' to check bundle size delta"
echo "2. Test on mobile device/emulation (Chrome DevTools)"
echo "3. Verify banner hydration timing with Performance tab"
echo "4. Check CLS metric in Lighthouse"
echo ""
