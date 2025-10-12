/**
 * Core Web Vitals Monitoring System
 * Real-time tracking with Vercel Analytics integration and performance alerts
 */

import { PerformanceMonitor, AlertManager } from "./utils";
import type {
  CoreWebVitalsMetrics,
  PerformanceAlert,
  MonitoringAlert,
} from "./types";

export interface WebVitalsConfig {
  enableRealTimeTracking: boolean;
  sampleRate: number; // 0-1, percentage of users to track
  reportingEndpoint: string;
  thresholds: {
    lcp: { good: number; poor: number };
    fid: { good: number; poor: number };
    cls: { good: number; poor: number };
    ttfb: { good: number; poor: number };
  };
}

export interface WebVitalsReport {
  url: string;
  timestamp: number;
  metrics: CoreWebVitalsMetrics;
  userAgent: string;
  connectionType?: string;
  deviceType: "mobile" | "desktop" | "tablet";
  performance: {
    grade: "good" | "needs-improvement" | "poor";
    score: number;
    issues: string[];
  };
}

export interface WebVitalsAnalytics {
  timeRange: { start: number; end: number };
  totalSamples: number;
  averageMetrics: CoreWebVitalsMetrics;
  percentiles: {
    p75: CoreWebVitalsMetrics;
    p90: CoreWebVitalsMetrics;
    p95: CoreWebVitalsMetrics;
  };
  trends: {
    lcp: Array<{ timestamp: number; value: number }>;
    fid: Array<{ timestamp: number; value: number }>;
    cls: Array<{ timestamp: number; value: number }>;
    ttfb: Array<{ timestamp: number; value: number }>;
  };
  alerts: PerformanceAlert[];
}

export class CoreWebVitalsMonitor {
  private config: WebVitalsConfig;
  private performanceMonitor: PerformanceMonitor;
  private isTracking = false;

  constructor(config?: Partial<WebVitalsConfig>) {
    this.config = {
      enableRealTimeTracking: true,
      sampleRate: 1.0,
      reportingEndpoint: "/api/monitoring/core-web-vitals",
      thresholds: {
        lcp: { good: 2500, poor: 4000 },
        fid: { good: 100, poor: 300 },
        cls: { good: 0.1, poor: 0.25 },
        ttfb: { good: 800, poor: 1800 },
      },
      ...config,
    };

    this.performanceMonitor = PerformanceMonitor.getInstance();
  }

  /**
   * Initialize Web Vitals tracking on the client side
   */
  initializeTracking(): void {
    if (typeof window === "undefined" || this.isTracking) return;

    // Check if we should track this user (sampling)
    if (Math.random() > this.config.sampleRate) return;

    this.isTracking = true;
    this.setupWebVitalsListeners();
    this.setupPerformanceObserver();
    this.setupNavigationTracking();
  }

  private setupWebVitalsListeners(): void {
    // Dynamic import to avoid server-side issues
    import("web-vitals")
      .then((webVitals) => {
        if (webVitals.onLCP)
          webVitals.onLCP(this.handleMetric.bind(this, "lcp"));
        if (webVitals.onINP)
          webVitals.onINP(this.handleMetric.bind(this, "fid")); // INP replaces FID
        if (webVitals.onCLS)
          webVitals.onCLS(this.handleMetric.bind(this, "cls"));
        if (webVitals.onTTFB)
          webVitals.onTTFB(this.handleMetric.bind(this, "ttfb"));
      })
      .catch((error) => {
        console.warn("Failed to load web-vitals library:", error);
        // Fallback to manual measurement
        this.setupFallbackMeasurement();
      });
  }

  private setupFallbackMeasurement(): void {
    // Fallback LCP measurement
    this.measureLCP();

    // Fallback FID measurement
    this.measureFID();

    // Fallback CLS measurement
    this.measureCLS();

    // Fallback TTFB measurement
    this.measureTTFB();
  }

  private measureLCP(): void {
    if (!("PerformanceObserver" in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;

        if (lastEntry) {
          this.handleMetric("lcp", {
            name: "LCP",
            value: lastEntry.startTime,
            id: `lcp-${Date.now()}`,
            delta: lastEntry.startTime,
          });
        }
      });

      observer.observe({ type: "largest-contentful-paint", buffered: true });
    } catch (error) {
      console.warn("LCP measurement failed:", error);
    }
  }

  private measureFID(): void {
    if (!("PerformanceObserver" in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        for (const entry of entries) {
          const fidEntry = entry as any;
          if (fidEntry.processingStart && fidEntry.startTime) {
            this.handleMetric("fid", {
              name: "FID",
              value: fidEntry.processingStart - fidEntry.startTime,
              id: `fid-${Date.now()}`,
              delta: fidEntry.processingStart - fidEntry.startTime,
            });
            break;
          }
        }
      });

      observer.observe({ type: "first-input", buffered: true });
    } catch (error) {
      console.warn("FID measurement failed:", error);
    }
  }

  private measureCLS(): void {
    if (!("PerformanceObserver" in window)) return;

    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries: any[] = [];

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();

        for (const entry of entries) {
          const layoutShift = entry as any;

          if (!layoutShift.hadRecentInput) {
            const firstSessionEntry = sessionEntries[0];
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

            if (
              sessionValue &&
              layoutShift.startTime - lastSessionEntry.startTime < 1000 &&
              layoutShift.startTime - firstSessionEntry.startTime < 5000
            ) {
              sessionValue += layoutShift.value;
              sessionEntries.push(layoutShift);
            } else {
              sessionValue = layoutShift.value;
              sessionEntries = [layoutShift];
            }

            if (sessionValue > clsValue) {
              clsValue = sessionValue;
              this.handleMetric("cls", {
                name: "CLS",
                value: clsValue,
                id: `cls-${Date.now()}`,
                delta: layoutShift.value,
              });
            }
          }
        }
      });

      observer.observe({ type: "layout-shift", buffered: true });
    } catch (error) {
      console.warn("CLS measurement failed:", error);
    }
  }

  private measureTTFB(): void {
    try {
      const navEntry = performance.getEntriesByType("navigation")[0] as any;
      if (navEntry) {
        const ttfb = navEntry.responseStart - navEntry.requestStart;
        this.handleMetric("ttfb", {
          name: "TTFB",
          value: ttfb,
          id: `ttfb-${Date.now()}`,
          delta: ttfb,
        });
      }
    } catch (error) {
      console.warn("TTFB measurement failed:", error);
    }
  }

  private setupPerformanceObserver(): void {
    if (!("PerformanceObserver" in window)) return;

    try {
      // Monitor resource loading performance
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        this.analyzeResourcePerformance(entries as PerformanceResourceTiming[]);
      });

      resourceObserver.observe({ type: "resource", buffered: true });

      // Monitor long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        this.analyzeLongTasks(entries as PerformanceEventTiming[]);
      });

      longTaskObserver.observe({ type: "longtask", buffered: true });
    } catch (error) {
      console.warn("Performance observer setup failed:", error);
    }
  }

  private setupNavigationTracking(): void {
    // Track page navigation for SPA routing
    if (typeof window !== "undefined" && "history" in window) {
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;

      history.pushState = (...args) => {
        originalPushState.apply(history, args);
        this.onNavigationChange();
      };

      history.replaceState = (...args) => {
        originalReplaceState.apply(history, args);
        this.onNavigationChange();
      };

      window.addEventListener("popstate", this.onNavigationChange.bind(this));
    }
  }

  private onNavigationChange(): void {
    // Reset tracking for new page
    setTimeout(() => {
      this.measureTTFB();
    }, 100);
  }

  private handleMetric(
    metricType: keyof CoreWebVitalsMetrics,
    metric: any,
  ): void {
    const now = Date.now();
    const url = window.location.href;

    const vitalsMetric: Partial<CoreWebVitalsMetrics> = {
      url,
      timestamp: now,
      userAgent: navigator.userAgent,
      [metricType]: metric.value,
    };

    // Get connection info if available
    const connection = (navigator as any).connection;
    if (connection) {
      (vitalsMetric as any).connectionType = connection.effectiveType;
    }

    // Build complete metrics object
    const completeMetrics: CoreWebVitalsMetrics = {
      fcp: 0,
      lcp: 0,
      fid: 0,
      cls: 0,
      ttfb: 0,
      timestamp: now,
      url,
      userAgent: navigator.userAgent,
      connectionType: (vitalsMetric as any).connectionType,
      ...vitalsMetric,
    };

    // Record in performance monitor
    this.performanceMonitor.recordMetric(completeMetrics);

    // Check for alerts
    const alerts = this.performanceMonitor.checkThresholds(completeMetrics);
    for (const alert of alerts) {
      this.createPerformanceAlert(alert);
    }

    // Send to analytics endpoint
    this.reportMetric(completeMetrics);
  }

  private analyzeResourcePerformance(
    resources: PerformanceResourceTiming[],
  ): void {
    const slowResources = resources.filter(
      (resource) => resource.duration > 1000,
    );

    if (slowResources.length > 0) {
      AlertManager.createAlert(
        "performance",
        "medium",
        "Slow Resource Loading",
        `${slowResources.length} resources took longer than 1s to load`,
        window.location.href,
        {
          slowResources: slowResources.map((r) => ({
            name: r.name,
            duration: r.duration,
          })),
        },
      );
    }
  }

  private analyzeLongTasks(longTasks: PerformanceEventTiming[]): void {
    const criticalTasks = longTasks.filter(
      (task) => (task as any).duration > 100,
    );

    if (criticalTasks.length > 0) {
      AlertManager.createAlert(
        "performance",
        "high",
        "Long Tasks Detected",
        `${criticalTasks.length} tasks blocked the main thread for >100ms`,
        window.location.href,
        {
          longTasks: criticalTasks.map((t) => ({
            duration: (t as any).duration,
          })),
        },
      );
    }
  }

  private createPerformanceAlert(alert: PerformanceAlert): void {
    const severity = alert.severity as MonitoringAlert["severity"];

    AlertManager.createAlert(
      "performance",
      severity,
      `${alert.metric.toUpperCase()} Performance Issue`,
      `${alert.metric.toUpperCase()}: ${alert.currentValue}ms exceeds threshold of ${alert.threshold}ms`,
      alert.url,
      {
        metric: alert.metric,
        value: alert.currentValue,
        threshold: alert.threshold,
      },
    );
  }

  private async reportMetric(metrics: CoreWebVitalsMetrics): Promise<void> {
    try {
      await fetch(this.config.reportingEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metrics,
          timestamp: Date.now(),
          sessionId: this.getSessionId(),
        }),
      });
    } catch (error) {
      console.warn("Failed to report Web Vitals metric:", error);
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem("proweb-session-id");
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem("proweb-session-id", sessionId);
    }
    return sessionId;
  }

  /**
   * Get performance analytics for a specific time range
   */
  async getAnalytics(timeRange: {
    start: number;
    end: number;
  }): Promise<WebVitalsAnalytics> {
    try {
      const response = await fetch(
        `${this.config.reportingEndpoint}/analytics`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ timeRange }),
        },
      );

      if (!response.ok) {
        throw new Error(`Analytics request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to get Web Vitals analytics:", error);
      throw error;
    }
  }

  /**
   * Get real-time performance recommendations
   */
  getPerformanceRecommendations(metrics: CoreWebVitalsMetrics): string[] {
    const recommendations: string[] = [];

    if (metrics.lcp > this.config.thresholds.lcp.poor) {
      recommendations.push(
        "Optimize Largest Contentful Paint: Consider image optimization, server-side rendering, or CDN usage",
      );
    }

    if (metrics.fid > this.config.thresholds.fid.poor) {
      recommendations.push(
        "Reduce First Input Delay: Minimize JavaScript execution time and consider code splitting",
      );
    }

    if (metrics.cls > this.config.thresholds.cls.poor) {
      recommendations.push(
        "Fix Cumulative Layout Shift: Set dimensions for images and ads, avoid inserting content above existing content",
      );
    }

    if (metrics.ttfb > this.config.thresholds.ttfb.poor) {
      recommendations.push(
        "Improve Time to First Byte: Optimize server response time, use a CDN, or implement caching",
      );
    }

    return recommendations;
  }

  /**
   * Generate performance report
   */
  generateReport(metrics: CoreWebVitalsMetrics[]): WebVitalsReport[] {
    return metrics.map((metric) => {
      const performance = this.calculatePerformanceGrade(metric);
      const recommendations = this.getPerformanceRecommendations(metric);

      return {
        url: metric.url,
        timestamp: metric.timestamp,
        metrics: metric,
        userAgent: metric.userAgent,
        connectionType: metric.connectionType,
        deviceType: this.detectDeviceType(metric.userAgent),
        performance: {
          grade: performance.grade,
          score: performance.score,
          issues: recommendations,
        },
      };
    });
  }

  private calculatePerformanceGrade(metrics: CoreWebVitalsMetrics): {
    grade: "good" | "needs-improvement" | "poor";
    score: number;
  } {
    const scores = [
      this.getMetricScore("lcp", metrics.lcp),
      this.getMetricScore("fid", metrics.fid),
      this.getMetricScore("cls", metrics.cls),
      this.getMetricScore("ttfb", metrics.ttfb),
    ];

    const averageScore =
      scores.reduce((sum, score) => sum + score, 0) / scores.length;

    let grade: "good" | "needs-improvement" | "poor";
    if (averageScore >= 75) grade = "good";
    else if (averageScore >= 50) grade = "needs-improvement";
    else grade = "poor";

    return { grade, score: Math.round(averageScore) };
  }

  private getMetricScore(
    metric: keyof CoreWebVitalsMetrics,
    value: number,
  ): number {
    const thresholds =
      this.config.thresholds[metric as keyof typeof this.config.thresholds];
    if (!thresholds) return 0;

    if (value <= thresholds.good) return 100;
    if (value <= thresholds.poor) return 50;
    return 0;
  }

  private detectDeviceType(userAgent: string): "mobile" | "desktop" | "tablet" {
    if (
      /Mobile|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(
        userAgent,
      )
    ) {
      if (/iPad|Tablet/i.test(userAgent)) return "tablet";
      return "mobile";
    }
    return "desktop";
  }

  /**
   * Cleanup tracking listeners
   */
  destroy(): void {
    this.isTracking = false;
    // Cleanup would be implemented here
  }
}

// Client-side script for automatic initialization
export const initWebVitalsTracking = (config?: Partial<WebVitalsConfig>) => {
  if (typeof window !== "undefined") {
    const monitor = new CoreWebVitalsMonitor(config);
    monitor.initializeTracking();

    // Make available globally for debugging
    (window as any).webVitalsMonitor = monitor;

    return monitor;
  }
  return null;
};

// Export singleton instance
export const webVitalsMonitor = new CoreWebVitalsMonitor();
