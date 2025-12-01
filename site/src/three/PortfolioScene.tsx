'use client';

import { Suspense, useRef } from 'react';

import { 
  OrbitControls, 
  Float, 
  Environment,
  Stars,
  Sparkles 
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

function FloatingElements() {
  return (
    <group>
      {/* Portfolio Text - Using simple 3D mesh instead of Text3D */}
      <Float
        speed={1}
        rotationIntensity={0.2}
        floatIntensity={0.3}
        position={[0, 0, -2]}
      >
        <mesh position={[0, 1, 0]}>
          <boxGeometry args={[3, 0.5, 0.2]} />
          <meshStandardMaterial 
            color="#00D4FF" 
            emissive="#0099CC"
            emissiveIntensity={0.2}
          />
        </mesh>
      </Float>

      {/* Floating Geometric Shapes */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.4}>
        <mesh position={[-3, 2, 0]} rotation={[0.5, 0.5, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial 
            color="#FF6B6B" 
            metalness={0.8} 
            roughness={0.2}
            emissive="#FF3333"
            emissiveIntensity={0.1}
          />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh position={[3, -1, 1]} rotation={[0.3, 0.8, 0.2]}>
          <octahedronGeometry args={[0.6]} />
          <meshStandardMaterial 
            color="#4ECDC4" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#2E8B87"
            emissiveIntensity={0.15}
          />
        </mesh>
      </Float>

      <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.5}>
        <mesh position={[-2, -2, 2]} rotation={[0.7, 0.3, 0.9]}>
          <dodecahedronGeometry args={[0.4]} />
          <meshStandardMaterial 
            color="#FFE66D" 
            metalness={0.7} 
            roughness={0.3}
            emissive="#FFD700"
            emissiveIntensity={0.1}
          />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.7}>
        <mesh position={[2, 2, -1]} rotation={[0.1, 0.6, 0.4]}>
          <icosahedronGeometry args={[0.5]} />
          <meshStandardMaterial 
            color="#A8E6CF" 
            metalness={0.6} 
            roughness={0.4}
            emissive="#66CC99"
            emissiveIntensity={0.12}
          />
        </mesh>
      </Float>

      <Float speed={3} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh position={[0, -3, 0]} rotation={[0.2, 0.4, 0.1]}>
          <torusGeometry args={[0.6, 0.2, 16, 32]} />
          <meshStandardMaterial 
            color="#FF8B94" 
            metalness={0.8} 
            roughness={0.2}
            emissive="#FF5566"
            emissiveIntensity={0.1}
          />
        </mesh>
      </Float>
    </group>
  );
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      {/* Environment lighting */}
      <Environment preset="city" />
      
      {/* Additional lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.8} 
        color="#ffffff"
        castShadow
      />
      <pointLight 
        position={[-10, -10, -5]} 
        intensity={0.6} 
        color="#00D4FF"
      />

      {/* Sparkles for magical effect */}
      <Sparkles 
        count={100} 
        scale={[20, 20, 20]} 
        size={2} 
        speed={0.3}
        color="#00D4FF"
      />

      {/* Stars background */}
      <Stars 
        radius={50} 
        depth={50} 
        count={1000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={0.5}
      />

      {/* Floating elements */}
      <FloatingElements />
    </group>
  );
}

export default function PortfolioScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene />
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}