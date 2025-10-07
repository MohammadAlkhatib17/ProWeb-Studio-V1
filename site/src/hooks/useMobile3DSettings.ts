'use client';

import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

export type QualityPreset = 'low' | 'medium' | 'high';

export interface Mobile3DSettings {
  quality: QualityPreset;
  dpr: [number, number];
  particleCount: number;
  enableShadows: boolean;
  enablePostProcessing: boolean;
  cameraFov: number;
  bloomIntensity: number;
  antialias: boolean;
  effectsQuality: QualityPreset;
}

/**
 * Get optimized 3D settings based on device capabilities with mobile-first approach
 */
export function getMobile3DSettings(): Mobile3DSettings {
  if (typeof window === 'undefined') {
    // Server-side defaults (conservative)
    return {
      quality: 'low',
      dpr: [1, 1.5],
      particleCount: 200,
      enableShadows: false,
      enablePostProcessing: false,
      cameraFov: 60,
      bloomIntensity: 0.5,
      antialias: false,
      effectsQuality: 'low',
    };
  }

  const screenWidth = window.innerWidth;
  const devicePixelRatio = window.devicePixelRatio || 1;
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const deviceMemory = navigator.deviceMemory || 4;
  
  // Connection detection
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const connectionType = connection?.effectiveType || '4g';
  
  // Mobile device detection
  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;
  
  // Low-end device detection (more aggressive for mobile)
  const isLowEndMobile = isMobile && (
    deviceMemory < 4 || 
    hardwareConcurrency < 4 || 
    devicePixelRatio < 2 ||
    connectionType === '2g' || 
    connectionType === 'slow-2g'
  );

  const isVeryLowEnd = isMobile && (
    deviceMemory < 2 || 
    hardwareConcurrency < 2 || 
    connectionType === '2g'
  );

  // Default mobile devices to 'low' quality as specified
  if (isVeryLowEnd) {
    return {
      quality: 'low',
      dpr: [1, 1],
      particleCount: 50,
      enableShadows: false,
      enablePostProcessing: false,
      cameraFov: 65,
      bloomIntensity: 0.3,
      antialias: false,
      effectsQuality: 'low',
    };
  }

  if (isLowEndMobile) {
    return {
      quality: 'low',
      dpr: [1, 1.5],
      particleCount: 150,
      enableShadows: false,
      enablePostProcessing: false,
      cameraFov: 60,
      bloomIntensity: 0.4,
      antialias: false,
      effectsQuality: 'low',
    };
  }

  if (isMobile) {
    // Default mobile quality = 'low'
    return {
      quality: 'low',
      dpr: [1, 2],
      particleCount: 300,
      enableShadows: false,
      enablePostProcessing: false,
      cameraFov: 55,
      bloomIntensity: 0.6,
      antialias: true,
      effectsQuality: 'low',
    };
  }

  if (isTablet) {
    return {
      quality: 'medium',
      dpr: [1, 2],
      particleCount: 600,
      enableShadows: true,
      enablePostProcessing: true,
      cameraFov: 50,
      bloomIntensity: 0.8,
      antialias: true,
      effectsQuality: 'medium',
    };
  }

  // Desktop - can use higher quality
  return {
    quality: 'high',
    dpr: [1, 2],
    particleCount: 1000,
    enableShadows: true,
    enablePostProcessing: true,
    cameraFov: 50,
    bloomIntensity: 1.0,
    antialias: true,
    effectsQuality: 'high',
  };
}

/**
 * Hook that provides mobile-optimized 3D settings
 */
export function useMobile3DSettings() {
  const { capabilities } = useDeviceCapabilities();
  const settings = getMobile3DSettings();

  return {
    settings,
    shouldRender3D: !capabilities.isLowEndDevice,
    debugInfo: process.env.NODE_ENV === 'development' ? {
      isMobile: capabilities.isMobile,
      isLowEndDevice: capabilities.isLowEndDevice,
      deviceMemory: capabilities.deviceMemory,
      hardwareConcurrency: capabilities.hardwareConcurrency,
      quality: settings.quality,
    } : null,
  };
}