'use client';

import { useEffect } from 'react';

export default function PWAInstaller() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let didUnmount = false;
    let removeLoadListener: (() => void) | null = null;
    const cleanups: Array<() => void> = [];

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');

        // Wait until the SW is active and ready
        await navigator.serviceWorker.ready;

        // Quiet update checks
        const onVisibilityChange = () => {
          if (document.visibilityState === 'visible') {
            registration.update().catch(() => {});
          }
        };
        document.addEventListener('visibilitychange', onVisibilityChange);
        cleanups.push(() => document.removeEventListener('visibilitychange', onVisibilityChange));

        // Handle updates quietly without prompts
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            // Intentionally no UI or reload; next navigation will use it
          });
        });

        // Ensure controller is set (in case activation happens post-load)
        const ensureController = () =>
          new Promise<void>((resolve) => {
            if (navigator.serviceWorker.controller) return resolve();
            navigator.serviceWorker.addEventListener(
              'controllerchange',
              () => resolve(),
              { once: true }
            );
          });

        await ensureController();
        return;
      } catch {
        // Retry once after a short delay in case of race conditions
        setTimeout(() => {
          if (!didUnmount) {
            navigator.serviceWorker.register('/sw.js').catch(() => {});
          }
        }, 1500);
        return;
      }
    };

    // Defer registration to avoid impacting first paint
    const onWindowLoad = () => {
      const rIC = (cb: () => void) => {
        // Support optional requestIdleCallback without using any casts
        const w = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number };
        if (w.requestIdleCallback) return w.requestIdleCallback(cb, { timeout: 2500 });
        return window.setTimeout(cb, 0);
      };
      if (!prefersReducedMotion) {
        rIC(() => { void register(); });
      } else {
        setTimeout(() => { void register(); }, 0);
      }
    };

    if (document.readyState === 'complete') {
      onWindowLoad();
    } else {
      window.addEventListener('load', onWindowLoad, { once: true });
      removeLoadListener = () => window.removeEventListener('load', onWindowLoad);
    }

    return () => {
      didUnmount = true;
      if (removeLoadListener) removeLoadListener();
       // Run any registered cleanups
      for (const fn of cleanups) {
        try { fn(); } catch {}
      }
    };
  }, []);

  return null;
}
