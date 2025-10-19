'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { reportWebVitals } from '@/reportWebVitals';
import { useWebVitals } from '@/lib/monitoring/useWebVitals';

export function WebVitalsReporter() {
  const isProd = process.env.NODE_ENV === 'production';
  const enabled = process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS === 'true';
  
  // Legacy vitals reporting to Plausible
  useReportWebVitals((metric) => {
    if (isProd && enabled) {
      reportWebVitals(metric);
    }
  });
  
  // New internal monitoring system (LCP, CLS, INP only)
  useWebVitals({
    enabled: true, // Will check env flags internally
    onMetric: (metric) => {
      // Optional: Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Vitals Monitor] ${metric.name}:`, {
          value: metric.value,
          rating: metric.rating,
        });
      }
    },
  });
  
  return null;
}