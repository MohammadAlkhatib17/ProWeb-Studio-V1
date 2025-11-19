/**
 * TypeScript type definitions for Web Vitals and analytics
 * Provides proper types for performance monitoring
 */

import type { Metric } from 'web-vitals';

/**
 * Web Vitals metric type (from web-vitals library)
 * Re-export for convenience
 */
export type WebVitalsMetric = Metric;

/**
 * Web Vitals metric name type
 */
export type WebVitalsMetricName = 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB' | 'INP';

/**
 * Web Vitals rating type
 */
export type WebVitalsRating = 'good' | 'needs-improvement' | 'poor';

/**
 * Analytics event parameters
 */
export interface AnalyticsEventParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Analytics tracking function type
 */
export type AnalyticsTracker = (
  eventName: string,
  params?: AnalyticsEventParams
) => void;

/**
 * Performance observer entry type helper
 */
export type PerformanceEntryType = PerformanceEntry;

/**
 * Network information type
 */
export interface NetworkInformation {
  effectiveType?: '4g' | '3g' | '2g' | 'slow-2g';
  saveData?: boolean;
  downlink?: number;
  rtt?: number;
}

/**
 * Extended Navigator with network information
 */
export interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}
