/**
 * Font optimization utilities for better Core Web Vitals
 * Implements font-display strategies and preloading for critical fonts
 */

import { Inter } from 'next/font/google';

/**
 * Primary font configuration with optimal display strategy
 * Uses 'swap' for better CLS and faster text rendering
 */
export const primaryFont = Inter({ 
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  adjustFontFallback: true,
  variable: '--font-primary',
});

/**
 * Font preload configurations for critical fonts
 * These should be added to the document head for LCP optimization
 */
export const fontPreloads = [
  {
    href: '/_next/static/media/inter-latin.woff2',
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
    // Preload only the most critical font weights
    descriptor: 'font-weight: 400 700;',
  },
] as const;

/**
 * CSS for font fallback optimization
 * Reduces layout shift when web fonts load
 */
export const fontFallbackCSS = `
  /* Optimize font loading to prevent FOIT/FOUT */
  @font-face {
    font-family: 'Inter-fallback';
    src: local('Arial'), local('Helvetica'), local('sans-serif');
    font-display: swap;
    ascent-override: 90.20%;
    descent-override: 22.48%;
    line-gap-override: 0.00%;
    size-adjust: 107.40%;
  }

  /* Ensure consistent metrics between web font and fallback */
  .font-loading {
    font-family: 'Inter-fallback', system-ui, -apple-system, sans-serif;
  }

  .font-loaded {
    font-family: var(--font-primary), 'Inter-fallback', system-ui, -apple-system, sans-serif;
  }

  /* Progressive enhancement for font loading */
  .no-js .font-loading {
    font-family: system-ui, -apple-system, sans-serif;
  }
`;

/**
 * Font loading strategies for different content types
 */
export const fontStrategies = {
  critical: 'swap', // Above-the-fold content
  standard: 'swap', // Regular content
  decorative: 'optional', // Non-essential fonts
} as const;

/**
 * Generate font preload links for critical fonts
 */
export function generateFontPreloads() {
  return fontPreloads.map(font => ({
    rel: 'preload',
    href: font.href,
    as: font.as,
    type: font.type,
    crossOrigin: font.crossOrigin,
  }));
}

/**
 * Font loading detection utility
 * Helps optimize font loading strategy based on connection speed
 */
export function getFontLoadingStrategy() {
  if (typeof window === 'undefined') return 'swap';
  
  // Use connection speed to determine strategy
  const connection = (navigator as any).connection;
  if (connection) {
    const { effectiveType, saveData } = connection;
    
    // Use fallback for slow connections or data saver mode
    if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
      return 'optional';
    }
    
    // Use swap for fast connections
    if (effectiveType === '4g') {
      return 'swap';
    }
  }
  
  return 'swap'; // Default strategy
}

/**
 * Font metrics for better fallback matching
 * Helps reduce layout shift when fonts load
 */
export const fontMetrics = {
  inter: {
    ascentOverride: '90.20%',
    descentOverride: '22.48%',
    lineGapOverride: '0.00%',
    sizeAdjust: '107.40%',
  },
  systemUI: {
    ascentOverride: '90%',
    descentOverride: '20%',
    lineGapOverride: '0%',
    sizeAdjust: '100%',
  },
} as const;

export default primaryFont;