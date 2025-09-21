'use client';

import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useInView(options: UseInViewOptions = {}) {
  const { threshold = 0.1, rootMargin = '50px', triggerOnce = true } = options;
  const [isInView, setIsInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Ensure client-side only execution
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const element = ref.current;
    if (!element || (triggerOnce && hasTriggered)) return;

    // Check if IntersectionObserver is available
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      // Fallback: assume in view for SSR or unsupported browsers
      setIsInView(true);
      if (triggerOnce) setHasTriggered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsInView(inView);
        
        if (inView && triggerOnce) {
          setHasTriggered(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered, isMounted]);

  return { 
    ref, 
    isInView: isMounted ? (triggerOnce ? hasTriggered : isInView) : false 
  };
}