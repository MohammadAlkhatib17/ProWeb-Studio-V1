'use client';

import { useState, ComponentType, ReactElement, createElement } from 'react';
import { useIdleCallback } from './useIdleCallback';
import { useFirstInput } from './useFirstInput';

/**
 * Hook to lazy-load a component during browser idle time
 * Ideal for non-critical widgets that shouldn't block initial interactivity
 * 
 * @param factory - Function that returns a Promise resolving to the component
 * @param options - Configuration options
 * @returns Lazy component wrapper
 */
export function useLazyComponent<P extends object>(
  factory: () => Promise<{ default: ComponentType<P> }>,
  options: {
    /**
     * Load after first user input (default: true)
     */
    waitForInput?: boolean;
    /**
     * Fallback component to show while loading
     */
    fallback?: ReactElement;
    /**
     * Maximum time to wait before loading (ms, default: 5000)
     */
    timeout?: number;
  } = {}
) {
  const { waitForInput = true, fallback = null, timeout = 5000 } = options;
  const [Component, setComponent] = useState<ComponentType<P> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasFirstInput = useFirstInput();

  const shouldLoad = waitForInput ? hasFirstInput : true;

  useIdleCallback(
    async () => {
      if (Component || isLoading) return;
      
      setIsLoading(true);
      try {
        const module = await factory();
        setComponent(() => module.default);
      } catch (error) {
        console.error('Failed to load lazy component:', error);
      } finally {
        setIsLoading(false);
      }
    },
    {
      enabled: shouldLoad && !Component,
      timeout,
    }
  );

  return { Component, isLoading, fallback };
}

/**
 * Higher-order component to wrap components for lazy loading with idle callback
 * 
 * @example
 * const LazyWidget = withLazyLoad(
 *   () => import('./HeavyWidget'),
 *   { waitForInput: true }
 * );
 */
export function withLazyLoad<P extends object>(
  factory: () => Promise<{ default: ComponentType<P> }>,
  options?: {
    waitForInput?: boolean;
    fallback?: ReactElement;
    timeout?: number;
  }
) {
  return function LazyLoadedComponent(props: P) {
    const { Component, isLoading, fallback } = useLazyComponent(factory, options);

    if (!Component) {
      if (isLoading && fallback) {
        return fallback;
      }
      return fallback || createElement('div', null, 'Loading...');
    }

    return createElement(Component, props);
  };
}

/**
 * Hook to progressively enhance a component by deferring non-critical features
 * Useful for components that have both critical and non-critical UI elements
 * 
 * @param timeout - Time to wait before enabling enhancements (default: 2000ms)
 * @returns Whether enhancements should be enabled
 */
export function useProgressiveEnhancement(timeout: number = 2000): boolean {
  const [isEnhanced, setIsEnhanced] = useState(false);
  const hasFirstInput = useFirstInput();

  useIdleCallback(
    () => {
      setIsEnhanced(true);
    },
    {
      enabled: hasFirstInput,
      timeout,
    }
  );

  return isEnhanced;
}

/**
 * Hook to defer loading of heavy resources (images, videos, scripts) until idle
 * Returns whether the resource should be loaded
 * 
 * @param options - Configuration options
 * @returns Whether to load the resource
 */
export function useDeferredResource(
  options: {
    /**
     * Wait for first input before loading (default: true)
     */
    waitForInput?: boolean;
    /**
     * Maximum time to wait before loading (ms, default: 3000)
     */
    timeout?: number;
  } = {}
): boolean {
  const { waitForInput = true, timeout = 3000 } = options;
  const [shouldLoad, setShouldLoad] = useState(false);
  const hasFirstInput = useFirstInput();

  const canLoad = waitForInput ? hasFirstInput : true;

  useIdleCallback(
    () => {
      setShouldLoad(true);
    },
    {
      enabled: canLoad && !shouldLoad,
      timeout,
    }
  );

  return shouldLoad;
}
