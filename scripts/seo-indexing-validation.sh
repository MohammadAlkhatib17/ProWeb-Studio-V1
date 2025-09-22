#!/bin/bash

# SEO Indexing Submission Script for ProWeb Studio
# This script helps submit your site to search engines and validates SEO implementation

echo "🚀 ProWeb Studio SEO Indexing & Validation Script"
echo "=================================================="

# Site configuration
SITE_URL="${SITE_URL:-https://prowebstudio.nl}"
SITE_NAME="ProWeb Studio"

echo "🔍 Site URL: $SITE_URL"
echo ""

# Function to check if URL is accessible
check_url() {
    local url=$1
    local name=$2
    echo -n "Checking $name... "
    
    if curl -s --head "$url" | head -n 1 | grep -q "200 OK"; then
        echo "✅ OK"
        return 0
    else
        echo "❌ FAILED"
        return 1
    fi
}

# Function to validate SEO files
validate_seo_files() {
    echo "📋 Validating SEO Files"
    echo "----------------------"
    
    check_url "$SITE_URL/robots.txt" "robots.txt"
    check_url "$SITE_URL/sitemap.xml" "sitemap.xml"
    check_url "$SITE_URL/sitemap-images.xml" "sitemap-images.xml"
    check_url "$SITE_URL/manifest.json" "manifest.json"
    
    echo ""
}

# Function to check meta tags
validate_meta_tags() {
    echo "🏷️  Validating Meta Tags"
    echo "------------------------"
    
    local temp_file=$(mktemp)
    curl -s "$SITE_URL" > "$temp_file"
    
    # Check for canonical URL
    if grep -q 'rel="canonical"' "$temp_file"; then
        echo "✅ Canonical URL found"
    else
        echo "❌ Canonical URL missing"
    fi
    
    # Check for hreflang
    if grep -q 'hrefLang=' "$temp_file"; then
        echo "✅ Hreflang tags found"
    else
        echo "❌ Hreflang tags missing"
    fi
    
    # Check for Open Graph
    if grep -q 'property="og:' "$temp_file"; then
        echo "✅ Open Graph tags found"
    else
        echo "❌ Open Graph tags missing"
    fi
    
    # Check for structured data
    if grep -q 'application/ld+json' "$temp_file"; then
        echo "✅ Structured data found"
    else
        echo "❌ Structured data missing"
    fi
    
    # Check for robots meta
    if grep -q 'name="robots"' "$temp_file"; then
        echo "✅ Robots meta tag found"
    else
        echo "❌ Robots meta tag missing"
    fi
    
    rm "$temp_file"
    echo ""
}

# Function to submit to search engines
submit_to_search_engines() {
    echo "🌐 Search Engine Submission URLs"
    echo "--------------------------------"
    echo "Google Search Console: https://search.google.com/search-console"
    echo "Bing Webmaster Tools: https://www.bing.com/webmasters"
    echo "Yandex Webmaster: https://webmaster.yandex.com/"
    echo ""
    
    echo "📤 Manual Submission URLs:"
    echo "Google: $SITE_URL/sitemap.xml"
    echo "Bing: $SITE_URL/sitemap.xml"
    echo ""
    
    echo "🔗 Ping Search Engines (if available):"
    
    # Ping Google (if sitemap exists)
    if check_url "$SITE_URL/sitemap.xml" "sitemap" > /dev/null; then
        echo "Google ping URL: http://www.google.com/ping?sitemap=${SITE_URL}/sitemap.xml"
        echo "Bing ping URL: http://www.bing.com/ping?sitemap=${SITE_URL}/sitemap.xml"
    fi
    echo ""
}

# Function to check page speed
check_page_speed() {
    echo "⚡ Page Speed Recommendations"
    echo "-----------------------------"
    echo "Google PageSpeed Insights: https://pagespeed.web.dev/analysis?url=${SITE_URL}"
    echo "GTmetrix: https://gtmetrix.com/?url=${SITE_URL}"
    echo "WebPageTest: https://www.webpagetest.org/"
    echo ""
}

# Function to display indexing tips
display_indexing_tips() {
    echo "💡 SEO Indexing Tips"
    echo "-------------------"
    echo "1. Submit your sitemap to Google Search Console"
    echo "2. Request indexing for your homepage manually"
    echo "3. Build quality backlinks from Dutch websites"
    echo "4. Ensure fast loading times (< 3 seconds)"
    echo "5. Use Google My Business for local SEO"
    echo "6. Create quality Dutch content regularly"
    echo "7. Monitor Core Web Vitals"
    echo "8. Ensure mobile-first design"
    echo ""
}

# Function to validate local Dutch SEO
validate_dutch_seo() {
    echo "🇳🇱 Dutch SEO Validation"
    echo "------------------------"
    
    local temp_file=$(mktemp)
    curl -s "$SITE_URL" > "$temp_file"
    
    # Check for Dutch language
    if grep -q 'lang="nl' "$temp_file" || grep -q 'hreflang="nl' "$temp_file"; then
        echo "✅ Dutch language targeting found"
    else
        echo "❌ Dutch language targeting missing"
    fi
    
    # Check for Netherlands geo targeting
    if grep -q 'geo.region.*NL' "$temp_file" || grep -q 'geo.placename.*Netherlands' "$temp_file"; then
        echo "✅ Netherlands geo-targeting found"
    else
        echo "❌ Netherlands geo-targeting missing"
    fi
    
    # Check for Dutch keywords
    if grep -i -q 'website laten maken\|webdesign nederland\|website maken' "$temp_file"; then
        echo "✅ Dutch SEO keywords found"
    else
        echo "❌ Dutch SEO keywords missing"
    fi
    
    rm "$temp_file"
    echo ""
}

# Main execution
main() {
    validate_seo_files
    validate_meta_tags
    validate_dutch_seo
    submit_to_search_engines
    check_page_speed
    display_indexing_tips
    
    echo "✨ SEO validation complete!"
    echo "Review the results above and address any missing elements."
    echo ""
    echo "Next steps:"
    echo "1. Fix any ❌ issues found above"
    echo "2. Submit your sitemap to Google Search Console"
    echo "3. Request indexing for your homepage"
    echo "4. Monitor search console for indexing status"
}

# Run the script
main