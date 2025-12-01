/**
 * Performance-Optimized Font Loading
 * Prevents FOIT/FOUT with enhanced fallback strategies
 */

import { Inter } from 'next/font/google';

// Optimized Inter configuration
export const primaryFont = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: [
    'system-ui', 
    '-apple-system', 
    'BlinkMacSystemFont', 
    'Segoe UI', 
    'Roboto', 
    'Arial', 
    'sans-serif'
  ],
  adjustFontFallback: true,
  variable: '--font-primary',
  // Optimize for Core Web Vitals
  style: ['normal'],
  weight: ['400', '500', '600', '700'],
});

// Critical CSS for font loading optimization
export const fontOptimizationCSS = `
  /* Font display optimization */
  .font-loading {
    font-family: system-ui, -apple-system, sans-serif;
    font-display: swap;
  }

  .font-loaded {
    font-family: var(--font-primary), system-ui, -apple-system, sans-serif;
  }

  /* Prevent layout shift during font loading */
  @font-face {
    font-family: 'Inter-fallback';
    src: local('Arial'), local('Helvetica'), local('sans-serif');
    font-display: swap;
    ascent-override: 90.20%;
    descent-override: 22.48%;
    line-gap-override: 0.00%;
    size-adjust: 107.40%;
  }

  /* Ensure consistent metrics */
  .text-metrics-optimized {
    font-family: var(--font-primary), 'Inter-fallback', system-ui, sans-serif;
    font-feature-settings: 'kern' 1;
    text-rendering: optimizeLegibility;
  }
`;

// Font loading strategy based on connection speed
export function getOptimalFontStrategy(): 'swap' | 'optional' {
  if (typeof window === 'undefined') return 'swap';
  
  const connection = (navigator as any).connection;
  if (connection?.saveData || connection?.effectiveType === 'slow-2g') {
    return 'optional';
  }
  
  return 'swap';
}

export default primaryFont;