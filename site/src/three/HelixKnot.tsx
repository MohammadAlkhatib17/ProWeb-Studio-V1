'use client';
// src/three/HelixKnot.tsx
import { useRef, useMemo, lazy, Suspense } from 'react';
import { TorusKnotGeometry, Mesh } from 'three';
import { useFrame } from '@react-three/fiber';

// Dynamically import the heavy transmission material
const TransmissionMaterial = lazy(() => 
  import('@/three/materials/TransmissionMaterial').then(module => ({
    default: module.TransmissionMaterial
  }))
);

type Props = {
  color?: string;
  speed?: number;
};

export default function HelixKnot({ color = '#8b5cf6', speed = 0.25 }: Props) {
  const ref = useRef<Mesh>(null!);
  const geom = useMemo(
    () => new TorusKnotGeometry(0.95, 0.22, 220, 32, 2, 3),
    [],
  );

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * speed;
    ref.current.rotation.x += delta * speed * 0.35;
  });

  return (
    <mesh ref={ref} geometry={geom} position={[0, 0, 0.1]}>
      <Suspense fallback={<meshStandardMaterial color={color} />}>
        <TransmissionMaterial
          transmission={1}
          thickness={0.8}
          roughness={0.18}
          anisotropy={0.2}
          chromaticAberration={0.015}
          distortion={0.06}
          color={color}
          samples={8}
        />
      </Suspense>
    </mesh>
  );
}
