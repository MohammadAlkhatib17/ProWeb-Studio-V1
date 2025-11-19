'use client'

import React, { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents, Preload, PerformanceMonitor } from '@react-three/drei'
import { motion } from 'framer-motion'

interface LoadedAsset {
  path: string
  loaded: boolean
}

interface PerformanceCanvasProps {
  children: React.ReactNode
  className?: string
  camera?: {
    position?: [number, number, number]
    fov?: number
  }
  fallbackContent?: React.ReactNode
  loadingColor?: string
}

export function PerformanceCanvas({ 
  children, 
  className = '', 
  camera = { position: [0, 0, 5], fov: 60 },
  fallbackContent,
  loadingColor = 'blue'
}: PerformanceCanvasProps) {
  const [, setDpr] = React.useState(1.5)
  
  // Adaptive performance based on device capabilities
  const canvasSettings = useMemo(() => {
    const isLowEnd = typeof window !== 'undefined' && (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      navigator.hardwareConcurrency <= 4
    )
    
    return {
      dpr: isLowEnd ? [1, 1.5] as [number, number] : [1, 2] as [number, number],
      performance: { min: isLowEnd ? 0.3 : 0.5 },
      antialias: !isLowEnd,
      alpha: true,
      powerPreference: isLowEnd ? 'low-power' : 'high-performance'
    }
  }, [])

  const defaultFallback = (
    <div className="w-full h-96 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className={`w-8 h-8 border-2 border-${loadingColor}-500 border-t-transparent rounded-full`}
      />
    </div>
  )

  return (
    <Suspense fallback={fallbackContent || defaultFallback}>
      <Canvas
        camera={camera}
        className={`rounded-lg ${className}`}
        dpr={canvasSettings.dpr}
        performance={canvasSettings.performance}
        gl={{
          antialias: canvasSettings.antialias,
          alpha: canvasSettings.alpha,
          powerPreference: canvasSettings.powerPreference as WebGLPowerPreference
        }}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        
        <PerformanceMonitor
          onIncline={() => setDpr(2)}
          onDecline={() => setDpr(1)}
        />
        
        {children}
        <Preload all />
      </Canvas>
    </Suspense>
  )
}

// Level of Detail hook for optimizing based on distance and performance
export function useLOD(distance: number, performanceTier: number = 2) {
  return useMemo(() => {
    const isCloseUp = distance < 5
    const isMidRange = distance < 10
    
    // High performance tier
    if (performanceTier >= 3) {
      return {
        geometry: isCloseUp ? 'high' : isMidRange ? 'medium' : 'low',
        shadows: true,
        reflections: true,
        postProcessing: true,
        particleCount: isCloseUp ? 100 : isMidRange ? 50 : 20
      }
    }
    
    // Medium performance tier
    if (performanceTier >= 2) {
      return {
        geometry: isCloseUp ? 'medium' : 'low',
        shadows: isCloseUp,
        reflections: isCloseUp,
        postProcessing: false,
        particleCount: isCloseUp ? 50 : 20
      }
    }
    
    // Low performance tier
    return {
      geometry: 'low',
      shadows: false,
      reflections: false,
      postProcessing: false,
      particleCount: 10
    }
  }, [distance, performanceTier])
}

// Optimized material component
interface OptimizedMaterialProps {
  color?: string
  metalness?: number
  roughness?: number
  emissive?: string
  emissiveIntensity?: number
  performanceTier?: number
}

export function OptimizedMaterial({
  color = '#3498db',
  metalness = 0.5,
  roughness = 0.5,
  emissive,
  emissiveIntensity = 0.1,
  performanceTier = 2
}: OptimizedMaterialProps) {
  const materialProps = useMemo(() => {
    const baseProps = { color, metalness, roughness }
    
    // Add emissive properties only for higher performance tiers
    if (performanceTier >= 2 && emissive) {
      return {
        ...baseProps,
        emissive,
        emissiveIntensity
      }
    }
    
    return baseProps
  }, [color, metalness, roughness, emissive, emissiveIntensity, performanceTier])
  
  return <meshStandardMaterial {...materialProps} />
}

// Asset loading optimization
export function useOptimizedAssets(assetPaths: string[]) {
  const [loadedAssets, setLoadedAssets] = React.useState<Record<string, LoadedAsset | null>>({})
  const [loading, setLoading] = React.useState(true)
  
  React.useEffect(() => {
    const loadAssets = async () => {
      try {
        // Implement progressive loading based on priority
        const priorityAssets = assetPaths.slice(0, 2) // Load first 2 immediately
        const deferredAssets = assetPaths.slice(2) // Load rest after delay
        
        // Load priority assets first
        const priorityLoaded = await Promise.allSettled(
          priorityAssets.map(async (path) => {
            // Placeholder for actual asset loading logic
            return { path, loaded: true }
          })
        )
        
        setLoadedAssets(prev => ({
          ...prev,
          ...Object.fromEntries(priorityLoaded.map((result, index) => [
            priorityAssets[index],
            result.status === 'fulfilled' ? result.value : null
          ]))
        }))
        
        // Load deferred assets after a delay
        setTimeout(async () => {
          const deferredLoaded = await Promise.allSettled(
            deferredAssets.map(async (path) => {
              return { path, loaded: true }
            })
          )
          
          setLoadedAssets(prev => ({
            ...prev,
            ...Object.fromEntries(deferredLoaded.map((result, index) => [
              deferredAssets[index],
              result.status === 'fulfilled' ? result.value : null
            ]))
          }))
          
          setLoading(false)
        }, 1000)
        
      } catch (error) {
        console.warn('Asset loading failed:', error)
        setLoading(false)
      }
    }
    
    loadAssets()
  }, [assetPaths])
  
  return { loadedAssets, loading }
}