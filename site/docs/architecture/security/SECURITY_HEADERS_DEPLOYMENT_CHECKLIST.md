# Security Headers Deployment Checklist

## Pre-Deployment

### Code Review
- [ ] Review `site/next.config.mjs` changes
- [ ] Review `site/src/middleware.ts` changes
- [ ] Verify CSP directives are correct
- [ ] Check whitelisted domains are minimal
- [ ] Confirm monitoring dates (Oct 19-26, 2025)
- [ ] Verify automatic enforcement switch logic

### Local Testing
- [ ] Build project: `cd site && npm run build`
- [ ] Start local server: `npm start`
- [ ] Run validation script: `./validate-security-headers.sh`
- [ ] Check all tests pass
- [ ] Open browser DevTools and verify:
  - [ ] No console errors on homepage
  - [ ] CSP header shows "Report-Only"
  - [ ] Nonce present in script tags
  - [ ] Analytics loads after cookie consent
  - [ ] Google Fonts render correctly

### Browser Testing
- [ ] **Chrome:** Test homepage, services, contact
- [ ] **Firefox:** Test homepage, services, contact
- [ ] **Safari:** Test homepage, services, contact
- [ ] **Edge:** Test homepage, services, contact
- [ ] **Mobile Safari:** Test core functionality
- [ ] **Mobile Chrome:** Test core functionality

### Routes to Test
- [ ] `/` - Homepage
- [ ] `/diensten/webontwikkeling` - Services page
- [ ] `/diensten/seo-optimalisatie` - SEO page
- [ ] `/diensten/webshop-ontwikkeling` - Webshop page
- [ ] `/contact` - Contact form
- [ ] `/privacy` - Privacy policy
- [ ] `/cookiebeleid` - Cookie policy

### Functionality Verification
- [ ] Cookie consent banner appears
- [ ] Analytics loads after consent
- [ ] Contact form submits successfully
- [ ] Images load properly
- [ ] Fonts render correctly
- [ ] 3D canvas renders (if applicable)
- [ ] Mobile menu works
- [ ] FAQ accordions expand/collapse

---

## Deployment

### Git Operations
```bash
cd /home/mohammadalkhatib/Desktop/personal/ProWeb-Studio-V1/site

# Stage changes
git add next.config.mjs
git add src/middleware.ts
git add SECURITY_HEADERS_IMPLEMENTATION.md
git add SECURITY_HEADERS_QUICK_REF.md
git add validate-security-headers.sh
git add SECURITY_HEADERS_DEPLOYMENT_CHECKLIST.md

# Commit with descriptive message
git commit -m "feat: implement strict security headers with CSP report-only mode

- Add CSP with nonce + strict-dynamic (7-day monitoring phase)
- Set HSTS with preload (2-year max-age)
- Change X-Frame-Options to DENY (max security)
- Set Referrer-Policy to strict-origin-when-cross-origin
- Whitelist minimal domains: Plausible, Vercel Insights, Google Fonts
- Add automatic enforcement switch after Oct 26, 2025
- Preserve analytics and OG image generation
- Maintain cookie consent gating

Monitoring: Oct 19-26, 2025 (report-only)
Enforcement: Automatic after Oct 26
Rollback: See SECURITY_HEADERS_IMPLEMENTATION.md"

# Push to repository
git push origin main
```

### Deployment Platform (Vercel/Netlify)
- [ ] Push triggers automatic deployment
- [ ] Wait for build to complete
- [ ] Check deployment logs for errors
- [ ] Verify deployment succeeded

---

## Post-Deployment Validation

### Immediate Checks (Within 5 minutes)

#### 1. Production Headers
```bash
curl -I https://prowebstudio.nl/ | grep -i "content-security-policy"
# Expected: Content-Security-Policy-Report-Only: default-src 'self'; ...

curl -I https://prowebstudio.nl/ | grep -i "strict-transport-security"
# Expected: Strict-Transport-Security: max-age=63072000; includeSubDomains; preload

curl -I https://prowebstudio.nl/ | grep -i "x-frame-options"
# Expected: X-Frame-Options: DENY
```

#### 2. Run Remote Validation
```bash
./validate-security-headers.sh https://prowebstudio.nl/
# Review report: security-headers-validation-*.txt
```

#### 3. Browser DevTools Check
- [ ] Open https://prowebstudio.nl/ in Chrome
- [ ] Open DevTools → Console
- [ ] Verify no CSP errors
- [ ] Check Network tab: All resources load
- [ ] Verify nonce in Elements tab

#### 4. Verify Key Functionality
- [ ] Homepage loads completely
- [ ] Accept cookies → Analytics script loads
- [ ] Submit contact form → Form works
- [ ] Navigate to services pages → All load

### Lighthouse Audit (Within 30 minutes)
```bash
npx lighthouse https://prowebstudio.nl/ --only-categories=best-practices --view
```

- [ ] Best Practices score ≥ 95
- [ ] No security warnings
- [ ] Save report for baseline

### Security Headers Scan (Within 1 hour)
Visit: https://securityheaders.com/

- [ ] Scan: prowebstudio.nl
- [ ] Expected grade: A or A+
- [ ] Review recommendations
- [ ] Screenshot results

### CSP Evaluator (Within 1 hour)
Visit: https://csp-evaluator.withgoogle.com/

- [ ] Paste CSP from production
- [ ] Expected: No critical issues
- [ ] Review warnings (if any)
- [ ] Screenshot results

### Mozilla Observatory (Within 1 hour)
Visit: https://observatory.mozilla.org/

- [ ] Scan: prowebstudio.nl
- [ ] Expected grade: A or A+
- [ ] Review all sections
- [ ] Screenshot results

---

## Day 1 Monitoring (First 24 hours)

### Hour 1: Intensive Monitoring
```bash
# Monitor CSP reports in real-time
vercel logs --follow | grep "CSP Violation"
```

- [ ] Check for violations every 15 minutes
- [ ] Document any violations found
- [ ] Categorize violations (critical/minor)

### Hour 6: Mid-check
- [ ] Review accumulated CSP reports
- [ ] Check error tracking (Sentry/etc.)
- [ ] Verify no user-reported issues
- [ ] Test site from different locations/browsers

### Hour 12: Evening Check
- [ ] Review CSP violation log
- [ ] Analyze violation patterns
- [ ] Check analytics data (is it tracking?)
- [ ] Verify no support tickets

### Hour 24: Day 1 Summary
- [ ] Generate violation report
- [ ] Calculate violation rate
- [ ] Identify any blocked resources
- [ ] Document findings

---

## Week 1 Monitoring (Day 1-7)

### Daily Checks (Every Day)
```bash
# Check for violations in last 24h
vercel logs --since 24h | grep "CSP Violation" | wc -l
```

- [ ] **Day 1:** Intensive monitoring (see above)
- [ ] **Day 2:** Review violations, check patterns
- [ ] **Day 3:** Mid-week analysis, adjust if needed
- [ ] **Day 4:** Continue monitoring
- [ ] **Day 5:** Pre-enforcement readiness check
- [ ] **Day 6:** Final review before auto-switch
- [ ] **Day 7:** Monitor auto-switch (Oct 26)

### Metrics to Track
- [ ] Total CSP violation count
- [ ] Unique violated directives
- [ ] Blocked resource URLs
- [ ] User agent distribution
- [ ] Geographic distribution (NL vs international)
- [ ] Time-of-day patterns

### Key Questions to Answer
1. Are there any critical violations?
2. Are any legitimate resources being blocked?
3. Do we need to whitelist additional domains?
4. Is analytics tracking working correctly?
5. Are there any user-reported issues?

---

## Day 7: Enforcement Switch (Oct 26, 2025)

### Pre-Switch (Morning of Oct 26)
- [ ] Review all Week 1 monitoring data
- [ ] Confirm zero critical violations
- [ ] Verify analytics still working
- [ ] Check no user complaints
- [ ] Create backup plan (rollback procedure)

### Automatic Switch (Midnight UTC, Oct 26)
The middleware will automatically switch from:
```typescript
Content-Security-Policy-Report-Only → Content-Security-Policy
```

### Post-Switch Validation (Within 1 hour)
```bash
# Verify enforcement is active
curl -I https://prowebstudio.nl/ | grep "Content-Security-Policy:"
# Should return enforced CSP (NOT Report-Only)
```

- [ ] Verify header changed to enforced CSP
- [ ] Test homepage functionality
- [ ] Check console for actual blocks (not just warnings)
- [ ] Verify analytics still loads
- [ ] Test contact form submission

### Day 7 Intensive Monitoring
- [ ] Monitor logs every 15 minutes
- [ ] Check for user-reported issues
- [ ] Test all major flows
- [ ] Verify no broken functionality
- [ ] Check analytics tracking

---

## Week 2: Post-Enforcement (Oct 26 - Nov 2)

### Daily Checks
- [ ] **Day 8 (Oct 27):** Intensive post-enforcement monitoring
- [ ] **Day 9-10:** Continue monitoring, reduce frequency
- [ ] **Day 11-14:** Standard monitoring

### Success Criteria
- [ ] No critical violations logged
- [ ] Analytics tracking continues working
- [ ] No user-reported issues
- [ ] Lighthouse score maintained or improved
- [ ] All security scans show A/A+ rating

---

## Rollback Procedures

### Scenario 1: Critical Violation During Monitoring
If legitimate resources are being blocked:

1. Identify blocked resource from CSP report
2. Add domain to whitelist in `site/src/middleware.ts`
3. Deploy update
4. Verify fix in production

### Scenario 2: Enforcement Breaks Functionality
If enforcement causes user-facing breakage:

**Option A: Extend Monitoring Period**
```typescript
// In site/src/middleware.ts (line ~220)
const cspMonitoringEnd = new Date('2025-11-02T00:00:00Z'); // +7 days
```

**Option B: Complete Rollback (Emergency)**
```typescript
// In site/src/middleware.ts (line ~255)
// Comment out CSP headers entirely
// response.headers.set('Content-Security-Policy', cspValue);
```

Deploy immediately:
```bash
git add site/src/middleware.ts
git commit -m "EMERGENCY: Rollback CSP due to critical issue"
git push
```

### Scenario 3: Partial Rollback
If specific directive causes issues:

```typescript
// Example: Relax script-src to include unsafe-inline temporarily
script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' https://plausible.io
```

---

## Success Metrics

### Security Posture
- [ ] Mozilla Observatory: A or A+
- [ ] securityheaders.com: A or A+
- [ ] CSP Evaluator: No critical issues
- [ ] Lighthouse Best Practices: ≥ 95

### Functionality Preservation
- [ ] Analytics tracking: 100% operational
- [ ] Contact form: 100% submission rate maintained
- [ ] Page load times: No degradation
- [ ] Core Web Vitals: No negative impact

### User Experience
- [ ] Zero user-reported issues
- [ ] No blocked resources in console
- [ ] All third-party integrations working
- [ ] Cookie consent flow preserved

---

## Documentation Updates

### After Successful Deployment
- [ ] Update README.md with security headers info
- [ ] Add security badge to documentation
- [ ] Update team wiki/knowledge base
- [ ] Document monitoring process for future

### After Week 1 Monitoring
- [ ] Create monitoring report summary
- [ ] Document any violations found
- [ ] Update whitelist rationale
- [ ] Archive CSP reports for audit trail

### After Enforcement Switch
- [ ] Update status in SECURITY_HEADERS_QUICK_REF.md
- [ ] Document final configuration
- [ ] Create case study (if successful)
- [ ] Update deployment playbook

---

## Team Communication

### Pre-Deployment Notification
```
🚀 Security Headers Deployment - Scheduled for [DATE]

We're implementing comprehensive security headers including:
✅ Content Security Policy (Report-Only for 7 days)
✅ HSTS with preload
✅ Enhanced clickjacking protection
✅ Strict referrer policy

Impact: No user-facing changes expected
Monitoring: Oct 19-26, 2025
Questions: See SECURITY_HEADERS_IMPLEMENTATION.md
```

### Post-Deployment Notification
```
✅ Security Headers Deployed Successfully

Status: Report-Only mode active (7-day monitoring)
Next Milestone: Oct 26 - Automatic enforcement switch

Action Items:
- Test workflows in all browsers
- Report any console warnings
- Monitor /api/csp-report endpoint

Dashboard: [Link to monitoring]
Documentation: SECURITY_HEADERS_QUICK_REF.md
```

### Week 1 Summary
```
📊 CSP Monitoring Week 1 Summary

Total Violations: [NUMBER]
Critical Issues: [NUMBER]
Resolved Issues: [NUMBER]
Status: [ON TRACK / NEEDS ATTENTION]

Enforcement Switch: Oct 26 (automatic)
Team Action: [NONE REQUIRED / REVIEW NEEDED]

Full Report: [Link]
```

---

## Sign-Off

### Pre-Deployment Sign-Off
- [ ] **Developer:** Code reviewed and tested
- [ ] **Security Lead:** Implementation approved
- [ ] **Team Lead:** Deployment authorized
- [ ] **QA:** Testing completed

**Date:** _____________  
**Signed:** _____________

### Post-Deployment Sign-Off
- [ ] **Developer:** Deployment successful
- [ ] **Security Lead:** Headers verified in production
- [ ] **Team Lead:** Monitoring initiated
- [ ] **QA:** Smoke tests passed

**Date:** _____________  
**Signed:** _____________

### Week 1 Completion Sign-Off
- [ ] **Security Lead:** No critical violations found
- [ ] **Developer:** Ready for enforcement
- [ ] **Team Lead:** Approved for automatic switch
- [ ] **QA:** Regression testing passed

**Date:** _____________  
**Signed:** _____________

---

**Checklist Version:** 1.0  
**Last Updated:** October 19, 2025  
**Next Review:** October 26, 2025 (Post-enforcement)
