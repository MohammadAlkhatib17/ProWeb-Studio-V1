/**
 * URL utility functions for consistent site URL management
 * 
 * Centralizes SITE_URL handling to eliminate duplicate patterns
 * across metadata files and API routes.
 * 
 * @module lib/utils/url
 */

/**
 * Get the canonical site URL
 * 
 * Priority:
 * 1. NEXT_PUBLIC_SITE_URL (public, available in browser)
 * 2. SITE_URL (server-side only)
 * 3. Fallback to production URL
 * 
 * @returns The canonical site URL without trailing slash
 * 
 * @example
 * ```ts
 * import { getSiteURL } from '@/lib/utils/url';
 * 
 * const siteUrl = getSiteURL();
 * // => "https://prowebstudio.nl"
 * ```
 */
export function getSiteURL(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    'https://prowebstudio.nl';

  // Remove trailing slash for consistency
  return url.replace(/\/$/, '');
}

/**
 * Create an absolute URL from a path
 * 
 * Combines the site URL with a given path, handling leading slashes automatically.
 * 
 * @param path - The path (with or without leading slash)
 * @returns The absolute URL
 * 
 * @example
 * ```ts
 * import { getAbsoluteURL } from '@/lib/utils/url';
 * 
 * getAbsoluteURL('/about');
 * // => "https://prowebstudio.nl/about"
 * 
 * getAbsoluteURL('diensten/webdesign');
 * // => "https://prowebstudio.nl/diensten/webdesign"
 * ```
 */
export function getAbsoluteURL(path: string): string {
  const baseURL = getSiteURL();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseURL}${cleanPath}`;
}

/**
 * Get the base URL for OpenGraph images
 * 
 * Used for og:image and twitter:image metadata.
 * 
 * @returns The base URL for OG images
 * 
 * @example
 * ```ts
 * import { getOGImageURL } from '@/lib/utils/url';
 * 
 * const ogImageUrl = getOGImageURL();
 * // => "https://prowebstudio.nl/api/og"
 * ```
 */
export function getOGImageURL(): string {
  return getAbsoluteURL('/api/og');
}

/**
 * Check if the current environment is production
 * 
 * @returns True if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if the current environment is development
 * 
 * @returns True if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Get the current environment name
 * 
 * @returns The environment name (production, development, test)
 */
export function getEnvironment(): string {
  return process.env.NODE_ENV || 'development';
}

/**
 * Validate if a URL is from the same site
 * 
 * @param url - The URL to validate
 * @returns True if the URL is from the same site
 * 
 * @example
 * ```ts
 * import { isSameSiteURL } from '@/lib/utils/url';
 * 
 * isSameSiteURL('https://prowebstudio.nl/about');
 * // => true
 * 
 * isSameSiteURL('https://example.com');
 * // => false
 * ```
 */
export function isSameSiteURL(url: string): boolean {
  try {
    const siteUrl = getSiteURL();
    const testUrl = new URL(url, siteUrl);
    const baseSite = new URL(siteUrl);
    
    return testUrl.hostname === baseSite.hostname;
  } catch {
    return false;
  }
}

/**
 * Normalize a URL by removing trailing slashes and fragments
 * 
 * @param url - The URL to normalize
 * @returns The normalized URL
 * 
 * @example
 * ```ts
 * import { normalizeURL } from '@/lib/utils/url';
 * 
 * normalizeURL('https://prowebstudio.nl/about/');
 * // => "https://prowebstudio.nl/about"
 * 
 * normalizeURL('/diensten/#contact');
 * // => "/diensten"
 * ```
 */
export function normalizeURL(url: string): string {
  // Remove fragment identifier first
  const hashIndex = url.indexOf('#');
  let normalized = hashIndex !== -1 ? url.substring(0, hashIndex) : url;
  
  // Remove trailing slash
  normalized = normalized.replace(/\/$/, '');
  
  return normalized;
}
