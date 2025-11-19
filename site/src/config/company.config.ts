/**
 * Company Information Configuration
 * 
 * Centralized, environment-backed configuration for all company identity
 * and NAP (Name, Address, Phone) data. This ensures consistent company
 * information across all UI components and structured data (JSON-LD).
 * 
 * IMPORTANT:
 * - All data comes from environment variables - NO hardcoded placeholders
 * - Address fields are only populated when ALL address env vars are present
 * - Missing env vars result in undefined/null values, NOT placeholder strings
 * - Components should handle missing data gracefully (hide fields vs show placeholders)
 */

import { siteConfig } from '@/config/site.config';

/**
 * Address information (optional)
 * Only populated when ALL address environment variables are present.
 * Used for businesses with a physical office location.
 */
interface CompanyAddress {
  street: string;
  zip: string;
  city: string;
  region: string;
  country: string;
}

/**
 * Check if all required address environment variables are present
 * Returns true only if we have a complete postal address
 */
function hasCompleteAddress(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_ADDR_STREET &&
    process.env.NEXT_PUBLIC_ADDR_ZIP &&
    process.env.NEXT_PUBLIC_ADDR_CITY &&
    process.env.NEXT_PUBLIC_ADDR_REGION
  );
}

/**
 * Get complete address object if all env vars are present
 * Returns null if any address component is missing
 */
function getAddress(): CompanyAddress | null {
  if (!hasCompleteAddress()) {
    return null;
  }

  return {
    street: process.env.NEXT_PUBLIC_ADDR_STREET!,
    zip: process.env.NEXT_PUBLIC_ADDR_ZIP!,
    city: process.env.NEXT_PUBLIC_ADDR_CITY!,
    region: process.env.NEXT_PUBLIC_ADDR_REGION!,
    country: 'Nederland',
  };
}

/**
 * Centralized company information
 * All values are derived from environment variables or siteConfig
 */
export const companyInfo = {
  /**
   * Legal business name
   */
  name: 'ProWeb Studio',
  legalName: 'ProWeb Studio',

  /**
   * KVK (Kamer van Koophandel) number
   * Required for Dutch businesses. Undefined if not set in env.
   */
  kvk: process.env.NEXT_PUBLIC_KVK || null,

  /**
   * BTW (VAT) number
   * Format: NL[9 digits]B[2 digits]. Undefined if not set in env.
   */
  vat: process.env.NEXT_PUBLIC_BTW || null,

  /**
   * Contact information (backed by siteConfig which uses env vars)
   */
  phone: siteConfig.phone,
  email: siteConfig.email,

  /**
   * Physical address (only present when all address env vars are set)
   * Null for online-only businesses or when address is not yet configured
   */
  address: getAddress(),

  /**
   * Opening hours for the business
   * Kept as company policy data (not env-backed)
   */
  openingHours: [
    { days: 'Maandag - Vrijdag', hours: '09:00 - 17:00' },
    { days: 'Weekend', hours: 'Op afspraak' },
  ] as const,

  /**
   * Service area for online/remote businesses
   * Used when no physical address is present
   */
  serviceArea: {
    country: 'Nederland',
    countryCode: 'NL',
    description: 'Diensten beschikbaar in heel Nederland',
  } as const,

  /**
   * Structured data helpers
   */
  schema: {
    /**
     * Opening hours in Schema.org format
     */
    openingHoursSpecification: ['Mo-Fr 09:00-17:00'] as const,

    /**
     * Get PostalAddress schema object (only when address exists)
     */
    getPostalAddress() {
      const addr = companyInfo.address;
      if (!addr) return null;

      return {
        '@type': 'PostalAddress' as const,
        streetAddress: addr.street,
        postalCode: addr.zip,
        addressLocality: addr.city,
        addressRegion: addr.region,
        addressCountry: 'NL',
      };
    },

    /**
     * Get service area schema (used for online-only businesses)
     */
    getServiceArea() {
      return {
        '@type': 'Country' as const,
        name: 'Nederland',
        sameAs: 'https://en.wikipedia.org/wiki/Netherlands',
      };
    },

    /**
     * Get area served schema (alternative format)
     */
    getAreaServed() {
      return {
        '@type': 'AdministrativeArea' as const,
        name: 'Netherlands',
      };
    },
  },
} as const;

/**
 * Type exports for component props
 */
export type CompanyInfo = typeof companyInfo;
export type { CompanyAddress };
