'use client';

import { useEffect } from 'react';
import type { Metric } from 'web-vitals';

interface MetricAttribution {
  eventType?: string;
  eventTarget?: { tagName?: string; nodeName?: string };
  eventTime?: number;
  loadState?: string;
  inputDelay?: number;
  processingDuration?: number;
  presentationDelay?: number;
  [key: string]: unknown;
}

type MetricType = 'LCP' | 'INP' | 'CLS' | 'TTFB';
type RatingType = 'good' | 'needs-improvement' | 'poor';

// Define minimal metric interface for our needs
interface WebVitalsMetric {
  name: string;
  value: number;
  delta: number;
  id: string;
  navigationType?: string;
  navigationId?: string;
}

interface VitalsPayload {
  metric: MetricType;
  value: number;
  rating: RatingType;
  path: string;
  vp: string;
  conn?: string;
  dm?: number;
  mem?: number;
  delta: number;
  deviceType: string;
  language: string;
  navType?: string;
  navId?: string;
  valueBucket: string;
  // INP attribution fields
  inpEventType?: string;
  inpEventTarget?: string;
  inpInputDelay?: number;
  inpProcessingDuration?: number;
  inpPresentationDelay?: number;
  inpLoadState?: string;
  [key: string]: unknown; // Allow additional properties for plausible
}

// Module-level deduplication set
const sent = new Set<string>();

// Module-level pending queue for final flush
const pendingQueue: VitalsPayload[] = [];
let flushListenersRegistered = false;

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

// Check if this user should be sampled for vitals reporting with session persistence
function shouldSample(): boolean {
  const sampleRate = parseFloat(process.env.NEXT_PUBLIC_VITALS_SAMPLE || '0.2');
  
  // Check session storage for existing sampling decision
  const sessionKey = '__vitals_sampled__';
  try {
    const stored = sessionStorage.getItem(sessionKey);
    if (stored !== null) {
      return stored === 'true';
    }
    
    // Make new sampling decision
    const sampled = Math.random() < sampleRate;
    sessionStorage.setItem(sessionKey, String(sampled));
    return sampled;
  } catch {
    // Fallback if sessionStorage is not available
    return Math.random() < sampleRate;
  }
}

// Build comprehensive payload with device and performance context
function buildVitalsPayload(
  metric: WebVitalsMetric,
  value: number,
  delta: number,
  navigationType?: string,
  navigationId?: string
): VitalsPayload {
  // Get device type based on pointer capability
  const deviceType = (typeof window !== 'undefined' && window.matchMedia && window.matchMedia("(pointer:coarse)").matches) 
    ? "mobile" 
    : "desktop";

  const payload: VitalsPayload = {
    metric: metric.name as MetricType,
    value: Math.round(value),
    rating: getMetricRating(metric.name as MetricType, value),
    path: window.location.pathname,
    vp: `${window.innerWidth}x${window.innerHeight}`,
    delta: Math.round(delta),
    deviceType,
    language: navigator.language,
    valueBucket: getValueBucket(metric.name as MetricType, value),
  };

  // Add navigation info if available
  if (navigationType) {
    payload.navType = navigationType;
  }
  if (navigationId) {
    payload.navId = navigationId;
  }

  // Add INP attribution data for better debugging
  if (metric.name === 'INP' && 'attribution' in metric) {
    const attr = 'attribution' in metric ? (metric as Metric & { attribution: MetricAttribution }).attribution : undefined;
    if (attr) {
      payload.inpEventType = attr.eventType;
      payload.inpEventTarget = attr.eventTarget?.tagName || attr.eventTarget?.nodeName;
      payload.inpInputDelay = Math.round(attr.inputDelay || 0);
      payload.inpProcessingDuration = Math.round(attr.processingDuration || 0);
      payload.inpPresentationDelay = Math.round(attr.presentationDelay || 0);
      payload.inpLoadState = attr.loadState;
    }
  }

  // Add optional properties only if available (short keys for lean payload)
  if (navigator.connection?.effectiveType) {
    payload.conn = navigator.connection.effectiveType;
  }

  if ('deviceMemory' in navigator && typeof navigator.deviceMemory === 'number') {
    payload.dm = navigator.deviceMemory;
  }

  if (performance?.memory?.jsHeapSizeLimit) {
    payload.mem = performance.memory.jsHeapSizeLimit;
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

// Final flush function for pagehide/visibilitychange
function flushPendingMetrics(): void {
  if (pendingQueue.length === 0) return;
  
  try {
    // Send up to 3 pending metrics via sendBeacon
    const toSend = pendingQueue.splice(0, 3);
    for (const payload of toSend) {
      const data = JSON.stringify({ 
        name: 'web-vitals',
        props: payload 
      });
      
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/plausible-proxy', data);
      }
    }
  } catch {
    // Silently fail
  }
}

// Register final flush listeners
function registerFlushListeners(): void {
  if (flushListenersRegistered || typeof window === 'undefined') return;
  
  flushListenersRegistered = true;
  
  window.addEventListener('pagehide', flushPendingMetrics);
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushPendingMetrics();
    }
  });
}

// Generic handler for all web vitals metrics with deduplication and DNT respect
function handleVitalsMetric(metric: WebVitalsMetric): void {
  try {
    // Respect DNT setting
    if (navigator.doNotTrack === "1") {
      return;
    }

    // Check for consent flag if it exists
    if (typeof window !== 'undefined' && 
        '__CONSENT_ANALYTICS__' in window && 
        (window as Record<string, unknown>).__CONSENT_ANALYTICS__ !== true) {
      return;
    }

    // Only report if user is in sample group
    if (!shouldSample()) {
      return;
    }

    // Deduplicate based on metric ID
    if (sent.has(metric.id)) {
      return;
    }

    const payload = buildVitalsPayload(
      metric,
      metric.value,
      metric.delta || 0,
      metric.navigationType,
      metric.navigationId
    );

    // Try to send immediately
    sendToPlausible(payload);
    
    // Mark as sent after successful send
    sent.add(metric.id);

    // Add to pending queue as backup (max 3 items)
    if (pendingQueue.length < 3) {
      pendingQueue.push(payload);
    }
  } catch {
    // Silently fail - analytics should never break the user experience
  }
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

    // Register flush listeners
    registerFlushListeners();

    // Lazy import web-vitals to reduce bundle size
    const initWebVitals = async () => {
      try {
        const { onCLS, onINP, onLCP, onTTFB } = await import('web-vitals/attribution');
        
        // Register listeners for Core Web Vitals with attribution
        // INP with enhanced attribution for debugging interaction delays
        onINP((metric) => {
          handleVitalsMetric(metric);
          
          // Log detailed INP attribution in development for debugging
          if (process.env.NODE_ENV === 'development' && 'attribution' in metric) {
            const attr = 'attribution' in metric ? (metric as unknown as Metric & { attribution: MetricAttribution }).attribution : undefined;
            console.log('[INP Attribution]', {
              value: Math.round(metric.value),
              rating: metric.rating,
              eventType: attr?.eventType,
              eventTarget: attr?.eventTarget,
              eventTime: attr?.eventTime,
              loadState: attr?.loadState,
              inputDelay: Math.round(attr?.inputDelay || 0),
              processingDuration: Math.round(attr?.processingDuration || 0),
              presentationDelay: Math.round(attr?.presentationDelay || 0),
            });
          }
        });
        
        onLCP(handleVitalsMetric);
        onCLS(handleVitalsMetric);
        onTTFB(handleVitalsMetric);
      } catch {
        // Silently fail if web-vitals can't be loaded
      }
    };

    initWebVitals();
  }, []);

  // This component renders nothing - it's purely for side effects
  return null;
}