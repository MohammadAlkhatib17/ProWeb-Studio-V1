'use client';
import { Suspense, useEffect, useState, useRef } from 'react';

import { Preload } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { PCFSoftShadowMap } from 'three';

import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

type Props = { children: React.ReactNode; className?: string };

export default function HeroCanvas({ children, className }: Props) {
  const { optimizedSettings } = useDeviceCapabilities();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Delay hydration to avoid blocking LCP
  useEffect(() => {
    // Use requestIdleCallback or setTimeout for non-critical rendering
    const timeout = setTimeout(() => setIsHydrated(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  // Use IntersectionObserver for visibility-based rendering
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={className ?? ''}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'block',
        minHeight: '1px'
      }}
    >
      {/* Only render Canvas after hydration and when visible */}
      {isHydrated && (
        <Canvas
          frameloop={isVisible ? 'always' : 'demand'} // Pause when not visible
          dpr={optimizedSettings.dpr}
          gl={{
            antialias: optimizedSettings.antialias,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          camera={{
            position: [0, 0, 6],
            fov: optimizedSettings.cameraFov
          }}
          performance={{ min: 0.5 }}
          shadows={optimizedSettings.enableShadows}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);

            if (optimizedSettings.enableShadows) {
              gl.shadowMap.enabled = true;
              gl.shadowMap.type = PCFSoftShadowMap;
            }

            const canvas = gl.domElement as HTMLCanvasElement;
            const onLost = (e: Event) => e.preventDefault();
            canvas.addEventListener('webglcontextlost', onLost as EventListener, { passive: false });
          }}
          style={{
            background: 'transparent',
            width: '100%',
            height: '100%',
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          <Suspense fallback={null}>
            {children}
            <Preload />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}

