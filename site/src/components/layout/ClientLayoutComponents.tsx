'use client';

import dynamic from 'next/dynamic';

/**
 * ClientLayoutComponents - Client wrapper for layout-level client components
 * 
 * This wrapper handles components that need client-side only rendering
 * using dynamic imports with ssr: false. This pattern is required because
 * Next.js 15+ disallows ssr: false in Server Components.
 */

const CursorTrail = dynamic(() => import('@/components/CursorTrail'), {
    ssr: false,
    loading: () => null,
});

const DutchPerformanceMonitor = dynamic(() => import('@/components/DutchPerformanceMonitor'), {
    ssr: false,
    loading: () => null,
});

const WebVitalsReporter = dynamic(
    () => import('@/components/WebVitalsReporter').then(mod => ({ default: mod.WebVitalsReporter })),
    {
        ssr: false,
        loading: () => null,
    }
);

export default function ClientLayoutComponents() {
    return (
        <>
            <CursorTrail />
            <DutchPerformanceMonitor />
            <WebVitalsReporter />
        </>
    );
}
