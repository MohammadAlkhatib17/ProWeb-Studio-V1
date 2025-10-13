"use client";

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { siteConfig } from "@/config/site.config";
import { 
  hasAnalyticsConsent
} from '@/components/cookies/consent-manager';

interface ConditionalAnalyticsProps {
  nonce: string;
}

export default function ConditionalAnalytics({ nonce }: ConditionalAnalyticsProps) {
  const [analyticsConsent, setAnalyticsConsent] = useState(false);

  useEffect(() => {
    // Initial consent check
    const checkConsent = () => {
      setAnalyticsConsent(hasAnalyticsConsent());
    };

    checkConsent();

    // Listen for consent changes
    const handleConsentChange = () => {
      checkConsent();
    };

    window.addEventListener('consentChanged', handleConsentChange);

    return () => {
      window.removeEventListener('consentChanged', handleConsentChange);
    };
  }, []);

  return (
    <>
      {/* Only load Plausible if analytics consent is granted */}
      {analyticsConsent && (
        <Script
          defer
          data-domain={siteConfig.analytics.plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
          nonce={nonce}
        />
      )}
      
      {/* Only load Vercel Analytics if analytics consent is granted */}
      {analyticsConsent && <Analytics />}
      
      {/* Only load Speed Insights if analytics consent is granted */}
      {analyticsConsent && <SpeedInsights />}
      
      {/* Marketing scripts would go here if marketing consent is granted */}
      {/* marketingConsent && <MarketingScripts /> */}
    </>
  );
}