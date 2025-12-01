/**
 * Dutch-Optimized Performance Monitor
 * Tracks Core Web Vitals and Dutch user experience metrics
 */

'use client';

import { useEffect, useRef } from 'react';
import type { CLSMetric, FCPMetric, FIDMetric, LCPMetric, TTFBMetric } from 'web-vitals';

interface DutchMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
  connectionType?: string;
  deviceCategory?: 'mobile' | 'tablet' | 'desktop';
  region?: string;
}

// Dutch performance thresholds (stricter for Dutch users)
const DUTCH_THRESHOLDS = {
  fcp: { good: 1500, poor: 2500 },
  lcp: { good: 2000, poor: 3500 },
  fid: { good: 80, poor: 250 },
  cls: { good: 0.1, poor: 0.25 },
  ttfb: { good: 500, poor: 1000 },
};

function getDutchRegion(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (timezone === 'Europe/Amsterdam') return 'netherlands';
  if (timezone.startsWith('Europe/')) return 'europe';
  return 'international';
}

function getDeviceCategory(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function getConnectionType(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  const connection = (navigator as any).connection;
  return connection?.effectiveType || 'unknown';
}

export default function DutchPerformanceMonitor() {
  const metricsRef = useRef<DutchMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  });

  const reportedRef = useRef(false);

  useEffect(() => {
    // Only run in production and for Dutch users
    if (process.env.NODE_ENV !== 'production') return;

    let vitalsModule: any;

    const initializeVitals = async () => {
      try {
        vitalsModule = await import('web-vitals');
        
        const region = getDutchRegion();
        const device = getDeviceCategory();
        const connection = getConnectionType();

        metricsRef.current.region = region;
        metricsRef.current.deviceCategory = device;
        metricsRef.current.connectionType = connection;

        // Enhanced FCP tracking
        vitalsModule.onFCP((metric: FCPMetric) => {
          metricsRef.current.fcp = metric.value;
          checkAndReport();
        });

        // Enhanced LCP tracking
        vitalsModule.onLCP((metric: LCPMetric) => {
          metricsRef.current.lcp = metric.value;
          checkAndReport();
        });

        // Enhanced FID tracking
        vitalsModule.onFID((metric: FIDMetric) => {
          metricsRef.current.fid = metric.value;
          checkAndReport();
        });

        // Enhanced CLS tracking
        vitalsModule.onCLS((metric: CLSMetric) => {
          metricsRef.current.cls = metric.value;
          checkAndReport();
        });

        // Enhanced TTFB tracking
        vitalsModule.onTTFB((metric: TTFBMetric) => {
          metricsRef.current.ttfb = metric.value;
          checkAndReport();
        });

      } catch (error) {
        // Silent fail - performance monitoring is enhancement
        console.debug('Performance monitoring initialization failed:', error);
      }
    };

    // Delayed initialization to not affect critical path
    const timer = setTimeout(initializeVitals, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const checkAndReport = () => {
    const metrics = metricsRef.current;
    
    // Report when we have core metrics
    if (
      !reportedRef.current &&
      metrics.fcp !== null && 
      metrics.lcp !== null && 
      metrics.cls !== null
    ) {
      reportedRef.current = true;
      reportDutchMetrics(metrics);
    }
  };

  return null; // This component only provides side effects
}

function reportDutchMetrics(metrics: DutchMetrics) {
  // Performance scoring for Dutch market
  const getPerformanceScore = (value: number, thresholds: { good: number; poor: number }) => {
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.poor) return 'needs-improvement';
    return 'poor';
  };

  const report = {
    timestamp: new Date().toISOString(),
    region: metrics.region,
    device: metrics.deviceCategory,
    connection: metrics.connectionType,
    metrics: {
      fcp: {
        value: metrics.fcp,
        score: metrics.fcp ? getPerformanceScore(metrics.fcp, DUTCH_THRESHOLDS.fcp) : null,
      },
      lcp: {
        value: metrics.lcp,
        score: metrics.lcp ? getPerformanceScore(metrics.lcp, DUTCH_THRESHOLDS.lcp) : null,
      },
      fid: {
        value: metrics.fid,
        score: metrics.fid ? getPerformanceScore(metrics.fid, DUTCH_THRESHOLDS.fid) : null,
      },
      cls: {
        value: metrics.cls,
        score: metrics.cls ? getPerformanceScore(metrics.cls, DUTCH_THRESHOLDS.cls) : null,
      },
      ttfb: {
        value: metrics.ttfb,
        score: metrics.ttfb ? getPerformanceScore(metrics.ttfb, DUTCH_THRESHOLDS.ttfb) : null,
      },
    },
  };

  // Send to analytics (only if consent given)
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible('Dutch Performance', {
      props: {
        region: metrics.region,
        device: metrics.deviceCategory,
        fcp_score: report.metrics.fcp.score,
        lcp_score: report.metrics.lcp.score,
        cls_score: report.metrics.cls.score,
      }
    });
  }

  // Log for development insights
  if (process.env.NODE_ENV !== 'production') {
    console.group('🇳🇱 Dutch Performance Report');
    console.table(report.metrics);
    console.log('Region:', metrics.region);
    console.log('Device:', metrics.deviceCategory);
    console.log('Connection:', metrics.connectionType);
    console.groupEnd();
  }
}