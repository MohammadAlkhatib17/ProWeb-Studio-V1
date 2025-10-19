/**
 * Centralized metadata system for Dutch-first website
 * 
 * This module provides:
 * - Dutch metadata defaults (titles, descriptions, keywords)
 * - Metadata generation utilities
 * - JSON-LD structured data helpers
 * - Hreflang link generation
 * 
 * Usage:
 * ```ts
 * import { generatePageMetadata } from '@/lib/metadata';
 * 
 * export const metadata = generatePageMetadata('home');
 * ```
 */

export {
  SITE_URL,
  dutchMetadataDefaults,
  defaultDutchKeywords,
  dutchPageMetadata,
  getPageMetadata,
  mergeWithDefaultKeywords,
} from './defaults';

export {
  generateMetadata,
  generatePageMetadata,
  generateHreflangLinks,
  type MetadataOptions,
} from './generator';

export {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateWebPageSchema,
  generateBreadcrumbSchema,
  generateServiceSchema,
  generateFAQSchema,
  generateLocalBusinessSchema,
  generateServiceListSchema,
} from './structured-data';
