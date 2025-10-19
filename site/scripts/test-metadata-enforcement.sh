#!/bin/bash
#
# Test Dutch Metadata Enforcement Implementation
# This script verifies that the metadata validation system works correctly
#

set -e  # Exit on error

echo "======================================"
echo "Dutch Metadata Enforcement - Test Suite"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to run tests
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_exit="$3"
    
    echo -e "${BLUE}TEST:${NC} $test_name"
    
    set +e  # Don't exit on error for tests
    eval "$test_command" > /dev/null 2>&1
    local exit_code=$?
    set -e
    
    if [ $exit_code -eq $expected_exit ]; then
        echo -e "${GREEN}✓ PASS${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} (expected exit code $expected_exit, got $exit_code)"
        ((TESTS_FAILED++))
    fi
    echo ""
}

echo "1. Testing metadata validation script..."
echo "========================================"
echo ""

# Test 1: Validation script should exist
if [ -f "scripts/validate-metadata.ts" ]; then
    echo -e "${GREEN}✓${NC} Validation script exists"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗${NC} Validation script missing"
    ((TESTS_FAILED++))
fi
echo ""

# Test 2: Validation should pass (warnings only)
echo -e "${BLUE}TEST:${NC} Metadata validation (should pass with warnings)"
npm run validate:metadata 2>&1 | tee /tmp/validate-output.txt
if grep -q "Validation completed with warnings only" /tmp/validate-output.txt; then
    echo -e "${GREEN}✓ PASS${NC} - Validation completed successfully"
    ((TESTS_PASSED++))
elif grep -q "All metadata validations passed" /tmp/validate-output.txt; then
    echo -e "${GREEN}✓ PASS${NC} - All validations passed (no warnings)"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} - Validation failed with errors"
    ((TESTS_FAILED++))
fi
echo ""

# Test 3: Check that root layout has lang="nl"
echo -e "${BLUE}TEST:${NC} Root layout has lang=\"nl\""
if grep -q 'html lang="nl"' src/app/layout.tsx; then
    echo -e "${GREEN}✓ PASS${NC} - Found lang=\"nl\" in root layout"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} - lang=\"nl\" not found in root layout"
    ((TESTS_FAILED++))
fi
echo ""

# Test 4: Check that metadata generators exist
echo -e "${BLUE}TEST:${NC} Metadata generator utilities exist"
if [ -f "src/lib/metadata/generator.ts" ] && [ -f "src/lib/metadata/validator.ts" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Generator and validator files exist"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} - Generator or validator files missing"
    ((TESTS_FAILED++))
fi
echo ""

# Test 5: Check that homepage uses generatePageMetadata
echo -e "${BLUE}TEST:${NC} Homepage uses metadata generator"
if grep -q "generatePageMetadata" src/app/page.tsx; then
    echo -e "${GREEN}✓ PASS${NC} - Homepage uses generatePageMetadata"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} - Homepage doesn't use metadata generator"
    ((TESTS_FAILED++))
fi
echo ""

# Test 6: Check that SITE_URL validation exists
echo -e "${BLUE}TEST:${NC} SITE_URL validation in defaults"
if grep -q "CRITICAL.*SITE_URL" src/lib/metadata/defaults.ts; then
    echo -e "${GREEN}✓ PASS${NC} - SITE_URL validation exists"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} - SITE_URL validation missing"
    ((TESTS_FAILED++))
fi
echo ""

# Test 7: Check that build script includes validation
echo -e "${BLUE}TEST:${NC} Build script includes metadata validation"
if grep -q "validate:metadata" package.json && grep -q "npm run validate:metadata" package.json; then
    echo -e "${GREEN}✓ PASS${NC} - Validation integrated into build"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} - Validation not integrated into build"
    ((TESTS_FAILED++))
fi
echo ""

# Test 8: Check documentation exists
echo -e "${BLUE}TEST:${NC} Documentation files exist"
docs_exist=true
[ ! -f "NL_METADATA_ENFORCEMENT.md" ] && docs_exist=false
[ ! -f "NL_METADATA_QUICK_REF.md" ] && docs_exist=false
[ ! -f "NL_METADATA_ENFORCEMENT_SUMMARY.md" ] && docs_exist=false

if $docs_exist; then
    echo -e "${GREEN}✓ PASS${NC} - All documentation files exist"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} - Some documentation files missing"
    ((TESTS_FAILED++))
fi
echo ""

# Test 9: Check that metadata includes required fields
echo -e "${BLUE}TEST:${NC} Metadata generator enforces required fields"
check_pass=true
grep -q "canonical.*canonicalUrl" src/lib/metadata/generator.ts || check_pass=false
grep -q "nl-NL.*canonicalUrl" src/lib/metadata/generator.ts || check_pass=false
grep -q "locale.*dutchMetadataDefaults" src/lib/metadata/generator.ts || check_pass=false

if $check_pass; then
    echo -e "${GREEN}✓ PASS${NC} - Required fields enforced in generator"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} - Required fields not properly enforced"
    ((TESTS_FAILED++))
fi
echo ""

# Test 10: Verify no new dependencies were added
echo -e "${BLUE}TEST:${NC} No new npm dependencies added"
if ! grep -q "metadata-validator\|canonical-url\|hreflang" package.json; then
    echo -e "${GREEN}✓ PASS${NC} - No new dependencies added"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} - New dependencies were added"
    ((TESTS_FAILED++))
fi
echo ""

# Summary
echo "======================================"
echo "Test Results Summary"
echo "======================================"
echo ""
echo -e "${GREEN}Passed:${NC} $TESTS_PASSED"
echo -e "${RED}Failed:${NC} $TESTS_FAILED"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    echo ""
    echo "Dutch metadata enforcement is working correctly."
    exit 0
else
    echo -e "${RED}✗ Some tests failed.${NC}"
    echo ""
    echo "Please review the failures above."
    exit 1
fi
