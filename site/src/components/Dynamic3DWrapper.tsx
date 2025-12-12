'use client';

import { Suspense, lazy, useEffect, useState, useRef, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';

import LoadingSkeleton from './LoadingSkeleton';
import ThreeErrorBoundary from './ThreeErrorBoundary';
import usePerformanceMonitor, { type PerformanceState } from '../hooks/usePerformanceMonitor';

// Performance context for sharing performance state across components
const PerformanceContext = createContext<PerformanceState | null>(null);

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};

interface DeviceCapabilities {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  performanceTier: 'low' | 'medium' | 'high';
  gpuTier: 'low' | 'medium' | 'high';
  deviceMemory: number;
  hardwareConcurrency: number;
  maxTextureSize: number;
  batteryLevel?: number;
  thermalState?: 'nominal' | 'fair' | 'serious' | 'critical';
}

interface Dynamic3DWrapperProps {
  children: React.ReactNode;
  variant?: 'hero' | 'scene' | 'canvas';
  className?: string;
  enablePerformanceMonitoring?: boolean;
  onDeviceCapabilities?: (capabilities: DeviceCapabilities) => void;
}

// Lazy load Three.js components only when needed
const Scene3D = lazy(() => import('./Scene3D'));

// Device detection utilities
function detectMobileDevice(): { isMobile: boolean; isIOS: boolean; isAndroid: boolean } {
  if (typeof window === 'undefined') return { isMobile: false, isIOS: false, isAndroid: false };

  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) ||
    window.innerWidth <= 768;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);

  return { isMobile, isIOS, isAndroid };
}

function detectGPUCapabilities(): Promise<{ gpuTier: 'low' | 'medium' | 'high'; maxTextureSize: number }> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;

    if (!gl) {
      resolve({ gpuTier: 'low', maxTextureSize: 512 });
      return;
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string : '';
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;

    // GPU tier detection based on renderer and capabilities
    let gpuTier: 'low' | 'medium' | 'high' = 'medium';

    const lowEndGPUs = [
      'PowerVR', 'Mali-400', 'Mali-450', 'Adreno 200', 'Adreno 203', 'Adreno 205',
      'Intel HD Graphics 3000', 'Intel HD Graphics 4000'
    ];

    const highEndGPUs = [
      'Adreno 6', 'Adreno 7', 'Mali-G7', 'Mali-G5', 'Apple A15', 'Apple A14', 'Apple A13',
      'GeForce RTX', 'GeForce GTX 1060', 'Radeon RX 5', 'Radeon RX 6'
    ];

    if (lowEndGPUs.some(gpu => renderer.includes(gpu))) {
      gpuTier = 'low';
    } else if (highEndGPUs.some(gpu => renderer.includes(gpu))) {
      gpuTier = 'high';
    }

    // Additional checks
    if (maxTextureSize < 2048) gpuTier = 'low';
    if (maxTextureSize >= 8192) gpuTier = 'high';

    resolve({ gpuTier, maxTextureSize });
  });
}

async function getBatteryInfo(): Promise<{ batteryLevel?: number; thermalState?: 'nominal' | 'fair' | 'serious' | 'critical' }> {
  try {
    // @ts-expect-error - Battery API is experimental
    const battery = await navigator.getBattery?.();
    const batteryLevel = battery?.level ? Math.round(battery.level * 100) : undefined;

    // Thermal state detection (iOS only)
    let thermalState: 'nominal' | 'fair' | 'serious' | 'critical' | undefined;
    // @ts-expect-error - Thermal API is iOS only
    if (navigator.thermalState) {
      // @ts-expect-error - thermalState API is iOS only, type definitions not available
      thermalState = navigator.thermalState;
    }

    return { batteryLevel, thermalState };
  } catch {
    return {};
  }
}

function getPerformanceTier(
  hardwareConcurrency: number,
  deviceMemory: number,
  gpuTier: 'low' | 'medium' | 'high',
  isMobile: boolean
): 'low' | 'medium' | 'high' {
  if (isMobile) {
    if (gpuTier === 'low' || hardwareConcurrency < 4 || deviceMemory < 4) return 'low';
    if (gpuTier === 'high' && hardwareConcurrency >= 6 && deviceMemory >= 6) return 'high';
    return 'medium';
  }

  if (gpuTier === 'low' || hardwareConcurrency < 4 || deviceMemory < 8) return 'low';
  if (gpuTier === 'high' && hardwareConcurrency >= 8 && deviceMemory >= 16) return 'high';
  return 'medium';
}

export default function Dynamic3DWrapper({
  children,
  variant = 'scene',
  className = '',
  enablePerformanceMonitoring = true,
  onDeviceCapabilities
}: Dynamic3DWrapperProps) {
  // STRICT CLIENT BOUNDARY FIX: Use strict isClient check
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  // State for capabilities and enhancements
  const [hasWebGL, setHasWebGL] = useState(true);
  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities | null>(null);
  const [progressiveEnhancement, setProgressiveEnhancement] = useState(false);

  // Initialize performance monitoring
  const performanceState = usePerformanceMonitor(enablePerformanceMonitoring, 30, 60);
  const enhancementTimeoutRef = useRef<NodeJS.Timeout>();

  // 1. Strict hydration check - IMMEDIATE on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 2. Capability detection (only runs once client is ready)
  useEffect(() => {
    if (!isClient) return;

    async function detectCapabilities() {
      // Check WebGL support
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
      const hasWebGLSupport = !!gl;
      setHasWebGL(hasWebGLSupport);

      if (!hasWebGLSupport) return;

      // Device detection
      const { isMobile, isIOS, isAndroid } = detectMobileDevice();

      // GPU capabilities
      const { gpuTier, maxTextureSize } = await detectGPUCapabilities();

      // System info
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      const deviceMemory = navigator.deviceMemory || 4;

      // Battery and thermal info
      const { batteryLevel, thermalState } = await getBatteryInfo();

      // Performance tier
      const performanceTier = getPerformanceTier(hardwareConcurrency, deviceMemory, gpuTier, isMobile);

      const capabilities: DeviceCapabilities = {
        isMobile,
        isIOS,
        isAndroid,
        performanceTier,
        gpuTier,
        deviceMemory,
        hardwareConcurrency,
        maxTextureSize,
        batteryLevel,
        thermalState
      };

      setDeviceCapabilities(capabilities);
      onDeviceCapabilities?.(capabilities);
    }

    detectCapabilities();
  }, [isClient, onDeviceCapabilities]);

  // 3. Progressive enhancement logic (simplified - no requestIdleCallback)
  useEffect(() => {
    if (!deviceCapabilities) return;

    // Start with basic scene immediately
    setProgressiveEnhancement(false);

    // Simple timeout-based enhancement
    enhancementTimeoutRef.current = setTimeout(() => {
      if (performanceState.metrics.fps > 35) {
        setProgressiveEnhancement(true);
      }
    }, 1000);

    return () => {
      if (enhancementTimeoutRef.current) {
        clearTimeout(enhancementTimeoutRef.current);
      }
    };
  }, [deviceCapabilities, performanceState.metrics.fps]);

  // 4. Performance monitoring adjustments
  useEffect(() => {
    if (!enablePerformanceMonitoring) return;

    // If performance drops significantly, disable enhancements
    if (performanceState.metrics.fps < 25 && progressiveEnhancement) {
      console.log('Performance degraded, disabling enhancements');
      setProgressiveEnhancement(false);
    }

    // Re-enable enhancements if performance improves and stabilizes
    if (performanceState.metrics.fps > 40 && !progressiveEnhancement && performanceState.qualityLevel !== 'low') {
      console.log('Performance improved, re-enabling enhancements');
      setProgressiveEnhancement(true);
    }
  }, [performanceState.metrics.fps, performanceState.qualityLevel, progressiveEnhancement, enablePerformanceMonitoring]);

  // 5. Performance Observer logging
  useEffect(() => {
    if (!enablePerformanceMonitoring || typeof PerformanceObserver === 'undefined') return;

    let observer: PerformanceObserver | undefined;

    try {
      observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure' && entry.name.includes('three')) {
            console.log(`3D Performance: ${entry.name} took ${entry.duration}ms`);
          }
        }
      });

      observer.observe({ entryTypes: ['measure'] });
    } catch (e) {
      // Ignore errors if PerformanceObserver is not supported/fails
      console.warn('PerformanceObserver failed:', e);
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [enablePerformanceMonitoring]);

  // CRITICAL: SSR / Hydration Mismatch barrier
  if (!isClient) {
    return <LoadingSkeleton variant={variant} className={className} />;
  }

  // Handle WebGL missing
  if (!hasWebGL) {
    return (
      <div className={`${className} w-full h-full min-h-[500px] flex items-center justify-center bg-gradient-to-br from-gray-900 to-black`}>
        <div className="text-center p-6 sm:p-7 md:p-8">
          <p className="text-slate-400">
            WebGL is not supported on this device
          </p>
          <p className="text-sm text-gray-500 mt-2">3D content requires WebGL support</p>
        </div>
      </div>
    );
  }

  return (
    <PerformanceContext.Provider value={performanceState}>
      <ThreeErrorBoundary variant={variant}>
        {/* 
          CRITICAL CSS ENFORCEMENT:
          - w-full h-full: Fill parent container
          - min-h-[500px]: Force minimum height to PROVE visibility (prevents 0px collapse)
          - relative: Establish positioning context
          - block: Ensure block-level display
          - z-10: Ensure proper stacking above backgrounds
          
          Using pathname as key forces complete remount on navigation,
          creating fresh WebGL context and preventing stale state.
        */}
        <div
          key={`3d-scene-${pathname}`}
          className="w-full h-full min-h-[500px] relative block"
          style={{
            zIndex: 10,
            display: 'block',
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: '500px',
          }}
        >
          <Suspense fallback={<LoadingSkeleton variant={variant} className={`${className} min-h-[500px]`} />}>
            <Scene3D>
              {children}
            </Scene3D>
          </Suspense>
        </div>
      </ThreeErrorBoundary>
    </PerformanceContext.Provider>
  );
}
