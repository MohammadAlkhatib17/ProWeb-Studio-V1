/**
 * Monitoring utilities and helper functions
 */

import { MONITORING_CONFIG } from './config';
import type {
  CoreWebVitalsMetrics,
  PerformanceAlert,
  SEOHealthCheck,
  SEOIssue,
  MonitoringAlert,
} from './types';

// Performance utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, CoreWebVitalsMetrics[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  recordMetric(metric: CoreWebVitalsMetrics): void {
    const key = metric.url;
    const existing = this.metrics.get(key) || [];
    existing.push(metric);
    
    // Keep only recent metrics
    const cutoff = Date.now() - (MONITORING_CONFIG.CORE_WEB_VITALS.RETENTION_DAYS * 24 * 60 * 60 * 1000);
    const filtered = existing.filter(m => m.timestamp > cutoff);
    
    this.metrics.set(key, filtered);
  }

  getMetrics(url: string, days: number = 7): CoreWebVitalsMetrics[] {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    return (this.metrics.get(url) || []).filter(m => m.timestamp > cutoff);
  }

  checkThresholds(metric: CoreWebVitalsMetrics): PerformanceAlert[] {
    const alerts: PerformanceAlert[] = [];
    const thresholds = MONITORING_CONFIG.CORE_WEB_VITALS.THRESHOLDS;

    // Check LCP
    if (metric.lcp > thresholds.LCP.NEEDS_IMPROVEMENT) {
      alerts.push({
        metric: 'lcp',
        threshold: thresholds.LCP.NEEDS_IMPROVEMENT,
        currentValue: metric.lcp,
        severity: metric.lcp > thresholds.LCP.NEEDS_IMPROVEMENT * 1.5 ? 'critical' : 'high',
        timestamp: Date.now(),
        url: metric.url,
      });
    }

    // Check FID
    if (metric.fid > thresholds.FID.NEEDS_IMPROVEMENT) {
      alerts.push({
        metric: 'fid',
        threshold: thresholds.FID.NEEDS_IMPROVEMENT,
        currentValue: metric.fid,
        severity: metric.fid > thresholds.FID.NEEDS_IMPROVEMENT * 2 ? 'critical' : 'high',
        timestamp: Date.now(),
        url: metric.url,
      });
    }

    // Check CLS
    if (metric.cls > thresholds.CLS.NEEDS_IMPROVEMENT) {
      alerts.push({
        metric: 'cls',
        threshold: thresholds.CLS.NEEDS_IMPROVEMENT,
        currentValue: metric.cls,
        severity: metric.cls > thresholds.CLS.NEEDS_IMPROVEMENT * 2 ? 'critical' : 'high',
        timestamp: Date.now(),
        url: metric.url,
      });
    }

    return alerts;
  }
}

// SEO utilities
export class SEOHealthMonitor {
  static calculateSEOScore(check: SEOHealthCheck): number {
    const weights = MONITORING_CONFIG.SEO_HEALTH.SCORING_WEIGHTS;
    let score = 0;

    // Meta tags score
    const metaScore = Object.values(check.checks.metaTags).filter(Boolean).length / 
                     Object.values(check.checks.metaTags).length;
    score += metaScore * weights.META_TAGS;

    // Structured data score
    const structuredDataScore = check.checks.structuredData.valid ? 1 : 0;
    score += structuredDataScore * weights.STRUCTURED_DATA;

    // Performance score (average of CWV scores)
    const cwvScores = Object.values(check.checks.performance.coreWebVitals);
    const avgCwvScore = cwvScores.reduce((sum, cwv) => {
      return sum + (cwv.status === 'good' ? 1 : cwv.status === 'needs-improvement' ? 0.5 : 0);
    }, 0) / cwvScores.length;
    score += avgCwvScore * weights.PERFORMANCE;

    // Indexability score
    const indexabilityFactors = [
      check.checks.indexability.robotsAllowed,
      !check.checks.indexability.noindexPresent,
      check.checks.indexability.canonicalCorrect,
      check.checks.indexability.xmlSitemapPresent,
      check.checks.indexability.httpStatus === 200,
    ];
    const indexabilityScore = indexabilityFactors.filter(Boolean).length / indexabilityFactors.length;
    score += indexabilityScore * weights.INDEXABILITY;

    // Canonicalization score
    const canonScore = check.checks.canonicalization.isCanonicalCorrect ? 1 : 0;
    score += canonScore * weights.CANONICALIZATION;

    // Social sharing score
    const ogScore = Object.values(check.checks.socialSharing.openGraph).filter(Boolean).length / 5;
    const twitterScore = Object.values(check.checks.socialSharing.twitter).filter(Boolean).length / 4;
    const socialScore = (ogScore + twitterScore) / 2;
    score += socialScore * weights.SOCIAL_SHARING;

    return Math.round(score);
  }

  static prioritizeIssues(issues: SEOIssue[]): SEOIssue[] {
    return issues.sort((a, b) => {
      // Sort by impact first
      const impactOrder = { high: 3, medium: 2, low: 1 };
      const impactDiff = impactOrder[b.impact] - impactOrder[a.impact];
      if (impactDiff !== 0) return impactDiff;

      // Then by type
      const typeOrder = { error: 3, warning: 2, info: 1 };
      return typeOrder[b.type] - typeOrder[a.type];
    });
  }

  static detectCriticalIssues(check: SEOHealthCheck): SEOIssue[] {
    const critical = MONITORING_CONFIG.SEO_HEALTH.CRITICAL_ISSUES;
    return check.issues.filter(issue => 
      critical.some(criticalPattern => issue.message.includes(criticalPattern))
    );
  }
}

// URL similarity for smart redirects
export class URLSimilarity {
  static calculateSimilarity(url1: string, url2: string): number {
    const path1 = this.extractPath(url1);
    const path2 = this.extractPath(url2);

    // Levenshtein distance
    const distance = this.levenshteinDistance(path1, path2);
    const maxLength = Math.max(path1.length, path2.length);
    
    return maxLength === 0 ? 1 : 1 - (distance / maxLength);
  }

  static findSimilarUrls(targetUrl: string, candidateUrls: string[]): Array<{url: string, similarity: number}> {
    return candidateUrls
      .map(url => ({
        url,
        similarity: this.calculateSimilarity(targetUrl, url)
      }))
      .filter(item => item.similarity >= MONITORING_CONFIG.NOT_FOUND_MONITORING.SIMILARITY_THRESHOLD)
      .sort((a, b) => b.similarity - a.similarity);
  }

  private static extractPath(url: string): string {
    try {
      return new URL(url).pathname.toLowerCase();
    } catch {
      return url.toLowerCase();
    }
  }

  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array.from({ length: str2.length + 1 }, (_, i) => 
      Array.from({ length: str1.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        const cost = str1[j - 1] === str2[i - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,     // deletion
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }
}

// Alert management
export class AlertManager {
  private static alerts: Map<string, MonitoringAlert> = new Map();
  private static throttling: Map<string, number> = new Map();

  static createAlert(
    type: MonitoringAlert['type'],
    severity: MonitoringAlert['severity'],
    title: string,
    message: string,
    url?: string,
    metadata?: Record<string, any>
  ): MonitoringAlert | null {
    const alertKey = `${type}-${title}-${url || 'global'}`;
    const now = Date.now();

    // Check throttling
    const lastAlert = this.throttling.get(alertKey);
    if (lastAlert && now - lastAlert < MONITORING_CONFIG.ALERTS.THROTTLING.SAME_ALERT_INTERVAL) {
      return null; // Throttled
    }

    const alert: MonitoringAlert = {
      id: `${type}-${now}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      severity,
      title,
      message,
      url,
      timestamp: now,
      acknowledged: false,
      resolved: false,
      metadata: metadata || {},
    };

    this.alerts.set(alert.id, alert);
    this.throttling.set(alertKey, now);

    return alert;
  }

  static getAlerts(filters?: {
    type?: MonitoringAlert['type'];
    severity?: MonitoringAlert['severity'];
    acknowledged?: boolean;
    resolved?: boolean;
  }): MonitoringAlert[] {
    let alerts = Array.from(this.alerts.values());

    if (filters) {
      if (filters.type) alerts = alerts.filter(a => a.type === filters.type);
      if (filters.severity) alerts = alerts.filter(a => a.severity === filters.severity);
      if (filters.acknowledged !== undefined) alerts = alerts.filter(a => a.acknowledged === filters.acknowledged);
      if (filters.resolved !== undefined) alerts = alerts.filter(a => a.resolved === filters.resolved);
    }

    return alerts.sort((a, b) => b.timestamp - a.timestamp);
  }

  static acknowledgeAlert(id: string): boolean {
    const alert = this.alerts.get(id);
    if (alert) {
      alert.acknowledged = true;
      return true;
    }
    return false;
  }

  static resolveAlert(id: string): boolean {
    const alert = this.alerts.get(id);
    if (alert) {
      alert.resolved = true;
      alert.acknowledged = true;
      return true;
    }
    return false;
  }
}

// Data formatting utilities
export class DataFormatter {
  static formatBytes(bytes: number): string {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  }

  static formatDuration(ms: number): string {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    if (ms < 60000) return `${Math.round(ms / 1000 * 10) / 10}s`;
    if (ms < 3600000) return `${Math.round(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
    return `${Math.round(ms / 3600000)}h ${Math.round((ms % 3600000) / 60000)}m`;
  }

  static formatPercentage(value: number, decimals: number = 1): string {
    return `${(value * 100).toFixed(decimals)}%`;
  }

  static formatScore(score: number): { value: number; grade: string; color: string } {
    if (score >= 90) return { value: score, grade: 'A+', color: 'green' };
    if (score >= 80) return { value: score, grade: 'A', color: 'green' };
    if (score >= 70) return { value: score, grade: 'B', color: 'yellow' };
    if (score >= 60) return { value: score, grade: 'C', color: 'orange' };
    return { value: score, grade: 'F', color: 'red' };
  }

  static formatTimestamp(timestamp: number, format: 'short' | 'long' | 'relative' = 'short'): string {
    const date = new Date(timestamp);
    
    if (format === 'relative') {
      const now = Date.now();
      const diff = now - timestamp;
      
      if (diff < 60000) return 'just now';
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
      if (diff < 2592000000) return `${Math.floor(diff / 86400000)}d ago`;
      return date.toLocaleDateString();
    }
    
    if (format === 'long') {
      return date.toLocaleString();
    }
    
    return date.toLocaleDateString();
  }
}

// Cache management
export class CacheManager {
  private static cache: Map<string, { value: any; expiry: number }> = new Map();

  static set(key: string, value: any, ttlSeconds: number): void {
    const expiry = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { value, expiry });
  }

  static get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.value;
  }

  static has(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    
    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  static delete(key: string): boolean {
    return this.cache.delete(key);
  }

  static clear(): void {
    this.cache.clear();
  }

  static cleanup(): void {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now > cached.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

// Validation utilities
export class ValidationUtils {
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static sanitizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
    } catch {
      return url;
    }
  }

  static extractDomain(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }
}

// All utilities are already exported as classes above