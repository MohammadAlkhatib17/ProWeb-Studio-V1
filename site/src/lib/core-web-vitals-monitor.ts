/**
 * Comprehensive Core Web Vitals monitoring and reporting system
 * Real-time performance tracking with Dutch market optimizations
 */

import { onCLS, onFCP, onLCP, onTTFB, onINP, type Metric } from 'web-vitals';
import type { NavigatorWithConnection } from '@/types/analytics';

interface VitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

interface PerformanceReport {
  timestamp: number;
  url: string;
  userAgent: string;
  connectionType: string;
  deviceMemory: number;
  hardwareConcurrency: number;
  metrics: VitalMetric[];
  dutchOptimizationLevel: 'basic' | 'enhanced' | 'premium';
}

/**
 * Core Web Vitals monitoring and performance optimization
 * Monitors LCP, FID, CLS, FCP, TTFB specifically optimized for Dutch market conditions
 */
export class CoreWebVitalsMonitor {
  private metrics: VitalMetric[] = [];
  private reportingEndpoint: string;
  private isReportingEnabled: boolean;
  private dutchOptimizationLevel: 'basic' | 'enhanced' | 'premium';

  constructor(config: {
    reportingEndpoint?: string;
    enableReporting?: boolean;
    dutchOptimizationLevel?: 'basic' | 'enhanced' | 'premium';
  } = {}) {
    this.reportingEndpoint = config.reportingEndpoint || '/api/performance';
    this.isReportingEnabled = config.enableReporting ?? true;
    this.dutchOptimizationLevel = config.dutchOptimizationLevel || 'enhanced';
    
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    if (typeof window === 'undefined') return;

    // Monitor all Core Web Vitals with v5.x API
    onCLS(this.handleMetric.bind(this));
    onFCP(this.handleMetric.bind(this));
    onLCP(this.handleMetric.bind(this));
    onTTFB(this.handleMetric.bind(this));
    onINP(this.handleMetric.bind(this));

    // Set up automatic reporting
    if (this.isReportingEnabled) {
      this.setupAutomaticReporting();
    }

    // Monitor Dutch-specific metrics
    this.monitorDutchSpecificMetrics();
  }

  private handleMetric(metric: Metric) {
    const vitalMetric: VitalMetric = {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType || 'unknown',
    };

    this.metrics.push(vitalMetric);

    // Real-time analytics reporting
    this.reportToAnalytics(vitalMetric);

    // Dutch-specific threshold checking
    this.checkDutchPerformanceThresholds(vitalMetric);
  }

  private reportToAnalytics(metric: VitalMetric) {
    // Report to Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: metric.name,
        value: Math.round(metric.value),
        custom_parameter_1: metric.rating,
        custom_parameter_2: this.dutchOptimizationLevel,
        non_interaction: true,
      });
    }

    // Report to Plausible Analytics (Dutch privacy-friendly)
    if (typeof plausible !== 'undefined') {
      plausible('Web Vitals', {
        props: {
          metric: metric.name,
          value: Math.round(metric.value),
          rating: metric.rating,
          dutch_optimization: this.dutchOptimizationLevel,
        }
      });
    }

    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Core Web Vitals: ${metric.name}`, {
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
      });
    }
  }

  private checkDutchPerformanceThresholds(metric: VitalMetric) {
    const dutchThresholds = this.getDutchPerformanceThresholds();
    const threshold = dutchThresholds[metric.name as keyof typeof dutchThresholds];

    if (!threshold) return;

    // Alert if performance is poor for Dutch users
    if (metric.rating === 'poor') {
      this.triggerPerformanceAlert(metric, threshold);
    }

    // Track improvement opportunities
    if (metric.rating === 'needs-improvement') {
      this.logOptimizationOpportunity(metric, threshold);
    }
  }

  private getDutchPerformanceThresholds() {
    return {
      LCP: { good: 2000, needsImprovement: 3000, poor: 4000 },
      INP: { good: 150, needsImprovement: 300, poor: 500 }, // INP replaced FID in v5.x
      CLS: { good: 0.05, needsImprovement: 0.1, poor: 0.25 },
      FCP: { good: 1500, needsImprovement: 2500, poor: 4000 },
      TTFB: { good: 500, needsImprovement: 1000, poor: 2000 },
    };
  }

  private triggerPerformanceAlert(metric: VitalMetric, threshold: { good: number; needsImprovement: number }) {
    console.warn(`🚨 Dutch Performance Alert: ${metric.name} is ${metric.value}ms (threshold: ${threshold.needsImprovement}ms)`);
    
    // Report critical performance issue
    if (typeof gtag !== 'undefined') {
      gtag('event', 'performance_alert', {
        event_category: 'Dutch Performance',
        event_label: metric.name,
        value: Math.round(metric.value),
        custom_parameter_1: 'critical',
      });
    }
  }

  private logOptimizationOpportunity(metric: VitalMetric, threshold: { good: number; needsImprovement: number }) {
    console.info(`💡 Dutch Optimization Opportunity: ${metric.name} could be improved from ${metric.value}ms to under ${threshold.good}ms`);
    
    // Track optimization opportunities
    if (typeof gtag !== 'undefined') {
      gtag('event', 'optimization_opportunity', {
        event_category: 'Dutch Performance',
        event_label: metric.name,
        value: Math.round(metric.value - threshold.good),
      });
    }
  }

  private monitorDutchSpecificMetrics() {
    if (typeof window === 'undefined') return;

    // Monitor Dutch language content rendering
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const addedNodes = Array.from(mutation.addedNodes);
          const dutchContent = addedNodes.filter(node => 
            node.nodeType === Node.TEXT_NODE && 
            node.textContent && 
            this.isDutchContent(node.textContent)
          );

          if (dutchContent.length > 0) {
            this.measureDutchContentRenderTime();
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Monitor Dutch typography rendering
    this.monitorDutchTypographyPerformance();
  }

  private isDutchContent(text: string): boolean {
    const dutchWords = ['de', 'het', 'en', 'van', 'een', 'dat', 'die', 'in', 'te', 'zijn', 'is', 'op', 'met', 'voor'];
    const words = text.toLowerCase().split(/\s+/);
    const dutchWordCount = words.filter(word => dutchWords.includes(word)).length;
    return dutchWordCount / words.length > 0.1; // 10% Dutch words threshold
  }

  private measureDutchContentRenderTime() {
    const renderTime = performance.now();
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'dutch_content_render', {
        event_category: 'Dutch Performance',
        value: Math.round(renderTime),
        custom_parameter_1: 'content_render_time',
      });
    }
  }

  private monitorDutchTypographyPerformance() {
    // Monitor font loading for Dutch characters
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        const fontLoadTime = performance.now();
        
        if (typeof gtag !== 'undefined') {
          gtag('event', 'dutch_fonts_loaded', {
            event_category: 'Dutch Performance',
            value: Math.round(fontLoadTime),
            custom_parameter_1: 'font_load_time',
          });
        }
      });
    }
  }

  private setupAutomaticReporting() {
    // Report on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.sendReport();
      }
    });

    // Report on page unload
    window.addEventListener('beforeunload', () => {
      this.sendReport();
    });

    // Periodic reporting for long sessions
    setInterval(() => {
      this.sendReport();
    }, 30000); // Every 30 seconds
  }

  private async sendReport() {
    if (!this.isReportingEnabled || this.metrics.length === 0) return;

    const nav = navigator as NavigatorWithConnection;
    const report: PerformanceReport = {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connectionType: nav.connection?.effectiveType || 'unknown',
      deviceMemory: nav.deviceMemory || 0,
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      metrics: [...this.metrics],
      dutchOptimizationLevel: this.dutchOptimizationLevel,
    };

    try {
      // Use sendBeacon for reliability
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          this.reportingEndpoint,
          JSON.stringify(report)
        );
      } else {
        // Fallback to fetch
        await fetch(this.reportingEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(report),
          keepalive: true,
        });
      }

      // Clear metrics after successful report
      this.metrics = [];
    } catch (error) {
      console.warn('Failed to send performance report:', error);
    }
  }

  // Public methods for manual reporting
  public getMetrics(): VitalMetric[] {
    return [...this.metrics];
  }

  public getReport(): PerformanceReport {
    const nav = navigator as NavigatorWithConnection;
    return {
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connectionType: nav.connection?.effectiveType || 'unknown',
      deviceMemory: nav.deviceMemory || 0,
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      metrics: [...this.metrics],
      dutchOptimizationLevel: this.dutchOptimizationLevel,
    };
  }

  public async manualReport(): Promise<void> {
    await this.sendReport();
  }
}

/**
 * Initialize Core Web Vitals monitoring for Dutch users
 */
export function initCoreWebVitalsMonitoring(config?: {
  reportingEndpoint?: string;
  enableReporting?: boolean;
  dutchOptimizationLevel?: 'basic' | 'enhanced' | 'premium';
}): CoreWebVitalsMonitor {
  return new CoreWebVitalsMonitor(config);
}

/**
 * Performance dashboard configuration for real-time monitoring
 */
export const PerformanceDashboardConfig = {
  position: 'bottom-right',
  metrics: ['LCP', 'FID', 'CLS', 'FCP', 'TTFB', 'INP'],
  updateInterval: 1000, // Update every second
  dutchOptimized: true,
};

// Global type declarations
declare global {
  function gtag(...args: unknown[]): void;
  function plausible(event: string, options?: { props?: Record<string, any> }): void;
}

export default CoreWebVitalsMonitor;