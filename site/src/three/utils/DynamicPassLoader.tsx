'use client';
// src/three/utils/DynamicPassLoader.tsx
import { lazy, Suspense, useState, useCallback } from 'react';
import { Html, useProgress } from '@react-three/drei';

interface DynamicPassLoaderProps {
  importPath: string;
  fallback?: React.ReactNode;
  loadingComponent?: React.ReactNode;
  triggerOnInteraction?: boolean;
  children?: React.ReactNode;
}

function LoadingProgress() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-white text-sm opacity-75">
        Loading 3D effects... {progress.toFixed(0)}%
      </div>
    </Html>
  );
}

export function DynamicPassLoader({
  importPath,
  fallback = null,
  loadingComponent = <LoadingProgress />,
  triggerOnInteraction = false,
  children,
}: DynamicPassLoaderProps) {
  const [shouldLoad, setShouldLoad] = useState(!triggerOnInteraction);
  
  const LazyComponent = lazy(() => import(importPath));
  
  const handleInteraction = useCallback(() => {
    if (triggerOnInteraction && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [triggerOnInteraction, shouldLoad]);

  if (triggerOnInteraction && !shouldLoad) {
    return (
      <group
        onClick={handleInteraction}
        onPointerEnter={handleInteraction}
      >
        {fallback}
        {children}
      </group>
    );
  }

  return (
    <Suspense fallback={loadingComponent}>
      <LazyComponent />
      {children}
    </Suspense>
  );
}

// Specialized loader for heavy materials
export function DynamicMaterialLoader({
  importPath,
  fallback,
  children,
}: {
  importPath: string;
  fallback: React.ReactNode;
  children: React.ReactNode;
}) {
  const LazyMaterial = lazy(() => import(importPath));
  
  return (
    <Suspense fallback={fallback}>
      <LazyMaterial>
        {children}
      </LazyMaterial>
    </Suspense>
  );
}