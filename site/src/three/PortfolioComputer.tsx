'use client'

import React, { useRef, useMemo, Suspense } from 'react'

import { 
  Box, 
  RoundedBox, 
  OrbitControls, 
  Environment, 
  ContactShadows,
  Html,
  Preload,
  useDetectGPU
} from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { motion } from 'framer-motion'

import type { ThreeMeshRef, ThreeGroupRef, GPUTier } from '@/types/three'

import type { MeshStandardMaterial } from 'three'

interface LaptopModelProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
}

function LaptopModel({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] }: LaptopModelProps) {
  const groupRef = useRef<ThreeGroupRef>(null)
  const screenRef = useRef<ThreeMeshRef>(null)
  
  // Smooth rotation animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
    
    if (screenRef.current) {
      const material = screenRef.current.material as MeshStandardMaterial
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = 0.1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      }
    }
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Laptop Base */}
      <RoundedBox
        args={[3, 0.2, 2]}
        position={[0, -0.1, 0]}
        radius={0.05}
        smoothness={4}
      >
        <meshStandardMaterial color="#2c3e50" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      
      {/* Laptop Screen */}
      <group position={[0, 0.8, -0.9]} rotation={[-0.1, 0, 0]}>
        <RoundedBox
          args={[2.8, 1.8, 0.1]}
          radius={0.05}
          smoothness={4}
        >
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
        </RoundedBox>
        
        {/* Screen Display */}
        <Box
          ref={screenRef}
          args={[2.4, 1.4, 0.02]}
          position={[0, 0, 0.06]}
        >
          <meshStandardMaterial 
            color="#0066cc"
            emissive="#0033aa"
            emissiveIntensity={0.1}
          />
        </Box>
        
        {/* Screen Content */}
        <Html
          transform
          occlude
          position={[0, 0, 0.07]}
          style={{
            width: '240px',
            height: '140px',
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-lg">
            <div className="text-center">
              <div className="text-lg mb-1">ProWeb Studio</div>
              <div className="text-xs opacity-80">Portfolio Showcase</div>
            </div>
          </div>
        </Html>
      </group>
      
      {/* Laptop Keyboard */}
      <Box
        args={[2.6, 0.05, 1.6]}
        position={[0, 0.025, 0.2]}
      >
        <meshStandardMaterial color="#34495e" roughness={0.8} />
      </Box>
      
      {/* Trackpad */}
      <RoundedBox
        args={[0.8, 0.02, 0.6]}
        position={[0, 0.04, 0.6]}
        radius={0.02}
        smoothness={4}
      >
        <meshStandardMaterial color="#2c3e50" metalness={0.5} roughness={0.3} />
      </RoundedBox>
    </group>
  )
}

function Scene() {
  const { gl } = useThree()
  const gpu = useDetectGPU() as GPUTier | undefined
  
  // Optimize based on device capabilities
  const shadows = useMemo(() => {
    return (gpu?.tier ?? 0) >= 2
  }, [gpu])
  
  React.useEffect(() => {
    gl.shadowMap.enabled = shadows
  }, [gl, shadows])

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
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow={shadows}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />
      
      <LaptopModel />
      
      {shadows && (
        <ContactShadows
          position={[0, -1, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
        />
      )}
      
      <Environment preset="city" />
    </>
  )
}

interface PortfolioComputerProps {
  className?: string
}

export default function PortfolioComputer({ className = '' }: PortfolioComputerProps) {
  return (
    <div className={`w-full h-96 ${className}`}>
      {/* SEO Fallback Content */}
      <noscript>
        <div className="w-full h-96 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">ProWeb Studio</h3>
            <p className="text-lg">Interactive 3D Portfolio Showcase</p>
            <p className="text-sm mt-2 opacity-80">
              Experience our work in an immersive 3D environment
            </p>
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
              className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 6], fov: 50 }}
          className="rounded-lg"
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
        >
          <Scene />
          <Preload all />
        </Canvas>
      </Suspense>
    </div>
  )
}