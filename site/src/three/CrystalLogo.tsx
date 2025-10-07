'use client';
// src/three/CrystalLogo.tsx
import { IcosahedronGeometry, Mesh } from 'three';
import { useMemo, useRef, lazy, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';

// Dynamically import the heavy transmission material
const TransmissionMaterial = lazy(() => 
  import('@/three/materials/TransmissionMaterial').then(module => ({
    default: module.TransmissionMaterial
  }))
);

type CrystalProps = {
  tint?: string;
  roughness?: number;
  thickness?: number;
  rotationSpeed?: number;
};

export function CrystalLogo({
  tint = '#a78bfa',
  roughness = 0.2,
  thickness = 0.6,
  rotationSpeed = 0.25,
}: CrystalProps) {
  const ref = useRef<Mesh>(null!);
  const geom = useMemo(() => new IcosahedronGeometry(1.1, 1), []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * rotationSpeed;
    ref.current.rotation.x += delta * (rotationSpeed * 0.4);
  });

  return (
    <mesh ref={ref} geometry={geom} position={[0, 0, 0.2]}>
      <Suspense fallback={<meshStandardMaterial color={tint} />}>
        <TransmissionMaterial
          backside
          samples={8}
          transmission={1}
          roughness={roughness}
          thickness={thickness}
          chromaticAberration={0.02}
          anisotropy={0.2}
          distortion={0.08}
          color={tint}
        />
      </Suspense>
    </mesh>
  );
}
