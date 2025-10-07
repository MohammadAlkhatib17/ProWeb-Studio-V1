'use client';
import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import ParallaxRig from '@/three/ParallaxRig';
import StarsShell from '@/three/StarsShell';
import FacetedSolid from '@/three/FacetedSolid';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useDeviceCapabilities, getOptimizedParticleCount } from '@/hooks/useDeviceCapabilities';
import { useMobile3DSettings } from '@/hooks/useMobile3DSettings';

// Floating light particles
function LightParticles({
  count = 50,
  reduced = false,
}: {
  count?: number;
  reduced?: boolean;
}) {
  const particles = useRef<THREE.Points>(null!);

  const { positions, scales } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sc = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute particles in a sphere around the scene
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 2;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      sc[i] = Math.random();
    }

    return { positions: pos, scales: sc };
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    return geo;
  }, [positions, scales]);

  useFrame((state) => {
    if (!particles.current || reduced) return;

    const time = state.clock.elapsedTime;
    const positions = particles.current.geometry.attributes.position;
    const scales = particles.current.geometry.attributes.scale;

    for (let i = 0; i < count; i++) {
      // Gentle floating motion
      const i3 = i * 3;
      const t = time * 0.5 + i * 0.1;
      
      positions.array[i3 + 1] += Math.sin(t) * 0.001;
      scales.array[i] = 0.5 + Math.sin(t * 2) * 0.3;
    }

    positions.needsUpdate = true;
    scales.needsUpdate = true;
  });

  const material = useMemo(() => new THREE.PointsMaterial({
    color: new THREE.Color(1, 0.8, 0.4),
    size: 0.05,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), []);

  return (
    <points ref={particles} geometry={geometry} material={material} />
  );
}

// Enhanced volumetric light
function VolumetricLight() {
  const lightRef = useRef<THREE.SpotLight>(null!);
  
  useFrame((state) => {
    if (!lightRef.current) return;
    
    const time = state.clock.elapsedTime;
    lightRef.current.intensity = 0.8 + Math.sin(time * 0.5) * 0.2;
  });

  return (
    <spotLight
      ref={lightRef}
      position={[0, 8, 5]}
      angle={Math.PI / 3}
      penumbra={0.8}
      intensity={1}
      color="#4FC3F7"
      castShadow={false} // Disabled for mobile performance
    />
  );
}

export default function OptimizedHeroScene() {
  const reduced = useReducedMotion();
  const { capabilities } = useDeviceCapabilities();
  const { settings, shouldRender3D, debugInfo } = useMobile3DSettings();
  
  // Use mobile-optimized settings
  const spin = reduced ? 0.3 : 0.85;
  const factor = reduced ? 0.05 : (capabilities.isMobile ? 0.08 : 0.14);
  
  // Optimize particle counts based on mobile settings
  const starCount = getOptimizedParticleCount(
    settings.quality === 'low' ? 400 : 
    settings.quality === 'medium' ? 800 : 1200, 
    capabilities
  );
  
  const particleCount = reduced || !shouldRender3D ? 0 : 
    getOptimizedParticleCount(settings.particleCount, capabilities);
  
  // Adjust lighting intensity for mobile
  const lightIntensity = capabilities.isMobile ? 0.6 : 1.0;

  // Don't render complex 3D on very low-end devices
  if (!shouldRender3D) {
    return null;
  }

  return (
    <>
      <ParallaxRig factor={factor}>
        <group scale={1.12} position={[0, 0.1, 0]}>
          <FacetedSolid spin={spin} />
        </group>
        <StarsShell count={starCount} radius={20} opacity={0.55} size={0.007} />
      </ParallaxRig>

      {particleCount > 0 && (
        <LightParticles count={particleCount} reduced={reduced} />
      )}

      <VolumetricLight />

      {/* Ambient lighting optimized for mobile */}
      <ambientLight intensity={capabilities.isMobile ? 0.4 : 0.6} />
      
      {/* Point lights - reduced count for mobile */}
      <pointLight 
        position={[10, 10, 10]} 
        intensity={lightIntensity * 0.8} 
        color="#E1F5FE"
      />
      {!capabilities.isMobile && (
        <>
          <pointLight 
            position={[-10, -10, -5]} 
            intensity={lightIntensity * 0.4} 
            color="#F3E5F5"
          />
          <pointLight 
            position={[
              capabilities.isMobile ? 15 : 25, 
              capabilities.isMobile ? 20 : 30, 
              capabilities.isMobile ? 28 : 35
            ]} 
          />
        </>
      )}
      
      {/* Development debug info */}
      {debugInfo && (
        <mesh position={[0, 0, 0]} visible={false}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshBasicMaterial color="red" />
        </mesh>
      )}
    </>
  );
}