/**
 * Canonical list of environment variables required for production
 * This module serves as the single source of truth for environment variable requirements
 * across build-time validation, runtime validation, and configuration scripts.
 */

/**
 * Critical environment variables that MUST be set for production deployments
 * Build will fail if any of these are missing or contain placeholder values
 */
export const CRITICAL_ENV_VARS = [
  'SITE_URL',
  'NEXT_PUBLIC_PLAUSIBLE_DOMAIN', 
  'CONTACT_INBOX',
  'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
  'RECAPTCHA_SECRET_KEY'
];

/**
 * Environment variables grouped by functional category for better error messaging
 */
export const ENV_VAR_GROUPS = {
  analytics: {
    name: 'Analytics',
    description: 'Web analytics and tracking configuration',
    variables: ['NEXT_PUBLIC_PLAUSIBLE_DOMAIN'],
    guidance: 'Set up Plausible analytics domain. Example: your-domain.com'
  },
  contact: {
    name: 'Contact',
    description: 'Contact form and email configuration',
    variables: ['CONTACT_INBOX'],
    guidance: 'Configure contact form destination email. Example: contact@yourdomain.com'
  },
  recaptcha: {
    name: 'reCAPTCHA',
    description: 'Google reCAPTCHA spam protection',
    variables: ['NEXT_PUBLIC_RECAPTCHA_SITE_KEY', 'RECAPTCHA_SECRET_KEY'],
    guidance: 'Get keys from Google reCAPTCHA console: https://www.google.com/recaptcha/admin'
  },
  address: {
    name: 'Site Configuration',
    description: 'Primary site URL and domain settings',
    variables: ['SITE_URL'],
    guidance: 'Set your production domain. Example: https://yourdomain.com'
  },
  rateLimit: {
    name: 'Rate Limiting',
    description: 'Upstash Redis configuration for API rate limiting',
    variables: ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'],
    guidance: 'Get credentials from Upstash Redis console: https://console.upstash.com/'
  }
};

/**
 * URL variables - at least one is required (used by env.server.ts)
 */
export const URL_VARS = ['NEXT_PUBLIC_SITE_URL', 'SITE_URL'];

/**
 * Optional but recommended environment variables for full functionality
 * App will work without these but some features may be limited
 */
export const RECOMMENDED_ENV_VARS = [
  'BREVO_SMTP_USER',
  'BREVO_SMTP_PASS',
  'BREVO_API_KEY',
  'BREVO_LIST_ID',
  'NEXT_PUBLIC_PLAUSIBLE_DOMAIN',
  'SITE_NAME',
  'NEXT_PUBLIC_CALCOM_URL',
  // Additional schema and SEO enhancement variables
  'NEXT_PUBLIC_GOOGLE_PLACE_ID',
  'NEXT_PUBLIC_GOOGLE_BUSINESS_URL',
  'NEXT_PUBLIC_DUNS',
  'NEXT_PUBLIC_RSIN',
  'NEXT_PUBLIC_KVK_PLACE',
  'NEXT_PUBLIC_VESTIGINGSNUMMER',
  'NEXT_PUBLIC_SBI_CODE',
  // Analytics and performance monitoring
  'NEXT_PUBLIC_GA_MEASUREMENT_ID',
  'NEXT_PUBLIC_VITALS_SAMPLE',
  // Search engine verification
  'GOOGLE_SITE_VERIFICATION'
];

/**
 * Optional environment variables for legal/business information
 * These are used for display purposes only
 */
export const OPTIONAL_ENV_VARS = [
  'NEXT_PUBLIC_KVK',
  'NEXT_PUBLIC_BTW',
  'NEXT_PUBLIC_ADDR_STREET',
  'NEXT_PUBLIC_ADDR_CITY',
  'NEXT_PUBLIC_ADDR_ZIP',
  'NEXT_PUBLIC_ADDR_REGION',
  'NEXT_PUBLIC_IBAN',
  // Social media profiles
  'NEXT_PUBLIC_SOCIAL_LINKEDIN',
  'NEXT_PUBLIC_SOCIAL_GITHUB',
  'NEXT_PUBLIC_SOCIAL_TWITTER',
  'NEXT_PUBLIC_SOCIAL_BEHANCE',
  'NEXT_PUBLIC_SOCIAL_DRIBBBLE',
  'NEXT_PUBLIC_SOCIAL_YOUTUBE',
  'NEXT_PUBLIC_SOCIAL_FACEBOOK',
  'NEXT_PUBLIC_SOCIAL_INSTAGRAM',
  // Rate limiting (optional for development)
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN'
];

/**
 * Development and build-time environment variables
 * These are used for tooling and development features
 */
export const DEVELOPMENT_ENV_VARS = [
  'NEXT_PUBLIC_ENABLE_WEB_VITALS',
  'ANALYZE',
  'NEXT_PHASE',
  'VERCEL_REGION'
];

/**
 * Known placeholder values that should be rejected in production
 * Used for build-time validation to ensure real values are configured
 */
export const PLACEHOLDER_VALUES = [
  'your_site_url_here',
  'your_domain_here', 
  'your_email_here',
  'your_recaptcha_site_key_here',
  'your_recaptcha_secret_key_here',
  'placeholder',
  'example.com',
  'test@example.com',
  'localhost',
  'changeme',
  ''
];