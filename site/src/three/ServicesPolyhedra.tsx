'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  Octahedron,
  Dodecahedron,
  Tetrahedron,
  MeshDistortMaterial,
  Bounds,
  PerspectiveCamera,
} from '@react-three/drei';
import * as THREE from 'three';
import Scene3D from '@/components/Scene3D';

interface FloatingShapeProps {
  position: [number, number, number];
  Component: React.ComponentType<Record<string, unknown>>;
  color: string;
  scale?: number;
}

function FloatingShape({ position, Component, color, scale = 1 }: FloatingShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    try {
      if (meshRef.current) {
        meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        meshRef.current.position.y =
          position[1] + Math.sin(state.clock.elapsedTime) * 0.2;
      }
    } catch (error) {
      console.warn('FloatingShape animation error:', error);
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
  const { size } = useThree();
  const isMobile = size.width < 768;
  
  // Responsive scaling and positioning
  const shapeScale = isMobile ? 0.8 : 1;
  const spacing = isMobile ? 1.5 : 2;
  const verticalOffset = isMobile ? 1.5 : 2;

  return (
    <Bounds fit observe clip margin={isMobile ? 1.2 : 1.6}>
      <group>
        {/* Responsive camera setup */}
        <PerspectiveCamera
          makeDefault
          fov={isMobile ? 62 : 50}
          position={[0, 0, isMobile ? 7.5 : 6]}
          near={0.1}
          far={100}
        />
        
        {/* Balanced lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <directionalLight position={[-5, -5, 2]} intensity={0.3} />
        
        {/* Three floating shapes with responsive positioning */}
        <FloatingShape
          position={[-spacing, 0, 0]}
          Component={Octahedron}
          color="#00ffff"
          scale={shapeScale}
        />
        <FloatingShape
          position={[spacing, 0, 0]}
          Component={Dodecahedron}
          color="#ff00ff"
          scale={shapeScale}
        />
        <FloatingShape
          position={[0, verticalOffset, -1]}
          Component={Tetrahedron}
          color="#4da6ff"
          scale={shapeScale}
        />
      </group>
    </Bounds>
  );
}

export default function ServicesPolyhedra() {
  return (
    <Scene3D>
      <ResponsivePolyhedraGroup />
    </Scene3D>
  );
}
