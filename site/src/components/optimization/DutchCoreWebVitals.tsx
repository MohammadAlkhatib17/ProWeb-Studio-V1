/**
 * Dutch-specific Core Web Vitals optimizations
 * Tailored for Dutch users, language, and market requirements
 */

import { ReactNode, useEffect } from "react";
import { initDutchPerformanceMonitoring } from "@/lib/web-vitals-optimization";

interface DutchCoreWebVitalsProps {
  children: ReactNode;
  enableRegionalOptimizations?: boolean;
  enableDutchLanguageOptimizations?: boolean;
  enableAnalytics?: boolean;
}

/**
 * Dutch-specific optimizations component
 * Implements Core Web Vitals optimizations specifically for Dutch users
 */
export function DutchCoreWebVitals({
  children,
  enableRegionalOptimizations = true,
  enableDutchLanguageOptimizations = true,
  enableAnalytics = true,
}: DutchCoreWebVitalsProps) {
  useEffect(() => {
    if (enableAnalytics) {
      // Initialize Dutch-specific performance monitoring
      initDutchPerformanceMonitoring();
    }

    if (enableRegionalOptimizations) {
      // Optimize for Dutch network conditions
      optimizeForDutchNetwork();
    }

    if (enableDutchLanguageOptimizations) {
      // Optimize typography for Dutch language
      optimizeDutchTypography();
    }
  }, [
    enableAnalytics,
    enableRegionalOptimizations,
    enableDutchLanguageOptimizations,
  ]);

  return (
    <>
      {/* Dutch language meta optimizations */}
      {enableDutchLanguageOptimizations && (
        <>
          <meta name="language" content="Dutch" />
          <meta name="geo.region" content="NL" />
          <meta name="geo.country" content="Netherlands" />
          <meta name="geo.placename" content="Nederland" />
          <meta httpEquiv="Content-Language" content="nl-NL" />
        </>
      )}

      {/* Regional performance optimizations */}
      {enableRegionalOptimizations && (
        <>
          {/* Dutch CDN optimization hints */}
          <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
          <link rel="dns-prefetch" href="//unpkg.com" />
          <link
            rel="preconnect"
            href="https://fonts.googleapis.com"
            crossOrigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
        </>
      )}

      <div className="dutch-optimized-content">{children}</div>
    </>
  );
}

/**
 * Optimize network settings for Dutch infrastructure
 */
function optimizeForDutchNetwork() {
  if (typeof window === "undefined") return;

  // Set up adaptive loading based on Dutch network conditions
  const connection = (
    navigator as unknown as {
      connection?: { effectiveType?: string; downlink?: number; rtt?: number };
    }
  ).connection;

  if (connection) {
    const { effectiveType, downlink, rtt } = connection;

    // Dutch average connection speeds are high, but optimize for mobile
    const isDutchMobile = effectiveType === "3g" || effectiveType === "4g";
    const isSlowConnection =
      (downlink !== undefined && downlink < 2) ||
      (rtt !== undefined && rtt > 200);

    if (isDutchMobile || isSlowConnection) {
      // Enable aggressive resource prioritization
      document.documentElement.style.setProperty(
        "--loading-strategy",
        "conservative",
      );

      // Reduce animation complexity for mobile Dutch users
      document.documentElement.style.setProperty(
        "--animation-complexity",
        "reduced",
      );
    } else {
      // Enable full features for desktop Dutch users with fast connections
      document.documentElement.style.setProperty(
        "--loading-strategy",
        "aggressive",
      );
      document.documentElement.style.setProperty(
        "--animation-complexity",
        "full",
      );
    }
  }
}

/**
 * Optimize typography specifically for Dutch language
 */
function optimizeDutchTypography() {
  if (typeof window === "undefined") return;

  const style = document.createElement("style");
  style.textContent = `
    /* Dutch language typography optimizations */
    .dutch-text, .dutch-optimized-content {
      /* Optimize for Dutch character frequency */
      font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
      
      /* Dutch hyphenation rules */
      hyphens: auto;
      -webkit-hyphens: auto;
      -ms-hyphens: auto;
      hyphenate-limit-chars: 6 3 3;
      hyphenate-limit-lines: 2;
      hyphenate-limit-last: always;
      hyphenate-limit-zone: 8%;
      
      /* Optimize for Dutch reading patterns */
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      
      /* Dutch-specific line height optimization */
      line-height: 1.6;
      
      /* Optimize for Dutch word lengths (average longer than English) */
      word-spacing: 0.05em;
      letter-spacing: 0.01em;
    }
    
    /* Dutch heading optimizations */
    .dutch-optimized-content h1,
    .dutch-optimized-content h2,
    .dutch-optimized-content h3 {
      /* Dutch headlines tend to be longer, optimize spacing */
      line-height: 1.2;
      margin-bottom: 0.8em;
      text-wrap: balance;
      overflow-wrap: break-word;
    }
    
    /* Dutch paragraph optimizations */
    .dutch-optimized-content p {
      /* Optimize for Dutch sentence structure */
      text-align: left;
      text-justify: inter-word;
      hanging-punctuation: first last;
    }
    
    /* Responsive Dutch typography */
    @media (max-width: 640px) {
      .dutch-optimized-content {
        /* Mobile Dutch users prefer slightly larger text */
        font-size: 1.05em;
        line-height: 1.5;
      }
    }
    
    @media (min-width: 1200px) {
      .dutch-optimized-content {
        /* Desktop Dutch users can handle denser text */
        line-height: 1.55;
        max-width: 75ch; /* Optimal for Dutch reading */
      }
    }
  `;

  document.head.appendChild(style);
}

/**
 * Dutch SEO and accessibility optimizations
 */
export function DutchSEOOptimizations() {
  return (
    <>
      {/* Dutch search engine optimizations */}
      <meta name="google" content="notranslate" />
      <meta
        name="robots"
        content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"
      />
      <meta
        name="googlebot"
        content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"
      />

      {/* Dutch accessibility optimizations */}
      <meta name="color-scheme" content="light dark" />
      <meta name="supported-color-schemes" content="light dark" />

      {/* Dutch social media optimizations */}
      <meta property="og:locale" content="nl_NL" />
      <meta property="og:locale:alternate" content="en_US" />
      <meta name="twitter:card" content="summary_large_image" />

      {/* Dutch region-specific tags */}
      <meta name="geo.position" content="52.3676;4.9041" />
      <meta name="ICBM" content="52.3676, 4.9041" />
      <meta name="geo.region" content="NL" />
      <meta name="geo.placename" content="Netherlands" />
    </>
  );
}

/**
 * Dutch Core Web Vitals performance thresholds
 * Based on Dutch user behavior and device characteristics
 */
export const DutchPerformanceThresholds = {
  // LCP thresholds adjusted for Dutch browsing patterns
  LCP: {
    good: 2000, // 2s - Dutch users expect fast loading
    needsImprovement: 3000, // 3s
    poor: 4000, // 4s
  },

  // FID thresholds for Dutch interaction patterns
  FID: {
    good: 80, // 80ms - Dutch users interact quickly
    needsImprovement: 150, // 150ms
    poor: 300, // 300ms
  },

  // CLS thresholds for Dutch reading patterns
  CLS: {
    good: 0.05, // Very low tolerance for layout shifts
    needsImprovement: 0.1,
    poor: 0.25,
  },

  // INP thresholds for Dutch user interactions
  INP: {
    good: 150, // 150ms
    needsImprovement: 300, // 300ms
    poor: 500, // 500ms
  },
};

/**
 * Monitor Dutch-specific performance metrics
 */
export function monitorDutchPerformance() {
  if (typeof window === "undefined") return;

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const entryName = entry.name;
      const entryType = entry.entryType;

      // Track Dutch page performance
      if (entryType === "navigation") {
        const nav = entry as PerformanceNavigationTiming;
        const pageLoadTime = nav.loadEventEnd - nav.startTime;

        // Report Dutch page performance
        if (typeof gtag !== "undefined") {
          gtag("event", "dutch_page_performance", {
            event_category: "Dutch Performance",
            page_load_time: Math.round(pageLoadTime),
            connection_type:
              (
                navigator as unknown as {
                  connection?: { effectiveType?: string };
                }
              ).connection?.effectiveType || "unknown",
            custom_map: {
              metric_dutch_1: "page_load_time",
              metric_dutch_2: "connection_type",
            },
          });
        }
      }

      // Track Dutch resource loading
      if (entryType === "resource" && entryName.includes("nl")) {
        const resource = entry as PerformanceResourceTiming;
        const resourceLoadTime = resource.responseEnd - resource.startTime;

        if (typeof gtag !== "undefined") {
          gtag("event", "dutch_resource_performance", {
            event_category: "Dutch Resources",
            resource_load_time: Math.round(resourceLoadTime),
            resource_type: entryName,
          });
        }
      }
    }
  });

  observer.observe({ entryTypes: ["navigation", "resource"] });
}

// Global gtag declaration
declare global {
  function gtag(...args: unknown[]): void;
}

export default DutchCoreWebVitals;
