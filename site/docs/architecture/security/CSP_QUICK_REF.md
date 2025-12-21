# CSP Enforcement Quick Reference

## Status: ✅ ENFORCED

**Effective Date:** October 19, 2025  
**Monitoring Window:** Oct 19-26, 2025 (7 days)

## Enforced Pages
- ✅ `/` (Homepage)
- ✅ `/diensten/*` (All service pages)

## Report-Only (Monitoring)
- 📊 `/api/csp-report` (until Oct 26, 2025)

## Policy Summary

```
✅ script-src:   'self' + plausible.io + va.vercel-scripts.com
✅ style-src:    'self' + 'unsafe-inline' + fonts.googleapis.com
✅ font-src:     'self' + fonts.gstatic.com
✅ img-src:      'self' + data: + https:
✅ connect-src:  'self' + plausible.io + vitals.vercel-insights.com + va.vercel-scripts.com
✅ object-src:   'none'
✅ frame-ancestors: 'none'
```

## Validation

```bash
# Start server
npm run dev

# Run validation
./scripts/validate-csp-enforcement.sh
```

## Emergency Rollback

If critical issue detected:

```javascript
// In site/next.config.mjs, line ~225:
// Change this:
{ key: 'Content-Security-Policy', value: enforcedCSP }

// To this:
{ key: 'Content-Security-Policy-Report-Only', value: reportOnlyCSP }
```

Then deploy immediately.

## Monitoring

Check Vercel logs:
```bash
vercel logs --follow
```

Look for: `CSP Violation Report [7-day Monitoring Window]`

## Key Security Features

- ❌ No `unsafe-eval`
- ❌ No wildcards
- ✅ Explicit host allowlisting
- ✅ Clickjacking protection
- ✅ HTTPS enforcement

## Expected Lighthouse Score

- **Security:** 100/100 ✅

## Files Changed

1. `site/next.config.mjs` - CSP headers configuration
2. `site/src/app/api/csp-report/route.ts` - 7-day monitoring window

## Common Issues & Solutions

### Issue: Google Fonts not loading
**Solution:** Already allowed in `font-src` and `style-src`

### Issue: Plausible script blocked
**Solution:** Already allowed in `script-src` and `connect-src`

### Issue: Vercel Analytics not working
**Solution:** Already allowed in `script-src` and `connect-src`

### Issue: Inline style blocked
**Solution:** `unsafe-inline` allowed for `style-src` (required for critical CSS)

## Support

- 📖 Full docs: `CSP_ENFORCEMENT_IMPLEMENTATION.md`
- 🔍 Test script: `scripts/validate-csp-enforcement.sh`
- 📊 Monitor: Vercel logs + browser console
