/**
 * Bundle Optimization Configuration
 * Reduces JavaScript payload and improves loading performance
 */

// Critical imports that should be prioritized
export const CRITICAL_IMPORTS = [
  // Layout essentials
  'react',
  'react-dom',
  'next/router',
  
  // Core UI components
  '@/components/Header',
  '@/components/Footer', 
  '@/components/Button',
  
  // Critical functionality
  '@/components/cookies/CookieConsentBanner',
  '@/lib/fonts-optimized',
] as const;

// Heavy imports that should be code-split
export const DEFERRED_IMPORTS = [
  // 3D and visual effects
  '@react-three/fiber',
  '@react-three/drei', 
  'three',
  
  // Analytics and monitoring
  '@vercel/analytics',
  '@vercel/speed-insights',
  'web-vitals',
  
  // Complex interactions
  '@/components/CursorTrail',
  '@/components/DutchPerformanceMonitor',
  'framer-motion',
] as const;

// Route-specific bundles
export const ROUTE_BUNDLES = {
  '/': {
    priority: ['@/components/Hero', '@/components/Services'],
    deferred: ['@/components/CursorTrail'],
  },
  '/diensten': {
    priority: ['@/components/ServicesList'],
    deferred: ['@/components/ServiceAnimations'],
  },
  '/contact': {
    priority: ['@/components/ContactForm'],
    deferred: ['@/components/CalendlyEmbed'],
  },
  '/speeltuin': {
    priority: [],
    deferred: ['@react-three/fiber', '@react-three/drei', 'three'],
  },
} as const;

// Bundle size thresholds for Dutch users (stricter for better mobile experience)
export const BUNDLE_THRESHOLDS = {
  // Critical bundle - loaded immediately
  critical: {
    maxSize: 150, // KB
    includes: ['layout', 'navigation', 'fonts', 'critical-css'],
  },
  
  // Main bundle - loaded after critical
  main: {
    maxSize: 250, // KB  
    includes: ['react', 'next-core', 'ui-components'],
  },
  
  // Feature bundles - loaded on demand
  features: {
    maxSize: 100, // KB per feature
    includes: ['analytics', 'animations', '3d-effects'],
  },
  
  // Route bundles - loaded per page
  routes: {
    maxSize: 200, // KB per route
    includes: ['page-components', 'route-specific-logic'],
  },
} as const;

// Dutch-optimized loading strategy
export const DUTCH_LOADING_STRATEGY = {
  // Fast connections (4G, WiFi)
  fast: {
    preloadRoutes: ['/diensten', '/contact'],
    loadAnimations: true,
    enable3D: true,
    analyticsDelay: 0,
  },
  
  // Medium connections (3G)
  medium: {
    preloadRoutes: ['/contact'],
    loadAnimations: false,
    enable3D: false,
    analyticsDelay: 2000,
  },
  
  // Slow connections (2G, slow-3G)
  slow: {
    preloadRoutes: [],
    loadAnimations: false,
    enable3D: false,
    analyticsDelay: 5000,
  },
  
  // Data saver mode
  dataSaver: {
    preloadRoutes: [],
    loadAnimations: false,
    enable3D: false,
    analyticsDelay: 10000,
  },
} as const;

// Performance budget enforcement
export const PERFORMANCE_BUDGET = {
  // Lighthouse thresholds for Dutch users
  lighthouse: {
    performance: 95, // Target score
    accessibility: 98,
    bestPractices: 95,
    seo: 100,
  },
  
  // Core Web Vitals targets (stricter for Dutch market)
  vitals: {
    fcp: 1.2, // seconds
    lcp: 2.0, // seconds  
    fid: 80,  // milliseconds
    cls: 0.08, // score
  },
  
  // Bundle size limits
  bundles: {
    totalJs: 400,     // KB total JavaScript
    initialJs: 150,   // KB initial JavaScript
    cssTotal: 50,     // KB total CSS
    images: 500,      // KB images per page
  },
} as const;

export type LoadingStrategy = keyof typeof DUTCH_LOADING_STRATEGY;
export type BundleType = keyof typeof BUNDLE_THRESHOLDS;