/**
 * Comprehensive resource hints component for perfect Core Web Vitals
 * Handles preconnect, preload, prefetch, and dns-prefetch strategically
 */

import { CRITICAL_PRECONNECTS, CRITICAL_PRELOADS, ROUTE_PREFETCH_CONFIG, DNS_PREFETCH_DOMAINS } from '@/lib/preconnect';

interface ResourceHintsProps {
  currentPath?: string;
  enableRoutePrefetch?: boolean;
  enableDNSPrefetch?: boolean;
}

/**
 * Generate all resource hints for the current page
 */
export function ResourceHints({ 
  currentPath = '/',
  enableRoutePrefetch = true,
  enableDNSPrefetch = true 
}: ResourceHintsProps) {
  // Get current route for route-based prefetching
  const routePrefetches = enableRoutePrefetch ? ROUTE_PREFETCH_CONFIG[currentPath] || [] : [];
  
  return (
    <>
      {/* Critical preconnects for LCP optimization */}
      {CRITICAL_PRECONNECTS.map((config, index) => {
        if (config.type === 'preconnect') {
          return (
            <link
              key={`preconnect-${index}`}
              rel="preconnect"
              href={config.href}
              {...(config.crossOrigin !== undefined && { crossOrigin: config.crossOrigin })}
              {...(config.fetchpriority && { fetchPriority: config.fetchpriority })}
            />
          );
        }
        return null;
      })}

      {/* Critical resource preloads */}
      {CRITICAL_PRELOADS.map((config, index) => (
        <link
          key={`preload-${index}`}
          rel="preload"
          href={config.href}
          as={config.as}
          type={config.as === 'style' ? 'text/css' : undefined}
          {...(config.crossOrigin !== undefined && { crossOrigin: config.crossOrigin })}
          {...(config.fetchpriority && { fetchPriority: config.fetchpriority })}
          {...(config.media && { media: config.media })}
        />
      ))}

      {/* Route-based prefetching for faster navigation */}
      {routePrefetches.map((config, index) => (
        <link
          key={`prefetch-${index}`}
          rel="prefetch"
          href={config.href}
          {...(config.as && { as: config.as })}
        />
      ))}

      {/* DNS prefetch for non-critical domains */}
      {enableDNSPrefetch && DNS_PREFETCH_DOMAINS.map((domain, index) => (
        <link
          key={`dns-prefetch-${index}`}
          rel="dns-prefetch"
          href={domain}
        />
      ))}

      {/* Additional DNS prefetches from config */}
      {CRITICAL_PRECONNECTS
        .filter(config => config.type === 'dns-prefetch')
        .map((config, index) => (
          <link
            key={`dns-prefetch-extra-${index}`}
            rel="dns-prefetch"
            href={config.href}
          />
        ))}
    </>
  );
}

/**
 * Get resource hints for programmatic use
 */
export function getResourceHints(currentPath = '/') {
  const hints = [];
  
  // Add critical preconnects
  hints.push(...CRITICAL_PRECONNECTS);
  
  // Add critical preloads
  hints.push(...CRITICAL_PRELOADS);
  
  // Add route-based prefetches
  const routePrefetches = ROUTE_PREFETCH_CONFIG[currentPath] || [];
  hints.push(...routePrefetches);
  
  // Add DNS prefetches
  hints.push(...DNS_PREFETCH_DOMAINS.map(domain => ({
    href: domain,
    type: 'dns-prefetch' as const,
  })));
  
  return hints;
}

/**
 * Dynamic route prefetching hook for client-side
 */
export function useRoutePrefetch() {
  if (typeof window === 'undefined') return null;
  
  const prefetchRoute = (href: string) => {
    // Use manual link prefetch
    const existingLink = document.querySelector(`link[rel="prefetch"][href="${href}"]`);
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      link.as = 'document';
      document.head.appendChild(link);
    }
  };
  
  return prefetchRoute;
}

export default ResourceHints;