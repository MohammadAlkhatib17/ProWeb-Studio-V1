'use client';

import { useEffect, useRef } from 'react';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
}

// Performance thresholds optimized for Dutch users
const THRESHOLDS = {
  LCP: { good: 1000, poor: 2500 }, // Largest Contentful Paint - targeting sub-1s
  FCP: { good: 800, poor: 1800 },  // First Contentful Paint
  CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
  FID: { good: 100, poor: 300 },   // First Input Delay
  TTFB: { good: 200, poor: 600 }   // Time to First Byte
};

function getRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metricName as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

function sendToAnalytics(metric: PerformanceMetric) {
  // Send to your analytics service
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'core_web_vital', {
      event_category: 'Performance',
      event_label: metric.name,
      value: Math.round(metric.value),
      custom_map: {
        metric_rating: metric.rating,
        metric_delta: metric.delta
      }
    });
  }
  
  // Send to custom API for monitoring
  fetch('/api/vitals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metric)
  }).catch(console.error);
}

function observePerformance() {
  // Observe Core Web Vitals
  if (typeof window !== 'undefined') {
    const observeMetric = (name: string, value: number, delta?: number) => {
      const metric: PerformanceMetric = {
        name,
        value,
        rating: getRating(name, value),
        delta
      };
      
      sendToAnalytics(metric);
      
      // Log for development
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 [Performance] ${name}: ${value}ms (${metric.rating})`);
      }
    };

    // LCP (Largest Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
      if (lastEntry) {
        observeMetric('LCP', lastEntry.startTime);
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // FCP (First Contentful Paint)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
      if (lastEntry) {
        observeMetric('FCP', lastEntry.startTime);
      }
    }).observe({ entryTypes: ['paint'] });

    // CLS (Cumulative Layout Shift)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        const e = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
        if (!e.hadRecentInput) {
          clsValue += e.value;
        }
      }
      observeMetric('CLS', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });

    // FID (First Input Delay)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { processingStart: number; startTime: number };
      if (lastEntry) {
        const fid = lastEntry.processingStart - lastEntry.startTime;
        observeMetric('FID', fid);
      }
    }).observe({ entryTypes: ['first-input'] });

    // TTFB (Time to First Byte)
    if ('navigation' in performance) {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navEntry) {
        const ttfb = navEntry.responseStart - navEntry.requestStart;
        observeMetric('TTFB', ttfb);
      }
    }

    // Network Information API for connection quality
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        const networkInfo = {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        };
        
        // Send network quality info
        fetch('/api/vitals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'NETWORK_INFO',
            value: 0,
            rating: 'good',
            networkInfo
          })
        }).catch(console.error);
      }
    }

    // Geographic performance tracking
    const geoHint = document.querySelector('meta[name="x-geographic-hint"]')?.getAttribute('content');
    if (geoHint) {
      // Track performance by geographic region
      window.addEventListener('load', () => {
        const loadTime = performance.now();
        
        fetch('/api/vitals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'PAGE_LOAD_TIME',
            value: loadTime,
            rating: getRating('LCP', loadTime),
            geographic: geoHint
          })
        }).catch(console.error);
      });
    }
  }
}

export default function DutchPerformanceMonitor() {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Delay to ensure DOM is ready
    const timer = setTimeout(() => {
      observePerformance();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Development mode performance display
  if (process.env.NODE_ENV === 'development') {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px',
          fontSize: '12px',
          borderRadius: '4px',
          zIndex: 9999,
          fontFamily: 'monospace'
        }}
      >
        🚀 Performance Monitoring Active
        <br />
        Target: LCP &lt; 1000ms for NL users
      </div>
    );
  }

  return null;
}