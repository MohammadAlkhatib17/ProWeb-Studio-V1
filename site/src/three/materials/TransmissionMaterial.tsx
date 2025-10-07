'use client';
// src/three/materials/TransmissionMaterial.tsx
import { MeshTransmissionMaterial } from '@react-three/drei';
import { forwardRef } from 'react';

export interface TransmissionMaterialProps {
  transmission?: number;
  thickness?: number;
  roughness?: number;
  chromaticAberration?: number;
  anisotropy?: number;
  distortion?: number;
  backside?: boolean;
  samples?: number;
  color?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TransmissionMaterial = forwardRef<any, TransmissionMaterialProps>(
  ({
    transmission = 1,
    thickness = 0.8,
    roughness = 0.2,
    chromaticAberration = 0.02,
    anisotropy = 0.2,
    distortion = 0.08,
    backside = false,
    samples = 8,
    color = '#ffffff',
  }, ref) => {
    return (
      <MeshTransmissionMaterial
        ref={ref}
        transmission={transmission}
        thickness={thickness}
        roughness={roughness}
        chromaticAberration={chromaticAberration}
        anisotropy={anisotropy}
        distortion={distortion}
        backside={backside}
        samples={samples}
        color={color}
      />
    );
  }
);

TransmissionMaterial.displayName = 'TransmissionMaterial';