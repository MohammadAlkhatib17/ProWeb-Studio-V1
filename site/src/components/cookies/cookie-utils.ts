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
 */
export function setCookie(name: string, value: string, days: number): void {
  if (typeof document === 'undefined') return;
  
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  
  const expires = `expires=${date.toUTCString()}`;
  const sameSite = 'SameSite=Lax';
  const secure = window.location.protocol === 'https:' ? 'Secure' : '';
  const path = 'path=/';
  
  const cookieString = [
    `${name}=${value}`,
    expires,
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
 */
export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

/**
 * Get stored consent data
 */
export function getStoredConsent(): ConsentData | null {
  const cookieValue = getCookie(CONSENT_COOKIE_NAME);
  
  if (!cookieValue) return null;
  
  try {
    const parsed = JSON.parse(decodeURIComponent(cookieValue)) as ConsentData;
    
    // Validate structure
    if (
      typeof parsed.version === 'number' &&
      typeof parsed.timestamp === 'number' &&
      typeof parsed.consent === 'object'
    ) {
      return parsed;
    }
  } catch (error) {
    console.warn('Failed to parse consent cookie:', error);
  }
  
  return null;
}

/**
 * Save consent data to secure cookie
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
 */
export function hasConsent(category: keyof ConsentState): boolean {
  const stored = getStoredConsent();
  
  if (!stored) return category === 'necessary';
  
  return stored.consent[category] ?? (category === 'necessary');
}

/**
 * Check if consent banner should be shown
 */
export function shouldShowBanner(): boolean {
  return getStoredConsent() === null;
}

/**
 * Get current consent state or default
 */
export function getCurrentConsent(): ConsentState {
  const stored = getStoredConsent();
  return stored ? stored.consent : DEFAULT_CONSENT;
}
