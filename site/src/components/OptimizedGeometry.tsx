/**
 * Optimized Three.js components using geometry caching
 * This reduces runtime geometry computation and memory usage
 */

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, Curve, Vector3 } from 'three';
import { geometryCache } from '@/lib/GeometryCache';

interface OptimizedGeometryProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  metalness?: number;
  roughness?: number;
  detail?: number;
}

/**
 * Optimized Hexagonal Prism Component
 */
export function OptimizedHexagonalPrism({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  color = '#00ffff',
  metalness = 0.7,
  roughness = 0.3,
  detail = 1
}: OptimizedGeometryProps) {
  const meshRef = useRef<Mesh>(null);
  
  const { geometry } = useMemo(() => {
    return geometryCache.getHexagonalPrism({ detail, radius: 1 });
  }, [detail]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      geometry={geometry}
    >
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
      />
    </mesh>
  );
}

/**
 * Optimized Torus Knot Component
 */
export function OptimizedTorusKnot({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  color = '#ff6b6b',
  metalness = 0.8,
  roughness = 0.2,
  detail = 1
}: OptimizedGeometryProps) {
  const meshRef = useRef<Mesh>(null);
  
  const { geometry } = useMemo(() => {
    return geometryCache.getTorusKnot({ detail, radius: 1 });
  }, [detail]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      geometry={geometry}
    >
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
      />
    </mesh>
  );
}

/**
 * Optimized Polyhedron Component
 */
export function OptimizedPolyhedron({
  type = 'octahedron',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  color = '#4ecdc4',
  metalness = 0.6,
  roughness = 0.4,
  detail = 0
}: OptimizedGeometryProps & {
  type?: 'octahedron' | 'dodecahedron' | 'tetrahedron';
}) {
  const meshRef = useRef<Mesh>(null);
  
  const { geometry } = useMemo(() => {
    return geometryCache.getPolyhedron(type, { detail, radius: 0.8 });
  }, [type, detail]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      geometry={geometry}
    >
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
      />
    </mesh>
  );
}

/**
 * Optimized Brand Elements Group
 */
export function OptimizedBrandElements({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1]
}: OptimizedGeometryProps) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Central Sphere */}
      <OptimizedSphere
        position={[0, 0, 0]}
        color="#3498db"
        metalness={0.8}
        roughness={0.2}
        detail={1}
      />
      
      {/* Orbiting Torus */}
      <OptimizedTorus
        position={[1.5, 0, 0]}
        color="#e74c3c"
        metalness={0.6}
        roughness={0.4}
        detail={1}
      />
      
      {/* Left Box - using sphere as placeholder for rounded box */}
      <OptimizedSphere
        position={[-1.5, 0, 0]}
        scale={[0.8, 0.8, 0.8]}
        color="#2ecc71"
        metalness={0.7}
        roughness={0.3}
        detail={0.5}
      />
    </group>
  );
}

/**
 * Optimized Sphere Component
 */
export function OptimizedSphere({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  color = '#3498db',
  metalness = 0.8,
  roughness = 0.2,
  detail = 1
}: OptimizedGeometryProps) {
  const { geometry } = useMemo(() => {
    return geometryCache.getSphere({ detail, radius: 1 });
  }, [detail]);

  return (
    <mesh
      position={position}
      rotation={rotation}
      scale={scale}
      geometry={geometry}
    >
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
      />
    </mesh>
  );
}

/**
 * Optimized Torus Component
 */
export function OptimizedTorus({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  color = '#e74c3c',
  metalness = 0.6,
  roughness = 0.4,
  detail = 1
}: OptimizedGeometryProps) {
  const { geometry } = useMemo(() => {
    return geometryCache.getTorus({ detail, radius: 0.6 });
  }, [detail]);

  return (
    <mesh
      position={position}
      rotation={rotation}
      scale={scale}
      geometry={geometry}
    >
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
      />
    </mesh>
  );
}

/**
 * Optimized Flowing Ribbon Component
 */
export function OptimizedFlowingRibbon({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  color = '#9b59b6',
  metalness = 0.5,
  roughness = 0.5,
  detail = 1
}: OptimizedGeometryProps) {
  const meshRef = useRef<Mesh>(null);
  
  const { geometry } = useMemo(() => {
    // Create a simple curve for the ribbon
    class RibbonCurve extends Curve<Vector3> {
      constructor(private scale: number = 1) {
        super();
      }
      
      getPoint(t: number, optionalTarget = new Vector3()): Vector3 {
        const tx = Math.sin(2 * Math.PI * t);
        const ty = Math.sin(4 * Math.PI * t) * 0.5;
        const tz = Math.cos(2 * Math.PI * t) * 0.5;
        
        return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
      }
    }
    
    const curve = new RibbonCurve(2);
    return geometryCache.getTube(curve, { detail, radius: 0.2 });
  }, [detail]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      geometry={geometry}
    >
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}