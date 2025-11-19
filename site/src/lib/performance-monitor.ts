/**
 * Advanced performance monitoring for Dutch market optimization
 * Tracks Core Web Vitals, network conditions, and user interactions
 */

import type { WebVitalsMetric, WebVitalsMetricName, WebVitalsRating, NavigatorWithConnection } from '@/types/analytics';

// Extended PerformanceEntry types for web vitals
interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface EventTimingEntry extends PerformanceEntry {
  processingStart: number;
  processingEnd: number;
  cancelable: boolean;
}

interface NavigationTimingEntry extends PerformanceResourceTiming {
  loadEventEnd: number;
}

interface LCPEntry extends PerformancePaintTiming {
  element?: Element;
  url?: string;
}

// Re-define with proper typing for internal use
interface WebVitalsMetricInternal {
  id: string;
  name: WebVitalsMetricName;
  value: number;
  delta: number;
  entries: PerformanceEntry[];
  rating: WebVitalsRating;
}

interface ImagePerformanceMetric {
  src: string;
  loadTime: number;
  size: number;
  format: string;
  isLCP: boolean;
  hasPriority: boolean;
  renderTime?: number;
}

interface PerformanceReport {
  timestamp: number;
  url: string;
  webVitals: WebVitalsMetricInternal[];
  images: ImagePerformanceMetric[];
  fontMetrics: {
    loadTime: number;
    renderTime: number;
    fallbackUsed: boolean;
  };
  networkInfo: {
    effectiveType: string;
    saveData: boolean;
    rtt: number;
    downlink: number;
  };
}

/**
 * Core Web Vitals thresholds (Google's recommended values)
 */
const WEB_VITALS_THRESHOLDS = {
  CLS: { good: 0.1, needsImprovement: 0.25 },
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  INP: { good: 200, needsImprovement: 500 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 },
} as const;

/**
 * Image optimization validation rules
 */
const IMAGE_OPTIMIZATION_RULES = {
  maxLCPLoadTime: 2500, // LCP should load within 2.5s
  maxImageSize: 1024 * 1024, // 1MB max for images
  preferredFormats: ['avif', 'webp'],
  requiredAttributes: ['width', 'height', 'alt'],
  maxCLS: 0.1,
} as const;

/**
 * Enhanced Web Vitals monitoring with Core Web Vitals library integration
 */
export class WebVitalsMonitor {
  private metrics: WebVitalsMetricInternal[] = [];
  private imageMetrics: ImagePerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];
  
  constructor() {
    this.initializeMonitoring();
  }
  
  private initializeMonitoring() {
    if (typeof window === 'undefined') return;
    
    // Monitor resource loading (images, fonts, etc.)
    this.monitorResourceLoading();
    
    // Monitor layout shifts
    this.monitorLayoutShift();
    
    // Monitor largest contentful paint
    this.monitorLCP();
    
    // Monitor first input delay / interaction to next paint
    this.monitorInteraction();
    
    // Monitor font loading
    this.monitorFontLoading();
  }
  
  private monitorResourceLoading() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const resourceEntry = entry as PerformanceResourceTiming;
          this.processResourceEntry(resourceEntry);
        }
      }
    });
    
    observer.observe({ entryTypes: ['resource'] });
    this.observers.push(observer);
  }
  
  private monitorLayoutShift() {
    const observer = new PerformanceObserver((list) => {
      let clsValue = 0;
      
      for (const entry of list.getEntries()) {
        const layoutShift = entry as LayoutShiftEntry;
        if (entry.entryType === 'layout-shift' && !layoutShift.hadRecentInput) {
          clsValue += layoutShift.value;
        }
      }
      
      if (clsValue > 0) {
        this.recordMetric({
          id: `cls-${Date.now()}`,
          name: 'CLS',
          value: clsValue,
          delta: clsValue,
          entries: Array.from(list.getEntries()),
          rating: this.getRating('CLS', clsValue),
          navigationType: 'navigate',
        });
      }
    });
    
    observer.observe({ entryTypes: ['layout-shift'], buffered: true });
    this.observers.push(observer);
  }
  
  private monitorLCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformancePaintTiming;
      
      this.recordMetric({
        id: `lcp-${Date.now()}`,
        name: 'LCP',
        value: lastEntry.startTime,
        delta: lastEntry.startTime,
        entries: [lastEntry],
        rating: this.getRating('LCP', lastEntry.startTime),
        navigationType: 'navigate',
      });
      
      // Check if LCP element is an image and validate optimization
      this.validateLCPImage(lastEntry);
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'], buffered: true });
    this.observers.push(observer);
  }
  
  private monitorInteraction() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const interactionEntry = entry as EventTimingEntry;
        
        this.recordMetric({
          id: `inp-${Date.now()}`,
          name: 'INP',
          value: interactionEntry.processingStart - interactionEntry.startTime,
          delta: interactionEntry.processingStart - interactionEntry.startTime,
          entries: [entry],
          rating: this.getRating('INP', interactionEntry.processingStart - interactionEntry.startTime),
          navigationType: 'navigate',
        });
      }
    });
    
    try {
      observer.observe({ entryTypes: ['event'], buffered: true });
      this.observers.push(observer);
    } catch {
      // Fallback for browsers that don't support INP
      this.monitorFID();
    }
  }
  
  private monitorFID() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fidEntry = entry as EventTimingEntry;
        
        // Note: FID is deprecated in favor of INP, but we still track it for backwards compatibility
        // We use INP name type since FID is no longer in the web-vitals library
        this.recordMetric({
          id: `fid-${Date.now()}`,
          name: 'INP', // Use INP as FID is deprecated
          value: fidEntry.processingStart - fidEntry.startTime,
          delta: fidEntry.processingStart - fidEntry.startTime,
          entries: [entry],
          rating: this.getRating('FID', fidEntry.processingStart - fidEntry.startTime),
          navigationType: 'navigate',
        });
      }
    });
    
    observer.observe({ entryTypes: ['first-input'], buffered: true });
    this.observers.push(observer);
  }
  
  private monitorFontLoading() {
    if ('fonts' in document) {
      document.fonts.addEventListener('loadingdone', () => {
        this.recordFontMetrics();
      });
    }
  }
  
  private processResourceEntry(entry: PerformanceResourceTiming) {
    const url = new URL(entry.name);
    const isImage = /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(url.pathname);
    
    if (isImage) {
      const imageMetric: ImagePerformanceMetric = {
        src: entry.name,
        loadTime: entry.responseEnd - entry.startTime,
        size: entry.transferSize || 0,
        format: this.extractImageFormat(entry.name),
        isLCP: false, // Will be updated if this becomes LCP
        hasPriority: this.checkImagePriority(entry.name),
        renderTime: 'loadEventEnd' in entry ? (entry as NavigationTimingEntry).loadEventEnd - entry.responseEnd : undefined,
      };
      
      this.imageMetrics.push(imageMetric);
      this.validateImageOptimization(imageMetric);
    }
  }
  
  private validateLCPImage(lcpEntry: PerformancePaintTiming) {
    // Find the image that triggered LCP
    const lcpElement = (lcpEntry as LCPEntry).element;
    if (lcpElement && lcpElement.tagName === 'IMG') {
      const imgElement = lcpElement as HTMLImageElement;
      const imageMetric = this.imageMetrics.find(m => m.src === imgElement.src);
      if (imageMetric) {
        imageMetric.isLCP = true;
        
        // Validate LCP image optimization
        if (imageMetric.loadTime > IMAGE_OPTIMIZATION_RULES.maxLCPLoadTime) {
          this.reportOptimizationIssue('LCP image loads too slowly', {
            src: imageMetric.src,
            loadTime: imageMetric.loadTime,
            threshold: IMAGE_OPTIMIZATION_RULES.maxLCPLoadTime,
          });
        }
        
        if (!imageMetric.hasPriority) {
          this.reportOptimizationIssue('LCP image missing priority attribute', {
            src: imageMetric.src,
          });
        }
      }
    }
  }
  
  private validateImageOptimization(metric: ImagePerformanceMetric) {
    // Check file size
    if (metric.size > IMAGE_OPTIMIZATION_RULES.maxImageSize) {
      this.reportOptimizationIssue('Large image detected', {
        src: metric.src,
        size: metric.size,
        maxSize: IMAGE_OPTIMIZATION_RULES.maxImageSize,
      });
    }
    
    // Check format optimization
    if (!IMAGE_OPTIMIZATION_RULES.preferredFormats.includes(metric.format as 'webp' | 'avif')) {
      this.reportOptimizationIssue('Suboptimal image format', {
        src: metric.src,
        format: metric.format,
        preferredFormats: IMAGE_OPTIMIZATION_RULES.preferredFormats,
      });
    }
  }
  
  private extractImageFormat(src: string): string {
    const match = src.match(/\.([^.?]+)(?:\?|$)/);
    return match ? match[1].toLowerCase() : 'unknown';
  }
  
  private checkImagePriority(src: string): boolean {
    // Check if image has priority attribute (simplified check)
    const images = document.querySelectorAll('img[src*="' + src.split('/').pop() + '"]');
    return Array.from(images).some(img => img.hasAttribute('fetchpriority') || 'fetchPriority' in img || 'priority' in img);
  }
  
  private recordMetric(metric: WebVitalsMetric) {
    this.metrics.push(metric);
    
    // Report poor metrics
    if (metric.rating === 'poor') {
      this.reportOptimizationIssue(`Poor ${metric.name} detected`, {
        value: metric.value,
        threshold: WEB_VITALS_THRESHOLDS[metric.name],
      });
    }
  }
  
  private recordFontMetrics() {
    // Simplified font metrics recording
    const fontLoadTime = performance.now();
    console.log('Font loading completed at:', fontLoadTime);
  }
  
  private getRating(metricName: keyof typeof WEB_VITALS_THRESHOLDS, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = WEB_VITALS_THRESHOLDS[metricName];
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.needsImprovement) return 'needs-improvement';
    return 'poor';
  }
  
  private reportOptimizationIssue(message: string, details: Record<string, unknown>) {
    console.warn(`🚨 Performance Issue: ${message}`, details);
    
    // In production, send to analytics
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics('performance_issue', { message, details });
    }
  }
  
  private sendToAnalytics(event: string, data: Record<string, unknown>) {
    // Integration with analytics service
    if ('gtag' in window) {
      window.gtag('event', event, data);
    }
  }
  
  public generateReport(): PerformanceReport {
    const networkInfo = this.getNetworkInfo();
    
    return {
      timestamp: Date.now(),
      url: window.location.href,
      webVitals: this.metrics,
      images: this.imageMetrics,
      fontMetrics: {
        loadTime: 0, // Simplified
        renderTime: 0,
        fallbackUsed: false,
      },
      networkInfo,
    };
  }
  
  private getNetworkInfo() {
    const nav = navigator as NavigatorWithConnection;
    const connection = nav.connection;
    return {
      effectiveType: connection?.effectiveType || 'unknown',
      saveData: connection?.saveData || false,
      rtt: connection?.rtt || 0,
      downlink: connection?.downlink || 0,
    };
  }
  
  public destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

/**
 * Image optimization validator for development
 */
export function validateImageOptimizations() {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return;
  
  const images = document.querySelectorAll('img');
  const issues: string[] = [];
  
  images.forEach((img, index) => {
    // Check for missing alt text
    if (!img.alt && !img.hasAttribute('aria-hidden')) {
      issues.push(`Image ${index + 1}: Missing alt text`);
    }
    
    // Check for missing dimensions
    if (!img.width || !img.height) {
      issues.push(`Image ${index + 1}: Missing width or height attributes`);
    }
    
    // Check for loading attribute
    if (!img.loading) {
      issues.push(`Image ${index + 1}: Missing loading attribute`);
    }
    
    // Check for modern formats
    if (img.src && !/(avif|webp)$/i.test(img.src)) {
      issues.push(`Image ${index + 1}: Not using modern format (AVIF/WebP)`);
    }
  });
  
  if (issues.length > 0) {
    console.group('🖼️ Image Optimization Issues');
    issues.forEach(issue => console.warn(issue));
    console.groupEnd();
  }
}

/**
 * Initialize performance monitoring
 */
export function initializePerformanceMonitoring() {
  if (typeof window === 'undefined') return null;
  
  const monitor = new WebVitalsMonitor();
  
  // Run image validation in development
  if (process.env.NODE_ENV === 'development') {
    // Wait for images to load
    setTimeout(validateImageOptimizations, 2000);
  }
  
  return monitor;
}

// Auto-initialize in browser
if (typeof window !== 'undefined') {
  let monitor: WebVitalsMonitor | null = null;
  
  // Initialize after page load
  if (document.readyState === 'complete') {
    monitor = initializePerformanceMonitoring();
  } else {
    window.addEventListener('load', () => {
      monitor = initializePerformanceMonitoring();
    });
  }
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (monitor) {
      const report = monitor.generateReport();
      console.log('Performance Report:', report);
      monitor.destroy();
    }
  });
}

export default WebVitalsMonitor;