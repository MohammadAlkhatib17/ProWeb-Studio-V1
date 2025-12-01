'use client';

import { Suspense, useRef } from 'react';

import { Float, OrbitControls, Environment } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import * as THREE from 'three';

import { Button } from '@/components/Button';

function RotatingComputer() {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={meshRef}>
        {/* Computer Monitor */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[2.5, 1.5, 0.1]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Screen */}
        <mesh position={[0, 0.5, 0.051]}>
          <boxGeometry args={[2.3, 1.3, 0.01]} />
          <meshStandardMaterial 
            color="#1a1a2e" 
            emissive="#0066cc"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Stand */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.1, 0.2, 0.8]} />
          <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Base */}
        <mesh position={[0, -0.7, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 0.1]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Floating code elements - Using simple meshes instead of Text3D */}
        <Float speed={3} rotationIntensity={0.2} floatIntensity={0.5}>
          <mesh position={[-1.5, 2, 1]}>
            <boxGeometry args={[0.5, 0.3, 0.1]} />
            <meshStandardMaterial color="#00ff88" emissive="#00cc66" emissiveIntensity={0.2} />
          </mesh>
        </Float>

        <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.4}>
          <mesh position={[1.8, 1.5, 0.8]}>
            <sphereGeometry args={[0.15]} />
            <meshStandardMaterial color="#ff6b6b" emissive="#ff4444" emissiveIntensity={0.2} />
          </mesh>
        </Float>
      </group>
    </Float>
  );
}

function WebScene() {
  return (
    <group>
      <Environment preset="sunset" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, 2, 2]} intensity={0.6} color="#00D4FF" />
      
      <RotatingComputer />
    </group>
  );
}

export default function WebDevelopmentShowcase() {
  return (
    <div id="showcases" className="py-16 lg:py-24">
      <div className="container mx-auto px-safe">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Web Ontwikkeling met{' '}
              <span className="bg-gradient-to-r from-stellar-400 to-cosmic-400 bg-clip-text text-transparent">
                3D Magie
              </span>
            </h2>
            
            <p className="text-lg text-cosmic-200 mb-8 leading-relaxed">
              Wij creëren interactieve websites die niet alleen mooi zijn, maar ook presteren. 
              Met Three.js en React brengen wij jullie digitale visie tot leven met cutting-edge 3D technologie.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-stellar-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Responsive Design</h3>
                  <p className="text-sm text-cosmic-300">Perfect op alle apparaten</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-stellar-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">SEO Geoptimaliseerd</h3>
                  <p className="text-sm text-cosmic-300">Hoog in Google rankings</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-stellar-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Lightning Fast</h3>
                  <p className="text-sm text-cosmic-300">Optimale laadtijden</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-stellar-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Interactieve 3D</h3>
                  <p className="text-sm text-cosmic-300">Unieke gebruikerservaring</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                href="/contact"
                variant="primary"
              >
                Start Jullie Project
              </Button>
              <Button
                href="/diensten"
                variant="secondary"
              >
                Meer Info
              </Button>
            </div>
          </motion.div>

          {/* 3D Scene */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="h-96 lg:h-[500px]"
          >
            <Canvas
              camera={{ position: [0, 0, 5], fov: 60 }}
              style={{ background: 'transparent' }}
            >
              <Suspense fallback={null}>
                <WebScene />
                <OrbitControls 
                  enableZoom={false}
                  enablePan={false}
                  autoRotate
                  autoRotateSpeed={1}
                />
              </Suspense>
            </Canvas>
          </motion.div>
        </div>
      </div>
    </div>
  );
}