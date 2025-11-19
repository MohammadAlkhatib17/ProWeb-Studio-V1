'use client';

import { Suspense, ComponentType, lazy } from 'react';
import { useInView } from '@/hooks/useInView';

interface ViewportLazy3DProps {
  className?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}

function ViewportLazy3D({ 
  className, 
  fallback, 
  children, 
  threshold = 0.1, 
  rootMargin = '100px' 
}: ViewportLazy3DProps) {
  const { ref, isInView } = useInView({ 
    threshold, 
    rootMargin,
    triggerOnce: true 
  });

  const defaultFallback = (
    <div 
      className={`bg-cosmic-900/50 animate-pulse rounded-lg ${className || 'h-[300px] sm:h-[350px] md:h-[400px] w-full'}`}
      aria-label="Loading 3D scene..."
    />
  );

  return (
    <div ref={ref} className={className}>
      {isInView ? (
        <Suspense fallback={fallback || defaultFallback}>
          {children}
        </Suspense>
      ) : (
        fallback || defaultFallback
      )}
    </div>
  );
}

// Factory function for creating viewport-aware dynamic 3D components
export function createViewportLazy3D<T = Record<string, unknown>>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: {
    className?: string;
    fallback?: React.ReactNode;
    threshold?: number;
    rootMargin?: string;
  } = {}
) {
  const LazyComponent = lazy(importFn);
  
  return function ViewportLazy3DComponent(props: T) {
    return (
      <ViewportLazy3D {...options}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <LazyComponent {...props as any} />
      </ViewportLazy3D>
    );
  };
}

export default ViewportLazy3D;