# CSP Nonce Implementation - Quick Reference

## 🎯 What Was Fixed

**Problem:** Cookie banner didn't appear on first visit due to CSP blocking Next.js internal inline scripts.

**Solution:** Implemented strict nonce-based CSP that:
1. Generates unique nonce per request
2. Propagates nonce to all scripts via Next.js App Router
3. Blocks analytics until consent
4. Maintains security while allowing hydration

## 🔑 Key Files Changed

```
site/src/middleware.ts              ← Nonce generation + CSP enforcement
site/src/app/layout.tsx             ← Nonce propagation to components
site/src/components/cookies/*       ← Already compliant (no changes needed)
site/src/components/*Schema*.tsx    ← Added nonce prop to all
```

## 🚀 Quick Test

```bash
# Start dev server
cd site && npm run dev

# In another terminal, verify CSP
./verify-csp-nonce.sh http://localhost:3000

# Or test manually:
curl -I http://localhost:3000 | grep -i content-security-policy
```

**Expected in dev:**
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-ABC123...' 'strict-dynamic' https: http: 'unsafe-eval'; ...
```

**Expected in prod:**
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-XYZ789...' 'strict-dynamic' https: http:; ...
```
(Note: NO 'unsafe-eval' in production)

## ✅ Acceptance Criteria Checklist

### First Load (No Cookies)
- [ ] **ZERO CSP errors** in browser console
- [ ] Cookie banner **visible within 500ms** of DOMContentLoaded
- [ ] Banner is **interactive** (buttons clickable)
- [ ] 3D canvases **render** before consent

### CSP Policy
- [ ] **Enforced** (not report-only)
- [ ] Contains `'nonce-<nonce>' 'strict-dynamic'`
- [ ] Production: **NO** `'unsafe-inline'` or `'unsafe-eval'`
- [ ] Development: `'unsafe-eval'` present (React Refresh)

### Analytics
- [ ] **NO** plausible.io requests before consent
- [ ] After "Accept All": Plausible script **loads** with nonce
- [ ] After "Reject All": Plausible **never** loads

### Performance
- [ ] Lighthouse Security = **100**
- [ ] Mobile LCP ≤ **2.5s**
- [ ] CLS ≤ **0.02**
- [ ] Bundle size delta < **5 KB**

## 🛠️ Manual Testing Steps

1. **Clear cookies** (or use incognito)
2. **Open DevTools Console** BEFORE navigation
3. Navigate to `http://localhost:3000`
4. Check console: **Zero errors starting with "Refused to execute inline script"**
5. Cookie banner should be **visible at bottom**
6. Click **"Aanpassen"** → Settings modal opens
7. Toggle analytics **OFF** → Save
8. Check Network tab: **NO** requests to plausible.io
9. Open settings again → Toggle analytics **ON** → Save
10. Check Network tab: **Plausible script loads**
11. Inspect script element: Has `nonce="..."` attribute

## 🐛 Troubleshooting

### Issue: CSP errors still appear
**Check:**
- Is `x-nonce` header present? `curl -I http://localhost:3000 | grep x-nonce`
- Is nonce in CSP header? `curl -I http://localhost:3000 | grep nonce-`
- Is meta tag in HTML? View source, search for `csp-nonce`

### Issue: Cookie banner not visible
**Check:**
- Open Elements inspector → Search for "CookieConsentBanner"
- Check computed styles: `z-index` should be `9999`
- Check `display`: should NOT be `none` when `showBanner={true}`
- Check `opacity`: should be `1`, not `0`

### Issue: Analytics load without consent
**Check:**
- `ConsentAwareAnalytics.tsx` → `loadAnalytics` state should be `false` initially
- Only after `acceptAll()` or `updateConsent({ analytics: true })` should it load
- Check cookie: `document.cookie` → look for consent cookie

### Issue: 3D scenes don't render
**Check:**
- CSP allows WebGL: `worker-src 'self' blob:`
- Canvas elements present in DOM
- No errors in console related to Three.js

## 📊 Expected Console Output

### ✅ Good (First Load, No Cookies)
```
[No CSP errors]
Cookie consent not found, showing banner
```

### ❌ Bad (What we fixed)
```
Refused to execute inline script because it violates CSP directive: 'script-src 'self'...'
Refused to execute inline script because it violates CSP directive: 'script-src 'self'...'
[Multiple CSP violations]
```

## 🔐 Security Benefits

- ✅ **XSS Protection**: Nonce-based CSP blocks malicious inline scripts
- ✅ **Injection Prevention**: Only scripts with valid nonce execute
- ✅ **Privacy-First**: Analytics NEVER load without consent
- ✅ **Strict Policy**: No `unsafe-inline`, no `unsafe-eval` (production)
- ✅ **Rotating Nonce**: Unique per request, not guessable

## 📚 Related Docs

- **Full Implementation**: `CSP_NONCE_IMPLEMENTATION_SUMMARY.md`
- **Cookie Usage**: `COOKIE_CONSENT_USAGE.md`
- **Testing Checklist**: `COOKIE_CONSENT_TEST_CHECKLIST.md`
- **Architecture**: `COOKIE_CONSENT_ARCHITECTURE.md`

## 🎓 For Future Changes

**Adding new Script components:**
```tsx
interface MyComponentProps {
  nonce?: string; // ← Add this
}

export default function MyComponent({ nonce }: MyComponentProps) {
  return (
    <Script
      id="my-script"
      src="https://example.com/script.js"
      nonce={nonce}  // ← Pass nonce
      strategy="afterInteractive"
    />
  );
}
```

**In parent component:**
```tsx
import { headers } from 'next/headers';

export default function Page() {
  const nonce = headers().get('x-nonce') || '';
  return <MyComponent nonce={nonce} />;
}
```

## ⚡ Quick Commands

```bash
# Build & verify
npm run build
npm run start
./verify-csp-nonce.sh http://localhost:3000

# Deploy
git add -A
git commit -m "feat: implement strict nonce-based CSP"
git push origin main

# Monitor (after deployment)
./verify-csp-nonce.sh https://your-production-url.com
```

---

**Status:** ✅ Implementation Complete  
**Next:** Manual testing + deployment  
**Date:** 2025-10-19
