"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Cylinder,
  Sphere,
  Box,
  OrbitControls,
  Environment,
  Html,
} from "@react-three/drei";
import { Group } from "three";

function BrandLogo() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Logo Sphere */}
      <Sphere args={[0.8]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#00ff88"
          metalness={0.8}
          roughness={0.2}
          emissive="#003322"
          emissiveIntensity={0.2}
        />
      </Sphere>

      {/* Orbiting Brand Elements */}
      <group rotation={[0, 0, 0]}>
        <Cylinder
          args={[0.1, 0.1, 0.5]}
          position={[2, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <meshStandardMaterial
            color="#ff6b6b"
            metalness={0.7}
            roughness={0.3}
          />
        </Cylinder>

        <Box args={[0.3, 0.3, 0.3]} position={[0, 2, 0]}>
          <meshStandardMaterial
            color="#4ecdc4"
            metalness={0.6}
            roughness={0.4}
          />
        </Box>

        <Sphere args={[0.2]} position={[-2, 0, 0]}>
          <meshStandardMaterial
            color="#ffd93d"
            metalness={0.5}
            roughness={0.5}
          />
        </Sphere>

        <Cylinder args={[0.15, 0.15, 0.4]} position={[0, -2, 0]}>
          <meshStandardMaterial
            color="#bc4fff"
            metalness={0.7}
            roughness={0.3}
          />
        </Cylinder>
      </group>

      {/* Brand Text */}
      <Html position={[0, -1.5, 0]} center>
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg text-center pointer-events-none">
          <div className="text-sm font-bold text-gray-800">ProWeb Studio</div>
          <div className="text-xs text-gray-600">Brand Identity</div>
        </div>
      </Html>
    </group>
  );
}

function BrandScene() {
  return (
    <>
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        maxDistance={6}
        minDistance={2}
        autoRotate
        autoRotateSpeed={0.8}
      />

      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6b6b" />
      <pointLight position={[10, -10, 10]} intensity={0.5} color="#4ecdc4" />

      <BrandLogo />

      <Environment preset="sunset" />
    </>
  );
}

export default function SimpleBrandIdentityModel({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`w-full h-64 md:h-80 lg:h-96 ${className}`}>
      <Suspense
        fallback={
          <div className="w-full h-full bg-gradient-to-br from-green-600/20 to-blue-700/20 rounded-lg flex items-center justify-center border border-green-500/30">
            <div className="text-center text-white">
              <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2 md:mb-3"></div>
              <div className="text-xs md:text-sm">
                Loading Brand Identity...
              </div>
            </div>
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 4], fov: 60 }}
          className="rounded-lg"
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
        >
          <BrandScene />
        </Canvas>
      </Suspense>
    </div>
  );
}
