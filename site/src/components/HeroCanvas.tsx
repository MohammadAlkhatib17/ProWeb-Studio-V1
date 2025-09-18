"use client";
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Preload } from '@react-three/drei';
import * as THREE from 'three';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';
import HeroFallback from './HeroFallback';
import { WebGLContextRegistry } from '@/three/WebGLContextRegistry';

type Props = { children: React.ReactNode; className?: string };

export default function HeroCanvas({ children, className }: Props) {
  const { optimizedSettings, capabilities } = useDeviceCapabilities();
  const [mounted, setMounted] = useState(false);
  const [showFallback, setShowFallback] = useState(true);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const loggedLostRef = useRef(false);
  const loggedRestoredRef = useRef(false);
  const lostTimeoutRef = useRef<number | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const glCtxRef = useRef<WebGLRenderingContext | WebGL2RenderingContext | null>(null);
  const checkTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Clamp DPR and disable MSAA on narrow/mobile viewports to reduce memory pressure
  const { dpr, antialias } = useMemo(() => {
    const narrow = typeof window !== 'undefined' && window.innerWidth <= 600;
    const clampedDpr: [number, number] = narrow ? [1, 1.5] : optimizedSettings.dpr;
    const aa = narrow ? false : (optimizedSettings.antialias && !capabilities?.isMobile ? true : optimizedSettings.antialias);
    return { dpr: clampedDpr, antialias: aa && !narrow };
  }, [optimizedSettings.dpr, optimizedSettings.antialias, capabilities?.isMobile]);

  return (
    <div
      ref={canvasRef}
      className={className ?? ''}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      {/* Static visual fallback — absolutely positioned, no layout shift */}
      {mounted && showFallback && (
        <div id="hero-fallback" className="absolute inset-0 z-10">
          <HeroFallback />
        </div>
      )}

      <Canvas
        frameloop="always"
        dpr={dpr}
        gl={{
          antialias,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        camera={{ position: [0, 0, 6], fov: optimizedSettings.cameraFov }}
        performance={{ min: 0.5 }}
        shadows={optimizedSettings.enableShadows}
        onCreated={({ gl, setFrameloop }) => {
          gl.setClearColor(0x000000, 0);

          if (optimizedSettings.enableShadows) {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }

          // Hide fallback after first render tick
          requestAnimationFrame(() => setShowFallback(false));

          const canvas = gl.domElement as HTMLCanvasElement;
          canvas.setAttribute('data-hero-canvas', '');

          const renderer = gl as unknown as THREE.WebGLRenderer;
          rendererRef.current = renderer;
          const ctxGetter = (renderer as unknown as { getContext?: () => WebGLRenderingContext | WebGL2RenderingContext }).getContext;
          const ctx = typeof ctxGetter === 'function' ? ctxGetter() : null;
          glCtxRef.current = ctx ?? null;
          if (ctx) {
            WebGLContextRegistry.claim({
              ctx,
              renderer,
              canvas,
              dispose: () => {
                try { renderer.dispose(); } catch {}
              },
              label: 'hero',
            });
          }

          const onLost = (e: Event) => {
            e.preventDefault();
            try { setFrameloop('never'); } catch {}
            if (lostTimeoutRef.current) window.clearTimeout(lostTimeoutRef.current);
            lostTimeoutRef.current = window.setTimeout(() => {
              setShowFallback(true);
            }, 140);
            if (checkTimerRef.current) window.clearInterval(checkTimerRef.current);
            // Safety: periodically check if context is restored even if the event doesn't fire
            if (glCtxRef.current) {
              checkTimerRef.current = window.setInterval(() => {
                if (glCtxRef.current && !glCtxRef.current.isContextLost()) {
                  try { setFrameloop('always'); } catch {}
                  requestAnimationFrame(() => setShowFallback(false));
                  if (checkTimerRef.current) {
                    window.clearInterval(checkTimerRef.current);
                    checkTimerRef.current = null;
                  }
                }
              }, 250) as unknown as number;
            }
            if (process.env.NODE_ENV !== 'production' && !loggedLostRef.current) {
              console.info('[webgl] contextlost');
              loggedLostRef.current = true;
              loggedRestoredRef.current = false;
            }
          };
          const onRestored = () => {
            if (lostTimeoutRef.current) {
              window.clearTimeout(lostTimeoutRef.current);
              lostTimeoutRef.current = null;
            }
            try { setFrameloop('always'); } catch {}
            requestAnimationFrame(() => setShowFallback(false));
            if (checkTimerRef.current) {
              window.clearInterval(checkTimerRef.current);
              checkTimerRef.current = null;
            }
            if (process.env.NODE_ENV !== 'production' && !loggedRestoredRef.current) {
              console.info('[webgl] contextrestored');
              loggedRestoredRef.current = true;
              loggedLostRef.current = false;
            }
          };

          canvas.addEventListener('webglcontextlost', onLost as EventListener, { passive: false } as AddEventListenerOptions);
          canvas.addEventListener('webglcontextrestored', onRestored as EventListener);

          // Cleanup on unmount — remove listeners and allow GC to reclaim resources
          return () => {
            canvas.removeEventListener('webglcontextlost', onLost as EventListener);
            canvas.removeEventListener('webglcontextrestored', onRestored as EventListener);
            if (lostTimeoutRef.current) {
              window.clearTimeout(lostTimeoutRef.current);
              lostTimeoutRef.current = null;
            }
            if (checkTimerRef.current) {
              window.clearInterval(checkTimerRef.current);
              checkTimerRef.current = null;
            }
            try { WebGLContextRegistry.release(renderer); } catch {}
            try { (renderer as THREE.WebGLRenderer).dispose(); } catch {}
          };
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {children}
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
