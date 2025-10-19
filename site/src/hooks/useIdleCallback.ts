'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook that schedules a callback to run during browser idle time
 * Uses requestIdleCallback when available, falls back to setTimeout
 * Perfect for deferring non-critical work to improve INP and responsiveness
 * 
 * @param callback - Function to execute during idle time
 * @param options - Configuration options
 * @returns Object with cancel function
 */
export function useIdleCallback(
  callback: () => void,
  options: {
    /**
     * Whether to run the callback (default: true)
     */
    enabled?: boolean;
    /**
     * Maximum time to wait before forcing execution (ms)
     * Default: 2000ms
     */
    timeout?: number;
    /**
     * Dependencies that should trigger re-scheduling
     */
    deps?: React.DependencyList;
  } = {}
) {
  const { enabled = true, timeout = 2000, deps = [] } = options;
  const callbackRef = useRef(callback);
  const idleIdRef = useRef<number>();

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    // Cancel any pending callback
    if (idleIdRef.current) {
      if ('cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleIdRef.current);
      } else {
        clearTimeout(idleIdRef.current);
      }
    }

    // Schedule callback
    if ('requestIdleCallback' in window) {
      idleIdRef.current = window.requestIdleCallback(
        () => {
          callbackRef.current();
        },
        { timeout }
      );
    } else {
      // Fallback for browsers without requestIdleCallback
      // Use setTimeout with a reasonable delay
      idleIdRef.current = setTimeout(() => {
        callbackRef.current();
      }, 100) as unknown as number;
    }

    // Cleanup
    return () => {
      if (idleIdRef.current) {
        if ('cancelIdleCallback' in window) {
          window.cancelIdleCallback(idleIdRef.current);
        } else {
          clearTimeout(idleIdRef.current);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, timeout, ...deps]);
}

/**
 * Hook that returns a memoized function to schedule work during idle time
 * Use this when you need manual control over when to schedule idle work
 * 
 * @param timeout - Maximum time to wait before forcing execution (default: 2000ms)
 * @returns Function to schedule a callback during idle time
 */
export function useIdleScheduler(timeout: number = 2000) {
  const scheduleIdle = useCallback((callback: () => void) => {
    if ('requestIdleCallback' in window) {
      return window.requestIdleCallback(callback, { timeout });
    } else {
      return setTimeout(callback, 100) as unknown as number;
    }
  }, [timeout]);

  const cancelIdle = useCallback((id: number) => {
    if ('cancelIdleCallback' in window) {
      window.cancelIdleCallback(id);
    } else {
      clearTimeout(id);
    }
  }, []);

  return { scheduleIdle, cancelIdle };
}

/**
 * Hook that defers state updates until browser is idle
 * Useful for non-critical UI updates that shouldn't block user interaction
 * 
 * @param value - Value to defer
 * @param timeout - Maximum time to wait (default: 1000ms)
 * @returns Deferred value
 */
export function useIdleValue<T>(value: T, timeout: number = 1000): T {
  const [deferredValue, setDeferredValue] = React.useState(value);
  const idleIdRef = useRef<number>();

  useEffect(() => {
    // Cancel any pending update
    if (idleIdRef.current) {
      if ('cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleIdRef.current);
      } else {
        clearTimeout(idleIdRef.current);
      }
    }

    // Schedule update during idle time
    if ('requestIdleCallback' in window) {
      idleIdRef.current = window.requestIdleCallback(
        () => {
          setDeferredValue(value);
        },
        { timeout }
      );
    } else {
      idleIdRef.current = setTimeout(() => {
        setDeferredValue(value);
      }, 50) as unknown as number;
    }

    return () => {
      if (idleIdRef.current) {
        if ('cancelIdleCallback' in window) {
          window.cancelIdleCallback(idleIdRef.current);
        } else {
          clearTimeout(idleIdRef.current);
        }
      }
    };
  }, [value, timeout]);

  return deferredValue;
}

// Import React for useIdleValue
import React from 'react';
