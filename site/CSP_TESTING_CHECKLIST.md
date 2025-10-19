# CSP Enforcement Testing Checklist

**Date:** October 19, 2025  
**Tester:** _______________  
**Environment:** [ ] Development [ ] Staging [ ] Production

## Pre-Deployment Tests

### 1. Configuration Validation

- [ ] `site/next.config.mjs` syntax is valid
- [ ] `site/src/app/api/csp-report/route.ts` syntax is valid
- [ ] Build completes without errors: `npm run build`
- [ ] TypeScript checks pass: `npm run type-check`
- [ ] Linting passes: `npm run lint`

### 2. Local Development Testing

Start the development server:
```bash
cd site
npm run dev
```

#### Homepage Testing (/)

- [ ] Page loads without errors
- [ ] No CSP violations in browser console
- [ ] Plausible Analytics script loads (Network tab)
- [ ] Vercel Analytics script loads (Network tab)
- [ ] Google Fonts load correctly
- [ ] Images display correctly
- [ ] Styles render correctly (no blocked inline styles)
- [ ] Interactive elements work (Three.js, animations)

**CSP Header Check:**
```bash
curl -I http://localhost:3000/ | grep -i "content-security-policy"
```
Expected: `Content-Security-Policy:` (not `Content-Security-Policy-Report-Only`)

#### Services Page Testing (/diensten/webontwikkeling)

- [ ] Page loads without errors
- [ ] No CSP violations in browser console
- [ ] All resources load correctly
- [ ] Navigation works
- [ ] Links function properly
- [ ] Forms (if any) work correctly

**CSP Header Check:**
```bash
curl -I http://localhost:3000/diensten/webontwikkeling | grep -i "content-security-policy"
```
Expected: `Content-Security-Policy:` (not `Content-Security-Policy-Report-Only`)

#### Other Services Pages

- [ ] `/diensten/webdesign` - loads without CSP violations
- [ ] `/diensten/seo` - loads without CSP violations
- [ ] `/diensten/hosting` - loads without CSP violations

#### API Endpoint Testing (/api/csp-report)

- [ ] Endpoint returns 204 on valid POST
- [ ] Endpoint returns 400 on invalid JSON
- [ ] Endpoint has report-only CSP (monitoring mode)

**CSP Header Check:**
```bash
curl -I http://localhost:3000/api/csp-report | grep -i "content-security-policy"
```
Expected: `Content-Security-Policy-Report-Only:` (with `report-uri`)

**Test POST:**
```bash
curl -X POST http://localhost:3000/api/csp-report \
  -H "Content-Type: application/json" \
  -d '{
    "blocked-uri": "https://evil.com/script.js",
    "document-uri": "http://localhost:3000/",
    "violated-directive": "script-src",
    "original-policy": "default-src '\''self'\''"
  }'
```
Expected: 204 No Content + log entry in terminal

### 3. Automated Validation

Run the CSP validation script:
```bash
./scripts/validate-csp-enforcement.sh
```

Results:
- [ ] ✅ Homepage CSP enforcement check passed
- [ ] ✅ Services page CSP enforcement check passed
- [ ] ✅ API endpoint report-only CSP check passed
- [ ] ✅ All required directives present
- [ ] ✅ All required hosts allowed

### 4. Browser Console Testing

#### Chrome DevTools
1. Open homepage: `http://localhost:3000/`
2. Open DevTools (F12) → Console tab
3. Check for errors:
   - [ ] No "Refused to load..." errors
   - [ ] No "Refused to execute..." errors
   - [ ] No CSP violation errors

4. Check Network tab:
   - [ ] `plausible.io` script: Status 200
   - [ ] `va.vercel-scripts.com` script: Status 200
   - [ ] `fonts.googleapis.com` CSS: Status 200
   - [ ] `fonts.gstatic.com` fonts: Status 200

5. Check Security tab:
   - [ ] Connection is secure (in production)
   - [ ] No mixed content warnings
   - [ ] Valid certificates (in production)

#### Firefox DevTools
Repeat above tests in Firefox:
- [ ] No CSP violations
- [ ] All resources load
- [ ] Security indicators are green (in production)

#### Safari DevTools (if available)
Repeat above tests in Safari:
- [ ] No CSP violations
- [ ] All resources load
- [ ] Security indicators are green (in production)

### 5. Lighthouse Audit

Run Lighthouse audit:
```bash
npm run lighthouse
```

Expected scores:
- [ ] Security: 100/100 ✅
- [ ] Best Practices: ≥95/100
- [ ] Performance: ≥90/100
- [ ] Accessibility: ≥95/100
- [ ] SEO: 100/100

Security checks in Lighthouse:
- [ ] Uses HTTPS
- [ ] HTTP redirects to HTTPS
- [ ] Has Content-Security-Policy
- [ ] No unsafe CSP directives flagged
- [ ] Has HSTS header
- [ ] No vulnerable libraries

### 6. Security Headers Check

Use online tools or curl to verify all security headers:

```bash
curl -I http://localhost:3000/ | grep -E "(Content-Security-Policy|Strict-Transport-Security|X-Frame-Options|X-Content-Type-Options|Referrer-Policy)"
```

Expected headers:
- [ ] `Content-Security-Policy` (enforced, not report-only)
- [ ] `Strict-Transport-Security`
- [ ] `X-Frame-Options: SAMEORIGIN`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy`
- [ ] `Cross-Origin-Opener-Policy: same-origin`
- [ ] `Cross-Origin-Resource-Policy: same-origin`

## Post-Deployment Tests (Production)

After deploying to production, repeat all tests with production URLs.

### Production Smoke Tests

**Homepage:**
```bash
curl -I https://prowebstudio.nl/ | grep -i "content-security-policy"
```
- [ ] Returns `Content-Security-Policy:` (enforced)
- [ ] Contains all required directives
- [ ] Page loads correctly in browser
- [ ] No console errors

**Services Page:**
```bash
curl -I https://prowebstudio.nl/diensten/webontwikkeling | grep -i "content-security-policy"
```
- [ ] Returns `Content-Security-Policy:` (enforced)
- [ ] Page loads correctly
- [ ] No console errors

**API Endpoint:**
```bash
curl -I https://prowebstudio.nl/api/csp-report | grep -i "content-security-policy"
```
- [ ] Returns `Content-Security-Policy-Report-Only:`
- [ ] Contains `report-uri` directive

### Production Analytics Check

Visit homepage and verify analytics work:
- [ ] Plausible dashboard shows new pageview
- [ ] Vercel Analytics dashboard shows activity
- [ ] No errors in browser console
- [ ] Web Vitals are being reported

### Production Security Scan

Use online tools to verify security:

**Mozilla Observatory:**
https://observatory.mozilla.org/
- [ ] Run scan on `https://prowebstudio.nl`
- [ ] Expected grade: A or A+
- [ ] CSP test passes

**Security Headers:**
https://securityheaders.com/
- [ ] Run scan on `https://prowebstudio.nl`
- [ ] Expected grade: A or A+
- [ ] All headers present and correct

**CSP Evaluator:**
https://csp-evaluator.withgoogle.com/
- [ ] Paste CSP policy from production
- [ ] No high/medium severity issues
- [ ] Expected: Green or minor warnings only

## Monitoring Setup

### 7-Day Monitoring Window (Oct 19-26, 2025)

#### Day 1 (Oct 19)
- [ ] Check Vercel logs for CSP violations
- [ ] Document any violations found
- [ ] Verify no critical issues

#### Day 3 (Oct 21)
- [ ] Mid-week check of CSP violations
- [ ] Count total violations so far
- [ ] Identify patterns (if any)

#### Day 7 (Oct 26)
- [ ] Final monitoring day
- [ ] Complete violation report
- [ ] Prepare enforcement plan for `/api/csp-report`

**Check logs:**
```bash
vercel logs --follow | grep "CSP Violation"
```

## Rollback Criteria

Initiate rollback if any of these occur:

- [ ] Critical functionality broken (forms, navigation, etc.)
- [ ] Analytics completely blocked
- [ ] >100 unique CSP violations per hour
- [ ] Essential resources blocked (fonts, styles, scripts)
- [ ] User-reported issues related to page loading

## Sign-Off

### Development Testing
- Tested by: _______________
- Date: _______________
- Status: [ ] Pass [ ] Fail
- Notes: _______________

### Staging Testing (if applicable)
- Tested by: _______________
- Date: _______________
- Status: [ ] Pass [ ] Fail
- Notes: _______________

### Production Testing
- Tested by: _______________
- Date: _______________
- Status: [ ] Pass [ ] Fail
- Notes: _______________

### Security Review
- Reviewed by: _______________
- Date: _______________
- Status: [ ] Approved [ ] Rejected
- Notes: _______________

---

## Additional Notes

_Use this space to document any issues, observations, or recommendations:_

---

**Document Version:** 1.0  
**Last Updated:** October 19, 2025  
**Next Review:** October 26, 2025
