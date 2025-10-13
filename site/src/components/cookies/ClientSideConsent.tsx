"use client";

import { useEffect } from 'react';
import { CookieConsentBanner } from '@/components/cookies';
import { initializeConsent } from '@/components/cookies/consent-manager';

export default function ClientSideConsent() {
  useEffect(() => {
    // Initialize consent system on client side only
    initializeConsent();
  }, []);

  return <CookieConsentBanner />;
}