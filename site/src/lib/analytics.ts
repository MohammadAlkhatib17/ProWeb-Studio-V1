'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Analytics event types for the ProWeb Studio website.
 * Uses Plausible Analytics for privacy-friendly tracking.
 */
export type AnalyticsEvent =
    | { name: 'contact_form_submit'; props?: { source: string } }
    | { name: 'cta_click'; props: { button: string; page: string } }
    | { name: '3d_scene_load'; props: { scene: string; duration: number } }
    | { name: 'service_view'; props: { service: string } }
    | { name: 'city_page_view'; props: { city: string } }
    | { name: 'faq_expand'; props: { question: string } }
    | { name: 'newsletter_signup'; props?: Record<string, string> }
    | { name: 'outbound_link'; props: { url: string } };

// Plausible Analytics interface
declare global {
    interface Window {
        plausible?: (eventName: string, options?: { props?: Record<string, unknown> }) => void;
    }
}

/**
 * Track an analytics event using Plausible.
 * Gracefully handles cases where Plausible is not loaded.
 */
export function trackEvent<T extends AnalyticsEvent>(event: T): void {
    if (typeof window !== 'undefined' && window.plausible) {
        window.plausible(event.name, { props: event.props });
    }
}

/**
 * Hook for tracking analytics events.
 * Returns a memoized track function.
 */
export function useAnalytics() {
    const track = useCallback(<T extends AnalyticsEvent>(event: T) => {
        trackEvent(event);
    }, []);

    return { track };
}

/**
 * Hook for tracking 3D scene load performance.
 * Call startTiming when scene starts loading, endTiming when complete.
 */
export function use3DSceneTracking(sceneName: string) {
    const [startTime, setStartTime] = useState<number | null>(null);

    const startTiming = useCallback(() => {
        setStartTime(performance.now());
    }, []);

    const endTiming = useCallback(() => {
        if (startTime) {
            const duration = Math.round(performance.now() - startTime);
            trackEvent({ name: '3d_scene_load', props: { scene: sceneName, duration } });
            setStartTime(null);
        }
    }, [startTime, sceneName]);

    return { startTiming, endTiming };
}

/**
 * Track CTA button clicks.
 */
export function trackCTAClick(buttonName: string, pageName: string): void {
    trackEvent({ name: 'cta_click', props: { button: buttonName, page: pageName } });
}

/**
 * Track outbound link clicks automatically.
 * Use this for any external links.
 */
export function trackOutboundLink(url: string): void {
    trackEvent({ name: 'outbound_link', props: { url } });
}

/**
 * Hook to auto-track page views for service and city pages.
 */
export function usePageViewTracking(type: 'service' | 'city', value: string) {
    useEffect(() => {
        if (type === 'service') {
            trackEvent({ name: 'service_view', props: { service: value } });
        } else if (type === 'city') {
            trackEvent({ name: 'city_page_view', props: { city: value } });
        }
    }, [type, value]);
}

export default trackEvent;
