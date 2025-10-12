"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";

// Lightweight viewport detection hook
function useInViewport(threshold = 0.1, rootMargin = "100px") {
  const [isInView, setIsInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasLoaded) return;

    // Fallback for older browsers
    if (!("IntersectionObserver" in window)) {
      setIsInView(true);
      setHasLoaded(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, hasLoaded]);

  return { ref, isInView };
}

interface ViewportAware3DProps {
  importFn: () => Promise<{ default: React.ComponentType<unknown> }>;
  fallback?: React.ReactNode;
  className?: string;
  componentProps?: Record<string, unknown>;
}

export default function ViewportAware3D({
  importFn,
  fallback,
  className,
  componentProps = {},
}: ViewportAware3DProps) {
  const { ref, isInView } = useInViewport(0.1, "100px");
  const [LazyComponent, setLazyComponent] =
    useState<React.ComponentType<unknown> | null>(null);

  useEffect(() => {
    if (isInView && !LazyComponent) {
      const Component = lazy(importFn);
      setLazyComponent(() => Component);
    }
  }, [isInView, importFn, LazyComponent]);

  const defaultFallback = (
    <div
      className={`bg-cosmic-900/50 animate-pulse rounded-lg ${className || "h-[300px] sm:h-[350px] md:h-[400px] w-full"}`}
      aria-label="Loading 3D scene..."
    />
  );

  return (
    <div ref={ref} className={className}>
      {isInView && LazyComponent ? (
        <Suspense fallback={fallback || defaultFallback}>
          <LazyComponent {...componentProps} />
        </Suspense>
      ) : (
        fallback || defaultFallback
      )}
    </div>
  );
}
