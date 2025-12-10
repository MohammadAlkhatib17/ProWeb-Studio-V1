/**
 * Optimized 3D component loader with progressive enhancement
 * Implements lazy loading, suspense boundaries, and performance monitoring for 3D elements
 */

import React, { Suspense, ComponentType, ReactNode } from 'react';

import dynamic from 'next/dynamic';

interface Progressive3DLoaderProps {
  /**
   * Component to load dynamically
   */
  component: () => Promise<{ default: ComponentType<Record<string, unknown>> }>;

  /**
   * Fallback component while loading
   */
  fallback?: ReactNode;

  /**
   * Props to pass to the 3D component
   */
  componentProps?: Record<string, unknown>;

  /**
   * Whether to enable client-side only rendering
   */
  ssr?: boolean;

  /**
   * Loading priority (affects when the component loads)
   */
  priority?: 'immediate' | 'viewport' | 'interaction';

  /**
   * Performance threshold in milliseconds
   */
  performanceThreshold?: number;

  /**
   * Enable WebGL capability detection
   */
  requireWebGL?: boolean;

  /**
   * Reduced motion fallback
   */
  reducedMotionFallback?: ReactNode;

  /**
   * Custom class names
   */
  className?: string;

  /**
   * Static image to show before 3D loads (improves LCP)
   */
  staticImage?: string;
  staticImageAlt?: string;
}

/**
 * Default fallback component for 3D elements
 */
const Default3DFallback = ({ className }: { className?: string }) => (
  <div
    className={`animate-pulse bg-gradient-to-br from-cosmic-800/40 to-cosmic-900/60 rounded-lg ${className || 'w-full h-full'}`}
    role="img"
    aria-label="3D content loading..."
  >
    <div className="w-full h-full flex items-center justify-center">
      <div className="space-y-2 text-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-cosmic-400">Loading 3D content...</p>
      </div>
    </div>
  </div>
);

/**
 * Reduced motion fallback component
 */
const ReducedMotionFallback = ({ className }: { className?: string }) => (
  <div
    className={`bg-gradient-to-br from-cosmic-800/60 to-cosmic-900/80 rounded-lg border border-cosmic-700/40 ${className || 'w-full h-full'}`}
    role="img"
    aria-label="Static content (reduced motion enabled)"
  >
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <div className="text-4xl">✨</div>
        <p className="text-cosmic-300 text-sm">
          3D visualization available<br />
          <span className="text-cosmic-500">(Motion reduced)</span>
        </p>
      </div>
    </div>
  </div>
);

/**
 * WebGL capability detector
 */
function detectWebGLSupport(): boolean {
  if (typeof window === 'undefined') return true; // Assume support on server

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
}

/**
 * Reduced motion detector
 */
function detectReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Performance monitor for 3D components
 */
function usePerformanceMonitor(threshold: number = 16.67) { // 60fps threshold
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    let frameCount = 0;
    let lastTime = performance.now();
    let rafId: number;

    function monitor() {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;

      frameCount++;

      // Check every 60 frames (approximately 1 second)
      if (frameCount >= 60) {
        const avgFrameTime = deltaTime / frameCount;

        if (avgFrameTime > threshold) {
          console.warn(`3D Performance Warning: Average frame time ${avgFrameTime.toFixed(2)}ms (> ${threshold}ms)`);
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      rafId = requestAnimationFrame(monitor);
    }

    rafId = requestAnimationFrame(monitor);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [threshold]);
}

/**
 * Intersection observer hook for viewport-based loading
 */
function useIntersectionLoader(priority: string, enabled: boolean = true) {
  const [isVisible, setIsVisible] = React.useState(priority === 'immediate');
  const [hasLoaded, setHasLoaded] = React.useState(priority === 'immediate');
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!enabled || priority === 'immediate' || hasLoaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasLoaded(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px' // Start loading before fully visible
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [priority, hasLoaded, enabled]);

  return { ref, shouldLoad: hasLoaded, isVisible };
}

/**
 * Progressive 3D component loader with all optimizations
 */
export function Progressive3DLoader({
  component,
  fallback,
  componentProps = {},
  ssr = false,
  priority = 'viewport',
  performanceThreshold = 16.67,
  requireWebGL = true,
  reducedMotionFallback,
  className,
  staticImage,
  staticImageAlt = '3D Preview',
}: Progressive3DLoaderProps) {
  const [webGLSupported, setWebGLSupported] = React.useState(true);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [showStatic, setShowStatic] = React.useState(!!staticImage);
  const { ref, shouldLoad } = useIntersectionLoader(priority, true);

  // Performance monitoring
  usePerformanceMonitor(performanceThreshold);

  // Client-side capability detection
  React.useEffect(() => {
    setWebGLSupported(!requireWebGL || detectWebGLSupport());
    setReducedMotion(detectReducedMotion());
  }, [requireWebGL]);

  // Hybrid Rendering Strategy:
  // If staticImage is present, we show it first.
  // We only switch to 3D when:
  // 1. Component should load (in viewport)
  // 2. Browser is idle (to avoid blocking main thread during initial page load)
  React.useEffect(() => {
    if (!staticImage || !shouldLoad) return;

    // If priority is immediate, swap ASAP
    if (priority === 'immediate') {
      setShowStatic(false);
      return;
    }

    // Otherwise wait for idle
    const idleCallback = (window as any).requestIdleCallback
      ? (window as any).requestIdleCallback(() => setShowStatic(false))
      : setTimeout(() => setShowStatic(false), 1000);

    return () => {
      if ((window as any).cancelIdleCallback) {
        (window as any).cancelIdleCallback(idleCallback);
      } else {
        clearTimeout(idleCallback as number);
      }
    };
  }, [shouldLoad, staticImage, priority]);

  // Create dynamic component with optimizations
  const DynamicComponent = React.useMemo(() => {
    return dynamic(component, {
      ssr,
      loading: () => (fallback as React.ReactElement) || <Default3DFallback className={className} />,
    });
  }, [component, ssr, fallback, className]);

  // Handle reduced motion preference
  if (reducedMotion && reducedMotionFallback) {
    return <div ref={ref} className={className}>{reducedMotionFallback}</div>;
  }

  if (reducedMotion) {
    return (
      <div ref={ref} className={className}>
        <ReducedMotionFallback className="w-full h-full" />
      </div>
    );
  }

  // Static Image Mode (Hybrid)
  if (showStatic && staticImage) {
    return (
      <div ref={ref} className={`relative ${className}`}>
        {/* Render static image for LCP */}
        <img
          src={staticImage}
          alt={staticImageAlt}
          className="w-full h-full object-cover transition-opacity duration-500"
          width={800} // Reasonable default
          height={600}
          fetchPriority={priority === 'immediate' ? 'high' : 'auto'}
        />
        {/* Optional: Add a "Interact to load" badge if desired, but auto-swap is smoother */}
      </div>
    );
  }

  // Handle WebGL requirement
  if (requireWebGL && !webGLSupported) {
    return (
      <div ref={ref} className={className}>
        <div className="w-full h-full flex items-center justify-center p-8 bg-cosmic-900/40 rounded-lg border border-cosmic-700/40">
          <div className="text-center space-y-4">
            <div className="text-4xl">🖥️</div>
            <p className="text-cosmic-300 text-sm">
              WebGL not supported<br />
              <span className="text-cosmic-500">Static content shown</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Don't load until conditions are met
  if (!shouldLoad) {
    return (
      <div ref={ref} className={className}>
        {staticImage ? (
          <img
            src={staticImage}
            alt={staticImageAlt}
            className="w-full h-full object-cover"
          />
        ) : (
          fallback || <Default3DFallback className="w-full h-full" />
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <Suspense fallback={fallback || <Default3DFallback className="w-full h-full" />}>
        <DynamicComponent {...componentProps} />
      </Suspense>
    </div>
  );
}

/**
 * Convenience hook for creating optimized 3D loaders
 */
export function use3DLoader(
  componentPath: string,
  options: Partial<Progressive3DLoaderProps> = {}
) {
  const component = React.useCallback(
    () => import(componentPath),
    [componentPath]
  );

  return React.useCallback(
    (props: Record<string, unknown> = {}) => (
      <Progressive3DLoader
        component={component}
        componentProps={props}
        {...options}
      />
    ),
    [component, options]
  );
}

/**
 * Pre-configured loaders for common 3D components
 */
export const Optimized3DLoaders = {
  HeroScene: (props: Record<string, unknown> = {}) => (
    <Progressive3DLoader
      component={() => import('@/three/HeroScene')}
      componentProps={props}
      priority="immediate"
      className="w-full h-full"
      performanceThreshold={16.67}
    />
  ),

  HexagonalPrism: (props: Record<string, unknown> = {}) => (
    <Progressive3DLoader
      component={() => import('@/three/HexagonalPrism')}
      componentProps={props}
      priority="viewport"
      className="w-full h-full"
      performanceThreshold={33.33} // 30fps for less critical 3D
    />
  ),
};

export default Progressive3DLoader;