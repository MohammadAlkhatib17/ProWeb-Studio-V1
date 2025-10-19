#!/bin/bash

# Local SEO Schema Validation Script
# Tests LocalBusiness schema on services and location pages

echo "🔍 Local SEO Schema Validation"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL (update for production)
BASE_URL="${1:-http://localhost:3000}"

echo "Testing URL: $BASE_URL"
echo ""

# Function to check if schema exists on page
check_schema() {
    local url=$1
    local page_name=$2
    
    echo -e "${YELLOW}Testing: $page_name${NC}"
    echo "URL: $url"
    
    # Fetch page and extract JSON-LD
    content=$(curl -s "$url")
    
    # Check for LocalBusiness schema
    if echo "$content" | grep -q '"@type".*"LocalBusiness"'; then
        echo -e "${GREEN}✓ LocalBusiness schema found${NC}"
        
        # Extract and validate NAP data
        if echo "$content" | grep -q '"name".*"ProWeb Studio"'; then
            echo -e "${GREEN}✓ Business name present${NC}"
        else
            echo -e "${RED}✗ Business name missing${NC}"
        fi
        
        if echo "$content" | grep -q '"telephone"'; then
            echo -e "${GREEN}✓ Phone number present${NC}"
        else
            echo -e "${RED}✗ Phone number missing${NC}"
        fi
        
        if echo "$content" | grep -q '"address"'; then
            echo -e "${GREEN}✓ Address present${NC}"
        else
            echo -e "${RED}✗ Address missing${NC}"
        fi
        
        if echo "$content" | grep -q '"email"'; then
            echo -e "${GREEN}✓ Email present${NC}"
        else
            echo -e "${RED}✗ Email missing${NC}"
        fi
        
        # Check for opening hours
        if echo "$content" | grep -q '"openingHoursSpecification"'; then
            echo -e "${GREEN}✓ Opening hours present${NC}"
        else
            echo -e "${YELLOW}⚠ Opening hours missing${NC}"
        fi
        
        # Check for service catalog
        if echo "$content" | grep -q '"hasOfferCatalog"'; then
            echo -e "${GREEN}✓ Service catalog present${NC}"
        else
            echo -e "${YELLOW}⚠ Service catalog missing${NC}"
        fi
        
    else
        echo -e "${RED}✗ LocalBusiness schema NOT found${NC}"
    fi
    
    echo ""
}

# Test services page
check_schema "$BASE_URL/diensten" "Services Page"

# Test location pages
check_schema "$BASE_URL/locaties/amsterdam" "Amsterdam Location Page"
check_schema "$BASE_URL/locaties/rotterdam" "Rotterdam Location Page"
check_schema "$BASE_URL/locaties/utrecht" "Utrecht Location Page"

# Test locations index
check_schema "$BASE_URL/locaties" "Locations Index Page"

echo "================================"
echo "Validation complete!"
echo ""
echo "Next steps:"
echo "1. Test schemas with Google Rich Results Test:"
echo "   https://search.google.com/test/rich-results"
echo ""
echo "2. Validate with Schema.org validator:"
echo "   https://validator.schema.org/"
echo ""
echo "3. Check in Google Search Console after deployment"
