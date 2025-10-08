/**
 * Enhanced Web Vitals monitoring for perfect Core Web Vitals scores
 * Tracks LCP, FID, CLS, INP, and TTFB with detailed analytics
 */

import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

// Web Vitals thresholds for perfect scores
export const WEB_VITALS_THRESHOLDS = {
  LCP: {
    GOOD: 2500,    // < 2.5s
    NEEDS_IMPROVEMENT: 4000, // 2.5s - 4s
    POOR: Infinity // > 4s
  },
  FID: {
    GOOD: 100,     // < 100ms
    NEEDS_IMPROVEMENT: 300, // 100ms - 300ms
    POOR: Infinity // > 300ms
  },
  CLS: {
    GOOD: 0.1,     // < 0.1
    NEEDS_IMPROVEMENT: 0.25, // 0.1 - 0.25
    POOR: Infinity // > 0.25
  },
  INP: {
    GOOD: 200,     // < 200ms
    NEEDS_IMPROVEMENT: 500, // 200ms - 500ms
    POOR: Infinity // > 500ms
  },
  FCP: {
    GOOD: 1800,    // < 1.8s
    NEEDS_IMPROVEMENT: 3000, // 1.8s - 3s
    POOR: Infinity // > 3s
  },
  TTFB: {
    GOOD: 800,     // < 800ms
    NEEDS_IMPROVEMENT: 1800, // 800ms - 1.8s
    POOR: Infinity // > 1.8s
  }
} as const;

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType?: string;
  attribution?: any;
}

interface DeviceInfo {
  userAgent: string;
  connectionType: string;
  deviceMemory: number;
  hardwareConcurrency: number;
  screenResolution: string;
  viewport: string;
  pixelRatio: number;
  timezone: string;
  language: string;
  cookieEnabled: boolean;
}

interface PageInfo {
  url: string;
  referrer: string;
  title: string;
  pathname: string;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

/**
 * Get device and environment information
 */
function getDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {} as DeviceInfo;
  }

  const nav = navigator as Navigator & {
    connection?: {
      effectiveType?: string;
      downlink?: number;
      rtt?: number;
      saveData?: boolean;
    };
    deviceMemory?: number;
  };

  return {
    userAgent: nav.userAgent,
    connectionType: nav.connection?.effectiveType || 'unknown',
    deviceMemory: nav.deviceMemory || 0,
    hardwareConcurrency: nav.hardwareConcurrency || 0,
    screenResolution: `${screen.width}x${screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    pixelRatio: window.devicePixelRatio || 1,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: nav.language,
    cookieEnabled: nav.cookieEnabled,
  };
}

/**
 * Get current page information
 */
function getPageInfo(): PageInfo {
  if (typeof window === 'undefined') {
    return {} as PageInfo;
  }

  // Generate or retrieve session ID
  let sessionId = sessionStorage.getItem('web-vitals-session');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('web-vitals-session', sessionId);
  }

  return {
    url: window.location.href,
    referrer: document.referrer,
    title: document.title,
    pathname: window.location.pathname,
    timestamp: Date.now(),
    sessionId,
    userId: localStorage.getItem('user-id') || undefined,
  };
}

/**
 * Determine the rating based on thresholds
 */
function getRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = WEB_VITALS_THRESHOLDS[metricName as keyof typeof WEB_VITALS_THRESHOLDS];
  if (!thresholds) return 'good';

  if (value <= thresholds.GOOD) return 'good';
  if (value <= thresholds.NEEDS_IMPROVEMENT) return 'needs-improvement';
  return 'poor';
}

/**
 * Send metric data to analytics
 */
async function sendToAnalytics(metric: WebVitalMetric, deviceInfo: DeviceInfo, pageInfo: PageInfo) {
  const data = {
    metric,
    device: deviceInfo,
    page: pageInfo,
    timestamp: Date.now(),
  };

  // Send to multiple analytics endpoints
  const endpoints: Array<{
    url: string;
    headers: Record<string, string>;
    body: string;
  }> = [
    // Plausible Analytics (if configured)
    {
      url: 'https://plausible.io/api/event',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `Web Vital: ${metric.name}`,
        url: pageInfo.url,
        domain: window.location.hostname,
        props: {
          metric: metric.name,
          value: metric.value,
          rating: metric.rating,
          connection: deviceInfo.connectionType,
          device_memory: deviceInfo.deviceMemory,
        }
      })
    },
    
    // Custom analytics endpoint (if configured)
    ...(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT ? [{
      url: process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT,
      headers: { 
        'Content-Type': 'application/json',
        ...(process.env.NEXT_PUBLIC_ANALYTICS_TOKEN && {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ANALYTICS_TOKEN}`
        })
      },
      body: JSON.stringify(data)
    }] : [])
  ];

  // Send to all configured endpoints
  for (const endpoint of endpoints) {
    try {
      await fetch(endpoint.url, {
        method: 'POST',
        headers: endpoint.headers,
        body: endpoint.body,
        keepalive: true,
      });
    } catch (error) {
      console.warn('Failed to send Web Vitals data:', error);
    }
  }

  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vitals:', {
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
      target: metric.name === 'LCP' ? '< 2.5s' : 
              metric.name === 'FID' ? '< 100ms' :
              metric.name === 'CLS' ? '< 0.1' :
              metric.name === 'INP' ? '< 200ms' :
              metric.name === 'FCP' ? '< 1.8s' :
              metric.name === 'TTFB' ? '< 800ms' : 'unknown',
      passed: metric.rating === 'good',
    });
  }
}

/**
 * Enhanced metric handler with detailed tracking
 */
function handleMetric(metric: any) {
  const enhancedMetric: WebVitalMetric = {
    ...metric,
    rating: getRating(metric.name, metric.value),
  };

  const deviceInfo = getDeviceInfo();
  const pageInfo = getPageInfo();

  // Send to analytics
  sendToAnalytics(enhancedMetric, deviceInfo, pageInfo);

  // Store for session analysis
  const sessionMetrics = JSON.parse(sessionStorage.getItem('web-vitals-metrics') || '[]');
  sessionMetrics.push({
    ...enhancedMetric,
    timestamp: Date.now(),
  });
  sessionStorage.setItem('web-vitals-metrics', JSON.stringify(sessionMetrics));

  // Trigger custom events for other parts of the app
  window.dispatchEvent(new CustomEvent('web-vital', {
    detail: enhancedMetric
  }));
}

/**
 * Initialize Web Vitals monitoring
 */
export function initWebVitalsMonitoring() {
  if (typeof window === 'undefined') return;

  // Monitor all Core Web Vitals
  onCLS(handleMetric);
  onFCP(handleMetric);
  onLCP(handleMetric);
  onTTFB(handleMetric);
  
  // Monitor INP (Interaction to Next Paint) - New Core Web Vital
  try {
    onINP(handleMetric);
  } catch (error) {
    // INP might not be available in all browsers yet
    console.warn('INP monitoring not available:', error);
  }

  // Monitor page load performance
  window.addEventListener('load', () => {
    // Track additional performance metrics
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      const customMetrics = [
        {
          name: 'DNS_TIME',
          value: navigation.domainLookupEnd - navigation.domainLookupStart,
          rating: 'good' as const,
          delta: 0,
          id: 'dns-' + Date.now(),
        },
        {
          name: 'CONNECT_TIME',
          value: navigation.connectEnd - navigation.connectStart,
          rating: 'good' as const,
          delta: 0,
          id: 'connect-' + Date.now(),
        },
        {
          name: 'DOM_READY',
          value: navigation.domContentLoadedEventEnd - navigation.requestStart,
          rating: 'good' as const,
          delta: 0,
          id: 'dom-ready-' + Date.now(),
        }
      ];

      customMetrics.forEach(handleMetric);
    }
  });

  // Track route changes for SPA navigation
  let currentPath = window.location.pathname;
  new MutationObserver(() => {
    if (window.location.pathname !== currentPath) {
      currentPath = window.location.pathname;
      // Reset metrics for new page view
      sessionStorage.removeItem('web-vitals-metrics');
    }
  }).observe(document, { subtree: true, childList: true });
}

/**
 * Get current session metrics
 */
export function getSessionMetrics() {
  if (typeof window === 'undefined') return [];
  return JSON.parse(sessionStorage.getItem('web-vitals-metrics') || '[]');
}

/**
 * Check if current page meets Web Vitals targets
 */
export function checkWebVitalsTargets() {
  const metrics = getSessionMetrics();
  const results = {
    LCP: { value: 0, target: 2500, passed: false },
    FID: { value: 0, target: 100, passed: false },
    CLS: { value: 0, target: 0.1, passed: false },
    overall: false,
  };

  metrics.forEach((metric: any) => {
    if (metric.name in results && typeof results[metric.name as keyof typeof results] === 'object') {
      const resultItem = results[metric.name as keyof typeof results] as { value: number; target: number; passed: boolean };
      resultItem.value = metric.value;
      resultItem.passed = metric.rating === 'good';
    }
  });

  results.overall = results.LCP.passed && results.FID.passed && results.CLS.passed;
  return results;
}

export default initWebVitalsMonitoring;