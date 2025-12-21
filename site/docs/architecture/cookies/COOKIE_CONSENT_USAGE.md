# Cookie Consent Usage Guide

## Quick Start

```tsx
import { useCookieConsent } from '@/components/cookies/useCookieConsent';

function MyComponent() {
  const {
    consent,
    showBanner,
    showSettings,
    hasConsentFor,
    updateConsent,
    acceptAll,
    rejectAll,
    openSettings,
    closeSettings,
    closeBanner,
  } = useCookieConsent();

  // Check specific consent
  if (hasConsentFor('analytics')) {
    // Load analytics script
  }

  return (
    <>
      {showBanner && <CookieBanner />}
      {showSettings && <CookieSettings />}
    </>
  );
}
```

## API Reference

### State

| Property | Type | Description |
|----------|------|-------------|
| `consent` | `ConsentState` | Current consent state (`{ necessary, analytics, marketing }`) |
| `showBanner` | `boolean` | Whether to show the consent banner |
| `showSettings` | `boolean` | Whether to show the settings modal |

### Methods

#### `hasConsentFor(category: ConsentCategory): boolean`
Check if user has given consent for a specific category.

```tsx
if (hasConsentFor('analytics')) {
  initGoogleAnalytics();
}
```

#### `updateConsent(partial: Partial<ConsentState>): void`
Update specific consent categories. Automatically enforces `necessary: true`.

```tsx
updateConsent({ analytics: true, marketing: false });
```

#### `acceptAll(): void`
Accept all cookie categories.

```tsx
<button onClick={acceptAll}>Accept All Cookies</button>
```

#### `rejectAll(): void`
Reject all optional cookies (keeps `necessary: true`).

```tsx
<button onClick={rejectAll}>Reject All</button>
```

#### `openSettings(): void`
Open the cookie settings modal and close the banner.

```tsx
<button onClick={openSettings}>Cookie Preferences</button>
```

#### `closeSettings(): void`
Close the cookie settings modal.

```tsx
<button onClick={closeSettings}>Close Settings</button>
```

#### `closeBanner(): void`
Close the banner without saving (only works if consent already exists).

```tsx
<button onClick={closeBanner}>×</button>
```

## Example: Cookie Banner Component

```tsx
'use client';

import { useCookieConsent } from '@/components/cookies/useCookieConsent';

export function CookieBanner() {
  const { showBanner, acceptAll, rejectAll, openSettings } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 bg-gray-900 text-white p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <p className="text-sm">
          We use cookies to enhance your experience. You can customize your preferences.
        </p>
        <div className="flex gap-2">
          <button
            onClick={acceptAll}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Accept All
          </button>
          <button
            onClick={rejectAll}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            Reject All
          </button>
          <button
            onClick={openSettings}
            className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-800"
          >
            Customize
          </button>
        </div>
      </div>
    </div>
  );
}
```

## Example: Cookie Settings Modal

```tsx
'use client';

import { useCookieConsent } from '@/components/cookies/useCookieConsent';

export function CookieSettings() {
  const { showSettings, consent, updateConsent, closeSettings } = useCookieConsent();

  if (!showSettings) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Cookie Preferences</h2>
        
        <div className="space-y-4">
          {/* Necessary - Always On */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Necessary</h3>
              <p className="text-sm text-gray-600">Required for the site to function</p>
            </div>
            <input type="checkbox" checked disabled />
          </div>

          {/* Analytics */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Analytics</h3>
              <p className="text-sm text-gray-600">Help us improve our website</p>
            </div>
            <input
              type="checkbox"
              checked={consent.analytics}
              onChange={(e) => updateConsent({ analytics: e.target.checked })}
            />
          </div>

          {/* Marketing */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Marketing</h3>
              <p className="text-sm text-gray-600">Personalized ads and content</p>
            </div>
            <input
              type="checkbox"
              checked={consent.marketing}
              onChange={(e) => updateConsent({ marketing: e.target.checked })}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={closeSettings}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              updateConsent(consent); // Save current state
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
```

## Example: Conditional Analytics Loading

```tsx
'use client';

import { useEffect } from 'react';
import { useCookieConsent } from '@/components/cookies/useCookieConsent';

export function AnalyticsLoader() {
  const { hasConsentFor } = useCookieConsent();

  useEffect(() => {
    // Load analytics only if user has given consent
    if (hasConsentFor('analytics')) {
      // Initialize Google Analytics
      window.gtag?.('config', 'GA_MEASUREMENT_ID');
    }

    // Listen for consent changes
    const handleConsentChange = (event: CustomEvent) => {
      const { consent } = event.detail;
      if (consent.analytics) {
        // User just accepted analytics
        window.gtag?.('config', 'GA_MEASUREMENT_ID');
      } else {
        // User revoked consent - clear analytics cookies
        document.cookie.split(';').forEach((cookie) => {
          const name = cookie.split('=')[0].trim();
          if (name.startsWith('_ga')) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
          }
        });
      }
    };

    window.addEventListener('cookieConsentChange', handleConsentChange as EventListener);
    
    return () => {
      window.removeEventListener('cookieConsentChange', handleConsentChange as EventListener);
    };
  }, [hasConsentFor]);

  return null;
}
```

## Example: Footer Cookie Link

```tsx
'use client';

import { useCookieConsent } from '@/components/cookies/useCookieConsent';

export function Footer() {
  const { openSettings } = useCookieConsent();

  return (
    <footer>
      <nav>
        <a href="/privacy">Privacy Policy</a>
        <button onClick={openSettings} className="underline">
          Cookie Preferences
        </button>
      </nav>
    </footer>
  );
}
```

## Cookie Structure

The consent is stored as a JSON cookie:

```
Name: pws_cookie_consent
Value: %7B%22version%22%3A1%2C%22timestamp%22%3A1729363200000%2C%22consent%22%3A%7B%22necessary%22%3Atrue%2C%22analytics%22%3Afalse%2C%22marketing%22%3Afalse%7D%7D
Max-Age: 15552000 (180 days)
Path: /
SameSite: Lax
Secure: (on HTTPS)
```

Decoded value:
```json
{
  "version": 1,
  "timestamp": 1729363200000,
  "consent": {
    "necessary": true,
    "analytics": false,
    "marketing": false
  }
}
```

## Testing Commands

```bash
# Check cookie in browser console
document.cookie

# Get parsed consent
JSON.parse(decodeURIComponent(document.cookie.split('pws_cookie_consent=')[1].split(';')[0]))

# Clear consent cookie
document.cookie = "pws_cookie_consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"

# Trigger consent change event
window.dispatchEvent(new CustomEvent('cookieConsentChange', {
  detail: { consent: { necessary: true, analytics: true, marketing: false } }
}))
```

## Best Practices

1. **Always check consent before loading third-party scripts**
   ```tsx
   if (hasConsentFor('analytics')) {
     loadGoogleAnalytics();
   }
   ```

2. **Listen for consent changes**
   ```tsx
   window.addEventListener('cookieConsentChange', (event) => {
     // Reload scripts or clear cookies based on new consent
   });
   ```

3. **Provide clear descriptions**
   - Explain what each cookie category does
   - Link to your privacy policy

4. **Test across browsers**
   - Ensure cookies persist correctly
   - Verify SameSite and Secure flags

5. **Monitor consent rates**
   - Track how many users accept/reject
   - A/B test banner copy

## Troubleshooting

### Banner flashes on page load
✅ Fixed! The synchronous initial state prevents this.

### Consent not persisting
- Check browser console for cookie errors
- Verify domain matches (no subdomains unless explicitly set)
- Ensure cookies are enabled

### Hydration mismatch
✅ Fixed! SSR returns safe defaults, client initializer runs synchronously.

### necessary=true being overridden
✅ Fixed! All update methods enforce `necessary: true`.
