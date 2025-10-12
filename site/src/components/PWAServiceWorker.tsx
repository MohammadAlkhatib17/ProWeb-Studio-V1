"use client";

import { useEffect } from "react";

/**
 * PWA Service Worker Registration Component
 *
 * This component handles service worker registration in a non-intrusive way.
 * It only runs in production, uses proper error handling, and doesn't affect
 * the UI or critical rendering path.
 */
export default function PWAServiceWorker() {
  useEffect(() => {
    // Only run on client-side and in production
    if (
      typeof window === "undefined" ||
      process.env.NODE_ENV !== "production"
    ) {
      return;
    }

    // Use dynamic import to avoid affecting bundle size for development
    const initServiceWorker = async () => {
      try {
        const { initializeServiceWorker } = await import(
          "@/lib/sw-registration"
        );
        await initializeServiceWorker();
      } catch (error) {
        // Silent fail - PWA features are progressive enhancements
        if (process.env.NODE_ENV !== "production") {
          console.log("SW: Registration failed silently:", error);
        }
      }
    };

    // Delay execution to avoid blocking critical path
    const timeoutId = setTimeout(initServiceWorker, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // This component renders nothing - it's purely for side effects
  return null;
}
