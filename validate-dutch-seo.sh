#!/bin/bash

# Dutch SEO Enhancement Validation Script
# Validates all implemented Dutch keyword optimizations and content enhancements

echo "🇳🇱 ProWeb Studio - Dutch SEO Enhancement Validation"
echo "=================================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counter for validations
TOTAL_CHECKS=0
PASSED_CHECKS=0

# Function to check if file exists and contains Dutch keywords
check_file_keywords() {
    local file_path="$1"
    local description="$2"
    shift 2
    local keywords=("$@")
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [[ ! -f "$file_path" ]]; then
        echo -e "${RED}❌ FAIL: $description - File not found: $file_path${NC}"
        return 1
    fi
    
    local found_keywords=0
    local total_keywords=${#keywords[@]}
    
    echo -e "${BLUE}🔍 Checking: $description${NC}"
    
    for keyword in "${keywords[@]}"; do
        if grep -q "$keyword" "$file_path"; then
            echo -e "  ${GREEN}✓${NC} Found: '$keyword'"
            found_keywords=$((found_keywords + 1))
        else
            echo -e "  ${RED}✗${NC} Missing: '$keyword'"
        fi
    done
    
    if [[ $found_keywords -ge $((total_keywords / 2)) ]]; then
        echo -e "${GREEN}✅ PASS: $description ($found_keywords/$total_keywords keywords found)${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL: $description ($found_keywords/$total_keywords keywords found)${NC}"
        return 1
    fi
    echo ""
}

# Function to check meta tags in page files
check_meta_optimization() {
    local file_path="$1"
    local page_name="$2"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    echo -e "${BLUE}🔍 Checking meta optimization: $page_name${NC}"
    
    if [[ ! -f "$file_path" ]]; then
        echo -e "${RED}❌ FAIL: $page_name - File not found${NC}"
        return 1
    fi
    
    local has_title=$(grep -c "title:" "$file_path")
    local has_description=$(grep -c "description:" "$file_path")
    local has_dutch_keywords=$(grep -c -E "(website laten maken|webdesign|nederland|nederlandse)" "$file_path" | head -1)
    
    if [[ $has_title -gt 0 && $has_description -gt 0 && $has_dutch_keywords -gt 0 ]]; then
        echo -e "${GREEN}✅ PASS: $page_name meta optimization${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL: $page_name meta optimization${NC}"
        echo -e "  Title tags: $has_title, Descriptions: $has_description, Dutch keywords: $has_dutch_keywords"
        return 1
    fi
    echo ""
}

echo -e "${YELLOW}1. VALIDATING MAIN PAGE META OPTIMIZATIONS${NC}"
echo "============================================="

# Check main pages for Dutch keyword optimization
check_meta_optimization "site/src/app/page.tsx" "Homepage"
check_meta_optimization "site/src/app/diensten/page.tsx" "Services Page"
check_meta_optimization "site/src/app/contact/page.tsx" "Contact Page"
check_meta_optimization "site/src/app/over-ons/page.tsx" "About Page"
check_meta_optimization "site/src/app/werkwijze/page.tsx" "Process Page"

echo ""
echo -e "${YELLOW}2. VALIDATING DUTCH KEYWORD INTEGRATION${NC}"
echo "========================================="

# Check for Dutch business keywords in key files
check_file_keywords "site/src/app/layout.tsx" "Global Keywords (layout.tsx)" \
    "website laten maken nederland" "webdesign nederland" "mkb-vriendelijk" "nederlandse kwaliteit" "iDEAL integratie"

check_file_keywords "site/src/app/page.tsx" "Homepage Content" \
    "Nederlandse ondernemers" "transparante prijzen" "no-nonsense" "website laten maken"

check_file_keywords "site/src/app/diensten/page.tsx" "Services Content" \
    "webshop bouwen" "iDEAL integratie" "Nederlandse bedrijven" "betrouwbare partner"

echo ""
echo -e "${YELLOW}3. VALIDATING NEW DUTCH COMPONENTS${NC}"
echo "=================================="

# Check for new Dutch-specific components
check_file_keywords "site/src/components/DutchMarketFAQ.tsx" "Dutch Market FAQ Component" \
    "Nederlandse ondernemers" "bedrijfsgroei" "MKB" "transparante communicatie" "no-nonsense aanpak"

check_file_keywords "site/src/components/DutchRegionalTargeting.tsx" "Regional Targeting Component" \
    "Amsterdam" "Rotterdam" "Den Haag" "Utrecht" "Eindhoven" "Groningen" "Nederlandse kennis"

check_file_keywords "site/src/components/DutchBusinessCulture.tsx" "Business Culture Component" \
    "Nederlandse bedrijfscultuur" "pragmatische oplossingen" "afspraak is afspraak" "Nederlandse degelijkheid"

echo ""
echo -e "${YELLOW}4. VALIDATING KEYWORD MAPPING DOCUMENTATION${NC}"
echo "============================================="

check_file_keywords "docs/dutch-keyword-mapping.md" "Keyword Mapping Document" \
    "website laten maken" "webshop laten maken" "Nederlandse kwaliteit" "mkb-vriendelijk" "iDEAL integratie" \
    "Amsterdam" "Rotterdam" "pragmatisch" "transparante communicatie"

echo ""
echo -e "${YELLOW}5. VALIDATING REGIONAL TARGETING${NC}"
echo "================================="

# Check if regional content covers major Dutch cities
check_file_keywords "site/src/components/DutchRegionalTargeting.tsx" "Regional Coverage" \
    "Amsterdam" "Rotterdam" "Den Haag" "Utrecht" "Eindhoven" "Tilburg" "Groningen" "Almere" \
    "Noord-Holland" "Zuid-Holland" "Randstad"

echo ""
echo -e "${YELLOW}6. VALIDATING CULTURAL INTEGRATION${NC}"
echo "=================================="

# Check for Dutch cultural terms and business language
check_file_keywords "site/src/components/DutchBusinessCulture.tsx" "Cultural Terms" \
    "no-nonsense aanpak" "Nederlandse kwaliteit" "transparante communicatie" "pragmatische oplossingen" \
    "afspraak is afspraak" "gewoon goed" "AVG/GDPR-proof" "iDEAL-ready" "BTW-transparant"

echo ""
echo -e "${YELLOW}7. VALIDATING SEO SCHEMA ENHANCEMENTS${NC}"
echo "====================================="

# Check if FAQ schemas include Dutch content
check_file_keywords "site/src/components/SEOSchema.tsx" "SEO Schema Dutch Content" \
    "Nederlandse" "Nederland" "Dutch" "nl-NL" "website laten maken" "webshop"

echo ""
echo -e "${YELLOW}8. VALIDATING STRUCTURED DATA${NC}"
echo "=============================="

# Check for proper structured data implementation
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
if grep -q "@context.*schema.org" site/src/components/DutchMarketFAQ.tsx && \
   grep -q "@context.*schema.org" site/src/components/DutchRegionalTargeting.tsx && \
   grep -q "@context.*schema.org" site/src/components/DutchBusinessCulture.tsx; then
    echo -e "${GREEN}✅ PASS: Structured data implementation${NC}"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
    echo -e "${RED}❌ FAIL: Structured data implementation${NC}"
fi

echo ""
echo -e "${YELLOW}9. CHECKING FILE EXISTENCE${NC}"
echo "=========================="

# Critical files that should exist
files_to_check=(
    "docs/dutch-keyword-mapping.md"
    "site/src/components/DutchMarketFAQ.tsx"
    "site/src/components/DutchRegionalTargeting.tsx" 
    "site/src/components/DutchBusinessCulture.tsx"
)

for file in "${files_to_check[@]}"; do
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    if [[ -f "$file" ]]; then
        echo -e "${GREEN}✅ EXISTS: $file${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    else
        echo -e "${RED}❌ MISSING: $file${NC}"
    fi
done

echo ""
echo -e "${YELLOW}10. INTEGRATION RECOMMENDATIONS${NC}"
echo "==============================="

echo "📝 To complete the Dutch SEO implementation:"
echo ""
echo "1. Add DutchMarketFAQ component to relevant pages:"
echo "   - Homepage (after hero section)"
echo "   - Services page (after service descriptions)"
echo "   - Contact page (before contact form)"
echo ""
echo "2. Add DutchRegionalTargeting component to:"
echo "   - Services page (regional service coverage)"
echo "   - About page (our reach across Netherlands)"
echo ""
echo "3. Add DutchBusinessCulture component to:"
echo "   - About page (company values section)"
echo "   - Process page (how we work section)"
echo ""
echo "4. Update navigation/sitemap to include regional pages"
echo ""
echo "5. Consider creating dedicated landing pages for major cities"

echo ""
echo "=============================================="
echo -e "${BLUE}VALIDATION SUMMARY${NC}"
echo "=============================================="
echo -e "Total checks: ${TOTAL_CHECKS}"
echo -e "Passed: ${GREEN}${PASSED_CHECKS}${NC}"
echo -e "Failed: ${RED}$((TOTAL_CHECKS - PASSED_CHECKS))${NC}"

PASS_PERCENTAGE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
echo -e "Success rate: ${PASS_PERCENTAGE}%"

if [[ $PASS_PERCENTAGE -ge 80 ]]; then
    echo -e "${GREEN}🎉 EXCELLENT: Dutch SEO implementation is highly successful!${NC}"
elif [[ $PASS_PERCENTAGE -ge 60 ]]; then
    echo -e "${YELLOW}⚠️  GOOD: Dutch SEO implementation needs minor improvements${NC}"
else
    echo -e "${RED}❌ NEEDS WORK: Dutch SEO implementation requires attention${NC}"
fi

echo ""
echo "Next steps:"
echo "1. Integrate components into existing pages"
echo "2. Test page loading and performance"
echo "3. Validate HTML and structured data"
echo "4. Monitor keyword rankings"
echo "5. Track Dutch visitor engagement"

exit 0