/**
 * Cookie Consent Hook
 * React hook for managing cookie consent state and preferences
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ConsentState } from './types';
import {
  getCurrentConsent,
  saveConsent,
  shouldShowBanner,
  hasConsent,
} from './cookie-utils';

interface UseCookieConsentReturn {
  consent: ConsentState;
  showBanner: boolean;
  showSettings: boolean;
  hasConsentFor: (category: keyof ConsentState) => boolean;
  updateConsent: (newConsent: Partial<ConsentState>) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  closeBanner: () => void;
}

/**
 * Custom hook for cookie consent management
 * Provides state and methods for managing user privacy preferences
 */
export function useCookieConsent(): UseCookieConsentReturn {
  const [consent, setConsent] = useState<ConsentState>(getCurrentConsent());
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize on mount
  useEffect(() => {
    setMounted(true);
    const shouldShow = shouldShowBanner();
    setShowBanner(shouldShow);
    setConsent(getCurrentConsent());
  }, []);

  /**
   * Check if user has consent for specific category
   */
  const hasConsentFor = useCallback(
    (category: keyof ConsentState): boolean => {
      if (!mounted) return false;
      return hasConsent(category);
    },
    [mounted]
  );

  /**
   * Update consent preferences
   */
  const updateConsent = useCallback((newConsent: Partial<ConsentState>) => {
    setConsent((prev) => {
      const updated = {
        ...prev,
        ...newConsent,
        necessary: true, // Always enforce necessary
      };
      saveConsent(updated);
      
      // Trigger custom event for analytics loaders
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('cookieConsentChange', {
            detail: { consent: updated },
          })
        );
      }
      
      return updated;
    });
    setShowBanner(false);
    setShowSettings(false);
  }, []);

  /**
   * Accept all cookies
   */
  const acceptAll = useCallback(() => {
    updateConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  }, [updateConsent]);

  /**
   * Reject all optional cookies
   */
  const rejectAll = useCallback(() => {
    updateConsent({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  }, [updateConsent]);

  /**
   * Open settings modal
   */
  const openSettings = useCallback(() => {
    setShowSettings(true);
    setShowBanner(false);
  }, []);

  /**
   * Close settings modal
   */
  const closeSettings = useCallback(() => {
    setShowSettings(false);
  }, []);

  /**
   * Close banner without saving (only if consent exists)
   */
  const closeBanner = useCallback(() => {
    if (!shouldShowBanner()) {
      setShowBanner(false);
    }
  }, []);

  return {
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
  };
}
