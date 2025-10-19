/**
 * Performance Dashboard React component f      // Get the latest value for each metric
      currentMetrics.forEach(metric => {
        if (metric.name in latest) {
          latest[metric.name as keyof PerformanceMetrics] = metric.value;
        }
      });

      setMetrics(latest);Web Vitals monitoring
 */

'use client';

import { useEffect, useState } from 'react';
import { initCoreWebVitalsMonitoring } from '@/lib/core-web-vitals-monitor';

interface PerformanceMetrics {
  LCP: number | null;
  INP: number | null; // INP replaced FID in web-vitals v5.x
  CLS: number | null;
  FCP: number | null;
  TTFB: number | null;
}

interface PerformanceDashboardProps {
  enabled?: boolean;
  dutchOptimized?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function PerformanceDashboard({
  enabled = process.env.NODE_ENV === 'development',
  dutchOptimized = true,
  position = 'bottom-right'
}: PerformanceDashboardProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    LCP: null,
    INP: null,
    CLS: null,
    FCP: null,
    TTFB: null,
  });

  useEffect(() => {
    if (!enabled) return;

    const cwvMonitor = initCoreWebVitalsMonitoring({
      enableReporting: false, // Dashboard mode
      dutchOptimizationLevel: dutchOptimized ? 'premium' : 'basic',
    });

    // Update metrics periodically
    const interval = setInterval(() => {
      const currentMetrics = cwvMonitor.getMetrics();
      const latest: PerformanceMetrics = {
        LCP: null,
        INP: null,
        CLS: null,
        FCP: null,
        TTFB: null,
      };

      // Get the latest value for each metric
      currentMetrics.forEach(metric => {
        if (metric.name in latest) {
          latest[metric.name as keyof PerformanceMetrics] = metric.value;
        }
      });

      setMetrics(latest);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [enabled, dutchOptimized]);

  if (!enabled) return null;

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  const formatMetric = (value: number | null, type: string): string => {
    if (value === null) return '-';
    
    switch (type) {
      case 'CLS':
        return value.toFixed(3);
      case 'LCP':
      case 'INP':
      case 'FCP':
      case 'TTFB':
        return `${Math.round(value)}ms`;
      default:
        return Math.round(value).toString();
    }
  };

  const getMetricColor = (value: number | null, type: string): string => {
    if (value === null) return 'text-slate-400';
    
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      INP: { good: 200, poor: 500 }, // INP replaced FID in web-vitals v5.x
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
      TTFB: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[type as keyof typeof thresholds];
    if (!threshold) return 'text-white';

    if (value <= threshold.good) return 'text-green-400';
    if (value <= threshold.poor) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`fixed ${positionClasses[position]} bg-black/90 backdrop-blur-sm text-white p-3 rounded-lg text-xs font-mono z-50 max-w-xs border border-gray-700 shadow-lg`}>
      <div className="font-bold mb-2 text-blue-400 flex items-center gap-1">
        🇳🇱 {dutchOptimized ? 'Dutch' : 'Global'} Performance
      </div>
      <div className="space-y-1">
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center">
            <span className="text-slate-200">{key}:</span>
            <span className={getMetricColor(value, key)}>
              {formatMetric(value, key)}
            </span>
          </div>
        ))}
      </div>
      {dutchOptimized && (
        <div className="mt-2 pt-2 border-t border-gray-600">
          <div className="text-xs text-slate-400">
            Optimized for Dutch users
          </div>
        </div>
      )}
    </div>
  );
}

export default PerformanceDashboard;