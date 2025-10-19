#!/usr/bin/env bash

# Runtime & Region Configuration Verification Script
# Verifies all routes follow ADR-runtime.md guidelines

set -euo pipefail

echo "🔍 Verifying Runtime & Region Configuration..."
echo "================================================"
echo ""

ERRORS=0
WARNINGS=0

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Find all route.ts files
ROUTE_FILES=$(find src/app -name "route.ts" -type f 2>/dev/null || find ../src/app -name "route.ts" -type f 2>/dev/null || echo "")

echo "📁 Found $(echo "$ROUTE_FILES" | wc -l) route files"
echo ""

# Check each route file
for route_file in $ROUTE_FILES; do
    echo "Checking: $route_file"
    
    # Check for runtime export
    if ! grep -q "export const runtime" "$route_file"; then
        echo -e "${RED}❌ Missing 'runtime' export${NC}"
        ((ERRORS++))
    else
        RUNTIME=$(grep "export const runtime" "$route_file" | grep -oP "(edge|nodejs)" || echo "unknown")
        echo -e "${GREEN}✅ Runtime: $RUNTIME${NC}"
    fi
    
    # Check for preferredRegion export
    if ! grep -q "export const preferredRegion" "$route_file"; then
        echo -e "${RED}❌ Missing 'preferredRegion' export${NC}"
        ((ERRORS++))
    else
        # Verify it's the correct regions
        if grep -q "preferredRegion.*=.*\['cdg1',.*'lhr1',.*'fra1'\]" "$route_file"; then
            echo -e "${GREEN}✅ Regions: ['cdg1', 'lhr1', 'fra1']${NC}"
        else
            echo -e "${RED}❌ Incorrect regions (should be ['cdg1', 'lhr1', 'fra1'])${NC}"
            ((ERRORS++))
        fi
    fi
    
    # Check for ADR comment
    if ! grep -q "docs/ADR-runtime.md" "$route_file"; then
        echo -e "${YELLOW}⚠️  Missing ADR reference comment${NC}"
        ((WARNINGS++))
    fi
    
    # Check edge runtime doesn't use Node.js packages
    if grep -q "export const runtime.*=.*'edge'" "$route_file"; then
        if grep -q "import.*nodemailer\|import.*'fs'\|import.*'crypto'" "$route_file"; then
            echo -e "${RED}❌ Edge runtime using Node.js-only packages!${NC}"
            ((ERRORS++))
        fi
    fi
    
    echo ""
done

# Check page files (should NOT have runtime/preferredRegion)
PAGE_FILES=$(find src/app -name "page.tsx" -type f 2>/dev/null | head -n 5 || find ../src/app -name "page.tsx" -type f 2>/dev/null | head -n 5 || echo "")
echo "📄 Spot-checking page files (should NOT export runtime/preferredRegion)..."
echo ""

for page_file in $PAGE_FILES; do
    echo "Checking: $page_file"
    
    if grep -q "export const runtime" "$page_file"; then
        echo -e "${YELLOW}⚠️  Page exports 'runtime' (should rely on App Router defaults)${NC}"
        ((WARNINGS++))
    else
        echo -e "${GREEN}✅ No runtime override (correct)${NC}"
    fi
    
    if grep -q "export const preferredRegion" "$page_file"; then
        echo -e "${YELLOW}⚠️  Page exports 'preferredRegion' (should rely on CDN)${NC}"
        ((WARNINGS++))
    else
        echo -e "${GREEN}✅ No region override (correct)${NC}"
    fi
    
    echo ""
done

# Summary
echo "================================================"
echo "📊 Verification Summary"
echo "================================================"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo "All routes are properly configured per ADR-runtime.md"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS warnings found${NC}"
    echo "Configuration is valid but could be improved"
    exit 0
else
    echo -e "${RED}❌ $ERRORS errors found${NC}"
    echo -e "${YELLOW}⚠️  $WARNINGS warnings found${NC}"
    echo ""
    echo "Please fix errors before deploying"
    echo "See docs/ADR-runtime.md for configuration guidelines"
    exit 1
fi
