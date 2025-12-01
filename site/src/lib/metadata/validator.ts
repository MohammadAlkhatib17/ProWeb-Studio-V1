/**
 * Metadata validation utilities
 * Ensures all pages have correct nl-NL locale, canonical URLs, and hreflang tags
 */

import { SITE_URL, dutchMetadataDefaults } from './defaults';

import type { Metadata } from 'next';

export interface MetadataValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate that metadata contains required Dutch locale information
 */
export function validateMetadata(
  metadata: Metadata,
  pagePath: string
): MetadataValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check canonical URL
  const canonicalUrl = `${SITE_URL}${pagePath}`;
  if (!metadata.alternates?.canonical) {
    errors.push(`Missing canonical URL for ${pagePath}`);
  } else if (metadata.alternates.canonical !== canonicalUrl) {
    errors.push(
      `Incorrect canonical URL: expected "${canonicalUrl}", got "${metadata.alternates.canonical}"`
    );
  }

  // Check hreflang tags
  const languages = metadata.alternates?.languages;
  if (!languages) {
    errors.push(`Missing hreflang tags for ${pagePath}`);
  } else {
    // Must have nl-NL
    if (!languages['nl-NL']) {
      errors.push(`Missing hreflang="nl-NL" for ${pagePath}`);
    }
    
    // Must have nl
    if (!languages['nl']) {
      errors.push(`Missing hreflang="nl" for ${pagePath}`);
    }
    
    // Must have x-default
    if (!languages['x-default']) {
      errors.push(`Missing hreflang="x-default" for ${pagePath}`);
    }

    // All should point to canonical URL
    Object.entries(languages).forEach(([lang, url]) => {
      if (url !== canonicalUrl) {
        warnings.push(
          `hreflang="${lang}" points to "${url}" instead of canonical "${canonicalUrl}"`
        );
      }
    });
  }

  // Check OpenGraph locale
  if (!metadata.openGraph?.locale) {
    errors.push(`Missing og:locale for ${pagePath}`);
  } else if (metadata.openGraph.locale !== dutchMetadataDefaults.locale) {
    errors.push(
      `Incorrect og:locale: expected "${dutchMetadataDefaults.locale}", got "${metadata.openGraph.locale}"`
    );
  }

  // Check OpenGraph URL
  if (!metadata.openGraph?.url) {
    errors.push(`Missing og:url for ${pagePath}`);
  } else if (metadata.openGraph.url !== canonicalUrl) {
    errors.push(
      `Incorrect og:url: expected "${canonicalUrl}", got "${metadata.openGraph.url}"`
    );
  }

  // Check title
  if (!metadata.title) {
    errors.push(`Missing title for ${pagePath}`);
  }

  // Check description
  if (!metadata.description) {
    errors.push(`Missing description for ${pagePath}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Extract page path from file path
 */
export function getPagePathFromFilePath(filePath: string): string {
  // Convert file path to URL path
  // e.g., /src/app/diensten/page.tsx -> /diensten
  // e.g., /src/app/page.tsx -> /
  
  const match = filePath.match(/\/app\/(.*)\/page\.tsx$/);
  if (!match) {
    return '/';
  }
  
  const path = match[1];
  return path === '' ? '/' : `/${path}`;
}

/**
 * Check if SITE_URL is properly configured
 */
export function validateSiteUrl(): MetadataValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!SITE_URL) {
    errors.push(
      'SITE_URL is not configured. Set SITE_URL or NEXT_PUBLIC_SITE_URL in environment variables.'
    );
  } else if (SITE_URL.includes('localhost') && process.env.NODE_ENV === 'production') {
    errors.push(
      `SITE_URL points to localhost in production: "${SITE_URL}". This will cause incorrect canonical URLs.`
    );
  } else if (!SITE_URL.startsWith('https://') && process.env.NODE_ENV === 'production') {
    warnings.push(
      `SITE_URL should use HTTPS in production: "${SITE_URL}"`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
