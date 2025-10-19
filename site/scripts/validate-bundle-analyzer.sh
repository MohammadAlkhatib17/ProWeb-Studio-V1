#!/bin/bash

# Bundle Analyzer Validation Script
# Tests the bundle analysis pipeline locally before pushing to CI

set -e

SITE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPORTS_DIR="$SITE_DIR/../reports/bundles"

echo "🔍 Bundle Analyzer Validation"
echo "=============================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the site directory
if [ ! -f "$SITE_DIR/package.json" ]; then
    echo -e "${RED}❌ Error: Must run from site/ directory${NC}"
    exit 1
fi

cd "$SITE_DIR"

echo "📋 Step 1: Checking prerequisites..."
echo "-----------------------------------"

# Check for required files
REQUIRED_FILES=(
    "package.json"
    "analyze-bundle.js"
    "budgets.json"
    "scripts/bundle-compare-pr.js"
    "next.config.mjs"
)

MISSING_FILES=0
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file (missing)"
        MISSING_FILES=$((MISSING_FILES + 1))
    fi
done

if [ $MISSING_FILES -gt 0 ]; then
    echo -e "${RED}❌ Missing required files. Aborting.${NC}"
    exit 1
fi

echo ""
echo "📦 Step 2: Building with bundle analysis..."
echo "-------------------------------------------"

# Clean previous build
if [ -d ".next" ]; then
    echo "Cleaning previous build..."
    rm -rf .next
fi

# Build with analysis
echo "Running: npm run build:analyze"
if npm run build:analyze > /tmp/bundle-build.log 2>&1; then
    echo -e "${GREEN}✓${NC} Build completed successfully"
else
    echo -e "${RED}✗${NC} Build failed. Check /tmp/bundle-build.log for details"
    tail -n 20 /tmp/bundle-build.log
    exit 1
fi

echo ""
echo "📊 Step 3: Generating bundle report..."
echo "--------------------------------------"

# Generate report
if npm run analyze:report > /tmp/bundle-report.log 2>&1; then
    echo -e "${GREEN}✓${NC} Bundle report generated"
else
    echo -e "${YELLOW}⚠${NC} Bundle report generated with warnings"
    cat /tmp/bundle-report.log
fi

echo ""
echo "🔎 Step 4: Validating report files..."
echo "-------------------------------------"

REPORT_FILES=(
    "$REPORTS_DIR/bundle-report.json"
    "$REPORTS_DIR/bundle-report.md"
)

MISSING_REPORTS=0
for file in "${REPORT_FILES[@]}"; do
    if [ -f "$file" ]; then
        SIZE=$(wc -c < "$file" | tr -d ' ')
        echo -e "${GREEN}✓${NC} $(basename $file) (${SIZE} bytes)"
    else
        echo -e "${RED}✗${NC} $(basename $file) (missing)"
        MISSING_REPORTS=$((MISSING_REPORTS + 1))
    fi
done

if [ $MISSING_REPORTS -gt 0 ]; then
    echo -e "${RED}❌ Missing report files. Check analyzer script.${NC}"
    exit 1
fi

echo ""
echo "📄 Step 5: Validating JSON structure..."
echo "---------------------------------------"

if ! python3 -m json.tool "$REPORTS_DIR/bundle-report.json" > /dev/null 2>&1; then
    if ! node -e "JSON.parse(require('fs').readFileSync('$REPORTS_DIR/bundle-report.json'))" 2>&1; then
        echo -e "${RED}✗${NC} Invalid JSON in bundle-report.json"
        exit 1
    fi
fi
echo -e "${GREEN}✓${NC} Valid JSON structure"

# Check required fields
REQUIRED_FIELDS=("timestamp" "routeSizes" "violations" "warnings" "totalSize")
for field in "${REQUIRED_FIELDS[@]}"; do
    if grep -q "\"$field\"" "$REPORTS_DIR/bundle-report.json"; then
        echo -e "${GREEN}✓${NC} Field: $field"
    else
        echo -e "${RED}✗${NC} Missing field: $field"
    fi
done

echo ""
echo "📈 Step 6: Analyzing bundle sizes..."
echo "------------------------------------"

# Extract key metrics from JSON
if command -v jq &> /dev/null; then
    TOTAL_SIZE=$(jq -r '.totalSize' "$REPORTS_DIR/bundle-report.json")
    ROUTE_COUNT=$(jq -r '.routeSizes | length' "$REPORTS_DIR/bundle-report.json")
    VIOLATIONS=$(jq -r '.violations | length' "$REPORTS_DIR/bundle-report.json")
    
    echo "Total Bundle Size: $(numfmt --to=iec-i --suffix=B $TOTAL_SIZE 2>/dev/null || echo "$TOTAL_SIZE bytes")"
    echo "Routes Analyzed: $ROUTE_COUNT"
    echo "Budget Violations: $VIOLATIONS"
    
    if [ "$VIOLATIONS" -gt 0 ]; then
        echo -e "${YELLOW}⚠${NC} Budget violations detected:"
        jq -r '.violations[] | "  - \(.route) (\(.resourceType)): \(.actual) KB / \(.budget) KB"' "$REPORTS_DIR/bundle-report.json"
    fi
else
    echo -e "${YELLOW}⚠${NC} jq not installed, skipping detailed analysis"
    echo "Install jq for detailed metrics: sudo apt-get install jq"
fi

echo ""
echo "🧪 Step 7: Testing comparison script..."
echo "---------------------------------------"

# Create a mock baseline by copying current
mkdir -p /tmp/bundle-test
cp "$REPORTS_DIR/bundle-report.json" /tmp/bundle-test/baseline.json

echo "Testing bundle:compare-pr script..."
if npm run bundle:compare-pr "$REPORTS_DIR/bundle-report.json" /tmp/bundle-test/baseline.json /tmp/bundle-test/pr-comment.md > /tmp/bundle-compare.log 2>&1; then
    echo -e "${GREEN}✓${NC} Comparison script executed successfully"
    
    if [ -f "/tmp/bundle-test/pr-comment.md" ]; then
        echo -e "${GREEN}✓${NC} PR comment generated"
        echo ""
        echo "Preview (first 15 lines):"
        echo "========================"
        head -n 15 /tmp/bundle-test/pr-comment.md
        echo "========================"
        echo "(Full comment at: /tmp/bundle-test/pr-comment.md)"
    else
        echo -e "${RED}✗${NC} PR comment file not created"
    fi
else
    echo -e "${YELLOW}⚠${NC} Comparison script completed with warnings"
    cat /tmp/bundle-compare.log
fi

echo ""
echo "📝 Step 8: Displaying bundle report summary..."
echo "----------------------------------------------"

if [ -f "$REPORTS_DIR/bundle-report.md" ]; then
    echo ""
    head -n 30 "$REPORTS_DIR/bundle-report.md"
    echo ""
    echo "(Full report at: $REPORTS_DIR/bundle-report.md)"
else
    echo -e "${RED}✗${NC} Markdown report not found"
fi

echo ""
echo "🎯 Step 9: Validation Summary"
echo "============================="
echo ""

ALL_PASSED=true

# Final checks
if [ -f "$REPORTS_DIR/bundle-report.json" ] && [ -f "$REPORTS_DIR/bundle-report.md" ]; then
    echo -e "${GREEN}✓${NC} Reports generated successfully"
else
    echo -e "${RED}✗${NC} Report generation failed"
    ALL_PASSED=false
fi

if [ -f ".next/build-manifest.json" ] || [ -f ".next/app-build-manifest.json" ]; then
    echo -e "${GREEN}✓${NC} Next.js build artifacts present"
else
    echo -e "${RED}✗${NC} Next.js build artifacts missing"
    ALL_PASSED=false
fi

if [ -f "/tmp/bundle-test/pr-comment.md" ]; then
    echo -e "${GREEN}✓${NC} PR comment generation works"
else
    echo -e "${RED}✗${NC} PR comment generation failed"
    ALL_PASSED=false
fi

echo ""

if [ "$ALL_PASSED" = true ]; then
    echo -e "${GREEN}✅ All validations passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Review the report at: $REPORTS_DIR/bundle-report.md"
    echo "2. Check for any budget violations"
    echo "3. Commit and push to trigger CI"
    echo "4. Monitor PR comment for bundle analysis"
    exit 0
else
    echo -e "${RED}❌ Some validations failed${NC}"
    echo ""
    echo "Please review the errors above and fix before pushing to CI."
    exit 1
fi
