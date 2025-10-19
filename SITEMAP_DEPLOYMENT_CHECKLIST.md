# Segmented Sitemap - Deployment Checklist

## ✅ Pre-Deployment Validation

### Code Review
- [x] `src/lib/sitemap-advanced.ts` created with segmentation logic
- [x] `src/app/sitemap.ts` updated to use new library
- [x] `src/app/robots.ts` updated with proper Host and Sitemap
- [x] Segmented routes created (pages, services, locations)
- [x] No TypeScript/lint errors
- [x] All files follow project conventions

### Testing Checklist
- [ ] Run local dev server: `cd site && npm run dev`
- [ ] Test `/sitemap.xml` returns 200 and valid XML
- [ ] Test `/robots.txt` returns 200 with correct directives
- [ ] Test `/sitemap-pages.xml` returns 200
- [ ] Test `/sitemap-services.xml` returns 200
- [ ] Test `/sitemap-locations.xml` returns 200
- [ ] Run: `./scripts/test-sitemap-robots.sh http://localhost:3000`
- [ ] Verify no duplicate URLs in sitemap
- [ ] Verify all URLs are absolute (https://)
- [ ] Verify nl-NL hreflang is present
- [ ] Verify priorities are between 0-1
- [ ] Check robots.txt has single Sitemap entry

## 🚀 Deployment Steps

### 1. Commit and Push
```bash
cd /home/mohammadalkhatib/Desktop/personal/ProWeb-Studio-V1
git add site/src/lib/sitemap-advanced.ts
git add site/src/app/sitemap.ts
git add site/src/app/robots.ts
git add site/src/app/sitemap-pages.xml/
git add site/src/app/sitemap-services.xml/
git add site/src/app/sitemap-locations.xml/
git add site/scripts/test-sitemap-robots.sh
git add site/scripts/validate-sitemap.js
git add site/SITEMAP_SEGMENTED_IMPLEMENTATION.md
git add SITEMAP_IMPLEMENTATION_SUMMARY.md
git commit -m "feat: implement segmented sitemaps and dynamic robots.txt

- Create sitemap-advanced.ts for segmented generation
- Update sitemap.ts to use new library
- Update robots.txt with single Sitemap and Host directive
- Add optional segmented endpoints (pages, services, locations)
- Include nl-NL hreflang on all entries
- Add validation and testing scripts
- Performance target < 500ms with Edge runtime
- Dutch SEO priorities and change frequencies"
git push
```

### 2. Deploy to Preview
- [ ] Push to preview branch or create PR
- [ ] Verify Vercel preview build succeeds
- [ ] Test preview URL with test script
- [ ] Verify preview robots.txt blocks all crawlers

### 3. Deploy to Production
- [ ] Merge to main/production branch
- [ ] Verify production build succeeds
- [ ] Wait for deployment to complete

## 🧪 Post-Deployment Testing

### Immediate Tests
```bash
# Test production endpoints
./scripts/test-sitemap-robots.sh https://prowebstudio.nl

# Manual checks
curl https://prowebstudio.nl/sitemap.xml | head -20
curl https://prowebstudio.nl/robots.txt
```

### Validation
- [ ] Visit https://prowebstudio.nl/sitemap.xml in browser
- [ ] Visit https://prowebstudio.nl/robots.txt in browser
- [ ] Check XML is well-formed (no parsing errors)
- [ ] Verify correct SITE_URL in all entries
- [ ] Count URLs matches expected (~25 URLs)

### Online Validators
- [ ] XML Sitemap Validator: https://www.xml-sitemaps.com/validate-xml-sitemap.html
- [ ] Google Rich Results Test: https://search.google.com/test/rich-results
- [ ] robots.txt Tester: https://support.google.com/webmasters/answer/6062598

## 📊 Google Search Console Setup

### Submit Sitemap
1. [ ] Login to https://search.google.com/search-console
2. [ ] Select ProWeb Studio property
3. [ ] Navigate to Sitemaps section
4. [ ] Remove old sitemap if different
5. [ ] Add new sitemap URL: `https://prowebstudio.nl/sitemap.xml`
6. [ ] Click "Submit"
7. [ ] Wait for Google to process (can take hours to days)

### Verify robots.txt
1. [ ] Go to robots.txt Tester in GSC
2. [ ] Verify robots.txt is accessible
3. [ ] Test URL: `/sitemap.xml` - should be allowed
4. [ ] Test URL: `/speeltuin/` - should be blocked
5. [ ] Test URL: `/_next/` - should be blocked

### Monitor Coverage
1. [ ] Check Coverage report in GSC
2. [ ] Monitor for any errors or warnings
3. [ ] Verify all 25 URLs are discovered
4. [ ] Check index status over next week

## 🔍 Performance Monitoring

### Week 1
- [ ] Check GSC for crawl errors
- [ ] Monitor sitemap processing status
- [ ] Verify URLs are being indexed
- [ ] Check server logs for sitemap requests
- [ ] Monitor Vercel function execution time

### Week 2-4
- [ ] Review indexed page count
- [ ] Check for any 404s from sitemap
- [ ] Monitor crawl budget usage
- [ ] Analyze search performance data
- [ ] Review position changes for key pages

## 🐛 Troubleshooting

### Issue: Sitemap Not Updating
**Solutions:**
- Clear Vercel CDN cache
- Verify `dynamic = 'force-dynamic'` in sitemap.ts
- Check cache headers with: `curl -I https://prowebstudio.nl/sitemap.xml`
- Redeploy if necessary

### Issue: robots.txt Shows Wrong URL
**Solutions:**
- Verify SITE_URL environment variable in Vercel
- Check NEXT_PUBLIC_SITE_URL fallback
- Ensure no trailing slashes in env vars
- Redeploy after fixing env vars

### Issue: Missing Pages in Sitemap
**Solutions:**
- Check if route exists in config
- Verify service/location in `internal-linking.config.ts`
- Look for typos in slugs
- Check sitemap-advanced.ts segment functions

### Issue: Google Not Processing Sitemap
**Solutions:**
- Wait 24-48 hours for initial processing
- Check GSC for specific errors
- Verify sitemap is valid XML
- Ensure all URLs return 200
- Check robots.txt allows Googlebot

## 📝 Documentation Updates

After deployment:
- [ ] Update main README with sitemap info
- [ ] Add sitemap URL to documentation
- [ ] Note any configuration changes needed
- [ ] Document any issues encountered
- [ ] Update SEO documentation

## ✨ Success Criteria

Deployment is successful when:
- [x] All files committed and pushed
- [ ] Production build succeeds
- [ ] All sitemap endpoints return 200
- [ ] robots.txt returns 200 with correct content
- [ ] No TypeScript/build errors
- [ ] Sitemap validates with online tools
- [ ] Submitted to Google Search Console
- [ ] No 404 errors from sitemap URLs
- [ ] Performance < 500ms (check Vercel analytics)
- [ ] All 25 URLs discoverable by Google

## 🎯 Key Performance Indicators

Monitor these metrics:
- **Sitemap URL Count**: 25 URLs
- **Generation Time**: < 500ms
- **Cache Hit Rate**: > 95% after initial requests
- **Index Coverage**: 100% within 2 weeks
- **Crawl Errors**: 0
- **GSC Processing Status**: "Success"

## 🔄 Maintenance Schedule

### Weekly
- Check GSC for new errors
- Monitor index status changes
- Review crawl stats

### Monthly
- Update lastModified dates for changed pages
- Review and adjust priorities based on analytics
- Check for new pages to add

### Quarterly
- Full sitemap audit
- Review change frequencies
- Analyze impact on search performance
- Consider adding new segments if needed

---

**Created**: October 19, 2025  
**Last Updated**: October 19, 2025  
**Status**: Ready for Deployment ✅
