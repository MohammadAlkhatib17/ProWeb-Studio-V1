/**
 * Utility functions for web vitals monitoring
 */

import type { VitalEvent, MonitoringStats, WebVitalMetric } from './types';

/**
 * Calculate statistics from vital events
 */
export function calculateStats(events: VitalEvent[]): MonitoringStats {
  if (events.length === 0) {
    return {
      totalEvents: 0,
      avgLCP: 0,
      avgCLS: 0,
      avgINP: 0,
      p75LCP: 0,
      p75CLS: 0,
      p75INP: 0,
      goodCount: 0,
      needsImprovementCount: 0,
      poorCount: 0,
      recentEvents: [],
    };
  }

  const lcpValues: number[] = [];
  const clsValues: number[] = [];
  const inpValues: number[] = [];
  
  let goodCount = 0;
  let needsImprovementCount = 0;
  let poorCount = 0;

  events.forEach(event => {
    const { metric } = event;
    
    // Collect values by metric type
    if (metric.name === 'LCP') lcpValues.push(metric.value);
    if (metric.name === 'CLS') clsValues.push(metric.value);
    if (metric.name === 'INP') inpValues.push(metric.value);
    
    // Count ratings
    if (metric.rating === 'good') goodCount++;
    else if (metric.rating === 'needs-improvement') needsImprovementCount++;
    else if (metric.rating === 'poor') poorCount++;
  });

  return {
    totalEvents: events.length,
    avgLCP: average(lcpValues),
    avgCLS: average(clsValues),
    avgINP: average(inpValues),
    p75LCP: percentile(lcpValues, 75),
    p75CLS: percentile(clsValues, 75),
    p75INP: percentile(inpValues, 75),
    goodCount,
    needsImprovementCount,
    poorCount,
    recentEvents: events.slice(0, 50), // Include top 50 recent events
  };
}

/**
 * Calculate average of an array of numbers
 */
function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
}

/**
 * Calculate percentile of an array of numbers
 */
function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return Math.round(sorted[Math.max(0, index)]);
}

/**
 * Get rating color for UI display
 */
export function getRatingColor(rating: WebVitalMetric['rating']): string {
  switch (rating) {
    case 'good': return '#22c55e'; // green-500
    case 'needs-improvement': return '#f59e0b'; // amber-500
    case 'poor': return '#ef4444'; // red-500
    default: return '#6b7280'; // gray-500
  }
}

/**
 * Format metric value for display
 */
export function formatMetricValue(metric: WebVitalMetric): string {
  if (metric.name === 'CLS') {
    return metric.value.toFixed(3);
  }
  return `${Math.round(metric.value)}ms`;
}

/**
 * Get metric description
 */
export function getMetricDescription(name: WebVitalMetric['name']): string {
  switch (name) {
    case 'LCP':
      return 'Largest Contentful Paint - measures loading performance';
    case 'CLS':
      return 'Cumulative Layout Shift - measures visual stability';
    case 'INP':
      return 'Interaction to Next Paint - measures interactivity';
    case 'FCP':
      return 'First Contentful Paint - measures perceived load speed';
    case 'TTFB':
      return 'Time to First Byte - measures server response time';
    default:
      return '';
  }
}

/**
 * Check if monitoring is enabled
 */
export function isMonitoringEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_MONITORING === 'true' || 
         process.env.NODE_ENV === 'development';
}
