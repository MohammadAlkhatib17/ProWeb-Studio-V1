/**
 * Example: Optimized Hero Scene
 * 
 * Demonstrates how to replace existing Three.js components
 * with optimized geometry-cached versions
 */

import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei';
import { Group } from 'three';
import { 
  OptimizedHexagonalPrism,
  OptimizedTorusKnot,
  OptimizedPolyhedron,
  OptimizedBrandElements,
  OptimizedFlowingRibbon
} from '@/components/OptimizedGeometry';
import { geometryCache } from '@/lib/GeometryCache';

/**
 * Optimized version of the hero scene with performance monitoring
 */
function OptimizedHeroScene() {
  const groupRef = useRef<Group>(null);
  const [cacheStats, setCacheStats] = useState<Record<string, unknown> | null>(null);

  // Update cache stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCacheStats(geometryCache.getStats());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <>
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        maxDistance={12}
        minDistance={4}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 6}
        autoRotate
        autoRotateSpeed={0.5}
      />
      
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />

      <group ref={groupRef}>
        {/* Central hexagonal prism */}
        <OptimizedHexagonalPrism
          position={[0, 0, 0]}
          scale={[1.2, 1.2, 1.2]}
          color="#00ffff"
          detail={1}
        />

        {/* Orbiting torus knot */}
        <OptimizedTorusKnot
          position={[3, 0, 0]}
          scale={[0.8, 0.8, 0.8]}
          color="#ff6b6b"
          detail={1}
        />

        {/* Polyhedra constellation */}
        <OptimizedPolyhedron
          type="octahedron"
          position={[-2, 2, 1]}
          scale={[0.6, 0.6, 0.6]}
          color="#4ecdc4"
          detail={0}
        />

        <OptimizedPolyhedron
          type="dodecahedron"
          position={[2, -1.5, -1]}
          scale={[0.5, 0.5, 0.5]}
          color="#45b7d1"
          detail={0}
        />

        <OptimizedPolyhedron
          type="tetrahedron"
          position={[-3, -1, 2]}
          scale={[0.7, 0.7, 0.7]}
          color="#96ceb4"
          detail={0}
        />

        {/* Brand elements group */}
        <OptimizedBrandElements
          position={[0, -3, 0]}
          scale={[0.8, 0.8, 0.8]}
        />

        {/* Flowing ribbons */}
        <OptimizedFlowingRibbon
          position={[0, 2, -2]}
          scale={[1.5, 1.5, 1.5]}
          color="#9b59b6"
          detail={1}
        />
      </group>

      <ContactShadows
        opacity={0.4}
        scale={20}
        blur={1}
        far={10}
        resolution={256}
        color="#000000"
      />

      <Environment preset="city" />

      {/* Performance stats overlay (development only) */}
      {process.env.NODE_ENV === 'development' && cacheStats && (
        <Html position={[0, 5, 0]} center>
          <div className="bg-black/70 text-white p-2 rounded text-xs font-mono">
            <div>Cache: {cacheStats.cacheSize} geometries</div>
            <div>Hits: {cacheStats.cacheHits}</div>
            <div>Memory: {cacheStats.totalMemoryUsage}</div>
            <div>Compression: {cacheStats.averageCompressionRatio.toFixed(1)}%</div>
          </div>
        </Html>
      )}
    </>
  );
}

/**
 * Optimized 3D Hero Canvas Component
 */
export default function OptimizedHeroCanvas({ className = '' }: { className?: string }) {
  const [performanceMode, setPerformanceMode] = useState<'high' | 'medium' | 'low'>('high');

  // Detect device capabilities and adjust performance mode
  useEffect(() => {
    const detectPerformance = () => {
      // Simple performance detection based on device memory and connection
      const memory = (navigator as any)?.deviceMemory || 4;
      const connection = (navigator as any)?.connection?.effectiveType || '4g';
      
      if (memory < 4 || connection === '2g' || connection === 'slow-2g') {
        setPerformanceMode('low');
      } else if (memory < 8 || connection === '3g') {
        setPerformanceMode('medium');
      } else {
        setPerformanceMode('high');
      }
    };

    detectPerformance();
  }, []);

  // Adjust quality based on performance mode
  const getCanvasConfig = () => {
    switch (performanceMode) {
      case 'low':
        return {
          dpr: [0.5, 1] as [number, number],
          antialias: false,
          shadows: false
        };
      case 'medium':
        return {
          dpr: [1, 1.5] as [number, number],
          antialias: true,
          shadows: false
        };
      case 'high':
      default:
        return {
          dpr: [1, 2] as [number, number],
          antialias: true,
          shadows: true
        };
    }
  };

  const canvasConfig = getCanvasConfig();

  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={canvasConfig.dpr}
        gl={{ 
          antialias: canvasConfig.antialias,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        shadows={canvasConfig.shadows}
        onCreated={(state) => {
          state.gl.setClearColor('#000000', 0);
        }}
      >
        <Suspense fallback={null}>
          <OptimizedHeroScene />
        </Suspense>
      </Canvas>

      {/* Performance mode indicator (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
          Performance: {performanceMode.toUpperCase()}
        </div>
      )}
    </div>
  );
}

/**
 * Export optimized component and performance utilities
 */
export { OptimizedHeroScene };

/**
 * Hook to get geometry cache statistics
 */
export function useGeometryCacheStats() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const updateStats = () => {
      setStats(geometryCache.getStats());
    };

    updateStats();
    const interval = setInterval(updateStats, 2000);

    return () => clearInterval(interval);
  }, []);

  return stats;
}

/**
 * Hook to get cache report for debugging
 */
export function useGeometryCacheReport() {
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const updateReport = () => {
      setReport(geometryCache.getReport());
    };

    updateReport();
    
    // Update less frequently since reports are more expensive
    const interval = setInterval(updateReport, 10000);

    return () => clearInterval(interval);
  }, []);

  return report;
}