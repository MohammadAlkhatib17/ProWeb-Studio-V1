'use client'

import React, { Suspense, useRef } from 'react'

import { Box, RoundedBox, OrbitControls, Environment, Html } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Group } from 'three'

function SimpleLaptopModel() {
  const groupRef = useRef<Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Laptop Base */}
      <RoundedBox
        args={[3, 0.2, 2]}
        position={[0, -0.1, 0]}
        radius={0.05}
        smoothness={4}
      >
        <meshStandardMaterial color="#2c3e50" metalness={0.6} roughness={0.4} />
      </RoundedBox>
      
      {/* Laptop Screen */}
      <RoundedBox
        args={[2.8, 1.8, 0.1]}
        position={[0, 0.9, -0.9]}
        rotation={[-0.1, 0, 0]}
        radius={0.05}
        smoothness={4}
      >
        <meshStandardMaterial color="#1a1a1a" metalness={0.1} roughness={0.9} />
      </RoundedBox>
      
      {/* Screen Content */}
      <Box args={[2.6, 1.6, 0.02]} position={[0, 0.9, -0.84]} rotation={[-0.1, 0, 0]}>
        <meshStandardMaterial color="#000" emissive="#0066cc" emissiveIntensity={0.3} />
      </Box>
      
      {/* Screen Text */}
      <Html
        transform
        occlude
        position={[0, 0.9, -0.83]}
        rotation={[-0.1, 0, 0]}
        style={{
          width: '200px',
          height: '120px',
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 rounded flex items-center justify-center text-white text-xs font-bold">
          <div className="text-center">
            <div className="text-sm mb-1">ProWeb Studio</div>
            <div className="text-xs opacity-80">3D Web Development</div>
          </div>
        </div>
      </Html>
    </group>
  )
}

function SimpleScene() {
  return (
    <>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
        autoRotate
        autoRotateSpeed={0.5}
      />
      
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />
      
      <SimpleLaptopModel />
      
      <Environment preset="city" />
    </>
  )
}

export default function SimplePortfolioComputer({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full h-64 md:h-80 lg:h-96 ${className}`}>
      <Suspense 
        fallback={
          <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-purple-700/20 rounded-lg flex items-center justify-center border border-blue-500/30">
            <div className="text-center text-white">
              <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2 md:mb-3"></div>
              <div className="text-xs md:text-sm">Loading 3D Portfolio...</div>
            </div>
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 6], fov: 50 }}
          className="rounded-lg"
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
        >
          <SimpleScene />
        </Canvas>
      </Suspense>
    </div>
  )
}