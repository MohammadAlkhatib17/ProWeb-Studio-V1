/**
 * Cookie Consent Usage Examples
 * Demonstrates how to use the cookie consent system in different scenarios
 */

// ============================================================================
// Example 1: Check consent before loading third-party scripts
// ============================================================================

'use client';

import { useEffect } from 'react';
import { useCookieConsent } from '@/components/cookies';

export function SocialMediaWidget() {
  const { hasConsentFor } = useCookieConsent();

  useEffect(() => {
    // Only load Facebook SDK if user has given marketing consent
    if (hasConsentFor('marketing')) {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // Cleanup
        document.body.removeChild(script);
      };
    }
    
    return undefined;
  }, [hasConsentFor]);

  if (!hasConsentFor('marketing')) {
    return (
      <div className="p-4 border border-slate-700 rounded-lg bg-cosmic-800/40">
        <p className="text-sm text-slate-400">
          Om sociale media content te laden, moet je marketing cookies accepteren.
        </p>
      </div>
    );
  }

  return <div id="fb-widget">{/* Facebook widget will load here */}</div>;
}

// ============================================================================
// Example 2: Listen for consent changes
// ============================================================================

export function AnalyticsManager() {
  const { consent } = useCookieConsent();

  useEffect(() => {
    console.log('Consent state changed:', consent);

    // Update your analytics configuration based on consent
    if (consent.analytics) {
      // Enable analytics tracking
      console.log('Analytics enabled');
    } else {
      // Disable analytics tracking
      console.log('Analytics disabled');
    }
  }, [consent]);

  return null; // This is a manager component, no UI
}

// ============================================================================
// Example 3: Programmatically update consent
// ============================================================================

export function ConsentDebugPanel() {
  const { consent, updateConsent, acceptAll, rejectAll } = useCookieConsent();

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-cosmic-900 border border-cosmic-700 rounded-lg">
      <h3 className="font-semibold mb-2">Consent Debug Panel</h3>
      
      <div className="space-y-2 text-sm">
        <div>Necessary: {consent.necessary ? '✅' : '❌'}</div>
        <div>Analytics: {consent.analytics ? '✅' : '❌'}</div>
        <div>Marketing: {consent.marketing ? '✅' : '❌'}</div>
      </div>

      <div className="mt-4 space-y-2">
        <button
          onClick={() => updateConsent({ analytics: true, marketing: false })}
          className="w-full px-3 py-2 bg-cyan-500 text-black rounded"
        >
          Analytics Only
        </button>
        <button
          onClick={acceptAll}
          className="w-full px-3 py-2 bg-green-500 text-black rounded"
        >
          Accept All
        </button>
        <button
          onClick={rejectAll}
          className="w-full px-3 py-2 bg-red-500 text-black rounded"
        >
          Reject All
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Example 4: Conditional component rendering
// ============================================================================

import { hasConsent } from '@/components/cookies';

export function MarketingBanner() {
  // Check consent synchronously (for SSR-safe initial render)
  const showBanner = hasConsent('marketing');

  if (!showBanner) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-cyan-500 to-magenta-500 p-4">
      <p className="text-white font-semibold">
        🎉 Special Offer: 20% off all services!
      </p>
    </div>
  );
}

// ============================================================================
// Example 5: Custom consent event handler
// ============================================================================

export function CustomAnalytics() {
  useEffect(() => {
    const handleConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent<{
        consent: { analytics: boolean };
      }>;

      if (customEvent.detail?.consent?.analytics) {
        // Initialize your custom analytics
        console.log('Initializing custom analytics...');
        
        // Example: Initialize Google Analytics
        if (typeof window !== 'undefined') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).dataLayer = (window as any).dataLayer || [];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          function gtag(...args: any[]) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).dataLayer.push(args);
          }
          gtag('js', new Date());
          gtag('config', 'GA_MEASUREMENT_ID');
        }
      } else {
        // Disable analytics
        console.log('Disabling custom analytics...');
      }
    };

    window.addEventListener('cookieConsentChange', handleConsentChange);
    
    return () => {
      window.removeEventListener('cookieConsentChange', handleConsentChange);
    };
  }, []);

  return null;
}

// ============================================================================
// Example 6: Server-side consent checking (for middleware)
// ============================================================================

// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { CONSENT_COOKIE_NAME } from '@/components/cookies';

export function middleware(request: NextRequest) {
  const consentCookie = request.cookies.get(CONSENT_COOKIE_NAME);
  
  if (consentCookie) {
    try {
      const consent = JSON.parse(decodeURIComponent(consentCookie.value));
      
      // Add consent info to response headers for analytics
      const response = NextResponse.next();
      response.headers.set('X-Analytics-Consent', consent.consent.analytics ? '1' : '0');
      
      return response;
    } catch (error) {
      console.error('Failed to parse consent cookie:', error);
    }
  }
  
  return NextResponse.next();
}

// ============================================================================
// Example 7: Testing helper
// ============================================================================

// test-utils/cookie-consent-mock.ts
export function mockConsentState(consent: {
  necessary?: boolean;
  analytics?: boolean;
  marketing?: boolean;
}) {
  const consentData = {
    version: 1,
    timestamp: Date.now(),
    consent: {
      necessary: consent.necessary ?? true,
      analytics: consent.analytics ?? false,
      marketing: consent.marketing ?? false,
    },
  };

  document.cookie = `pws_cookie_consent=${encodeURIComponent(JSON.stringify(consentData))}; path=/; SameSite=Lax`;
}

export function clearConsentCookie() {
  document.cookie = 'pws_cookie_consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax';
}

// Usage in tests:
// beforeEach(() => {
//   mockConsentState({ analytics: true, marketing: false });
// });
//
// afterEach(() => {
//   clearConsentCookie();
// });
