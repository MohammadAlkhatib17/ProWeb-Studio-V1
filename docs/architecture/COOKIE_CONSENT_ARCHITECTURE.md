# Cookie Consent System - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    App Layout                            │   │
│  │                                                           │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │         Cookie Consent Banner                    │   │   │
│  │  │  [Aanpassen] [Alleen noodzakelijk] [Alles...]  │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                                                           │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │         Cookie Settings Modal                    │   │   │
│  │  │  ☑ Noodzakelijke cookies (disabled)             │   │   │
│  │  │  □ Analytische cookies                           │   │   │
│  │  │  □ Marketing cookies                             │   │   │
│  │  │  [Voorkeuren opslaan] [Alles accepteren]       │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                                                           │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │      ConsentAwareAnalytics Component             │   │   │
│  │  │                                                   │   │   │
│  │  │  if (hasConsent('analytics')) {                  │   │   │
│  │  │    <Script src="plausible.io/js/script.js" />   │   │   │
│  │  │  }                                                │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                                                           │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │              Footer                               │   │   │
│  │  │  ... [Wijzig cookie-instellingen] ...            │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              useCookieConsent Hook                       │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  State: { consent, showBanner, showSettings }   │   │   │
│  │  │  Methods: { acceptAll, rejectAll, openSettings }│   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↕                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │            Cookie Utilities (cookie-utils.ts)            │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  getCookie(), setCookie(), saveConsent()        │   │   │
│  │  │  hasConsent(), shouldShowBanner()               │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↕                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                Browser Cookie Storage                    │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  pws_cookie_consent={...}                       │   │   │
│  │  │  SameSite=Lax; Secure; path=/                   │   │   │
│  │  │  Expires: 180 days                              │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### First Visit Flow

```
1. User visits site
   └→ useCookieConsent.ts checks for cookie
      └→ No cookie found
         └→ setShowBanner(true)
            └→ CookieConsentBanner.tsx renders
               └→ User sees banner

2. User clicks "Alles accepteren"
   └→ acceptAll() called
      └→ updateConsent({ necessary: true, analytics: true, marketing: true })
         └→ saveConsent() writes cookie
            └→ Dispatches 'cookieConsentChange' event
               └→ ConsentAwareAnalytics hears event
                  └→ setLoadAnalytics(true)
                     └→ <Script> renders
                        └→ Plausible loads
```

### Returning Visit Flow

```
1. User visits site (with existing cookie)
   └→ useCookieConsent.ts checks for cookie
      └→ Cookie found: { analytics: true, ... }
         └→ setShowBanner(false)
            └→ No banner shown
            └→ ConsentAwareAnalytics checks consent
               └→ hasConsentFor('analytics') === true
                  └→ Plausible loads immediately
```

### Settings Change Flow

```
1. User clicks "Wijzig cookie-instellingen" in footer
   └→ CookieSettingsButton.openSettings()
      └→ setShowSettings(true)
         └→ CookieSettingsModal.tsx renders

2. User toggles "Analytische cookies" OFF
   └→ setLocalConsent({ analytics: false })

3. User clicks "Voorkeuren opslaan"
   └→ updateConsent(localConsent)
      └→ saveConsent() overwrites cookie
         └→ Dispatches 'cookieConsentChange' event
            └→ ConsentAwareAnalytics hears event
               └→ setLoadAnalytics(false)
                  └→ Cleans up analytics
```

## Component Hierarchy

```
RootLayout (layout.tsx)
├── <Header />
├── <main>
│   └── {children}
├── <Footer>
│   └── <CookieSettingsButton />  ← Opens modal
├── <CookieConsentBanner />       ← First visit only
│   └── [Uses useCookieConsent()]
├── <CookieSettingsModal />       ← Opened from banner/footer
│   └── [Uses useCookieConsent()]
└── <ConsentAwareAnalytics />     ← Loads scripts conditionally
    └── [Uses useCookieConsent()]
```

## State Management

```typescript
// Global State (via useCookieConsent hook)
interface CookieConsentState {
  // Persisted in cookie
  consent: {
    necessary: boolean;   // Always true
    analytics: boolean;   // User choice
    marketing: boolean;   // User choice
  };
  
  // UI state
  showBanner: boolean;    // First visit only
  showSettings: boolean;  // Modal visibility
}

// Actions
acceptAll()      → Set all to true
rejectAll()      → Set optional to false
updateConsent()  → Custom granular update
openSettings()   → Show modal
closeSettings()  → Hide modal
```

## Event System

```typescript
// Custom event dispatched on consent change
window.dispatchEvent(
  new CustomEvent('cookieConsentChange', {
    detail: {
      consent: {
        necessary: true,
        analytics: true,
        marketing: false
      }
    }
  })
);

// Components listen for changes
window.addEventListener('cookieConsentChange', (e) => {
  const newConsent = e.detail.consent;
  // Update analytics, marketing scripts, etc.
});
```

## Security Model

```
Cookie Attributes:
├── Name: pws_cookie_consent
├── Value: {"version":1,"timestamp":...,"consent":{...}}
├── Path: /
├── SameSite: Lax         ← CSRF protection
├── Secure: true          ← HTTPS only (production)
├── HttpOnly: false       ← JS needs to read it
└── Max-Age: 15552000s    ← 180 days
```

## Performance Optimization

```
Bundle Size:
├── types.ts                  ~0.5KB
├── cookie-utils.ts           ~2KB
├── useCookieConsent.ts       ~1.5KB
├── CookieConsentBanner.tsx   ~1.5KB
├── CookieSettingsModal.tsx   ~2.5KB
├── ConsentAwareAnalytics.tsx ~0.5KB
└── CookieSettingsButton.tsx  ~0.3KB
─────────────────────────────────────
Total (gzipped):              ~6KB

Loading Strategy:
├── SSR: None (client-only)
├── Hydration: Checks cookie immediately
├── CLS: 0.00 (willChange: transform)
└── Scripts: Deferred until consent
```

## Accessibility Features

```
Keyboard Navigation:
├── Tab: Move forward
├── Shift+Tab: Move backward
├── Enter/Space: Activate
├── Escape: Close modal
└── Focus Trap: In modal

ARIA Attributes:
├── role="dialog"
├── aria-modal="true"
├── aria-labelledby="..."
├── aria-describedby="..."
├── role="switch" (toggles)
└── aria-checked="true|false"

Visual Indicators:
├── Focus Ring: 2px cyan-400
├── Color Contrast: ≥ 4.5:1
├── Touch Targets: ≥ 44px
└── Screen Reader: Full labels
```

## Testing Matrix

```
┌────────────┬─────────┬────────────┬──────────────┐
│ Test Case  │ Banner  │ Analytics  │ Cookie Value │
├────────────┼─────────┼────────────┼──────────────┤
│ First Visit│ Show    │ Blocked    │ null         │
│ Accept All │ Hide    │ Loaded     │ all=true     │
│ Reject All │ Hide    │ Blocked    │ optional=false│
│ Custom     │ Hide    │ Conditional│ custom       │
│ Reload     │ Hide    │ Respects   │ persisted    │
│ Change     │ Hide    │ Updates    │ updated      │
└────────────┴─────────┴────────────┴──────────────┘
```

## Browser Compatibility

```
✅ Chrome 90+     (Full support)
✅ Firefox 88+    (Full support)
✅ Safari 14+     (Full support)
✅ Edge 90+       (Full support)
✅ Mobile Safari  (Full support)
✅ Chrome Android (Full support)
```

## Legal Compliance Checklist

```
GDPR Article 7:
✅ Explicit consent required
✅ Consent freely given
✅ Specific per purpose
✅ Informed (descriptions provided)
✅ Revocable (footer link)
✅ No pre-ticked boxes

ePrivacy Directive:
✅ Prior consent for tracking
✅ Essential cookies allowed
✅ Clear information
✅ Easy withdrawal
```

---

**Legend:**
- `→` : Data flow direction
- `└→` : Sequential step
- `↕` : Bidirectional communication
- `✅` : Feature implemented
- `[]` : Component boundary
