'use client';

import { Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useDeviceCapabilities, getOptimizedParticleCount } from '@/hooks/useDeviceCapabilities';

// Dynamic imports for heavy 3D components
const HelixKnot = lazy(() => import('@/three/HelixKnot'));
const ParallaxRig = lazy(() => import('@/three/ParallaxRig'));
const StarsShell = lazy(() => import('@/three/StarsShell'));

function Scene() {
  const reduced = useReducedMotion();
  const { capabilities } = useDeviceCapabilities();
  
  // Optimize star count and effects for mobile
  const starCount = getOptimizedParticleCount(reduced ? 400 : 800, capabilities);
  const helixSpeed = reduced ? 0.1 : (capabilities.isMobile ? 0.15 : 0.25);
  const parallaxFactor = reduced ? 0.05 : (capabilities.isMobile ? 0.08 : 0.14);
  
  return (
    <>
      <Suspense fallback={null}>
        <ParallaxRig factor={parallaxFactor}>
          <group scale={capabilities.isMobile ? 1.0 : 1.2} position={[0, 0, 0]}>
            <Suspense fallback={<mesh><sphereGeometry args={[1]} /><meshBasicMaterial color="#a78bfa" /></mesh>}>
              <HelixKnot color="#a78bfa" speed={helixSpeed} />
            </Suspense>
          </group>
          <Suspense fallback={null}>
            <StarsShell 
              count={starCount} 
              radius={10} 
              opacity={capabilities.isMobile ? 0.3 : 0.4} 
              size={0.005} 
            />
          </Suspense>
        </ParallaxRig>
      </Suspense>

      <ambientLight intensity={capabilities.isMobile ? 0.6 : 0.7} />
      <pointLight 
        position={[5, 5, 5]} 
        intensity={capabilities.isMobile ? 1.2 : 1.5} 
        color="#ffffff" 
      />
      {/* Secondary light only on non-mobile devices */}
      {!capabilities.isMobile && (
        <pointLight 
          position={[-5, -5, -5]} 
          intensity={0.8} 
          color="#22d3ee" 
        />
      )}
      <fog 
        attach="fog" 
        args={[
          '#0a0b14', 
          capabilities.isMobile ? 8 : 10, 
          capabilities.isMobile ? 20 : 25
        ]} 
      />
    </>
  )
}

export default function AboutScene() {
  const { optimizedSettings } = useDeviceCapabilities();
  
  return (
    <Canvas
      dpr={optimizedSettings.dpr}
      camera={{ 
        fov: optimizedSettings.cameraFov, 
        position: [0, 0, 8] 
      }}
      gl={{ 
        alpha: true, 
        antialias: optimizedSettings.antialias 
      }}
      shadows={optimizedSettings.enableShadows}
      onCreated={({ gl }) => gl.setClearAlpha(0)}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Scene />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
