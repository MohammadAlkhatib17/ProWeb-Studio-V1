/**
 * Consent-Aware Analytics Loader
 * Loads analytics scripts only after explicit user consent
 * Provides head-safe injector for privacy-first tracking
 * Supports Plausible, Vercel Analytics, and Speed Insights
 */

'use client';

import { useEffect, useState } from 'react';

import Script from 'next/script';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { useCookieConsent } from './useCookieConsent';

interface ConsentAwareAnalyticsProps {
  plausibleDomain?: string;
  nonce?: string;
  enableVercelAnalytics?: boolean;
  enableSpeedInsights?: boolean;
}

export default function ConsentAwareAnalytics({
  plausibleDomain,
  nonce,
  enableVercelAnalytics = false,
  enableSpeedInsights = false,
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
          // Clean up Plausible
          if ('plausible' in window) {
            delete (window as unknown as Record<string, unknown>).plausible;
          }
          
          // Clean up Vercel Analytics
          if ('va' in window) {
            delete (window as unknown as Record<string, unknown>).va;
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
      {/* Plausible Analytics */}
      {plausibleDomain && (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
          nonce={nonce}
        />
      )}
      
      {/* Vercel Analytics */}
      {enableVercelAnalytics && <Analytics />}
      
      {/* Vercel Speed Insights */}
      {enableSpeedInsights && <SpeedInsights />}
    </>
  );
}
