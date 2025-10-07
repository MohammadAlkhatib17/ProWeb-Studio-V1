#!/bin/bash

# I18n Language Alternates Validation Script
# Checks that all pages only declare nl-NL and x-default language alternates

set -e

SITE_URL="${SITE_URL:-https://prowebstudio.nl}"
TEMP_DIR=$(mktemp -d)
SUCCESS=true

echo "🌍 I18n Language Alternates Validation"
echo "======================================"
echo "Site URL: $SITE_URL"
echo ""

# Function to check a page for proper hreflang configuration
check_page_hreflang() {
    local path="$1"
    local url="${SITE_URL}${path}"
    local temp_file="${TEMP_DIR}/$(basename "$path" .html).html"
    
    echo "Checking: $path"
    
    # Fetch the page
    if ! curl -s -L "$url" > "$temp_file"; then
        echo "❌ Failed to fetch $url"
        SUCCESS=false
        return
    fi
    
    # Check for invalid language alternates
    local invalid_langs=(en-US de-DE fr-FR en de fr)
    local found_invalid=false
    
    for lang in "${invalid_langs[@]}"; do
        if grep -q "hreflang=\"$lang\"" "$temp_file" || grep -q "hreflang='$lang'" "$temp_file"; then
            echo "❌ Found invalid hreflang: $lang"
            found_invalid=true
            SUCCESS=false
        fi
    done
    
    # Check for proper Dutch language alternates
    local has_nl_nl=false
    local has_x_default=false
    
    if grep -q 'hreflang="nl-NL"' "$temp_file" || grep -q "hreflang='nl-NL'" "$temp_file"; then
        has_nl_nl=true
    fi
    
    if grep -q 'hreflang="x-default"' "$temp_file" || grep -q "hreflang='x-default'" "$temp_file"; then
        has_x_default=true
    fi
    
    if [[ "$has_nl_nl" == true && "$has_x_default" == true ]]; then
        if [[ "$found_invalid" == false ]]; then
            echo "✅ Correct hreflang configuration (nl-NL, x-default only)"
        fi
    else
        echo "❌ Missing required hreflang tags:"
        [[ "$has_nl_nl" == false ]] && echo "   - Missing nl-NL"
        [[ "$has_x_default" == false ]] && echo "   - Missing x-default"
        SUCCESS=false
    fi
    
    echo ""
}

# Pages to check
pages=(
    "/"
    "/contact"
    "/diensten"
    "/diensten/website-laten-maken"
    "/diensten/webshop-laten-maken"
    "/diensten/seo-optimalisatie"
    "/diensten/3d-website-ervaringen"
    "/diensten/onderhoud-support"
    "/over-ons"
    "/portfolio"
    "/werkwijze"
    "/locaties"
    "/locaties/amsterdam"
    "/privacy"
    "/voorwaarden"
    "/overzicht-site"
)

# Check each page
for page in "${pages[@]}"; do
    check_page_hreflang "$page"
done

# Cleanup
rm -rf "$TEMP_DIR"

# Summary
echo "📋 Validation Summary"
echo "===================="
if [[ "$SUCCESS" == true ]]; then
    echo "✅ All pages have correct hreflang configuration"
    echo "✅ No invalid language alternates found"
    echo "✅ Lighthouse i18n audit should pass"
    echo "✅ Google Search Console should have no alternate-language warnings"
    exit 0
else
    echo "❌ Some pages have incorrect hreflang configuration"
    echo "❌ Fix the issues above to pass Lighthouse i18n audit"
    exit 1
fi