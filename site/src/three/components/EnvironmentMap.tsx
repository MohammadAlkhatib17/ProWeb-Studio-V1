/**
 * Environment Map Component
 * Loads KTX2 compressed environment textures with PMREM processing
 */

'use client';

import { useEffect } from 'react';

import { useThree } from '@react-three/fiber';

import { useKTX2Environment } from '../assetPipeline';

interface EnvironmentMapProps {
  /** Path to environment texture (without extension) */
  path: string;
  /** Environment intensity */
  intensity?: number;
  /** Apply to scene background */
  background?: boolean;
}

/**
 * Environment map component with KTX2 support
 * Automatically loads compressed textures with fallback
 */
export function EnvironmentMap({
  path,
  intensity = 1,
  background = false,
}: EnvironmentMapProps) {
  const { scene } = useThree();
  const envMap = useKTX2Environment(path);

  useEffect(() => {
    if (!envMap) return;

    // Apply environment map to scene
    scene.environment = envMap;
    
    if (background) {
      scene.background = envMap;
    }

    // Set environment intensity
    if (scene.environmentIntensity !== undefined) {
      scene.environmentIntensity = intensity;
    }

    return () => {
      scene.environment = null;
      if (background) {
        scene.background = null;
      }
    };
  }, [envMap, scene, intensity, background]);

  return null;
}
