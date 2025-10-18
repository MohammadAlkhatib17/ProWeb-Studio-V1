/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Core Web Vitals optimization utilities
 * Specifically tuned for Dutch users and network conditions
 */

interface FontPreload {
  rel: string;
  href: string;
  as: string;
  type: string;
  crossOrigin?: "anonymous" | "use-credentials";
  fetchpriority?: "high" | "low" | "auto";
}

/**
 * Enhanced font preloading with Dutch language optimization
 */
export function getOptimizedFontPreloads(): FontPreload[] {
  // Return empty array as Next.js handles font preloading automatically
  // with proper optimization for fonts loaded via next/font/google
  return [];
}

/**
 * Critical resource hints for Dutch market optimization
 */
export function getDutchOptimizedResourceHints() {
  return [
    // DNS prefetching for Dutch-specific services
    { rel: "dns-prefetch", href: "//fonts.googleapis.com" },
    { rel: "dns-prefetch", href: "//fonts.gstatic.com" },
    { rel: "dns-prefetch", href: "//plausible.io" },
    { rel: "dns-prefetch", href: "//vercel-insights.com" },

    // Preconnect for critical resources
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
      crossOrigin: "anonymous",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },

    // Prefetch critical routes for Dutch navigation patterns
    { rel: "prefetch", href: "/diensten" },
    { rel: "prefetch", href: "/contact" },
    { rel: "prefetch", href: "/over-ons" },
  ];
}

/**
 * Dynamic bundle size optimization based on device capabilities
 */
export function shouldLoadAdvancedFeatures(): boolean {
  if (typeof window === "undefined") return true;

  const connection = (navigator as any).connection;
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const deviceMemory = (navigator as any).deviceMemory || 4;

  // Conservative loading for lower-end devices
  if (deviceMemory < 2 || hardwareConcurrency < 2) {
    return false;
  }

  // Network-aware loading
  if (connection) {
    const { effectiveType, saveData, downlink } = connection;

    // Skip advanced features on slow connections or data saver mode
    if (saveData || effectiveType === "slow-2g" || effectiveType === "2g") {
      return false;
    }

    // Load conditionally on 3G
    if (effectiveType === "3g" && downlink < 1.5) {
      return false;
    }
  }

  return true;
}

/**
 * Image loading strategy optimizer for Dutch users
 */
export function getOptimalImageStrategy(isAboveFold: boolean = false) {
  const baseStrategy = {
    loading: isAboveFold ? ("eager" as const) : ("lazy" as const),
    decoding: "async" as const,
    fetchPriority: isAboveFold ? ("high" as const) : ("auto" as const),
  };

  if (typeof window === "undefined") return baseStrategy;

  const connection = (navigator as any).connection;
  if (connection?.saveData) {
    return {
      ...baseStrategy,
      // Use lower quality for data saver mode
      quality: 60,
      placeholder: "blur",
    };
  }

  return {
    ...baseStrategy,
    quality: isAboveFold ? 90 : 75,
  };
}

/**
 * Layout Shift Prevention utilities
 */
export function getResponsiveImageSizes(
  type: "hero" | "content" | "thumbnail" | "gallery",
) {
  const sizeMap = {
    hero: "100vw",
    content: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
    thumbnail: "(max-width: 640px) 150px, 200px",
    gallery: "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  };

  return sizeMap[type];
}

/**
 * Critical CSS inlining strategy
 */
export function getCriticalCSS() {
  return `
    /* Critical styles for LCP optimization */
    .hero-section {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    }
    
    /* Font fallback to prevent FOIT */
    .font-loading {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-synthesis: none;
      text-rendering: optimizeLegibility;
    }
    
    /* Layout preservation for images */
    .responsive-image-container {
      position: relative;
      overflow: hidden;
    }
    
    .responsive-image-container::before {
      content: '';
      display: block;
      padding-bottom: var(--aspect-ratio, 56.25%);
    }
    
    /* Skeleton loading styles */
    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    /* Dutch typography optimizations */
    .dutch-text {
      hyphens: auto;
      hyphenate-limit-chars: 6 3 3;
      word-break: normal;
      overflow-wrap: break-word;
    }
  `;
}

/**
 * Service Worker optimization for Dutch content
 */
export function getDutchCacheStrategy() {
  return {
    // Cache Dutch language assets aggressively
    static: ["/assets/logo/", "/assets/hero/", "/fonts/", "/_next/static/"],

    // Cache critical Dutch pages
    pages: ["/", "/diensten", "/contact", "/over-ons", "/werkwijze"],

    // Cache external resources
    external: ["https://fonts.googleapis.com", "https://fonts.gstatic.com"],
  };
}

/**
 * Performance monitoring for Core Web Vitals
 */
export function initDutchPerformanceMonitoring() {
  if (typeof window === "undefined") return;

  // Track Dutch-specific metrics
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Send to analytics with Dutch context
      if (entry.entryType === "largest-contentful-paint") {
        // Track LCP for Dutch content
        if (typeof gtag !== "undefined") {
          gtag("event", "lcp_dutch", {
            event_category: "Web Vitals",
            value: Math.round(entry.startTime),
            custom_map: { metric_1: "lcp_dutch" },
          });
        }
      }

      if (entry.entryType === "layout-shift") {
        const layoutShiftEntry = entry as LayoutShift;
        if (!layoutShiftEntry.hadRecentInput) {
          // Track CLS specifically for Dutch layouts
          if (typeof gtag !== "undefined") {
            gtag("event", "cls_dutch", {
              event_category: "Web Vitals",
              value: Math.round(layoutShiftEntry.value * 1000),
              custom_map: { metric_2: "cls_dutch" },
            });
          }
        }
      }
    }
  });

  observer.observe({
    entryTypes: ["largest-contentful-paint", "layout-shift"],
  });
}

// Type definitions for performance entries
interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

// Global gtag fallback
declare global {
  function gtag(...args: any[]): void;
}
