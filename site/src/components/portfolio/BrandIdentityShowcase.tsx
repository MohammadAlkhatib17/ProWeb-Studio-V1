'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

function BrandElements() {
  const logoRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (logoRef.current) {
      logoRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
      logoRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.1;
    }
  });

  return (
    <group ref={logoRef}>
      {/* Central Brand Logo */}
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh position={[0, 0, 0]}>
          <icosahedronGeometry args={[1]} />
          <meshStandardMaterial 
            color="#ff6b6b" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#ff3333"
            emissiveIntensity={0.2}
          />
        </mesh>
      </Float>

      {/* Floating Brand Name - Using simple mesh */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[2.5, 0.4, 0.2]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#cccccc" 
            emissiveIntensity={0.1}
          />
        </mesh>
      </Float>

      {/* Color Palette Spheres */}
      <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh position={[-3, 1, 1]} rotation={[0.2, 0.3, 0.1]}>
          <sphereGeometry args={[0.4]} />
          <meshStandardMaterial color="#ff6b6b" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[-2, -1.5, 0.5]} rotation={[0.5, 0.2, 0.3]}>
          <sphereGeometry args={[0.3]} />
          <meshStandardMaterial color="#4ecdc4" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>

      <Float speed={2.2} rotationIntensity={0.4} floatIntensity={0.3}>
        <mesh position={[3, 0.5, -0.5]} rotation={[0.1, 0.8, 0.2]}>
          <sphereGeometry args={[0.35]} />
          <meshStandardMaterial color="#ffe66d" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh position={[2, -2, 1]} rotation={[0.7, 0.3, 0.9]}>
          <sphereGeometry args={[0.25]} />
          <meshStandardMaterial color="#a8e6cf" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>

      {/* Typography Elements - Using simple mesh */}
      <Float speed={3} rotationIntensity={0.1} floatIntensity={0.4}>
        <mesh position={[-2.5, 3, 2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.3]} />
          <meshStandardMaterial 
            color="#00d4ff" 
            emissive="#0099cc" 
            emissiveIntensity={0.2}
          />
        </mesh>
      </Float>

      {/* Design Elements */}
      <Float speed={2.8} rotationIntensity={0.5} floatIntensity={0.3}>
        <mesh position={[3.5, 2, 0]} rotation={[0.3, 0.5, 0.7]}>
          <torusGeometry args={[0.3, 0.1, 16, 32]} />
          <meshStandardMaterial 
            color="#ff8b94" 
            metalness={0.7} 
            roughness={0.3}
          />
        </mesh>
      </Float>

      <Float speed={2.3} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh position={[-3.5, -0.5, -1]} rotation={[0.6, 0.2, 0.4]}>
          <cylinderGeometry args={[0.2, 0.2, 1]} />
          <meshStandardMaterial 
            color="#dda0dd" 
            metalness={0.6} 
            roughness={0.4}
          />
        </mesh>
      </Float>
    </group>
  );
}

function BrandScene() {
  return (
    <group>
      <Environment preset="sunset" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, 3, 2]} intensity={0.6} color="#ff6b6b" />
      <pointLight position={[5, -2, 3]} intensity={0.5} color="#4ecdc4" />
      
      <BrandElements />
    </group>
  );
}

export default function BrandIdentityShowcase() {
  return (
    <div className="py-16 lg:py-24">
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
              Brand Identity met{' '}
              <span className="bg-gradient-to-r from-stellar-400 to-cosmic-400 bg-clip-text text-transparent">
                Nederlandse Flair
              </span>
            </h2>
            
            <p className="text-lg text-cosmic-200 mb-8 leading-relaxed">
              Van logo ontwerp tot complete huisstijl - wij creëren brand identities die resoneren 
              met de Nederlandse markt en jullie doelgroep aanspreken. Authentiek, herkenbaar en tijdloos.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-stellar-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Logo Ontwerp</h3>
                  <p className="text-sm text-cosmic-300">Uniek en herkenbaar</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-stellar-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Kleurpaletten</h3>
                  <p className="text-sm text-cosmic-300">Professioneel & consistent</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-stellar-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Typografie</h3>
                  <p className="text-sm text-cosmic-300">Leesbaar en stijlvol</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-stellar-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Brand Guidelines</h3>
                  <p className="text-sm text-cosmic-300">Complete huisstijl handleiding</p>
                </div>
              </div>
            </div>

            <div className="bg-cosmic-800/50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Nederlandse Brand Success</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-cosmic-300">Brand Recognition</span>
                  <span className="text-stellar-400 font-semibold">+85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cosmic-300">Customer Loyalty</span>
                  <span className="text-stellar-400 font-semibold">+67%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-cosmic-300">Market Share</span>
                  <span className="text-stellar-400 font-semibold">+43%</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-stellar-500 to-cosmic-500 hover:from-stellar-400 hover:to-cosmic-400 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Brand Identiteit Aanvragen
              </a>
              <a
                href="/diensten"
                className="inline-flex items-center px-6 py-3 border-2 border-stellar-400 text-stellar-400 hover:bg-stellar-400 hover:text-white font-semibold rounded-lg transition-all duration-300"
              >
                Design Portfolio
              </a>
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
              camera={{ position: [0, 0, 6], fov: 60 }}
              style={{ background: 'transparent' }}
            >
              <Suspense fallback={null}>
                <BrandScene />
                <OrbitControls 
                  enableZoom={false}
                  enablePan={false}
                  autoRotate
                  autoRotateSpeed={0.6}
                />
              </Suspense>
            </Canvas>
          </motion.div>
        </div>
      </div>
    </div>
  );
}