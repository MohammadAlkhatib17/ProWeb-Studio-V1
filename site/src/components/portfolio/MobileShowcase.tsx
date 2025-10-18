"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Environment } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { Button } from "@/components/Button";

function MobileDevices() {
  const phoneRef = useRef<THREE.Group>(null);
  const tabletRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (phoneRef.current) {
      phoneRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.6) * 0.3;
      phoneRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
    if (tabletRef.current) {
      tabletRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.4 + Math.PI) * 0.2;
      tabletRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 1.5 + Math.PI / 2) * 0.05;
    }
  });

  return (
    <group>
      {/* Mobile Phone */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <group ref={phoneRef} position={[0, 0, 0]}>
          {/* Phone Body */}
          <mesh>
            <boxGeometry args={[0.8, 1.6, 0.1]} />
            <meshStandardMaterial
              color="#1a1a1a"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Screen */}
          <mesh position={[0, 0, 0.051]}>
            <boxGeometry args={[0.7, 1.4, 0.01]} />
            <meshStandardMaterial
              color="#000033"
              emissive="#0066ff"
              emissiveIntensity={0.3}
            />
          </mesh>

          {/* Home Button */}
          <mesh position={[0, -0.7, 0.06]}>
            <circleGeometry args={[0.08, 32]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        </group>
      </Float>

      {/* Tablet */}
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
        <group
          ref={tabletRef}
          position={[2.5, 0.5, -1]}
          rotation={[0, -0.3, 0]}
        >
          {/* Tablet Body */}
          <mesh>
            <boxGeometry args={[1.5, 2, 0.12]} />
            <meshStandardMaterial
              color="#2a2a2a"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>

          {/* Screen */}
          <mesh position={[0, 0, 0.061]}>
            <boxGeometry args={[1.3, 1.8, 0.01]} />
            <meshStandardMaterial
              color="#001122"
              emissive="#0088ff"
              emissiveIntensity={0.2}
            />
          </mesh>
        </group>
      </Float>

      {/* Laptop */}
      <Float speed={1} rotationIntensity={0.05} floatIntensity={0.15}>
        <group position={[-2.2, -0.3, 0.5]} rotation={[0, 0.4, 0]}>
          {/* Laptop Base */}
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[2, 0.1, 1.4]} />
            <meshStandardMaterial
              color="#3a3a3a"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Laptop Screen */}
          <mesh position={[0, 0.65, -0.65]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[2, 1.3, 0.05]} />
            <meshStandardMaterial
              color="#1a1a1a"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>

          {/* Laptop Display */}
          <mesh position={[0, 0.65, -0.625]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[1.8, 1.1, 0.01]} />
            <meshStandardMaterial
              color="#000044"
              emissive="#0077ff"
              emissiveIntensity={0.25}
            />
          </mesh>
        </group>
      </Float>

      {/* Floating Responsive Icons - Using simple meshes */}
      <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh position={[0, 3, 1]}>
          <sphereGeometry args={[0.2]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.1}
          />
        </mesh>
      </Float>

      <Float speed={2.8} rotationIntensity={0.4} floatIntensity={0.5}>
        <mesh position={[3, 2.5, 0]}>
          <boxGeometry args={[0.3, 0.2, 0.1]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.1}
          />
        </mesh>
      </Float>

      <Float speed={2.2} rotationIntensity={0.2} floatIntensity={0.6}>
        <mesh position={[-3, 2.8, 0.5]}>
          <octahedronGeometry args={[0.18]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.1}
          />
        </mesh>
      </Float>

      {/* Responsive Text - Using simple mesh */}
      <Float speed={1.8} rotationIntensity={0.1} floatIntensity={0.3}>
        <mesh position={[0, -2.5, 2]}>
          <boxGeometry args={[3, 0.4, 0.2]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00cc66"
            emissiveIntensity={0.2}
          />
        </mesh>
      </Float>
    </group>
  );
}

function MobileScene() {
  return (
    <group>
      <Environment preset="dawn" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-3, 3, 3]} intensity={0.6} color="#0088ff" />
      <pointLight position={[3, -2, 2]} intensity={0.5} color="#00ff88" />

      <MobileDevices />
    </group>
  );
}

export default function MobileShowcase() {
  return (
    <div className="py-16 lg:py-24 bg-gradient-to-br from-cosmic-900/50 to-stellar-900/50">
      <div className="container mx-auto px-safe">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 3D Scene */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="h-96 lg:h-[500px] order-2 lg:order-1"
          >
            <Canvas
              camera={{ position: [0, 0, 6], fov: 60 }}
              style={{ background: "transparent" }}
            >
              <Suspense fallback={null}>
                <MobileScene />
                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  autoRotate
                  autoRotateSpeed={0.5}
                />
              </Suspense>
            </Canvas>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Mobile-First Design voor{" "}
              <span className="bg-gradient-to-r from-stellar-400 to-cosmic-400 bg-clip-text text-transparent">
                Alle Apparaten
              </span>
            </h2>

            <p className="text-lg text-cosmic-200 mb-8 leading-relaxed">
              In Nederland gebruikt 95% van de mensen hun smartphone voor
              internet. Daarom ontwerpen wij mobile-first: perfect op telefoon,
              tablet en desktop. Jullie website ziet er overal fantastisch uit.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-stellar-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Mobile-First
                  </h3>
                  <p className="text-sm text-cosmic-300">
                    Ontwerp begint op mobiel
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-stellar-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Touch-Friendly
                  </h3>
                  <p className="text-sm text-cosmic-300">
                    Optimaal voor aanraking
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-stellar-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Cross-Platform
                  </h3>
                  <p className="text-sm text-cosmic-300">
                    Werkt op alle browsers
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-stellar-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Progressive Web App
                  </h3>
                  <p className="text-sm text-cosmic-300">
                    App-achtige ervaring
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cosmic-800/50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">
                Mobile Performance Stats
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-stellar-400">95%</div>
                  <div className="text-sm text-cosmic-300">Mobile Users NL</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-stellar-400">
                    &lt; 2s
                  </div>
                  <div className="text-sm text-cosmic-300">
                    Mobile Load Time
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-stellar-400">
                    +68%
                  </div>
                  <div className="text-sm text-cosmic-300">
                    Mobile Conversie
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/contact" variant="primary">
                Mobile Website Aanvragen
              </Button>
              <Button href="/diensten" variant="secondary">
                Responsive Voorbeelden
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
