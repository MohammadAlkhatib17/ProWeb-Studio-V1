/**
 * Cookie Consent Hook
 * React hook for managing cookie consent state and preferences
 * SSR-safe with synchronous initial state
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ConsentState } from './types';
import { DEFAULT_CONSENT } from './types';
import {
  getStoredConsent,
  saveConsent,
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
 * Initial state is synchronous to prevent banner flashing
 */
export function useCookieConsent(): UseCookieConsentReturn {
  // Synchronous initial state - reads consent immediately on client
  const [state, setState] = useState(() => {
    // SSR path: return safe defaults
    if (typeof document === 'undefined') {
      return {
        consent: DEFAULT_CONSENT,
        showBanner: false,
        showSettings: false,
      };
    }
    
    // Client path: read stored consent synchronously
    const stored = getStoredConsent();
    return {
      consent: stored?.consent ?? DEFAULT_CONSENT,
      showBanner: !stored,
      showSettings: false,
    };
  });

  // Reconcile state if cookie changes externally (e.g., from another tab)
  useEffect(() => {
    const checkConsent = () => {
      const stored = getStoredConsent();
      const newConsent = stored?.consent ?? DEFAULT_CONSENT;
      const shouldShow = !stored;
      
      setState((prev) => {
        // Only update if consent or banner state actually changed
        if (
          JSON.stringify(prev.consent) !== JSON.stringify(newConsent) ||
          prev.showBanner !== shouldShow
        ) {
          return {
            ...prev,
            consent: newConsent,
            showBanner: shouldShow,
          };
        }
        return prev;
      });
    };

    // Listen for storage events (cross-tab sync)
    window.addEventListener('storage', checkConsent);
    
    return () => {
      window.removeEventListener('storage', checkConsent);
    };
  }, []);

  /**
   * Check if user has consent for specific category
   */
  const hasConsentFor = useCallback(
    (category: keyof ConsentState): boolean => {
      return hasConsent(category);
    },
    []
  );

  /**
   * Update consent preferences
   * Enforces necessary=true and persists to cookie
   */
  const updateConsent = useCallback((newConsent: Partial<ConsentState>) => {
    setState((prev) => {
      const updated: ConsentState = {
        ...prev.consent,
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
      
      return {
        consent: updated,
        showBanner: false,
        showSettings: false,
      };
    });
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
    setState((prev) => ({
      ...prev,
      showSettings: true,
      showBanner: false,
    }));
  }, []);

  /**
   * Close settings modal
   */
  const closeSettings = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showSettings: false,
    }));
  }, []);

  /**
   * Close banner without saving (no-op if no consent exists)
   */
  const closeBanner = useCallback(() => {
    const stored = getStoredConsent();
    if (stored) {
      setState((prev) => ({
        ...prev,
        showBanner: false,
      }));
    }
  }, []);

  return {
    consent: state.consent,
    showBanner: state.showBanner,
    showSettings: state.showSettings,
    hasConsentFor,
    updateConsent,
    acceptAll,
    rejectAll,
    openSettings,
    closeSettings,
    closeBanner,
  };
}
