'use client';

/**
 * Client-side hook for capturing Core Web Vitals
 * Monitors LCP, CLS, INP and sends to monitoring API
 */

import { useEffect, useRef } from 'react';
import { onCLS, onLCP, onINP, type Metric } from 'web-vitals';
import type { WebVitalMetric, VitalEvent } from './types';
import { isMonitoringEnabled } from './utils';

interface UseWebVitalsOptions {
  /**
   * Enable/disable monitoring
   * Default: true in development, checks NEXT_PUBLIC_ENABLE_MONITORING in production
   */
  enabled?: boolean;
  
  /**
   * API endpoint to send vitals to
   * Default: /api/monitoring/core-web-vitals
   */
  endpoint?: string;
  
  /**
   * Callback when vitals are captured
   */
  onMetric?: (metric: WebVitalMetric) => void;
}

/**
 * Hook to capture and report Core Web Vitals
 */
export function useWebVitals(options: UseWebVitalsOptions = {}) {
  const {
    enabled = isMonitoringEnabled(),
    endpoint = '/api/monitoring/core-web-vitals',
    onMetric,
  } = options;

  const reportedMetrics = useRef(new Set<string>());

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    const handleMetric = (metric: Metric) => {
      // Only report each metric once per page load (using metric.id)
      if (reportedMetrics.current.has(metric.id)) {
        return;
      }
      reportedMetrics.current.add(metric.id);

      const webVitalMetric: WebVitalMetric = {
        name: metric.name as WebVitalMetric['name'],
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
        delta: metric.delta,
        navigationType: metric.navigationType || 'navigate',
      };

      // Callback for custom handling
      if (onMetric) {
        onMetric(webVitalMetric);
      }

      // Send to API endpoint
      sendToAPI(webVitalMetric, endpoint);
    };

    // Monitor Core Web Vitals
    onCLS(handleMetric);
    onLCP(handleMetric);
    onINP(handleMetric);

    // Cleanup is not needed as web-vitals library handles it
  }, [enabled, endpoint, onMetric]);
}

/**
 * Send metric to API endpoint
 */
function sendToAPI(metric: WebVitalMetric, endpoint: string) {
  if (typeof window === 'undefined') return;

  // Gather additional context
  const nav = navigator as import('@/types/analytics').NavigatorWithConnection;
  const connection = nav.connection;
  const vitalEvent: VitalEvent = {
    timestamp: Date.now(),
    url: window.location.href,
    metric,
    userAgent: navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    connection: connection ? {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
    } : undefined,
  };

  // Use sendBeacon for reliability (doesn't block page unload)
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(vitalEvent)], {
      type: 'application/json',
    });
    navigator.sendBeacon(endpoint, blob);
  } else {
    // Fallback to fetch with keepalive
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vitalEvent),
      keepalive: true,
    }).catch((error) => {
      // Silent fail - don't disrupt user experience
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to send vitals:', error);
      }
    });
  }
}
