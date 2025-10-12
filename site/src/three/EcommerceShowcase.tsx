"use client";

import React, { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Box,
  Sphere,
  Cylinder,
  RoundedBox,
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
  Preload,
  useDetectGPU,
  Text,
} from "@react-three/drei";
import { Group } from "three";
import { motion } from "framer-motion";

interface ProductDisplayProps {
  position?: [number, number, number];
  productType?: "phone" | "watch" | "headphones";
}

function ProductDisplay({
  position = [0, 0, 0],
  productType = "phone",
}: ProductDisplayProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;

      if (hovered) {
        groupRef.current.scale.setScalar(1.1);
      } else {
        groupRef.current.scale.setScalar(1);
      }
    }
  });

  const renderProduct = () => {
    switch (productType) {
      case "phone":
        return (
          <group>
            <RoundedBox args={[0.8, 1.6, 0.1]} radius={0.05} smoothness={4}>
              <meshStandardMaterial
                color="#1a1a1a"
                metalness={0.9}
                roughness={0.1}
              />
            </RoundedBox>
            <Box args={[0.7, 1.4, 0.02]} position={[0, 0, 0.06]}>
              <meshStandardMaterial
                color="#000"
                emissive="#0066cc"
                emissiveIntensity={0.2}
              />
            </Box>
          </group>
        );

      case "watch":
        return (
          <group>
            <Cylinder
              args={[0.4, 0.4, 0.15, 32]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <meshStandardMaterial
                color="#2c3e50"
                metalness={0.8}
                roughness={0.2}
              />
            </Cylinder>
            <Cylinder
              args={[0.35, 0.35, 0.02, 32]}
              position={[0, 0, 0.1]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <meshStandardMaterial
                color="#000"
                emissive="#00ff88"
                emissiveIntensity={0.3}
              />
            </Cylinder>
            {/* Watch band */}
            <Box args={[0.3, 1.5, 0.1]} position={[0, 0, -0.2]}>
              <meshStandardMaterial color="#34495e" roughness={0.8} />
            </Box>
          </group>
        );

      case "headphones":
        return (
          <group>
            {/* Headband */}
            <Cylinder
              args={[1, 1, 0.1, 32, 1, false, 0, Math.PI]}
              position={[0, 0.5, 0]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <meshStandardMaterial
                color="#2c3e50"
                metalness={0.7}
                roughness={0.3}
              />
            </Cylinder>
            {/* Left ear cup */}
            <Sphere args={[0.3]} position={[-0.8, 0, 0]}>
              <meshStandardMaterial
                color="#1a1a1a"
                metalness={0.5}
                roughness={0.4}
              />
            </Sphere>
            {/* Right ear cup */}
            <Sphere args={[0.3]} position={[0.8, 0, 0]}>
              <meshStandardMaterial
                color="#1a1a1a"
                metalness={0.5}
                roughness={0.4}
              />
            </Sphere>
          </group>
        );

      default:
        return null;
    }
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {renderProduct()}

      {/* Product label */}
      <Html position={[0, -1, 0]} center>
        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-lg text-center pointer-events-none">
          <div className="text-sm font-semibold text-gray-800 capitalize">
            {productType}
          </div>
          <div className="text-xs text-gray-600">Premium Quality</div>
        </div>
      </Html>
    </group>
  );
}

function EcommerceScene() {
  const { gl } = useThree();
  const gpu = useDetectGPU();

  const shadows = useMemo(() => {
    return gpu?.tier >= 2;
  }, [gpu]);

  React.useEffect(() => {
    gl.shadowMap.enabled = shadows;
  }, [gl, shadows]);

  return (
    <>
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        maxDistance={8}
        minDistance={3}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 6}
        autoRotate
        autoRotateSpeed={0.3}
      />

      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
        castShadow={shadows}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ff6b6b" />
      <pointLight position={[10, -10, 10]} intensity={0.3} color="#4ecdc4" />

      {/* Display Platform */}
      <RoundedBox
        args={[6, 0.2, 6]}
        position={[0, -1.5, 0]}
        radius={0.1}
        smoothness={4}
      >
        <meshStandardMaterial color="#ecf0f1" metalness={0.1} roughness={0.8} />
      </RoundedBox>

      {/* Products */}
      <ProductDisplay position={[-2, 0, 0]} productType="phone" />
      <ProductDisplay position={[0, 0, 0]} productType="watch" />
      <ProductDisplay position={[2, 0, 0]} productType="headphones" />

      {/* Floating text */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.5}
        color="#2c3e50"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        E-commerce Solutions
      </Text>

      {shadows && (
        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={0.3}
          scale={12}
          blur={2}
          far={6}
        />
      )}

      <Environment preset="studio" />
    </>
  );
}

interface EcommerceShowcaseProps {
  className?: string;
}

export default function EcommerceShowcase({
  className = "",
}: EcommerceShowcaseProps) {
  return (
    <div className={`w-full h-96 ${className}`}>
      {/* SEO Fallback Content */}
      <noscript>
        <div className="w-full h-96 bg-gradient-to-br from-purple-600 to-pink-700 rounded-lg flex items-center justify-center text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">E-commerce Solutions</h3>
            <p className="text-lg">3D Product Visualization</p>
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div className="bg-white/20 p-3 rounded">
                <div className="font-semibold">Mobile Apps</div>
                <div className="text-xs">iOS & Android</div>
              </div>
              <div className="bg-white/20 p-3 rounded">
                <div className="font-semibold">Wearables</div>
                <div className="text-xs">Smart Integration</div>
              </div>
              <div className="bg-white/20 p-3 rounded">
                <div className="font-semibold">Audio</div>
                <div className="text-xs">Premium Sound</div>
              </div>
            </div>
          </div>
        </div>
      </noscript>

      {/* Loading Fallback */}
      <Suspense
        fallback={
          <div className="w-full h-96 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
            />
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 2, 5], fov: 60 }}
          className="rounded-lg"
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
        >
          <EcommerceScene />
          <Preload all />
        </Canvas>
      </Suspense>
    </div>
  );
}
