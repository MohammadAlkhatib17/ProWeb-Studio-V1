/**
 * Simplified 3D component loader with guaranteed rendering
 * Removes complex requestIdleCallback logic in favor of immediate, reliable rendering
 */

'use client';

import React, { Suspense, ComponentType, ReactNode, useState, useEffect, useRef } from 'react';
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
   * Custom class names
   */
  className?: string;

  /**
   * Static image to show before 3D loads (improves LCP)
   */
  staticImage?: string;
  staticImageAlt?: string;

  /**
   * Timeout in ms before forcing 3D display (handles cached asset race)
   */
  forceTimeout?: number;
}

/**
 * Default fallback component for 3D elements
 */
const Default3DFallback = ({ className }: { className?: string }) => (
  <div
    className={`animate-pulse bg-gradient-to-br from-cosmic-800/40 to-cosmic-900/60 rounded-lg ${className || 'w-full h-full min-h-[300px]'}`}
    role="img"
    aria-label="3D content loading..."
  >
    <div className="w-full h-full flex items-center justify-center min-h-[300px]">
      <div className="space-y-2 text-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-cosmic-400">Loading 3D content...</p>
      </div>
    </div>
  </div>
);

/**
 * WebGL capability detector
 */
function detectWebGLSupport(): boolean {
  if (typeof window === 'undefined') return true;

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
 * Reduced motion fallback component
 */
const ReducedMotionFallback = ({ className }: { className?: string }) => (
  <div
    className={`bg-gradient-to-br from-cosmic-800/60 to-cosmic-900/80 rounded-lg border border-cosmic-700/40 ${className || 'w-full h-full min-h-[300px]'}`}
    role="img"
    aria-label="Static content (reduced motion enabled)"
  >
    <div className="w-full h-full flex items-center justify-center p-8 min-h-[300px]">
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
 * WebGL not supported fallback
 */
const NoWebGLFallback = ({ className }: { className?: string }) => (
  <div
    className={`w-full h-full flex items-center justify-center p-8 bg-cosmic-900/40 rounded-lg border border-cosmic-700/40 min-h-[300px] ${className || ''}`}
  >
    <div className="text-center space-y-4">
      <div className="text-4xl">🖥️</div>
      <p className="text-cosmic-300 text-sm">
        WebGL not supported<br />
        <span className="text-cosmic-500">Static content shown</span>
      </p>
    </div>
  </div>
);

/**
 * Simplified Progressive 3D Loader
 * 
 * Strategy:
 * 1. Render the <Canvas> wrapper IMMEDIATELY on mount (hidden with opacity-0)
 * 2. Set isLoaded=true immediately when document is ready
 * 3. Fade in the 3D content with CSS transition
 * 4. No complex requestIdleCallback - prioritize guaranteed visibility
 */
export function Progressive3DLoader({
  component,
  fallback,
  componentProps = {},
  ssr = false,
  className,
  staticImage,
  staticImageAlt = '3D Preview',
  forceTimeout = 100, // Short timeout to handle cached assets
}: Progressive3DLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const mountedRef = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Create dynamic component with next/dynamic
  const DynamicComponent = React.useMemo(() => {
    return dynamic(component, {
      ssr,
      loading: () => (fallback as React.ReactElement) || <Default3DFallback className={className} />,
    });
  }, [component, ssr, fallback, className]);

  // Client-side capability detection
  useEffect(() => {
    setWebGLSupported(detectWebGLSupport());
    setReducedMotion(detectReducedMotion());
  }, []);

  // CRITICAL: Force visibility on mount
  // This handles the race condition where cached assets load instantly
  useEffect(() => {
    mountedRef.current = true;

    // Immediately mark as loaded if document is ready
    if (typeof document !== 'undefined') {
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setIsLoaded(true);
      } else {
        // Wait for DOMContentLoaded
        const handleLoaded = () => {
          if (mountedRef.current) {
            setIsLoaded(true);
          }
        };
        document.addEventListener('DOMContentLoaded', handleLoaded);

        // Safety timeout - force load after forceTimeout ms regardless
        timeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            setIsLoaded(true);
          }
        }, forceTimeout);

        return () => {
          document.removeEventListener('DOMContentLoaded', handleLoaded);
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
      }
    }

    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [forceTimeout]);

  // Trigger fade-in after content is loaded
  useEffect(() => {
    if (isLoaded) {
      // Small delay to ensure DOM has rendered before triggering transition
      const fadeTimer = setTimeout(() => {
        if (mountedRef.current) {
          setShowContent(true);
        }
      }, 50);

      return () => clearTimeout(fadeTimer);
    }
    return undefined; // Explicit return for all code paths
  }, [isLoaded]);

  // Handle reduced motion preference
  if (reducedMotion) {
    return (
      <div className={`w-full h-full min-h-[300px] ${className || ''}`}>
        <ReducedMotionFallback className="w-full h-full" />
      </div>
    );
  }

  // Handle WebGL not supported
  if (!webGLSupported) {
    return (
      <div className={`w-full h-full min-h-[300px] ${className || ''}`}>
        <NoWebGLFallback className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full min-h-[300px] ${className || ''}`}>
      {/* Static image layer (shown initially, fades out) */}
      {staticImage && (
        <div
          className={`absolute inset-0 z-10 transition-opacity duration-500 ${showContent ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <img
            src={staticImage}
            alt={staticImageAlt}
            className="w-full h-full object-cover"
            width={800}
            height={600}
            fetchPriority="high"
          />
        </div>
      )}

      {/* 3D Content layer - always rendered, fades in */}
      <div
        className={`absolute inset-0 z-20 w-full h-full transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}
        style={{ minHeight: '300px' }}
      >
        <Suspense fallback={fallback || <Default3DFallback className="w-full h-full min-h-[300px]" />}>
          <DynamicComponent {...componentProps} />
        </Suspense>
      </div>

      {/* Fallback when not yet showing content and no static image */}
      {!showContent && !staticImage && (
        <div className="absolute inset-0 z-5">
          {fallback || <Default3DFallback className="w-full h-full min-h-[300px]" />}
        </div>
      )}
    </div>
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
      className="w-full h-full min-h-[500px]"
      forceTimeout={50}
    />
  ),

  HexagonalPrism: (props: Record<string, unknown> = {}) => (
    <Progressive3DLoader
      component={() => import('@/three/HexagonalPrism')}
      componentProps={props}
      className="w-full h-full min-h-[300px]"
      forceTimeout={100}
    />
  ),
};

export default Progressive3DLoader;