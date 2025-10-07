'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

interface LazyHero3DWrapperProps {
  children: React.ReactNode;
  className?: string;
  fallback?: React.ReactNode;
}

/**
 * Lazy-loading wrapper for 3D hero scene that:
 * 1. Uses intersection observer to detect when hero enters viewport
 * 2. Uses requestIdleCallback to wait for main thread idle time
 * 3. Only then loads and renders the 3D scene
 * 4. Provides fallback while loading
 */
export default function LazyHero3DWrapper({ 
  children, 
  className = '',
  fallback = null
}: LazyHero3DWrapperProps) {
  const [shouldLoad3D, setShouldLoad3D] = useState(false);
  const [is3DLoaded, setIs3DLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { capabilities } = useDeviceCapabilities();

  // Create intersection observer to detect when hero is in viewport
  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    
    if (entry.isIntersecting && !shouldLoad3D) {
      // Hero is now visible, but wait for idle time before loading 3D
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          setShouldLoad3D(true);
        }, { timeout: 1000 }); // Max 1s timeout
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          setShouldLoad3D(true);
        }, 100);
      }
    }
  }, [shouldLoad3D]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Skip 3D loading entirely for very low-end devices
    if (capabilities.isLowEndDevice && capabilities.isMobile) {
      return; // Keep fallback permanently
    }

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '100px', // Start loading when hero is 100px away from viewport
      threshold: 0.1,
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [observerCallback, capabilities]);

  // Handle 3D scene loading
  useEffect(() => {
    if (shouldLoad3D && !is3DLoaded) {
      // Give a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIs3DLoaded(true);
      }, 50);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [shouldLoad3D, is3DLoaded]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Always render fallback initially */}
      {fallback && (!is3DLoaded || capabilities.isLowEndDevice)}
      
      {/* Render 3D scene only when loaded and not on very low-end devices */}
      {is3DLoaded && !capabilities.isLowEndDevice && (
        <div 
          className="absolute inset-0"
          style={{
            opacity: 1,
            transition: 'opacity 0.5s ease-in-out'
          }}
        >
          {children}
        </div>
      )}
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 z-50 bg-black/80 text-white text-xs p-2 rounded">
          <div>3D Loading: {shouldLoad3D ? 'Yes' : 'No'}</div>
          <div>3D Loaded: {is3DLoaded ? 'Yes' : 'No'}</div>
          <div>Low-end: {capabilities.isLowEndDevice ? 'Yes' : 'No'}</div>
          <div>Mobile: {capabilities.isMobile ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  );
}