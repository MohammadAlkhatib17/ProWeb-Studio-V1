/**
 * Google Analytics 4 (GA4) utilities for event tracking
 * Gracefully handles cases where GA4 is not configured
 */

// Global gtag function declaration
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * GA4 configuration
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Check if consent has been granted for analytics
 * Updated to work with new consent system
 */
export const hasAnalyticsConsent = (): boolean => {
  if (typeof window === "undefined") return false;

  // Check for consent flag - only proceed if explicitly granted
  return (
    "__CONSENT_ANALYTICS__" in window &&
    (window as Record<string, unknown>).__CONSENT_ANALYTICS__ === true
  );
};

/**
 * Check if GA4 is enabled (measurement ID is provided AND consent granted)
 */
export const isGA4Enabled = (): boolean => {
  return Boolean(
    GA_MEASUREMENT_ID && typeof window !== "undefined" && hasAnalyticsConsent(),
  );
};

/**
 * Initialize Google Analytics 4
 * Call this in your app's root component or _app.tsx
 * Only loads if measurement ID is provided AND consent is granted
 */
export const initGA4 = (): void => {
  if (!isGA4Enabled()) {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "GA4: Measurement ID not provided or analytics consent not granted, analytics disabled",
      );
    }
    return;
  }

  // Load gtag script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.gtag =
    window.gtag ||
    function (...args: unknown[]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window.gtag as any).q = (window.gtag as any).q || []).push(args);
    };

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("GA4: Initialized with measurement ID:", GA_MEASUREMENT_ID);
  }
};

/**
 * Track page views
 * Automatically called by Next.js router events
 */
export const trackPageView = (url: string, title?: string): void => {
  if (!isGA4Enabled()) return;

  window.gtag("config", GA_MEASUREMENT_ID!, {
    page_title: title || document.title,
    page_location: url,
  });
};

/**
 * Track custom events
 * @param action - The action being tracked (e.g., 'click', 'download', 'purchase')
 * @param category - The category of the event (e.g., 'engagement', 'ecommerce')
 * @param label - Optional label for the event
 * @param value - Optional numeric value for the event
 */
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
): void => {
  if (!isGA4Enabled()) return;

  const eventData: Record<string, unknown> = {
    event_category: category,
  };

  if (label) eventData.event_label = label;
  if (value !== undefined) eventData.value = value;

  window.gtag("event", action, eventData);
};

/**
 * Track form submissions
 */
export const trackFormSubmit = (
  formName: string,
  success: boolean = true,
): void => {
  trackEvent(
    success ? "form_submit_success" : "form_submit_error",
    "engagement",
    formName,
  );
};

/**
 * Track button clicks
 */
export const trackButtonClick = (
  buttonName: string,
  location?: string,
): void => {
  trackEvent(
    "click",
    "engagement",
    `${buttonName}${location ? ` - ${location}` : ""}`,
  );
};

/**
 * Track downloads
 */
export const trackDownload = (fileName: string, fileType?: string): void => {
  trackEvent("download", "engagement", fileName, undefined);

  if (fileType) {
    trackEvent("file_download", "engagement", fileType);
  }
};

/**
 * Track external link clicks
 */
export const trackExternalLink = (url: string, linkText?: string): void => {
  trackEvent("click", "outbound", linkText || url);
};

/**
 * Track video interactions
 */
export const trackVideoPlay = (videoTitle: string, progress?: number): void => {
  trackEvent("video_play", "engagement", videoTitle, progress);
};

export const trackVideoComplete = (videoTitle: string): void => {
  trackEvent("video_complete", "engagement", videoTitle);
};

/**
 * Track search actions
 */
export const trackSearch = (
  searchTerm: string,
  resultsCount?: number,
): void => {
  trackEvent("search", "engagement", searchTerm, resultsCount);
};

/**
 * Track scroll depth
 */
export const trackScrollDepth = (percentage: number): void => {
  if (
    percentage === 25 ||
    percentage === 50 ||
    percentage === 75 ||
    percentage === 100
  ) {
    trackEvent("scroll", "engagement", `${percentage}%`, percentage);
  }
};

/**
 * Track contact form interactions
 */
export const trackContactFormStart = (): void => {
  trackEvent("form_start", "engagement", "contact_form");
};

export const trackContactFormSubmit = (success: boolean = true): void => {
  trackFormSubmit("contact_form", success);
};

/**
 * Track navigation interactions
 */
export const trackNavigation = (section: string): void => {
  trackEvent("navigation", "engagement", section);
};

/**
 * Helper function to safely execute GA4 functions
 * Use this wrapper for any GA4 calls in your components
 */
export const safeGA4 = (fn: () => void): void => {
  try {
    if (isGA4Enabled()) {
      fn();
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("GA4: Error executing analytics function:", error);
    }
  }
};

/**
 * React hook for GA4 initialization
 * Use this in your app's root component
 */
export const useGA4 = () => {
  const isEnabled = isGA4Enabled();

  return {
    isEnabled,
    init: initGA4,
    trackPageView,
    trackEvent,
    trackFormSubmit,
    trackButtonClick,
    trackDownload,
    trackExternalLink,
    trackVideoPlay,
    trackVideoComplete,
    trackSearch,
    trackScrollDepth,
    trackContactFormStart,
    trackContactFormSubmit,
    trackNavigation,
  };
};

/**
 * GA4 utilities for event tracking
 */
const ga4Utils = {
  isGA4Enabled,
  hasAnalyticsConsent,
  initGA4,
  trackPageView,
  trackEvent,
  trackFormSubmit,
  trackButtonClick,
  trackDownload,
  trackExternalLink,
  trackVideoPlay,
  trackVideoComplete,
  trackSearch,
  trackScrollDepth,
  trackContactFormStart,
  trackContactFormSubmit,
  trackNavigation,
  safeGA4,
  useGA4,
};

export default ga4Utils;
