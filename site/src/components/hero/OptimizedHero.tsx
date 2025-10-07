'use client';

import { Suspense, lazy } from 'react';
import StaticHeroBaseline from './StaticHeroBaseline';
import LazyHero3DWrapper from './LazyHero3DWrapper';

// Lazy load the 3D components only when needed
const HeroCanvas = lazy(() => import('@/components/HeroCanvas'));
const OptimizedHeroScene = lazy(() => import('@/three/OptimizedHeroScene'));

interface OptimizedHeroProps {
  className?: string;
}

/**
 * Optimized hero component that:
 * 1. Renders static baseline immediately for fast LCP
 * 2. Lazy-loads 3D scene only when hero intersects viewport + requestIdleCallback
 * 3. Defaults mobile devices to low quality preset
 * 4. Provides graceful fallback for low-end devices
 */
export default function OptimizedHero({ className = '' }: OptimizedHeroProps) {
  // Static poster image fallback (shown immediately and during 3D loading)
  const staticFallback = (
    <div className="absolute inset-0 z-0">
      <div 
        className="w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%),
            url('/assets/hero_portal_background.avif')
          `,
        }}
      />
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      {/* Always render static baseline first for immediate LCP */}
      <StaticHeroBaseline />
      
      {/* Lazy-loaded 3D scene overlay */}
      <LazyHero3DWrapper
        className="absolute inset-0 z-0"
        fallback={staticFallback}
      >
        <Suspense fallback={null}>
          <HeroCanvas className="w-full h-full">
            <OptimizedHeroScene />
          </HeroCanvas>
        </Suspense>
      </LazyHero3DWrapper>
    </div>
  );
}