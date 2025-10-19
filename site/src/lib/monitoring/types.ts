/**
 * Monitoring types for Core Web Vitals tracking
 * Lightweight type definitions for internal monitoring dashboard
 */

export interface WebVitalMetric {
  name: 'CLS' | 'LCP' | 'INP' | 'FCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  id: string;
  delta?: number;
  navigationType?: string;
}

export interface VitalEvent {
  timestamp: number;
  url: string;
  metric: WebVitalMetric;
  userAgent?: string;
  viewport?: {
    width: number;
    height: number;
  };
  connection?: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
  };
}

export interface MonitoringStats {
  totalEvents: number;
  avgLCP: number;
  avgCLS: number;
  avgINP: number;
  p75LCP: number;
  p75CLS: number;
  p75INP: number;
  goodCount: number;
  needsImprovementCount: number;
  poorCount: number;
  recentEvents: VitalEvent[];
}
