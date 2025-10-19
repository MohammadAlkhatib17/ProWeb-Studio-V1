# Cookie Consent First-Load Fix - Quick Reference

## Problem
Cookie consent banner not visible on first visit (cold load with no cookies).

## Root Cause
CSS animation class `animate-slide-up` started with `opacity: 0` and took 1 second to animate to visible.

## Solution
**File**: `site/src/components/cookies/CookieConsentBanner.tsx`

```tsx
// REMOVED this class from banner div:
className="... animate-slide-up"

// ADDED inline styles:
style={{
  willChange: 'transform',
  opacity: 1,              // Visible immediately
  transform: 'translateY(0)',
}}
```

## Testing

### Unit Tests
```bash
cd site
npm test -- src/components/cookies/__tests__/useCookieConsent.test.ts --run
```
Expected: 11/11 tests pass ✅

### E2E Tests
```bash
cd site
npm run test:e2e -- tests/e2e/cookie-consent-first-load.spec.ts
```
Expected: 9/9 tests pass ✅

### Manual Test (Critical!)
1. Open browser in **incognito mode**
2. Navigate to `http://localhost:3000` (or production URL)
3. **EXPECT**: Cookie banner visible **immediately** at bottom of screen
4. **VERIFY**: All 3 buttons clickable (Aanpassen, Alleen noodzakelijk, Alles accepteren)
5. **VERIFY**: 3D canvas rendering in background (if on homepage)
6. **VERIFY**: No console errors or warnings

## Verification Checklist

Before merging:
- [ ] Unit tests pass (11/11)
- [ ] E2E tests pass (9/9) 
- [ ] Manual test in incognito: banner visible < 500ms
- [ ] No hydration errors in console
- [ ] 3D canvas renders before consent
- [ ] CSP violations cleared
- [ ] Lighthouse score unchanged

## Key Files Modified
1. `site/src/components/cookies/CookieConsentBanner.tsx` (removed animation)
2. `site/src/components/cookies/__tests__/useCookieConsent.test.ts` (NEW)
3. `site/tests/e2e/cookie-consent-first-load.spec.ts` (NEW)

## Performance Impact
- **Before**: 1s delay before banner visible
- **After**: 0ms delay (visible on first paint)
- **Bundle size**: +30 bytes (inline styles only)

## Related Docs
- Full summary: `COOKIE_CONSENT_FIRST_LOAD_FIX.md`
- Architecture: `../../COOKIE_CONSENT_ARCHITECTURE.md`
- Implementation: `../../COOKIE_CONSENT_IMPLEMENTATION.md`
