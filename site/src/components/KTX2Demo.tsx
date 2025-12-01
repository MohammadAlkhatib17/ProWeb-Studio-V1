/**
 * KTX2 Asset Pipeline Demo Component
 * Demonstrates all features: KTX2 loading, LOD, instancing, memory monitoring
 */

'use client';

import { useEffect, useRef, useState } from 'react';

import { OrbitControls, Stats } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import {
  useKTX2Texture,
  textureMemoryMonitor,
  resourceDisposer,
} from '@/three/assetPipeline';

/**
 * Demo cube with KTX2 texture
 */
function TexturedCube({ position }: { position: [number, number, number] }) {
  const texture = useKTX2Texture('/textures/materials/demo_texture');
  
  if (!texture) return null;
  
  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

/**
 * Instanced spheres demo (efficient rendering)
 */
function InstancedSpheres({ count = 50 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const texture = useKTX2Texture('/textures/materials/demo_texture');
  
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
      const r = 5 + Math.random() * 5;
      
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
      const s = 0.2 + Math.random() * 0.3;
      scale.set(s, s, s);
      
      matrix.compose(position, rotation, scale);
      meshRef.current.setMatrixAt(i, matrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count]);
  
  // Animate rotation
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
  });
  
  if (!texture) return null;
  
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial map={texture} />
    </instancedMesh>
  );
}

/**
 * Memory monitor overlay
 */
function MemoryMonitor() {
  const [stats, setStats] = useState({
    used: 0,
    budget: 12,
    percentage: 0,
    textureCount: 0,
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      const report = textureMemoryMonitor.getReport();
      setStats({
        used: report.total,
        budget: report.budget.budget,
        percentage: report.budget.percentage,
        textureCount: report.textures.length,
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getColor = () => {
    if (stats.percentage > 100) return '#ef4444'; // red
    if (stats.percentage > 80) return '#f59e0b'; // amber
    return '#10b981'; // green
  };
  
  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '12px',
        zIndex: 1000,
        minWidth: '250px',
      }}
    >
      <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
        🎨 Texture Memory
      </div>
      <div style={{ marginBottom: '4px' }}>
        Textures: <strong>{stats.textureCount}</strong>
      </div>
      <div style={{ marginBottom: '4px' }}>
        Used: <strong style={{ color: getColor() }}>
          {stats.used.toFixed(2)} MB
        </strong> / {stats.budget} MB
      </div>
      <div style={{ marginBottom: '8px' }}>
        <div
          style={{
            width: '100%',
            height: '8px',
            background: '#374151',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${Math.min(stats.percentage, 100)}%`,
              height: '100%',
              background: getColor(),
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>
      <div style={{ fontSize: '10px', opacity: 0.7 }}>
        {stats.percentage > 100
          ? '❌ Over budget!'
          : stats.percentage > 80
          ? '⚠️ Near limit'
          : '✓ Within budget'}
      </div>
    </div>
  );
}

/**
 * Scene cleanup on unmount
 */
function SceneCleanup() {
  const { scene } = useThree();
  
  useEffect(() => {
    return () => {
      // Cleanup all GPU resources on unmount
      resourceDisposer.disposeObject(scene);
      resourceDisposer.logReport();
    };
  }, [scene]);
  
  return null;
}

/**
 * Main demo scene
 */
function DemoScene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, 5, -5]} intensity={0.5} />
      
      {/* Demo objects */}
      <TexturedCube position={[0, 0, 0]} />
      <InstancedSpheres count={100} />
      
      {/* Camera controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={50}
      />
      
      {/* Cleanup helper */}
      <SceneCleanup />
    </>
  );
}

/**
 * Main export component
 */
export default function KTX2Demo() {
  const [showStats, setShowStats] = useState(true);
  
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* Memory monitor */}
      <MemoryMonitor />
      
      {/* Controls */}
      <div
        style={{
          position: 'fixed',
          bottom: '10px',
          left: '10px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '12px',
          zIndex: 1000,
        }}
      >
        <div style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
          KTX2 Asset Pipeline Demo
        </div>
        <div style={{ fontSize: '10px', opacity: 0.7, marginBottom: '8px' }}>
          • Drag to rotate camera
          <br />
          • Scroll to zoom
          <br />
          • 100 instanced spheres (1 draw call)
          <br />
          • KTX2/BasisU compressed textures
        </div>
        <button
          onClick={() => setShowStats(!showStats)}
          style={{
            background: '#3b82f6',
            border: 'none',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
          }}
        >
          {showStats ? 'Hide' : 'Show'} Stats
        </button>
      </div>
      
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [10, 5, 10], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <DemoScene />
        {showStats && <Stats />}
      </Canvas>
    </div>
  );
}
