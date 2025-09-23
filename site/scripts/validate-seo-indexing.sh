#!/bin/bash

# ProWeb Studio - SEO Implementation Validation
# Validates all indexing improvements for homepage

SITE_URL="${SITE_URL:-https://prowebstudio.nl}"

echo "🔍 ProWeb Studio - SEO Validation Report"
echo "==========================================="
echo "Site URL: $SITE_URL"
echo "Validation Time: $(date)"
echo

# 1. Check robots.txt
echo "🤖 1. ROBOTS.TXT VALIDATION"
echo "----------------------------"
if curl -s "${SITE_URL}/robots.txt" | grep -q "User-agent:"; then
    echo "✅ robots.txt exists and accessible"
    echo "📋 Content preview:"
    curl -s "${SITE_URL}/robots.txt" | head -10
else
    echo "❌ robots.txt not found or inaccessible"
fi
echo

# 2. Check sitemap
echo "🗺️  2. SITEMAP VALIDATION"
echo "-------------------------"
if curl -s "${SITE_URL}/sitemap.xml" | grep -q "<urlset"; then
    echo "✅ sitemap.xml exists and accessible"
    echo "📊 URLs found: $(curl -s "${SITE_URL}/sitemap.xml" | grep -c "<url>")"
else
    echo "❌ sitemap.xml not found or invalid"
fi
echo

# 3. Check homepage meta tags
echo "🏷️  3. HOMEPAGE META TAGS"
echo "-------------------------"
HOMEPAGE_HTML=$(curl -s "${SITE_URL}/")

# Check canonical URL
if echo "$HOMEPAGE_HTML" | grep -q "canonical.*${SITE_URL}/"; then
    echo "✅ Canonical URL is absolute and correct"
else
    echo "❌ Canonical URL missing or incorrect"
fi

# Check meta description
if echo "$HOMEPAGE_HTML" | grep -q "name=\"description\""; then
    DESC_LENGTH=$(echo "$HOMEPAGE_HTML" | grep -o 'name="description" content="[^"]*"' | sed 's/.*content="\([^"]*\)".*/\1/' | wc -c)
    if [ "$DESC_LENGTH" -ge 150 ] && [ "$DESC_LENGTH" -le 160 ]; then
        echo "✅ Meta description optimal length: $DESC_LENGTH chars"
    else
        echo "⚠️  Meta description length: $DESC_LENGTH chars (optimal: 150-160)"
    fi
else
    echo "❌ Meta description missing"
fi

# Check robots meta
if echo "$HOMEPAGE_HTML" | grep -q "robots.*index.*follow"; then
    echo "✅ Robots meta allows indexing"
else
    echo "❌ Robots meta blocks indexing or missing"
fi

# Check hreflang
if echo "$HOMEPAGE_HTML" | grep -q "hreflang=\"nl-NL\""; then
    echo "✅ Dutch hreflang implemented"
else
    echo "❌ Dutch hreflang missing"
fi
echo

# 4. Check structured data
echo "📊 4. STRUCTURED DATA VALIDATION"
echo "--------------------------------"
if echo "$HOMEPAGE_HTML" | grep -q "application/ld+json"; then
    SCHEMA_COUNT=$(echo "$HOMEPAGE_HTML" | grep -c "application/ld+json")
    echo "✅ JSON-LD structured data found: $SCHEMA_COUNT schemas"
    
    # Check for critical schemas
    if echo "$HOMEPAGE_HTML" | grep -q '"@type":"WebSite"'; then
        echo "✅ Website schema present"
    else
        echo "❌ Website schema missing"
    fi
    
    if echo "$HOMEPAGE_HTML" | grep -q '"@type":"WebPage"'; then
        echo "✅ WebPage schema present"
    else
        echo "❌ WebPage schema missing"
    fi
    
    if echo "$HOMEPAGE_HTML" | grep -q '"@type":"Organization"'; then
        echo "✅ Organization schema present"
    else
        echo "❌ Organization schema missing"
    fi
else
    echo "❌ No structured data found"
fi
echo

# 5. Check OpenGraph
echo "📱 5. OPENGRAPH VALIDATION"
echo "-------------------------"
if echo "$HOMEPAGE_HTML" | grep -q "property=\"og:title\""; then
    echo "✅ OpenGraph title present"
else
    echo "❌ OpenGraph title missing"
fi

if echo "$HOMEPAGE_HTML" | grep -q "property=\"og:description\""; then
    echo "✅ OpenGraph description present"
else
    echo "❌ OpenGraph description missing"
fi

if echo "$HOMEPAGE_HTML" | grep -q "property=\"og:image\""; then
    echo "✅ OpenGraph image present"
else
    echo "❌ OpenGraph image missing"
fi

if echo "$HOMEPAGE_HTML" | grep -q "property=\"og:url\".*${SITE_URL}"; then
    echo "✅ OpenGraph URL correct"
else
    echo "❌ OpenGraph URL missing or incorrect"
fi
echo

# 6. Performance check
echo "⚡ 6. PERFORMANCE INDICATORS"
echo "---------------------------"
LOAD_TIME=$(curl -o /dev/null -s -w "%{time_total}" "${SITE_URL}/")
echo "🕐 Homepage load time: ${LOAD_TIME}s"

if (( $(echo "$LOAD_TIME < 3.0" | bc -l) )); then
    echo "✅ Load time excellent (< 3s)"
elif (( $(echo "$LOAD_TIME < 5.0" | bc -l) )); then
    echo "⚠️  Load time acceptable (< 5s)"
else
    echo "❌ Load time slow (> 5s)"
fi
echo

# 7. Mobile-friendly check
echo "📱 7. MOBILE OPTIMIZATION"
echo "------------------------"
if echo "$HOMEPAGE_HTML" | grep -q "viewport.*width=device-width"; then
    echo "✅ Mobile viewport configured"
else
    echo "❌ Mobile viewport missing"
fi

if echo "$HOMEPAGE_HTML" | grep -q "responsive\|mobile"; then
    echo "✅ Mobile-responsive indicators found"
else
    echo "⚠️  Mobile-responsive indicators not detected"
fi
echo

echo "📋 SUMMARY & NEXT STEPS"
echo "======================="
echo "✅ Run this validation after each deployment"
echo "✅ Monitor Google Search Console for indexing status"
echo "✅ Submit URL to Google: https://search.google.com/search-console"
echo "✅ Test rich results: https://search.google.com/test/rich-results"
echo "✅ Expected indexing: 1-3 days for priority content"
echo
echo "🏁 Validation completed at $(date)"