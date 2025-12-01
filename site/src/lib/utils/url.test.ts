import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  getSiteURL,
  getAbsoluteURL,
  getOGImageURL,
  isProduction,
  isDevelopment,
  getEnvironment,
  isSameSiteURL,
  normalizeURL,
} from '@/lib/utils/url';

describe('URL Utilities', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment before each test
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore environment after each test
    process.env = originalEnv;
    vi.unstubAllEnvs();
  });

  describe('getSiteURL', () => {
    it('should return NEXT_PUBLIC_SITE_URL when set', () => {
      process.env.NEXT_PUBLIC_SITE_URL = 'https://test.example.com';
      expect(getSiteURL()).toBe('https://test.example.com');
    });

    it('should fallback to SITE_URL when NEXT_PUBLIC_SITE_URL is not set', () => {
      delete process.env.NEXT_PUBLIC_SITE_URL;
      process.env.SITE_URL = 'https://site.example.com';
      expect(getSiteURL()).toBe('https://site.example.com');
    });

    it('should fallback to production URL when no env vars set', () => {
      delete process.env.NEXT_PUBLIC_SITE_URL;
      delete process.env.SITE_URL;
      expect(getSiteURL()).toBe('https://prowebstudio.nl');
    });

    it('should remove trailing slash', () => {
      process.env.NEXT_PUBLIC_SITE_URL = 'https://test.example.com/';
      expect(getSiteURL()).toBe('https://test.example.com');
    });
  });

  describe('getAbsoluteURL', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_SITE_URL = 'https://test.example.com';
    });

    it('should create absolute URL with leading slash', () => {
      expect(getAbsoluteURL('/about')).toBe('https://test.example.com/about');
    });

    it('should create absolute URL without leading slash', () => {
      expect(getAbsoluteURL('diensten/webdesign')).toBe(
        'https://test.example.com/diensten/webdesign'
      );
    });

    it('should handle empty path', () => {
      expect(getAbsoluteURL('')).toBe('https://test.example.com/');
    });

    it('should handle root path', () => {
      expect(getAbsoluteURL('/')).toBe('https://test.example.com/');
    });
  });

  describe('getOGImageURL', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_SITE_URL = 'https://test.example.com';
    });

    it('should return OG image API URL', () => {
      expect(getOGImageURL()).toBe('https://test.example.com/api/og');
    });
  });

  describe('isProduction', () => {
    it('should return true when NODE_ENV is production', () => {
      vi.stubEnv('NODE_ENV', 'production');
      expect(isProduction()).toBe(true);
    });

    it('should return false when NODE_ENV is not production', () => {
      vi.stubEnv('NODE_ENV', 'development');
      expect(isProduction()).toBe(false);
    });
  });

  describe('isDevelopment', () => {
    it('should return true when NODE_ENV is development', () => {
      vi.stubEnv('NODE_ENV', 'development');
      expect(isDevelopment()).toBe(true);
    });

    it('should return false when NODE_ENV is not development', () => {
      vi.stubEnv('NODE_ENV', 'production');
      expect(isDevelopment()).toBe(false);
    });
  });

  describe('getEnvironment', () => {
    it('should return the current NODE_ENV', () => {
      vi.stubEnv('NODE_ENV', 'test');
      expect(getEnvironment()).toBe('test');
    });

    it('should return development as default', () => {
      vi.stubEnv('NODE_ENV', '');
      expect(getEnvironment()).toBe('development');
    });
  });

  describe('isSameSiteURL', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_SITE_URL = 'https://prowebstudio.nl';
    });

    it('should return true for same-site URL', () => {
      expect(isSameSiteURL('https://prowebstudio.nl/about')).toBe(true);
    });

    it('should return true for relative URL', () => {
      expect(isSameSiteURL('/about')).toBe(true);
    });

    it('should return false for different hostname', () => {
      expect(isSameSiteURL('https://example.com')).toBe(false);
    });

    it('should return false for invalid URL', () => {
      expect(isSameSiteURL('not-a-url')).toBe(false);
    });
  });

  describe('normalizeURL', () => {
    it('should remove trailing slash', () => {
      expect(normalizeURL('https://example.com/about/')).toBe(
        'https://example.com/about'
      );
    });

    it('should remove fragment identifier', () => {
      expect(normalizeURL('https://example.com/about#section')).toBe(
        'https://example.com/about'
      );
    });

    it('should remove both trailing slash and fragment', () => {
      expect(normalizeURL('https://example.com/about/#section')).toBe(
        'https://example.com/about'
      );
    });

    it('should handle relative URLs', () => {
      expect(normalizeURL('/diensten/#contact')).toBe('/diensten');
    });

    it('should leave clean URLs unchanged', () => {
      expect(normalizeURL('https://example.com/about')).toBe(
        'https://example.com/about'
      );
    });
  });
});
