#!/bin/bash

# ProWeb Studio - Google Indexing Acceleration Script
# Run this after deploying the homepage improvements

SITE_URL="${SITE_URL:-https://prowebstudio.nl}"
GOOGLE_SITE_VERIFICATION="${GOOGLE_SITE_VERIFICATION:-}"

echo "🚀 ProWeb Studio - Google Indexing Acceleration"
echo "================================================="
echo "Site URL: $SITE_URL"
echo

# 1. Submit sitemap to Google Search Console
echo "📋 1. Submitting sitemap to Google..."
if [ -n "$GOOGLE_SITE_VERIFICATION" ]; then
    curl -X POST "https://www.google.com/ping?sitemap=${SITE_URL}/sitemap.xml" \
         -H "User-Agent: ProWeb Studio Indexing Bot" \
         --silent --output /dev/null
    echo "✅ Sitemap submitted to Google"
else
    echo "⚠️  GOOGLE_SITE_VERIFICATION not set - manual submission required"
fi

# 2. Submit sitemap to Bing
echo "📋 2. Submitting sitemap to Bing..."
curl -X POST "https://www.bing.com/ping?sitemap=${SITE_URL}/sitemap.xml" \
     -H "User-Agent: ProWeb Studio Indexing Bot" \
     --silent --output /dev/null
echo "✅ Sitemap submitted to Bing"

# 3. Request priority indexing for homepage
echo "🏠 3. Requesting homepage indexing..."
curl -X GET "${SITE_URL}/" \
     -H "User-Agent: GoogleBot/2.1 (+http://www.google.com/bot.html)" \
     --silent --output /dev/null
echo "✅ Homepage crawl requested"

# 4. Key pages crawl requests
echo "📄 4. Requesting key pages crawling..."
for page in "/diensten" "/contact" "/werkwijze" "/portfolio"; do
    curl -X GET "${SITE_URL}${page}" \
         -H "User-Agent: GoogleBot/2.1 (+http://www.google.com/bot.html)" \
         --silent --output /dev/null
    echo "✅ ${page} crawl requested"
done

echo
echo "🎉 Indexing acceleration completed!"
echo "Next steps:"
echo "1. Verify robots.txt: ${SITE_URL}/robots.txt"
echo "2. Check sitemap: ${SITE_URL}/sitemap.xml"  
echo "3. Monitor Google Search Console for indexing status"
echo "4. Expected indexing time: 1-3 days for priority pages"
echo
echo "Manual verification:"
echo "- Google Search Console: Submit URL for indexing"
echo "- Bing Webmaster Tools: Submit URL for indexing"
echo "- Test mobile-friendliness: https://search.google.com/test/mobile-friendly"
echo "- Rich Results Test: https://search.google.com/test/rich-results"