'use client';

import { useEffect } from 'react';
import { onCLS, onINP, onLCP, onTTFB } from 'web-vitals/attribution';
import type { CLSMetricWithAttribution, INPMetricWithAttribution, LCPMetricWithAttribution, TTFBMetricWithAttribution } from 'web-vitals/attribution';

type MetricType = 'LCP' | 'INP' | 'CLS' | 'TTFB';
type RatingType = 'good' | 'needs-improvement' | 'poor';

interface VitalsPayload {
  metric: MetricType;
  value: number;
  rating: RatingType;
  path: string;
  viewport: string;
  connection?: string;
  deviceMemory?: number;
  jsHeap?: number;
  valueBucket: string;
  [key: string]: unknown;
}

// Google Core Web Vitals thresholds
function getMetricRating(metric: MetricType, value: number): RatingType {
  switch (metric) {
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
    case 'INP':
      return value <= 200 ? 'good' : value <= 500 ? 'needs-improvement' : 'poor';
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
    case 'TTFB':
      return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
    default:
      return 'good';
  }
}

// Create value buckets for distribution analysis in Plausible
function getValueBucket(metric: MetricType, value: number): string {
  switch (metric) {
    case 'LCP':
      if (value <= 500) return '0-0.5s';
      if (value <= 1000) return '0.5-1s';
      if (value <= 1500) return '1-1.5s';
      if (value <= 2000) return '1.5-2s';
      if (value <= 2500) return '2-2.5s';
      if (value <= 3000) return '2.5-3s';
      if (value <= 4000) return '3-4s';
      if (value <= 5000) return '4-5s';
      return '5s+';
    
    case 'INP':
      if (value <= 100) return '0-100ms';
      if (value <= 200) return '100-200ms';
      if (value <= 300) return '200-300ms';
      if (value <= 500) return '300-500ms';
      if (value <= 1000) return '500ms-1s';
      return '1s+';
    
    case 'CLS':
      if (value <= 0.05) return '0-0.05';
      if (value <= 0.1) return '0.05-0.1';
      if (value <= 0.15) return '0.1-0.15';
      if (value <= 0.25) return '0.15-0.25';
      if (value <= 0.5) return '0.25-0.5';
      return '0.5+';
    
    case 'TTFB':
      if (value <= 200) return '0-200ms';
      if (value <= 400) return '200-400ms';
      if (value <= 800) return '400-800ms';
      if (value <= 1200) return '800ms-1.2s';
      if (value <= 1800) return '1.2-1.8s';
      return '1.8s+';
    
    default:
      return 'unknown';
  }
}

// Build comprehensive payload with device and performance context
function buildVitalsPayload(metric: MetricType, value: number): VitalsPayload {
  // Filter out undefined values to keep payload clean
  const payload: VitalsPayload = {
    metric,
    value: Math.round(value),
    rating: getMetricRating(metric, value),
    path: window.location.pathname,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    valueBucket: getValueBucket(metric, value),
  };

  // Add optional properties only if available
  if (navigator.connection?.effectiveType) {
    payload.connection = navigator.connection.effectiveType;
  }

  if ('deviceMemory' in navigator && typeof navigator.deviceMemory === 'number') {
    payload.deviceMemory = navigator.deviceMemory;
  }

  if (performance?.memory?.jsHeapSizeLimit) {
    payload.jsHeap = performance.memory.jsHeapSizeLimit;
  }

  return payload;
}

// Send vitals data to Plausible with fallback to fetch
function sendToPlausible(payload: VitalsPayload): void {
  try {
    // Primary method: Use Plausible's custom event tracking
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible('web-vitals', { props: payload });
      return;
    }

    // Fallback: Use sendBeacon or fetch with keepalive
    const data = JSON.stringify({ 
      name: 'web-vitals',
      props: payload 
    });

    if (navigator.sendBeacon) {
      // Note: In real implementation, you'd send to your Plausible endpoint
      // For now, we'll use a placeholder that won't actually send data
      navigator.sendBeacon('/api/plausible-proxy', data);
    } else {
      fetch('/api/plausible-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
        keepalive: true,
      }).catch(() => {
        // Silently fail - don't throw errors for analytics
      });
    }
  } catch {
    // Silently fail - analytics should never break the user experience
  }
}

// Check if this user should be sampled for vitals reporting
function shouldSample(): boolean {
  const sampleRate = parseFloat(process.env.NEXT_PUBLIC_VITALS_SAMPLE || '0.2');
  return Math.random() < sampleRate;
}

// Generic handler for all web vitals metrics
function handleVitalsMetric(
  metric: CLSMetricWithAttribution | INPMetricWithAttribution | LCPMetricWithAttribution | TTFBMetricWithAttribution
): void {
  // Only report if user is in sample group
  if (!shouldSample()) {
    return;
  }

  const payload = buildVitalsPayload(metric.name as MetricType, metric.value);
  sendToPlausible(payload);
}

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, unknown> }) => void;
  }
  
  interface Navigator {
    connection?: {
      effectiveType?: string;
    };
    deviceMemory?: number;
    mozConnection?: {
      effectiveType?: string;
    };
    webkitConnection?: {
      effectiveType?: string;
    };
  }
  
  interface Performance {
    memory?: {
      jsHeapSizeLimit?: number;
      usedJSHeapSize?: number;
    };
  }
}

export function RealUserVitals(): null {
  useEffect(() => {
    // Only run in production environment
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    // Only run in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Register listeners for Core Web Vitals with attribution
    onLCP(handleVitalsMetric);
    onINP(handleVitalsMetric);
    onCLS(handleVitalsMetric);
    onTTFB(handleVitalsMetric);
  }, []);

  // This component renders nothing - it's purely for side effects
  return null;
}