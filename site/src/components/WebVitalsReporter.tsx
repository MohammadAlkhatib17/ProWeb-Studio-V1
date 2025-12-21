'use client';

import { useReportWebVitals } from 'next/web-vitals';

import { reportWebVitals } from '@/reportWebVitals';

export function WebVitalsReporter() {
  const isProd = process.env.NODE_ENV === 'production';
  const enabled = process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS === 'true';

  // Vitals reporting to Plausible
  useReportWebVitals((metric) => {
    if (isProd && enabled) {
      reportWebVitals(metric);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Web Vitals] ${metric.name}:`, {
        value: metric.value,
        rating: metric.rating,
      });
    }
  });

  return null;
}