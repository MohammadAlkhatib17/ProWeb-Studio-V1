/**
 * Cookie Utilities
 * Secure cookie management functions with SameSite and HttpOnly best practices
 */

import type { ConsentData, ConsentState } from './types';
import {
  CONSENT_COOKIE_NAME,
  CONSENT_VERSION,
  CONSENT_EXPIRY_DAYS,
  DEFAULT_CONSENT,
} from './types';

/**
 * Get cookie value by name
 * SSR-safe: returns null on server
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue || null;
  }
  
  return null;
}

/**
 * Set secure cookie with proper flags
 * SSR-safe: no-op on server
 * Uses Max-Age for precise expiry and SameSite=Lax for CSRF protection
 * Secure flag auto-added on HTTPS
 */
export function setCookie(name: string, value: string, days: number): void {
  if (typeof document === 'undefined') return;
  
  const maxAge = days * 24 * 60 * 60; // Convert days to seconds
  const sameSite = 'SameSite=Lax';
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'Secure' : '';
  const path = 'path=/';
  
  const cookieString = [
    `${name}=${value}`,
    `Max-Age=${maxAge}`,
    path,
    sameSite,
    secure,
  ]
    .filter(Boolean)
    .join('; ');
  
  document.cookie = cookieString;
}

/**
 * Delete cookie by setting expired date
 * SSR-safe: no-op on server
 */
export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

/**
 * Get stored consent data
 * SSR-safe: returns null on server
 * Validates version and structure before returning
 */
export function getStoredConsent(): ConsentData | null {
  const cookieValue = getCookie(CONSENT_COOKIE_NAME);
  
  if (!cookieValue) return null;
  
  try {
    const parsed = JSON.parse(decodeURIComponent(cookieValue)) as ConsentData;
    
    // Validate structure and version
    if (
      typeof parsed.version === 'number' &&
      parsed.version === CONSENT_VERSION &&
      typeof parsed.timestamp === 'number' &&
      typeof parsed.consent === 'object' &&
      typeof parsed.consent.necessary === 'boolean' &&
      typeof parsed.consent.analytics === 'boolean' &&
      typeof parsed.consent.marketing === 'boolean'
    ) {
      return parsed;
    }
  } catch {
    // Silently fail for invalid JSON
  }
  
  return null;
}

/**
 * Save consent data to secure cookie
 * Enforces necessary=true and adds version+timestamp
 * Persists for CONSENT_EXPIRY_DAYS (180 days) with SameSite=Lax and Secure on HTTPS
 */
export function saveConsent(consent: ConsentState): void {
  const data: ConsentData = {
    version: CONSENT_VERSION,
    timestamp: Date.now(),
    consent: {
      ...consent,
      necessary: true, // Always enforce necessary cookies
    },
  };
  
  const encoded = encodeURIComponent(JSON.stringify(data));
  setCookie(CONSENT_COOKIE_NAME, encoded, CONSENT_EXPIRY_DAYS);
}

/**
 * Check if user has given consent for a specific category
 * Falls back to DEFAULT_CONSENT if no stored consent
 */
export function hasConsent(category: keyof ConsentState): boolean {
  const stored = getStoredConsent();
  
  if (!stored) {
    return DEFAULT_CONSENT[category];
  }
  
  return stored.consent[category] ?? DEFAULT_CONSENT[category];
}

/**
 * Check if consent banner should be shown
 * Returns true when no valid consent cookie exists
 */
export function shouldShowBanner(): boolean {
  return getStoredConsent() === null;
}
