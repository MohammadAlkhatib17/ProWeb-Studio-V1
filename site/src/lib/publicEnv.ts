/**
 * Public Environment Variables
 * 
 * Centralized access to NEXT_PUBLIC_ environment variables that are safe to use
 * in client-side code. All variables here are publicly exposed to the browser.
 * 
 * Server-side variables should never be accessed directly in client code.
 */

export const publicEnv = {
  // Core Site Configuration
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'ProWeb Studio',
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || 'https://prowebstudio.nl').replace(/\/+$/, ''),
  contactInbox: process.env.NEXT_PUBLIC_CONTACT_INBOX || 'contact@prowebstudio.nl',
  
  // Analytics & Integrations
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'prowebstudio.nl',
  calcomUrl: process.env.NEXT_PUBLIC_CALCOM_URL || 'https://cal.com/prowebstudio',
  
  // Security & Verification
  recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
  googleSiteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  bingSiteVerification: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '',
  
  // Performance Monitoring
  webVitalsEnabled: (process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS ?? 'false') === 'true',
  
  // Dutch Business Information
  kvkNumber: process.env.NEXT_PUBLIC_KVK || '',
  btwNumber: process.env.NEXT_PUBLIC_BTW || '',
  
  // Advanced Business Information (Optional)
  dunsNumber: process.env.NEXT_PUBLIC_DUNS || '',
  rsinNumber: process.env.NEXT_PUBLIC_RSIN || '',
  kvkPlace: process.env.NEXT_PUBLIC_KVK_PLACE || '',
  vestigingsNumber: process.env.NEXT_PUBLIC_VESTIGINGSNUMMER || '',
  sbiCode: process.env.NEXT_PUBLIC_SBI_CODE || '62010',
  ibanNumber: process.env.NEXT_PUBLIC_IBAN || '',
  
  // Google Business Information
  googlePlaceId: process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || '',
  googleBusinessUrl: process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL || '',
  
  // Business Address (Optional)
  addressStreet: process.env.NEXT_PUBLIC_ADDR_STREET || '',
  addressCity: process.env.NEXT_PUBLIC_ADDR_CITY || '',
  addressZip: process.env.NEXT_PUBLIC_ADDR_ZIP || '',
  addressRegion: process.env.NEXT_PUBLIC_ADDR_REGION || 'NH',
  
  // Social Media Profiles
  socialLinkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || '',
  socialGithub: process.env.NEXT_PUBLIC_SOCIAL_GITHUB || '',
  socialTwitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER || '',
  socialBehance: process.env.NEXT_PUBLIC_SOCIAL_BEHANCE || '',
  socialDribbble: process.env.NEXT_PUBLIC_SOCIAL_DRIBBBLE || '',
  socialYoutube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || '',
  socialFacebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || '',
  socialInstagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || '',
} as const;

/**
 * Type-safe access to public environment variables
 */
export type PublicEnv = typeof publicEnv;

/**
 * Helper function to get a public environment variable with fallback
 */
export function getPublicEnv<K extends keyof PublicEnv>(
  key: K,
  fallback?: PublicEnv[K]
): PublicEnv[K] {
  return publicEnv[key] || fallback || ('' as PublicEnv[K]);
}