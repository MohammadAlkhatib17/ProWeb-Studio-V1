/**
 * HTML Sanitization Utility
 * 
 * Provides both server-side (SSR) and client-side HTML sanitization using DOMPurify.
 * This prevents XSS attacks when rendering user-provided HTML content.
 */

import DOMPurify from 'isomorphic-dompurify';

import type { Config } from 'dompurify';

// Default configuration for sanitization
const defaultConfig: Config = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'
  ],
  ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.-]+(?:[^a-z+.:-]|$))/i,
  ALLOW_DATA_ATTR: false,
  ALLOW_UNKNOWN_PROTOCOLS: false,
  SAFE_FOR_TEMPLATES: true,
  KEEP_CONTENT: true,
  RETURN_TRUSTED_TYPE: false,
};

// Strict configuration for sanitization (removes all HTML tags)
const strictConfig: Config = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
  KEEP_CONTENT: true,
  RETURN_TRUSTED_TYPE: false,
};

/**
 * Sanitize HTML content to prevent XSS attacks
 * 
 * @param dirty - The potentially unsafe HTML string
 * @param config - Optional DOMPurify configuration (defaults to safe HTML tags)
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(
  dirty: string,
  config: Config = defaultConfig
): string {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  const sanitized = DOMPurify.sanitize(dirty, config);
  return typeof sanitized === 'string' ? sanitized : String(sanitized);
}

/**
 * Sanitize HTML content with strict settings (removes all HTML tags)
 * Use this for content that should not contain any HTML markup
 * 
 * @param dirty - The potentially unsafe HTML string
 * @returns Plain text with all HTML tags removed
 */
export function sanitizeText(dirty: string): string {
  return sanitizeHtml(dirty, strictConfig);
}

/**
 * Sanitize URL to prevent javascript: and data: protocols
 * 
 * @param url - The potentially unsafe URL string
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  const trimmed = url.trim().toLowerCase();

  // Block dangerous protocols
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:') ||
    trimmed.startsWith('file:')
  ) {
    return '';
  }

  return url.trim();
}

/**
 * Sanitize user input for safe display
 * This is a convenience function that combines text sanitization with additional checks
 * 
 * @param input - The user input string
 * @param maxLength - Optional maximum length (defaults to 10000)
 * @returns Sanitized text
 */
export function sanitizeUserInput(input: string, maxLength: number = 10000): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Truncate if too long
  const truncated = input.length > maxLength ? input.substring(0, maxLength) : input;

  // Remove all HTML tags and dangerous content
  return sanitizeText(truncated);
}

/**
 * Sanitize an object's string properties recursively
 * 
 * @param obj - The object to sanitize
 * @param sanitizer - The sanitization function to use (defaults to sanitizeText)
 * @returns New object with sanitized string properties
 */
export function sanitizeObject<T>(
  obj: T,
  sanitizer: (value: string) => string = sanitizeText
): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return sanitizer(obj) as T;
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  const sanitized = Array.isArray(obj) ? [] : {} as Record<string, unknown>;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (typeof value === 'string') {
        (sanitized as Record<string, unknown>)[key] = sanitizer(value);
      } else if (value && typeof value === 'object') {
        (sanitized as Record<string, unknown>)[key] = sanitizeObject(value, sanitizer);
      } else {
        (sanitized as Record<string, unknown>)[key] = value;
      }
    }
  }

  return sanitized as T;
}

/**
 * React hook-friendly sanitization function
 * Safe to use in React components for rendering user content
 * 
 * @param html - The HTML string to sanitize
 * @returns Object with __html property for dangerouslySetInnerHTML
 */
export function createSafeMarkup(html: string): { __html: string } {
  return {
    __html: sanitizeHtml(html),
  };
}

// Export DOMPurify instance for advanced usage
export { DOMPurify };
