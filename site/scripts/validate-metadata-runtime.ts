/**
 * Runtime metadata validation
 * This module can be imported to validate metadata objects at runtime
 */

import { validateMetadata, validateSiteUrl } from '../src/lib/metadata/validator';
import type { Metadata } from 'next';

/**
 * Validate metadata and throw if invalid in production
 * In development, only log warnings
 */
export function assertValidMetadata(metadata: Metadata, pagePath: string): void {
  // First validate SITE_URL
  const siteUrlResult = validateSiteUrl();
  if (!siteUrlResult.valid) {
    const message = `SITE_URL validation failed:\n${siteUrlResult.errors.join('\n')}`;
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error(message);
    } else {
      console.warn(`⚠️ ${message}`);
    }
  }
  
  // Then validate metadata
  const result = validateMetadata(metadata, pagePath);
  
  if (!result.valid) {
    const message = `Metadata validation failed for ${pagePath}:\n${result.errors.join('\n')}`;
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error(message);
    } else {
      console.warn(`⚠️ ${message}`);
    }
  }
  
  // Log warnings in development
  if (process.env.NODE_ENV !== 'production' && result.warnings.length > 0) {
    console.warn(`⚠️ Metadata warnings for ${pagePath}:\n${result.warnings.join('\n')}`);
  }
}
