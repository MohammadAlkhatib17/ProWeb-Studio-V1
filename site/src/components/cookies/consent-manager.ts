/**
 * Privacy-first cookie consent management
 * Implements secure storage with sameSite=strict and 180-day expiry
 */

export interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

export const CONSENT_COOKIE_NAME = 'cookie-consent-prefs';
export const CONSENT_VERSION = '1.0';

/**
 * Default consent preferences (only necessary cookies allowed by default)
 */
export const defaultConsent: ConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  timestamp: Date.now(),
};

/**
 * Set consent preferences in secure cookie
 */
export const setConsentPreferences = (preferences: Omit<ConsentPreferences, 'timestamp'>): void => {
  if (typeof window === 'undefined') return;

  const consentData: ConsentPreferences = {
    ...preferences,
    timestamp: Date.now(),
  };

  // Store as secure, sameSite=strict cookie with 180-day expiry
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 180);

  const cookieValue = JSON.stringify(consentData);
  
  document.cookie = [
    `${CONSENT_COOKIE_NAME}=${encodeURIComponent(cookieValue)}`,
    `expires=${expiryDate.toUTCString()}`,
    'path=/',
    'sameSite=strict',
    process.env.NODE_ENV === 'production' ? 'secure' : '',
  ].filter(Boolean).join('; ');

  // Update global consent flags for immediate access
  updateGlobalConsentFlags(consentData);
  
  // Dispatch custom event for components to react to consent changes
  window.dispatchEvent(new CustomEvent('consentChanged', { 
    detail: consentData 
  }));

  if (process.env.NODE_ENV !== 'production') {
    console.log('Cookie consent preferences saved:', consentData);
  }
};

/**
 * Get consent preferences from cookie
 */
export const getConsentPreferences = (): ConsentPreferences => {
  if (typeof window === 'undefined') {
    return defaultConsent;
  }

  try {
    const cookies = document.cookie.split(';');
    const consentCookie = cookies.find(cookie => 
      cookie.trim().startsWith(`${CONSENT_COOKIE_NAME}=`)
    );

    if (!consentCookie) {
      return defaultConsent;
    }

    const cookieValue = decodeURIComponent(
      consentCookie.split('=')[1]
    );
    
    const preferences = JSON.parse(cookieValue) as ConsentPreferences;
    
    // Validate the structure and ensure necessary is always true
    if (typeof preferences === 'object' && 
        typeof preferences.necessary === 'boolean' &&
        typeof preferences.analytics === 'boolean' &&
        typeof preferences.marketing === 'boolean' &&
        typeof preferences.timestamp === 'number') {
      return {
        ...preferences,
        necessary: true, // Always enforce necessary cookies
      };
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Failed to parse consent cookie:', error);
    }
  }

  return defaultConsent;
};

/**
 * Check if user has made a consent choice
 */
export const hasConsentChoice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const cookies = document.cookie.split(';');
  return cookies.some(cookie => 
    cookie.trim().startsWith(`${CONSENT_COOKIE_NAME}=`)
  );
};

/**
 * Update global consent flags for immediate access by analytics utilities
 */
export const updateGlobalConsentFlags = (preferences: ConsentPreferences): void => {
  if (typeof window === 'undefined') return;

  // Set flags that ga.ts and other utilities can check
  (window as unknown as Record<string, unknown>).__CONSENT_ANALYTICS__ = preferences.analytics;
  (window as unknown as Record<string, unknown>).__CONSENT_MARKETING__ = preferences.marketing;
  (window as unknown as Record<string, unknown>).__CONSENT_NECESSARY__ = preferences.necessary;
  (window as unknown as Record<string, unknown>).__CONSENT_TIMESTAMP__ = preferences.timestamp;
};

/**
 * Initialize consent system - call this on app startup
 */
export const initializeConsent = (): ConsentPreferences => {
  const preferences = getConsentPreferences();
  updateGlobalConsentFlags(preferences);
  return preferences;
};

/**
 * Clear all consent preferences (for testing or reset)
 */
export const clearConsentPreferences = (): void => {
  if (typeof window === 'undefined') return;

  document.cookie = [
    `${CONSENT_COOKIE_NAME}=`,
    'expires=Thu, 01 Jan 1970 00:00:00 GMT',
    'path=/',
    'sameSite=strict',
  ].join('; ');

  // Reset global flags
  updateGlobalConsentFlags(defaultConsent);
  
  // Dispatch event
  window.dispatchEvent(new CustomEvent('consentChanged', { 
    detail: defaultConsent 
  }));
};

/**
 * Check if analytics consent is granted (for backward compatibility with ga.ts)
 */
export const hasAnalyticsConsent = (): boolean => {
  if (typeof window === 'undefined') return false;
  return getConsentPreferences().analytics;
};

/**
 * Check if marketing consent is granted
 */
export const hasMarketingConsent = (): boolean => {
  if (typeof window === 'undefined') return false;
  return getConsentPreferences().marketing;
};