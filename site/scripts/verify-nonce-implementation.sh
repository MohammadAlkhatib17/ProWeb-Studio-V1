#!/bin/bash

# CSP Nonce Implementation Verification Script
# Checks that nonce is properly implemented across all components

echo "🔍 Verifying CSP Nonce Implementation..."
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASS=0
FAIL=0
WARN=0

# Function to check and report
check() {
    local name=$1
    local cmd=$2
    local expected=$3
    
    result=$(eval "$cmd" 2>/dev/null | wc -l)
    
    if [ "$result" -ge "$expected" ]; then
        echo -e "${GREEN}✓${NC} $name: Found $result occurrences (expected: $expected+)"
        ((PASS++))
    else
        echo -e "${RED}✗${NC} $name: Found $result occurrences (expected: $expected+)"
        ((FAIL++))
    fi
}

# Function for warnings
warn() {
    local msg=$1
    echo -e "${YELLOW}⚠${NC} $msg"
    ((WARN++))
}

echo "1. Checking middleware nonce generation..."
check "Nonce generation in middleware" \
    "grep -r \"getRandomValues\" src/middleware.ts" \
    1

check "Nonce header set in middleware" \
    "grep -r \"x-nonce\" src/middleware.ts" \
    2

echo ""
echo "2. Checking layout.tsx nonce reading..."
check "Nonce read from headers in layout" \
    "grep \"get('x-nonce')\" src/app/layout.tsx" \
    1

check "Nonce passed to SEOSchema" \
    "grep \"<SEOSchema.*nonce={nonce}\" src/app/layout.tsx" \
    1

check "Nonce passed to ConsentAwareAnalytics" \
    "grep \"nonce={nonce}\" src/app/layout.tsx" \
    2

echo ""
echo "3. Checking StructuredData component..."
check "Nonce prop in StructuredData" \
    "grep \"nonce?:\" src/components/metadata/StructuredData.tsx" \
    1

check "Nonce applied to Script tag in StructuredData" \
    "grep \"nonce={nonce}\" src/components/metadata/StructuredData.tsx" \
    1

echo ""
echo "4. Checking PageStructuredData component..."
check "Nonce read from headers (lowercase)" \
    "grep \"get('x-nonce')\" src/components/metadata/PageStructuredData.tsx" \
    1

# Check for incorrect uppercase header (should not exist)
UPPERCASE=$(grep -c "get('X-Nonce')" src/components/metadata/PageStructuredData.tsx 2>/dev/null || echo 0)
if [ "$UPPERCASE" -eq 0 ]; then
    echo -e "${GREEN}✓${NC} No uppercase 'X-Nonce' headers found (correct)"
    ((PASS++))
else
    echo -e "${RED}✗${NC} Found uppercase 'X-Nonce' headers (should be lowercase)"
    ((FAIL++))
fi

echo ""
echo "5. Checking SEOSchema component..."
check "Nonce prop accepted by SEOSchema" \
    "grep \"nonce?:\" src/components/SEOSchema.tsx" \
    1

check "Nonce applied to Script tags in SEOSchema" \
    "grep \"nonce={nonce}\" src/components/SEOSchema.tsx" \
    20

echo ""
echo "6. Checking unique Script IDs..."
# Extract all script IDs and check for duplicates
SCRIPT_IDS=$(grep -o 'id="[^"]*"' src/components/SEOSchema.tsx | sort | uniq -d | wc -l)
if [ "$SCRIPT_IDS" -eq 0 ]; then
    echo -e "${GREEN}✓${NC} All Script IDs are unique"
    ((PASS++))
else
    echo -e "${RED}✗${NC} Found duplicate Script IDs"
    ((FAIL++))
fi

echo ""
echo "7. Checking dangerouslySetInnerHTML usage..."
check "All JSON-LD scripts use dangerouslySetInnerHTML" \
    "grep -A 2 'type=\"application/ld+json\"' src/components/SEOSchema.tsx | grep -c dangerouslySetInnerHTML" \
    20

echo ""
echo "8. Checking ConsentAwareAnalytics..."
check "Nonce prop in ConsentAwareAnalytics" \
    "grep \"nonce?:\" src/components/cookies/ConsentAwareAnalytics.tsx" \
    1

check "Nonce applied to analytics Script" \
    "grep \"nonce={nonce}\" src/components/cookies/ConsentAwareAnalytics.tsx" \
    1

echo ""
echo "========================================"
echo "Summary:"
echo -e "${GREEN}✓ Passed: $PASS${NC}"
if [ $FAIL -gt 0 ]; then
    echo -e "${RED}✗ Failed: $FAIL${NC}"
fi
if [ $WARN -gt 0 ]; then
    echo -e "${YELLOW}⚠ Warnings: $WARN${NC}"
fi
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Nonce implementation is complete.${NC}"
    exit 0
else
    echo -e "${RED}❌ Some checks failed. Please review the implementation.${NC}"
    exit 1
fi
