'use client'

import React, { Suspense, useRef, useState } from 'react'

import { Box, Sphere, Cylinder, OrbitControls, Environment, Html } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Group } from 'three'

function ProductDisplay({ position, productType }: { position: [number, number, number], productType: 'phone' | 'watch' | 'headphones' }) {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1
    }
  })

  const renderProduct = () => {
    switch (productType) {
      case 'phone':
        return (
          <group>
            <Box args={[0.8, 1.6, 0.1]}>
              <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
            </Box>
            <Box args={[0.7, 1.4, 0.02]} position={[0, 0, 0.06]}>
              <meshStandardMaterial color="#000" emissive="#0066cc" emissiveIntensity={0.2} />
            </Box>
          </group>
        )
      
      case 'watch':
        return (
          <group>
            <Cylinder args={[0.4, 0.4, 0.15, 32]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="#2c3e50" metalness={0.8} roughness={0.2} />
            </Cylinder>
            <Cylinder args={[0.35, 0.35, 0.02, 32]} position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="#000" emissive="#00ff88" emissiveIntensity={0.3} />
            </Cylinder>
          </group>
        )
      
      case 'headphones':
        return (
          <group>
            <Cylinder args={[1, 1, 0.1, 32, 1, false, 0, Math.PI]} position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#2c3e50" metalness={0.7} roughness={0.3} />
            </Cylinder>
            <Sphere args={[0.3]} position={[-0.8, 0, 0]}>
              <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.4} />
            </Sphere>
            <Sphere args={[0.3]} position={[0.8, 0, 0]}>
              <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.4} />
            </Sphere>
          </group>
        )
      
      default:
        return null
    }
  }

  return (
    <group 
      ref={groupRef} 
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      {renderProduct()}
      
      <Html position={[0, -1, 0]} center>
        <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-lg text-center pointer-events-none">
          <div className="text-xs font-semibold text-gray-800 capitalize">
            {productType}
          </div>
        </div>
      </Html>
    </group>
  )
}

function EcommerceScene() {
  return (
    <>
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        maxDistance={8}
        minDistance={3}
        autoRotate
        autoRotateSpeed={0.3}
      />
      
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ff6b6b" />
      <pointLight position={[10, -10, 10]} intensity={0.3} color="#4ecdc4" />
      
      <ProductDisplay position={[-2, 0, 0]} productType="phone" />
      <ProductDisplay position={[0, 0, 0]} productType="watch" />
      <ProductDisplay position={[2, 0, 0]} productType="headphones" />
      
      <Environment preset="studio" />
    </>
  )
}

export default function SimpleEcommerceShowcase({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full h-64 md:h-80 lg:h-96 ${className}`}>
      <Suspense 
        fallback={
          <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-pink-700/20 rounded-lg flex items-center justify-center border border-purple-500/30">
            <div className="text-center text-white">
              <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2 md:mb-3"></div>
              <div className="text-xs md:text-sm">Loading E-commerce 3D...</div>
            </div>
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
        </Canvas>
      </Suspense>
    </div>
  )
}