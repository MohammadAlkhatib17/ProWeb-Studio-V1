'use client';

import { useRef, useEffect, lazy } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh, Group, Box3, Vector3, PerspectiveCamera as ThreePerspectiveCamera } from 'three';
import Scene3D from '@/components/Scene3D';

// Dynamic imports for heavy 3D components
const MeshDistortMaterial = lazy(() => import('@react-three/drei').then(module => ({
  default: module.MeshDistortMaterial
})));

const Octahedron = lazy(() => import('@react-three/drei').then(module => ({
  default: module.Octahedron
})));

const Dodecahedron = lazy(() => import('@react-three/drei').then(module => ({
  default: module.Dodecahedron
})));

const Tetrahedron = lazy(() => import('@react-three/drei').then(module => ({
  default: module.Tetrahedron
})));

const PerspectiveCamera = lazy(() => import('@react-three/drei').then(module => ({
  default: module.PerspectiveCamera
})));

interface FloatingShapeProps {
  position: [number, number, number];
  Component: React.ComponentType<Record<string, unknown>>;
  color: string;
  scale?: number;
}

function FloatingShape({ position, Component, color, scale = 1 }: FloatingShapeProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    try {
      if (meshRef.current) {
        meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        meshRef.current.position.y =
          position[1] + Math.sin(state.clock.elapsedTime) * 0.2;
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('FloatingShape animation error:', error);
      }
    }
  });

  return (
    <Component ref={meshRef} position={position} args={[scale, 0]} scale={scale}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.3}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Component>
  );
}

function ResponsivePolyhedraGroup() {
  const { size, camera } = useThree();
  const groupRef = useRef<Group>(null);
  const isMobile = size.width < 768;
  
  // Desktop settings (keep exactly as specified)
  const desktopPositions: [number, number, number][] = [
    [-2, 0, 0],
    [2, 0, 0], 
    [0, 2, -1]
  ];
  const desktopScales = [1.1, 1.05, 0.95];
  
  // Mobile settings (adjusted as specified)
  const mobilePositions: [number, number, number][] = [
    [-1.7, -0.05, 0],
    [1.7, -0.05, 0],
    [0, 1.85, -0.6]
  ];
  const mobileScales = [1.15, 1.12, 1.05];

  const positions = isMobile ? mobilePositions : desktopPositions;
  const scales = isMobile ? mobileScales : desktopScales;

  // Mobile camera positioning with Box3 calculation
  useEffect(() => {
    if (isMobile && groupRef.current && camera instanceof ThreePerspectiveCamera) {
      const box = new Box3().setFromObject(groupRef.current);
      const size = box.getSize(new Vector3());
      const center = box.getCenter(new Vector3());
      
      // Camera fitting calculation
      const fov = 58 * (Math.PI / 180); // Convert to radians
      const aspect = (camera as ThreePerspectiveCamera).aspect;
      const margin = 1.07;
      
      const distance = Math.max(
        (size.y / (2 * Math.tan(fov / 2))),
        (size.x / (2 * Math.tan(fov / 2))) / aspect
      ) * margin;
      
      // Clamp z position between 5.6 and 8.4
      const clampedDistance = Math.max(5.6, Math.min(8.4, distance));
      
      camera.position.set(center.x, center.y, clampedDistance);
      (camera as ThreePerspectiveCamera).fov = 58;
      camera.updateProjectionMatrix();
    }
  }, [isMobile, camera]);

  return (
    <>
      {/* Camera setup - desktop uses fixed settings, mobile is computed */}
      {!isMobile && (
        <PerspectiveCamera
          makeDefault
          fov={50}
          position={[0, 0, 6]}
          near={0.1}
          far={100}
        />
      )}
      {isMobile && (
        <PerspectiveCamera
          makeDefault
          fov={58}
          position={[0, 0, 7]} // Initial position, will be updated by useEffect
          near={0.1}
          far={100}
        />
      )}
      
      {/* Balanced lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-5, -5, 2]} intensity={0.3} />
      
      {/* Three floating shapes */}
      <group ref={groupRef}>
        <FloatingShape
          position={positions[0]}
          Component={Octahedron}
          color="#00ffff"
          scale={scales[0]}
        />
        <FloatingShape
          position={positions[1]}
          Component={Dodecahedron}
          color="#ff00ff"
          scale={scales[1]}
        />
        <FloatingShape
          position={positions[2]}
          Component={Tetrahedron}
          color="#4da6ff"
          scale={scales[2]}
        />
      </group>
    </>
  );
}

export default function ServicesPolyhedra() {
  return (
    <Scene3D>
      <ResponsivePolyhedraGroup />
    </Scene3D>
  );
}
