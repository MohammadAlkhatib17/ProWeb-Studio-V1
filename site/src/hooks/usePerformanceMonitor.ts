import { useEffect, useRef, useState, useCallback } from 'react';

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage?: number;
  gpuMemory?: number;
}

export interface QualitySettings {
  particleCount: number;
  shadowResolution: number;
  effectPasses: boolean;
  dpr: [number, number];
  bloomIntensity: number;
  enablePostProcessing: boolean;
  enableShadows: boolean;
  maxLights: number;
}

export interface PerformanceState {
  metrics: PerformanceMetrics;
  qualityLevel: 'low' | 'medium' | 'high';
  settings: QualitySettings;
  isThrottled: boolean;
}

const QUALITY_PRESETS: Record<'low' | 'medium' | 'high', QualitySettings> = {
  low: {
    particleCount: 500,
    shadowResolution: 512,
    effectPasses: false,
    dpr: [1, 1],
    bloomIntensity: 0.5,
    enablePostProcessing: false,
    enableShadows: false,
    maxLights: 2,
  },
  medium: {
    particleCount: 1000,
    shadowResolution: 1024,
    effectPasses: true,
    dpr: [1, 1.5],
    bloomIntensity: 1.0,
    enablePostProcessing: true,
    enableShadows: true,
    maxLights: 4,
  },
  high: {
    particleCount: 2000,
    shadowResolution: 2048,
    effectPasses: true,
    dpr: [1, 2],
    bloomIntensity: 1.5,
    enablePostProcessing: true,
    enableShadows: true,
    maxLights: 6,
  },
};

export function usePerformanceMonitor(
  enabled: boolean = true,
  targetFPS: number = 30,
  sampleSize: number = 60
) {
  const [performanceState, setPerformanceState] = useState<PerformanceState>({
    metrics: { fps: 60, frameTime: 16.67 },
    qualityLevel: 'high',
    settings: QUALITY_PRESETS.high,
    isThrottled: false,
  });

  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef(performance.now());
  const animationFrameRef = useRef<number>();
  const throttleTimeoutRef = useRef<NodeJS.Timeout>();

  // Quality adjustment logic
  const adjustQuality = useCallback((fps: number, setState: React.Dispatch<React.SetStateAction<PerformanceState>>) => {
    setState(prev => {
      let newQualityLevel = prev.qualityLevel;
      let isThrottled = prev.isThrottled;

      // Downgrade quality if FPS is too low
      if (fps < targetFPS * 0.8) { // 80% of target FPS
        if (prev.qualityLevel === 'high') {
          newQualityLevel = 'medium';
          isThrottled = true;
        } else if (prev.qualityLevel === 'medium') {
          newQualityLevel = 'low';
          isThrottled = true;
        }
      }
      // Upgrade quality if FPS is consistently good and we're throttled
      else if (fps > targetFPS * 1.2 && isThrottled) { // 120% of target FPS
        // Clear any existing timeout
        if (throttleTimeoutRef.current) {
          clearTimeout(throttleTimeoutRef.current);
        }

        // Wait 5 seconds before upgrading to ensure stability
        throttleTimeoutRef.current = setTimeout(() => {
          setState(current => {
            let upgradeLevel = current.qualityLevel;
            if (current.qualityLevel === 'low') {
              upgradeLevel = 'medium';
            } else if (current.qualityLevel === 'medium') {
              upgradeLevel = 'high';
              isThrottled = false; // Only remove throttling when reaching high
            }

            return {
              ...current,
              qualityLevel: upgradeLevel,
              settings: QUALITY_PRESETS[upgradeLevel],
              isThrottled: upgradeLevel !== 'high' ? current.isThrottled : false,
            };
          });
        }, 5000);

        return prev; // Don't update immediately, wait for timeout
      }

      if (newQualityLevel !== prev.qualityLevel) {
        console.log(`Performance: Adjusting quality from ${prev.qualityLevel} to ${newQualityLevel} (FPS: ${fps.toFixed(1)})`);
        
        return {
          ...prev,
          qualityLevel: newQualityLevel,
          settings: QUALITY_PRESETS[newQualityLevel],
          isThrottled,
        };
      }

      return prev;
    });
  }, []);

  // Performance measurement
  const measurePerformance = useCallback(() => {
    if (!enabled) return;

    const currentTime = performance.now();
    const frameTime = currentTime - lastFrameTimeRef.current;
    lastFrameTimeRef.current = currentTime;

    frameTimesRef.current.push(frameTime);

    // Keep only the specified sample size
    if (frameTimesRef.current.length > sampleSize) {
      frameTimesRef.current.shift();
    }

    // Calculate metrics every 30 frames or when we have enough samples
    if (frameTimesRef.current.length >= Math.min(30, sampleSize)) {
      const avgFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
      const fps = 1000 / avgFrameTime;

      // Get memory usage if available
      let memoryUsage: number | undefined;
      // @ts-expect-error - performance.memory is Chrome-specific
      if (performance.memory) {
        // @ts-expect-error - usedJSHeapSize property not in standard types
        memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
      }

      const metrics: PerformanceMetrics = {
        fps: Math.round(fps * 10) / 10,
        frameTime: Math.round(avgFrameTime * 10) / 10,
        memoryUsage,
      };

      setPerformanceState(prev => ({
        ...prev,
        metrics,
      }));

      // Auto-adjust quality based on performance
      adjustQuality(fps, prev => setPerformanceState(prev));
    }

    animationFrameRef.current = requestAnimationFrame(measurePerformance);
  }, [enabled, sampleSize, targetFPS, adjustQuality]);

  // Manual quality override
  const setQualityLevel = useCallback((level: 'low' | 'medium' | 'high') => {
    setPerformanceState(prev => ({
      ...prev,
      qualityLevel: level,
      settings: QUALITY_PRESETS[level],
      isThrottled: false, // Reset throttling when manually set
    }));
  }, []);

  // Initialize monitoring
  useEffect(() => {
    if (enabled) {
      animationFrameRef.current = requestAnimationFrame(measurePerformance);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
      }
    };
  }, [enabled, measurePerformance]);

  // Progressive enhancement with requestIdleCallback
  const scheduleNonCriticalUpdate = useCallback((callback: () => void) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(callback, { timeout: 1000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(callback, 16);
    }
  }, []);

  return {
    ...performanceState,
    setQualityLevel,
    scheduleNonCriticalUpdate,
    isMonitoring: enabled,
  };
}

export default usePerformanceMonitor;