"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Environment } from "@react-three/drei";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import * as THREE from "three";

function ShoppingCart() {
  const cartRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (cartRef.current) {
      cartRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      cartRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={cartRef}>
        {/* Shopping Cart Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.5, 1, 1]} />
          <meshStandardMaterial
            color="#ff6b6b"
            metalness={0.8}
            roughness={0.2}
            emissive="#ff3333"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Cart Handle */}
        <mesh position={[-0.8, 0.3, 0]} rotation={[0, 0, Math.PI / 6]}>
          <cylinderGeometry args={[0.05, 0.05, 1.2]} />
          <meshStandardMaterial
            color="#333333"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Wheels */}
        <mesh position={[-0.6, -0.7, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1]} />
          <meshStandardMaterial
            color="#222222"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0.6, -0.7, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.1]} />
          <meshStandardMaterial
            color="#222222"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Floating Products */}
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
          <mesh position={[0, 1.5, 0]} rotation={[0.2, 0.3, 0.1]}>
            <boxGeometry args={[0.4, 0.4, 0.4]} />
            <meshStandardMaterial
              color="#4ecdc4"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
        </Float>

        <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.5}>
          <mesh position={[1.2, 1.8, 0.5]} rotation={[0.5, 0.2, 0.3]}>
            <sphereGeometry args={[0.3]} />
            <meshStandardMaterial
              color="#ffe66d"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        </Float>

        <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.6}>
          <mesh position={[-1, 2, 0.3]} rotation={[0.1, 0.8, 0.2]}>
            <cylinderGeometry args={[0.25, 0.25, 0.5]} />
            <meshStandardMaterial
              color="#a8e6cf"
              metalness={0.5}
              roughness={0.5}
            />
          </mesh>
        </Float>

        {/* Floating Euro Symbol - Using simple mesh */}
        <Float speed={3} rotationIntensity={0.5} floatIntensity={0.4}>
          <mesh position={[2, 2.5, 1]}>
            <torusGeometry args={[0.3, 0.1, 16, 32]} />
            <meshStandardMaterial
              color="#00ff88"
              emissive="#00cc66"
              emissiveIntensity={0.3}
            />
          </mesh>
        </Float>

        {/* Percentage Discount - Using simple mesh */}
        <Float speed={2.2} rotationIntensity={0.3} floatIntensity={0.5}>
          <mesh position={[-2, 1.8, 0.8]}>
            <octahedronGeometry args={[0.25]} />
            <meshStandardMaterial
              color="#ff8b94"
              emissive="#ff5566"
              emissiveIntensity={0.2}
            />
          </mesh>
        </Float>
      </group>
    </Float>
  );
}

function EcommerceScene() {
  return (
    <group>
      <Environment preset="studio" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-3, 3, 3]} intensity={0.6} color="#ff6b6b" />
      <pointLight position={[3, -2, 2]} intensity={0.5} color="#4ecdc4" />

      <ShoppingCart />
    </group>
  );
}

export default function EcommerceShowcase() {
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
              camera={{ position: [0, 0, 5], fov: 60 }}
              style={{ background: "transparent" }}
            >
              <Suspense fallback={null}>
                <EcommerceScene />
                <OrbitControls
                  enableZoom={false}
                  enablePan={false}
                  autoRotate
                  autoRotateSpeed={0.8}
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
              E-commerce Platforms die{" "}
              <span className="bg-gradient-to-r from-stellar-400 to-cosmic-400 bg-clip-text text-transparent">
                Converteren
              </span>
            </h2>

            <p className="text-lg text-cosmic-200 mb-8 leading-relaxed">
              Van kleine webshops tot grootschalige marketplaces - wij bouwen
              e-commerce oplossingen die niet alleen verkopen, maar ook jullie
              klanten verrassen met een unieke shopping ervaring.
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
                    Hoge Conversie
                  </h3>
                  <p className="text-sm text-cosmic-300">
                    Geoptimaliseerd voor verkoop
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
                    Veilige Betalingen
                  </h3>
                  <p className="text-sm text-cosmic-300">
                    SSL en payment gateway
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
                    Inventory Management
                  </h3>
                  <p className="text-sm text-cosmic-300">
                    Automatische voorraad tracking
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
                    Mobile Optimized
                  </h3>
                  <p className="text-sm text-cosmic-300">
                    Perfect op mobiele apparaten
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cosmic-800/50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">
                Case Study: Nederlandse Fashion Brand
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-stellar-400">
                    +340%
                  </div>
                  <div className="text-sm text-cosmic-300">
                    Conversie Verbetering
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-stellar-400">
                    2.1s
                  </div>
                  <div className="text-sm text-cosmic-300">Laadtijd</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-stellar-400">
                    €2.4M
                  </div>
                  <div className="text-sm text-cosmic-300">Extra Omzet</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/contact" variant="primary">
                Start Jullie Webshop
              </Button>
              <Button href="/diensten" variant="secondary">
                E-commerce Info
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
