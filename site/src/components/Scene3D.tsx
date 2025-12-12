'use client';

import { Suspense, useEffect, useState } from 'react';

import { Preload, AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { usePathname } from 'next/navigation';

interface Scene3DProps {
  children: React.ReactNode;
  className?: string;
  adaptive?: boolean; // enable AdaptiveDpr & PerformanceMonitor (defaults to true)
}

/**
 * Scene3D - Hardened 3D Canvas wrapper with guaranteed visibility.
 * 
 * Key fixes for "Vanishing 3D" bug:
 * 1. Explicit CSS dimensions (min-height, width, height) to prevent collapse
 * 2. Path-based key for fresh mount on route changes
 * 3. z-index to ensure visibility above backgrounds
 * 4. Absolute Canvas positioning with explicit sizing
 */
export default function Scene3D({ children, className, adaptive = true }: Scene3DProps) {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // SSR fallback - render placeholder with same dimensions to prevent layout shift
  if (!isMounted) {
    return (
      <div
        className={className || "absolute inset-0"}
        style={{
          minHeight: '500px',
          width: '100%',
          height: '100%',
        }}
      />
    );
  }

  return (
    <div
      key={`scene3d-${pathname}`}
      className={className || "absolute inset-0"}
      style={{
        minHeight: '500px',
        width: '100%',
        height: '100%',
        position: className ? undefined : 'absolute',
        zIndex: 5,
        display: 'block',
      }}
    >
      <Canvas
        dpr={[1, 1.8]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        camera={{
          position: [0, 0, 6],
          fov: 50,
          near: 0.1,
          far: 100
        }}
        onCreated={(state) => {
          // Set transparent clear color
          state.gl.setClearColor('#000000', 0);
        }}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'block',
        }}
      >
        <Suspense fallback={null}>
          {children}
          {adaptive && <AdaptiveDpr />}
          {adaptive && <PerformanceMonitor />}
          {/* Preload only critical scene assets to reduce preload warnings */}
          <Preload />
        </Suspense>
      </Canvas>
    </div>
  );
}
