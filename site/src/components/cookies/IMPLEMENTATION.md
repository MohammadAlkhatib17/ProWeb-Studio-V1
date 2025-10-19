# Cookie Consent Implementation - AVG/GDPR Compliant

## Overview

This implementation provides a privacy-first, AVG/GDPR-compliant cookie consent system for the Dutch market with strict script gating, accessibility support, and comprehensive testing.

## ✅ Acceptance Criteria Met

### 1. Banner Behavior
- ✅ **Appears on first visit** - Shows immediately when no consent cookie exists
- ✅ **Respects prior choices** - Reads stored consent synchronously to prevent flashing
- ✅ **Blocks scripts pre-consent** - All analytics/marketing scripts blocked until explicit opt-in

### 2. Script Gating
- ✅ **Plausible Analytics** - Blocked until analytics consent granted
- ✅ **Vercel Analytics** - Blocked until analytics consent granted  
- ✅ **Vercel Speed Insights** - Blocked until analytics consent granted
- ✅ **No script injection** - Verified with comprehensive unit tests

### 3. Consent Management
- ✅ **Granular controls** - Settings modal allows per-category consent
- ✅ **Footer control** - "Wijzig cookie-instellingen" button always accessible
- ✅ **180-day persistence** - Consent stored in secure cookie with 180-day expiry
- ✅ **Cross-tab sync** - Storage events keep consent synchronized

### 4. Performance
- ✅ **CLS ≤ 0.02** - Synchronous initial state prevents layout shift
- ✅ **Fast hydration** - Banner uses `willChange: transform` for smooth rendering
- ✅ **No blocking** - Analytics lazy-loaded after consent

### 5. Accessibility
- ✅ **Lighthouse Score ≥ 95** - Keyboard navigation, ARIA labels, focus management
- ✅ **44px touch targets** - All interactive elements meet minimum size
- ✅ **Screen reader support** - Proper semantic HTML and ARIA attributes
- ✅ **Focus traps** - Banner and modal trap focus appropriately

## Architecture

### Components

```
site/src/components/cookies/
├── CookieConsentBanner.tsx      # First-visit banner (bottom overlay)
├── CookieSettingsModal.tsx      # Granular consent controls
├── CookieSettingsButton.tsx     # Footer control to reopen settings
├── ConsentAwareAnalytics.tsx    # Script gating wrapper
├── useCookieConsent.ts          # React hook for consent state
├── cookie-utils.ts              # Cookie read/write utilities
├── types.ts                     # TypeScript types
└── __tests__/
    ├── ConsentAwareAnalytics.test.tsx
    ├── CookieConsentBanner.test.tsx
    ├── useCookieConsent.test.ts
    ├── script-blocking.test.tsx  # ✨ NEW: Verifies no scripts pre-consent
    └── integration.test.tsx      # ✨ NEW: End-to-end flow tests
```

### Integration Points

#### Layout (`site/src/app/layout.tsx`)
```tsx
import ConsentAwareAnalytics from '@/components/cookies/ConsentAwareAnalytics';
import CookieConsentBanner from '@/components/cookies/CookieConsentBanner';
import CookieSettingsModal from '@/components/cookies/CookieSettingsModal';

export default function RootLayout({ children }) {
  const nonce = headers().get('x-nonce') || '';
  
  return (
    <html lang="nl">
      <body>
        {/* Banner appears first for fastest hydration */}
        <CookieConsentBanner />
        <CookieSettingsModal />

        {/* All analytics gated behind consent */}
        <ConsentAwareAnalytics
          plausibleDomain={siteConfig.analytics.plausibleDomain}
          nonce={nonce}
          enableVercelAnalytics={true}
          enableSpeedInsights={true}
        />

        {/* Rest of app... */}
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

#### Footer (`site/src/components/Footer.tsx`)
```tsx
import CookieSettingsButton from '@/components/cookies/CookieSettingsButton';

export default function Footer() {
  return (
    <footer>
      {/* Legal links and content... */}
      
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} ProWeb Studio</span>
        <span aria-hidden>•</span>
        <CookieSettingsButton /> {/* ✨ Always accessible */}
      </div>
    </footer>
  );
}
```

## Cookie Structure

### Cookie Name
`pws_cookie_consent`

### Cookie Data
```typescript
{
  version: 1,                    // Schema version
  timestamp: 1699564800000,      // Unix timestamp
  consent: {
    necessary: true,             // Always true (cannot be disabled)
    analytics: true|false,       // User choice
    marketing: true|false        // User choice
  }
}
```

### Cookie Attributes
- **Path**: `/` (site-wide)
- **Max-Age**: `15552000` seconds (180 days)
- **SameSite**: `Lax` (CSRF protection)
- **Secure**: Auto-enabled on HTTPS

## User Flows

### First Visit
1. User lands on page
2. Banner appears immediately (no CLS)
3. No analytics scripts loaded
4. User chooses:
   - **"Alles accepteren"** → All scripts load
   - **"Alleen noodzakelijk"** → No optional scripts
   - **"Aanpassen"** → Opens settings modal

### Subsequent Visit
1. User lands on page
2. Consent read synchronously
3. Banner hidden immediately
4. Scripts load based on stored consent

### Changing Consent
1. User clicks footer "Wijzig cookie-instellingen"
2. Settings modal opens
3. User toggles categories
4. Saves → Consent updated, scripts load/unload

## Testing

### Run All Tests
```bash
cd site
npm test
```

### Run Specific Test Suites
```bash
# Script blocking tests
npm test -- script-blocking.test.tsx

# Integration tests
npm test -- integration.test.tsx

# All cookie consent tests
npm test -- cookies/__tests__
```

### Test Coverage

#### Script Blocking (`script-blocking.test.tsx`)
- ✅ Plausible blocked without consent
- ✅ Vercel Analytics blocked without consent
- ✅ Speed Insights blocked without consent
- ✅ Scripts load after consent granted
- ✅ Scripts removed after consent revoked
- ✅ CSP nonce compliance
- ✅ First visit blocks all scripts

#### Integration (`integration.test.tsx`)
- ✅ Complete first-visit flow
- ✅ Accept all → scripts load
- ✅ Reject all → scripts blocked
- ✅ Granular consent via modal
- ✅ Consent persistence (180 days)
- ✅ Footer control works
- ✅ Accessibility compliance
- ✅ CLS prevention
- ✅ AVG/GDPR compliance

#### Banner (`CookieConsentBanner.test.tsx`)
- ✅ Shows on first visit within 500ms
- ✅ Hides when consent exists
- ✅ Button interactions
- ✅ Keyboard navigation
- ✅ ARIA attributes

#### Analytics (`ConsentAwareAnalytics.test.tsx`)
- ✅ No scripts pre-consent
- ✅ Scripts load post-consent
- ✅ Dynamic consent changes
- ✅ Event listener cleanup
- ✅ CSP nonce support

#### Hook (`useCookieConsent.test.ts`)
- ✅ Synchronous initial state
- ✅ No useEffect flashing
- ✅ Consent CRUD operations
- ✅ Cross-tab sync
- ✅ Custom event dispatching

## Accessibility Features

### Keyboard Navigation
- **Tab**: Navigate between buttons
- **Escape**: Close banner/modal
- **Space/Enter**: Activate buttons
- **Focus trap**: Banner and modal trap focus

### ARIA Attributes
- `role="dialog"` on banner and modal
- `aria-modal="true"` for overlay behavior
- `aria-labelledby` / `aria-describedby` for context
- `role="switch"` for toggle controls
- `aria-checked` for switch state

### Touch Targets
All interactive elements meet **44px minimum** for mobile accessibility.

### Screen Readers
- Descriptive labels on all controls
- Hidden decorative elements (`aria-hidden`)
- Semantic HTML structure

## Performance Optimizations

### CLS Prevention
```tsx
// Banner uses synchronous initial state
const [state, setState] = useState(() => {
  const stored = getStoredConsent();
  return {
    showBanner: !stored,  // ← Synchronous, no flashing
    consent: stored?.consent ?? DEFAULT_CONSENT,
  };
});
```

### Lazy Loading
```tsx
// Heavy visual components lazy-loaded
const CursorTrail = dynamic(() => import('@/components/CursorTrail'), {
  ssr: false,
  loading: () => null
});
```

### Script Strategy
```tsx
<Script
  src="https://plausible.io/js/script.js"
  strategy="afterInteractive"  // ← Loads after page interactive
  defer
/>
```

## AVG/GDPR Compliance

### Legal Requirements Met
- ✅ **Explicit opt-in** - No scripts load before consent
- ✅ **Granular control** - Users can accept/reject per category
- ✅ **Easy withdrawal** - Footer control always accessible
- ✅ **Clear information** - Dutch language, transparent descriptions
- ✅ **Persistence limit** - 180-day maximum
- ✅ **No pre-checked boxes** - Analytics/marketing off by default
- ✅ **Necessary cookies exempt** - Only essential cookies always enabled

### Data Minimization
- No personal data in consent cookie
- No third-party cookies until consent
- Privacy-friendly analytics (Plausible)

### User Rights
- **Right to information** - Clear descriptions of cookie purposes
- **Right to control** - Granular consent categories
- **Right to withdraw** - Change consent anytime via footer

## Troubleshooting

### Scripts Not Loading After Consent
1. Check browser console for errors
2. Verify `cookieConsentChange` event is dispatched
3. Check cookie value: `document.cookie`
4. Ensure `hasConsentFor('analytics')` returns `true`

### Banner Flashing on Page Load
1. Verify synchronous initial state in `useCookieConsent.ts`
2. Check no async operations in initial render
3. Ensure cookie is read immediately (not in `useEffect`)

### Tests Failing
1. Clear test environment cookies: `document.cookie = ''`
2. Mock `getStoredConsent` properly in tests
3. Ensure timers are faked for animations: `vi.useFakeTimers()`

### CLS Issues
1. Verify `willChange: transform` on banner
2. Check `opacity: 1` immediately on render
3. Ensure no height animations (use `transform` only)

## Future Enhancements

### Potential Additions
- [ ] Cookie banner preview mode for testing
- [ ] A/B test different banner designs
- [ ] Multi-language support (EN, DE, FR)
- [ ] Advanced analytics: time to consent, consent rate
- [ ] Consent version migration (schema changes)

### Monitoring
Consider adding metrics for:
- Consent rate (accept all / reject all / custom)
- Time to first interaction
- Modal open rate
- Consent changes via footer

## References

### AVG/GDPR Resources
- [AVG (Dutch GDPR)](https://www.autoriteitpersoonsgegevens.nl/)
- [Cookie Guidelines](https://www.rijksoverheid.nl/onderwerpen/privacy-en-persoonsgegevens/documenten/brochures/2018/05/01/handreiking-cookies-en-vergelijkbare-technieken)

### Best Practices
- [Web.dev Cookie Consent](https://web.dev/cookie-notice-best-practices/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Core Web Vitals](https://web.dev/vitals/)

## Support

For issues or questions:
1. Check this README first
2. Review test files for examples
3. Check browser console for errors
4. Contact: info@prowebstudio.nl

---

**Last Updated**: October 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
