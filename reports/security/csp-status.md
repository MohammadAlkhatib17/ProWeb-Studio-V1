# CSP Implementation Status Report

## Overview
Content Security Policy (CSP) implementation for `/contact` route with 48-hour monitoring window before enforcement.

**Status**: 🟡 Report-Only Mode (Monitoring Active)  
**Window**: September 18, 2025 00:00 UTC → September 20, 2025 00:00 UTC  
**Endpoint**: `/api/csp-report` (collecting violations)

## Current CSP Directives

### Report-Only Policy (Active)
```
Content-Security-Policy-Report-Only:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://js.cal.com https://plausible.io https://va.vercel-scripts.com;
  script-src-elem 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com https://plausible.io https://va.vercel-scripts.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https: blob:;
  media-src 'self' https:;
  frame-src 'self' https://www.google.com https://cal.com https://app.cal.com;
  connect-src 'self' https://api.cal.com https://www.google-analytics.com https://plausible.io https://vitals.vercel-insights.com https://va.vercel-scripts.com;
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'none';
  form-action 'self';
  upgrade-insecure-requests;
  report-uri /api/csp-report
```

### Key Changes from Previous Policy
- ❌ **Removed**: `unsafe-eval` from `script-src` and `script-src-elem`
- ✅ **Maintained**: `unsafe-inline` for existing inline scripts
- 📊 **Monitoring**: All violations tracked via `/api/csp-report`

## Violation Tracking

### Expected Violation Types to Monitor
1. **eval() Usage**: Direct `eval()` calls or dynamic code evaluation
2. **Inline Script Violations**: Scripts without proper nonces/hashes
3. **External Resource Access**: Unexpected third-party domains
4. **Protocol Violations**: HTTP resources on HTTPS pages

### Current Violation Status
> **Note**: Check server logs and `/api/csp-report` endpoint for real-time violations during the 48h window.

```bash
# Monitor violations in real-time
tail -f /var/log/application.log | grep "CSP Violation"

# Or check Vercel Function logs if deployed
vercel logs --function=csp-report
```

## Enforcement-Ready Policy

The following enforced CSP policy is prepared and commented in `next.config.mjs`:

```javascript
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://js.cal.com https://plausible.io https://va.vercel-scripts.com;
  script-src-elem 'self' https://www.google.com https://www.gstatic.com https://plausible.io https://va.vercel-scripts.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https: blob:;
  media-src 'self' https:;
  frame-src 'self' https://www.google.com https://cal.com https://app.cal.com;
  connect-src 'self' https://api.cal.com https://www.google-analytics.com https://plausible.io https://vitals.vercel-insights.com https://va.vercel-scripts.com;
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'none';
  form-action 'self';
  upgrade-insecure-requests
```

## Switch to Enforcement

### Prerequisites
1. ✅ **48h monitoring window completed**
2. ✅ **Zero or acceptable violation count**
3. ✅ **All inline scripts reviewed for nonce/hash migration**
4. ✅ **Third-party integrations verified**

### One-Line Toggle Instruction

**To activate enforced CSP policy:**

```bash
# In site/next.config.mjs:
# 1. Comment out the "Report-Only" section (lines ~248-265)
# 2. Uncomment the "ENFORCED CSP" section (lines ~267-291)
```

Or use this automated toggle:

```bash
cd site && sed -i 's/Content-Security-Policy-Report-Only/Content-Security-Policy/' next.config.mjs
```

## Security Recommendations

### Immediate Actions (During Monitoring)
- [ ] Monitor violation reports every 12 hours
- [ ] Identify any `eval()` usage patterns
- [ ] Document legitimate inline scripts for nonce implementation
- [ ] Test all contact form integrations (Google reCAPTCHA, Cal.com)

### Post-Monitoring Actions
- [ ] Implement nonces for any required inline scripts
- [ ] Remove `unsafe-inline` from `script-src` if possible
- [ ] Add specific hashes for necessary inline event handlers
- [ ] Set up automated CSP violation alerting

### Long-term Hardening
- [ ] Implement Subresource Integrity (SRI) for external scripts
- [ ] Consider strict-dynamic for script loading
- [ ] Regular CSP policy audits and updates
- [ ] Implement CSP reporting in production monitoring

## Files Modified

1. **`site/next.config.mjs`**
   - Added 48h window comments
   - Removed `unsafe-eval` from report-only policy
   - Prepared enforced policy (commented)

2. **`site/src/app/api/csp-report/route.ts`**
   - Enhanced violation logging with monitoring window context
   - Added specific eval() usage detection
   - Improved violation data structure

3. **`reports/security/csp-status.md`** (this file)
   - Complete CSP implementation documentation
   - Violation tracking procedures
   - Toggle instructions

---

**Last Updated**: September 18, 2025  
**Next Review**: September 20, 2025 (End of monitoring window)  
**Contact**: Monitor CSP violations and review before enforcement activation