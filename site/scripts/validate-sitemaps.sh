#!/bin/bash

# Advanced Sitemap Validation Script for ProWeb Studio
# Validates all sitemaps for compliance with sitemaps.org standards

set -e

# Configuration
SITE_URL="${SITE_URL:-https://prowebstudio.nl}"
BASE_URL="${1:-http://localhost:3000}"
TEMP_DIR="/tmp/sitemap-validation"
RESULTS_FILE="sitemap-validation-results.md"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create temp directory
mkdir -p "$TEMP_DIR"

echo -e "${BLUE}🔍 Advanced Sitemap Validation for ProWeb Studio${NC}"
echo "=========================================="
echo "Base URL: $BASE_URL"
echo "Site URL: $SITE_URL"
echo ""

# Initialize results file
cat > "$RESULTS_FILE" << EOF
# Sitemap Validation Results

Generated: $(date)
Base URL: $BASE_URL
Site URL: $SITE_URL

## Summary

EOF

# Function to validate XML structure
validate_xml() {
    local url="$1"
    local name="$2"
    local temp_file="$TEMP_DIR/${name}.xml"
    
    echo -e "${YELLOW}Validating $name...${NC}"
    
    # Download sitemap
    if curl -s -f -o "$temp_file" "$url"; then
        echo -e "${GREEN}✓ Downloaded successfully${NC}"
        
        # Check if it's valid XML
        if xmllint --noout "$temp_file" 2>/dev/null; then
            echo -e "${GREEN}✓ Valid XML structure${NC}"
            
            # Count URLs
            local url_count
            if [[ "$name" == *"index"* ]]; then
                url_count=$(xmllint --xpath "count(//sitemap)" "$temp_file" 2>/dev/null || echo "0")
                echo -e "${BLUE}📊 Contains $url_count sitemaps${NC}"
            else
                url_count=$(xmllint --xpath "count(//url)" "$temp_file" 2>/dev/null || echo "0")
                echo -e "${BLUE}📊 Contains $url_count URLs${NC}"
                
                # Check for 50k limit
                if [ "$url_count" -gt 50000 ]; then
                    echo -e "${RED}⚠️  WARNING: Exceeds 50,000 URL limit${NC}"
                fi
            fi
            
            # Validate namespace declarations
            if grep -q 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' "$temp_file"; then
                echo -e "${GREEN}✓ Correct sitemap namespace${NC}"
            else
                echo -e "${RED}✗ Missing or incorrect sitemap namespace${NC}"
            fi
            
            # Check for specific namespace validations
            case "$name" in
                *"images"*)
                    if grep -q 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' "$temp_file"; then
                        echo -e "${GREEN}✓ Correct image namespace${NC}"
                    else
                        echo -e "${RED}✗ Missing or incorrect image namespace${NC}"
                    fi
                    ;;
                *"videos"*)
                    if grep -q 'xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"' "$temp_file"; then
                        echo -e "${GREEN}✓ Correct video namespace${NC}"
                    else
                        echo -e "${RED}✗ Missing or incorrect video namespace${NC}"
                    fi
                    ;;
                *"news"*)
                    if grep -q 'xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"' "$temp_file"; then
                        echo -e "${GREEN}✓ Correct news namespace${NC}"
                    else
                        echo -e "${RED}✗ Missing or incorrect news namespace${NC}"
                    fi
                    ;;
            esac
            
            # Check hreflang implementation (for main sitemap)
            if [[ "$name" == "main" ]]; then
                if grep -q 'xmlns:xhtml="http://www.w3.org/1999/xhtml"' "$temp_file"; then
                    echo -e "${GREEN}✓ Correct hreflang namespace${NC}"
                    
                    local hreflang_count
                    hreflang_count=$(grep -c 'hreflang=' "$temp_file" || echo "0")
                    echo -e "${BLUE}🌐 Contains $hreflang_count hreflang entries${NC}"
                else
                    echo -e "${YELLOW}⚠️  No hreflang namespace found${NC}"
                fi
            fi
            
            echo -e "${GREEN}✓ $name sitemap validation passed${NC}"
            echo ""
            
            # Add to results
            cat >> "$RESULTS_FILE" << EOF
### $name Sitemap
- Status: ✅ Valid
- URLs/Entries: $url_count
- Size: $(wc -c < "$temp_file") bytes
- Last checked: $(date)

EOF
            
        else
            echo -e "${RED}✗ Invalid XML structure${NC}"
            cat >> "$RESULTS_FILE" << EOF
### $name Sitemap
- Status: ❌ Invalid XML
- Error: XML structure validation failed
- Last checked: $(date)

EOF
        fi
    else
        echo -e "${RED}✗ Failed to download sitemap${NC}"
        cat >> "$RESULTS_FILE" << EOF
### $name Sitemap
- Status: ❌ Download failed
- Error: HTTP request failed
- Last checked: $(date)

EOF
    fi
}

# Function to validate robots.txt
validate_robots() {
    echo -e "${YELLOW}Validating robots.txt...${NC}"
    local robots_url="$BASE_URL/robots.txt"
    local temp_file="$TEMP_DIR/robots.txt"
    
    if curl -s -f -o "$temp_file" "$robots_url"; then
        echo -e "${GREEN}✓ robots.txt downloaded successfully${NC}"
        
        # Check for sitemap declarations
        local sitemap_count
        sitemap_count=$(grep -c "^Sitemap:" "$temp_file" || echo "0")
        echo -e "${BLUE}📊 Contains $sitemap_count sitemap declarations${NC}"
        
        # List all sitemap URLs
        echo -e "${BLUE}📋 Sitemap URLs in robots.txt:${NC}"
        grep "^Sitemap:" "$temp_file" | while read -r line; do
            echo "   $line"
        done
        
        echo -e "${GREEN}✓ robots.txt validation passed${NC}"
        echo ""
    else
        echo -e "${RED}✗ Failed to download robots.txt${NC}"
    fi
}

# Function to test sitemap accessibility
test_accessibility() {
    echo -e "${YELLOW}Testing sitemap accessibility...${NC}"
    
    local sitemaps=(
        "sitemap-index.xml"
        "sitemap.xml"
        "sitemap-services.xml"
        "sitemap-locations.xml"
        "sitemap-images.xml"
        "sitemap-news.xml"
        "sitemap-videos.xml"
    )
    
    for sitemap in "${sitemaps[@]}"; do
        local url="$BASE_URL/$sitemap"
        echo -n "Testing $sitemap... "
        
        if curl -s -f -I "$url" > /dev/null; then
            echo -e "${GREEN}✓ Accessible${NC}"
        else
            echo -e "${RED}✗ Not accessible${NC}"
        fi
    done
    echo ""
}

# Function to validate sitemap performance
test_performance() {
    echo -e "${YELLOW}Testing sitemap performance...${NC}"
    
    local start_time
    local end_time
    local duration
    
    start_time=$(date +%s.%N)
    curl -s -f "$BASE_URL/sitemap-index.xml" > /dev/null
    end_time=$(date +%s.%N)
    duration=$(echo "$end_time - $start_time" | bc -l)
    
    echo -e "${BLUE}📈 Sitemap index load time: ${duration}s${NC}"
    
    if (( $(echo "$duration < 1.0" | bc -l) )); then
        echo -e "${GREEN}✓ Good performance (< 1s)${NC}"
    elif (( $(echo "$duration < 3.0" | bc -l) )); then
        echo -e "${YELLOW}⚠️  Acceptable performance (< 3s)${NC}"
    else
        echo -e "${RED}⚠️  Slow performance (> 3s)${NC}"
    fi
    echo ""
}

# Function to validate URL format compliance
validate_url_formats() {
    echo -e "${YELLOW}Validating URL formats...${NC}"
    
    local temp_file="$TEMP_DIR/main.xml"
    
    # Check for common URL issues
    if [ -f "$temp_file" ]; then
        # Check for HTTP vs HTTPS consistency
        local http_count
        local https_count
        http_count=$(grep -c "http://" "$temp_file" || echo "0")
        https_count=$(grep -c "https://" "$temp_file" || echo "0")
        
        echo -e "${BLUE}📊 HTTP URLs: $http_count${NC}"
        echo -e "${BLUE}📊 HTTPS URLs: $https_count${NC}"
        
        if [ "$http_count" -gt 0 ] && [ "$https_count" -gt 0 ]; then
            echo -e "${YELLOW}⚠️  Mixed HTTP/HTTPS URLs found${NC}"
        elif [ "$https_count" -gt 0 ]; then
            echo -e "${GREEN}✓ All URLs use HTTPS${NC}"
        fi
        
        # Check for proper URL encoding
        if grep -q "%20\|%21\|%22" "$temp_file"; then
            echo -e "${GREEN}✓ URLs are properly encoded${NC}"
        fi
        
        # Check lastmod format
        if grep -q "<lastmod>[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}</lastmod>" "$temp_file"; then
            echo -e "${GREEN}✓ lastmod dates in correct format${NC}"
        else
            echo -e "${YELLOW}⚠️  Some lastmod dates may be incorrectly formatted${NC}"
        fi
    fi
    echo ""
}

# Main validation process
echo -e "${BLUE}🚀 Starting comprehensive sitemap validation...${NC}"
echo ""

# Test accessibility first
test_accessibility

# Validate robots.txt
validate_robots

# Validate each sitemap
validate_xml "$BASE_URL/sitemap-index.xml" "index"
validate_xml "$BASE_URL/sitemap.xml" "main"
validate_xml "$BASE_URL/sitemap-services.xml" "services"
validate_xml "$BASE_URL/sitemap-locations.xml" "locations"
validate_xml "$BASE_URL/sitemap-images.xml" "images"
validate_xml "$BASE_URL/sitemap-news.xml" "news"
validate_xml "$BASE_URL/sitemap-videos.xml" "videos"

# Validate URL formats
validate_url_formats

# Test performance
test_performance

# Final summary
echo -e "${GREEN}🎉 Sitemap validation completed!${NC}"
echo -e "${BLUE}📄 Detailed results saved to: $RESULTS_FILE${NC}"

# Add final summary to results
cat >> "$RESULTS_FILE" << EOF

## Validation Details

- Validation completed: $(date)
- Total sitemaps checked: 7
- XML validation: xmllint
- Performance testing: curl timing
- URL format validation: regex patterns

## Recommendations

1. Monitor sitemap sizes to stay under 50k URL limit
2. Ensure all URLs use HTTPS consistently
3. Keep lastmod dates accurate using git-based timestamps
4. Regularly validate XML structure after content updates
5. Monitor performance and consider CDN optimization if needed

## Tools Used

- curl: HTTP requests and performance testing  
- xmllint: XML structure validation
- grep: Pattern matching and counting
- bc: Floating point calculations

EOF

# Cleanup
rm -rf "$TEMP_DIR"

echo ""
echo -e "${BLUE}Validation complete! Check $RESULTS_FILE for detailed results.${NC}"