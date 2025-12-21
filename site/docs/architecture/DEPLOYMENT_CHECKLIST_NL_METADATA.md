# Dutch Metadata Enforcement - Deployment Checklist

## Pre-Deployment Verification

Use this checklist before deploying to ensure the Dutch metadata enforcement is properly configured.

---

## 1. Environment Variables ✅

### Production (Required)
```bash
# Check that SITE_URL is set
echo $SITE_URL
# OR
echo $NEXT_PUBLIC_SITE_URL

# Expected output: https://prowebstudio.nl
```

**Action**: Set in Vercel/deployment platform:
- Go to Project Settings → Environment Variables
- Add `SITE_URL` or `NEXT_PUBLIC_SITE_URL`
- Value: `https://prowebstudio.nl` (no trailing slash)
- Environment: Production, Preview

---

## 2. Validation Tests ✅

### Run Metadata Validation
```bash
npm run validate:metadata
```

**Expected Output**:
```
✓ All metadata validations passed!
# OR
Validation completed with warnings only.
```

**NOT Expected** (indicates errors):
```
✗ X Error(s):
Build should fail due to metadata validation errors.
```

---

## 3. Build Test ✅

### Test Local Build
```bash
# With SITE_URL
SITE_URL=https://prowebstudio.nl npm run build

# Should complete successfully
```

**Expected**: Build completes without errors

**If Build Fails**: Check error messages - they will indicate which pages are missing metadata

---

## 4. HTML Output Verification ✅

After build, check that generated HTML has correct metadata:

```bash
# Build the site
npm run build

# Start production server
npm run start

# In another terminal, check homepage
curl -s http://localhost:3000 | grep -E 'lang=|canonical|hreflang|og:locale'
```

**Expected Output Should Include**:
```html
<html lang="nl">
<link rel="canonical" href="https://prowebstudio.nl/" />
<link rel="alternate" hreflang="nl-NL" href="https://prowebstudio.nl/" />
<link rel="alternate" hreflang="nl" href="https://prowebstudio.nl/" />
<link rel="alternate" hreflang="x-default" href="https://prowebstudio.nl/" />
<meta property="og:locale" content="nl_NL" />
```

---

## 5. Runtime Checks ✅

### Test in Browser

1. **Open any page**: https://prowebstudio.nl
2. **View Source** (Ctrl+U / Cmd+U)
3. **Search for** (Ctrl+F / Cmd+F):
   - `lang="nl"` ✓
   - `rel="canonical"` ✓
   - `hreflang="nl-NL"` ✓
   - `hreflang="nl"` ✓
   - `hreflang="x-default"` ✓
   - `og:locale` ✓
   - `og:url` ✓

---

## 6. SEO Tools Verification ✅

### Google Search Console
1. Submit sitemap
2. Wait for crawl
3. Check URL Inspection:
   - Canonical URL is correct
   - Hreflang tags detected

### Schema.org Validator
1. Visit: https://validator.schema.org/
2. Enter: https://prowebstudio.nl
3. Check: No errors in structured data
4. Verify: `inLanguage: "nl-NL"` in schemas

---

## 7. Page-by-Page Checklist ✅

Test these critical pages:

- [ ] Homepage (`/`)
- [ ] Diensten (`/diensten`)
- [ ] Contact (`/contact`)
- [ ] Werkwijze (`/werkwijze`)
- [ ] Over Ons (`/over-ons`)
- [ ] Privacy (`/privacy`)
- [ ] Voorwaarden (`/voorwaarden`)

For each page, verify:
- ✓ Has canonical URL
- ✓ Has hreflang tags (nl-NL, nl, x-default)
- ✓ og:locale is nl_NL
- ✓ lang="nl" in HTML tag

---

## 8. CI/CD Integration ✅

### GitHub Actions / Vercel

Ensure build includes validation:

```yaml
# In .github/workflows/deploy.yml or similar
- name: Validate Metadata
  run: npm run validate:metadata
  env:
    SITE_URL: https://prowebstudio.nl

- name: Build
  run: npm run build
  env:
    SITE_URL: https://prowebstudio.nl
```

**Vercel**: Add to `vercel.json` build command:
```json
{
  "buildCommand": "npm run validate:metadata && npm run build"
}
```

---

## 9. Performance Check ✅

After deployment, verify performance is maintained:

```bash
# Lighthouse audit
npm run lighthouse

# Check bundle size
npm run analyze
```

**Expected**:
- Mobile LCP: ≤ 2.5s ✓
- No layout shifts from metadata ✓
- Bundle size increase: < 1KB ✓

---

## 10. Documentation Review ✅

Ensure team has access to:

- [ ] `NL_METADATA_ENFORCEMENT.md` - Full implementation guide
- [ ] `NL_METADATA_QUICK_REF.md` - Quick reference
- [ ] `NL_METADATA_ENFORCEMENT_SUMMARY.md` - Executive summary
- [ ] This checklist

---

## Troubleshooting

### Build Fails: "SITE_URL must be set"

**Solution**:
```bash
export SITE_URL=https://prowebstudio.nl
npm run build
```

### Build Fails: "Missing canonical URL"

**Solution**: Update page to use metadata generator:
```typescript
import { generateMetadata } from '@/lib/metadata';
export const metadata = generateMetadata({ path: '/your-page' });
```

### Validation Fails: Incorrect hreflang

**Solution**: Ensure using metadata generators (they add hreflang automatically)

### Production: Canonical URLs show localhost

**Solution**: SITE_URL not set in production environment. Add to Vercel/deployment config.

---

## Rollback Procedure

If critical issues arise:

1. **Revert build script** (remove validation):
   ```json
   "build": "BUILD_TIME=$(node -e \"process.stdout.write(new Date().toISOString())\") next build"
   ```

2. **Keep metadata generators** (they're safe and improve SEO)

3. **Redeploy** with reverted config

4. **Debug** offline, then re-enable validation

---

## Sign-off

**Deployment Approved**: ☐ Yes ☐ No

**Validated By**: _________________

**Date**: _________________

**Notes**:
```
_________________________________________________
_________________________________________________
_________________________________________________
```

---

## Post-Deployment Monitoring

### Week 1
- [ ] Check Google Search Console for errors
- [ ] Verify canonical URLs in search results
- [ ] Monitor Core Web Vitals (should be unchanged)
- [ ] Check schema.org validation

### Week 2-4
- [ ] Review organic traffic (should maintain/improve)
- [ ] Check for duplicate content warnings
- [ ] Verify hreflang implementation in GSC
- [ ] Monitor Dutch market search rankings

---

## Success Criteria

✅ **All pages have**:
- Correct `lang="nl"` attribute
- Absolute canonical URLs
- Complete hreflang tags (nl-NL, nl, x-default)
- Correct OpenGraph locale (nl_NL)

✅ **Build process**:
- Automatically validates metadata
- Fails on missing/incorrect metadata
- No manual intervention needed

✅ **Performance**:
- Mobile LCP ≤ 2.5s maintained
- Zero layout shifts
- Bundle size increase < 1KB

✅ **SEO**:
- No duplicate content issues
- Proper international targeting
- Rich snippets working
- Search Console shows no errors

---

## Contact

For issues with this implementation:
- Review documentation in `/site/NL_METADATA_*.md`
- Check validation output: `npm run validate:metadata`
- Test locally: `SITE_URL=https://prowebstudio.nl npm run build`

**Status**: ✅ Ready for Production Deployment
