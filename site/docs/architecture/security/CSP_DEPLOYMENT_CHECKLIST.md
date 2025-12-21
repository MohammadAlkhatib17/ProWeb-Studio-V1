# CSP Enforcement Deployment Checklist

**Deployment Date:** _____________  
**Deployed By:** _____________  
**Environment:** Production

---

## Pre-Deployment Checklist

### Code Review
- [ ] Review `site/next.config.mjs` changes
- [ ] Review `site/src/app/api/csp-report/route.ts` changes
- [ ] Verify no syntax errors
- [ ] Confirm all required hosts included
- [ ] Verify no wildcards used

### Local Testing
- [ ] Development server starts: `npm run dev`
- [ ] Homepage loads without errors
- [ ] Services pages load without errors
- [ ] No CSP violations in browser console
- [ ] Plausible script loads
- [ ] Vercel Analytics loads
- [ ] Google Fonts load
- [ ] Run validation script: `./scripts/validate-csp-enforcement.sh`
- [ ] All validation tests pass

### Documentation Review
- [ ] Read `CSP_ENFORCEMENT_IMPLEMENTATION.md`
- [ ] Read `CSP_QUICK_REF.md`
- [ ] Read `CSP_TESTING_CHECKLIST.md`
- [ ] Understand rollback procedure
- [ ] Know monitoring commands

---

## Deployment Steps

### 1. Commit Changes
```bash
git status
git add site/next.config.mjs
git add site/src/app/api/csp-report/route.ts
git add site/scripts/validate-csp-enforcement.sh
git add site/CSP_*.md
git commit -m "feat: enforce CSP on public pages, 7-day monitoring for API endpoint

- Implement enforced CSP for / and /diensten/*
- Maintain report-only CSP for /api/csp-report (7-day monitoring)
- Include required hosts: Plausible, Vercel Analytics, Google Fonts
- No wildcards, no unsafe-eval
- Target: Lighthouse Security 100/100"
```
- [ ] Commit created successfully

### 2. Push to Repository
```bash
git push origin main
```
- [ ] Push successful
- [ ] CI/CD pipeline triggered (if applicable)

### 3. Deploy to Production
```bash
# If using Vercel
vercel --prod

# Or let automatic deployment happen
# Check deployment status at vercel.com
```
- [ ] Deployment initiated
- [ ] Deployment completed successfully
- [ ] Build logs reviewed (no errors)

---

## Post-Deployment Verification

### Immediate Checks (Within 5 Minutes)

#### 1. Header Verification
```bash
# Check homepage
curl -I https://prowebstudio.nl/ | grep "Content-Security-Policy:"

# Check services page
curl -I https://prowebstudio.nl/diensten/webontwikkeling | grep "Content-Security-Policy:"

# Check API endpoint
curl -I https://prowebstudio.nl/api/csp-report | grep "Content-Security-Policy"
```

**Verification:**
- [ ] Homepage has `Content-Security-Policy` (not report-only)
- [ ] Services page has `Content-Security-Policy` (not report-only)
- [ ] API endpoint has `Content-Security-Policy-Report-Only`

#### 2. Browser Testing
Open https://prowebstudio.nl/ in browser:
- [ ] Page loads correctly
- [ ] Open DevTools → Console
- [ ] No CSP violation errors
- [ ] Open DevTools → Network tab
- [ ] Plausible script loaded (Status 200)
- [ ] Vercel Analytics loaded (Status 200)
- [ ] Google Fonts loaded (Status 200)
- [ ] All images display correctly
- [ ] Navigation works
- [ ] Interactive elements work (Three.js, animations)

#### 3. Services Pages Testing
Visit each service page:
- [ ] `/diensten/webontwikkeling` loads without CSP errors
- [ ] `/diensten/webdesign` loads without CSP errors
- [ ] `/diensten/seo` loads without CSP errors
- [ ] `/diensten/hosting` loads without CSP errors

#### 4. Analytics Verification
- [ ] Check Plausible dashboard for new pageviews
- [ ] Check Vercel Analytics dashboard for activity
- [ ] Verify Web Vitals are being reported

---

## Security Audits (Within 30 Minutes)

### 1. Lighthouse Audit
```bash
# From local machine
npm run lighthouse

# Or use Chrome DevTools
# Open DevTools → Lighthouse tab → Run audit
```

**Expected Scores:**
- [ ] Security: 100/100 ✅
- [ ] Best Practices: ≥95/100
- [ ] Performance: ≥90/100
- [ ] Accessibility: ≥95/100
- [ ] SEO: 100/100

**Security Checks:**
- [ ] Uses HTTPS
- [ ] Has Content-Security-Policy (enforced)
- [ ] No unsafe CSP directives flagged
- [ ] Has HSTS header
- [ ] No vulnerable libraries detected

### 2. Mozilla Observatory
Visit: https://observatory.mozilla.org/

- [ ] Scan `https://prowebstudio.nl`
- [ ] Expected grade: A or A+
- [ ] CSP test passes
- [ ] All security headers present
- [ ] No high-risk issues

### 3. Security Headers
Visit: https://securityheaders.com/

- [ ] Scan `https://prowebstudio.nl`
- [ ] Expected grade: A or A+
- [ ] Content-Security-Policy present and correct
- [ ] All other security headers present

### 4. CSP Evaluator
Visit: https://csp-evaluator.withgoogle.com/

- [ ] Copy CSP policy from production headers
- [ ] Paste into evaluator
- [ ] No high/medium severity issues
- [ ] Expected: Green or minor warnings only

---

## Monitoring Setup (Within 1 Hour)

### 1. Vercel Logs Monitoring
```bash
vercel logs --follow | grep "CSP"
```
- [ ] Logs accessible
- [ ] CSP violation logging working
- [ ] No unexpected violations in first hour

### 2. Set Up Monitoring Dashboard
- [ ] Bookmark Vercel logs URL
- [ ] Set up alerts (if available)
- [ ] Document monitoring procedure
- [ ] Share monitoring access with team

### 3. Create Monitoring Schedule
- [ ] Day 1 (Today): Initial monitoring
- [ ] Day 3 (Oct 21): Mid-week check
- [ ] Day 7 (Oct 26): Final review and decision

---

## Team Communication

### 1. Announcement
Send to team:

```
Subject: CSP Enforcement Deployed - Public Pages Now Protected

Team,

Content Security Policy (CSP) enforcement is now active on our public pages:
- Homepage (/)
- All services pages (/diensten/*)

Key Points:
✅ Lighthouse Security score: 100/100 (expected)
✅ All analytics working (Plausible, Vercel)
✅ All resources loading correctly
📊 /api/csp-report monitoring for 7 days

What to watch for:
- Any console errors about blocked resources
- User reports of missing functionality
- CSP violation reports in Vercel logs

Documentation:
- Quick Ref: site/CSP_QUICK_REF.md
- Full Details: site/CSP_ENFORCEMENT_IMPLEMENTATION.md
- Testing: site/CSP_TESTING_CHECKLIST.md

Monitoring:
vercel logs --follow | grep "CSP"

Questions? Check the docs or reach out.

[Your Name]
```

- [ ] Team announcement sent
- [ ] Documentation links shared
- [ ] Monitoring access provided

### 2. Update Status Board
- [ ] Mark CSP enforcement as "Deployed"
- [ ] Update security compliance status
- [ ] Note monitoring end date (Oct 26)

---

## Rollback Plan (If Needed)

### Triggers for Rollback
Rollback if:
- Critical functionality broken
- >100 unique violations per hour
- Essential resources blocked
- Analytics completely broken
- User-reported issues

### Quick Rollback Steps
1. Edit `site/next.config.mjs`:
   ```javascript
   // Change line ~227 and ~236:
   { key: 'Content-Security-Policy-Report-Only', value: enforcedCSP }
   ```

2. Commit and deploy:
   ```bash
   git commit -am "ROLLBACK: CSP to report-only mode - investigation needed"
   git push
   ```

3. Verify rollback:
   ```bash
   curl -I https://prowebstudio.nl/ | grep "Content-Security-Policy"
   ```
   Should show: `Content-Security-Policy-Report-Only`

- [ ] Rollback procedure documented
- [ ] Team knows rollback steps
- [ ] Rollback can be executed in <5 minutes

---

## 24-Hour Follow-Up

### Next Day Checks
- [ ] Review overnight CSP violations (if any)
- [ ] Check analytics data completeness
- [ ] Verify no user-reported issues
- [ ] Confirm Web Vitals still good
- [ ] Review Vercel logs summary

### Issue Resolution
If issues found:
- [ ] Document issue details
- [ ] Assess severity (critical/high/medium/low)
- [ ] Decide: fix forward or rollback
- [ ] Implement solution
- [ ] Verify fix
- [ ] Update documentation

---

## 7-Day Review (Oct 26)

### Data Collection
- [ ] Total CSP violations count: _____
- [ ] Most common violation type: _____
- [ ] Blocked URIs requiring allowlist: _____
- [ ] False positives identified: _____
- [ ] Action items: _____

### Decision: Enforce CSP on /api/csp-report
- [ ] Review 7-day violation data
- [ ] Assess readiness for enforcement
- [ ] Update route configuration if ready
- [ ] Deploy changes
- [ ] Monitor for issues

---

## Success Criteria

### All Met = Successful Deployment
- [x] No critical functionality broken
- [x] Security headers present on all pages
- [x] Lighthouse Security: 100/100
- [x] Analytics tracking working
- [x] All resources loading correctly
- [x] No user-reported issues
- [x] CSP violation monitoring active

---

## Sign-Off

### Deployment Completed
- Deployed by: _____________
- Date: _____________
- Time: _____________
- Environment: Production
- Status: [ ] Success [ ] Issues Found [ ] Rolled Back

### Post-Deployment Verification
- Verified by: _____________
- Date: _____________
- Status: [ ] All Checks Passed [ ] Issues Found
- Notes: _____________

### 24-Hour Review
- Reviewed by: _____________
- Date: _____________
- Status: [ ] Stable [ ] Issues [ ] Action Required
- Notes: _____________

---

**Document Version:** 1.0  
**Created:** October 19, 2025  
**Deployment Target:** Production  
**Expected Duration:** 30 minutes (deployment + verification)
