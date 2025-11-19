/**
 * Resource preconnection utilities for Core Web Vitals optimization
 * Implements preconnect, dns-prefetch, and preload strategies for critical third-party resources
 */

import type { NavigatorWithConnection } from '@/types/analytics';

export interface PreconnectConfig {
  href: string;
  crossOrigin?: '' | 'anonymous' | 'use-credentials';
  type?: 'preconnect' | 'dns-prefetch' | 'preload';
  as?: 'font' | 'image' | 'script' | 'style';
  importance?: 'high' | 'low';
}

/**
 * Critical third-party domains that should be preconnected
 * Ordered by priority - most critical first
 */
export const CRITICAL_PRECONNECTS: PreconnectConfig[] = [
  // Google Fonts - Critical for text rendering
  {
    href: 'https://fonts.googleapis.com',
    type: 'preconnect',
    importance: 'high',
  },
  {
    href: 'https://fonts.gstatic.com',
    type: 'preconnect',
    crossOrigin: '',
    importance: 'high',
  },
  
  // Analytics - Important for business metrics
  {
    href: 'https://plausible.io',
    type: 'preconnect',
    importance: 'high',
  },
  
  // Calendar scheduling - User experience critical
  {
    href: 'https://cal.com',
    type: 'preconnect',
    crossOrigin: '',
    importance: 'high',
  },
  
  // Vercel Analytics
  {
    href: 'https://vitals.vercel-insights.com',
    type: 'preconnect',
    importance: 'high',
  },
  
  // CDN resources (if using external CDNs)
  {
    href: 'https://cdn.jsdelivr.net',
    type: 'dns-prefetch',
    importance: 'low',
  },
];

/**
 * DNS prefetch configurations for non-critical domains
 * Used for resources that may be needed later
 */
export const DNS_PREFETCH_DOMAINS = [
  'https://www.google-analytics.com',
  'https://www.googletagmanager.com',
  'https://connect.facebook.net',
  'https://apis.google.com',
] as const;

/**
 * Page-specific resource preloading configurations
 */
export const PAGE_SPECIFIC_PRECONNECTS = {
  '/contact': [
    {
      href: 'https://cal.com',
      type: 'preconnect' as const,
      crossOrigin: '' as const,
      importance: 'high' as const,
    },
  ],
  '/': [
    {
      href: 'https://plausible.io',
      type: 'preconnect' as const,
      importance: 'high' as const,
    },
  ],
} as const;

/**
 * Generate all preconnect/dns-prefetch links for a specific page
 */
export function generateResourcePreconnects(pathname?: string): PreconnectConfig[] {
  const preconnects = [...CRITICAL_PRECONNECTS];
  
  // Add DNS prefetch for non-critical domains
  const dnsPrefetches = DNS_PREFETCH_DOMAINS.map(domain => ({
    href: domain,
    type: 'dns-prefetch' as const,
    importance: 'low' as const,
  }));
  
  preconnects.push(...dnsPrefetches);
  
  // Add page-specific preconnects
  if (pathname && PAGE_SPECIFIC_PRECONNECTS[pathname as keyof typeof PAGE_SPECIFIC_PRECONNECTS]) {
    const pageSpecific = PAGE_SPECIFIC_PRECONNECTS[pathname as keyof typeof PAGE_SPECIFIC_PRECONNECTS];
    preconnects.push(...pageSpecific);
  }
  
  return preconnects;
}

/**
 * Generate resource hints based on connection quality
 */
export function getAdaptiveResourceHints() {
  if (typeof window === 'undefined') return CRITICAL_PRECONNECTS;
  
  const nav = navigator as NavigatorWithConnection;
  if (nav.connection) {
    const { effectiveType, saveData } = nav.connection;
    
    // Reduce preconnects for slow connections or data saver mode
    if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
      return CRITICAL_PRECONNECTS.filter(config => config.importance === 'high');
    }
  }
  
  return CRITICAL_PRECONNECTS;
}

/**
 * Advanced preconnect and resource hints optimization
 * Optimized for Dutch CDNs and hosting providers
 */
export const RESOURCE_STRATEGIES = {
  // Fonts should be preconnected and preloaded
  fonts: {
    strategy: 'preconnect-preload',
    priority: 'high',
    timing: 'immediate',
  },
  
  // Analytics can be preconnected but loaded later
  analytics: {
    strategy: 'preconnect-defer',
    priority: 'high',
    timing: 'after-load',
  },
  
  // Social/external widgets should be lazy loaded
  social: {
    strategy: 'dns-prefetch-lazy',
    priority: 'low',
    timing: 'on-interaction',
  },
  
  // API endpoints should be preconnected for forms
  api: {
    strategy: 'preconnect',
    priority: 'high',
    timing: 'on-page-load',
  },
} as const;

/**
 * Monitor and optimize resource loading performance
 */
export function trackResourcePerformance() {
  if (typeof window === 'undefined') return;
  
  // Track resource loading times
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'resource') {
        const resourceEntry = entry as PerformanceResourceTiming;
        
        // Log slow third-party resources
        if (resourceEntry.duration > 1000) {
          console.warn(`Slow resource detected: ${resourceEntry.name} took ${resourceEntry.duration}ms`);
        }
      }
    }
  });
  
  observer.observe({ entryTypes: ['resource'] });
}

export default generateResourcePreconnects;