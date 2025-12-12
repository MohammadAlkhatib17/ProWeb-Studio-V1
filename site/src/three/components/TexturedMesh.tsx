/**
 * Textured Mesh Component
 * Example of using KTX2 textures with instancing
 */

'use client';

import { useRef, useMemo, useEffect } from 'react';

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useKTX2Texture } from '../assetPipeline';

interface TexturedMeshProps {
  /** Texture base path (without extension) */
  texturePath: string;
  /** Number of instances */
  count?: number;
  /** Mesh geometry */
  geometry?: THREE.BufferGeometry;
  /** Enable rotation animation */
  animate?: boolean;
}

/**
 * Instanced mesh with KTX2 texture support
 * Demonstrates efficient rendering with compressed textures
 */
export function TexturedMesh({
  texturePath,
  count = 1,
  geometry,
  animate = false,
}: TexturedMeshProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Load texture with KTX2/BasisU compression
  const texture = useKTX2Texture(texturePath, {
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
    anisotropy: 16,
  });

  // Create default geometry if none provided
  const geo = useMemo(() => {
    return geometry || new THREE.BoxGeometry(1, 1, 1);
  }, [geometry]);

  // Create material with texture
  const material = useMemo(() => {
    if (!texture) return null;

    return new THREE.MeshStandardMaterial({
      map: texture,
      metalness: 0.3,
      roughness: 0.7,
    });
  }, [texture]);

  // Setup instance matrices
  useEffect(() => {
    if (!meshRef.current) return;

    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Quaternion();
    const scale = new THREE.Vector3(1, 1, 1);

    for (let i = 0; i < count; i++) {
      // Random position in sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 3;

      position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );

      // Random rotation
      rotation.setFromEuler(
        new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        )
      );

      // Random scale
      const s = 0.5 + Math.random() * 0.5;
      scale.set(s, s, s);

      matrix.compose(position, rotation, scale);
      meshRef.current.setMatrixAt(i, matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count]);

  // Animation
  useFrame((state) => {
    if (!animate || !meshRef.current) return;

    const time = state.clock.elapsedTime;
    meshRef.current.rotation.y = time * 0.1;
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
  });

  if (!material || !texture) {
    // Return placeholder while loading
    return null;
  }

  return (
    <instancedMesh
      ref={meshRef}
      args={[geo, material, count]}
      frustumCulled
    />
  );
}


