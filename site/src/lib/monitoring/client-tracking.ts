/**
 * Web Vitals tracking client-side script
 * Initialize Core Web Vitals monitoring on page load
 */

import { initWebVitalsTracking } from '@/lib/monitoring/core-web-vitals';

// Initialize Web Vitals tracking when the page loads
if (typeof window !== 'undefined') {
  // Wait for the page to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTracking);
  } else {
    initializeTracking();
  }
}

function initializeTracking() {
  // Initialize with custom configuration
  const monitor = initWebVitalsTracking({
    enableRealTimeTracking: true,
    sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0, // 10% sampling in production
    reportingEndpoint: '/api/monitoring/core-web-vitals',
    thresholds: {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      ttfb: { good: 800, poor: 1800 },
    },
  });

  if (monitor && process.env.NODE_ENV === 'development') {
    console.log('Web Vitals monitoring initialized');
  }
}

// Track 404 errors
window.addEventListener('error', (event) => {
  if (event.target && 'src' in event.target) {
    // Resource loading error - could be 404
    fetch('/api/monitoring/404', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: (event.target as HTMLElement & { src?: string })?.src || 'unknown',
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      }),
    }).catch(() => {
      // Silently fail - don't break the page
    });
  }
});

// Track client-side navigation 404s (for SPAs)
const originalFetch = window.fetch;
window.fetch = async function(input, init) {
  const response = await originalFetch(input, init);
  
  if (response.status === 404) {
    const url = typeof input === 'string' ? input : input instanceof Request ? input.url : input.toString();
    
    fetch('/api/monitoring/404', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      }),
    }).catch(() => {
      // Silently fail
    });
  }
  
  return response;
};

export {};