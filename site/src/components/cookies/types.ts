/**
 * Cookie Consent Types
 * Type definitions for privacy-first cookie consent management
 */

export type ConsentCategory = 'necessary' | 'analytics' | 'marketing';

export interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface ConsentData {
  version: number;
  timestamp: number;
  consent: ConsentState;
}

export const CONSENT_COOKIE_NAME = 'pws_cookie_consent';
export const CONSENT_VERSION = 1;
export const CONSENT_EXPIRY_DAYS = 180;

export const DEFAULT_CONSENT: ConsentState = {
  necessary: true, // Always true, cannot be disabled
  analytics: false,
  marketing: false,
};
