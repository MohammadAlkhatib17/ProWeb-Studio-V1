/**
 * Optimized Layout Component
 * Prevents hydration mismatches and improves FCP performance
 */

'use client';

import { useEffect, useState } from 'react';

interface OptimizedLayoutProps {
  children: React.ReactNode;
  enableVisualEffects?: boolean;
}

export default function OptimizedLayout({ 
  children, 
  enableVisualEffects = true 
}: OptimizedLayoutProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [shouldLoadVisualEffects, setShouldLoadVisualEffects] = useState(false);

  useEffect(() => {
    // Mark component as hydrated
    setIsHydrated(true);

    if (!enableVisualEffects) return;

    // Defer visual effects loading after hydration
    const timer = setTimeout(() => {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (!prefersReducedMotion) {
        setShouldLoadVisualEffects(true);
      }
    }, 100); // Small delay to ensure clean hydration

    return () => clearTimeout(timer);
  }, [enableVisualEffects]);

  // Prevent SSR/client mismatch by only rendering after hydration
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-cosmic-900">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic-900">
      {children}
      {shouldLoadVisualEffects && (
        <div id="visual-effects-container" />
      )}
    </div>
  );
}