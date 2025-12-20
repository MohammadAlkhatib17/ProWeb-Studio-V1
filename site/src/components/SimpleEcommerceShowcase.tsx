'use client'

import React, { Suspense, useRef, useState, useEffect } from 'react'
import { Box, Cylinder, OrbitControls, Environment, Float, RoundedBox } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { Group } from 'three'
import { Smartphone, Watch, Headphones } from 'lucide-react'

type ProductType = 'phone' | 'watch' | 'headphones'

function AdjustCamera() {
  const { camera, size } = useThree()

  useEffect(() => {
    // Initial setup
    const updateCamera = () => {
      const aspect = size.width / size.height
      if (aspect < 1) {
        // Widen FOV for portrait mode
        // 45 is default. We want vertical coverage to feel similar to horizontal coverage
        // At aspect 0.5, we need nearly double the FOV horizontally? 
        // Let's try boosting it. 
        // An FOV of 70 works well for portrait 3D product lovers.
        // Dynamic formula: 
        const targetFov = 45 + (1 - aspect) * 40
        if (camera instanceof THREE.PerspectiveCamera) {
          camera.fov = targetFov
          camera.updateProjectionMatrix()
        }
      } else {
        // Reset to default on desktop
        if (camera instanceof THREE.PerspectiveCamera) {
          camera.fov = 45
          camera.updateProjectionMatrix()
        }
      }
    }
    updateCamera()
  }, [camera, size]) // Update when size changes

  return null
}

function ProductDisplay({ position, productType, active }: { position: [number, number, number], productType: ProductType, active: boolean }) {
  const groupRef = useRef<Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      // Smooth rotation
      groupRef.current.rotation.y += 0.005

      // Float animation matching the active state
      const targetY = active ? 0 : -10 // Move inactive items out of view
      const targetScale = active ? 1 : 0

      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.1
      groupRef.current.scale.x += (targetScale - groupRef.current.scale.x) * 0.1
      groupRef.current.scale.y += (targetScale - groupRef.current.scale.y) * 0.1
      groupRef.current.scale.z += (targetScale - groupRef.current.scale.z) * 0.1
    }
  })

  // ONLY render if somewhat active/visible to save resources (optional optimization)

  const renderProduct = () => {
    switch (productType) {
      case 'phone':
        return (
          <group>
            {/* Phone Body */}
            <RoundedRect args={[1.5, 3, 0.2]} radius={0.2} color="#1a1a1a" metalness={0.9} roughness={0.1} />
            {/* Screen */}
            <Box args={[1.4, 2.8, 0.02]} position={[0, 0, 0.11]}>
              <meshStandardMaterial color="#000" emissive="#0066cc" emissiveIntensity={0.5} roughness={0.2} />
            </Box>
            {/* Camera bump */}
            <RoundedRect args={[0.5, 0.8, 0.05]} radius={0.1} position={[0.4, 0.8, -0.12]} color="#111" />
          </group>
        )

      case 'watch':
        return (
          <group rotation={[0.5, 0, 0]}>
            {/* Watch Band */}
            <Cylinder args={[0.85, 0.85, 0.6, 64, 1, true]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="#333" side={2} />
            </Cylinder>
            {/* Watch Face */}
            <Cylinder args={[0.9, 0.9, 0.15, 64]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="#2c3e50" metalness={0.9} roughness={0.1} />
            </Cylinder>
            {/* Screen */}
            <Cylinder args={[0.8, 0.8, 0.16, 64]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="#000" emissive="#00ff88" emissiveIntensity={0.4} />
            </Cylinder>
          </group>
        )

      case 'headphones':
        return (
          <group>
            {/* Headband */}
            <TorusArc color="#1a1a1a" />
            {/* Ear cups */}
            <group position={[-1.6, -0.5, 0]}>
              <Cylinder args={[0.8, 0.8, 0.5, 32]} rotation={[0, 0, Math.PI / 2]}>
                <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.2} />
              </Cylinder>
              <Cylinder args={[0.7, 0.7, 0.6, 32]} rotation={[0, 0, Math.PI / 2]}>
                <meshStandardMaterial color="#000" emissive="#ff0088" emissiveIntensity={0.2} />
              </Cylinder>
            </group>
            <group position={[1.6, -0.5, 0]}>
              <Cylinder args={[0.8, 0.8, 0.5, 32]} rotation={[0, 0, Math.PI / 2]}>
                <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.2} />
              </Cylinder>
              <Cylinder args={[0.7, 0.7, 0.6, 32]} rotation={[0, 0, Math.PI / 2]}>
                <meshStandardMaterial color="#000" emissive="#ff0088" emissiveIntensity={0.2} />
              </Cylinder>
            </group>
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
    >
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {renderProduct()}
      </Float>
    </group>
  )
}

// Helpers for geometry
interface RoundedRectProps {
  args: [number, number, number]
  position?: [number, number, number]
  color: string
  metalness?: number
  roughness?: number
  radius?: number
}

function RoundedRect({ args, position = [0, 0, 0], color, metalness = 0.5, roughness = 0.5, radius = 0.1 }: RoundedRectProps) {
  return (
    <RoundedBox args={args} position={position} radius={radius} smoothness={4}>
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </RoundedBox>
  )
}

function TorusArc({ color }: { color: string }) {
  return (
    <mesh rotation={[0, 0, 0]}>
      <torusGeometry args={[1.6, 0.15, 16, 50, Math.PI]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}


function EcommerceScene({ activeProduct }: { activeProduct: ProductType }) {
  return (
    <>
      <OrbitControls
        enablePan={false}
        enableZoom={false} // Disable zoom for cleaner UI
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
        autoRotate
        autoRotateSpeed={1}
      />

      <AdjustCamera />

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 7]} intensity={2} />
      <pointLight position={[-10, 0, -10]} intensity={1} color="#00D9FF" />
      <pointLight position={[10, 0, 10]} intensity={1} color="#FF2BD6" />

      <ProductDisplay position={[0, 0, 0]} productType="phone" active={activeProduct === 'phone'} />
      <ProductDisplay position={[0, 0, 0]} productType="watch" active={activeProduct === 'watch'} />
      <ProductDisplay position={[0, 0, 0]} productType="headphones" active={activeProduct === 'headphones'} />

      <Environment preset="city" />
    </>
  )
}

export default function SimpleEcommerceShowcase({ className = '' }: { className?: string }) {
  const [activeProduct, setActiveProduct] = useState<ProductType>('phone')

  return (
    <div className={`w-full h-full relative ${className} group`}>
      {/* UI Overlay */}
      <div className="absolute top-4 left-0 right-0 z-10 flex justify-center gap-4">
        <button
          onClick={() => setActiveProduct('phone')}
          className={`p-3 rounded-full backdrop-blur-md border transition-all duration-300 ${activeProduct === 'phone' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] scale-110' : 'bg-black/30 border-white/10 text-slate-400 hover:bg-white/10'}`}
        >
          <Smartphone className="w-6 h-6" />
        </button>
        <button
          onClick={() => setActiveProduct('watch')}
          className={`p-3 rounded-full backdrop-blur-md border transition-all duration-300 ${activeProduct === 'watch' ? 'bg-green-500/20 border-green-400 text-green-300 shadow-[0_0_20px_rgba(74,222,128,0.3)] scale-110' : 'bg-black/30 border-white/10 text-slate-400 hover:bg-white/10'}`}
        >
          <Watch className="w-6 h-6" />
        </button>
        <button
          onClick={() => setActiveProduct('headphones')}
          className={`p-3 rounded-full backdrop-blur-md border transition-all duration-300 ${activeProduct === 'headphones' ? 'bg-magenta-500/20 border-magenta-400 text-magenta-300 shadow-[0_0_20px_rgba(232,121,249,0.3)] scale-110' : 'bg-black/30 border-white/10 text-slate-400 hover:bg-white/10'}`}
        >
          <Headphones className="w-6 h-6" />
        </button>
      </div>

      <Suspense
        fallback={
          <div className="w-full h-full bg-cosmic-900/50 rounded-2xl flex items-center justify-center border border-white/5">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <span className="text-cyan-400 text-sm tracking-wider">LOADING 3D ASSETS</span>
            </div>
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          className="rounded-2xl"
          dpr={[1, 2]}
          gl={{ preserveDrawingBuffer: true, alpha: true }}
        >
          <EcommerceScene activeProduct={activeProduct} />
        </Canvas>
      </Suspense>

      {/* Decorative gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 to-transparent pointer-events-none rounded-b-2xl" />
      <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
        <span className="text-xs text-white/40 uppercase tracking-[0.2em]">Interactive Configurator Demo</span>
      </div>
    </div>
  )
}