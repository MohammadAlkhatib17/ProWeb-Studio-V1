/**
 * Advanced JavaScript bundle optimization for Core Web Vitals
 * Implements cutting-edge code splitting and loading strategies
 */

import path from 'path';

/**
 * Dynamic imports with intelligent loading for Dutch users
 */
export const DynamicImports = {
  // Heavy 3D components - load only when needed and on capable devices
  HeroCanvas: () => import('@/components/HeroCanvas').then(mod => ({ default: mod.default })),
  ViewportAware3D: () => import('@/components/ViewportAware3D').then(mod => ({ default: mod.default })),
  Progressive3DLoader: () => import('@/components/3d/Progressive3DLoader').then(mod => ({ default: mod.default })),
  
  // Contact form - load on interaction
  CalEmbed: () => import('@/components/CalEmbed').then(mod => ({ default: mod.default })),
  
  // Analytics - load after critical content
  Analytics: () => import('@vercel/analytics/react').then(mod => ({ Analytics: mod.Analytics })),
  SpeedInsights: () => import('@vercel/speed-insights/next').then(mod => ({ SpeedInsights: mod.SpeedInsights })),
};

/**
 * Critical component bundling strategy
 */
export const CriticalComponents = {
  // Above-the-fold components that should be in the main bundle
  Header: () => import('@/components/Header'),
  Footer: () => import('@/components/Footer'),
  Logo: () => import('@/components/Logo'),
  Button: () => import('@/components/Button'),
  
  // SEO-critical components
  SEOSchema: () => import('@/components/SEOSchema'),
  LocalBusinessSchema: () => import('@/components/LocalBusinessSchema'),
};

/**
 * Webpack optimization configuration for Next.js
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getOptimizedWebpackConfig = (config: any, { dev, isServer }: { dev: boolean; isServer: boolean }) => {
  if (!dev && !isServer) {
    // Enhanced chunk splitting for better caching
    config.optimization.splitChunks = {
      chunks: 'all',
      minSize: 20000,
      maxSize: 244000,
      cacheGroups: {
        // Framework chunks
        framework: {
          chunks: 'all',
          name: 'framework',
          test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
          priority: 40,
          enforce: true,
        },
        
        // Three.js and 3D libraries
        three: {
          test: /[\\/]node_modules[\\/](three|@react-three|@types\/three)[\\/]/,
          name: 'three',
          priority: 30,
          chunks: 'async',
          reuseExistingChunk: true,
        },
        
        // UI libraries
        ui: {
          test: /[\\/]node_modules[\\/](framer-motion|tailwindcss)[\\/]/,
          name: 'ui',
          priority: 25,
          chunks: 'async',
          reuseExistingChunk: true,
        },
        
        // Vendor libraries
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 20,
          chunks: 'all',
          reuseExistingChunk: true,
        },
        
        // Common shared code
        common: {
          name: 'common',
          minChunks: 2,
          priority: 10,
          chunks: 'all',
          reuseExistingChunk: true,
        },
        
        // Default
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    };

    // Module concatenation for better tree shaking
    config.optimization.concatenateModules = true;
    
    // Enhanced tree shaking
    config.optimization.usedExports = true;
    config.optimization.sideEffects = false;
    
    // Optimize module IDs for better long-term caching
    config.optimization.moduleIds = 'deterministic';
    config.optimization.chunkIds = 'deterministic';
  }

  // Enhanced resolve configuration
  config.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx', '.json'];
  
  // Alias optimization for faster builds
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(__dirname, 'src'),
  };

  return config;
};

/**
 * Bundle size budgets for Core Web Vitals compliance
 */
export const BundleBudgets = {
  // Critical bundles that affect LCP
  critical: {
    main: 150000, // 150KB gzipped
    framework: 50000, // 50KB gzipped
    css: 20000, // 20KB gzipped
  },
  
  // Non-critical bundles
  async: {
    three: 200000, // 200KB gzipped for 3D assets
    vendor: 100000, // 100KB gzipped
    ui: 50000, // 50KB gzipped
  },
  
  // Page-specific budgets
  pages: {
    home: 250000, // 250KB total for homepage
    diensten: 200000, // 200KB for services page
    contact: 150000, // 150KB for contact page
  },
};

/**
 * Performance monitoring for bundle sizes
 */
export function monitorBundlePerformance() {
  if (typeof window === 'undefined') return;
  
  // Monitor navigation timing
  const perfObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'navigation') {
        const nav = entry as PerformanceNavigationTiming;
        
        // Report bundle loading metrics
        const bundleLoadTime = nav.loadEventEnd - nav.startTime;
        const firstContentfulPaint = nav.loadEventStart - nav.startTime;
        
        if (typeof gtag !== 'undefined') {
          gtag('event', 'bundle_performance', {
            event_category: 'Performance',
            bundle_load_time: Math.round(bundleLoadTime),
            fcp: Math.round(firstContentfulPaint),
            custom_map: { 
              metric_3: 'bundle_load_time',
              metric_4: 'fcp_bundle'
            }
          });
        }
      }
    }
  });
  
  perfObserver.observe({ entryTypes: ['navigation'] });
}

/**
 * Intelligent script loading based on user interaction
 */
export class IntelligentLoader {
  private static loadedModules = new Set<string>();
  private static loadingPromises = new Map<string, Promise<unknown>>();
  
  static async loadOnInteraction(moduleLoader: () => Promise<unknown>, moduleName: string) {
    if (this.loadedModules.has(moduleName)) {
      return;
    }
    
    if (this.loadingPromises.has(moduleName)) {
      return this.loadingPromises.get(moduleName);
    }
    
    const loadPromise = moduleLoader();
    this.loadingPromises.set(moduleName, loadPromise);
    
    try {
      await loadPromise;
      this.loadedModules.add(moduleName);
      this.loadingPromises.delete(moduleName);
    } catch (error) {
      this.loadingPromises.delete(moduleName);
      console.warn(`Failed to load module ${moduleName}:`, error);
      throw error;
    }
    
    return loadPromise;
  }
  
  static preloadOnIdle(moduleLoader: () => Promise<unknown>, moduleName: string) {
    if (typeof window === 'undefined') return;
    
    // Use requestIdleCallback if available, otherwise setTimeout
    const schedulePreload = (callback: () => void) => {
      if ('requestIdleCallback' in window) {
        (window as unknown as { requestIdleCallback: (callback: () => void, options?: { timeout: number }) => void }).requestIdleCallback(callback, { timeout: 5000 });
      } else {
        setTimeout(callback, 1000);
      }
    };
    
    schedulePreload(() => {
      this.loadOnInteraction(moduleLoader, moduleName);
    });
  }
}

// Global gtag declaration
declare global {
  function gtag(...args: unknown[]): void;
}

const bundleOptimization = {
  DynamicImports,
  CriticalComponents,
  getOptimizedWebpackConfig,
  BundleBudgets,
  monitorBundlePerformance,
  IntelligentLoader,
};

export default bundleOptimization;