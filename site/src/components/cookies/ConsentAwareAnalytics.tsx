/**
 * Consent-Aware Analytics Loader
 * Loads analytics scripts only after explicit user consent
 * Provides head-safe injector for privacy-first tracking
 */

'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useCookieConsent } from './useCookieConsent';

interface ConsentAwareAnalyticsProps {
  plausibleDomain?: string;
  nonce?: string;
}

export default function ConsentAwareAnalytics({
  plausibleDomain,
  nonce,
}: ConsentAwareAnalyticsProps) {
  const { hasConsentFor } = useCookieConsent();
  const [loadAnalytics, setLoadAnalytics] = useState(false);

  useEffect(() => {
    // Check consent on mount
    const shouldLoad = hasConsentFor('analytics');
    setLoadAnalytics(shouldLoad);

    // Listen for consent changes
    const handleConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent<{
        consent: { analytics: boolean };
      }>;
      
      if (customEvent.detail?.consent?.analytics) {
        setLoadAnalytics(true);
      } else {
        setLoadAnalytics(false);
        
        // Clean up analytics if consent is revoked
        if (typeof window !== 'undefined') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((window as any).plausible) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete (window as any).plausible;
          }
        }
      }
    };

    window.addEventListener('cookieConsentChange', handleConsentChange);
    
    return () => {
      window.removeEventListener('cookieConsentChange', handleConsentChange);
    };
  }, [hasConsentFor]);

  // Don't load analytics if no consent
  if (!loadAnalytics) {
    return null;
  }

  return (
    <>
      {plausibleDomain && (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
          nonce={nonce}
        />
      )}
    </>
  );
}
