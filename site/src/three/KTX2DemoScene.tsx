/**
 * KTX2 Pipeline Demo Scene
 * Demonstrates texture loading, instancing, and performance monitoring
 */

'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import { EnvironmentMap } from './components/EnvironmentMap';
import { TexturedMesh } from './components/TexturedMesh';
import { textureMemoryMonitor } from './assetPipeline';

/**
 * Performance stats overlay
 */
function PerformanceStats() {
  const [stats, setStats] = useState({ total: 0, compressed: 0, uncompressed: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const report = textureMemoryMonitor.getReport();
      setStats({
        total: report.total,
        compressed: report.compressed,
        uncompressed: report.uncompressed,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        top: 10,
        left: 10,
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '12px 16px',
        borderRadius: 8,
        fontFamily: 'monospace',
        fontSize: 12,
        lineHeight: 1.6,
        zIndex: 1000,
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>🎨 Texture Memory</div>
      <div>Total: {stats.total.toFixed(2)} MB</div>
      <div style={{ color: '#4ade80' }}>
        Compressed: {stats.compressed.toFixed(2)} MB
      </div>
      <div style={{ color: '#fbbf24' }}>
        Fallback: {stats.uncompressed.toFixed(2)} MB
      </div>
    </div>
  );
}

/**
 * Simple scene with gradient background
 */
function SimpleScene() {
  return (
    <group>
      {/* Gradient background sphere */}
      <mesh scale={50}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#1a1a2e"
          side={THREE.BackSide}
          fog={false}
        />
      </mesh>

      {/* Center display sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          color="#3b82f6"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Orbit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3, 0.05, 16, 100]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.3} />
      </mesh>

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, 3, -5]} intensity={0.5} color="#8b5cf6" />
    </group>
  );
}

/**
 * Demo scene with textured objects
 */
function TexturedScene() {
  return (
    <group>
      {/* Environment map - will use KTX2 if available */}
      <EnvironmentMap
        path="/textures/environment/studio"
        intensity={1.0}
        background={false}
      />

      {/* Instanced textured meshes */}
      <TexturedMesh
        texturePath="/textures/materials/grid"
        count={20}
        animate={true}
      />

      {/* Static geometry */}
      <mesh position={[0, 0, 0]}>
        <icosahedronGeometry args={[2, 1]} />
        <meshStandardMaterial
          color="#10b981"
          metalness={0.7}
          roughness={0.3}
          wireframe={false}
        />
      </mesh>

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <pointLight position={[-10, 5, -10]} intensity={0.8} color="#ec4899" />
    </group>
  );
}

/**
 * Loading fallback
 */
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#6366f1" wireframe />
    </mesh>
  );
}

/**
 * Main KTX2 demo component
 */
export default function KTX2DemoScene({ useTextures = false }: { useTextures?: boolean }) {
  const [showStats, setShowStats] = useState(true);

  // Log texture memory on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      textureMemoryMonitor.logReport();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {showStats && <PerformanceStats />}
      
      <button
        onClick={() => setShowStats(!showStats)}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1000,
          padding: '8px 16px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontFamily: 'monospace',
          fontSize: 12,
        }}
      >
        {showStats ? 'Hide Stats' : 'Show Stats'}
      </button>

      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          {useTextures ? <TexturedScene /> : <SimpleScene />}
        </Suspense>

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          enableZoom={true}
          enablePan={false}
          minDistance={5}
          maxDistance={20}
        />

        {/* FPS counter */}
        <Stats showPanel={0} className="stats" />
      </Canvas>

      {/* Instructions */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: 8,
          fontFamily: 'monospace',
          fontSize: 12,
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: 4 }}>🎮 Drag to rotate • Scroll to zoom</div>
        <div style={{ fontSize: 10, opacity: 0.7 }}>
          {useTextures
            ? 'KTX2 textures with instancing demo'
            : 'Simple scene (no textures)'}
        </div>
      </div>
    </div>
  );
}
