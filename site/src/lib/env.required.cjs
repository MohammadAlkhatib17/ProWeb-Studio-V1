/* global module */
/**
 * CommonJS version of environment variable constants
 * This allows JavaScript scripts to import the shared constants using require()
 */

/**
 * Critical environment variables that MUST be set for production deployments
 * Build will fail if any of these are missing or contain placeholder values
 */
const CRITICAL_ENV_VARS = [
  'SITE_URL',
  'NEXT_PUBLIC_PLAUSIBLE_DOMAIN',
  'CONTACT_INBOX',
  'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
  'RECAPTCHA_SECRET_KEY'
];

/**
 * URL variables - at least one is required (used by env.server.ts)
 */
const URL_VARS = ['NEXT_PUBLIC_SITE_URL', 'SITE_URL'];

/**
 * Optional but recommended environment variables for full functionality
 * App will work without these but some features may be limited
 */
const RECOMMENDED_ENV_VARS = [
  'BREVO_SMTP_USER',
  'BREVO_SMTP_PASS',
  'BREVO_API_KEY',
  'BREVO_LIST_ID',
  'NEXT_PUBLIC_PLAUSIBLE_DOMAIN',
  'SITE_NAME',
  'NEXT_PUBLIC_CALCOM_URL',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
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
const OPTIONAL_ENV_VARS = [
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
  'NEXT_PUBLIC_SOCIAL_INSTAGRAM'
];

/**
 * Development and build-time environment variables
 * These are used for tooling and development features
 */
const DEVELOPMENT_ENV_VARS = [
  'NEXT_PUBLIC_ENABLE_WEB_VITALS',
  'ANALYZE',
  'NEXT_PHASE',
  'VERCEL_REGION'
];

/**
 * Known placeholder values that should be rejected in production
 * Used for build-time validation to ensure real values are configured
 */
const PLACEHOLDER_VALUES = [
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

module.exports = {
  CRITICAL_ENV_VARS,
  URL_VARS,
  RECOMMENDED_ENV_VARS,
  OPTIONAL_ENV_VARS,
  DEVELOPMENT_ENV_VARS,
  PLACEHOLDER_VALUES
};