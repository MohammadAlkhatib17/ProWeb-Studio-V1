# Security Headers Quick Reference

## Current Status

**CSP Mode:** Report-Only (Monitoring Phase)  
**Start Date:** October 19, 2025  
**Switch Date:** October 26, 2025 (Automatic)  
**Impact:** No user-facing breakage expected

---

## Quick Commands

### Check Headers (Local)
```bash
curl -I http://localhost:3000/ | grep -i "security\|csp\|frame\|transport"
```

### Check Headers (Production)
```bash
curl -I https://prowebstudio.nl/ | grep -i "content-security-policy"
```

### Monitor CSP Violations
```bash
# Real-time monitoring
vercel logs --follow | grep "CSP Violation"

# Last 24 hours
vercel logs --since 24h | grep "CSP Violation"
```

### Run Local Tests
```bash
cd site
npm run build
npm start
# Then visit http://localhost:3000/ and check console
```

---

## CSP Policy Summary

```
default-src 'self';
script-src 'self' 'nonce-{random}' 'strict-dynamic' https://plausible.io;
style-src 'self' 'nonce-{random}' 'unsafe-inline' https://fonts.googleapis.com;
img-src 'self' data: https: blob:;
font-src 'self' https://fonts.gstatic.com data:;
connect-src 'self' https://plausible.io https://vitals.vercel-insights.com;
object-src 'none';
frame-ancestors 'none';
upgrade-insecure-requests;
```

---

## Whitelisted Domains

| Domain | Purpose | Directives |
|--------|---------|------------|
| `plausible.io` | Analytics | script-src, connect-src |
| `vitals.vercel-insights.com` | Core Web Vitals | connect-src |
| `fonts.googleapis.com` | Google Fonts CSS | style-src |
| `fonts.gstatic.com` | Google Fonts files | font-src |

---

## Emergency Rollback

**If critical issue detected:**

1. Edit `site/src/middleware.ts` (line ~255):
   ```typescript
   // Comment out CSP header
   // response.headers.set('Content-Security-Policy-Report-Only', cspValue);
   ```

2. Deploy:
   ```bash
   git add site/src/middleware.ts
   git commit -m "EMERGENCY: Disable CSP"
   git push
   ```

---

## Extend Monitoring Period

**To extend by 7 more days:**

1. Edit `site/src/middleware.ts` (line ~220):
   ```typescript
   const cspMonitoringEnd = new Date('2025-11-02T00:00:00Z');
   ```

2. Deploy:
   ```bash
   git add site/src/middleware.ts
   git commit -m "chore: extend CSP monitoring period to Nov 2"
   git push
   ```

---

## Force Enforcement Early

1. Edit `site/src/middleware.ts` (line ~228):
   ```typescript
   const isMonitoringPhase = false; // Force enforcement
   ```

2. Deploy as above

---

## Common Issues & Solutions

### Issue: Analytics not loading

**Check:**
1. Cookie consent accepted?
2. Console shows CSP violation?
3. Nonce present in script tag?

**Solution:**
- Verify `plausible.io` in CSP whitelist
- Check nonce matches CSP header

### Issue: Fonts not rendering

**Check:**
1. Console shows CSP violation for fonts?
2. Network tab shows blocked requests?

**Solution:**
- Verify `fonts.googleapis.com` and `fonts.gstatic.com` in CSP
- Check if nonce applied to `<link>` tags (not required)

### Issue: Inline styles blocked

**Check:**
1. Styles have nonce attribute?
2. `unsafe-inline` in `style-src`?

**Solution:**
- Add nonce to `<style>` tags
- Fallback: `unsafe-inline` already included

---

## Testing Checklist (Quick)

- [ ] Homepage loads without console errors
- [ ] Analytics tracking works (after consent)
- [ ] Fonts render correctly
- [ ] All service pages load (`/diensten/*`)
- [ ] Contact form submits successfully
- [ ] No user-visible breakage

---

## Monitoring Schedule

| Date | Action |
|------|--------|
| Oct 19 | Deployment + initial validation |
| Oct 21 | Mid-week review (check logs) |
| Oct 24 | Pre-enforcement review |
| Oct 26 | **Automatic enforcement switch** |
| Oct 27 | Post-enforcement validation |

---

## Key Metrics to Track

1. **CSP Violations:** Should be zero or minimal
2. **Lighthouse Score:** Best Practices ≥ 95
3. **User Reports:** No functionality breakage
4. **Analytics:** Tracking continues working

---

## Security Scores Expected

- **Mozilla Observatory:** A or A+
- **securityheaders.com:** A or A+
- **CSP Evaluator:** No critical issues
- **Lighthouse Best Practices:** 95-100

---

## Contact & Support

**Documentation:**
- Full details: `SECURITY_HEADERS_IMPLEMENTATION.md`
- CSP Nonce: `CSP_NONCE_IMPLEMENTATION_COMPLETE.md`

**Logs:**
- CSP Reports: `/api/csp-report` endpoint
- Vercel Logs: `vercel logs --follow`

**Testing:**
- Local: `http://localhost:3000/`
- Production: `https://prowebstudio.nl/`

---

**Last Updated:** October 19, 2025  
**Next Review:** October 26, 2025
