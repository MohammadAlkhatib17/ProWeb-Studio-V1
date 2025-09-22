'use client'

import React, { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  Sphere, 
  Torus,
  RoundedBox, 
  OrbitControls, 
  Environment, 
  ContactShadows,
  Preload,
  useDetectGPU,
  Text,
  MeshDistortMaterial
} from '@react-three/drei'
import { Group } from 'three'
import { motion } from 'framer-motion'

interface LogoElementProps {
  position?: [number, number, number]
  color?: string
  type?: 'sphere' | 'cube' | 'torus'
  delay?: number
}

function LogoElement({ position = [0, 0, 0], color = '#3498db', type = 'sphere', delay = 0 }: LogoElementProps) {
  const meshRef = useRef<any>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime + delay
      meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.3
      meshRef.current.rotation.y = Math.sin(time * 0.7) * 0.3
      meshRef.current.rotation.z = Math.sin(time * 0.3) * 0.2
      
      // Pulsing effect
      const scale = 1 + Math.sin(time * 2) * 0.1
      meshRef.current.scale.setScalar(scale)
    }
  })

  const renderElement = () => {
    const commonProps = {
      ref: meshRef,
      position
    }

    switch (type) {
      case 'sphere':
        return (
          <Sphere {...commonProps} args={[0.5]}>
            <MeshDistortMaterial
              color={color}
              roughness={0.2}
              metalness={0.8}
              distort={0.3}
              speed={2}
            />
          </Sphere>
        )
      
      case 'cube':
        return (
          <RoundedBox {...commonProps} args={[0.8, 0.8, 0.8]} radius={0.1} smoothness={4}>
            <meshStandardMaterial
              color={color}
              roughness={0.1}
              metalness={0.9}
              emissive={color}
              emissiveIntensity={0.1}
            />
          </RoundedBox>
        )
      
      case 'torus':
        return (
          <Torus {...commonProps} args={[0.6, 0.2, 16, 32]}>
            <meshStandardMaterial
              color={color}
              roughness={0.3}
              metalness={0.7}
              transparent
              opacity={0.9}
            />
          </Torus>
        )
      
      default:
        return null
    }
  }

  return renderElement()
}

function BrandScene() {
  const groupRef = useRef<Group>(null)
  const { gl } = useThree()
  const gpu = useDetectGPU()
  
  const shadows = useMemo(() => {
    return gpu?.tier >= 2
  }, [gpu])
  
  React.useEffect(() => {
    gl.shadowMap.enabled = shadows
  }, [gl, shadows])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

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
        autoRotateSpeed={0.5}
      />
      
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow={shadows}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#e74c3c" />
      <pointLight position={[5, -5, -5]} intensity={0.5} color="#9b59b6" />
      <pointLight position={[0, 0, 10]} intensity={0.3} color="#f39c12" />
      
      <group ref={groupRef}>
        {/* Central logo elements */}
        <LogoElement position={[0, 0, 0]} color="#3498db" type="sphere" delay={0} />
        <LogoElement position={[-1.5, 0, 0]} color="#e74c3c" type="cube" delay={0.5} />
        <LogoElement position={[1.5, 0, 0]} color="#2ecc71" type="torus" delay={1} />
        <LogoElement position={[0, 1.5, 0]} color="#f39c12" type="sphere" delay={1.5} />
        <LogoElement position={[0, -1.5, 0]} color="#9b59b6" type="cube" delay={2} />
        
        {/* Orbiting elements */}
        <LogoElement position={[2.5, 1, 1]} color="#1abc9c" type="sphere" delay={0.3} />
        <LogoElement position={[-2.5, -1, -1]} color="#e67e22" type="torus" delay={0.8} />
      </group>
      
      {/* Brand text */}
      <Text
        position={[0, -3, 0]}
        fontSize={0.6}
        color="#2c3e50"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        ProWeb Studio
      </Text>
      
      <Text
        position={[0, -3.8, 0]}
        fontSize={0.25}
        color="#7f8c8d"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Regular.woff"
      >
        Brand Identity & Design
      </Text>
      
      {/* Platform */}
      <RoundedBox
        args={[8, 0.1, 8]}
        position={[0, -4.5, 0]}
        radius={0.05}
        smoothness={4}
      >
        <meshStandardMaterial color="#ecf0f1" metalness={0.1} roughness={0.9} />
      </RoundedBox>
      
      {shadows && (
        <ContactShadows
          position={[0, -4.4, 0]}
          opacity={0.2}
          scale={15}
          blur={3}
          far={8}
        />
      )}
      
      <Environment preset="sunset" />
    </>
  )
}

interface BrandIdentityModelProps {
  className?: string
}

export default function BrandIdentityModel({ className = '' }: BrandIdentityModelProps) {
  return (
    <div className={`w-full h-96 ${className}`}>
      {/* SEO Fallback Content */}
      <noscript>
        <div className="w-full h-96 bg-gradient-to-br from-orange-600 to-red-700 rounded-lg flex items-center justify-center text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">ProWeb Studio</h3>
            <p className="text-lg">Brand Identity & Design</p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/20 p-3 rounded">
                <div className="font-semibold">Logo Design</div>
                <div className="text-xs">Unique & Memorable</div>
              </div>
              <div className="bg-white/20 p-3 rounded">
                <div className="font-semibold">Brand Guidelines</div>
                <div className="text-xs">Consistent Identity</div>
              </div>
              <div className="bg-white/20 p-3 rounded">
                <div className="font-semibold">Visual Identity</div>
                <div className="text-xs">Complete Package</div>
              </div>
              <div className="bg-white/20 p-3 rounded">
                <div className="font-semibold">3D Visualization</div>
                <div className="text-xs">Modern Approach</div>
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
              className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full"
            />
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 6], fov: 60 }}
          className="rounded-lg"
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
        >
          <BrandScene />
          <Preload all />
        </Canvas>
      </Suspense>
    </div>
  )
}