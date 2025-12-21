'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

/**
 * Hook that throttles a value
 * Ensures updates happen at most once per specified interval
 * 
 * @param value - The value to throttle
 * @param interval - Minimum interval between updates in milliseconds (default: 200ms)
 * @returns Throttled value
 */
export function useThrottle<T>(value: T, interval: number = 200): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdated.current;

    if (timeSinceLastUpdate >= interval) {
      // Update immediately if enough time has passed
      lastUpdated.current = now;
      setThrottledValue(value);
      return;
    }

    // Schedule update for when interval expires
    const timeoutId = setTimeout(() => {
      lastUpdated.current = Date.now();
      setThrottledValue(value);
    }, interval - timeSinceLastUpdate);

    return () => clearTimeout(timeoutId);
  }, [value, interval]);

  return throttledValue;
}

/**
 * Hook that creates a throttled callback function
 * Limits how often a function can be called
 * Uses requestAnimationFrame for optimal performance with visual updates
 * 
 * @param callback - Function to throttle
 * @param limit - Minimum time between calls in milliseconds (default: 200ms)
 * @param deps - Dependency array for the callback
 * @returns Throttled callback function
 */
export function useThrottledCallback<T extends (...args: never[]) => unknown>(
  callback: T,
  limit: number = 200,
  deps: React.DependencyList = []
): (...args: Parameters<T>) => void {
  const waiting = useRef(false);
  const lastCallTime = useRef(0);
  const rafId = useRef<number | undefined>(undefined);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime.current;

    if (!waiting.current && timeSinceLastCall >= limit) {
      // Execute immediately if enough time has passed
      lastCallTime.current = now;
      callback(...args);
    } else if (!waiting.current) {
      // Schedule execution for when limit expires
      waiting.current = true;

      const delay = limit - timeSinceLastCall;
      setTimeout(() => {
        // Use rAF for smooth visual updates
        rafId.current = requestAnimationFrame(() => {
          lastCallTime.current = Date.now();
          waiting.current = false;
          callback(...args);
        });
      }, delay);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, limit, ...deps]);
}

/**
 * Hook that creates a requestAnimationFrame-based throttled callback
 * Perfect for scroll, resize, and other high-frequency visual events
 * Ensures callback runs at most once per animation frame
 * 
 * @param callback - Function to throttle
 * @param deps - Dependency array for the callback
 * @returns rAF-throttled callback function
 */
export function useRAFThrottle<T extends (...args: never[]) => unknown>(
  callback: T,
  deps: React.DependencyList = []
): (...args: Parameters<T>) => void {
  const rafId = useRef<number | undefined>(undefined);
  const latestArgs = useRef<Parameters<T> | undefined>(undefined);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback((...args: Parameters<T>) => {
    latestArgs.current = args;

    if (!rafId.current) {
      rafId.current = requestAnimationFrame(() => {
        callback(...(latestArgs.current as Parameters<T>));
        rafId.current = undefined;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
