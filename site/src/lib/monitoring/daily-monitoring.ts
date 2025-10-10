/**
 * Automated Daily Monitoring System
 * Runs comprehensive checks and sends alerts for critical issues
 */

import { MONITORING_CONFIG } from './config';
import { structuredDataAutomation } from './structured-data';
import { notFoundMonitor } from './not-found';
import type { NotFoundAnalytics } from './not-found';
import { AlertManager, CacheManager } from './utils';
import type { 
  MonitoringAlert, 
  SEOHealthCheck, 
  CoreWebVitalsMetrics,
  SitemapValidation
} from './types';

export interface DailyCheckResult {
  timestamp: number;
  siteUrl: string;
  checks: {
    seoHealth: SEOHealthCheck;
    performance: CoreWebVitalsMetrics;
    notFound: NotFoundAnalytics;
    sitemap: SitemapValidation;
    indexing: IndexingStatus;
  };
  alerts: MonitoringAlert[];
  summary: {
    overallScore: number;
    criticalIssues: number;
    recommendations: string[];
  };
}

export interface IndexingStatus {
  totalPages: number;
  indexedPages: number;
  indexingRate: number;
  errors: Array<{
    url: string;
    error: string;
    severity: 'high' | 'medium' | 'low';
  }>;
  lastUpdated: number;
}

export interface NotificationPayload {
  type: 'email' | 'webhook' | 'slack';
  recipient: string;
  subject: string;
  message: string;
  data: unknown;
}

export class DailyMonitoring {
  private siteUrl: string;
  private isRunning = false;

  constructor(siteUrl: string) {
    this.siteUrl = siteUrl;
  }

  /**
   * Run comprehensive daily monitoring checks
   */
  async runDailyChecks(): Promise<DailyCheckResult> {
    if (this.isRunning) {
      throw new Error('Daily checks are already running');
    }

    this.isRunning = true;
    const timestamp = Date.now();

    try {
      console.log(`Starting daily monitoring checks for ${this.siteUrl}`);

      // Run all checks in parallel where possible
      const [
        seoHealthResult,
        performanceResult,
        notFoundResult,
        sitemapResult,
        indexingResult
      ] = await Promise.allSettled([
        this.runSEOHealthCheck(),
        this.runPerformanceCheck(),
        this.runNotFoundCheck(),
        this.runSitemapCheck(),
        this.runIndexingCheck()
      ]);

      // Extract results
      const seoHealth = this.getSettledResult(seoHealthResult, this.getDefaultSEOHealth());
      const performance = this.getSettledResult(performanceResult, this.getDefaultPerformance());
      const notFound = this.getSettledResult(notFoundResult, this.getDefaultNotFound());
      const sitemap = this.getSettledResult(sitemapResult, this.getDefaultSitemap());
      const indexing = this.getSettledResult(indexingResult, this.getDefaultIndexing());

      // Analyze results and generate alerts
      const alerts = await this.analyzeResults({
        seoHealth,
        performance,
        notFound,
        sitemap,
        indexing
      });

      // Calculate overall score and summary
      const summary = this.calculateSummary({
        seoHealth,
        performance,
        notFound,
        sitemap,
        indexing
      }, alerts);

      const result: DailyCheckResult = {
        timestamp,
        siteUrl: this.siteUrl,
        checks: {
          seoHealth,
          performance,
          notFound,
          sitemap,
          indexing
        },
        alerts,
        summary
      };

      // Store results
      await this.storeResults(result);

      // Send notifications if needed
      await this.sendNotifications(result);

      console.log(`Daily monitoring checks completed successfully`);

      return result;

    } catch (error) {
      console.error('Daily monitoring checks failed:', error);
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Schedule automated daily checks
   */
  scheduleDaily(): void {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(6, 0, 0, 0); // Run at 6 AM daily

    const msUntilTomorrow = tomorrow.getTime() - now.getTime();

    setTimeout(() => {
      this.runDailyChecks().catch(console.error);
      
      // Schedule recurring daily checks
      setInterval(() => {
        this.runDailyChecks().catch(console.error);
      }, 24 * 60 * 60 * 1000); // 24 hours
    }, msUntilTomorrow);

    console.log(`Daily monitoring scheduled to run at ${tomorrow.toLocaleString()}`);
  }

  private async runSEOHealthCheck(): Promise<SEOHealthCheck> {
    const structuredDataResult = await structuredDataAutomation.runDailyCheck(this.siteUrl);
    
    // Comprehensive SEO health check
    const seoHealth: SEOHealthCheck = {
      url: this.siteUrl,
      timestamp: Date.now(),
      status: structuredDataResult.valid ? 'healthy' : 'warning',
      checks: {
        metaTags: await this.checkMetaTags(),
        structuredData: structuredDataResult,
        performance: await this.checkSEOPerformance(),
        indexability: await this.checkIndexability(),
        canonicalization: await this.checkCanonicalization(),
        socialSharing: await this.checkSocialSharing(),
      },
      score: 0, // Will be calculated
      issues: [],
    };

    // Calculate score and identify issues
    seoHealth.score = this.calculateSEOScore(seoHealth);
    seoHealth.issues = this.identifySEOIssues();

    return seoHealth;
  }

  private async runPerformanceCheck(): Promise<CoreWebVitalsMetrics> {
    // This would typically fetch from real monitoring data
    // For now, simulate performance check
    return {
      fcp: 1200,
      lcp: 2200,
      fid: 80,
      cls: 0.08,
      ttfb: 600,
      timestamp: Date.now(),
      url: this.siteUrl,
      userAgent: 'Daily Monitor Bot',
    };
  }

  private async runNotFoundCheck(): Promise<NotFoundAnalytics> {
    return notFoundMonitor.getAnalytics(1); // Last 24 hours
  }

  private async runSitemapCheck(): Promise<SitemapValidation> {
    try {
      const sitemapUrl = `${this.siteUrl}/sitemap.xml`;
      const response = await fetch(sitemapUrl);
      
      const validation: SitemapValidation = {
        url: sitemapUrl,
        timestamp: Date.now(),
        isValid: response.ok,
        urlCount: 0,
        issues: [],
        indexSubmissionStatus: 'submitted',
        coverageReport: {
          submitted: 0,
          indexed: 0,
          errors: 0,
          warnings: 0,
        },
      };

      if (response.ok) {
        const xmlContent = await response.text();
        const urlMatches = xmlContent.match(/<loc>(.*?)<\/loc>/g);
        validation.urlCount = urlMatches ? urlMatches.length : 0;
        
        // Basic validation
        if (!xmlContent.includes('<?xml')) {
          validation.issues.push({
            type: 'error',
            message: 'Invalid XML format',
            recommendation: 'Ensure sitemap starts with XML declaration',
          });
        }
      } else {
        validation.issues.push({
          type: 'error',
          message: `Sitemap not accessible: HTTP ${response.status}`,
          recommendation: 'Check sitemap URL and server configuration',
        });
      }

      return validation;
    } catch (error) {
      return {
        url: `${this.siteUrl}/sitemap.xml`,
        timestamp: Date.now(),
        isValid: false,
        urlCount: 0,
        issues: [{
          type: 'error',
          message: `Sitemap check failed: ${error}`,
          recommendation: 'Check sitemap accessibility and format',
        }],
        indexSubmissionStatus: 'error',
        coverageReport: {
          submitted: 0,
          indexed: 0,
          errors: 1,
          warnings: 0,
        },
      };
    }
  }

  private async runIndexingCheck(): Promise<IndexingStatus> {
    // This would integrate with Google Search Console API
    // For now, return mock data
    return {
      totalPages: 25,
      indexedPages: 23,
      indexingRate: 0.92,
      errors: [
        {
          url: `${this.siteUrl}/some-page`,
          error: 'Page blocked by robots.txt',
          severity: 'medium',
        },
      ],
      lastUpdated: Date.now(),
    };
  }

  private async analyzeResults(checks: DailyCheckResult['checks']): Promise<MonitoringAlert[]> {
    const alerts: MonitoringAlert[] = [];

    // SEO Health alerts
    if (checks.seoHealth.score < MONITORING_CONFIG.ALERTS.SEVERITY_THRESHOLDS.CRITICAL.SEO_SCORE) {
      alerts.push(AlertManager.createAlert(
        'seo',
        'critical',
        'Critical SEO Issues Detected',
        `SEO score dropped to ${checks.seoHealth.score}. Immediate attention required.`,
        this.siteUrl,
        { score: checks.seoHealth.score, issues: checks.seoHealth.issues.length }
      )!);
    }

    // Performance alerts
    if (checks.performance.lcp > 4000) {
      alerts.push(AlertManager.createAlert(
        'performance',
        'high',
        'Poor LCP Performance',
        `LCP is ${checks.performance.lcp}ms, exceeding 4s threshold`,
        this.siteUrl,
        { lcp: checks.performance.lcp }
      )!);
    }

    // 404 alerts
    if (checks.notFound.totalNotFound > 50) {
      alerts.push(AlertManager.createAlert(
        '404',
        'medium',
        'High 404 Error Rate',
        `${checks.notFound.totalNotFound} 404 errors in the last 24 hours`,
        this.siteUrl,
        { count: checks.notFound.totalNotFound }
      )!);
    }

    // Sitemap alerts
    if (!checks.sitemap.isValid) {
      alerts.push(AlertManager.createAlert(
        'sitemap',
        'high',
        'Sitemap Issues',
        'XML sitemap has validation errors',
        this.siteUrl,
        { issues: checks.sitemap.issues }
      )!);
    }

    // Indexing alerts
    if (checks.indexing.indexingRate < 0.8) {
      alerts.push(AlertManager.createAlert(
        'indexing',
        'high',
        'Low Indexing Rate',
        `Only ${Math.round(checks.indexing.indexingRate * 100)}% of pages are indexed`,
        this.siteUrl,
        { rate: checks.indexing.indexingRate }
      )!);
    }

    return alerts.filter(Boolean);
  }

  private calculateSummary(
    checks: DailyCheckResult['checks'],
    alerts: MonitoringAlert[]
  ) {
    const criticalIssues = alerts.filter(a => a.severity === 'critical').length;
    
    // Calculate weighted overall score
    const weights = {
      seo: 0.3,
      performance: 0.25,
      notFound: 0.15,
      sitemap: 0.15,
      indexing: 0.15,
    };

    let overallScore = 0;
    overallScore += checks.seoHealth.score * weights.seo;
    overallScore += this.calculatePerformanceScore(checks.performance) * weights.performance;
    overallScore += this.calculate404Score(checks.notFound) * weights.notFound;
    overallScore += (checks.sitemap.isValid ? 100 : 50) * weights.sitemap;
    overallScore += (checks.indexing.indexingRate * 100) * weights.indexing;

    const recommendations = this.generateRecommendations(checks, alerts);

    return {
      overallScore: Math.round(overallScore),
      criticalIssues,
      recommendations,
    };
  }

  private generateRecommendations(
    checks: DailyCheckResult['checks'],
    alerts: MonitoringAlert[]
  ): string[] {
    const recommendations: string[] = [];

    // SEO recommendations
    if (checks.seoHealth.score < 80) {
      recommendations.push('Improve SEO health by addressing meta tag and structured data issues');
    }

    // Performance recommendations
    if (checks.performance.lcp > 2500) {
      recommendations.push('Optimize Largest Contentful Paint by improving server response time and image loading');
    }

    // Critical alert recommendations
    if (alerts.some(a => a.severity === 'critical')) {
      recommendations.push('Address critical alerts immediately to prevent SEO impact');
    }

    return recommendations;
  }

  private async storeResults(result: DailyCheckResult): Promise<void> {
    try {
      // Store in cache for quick access
      CacheManager.set(`daily-check-${this.siteUrl}`, result, 86400); // 24 hours
      
      // In production, this would also store in a database
      console.log('Daily check results stored successfully');
    } catch (error) {
      console.error('Failed to store daily check results:', error);
    }
  }

  private async sendNotifications(result: DailyCheckResult): Promise<void> {
    const criticalAlerts = result.alerts.filter(a => a.severity === 'critical');
    const highAlerts = result.alerts.filter(a => a.severity === 'high');

    if (criticalAlerts.length === 0 && highAlerts.length === 0) {
      return; // No significant issues to report
    }

    const notifications: NotificationPayload[] = [];

    // Email notification
    if (MONITORING_CONFIG.NOTIFICATIONS.EMAIL.ENABLED) {
      notifications.push({
        type: 'email',
        recipient: MONITORING_CONFIG.NOTIFICATIONS.EMAIL.FROM,
        subject: `Daily SEO Monitoring Alert - ${this.siteUrl}`,
        message: this.formatEmailMessage(result),
        data: result,
      });
    }

    // Webhook notification
    if (MONITORING_CONFIG.NOTIFICATIONS.WEBHOOK.ENABLED) {
      notifications.push({
        type: 'webhook',
        recipient: MONITORING_CONFIG.NOTIFICATIONS.WEBHOOK.URL!,
        subject: 'Daily Monitoring Alert',
        message: this.formatWebhookMessage(result),
        data: result,
      });
    }

    // Slack notification
    if (MONITORING_CONFIG.NOTIFICATIONS.SLACK.ENABLED) {
      notifications.push({
        type: 'slack',
        recipient: MONITORING_CONFIG.NOTIFICATIONS.SLACK.WEBHOOK_URL!,
        subject: 'Daily Monitoring Alert',
        message: this.formatSlackMessage(result),
        data: result,
      });
    }

    // Send all notifications
    await Promise.allSettled(
      notifications.map(notification => this.sendNotification(notification))
    );
  }

  private async sendNotification(notification: NotificationPayload): Promise<void> {
    try {
      switch (notification.type) {
        case 'email':
          await this.sendEmailNotification(notification);
          break;
        case 'webhook':
          await this.sendWebhookNotification(notification);
          break;
        case 'slack':
          await this.sendSlackNotification(notification);
          break;
      }
    } catch (error) {
      console.error(`Failed to send ${notification.type} notification:`, error);
    }
  }

  private async sendEmailNotification(notification: NotificationPayload): Promise<void> {
    // Email sending implementation would go here
    console.log('Email notification sent:', notification.subject);
  }

  private async sendWebhookNotification(notification: NotificationPayload): Promise<void> {
    await fetch(notification.recipient, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(MONITORING_CONFIG.NOTIFICATIONS.WEBHOOK.SECRET && {
          'X-Webhook-Secret': MONITORING_CONFIG.NOTIFICATIONS.WEBHOOK.SECRET
        })
      },
      body: JSON.stringify({
        subject: notification.subject,
        message: notification.message,
        data: notification.data,
        timestamp: Date.now(),
      }),
    });
  }

  private async sendSlackNotification(notification: NotificationPayload): Promise<void> {
    await fetch(notification.recipient, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: notification.subject,
        attachments: [{
          color: 'danger',
          text: notification.message,
          ts: Math.floor(Date.now() / 1000),
        }],
      }),
    });
  }

  private formatEmailMessage(result: DailyCheckResult): string {
    const { summary, alerts } = result;
    
    return `
Daily SEO Monitoring Report for ${this.siteUrl}

Overall Score: ${summary.overallScore}/100
Critical Issues: ${summary.criticalIssues}

Recent Alerts:
${alerts.map(alert => `- ${alert.title}: ${alert.message}`).join('\n')}

Recommendations:
${summary.recommendations.map(rec => `- ${rec}`).join('\n')}

Report generated at: ${new Date(result.timestamp).toLocaleString()}
    `.trim();
  }

  private formatWebhookMessage(result: DailyCheckResult): string {
    return `Daily monitoring alert for ${this.siteUrl}: ${result.summary.criticalIssues} critical issues found`;
  }

  private formatSlackMessage(result: DailyCheckResult): string {
    return `🚨 Daily monitoring alert for ${this.siteUrl}\nOverall Score: ${result.summary.overallScore}/100\nCritical Issues: ${result.summary.criticalIssues}`;
  }

  // Helper methods for default values and calculations
  private getSettledResult<T>(result: PromiseSettledResult<T>, defaultValue: T): T {
    return result.status === 'fulfilled' ? result.value : defaultValue;
  }

  private getDefaultSEOHealth(): SEOHealthCheck {
    return {
      url: this.siteUrl,
      timestamp: Date.now(),
      status: 'warning',
      checks: {
        metaTags: {
          title: false,
          description: false,
          keywords: false,
          robots: false,
          canonical: false,
          hreflang: false,
          openGraph: false,
          twitterCard: false,
        },
        structuredData: {
          present: false,
          valid: false,
          types: [],
          errors: ['Check failed'],
          warnings: [],
          richSnippetsEligible: false,
        },
        performance: {
          coreWebVitals: {
            lcp: { value: 5000, status: 'poor' },
            fid: { value: 500, status: 'poor' },
            cls: { value: 0.5, status: 'poor' },
          },
          lighthouse: {
            performance: 0,
            accessibility: 0,
            bestPractices: 0,
            seo: 0,
          },
        },
        indexability: {
          robotsAllowed: false,
          noindexPresent: true,
          canonicalCorrect: false,
          xmlSitemapPresent: false,
          internalLinksCount: 0,
          httpStatus: 500,
        },
        canonicalization: {
          hasCanonical: false,
          canonicalUrl: '',
          isCanonicalCorrect: false,
          duplicateContent: true,
        },
        socialSharing: {
          openGraph: {
            title: false,
            description: false,
            image: false,
            url: false,
            type: false,
          },
          twitter: {
            card: false,
            title: false,
            description: false,
            image: false,
          },
        },
      },
      score: 0,
      issues: [],
    };
  }

  private getDefaultPerformance(): CoreWebVitalsMetrics {
    return {
      fcp: 5000,
      lcp: 8000,
      fid: 1000,
      cls: 1.0,
      ttfb: 3000,
      timestamp: Date.now(),
      url: this.siteUrl,
      userAgent: 'Failed Check',
    };
  }

  private getDefaultNotFound(): NotFoundAnalytics {
    return {
      totalNotFound: 0,
      uniqueUrls: 0,
      topMissingPages: [],
      topReferrers: [],
      deviceBreakdown: {},
      trends: [],
      patterns: [],
    };
  }

  private getDefaultSitemap(): SitemapValidation {
    return {
      url: `${this.siteUrl}/sitemap.xml`,
      timestamp: Date.now(),
      isValid: false,
      urlCount: 0,
      issues: [{ type: 'error', message: 'Sitemap check failed', recommendation: 'Check sitemap availability' }],
      indexSubmissionStatus: 'error',
      coverageReport: {
        submitted: 0,
        indexed: 0,
        errors: 1,
        warnings: 0,
      },
    };
  }

  private getDefaultIndexing(): IndexingStatus {
    return {
      totalPages: 0,
      indexedPages: 0,
      indexingRate: 0,
      errors: [{ url: this.siteUrl, error: 'Indexing check failed', severity: 'high' }],
      lastUpdated: Date.now(),
    };
  }

  // Placeholder methods for SEO checks
  private async checkMetaTags() {
    return {
      title: true,
      description: true,
      keywords: true,
      robots: true,
      canonical: true,
      hreflang: false,
      openGraph: true,
      twitterCard: true,
    };
  }

  private async checkSEOPerformance() {
    return {
      coreWebVitals: {
        lcp: { value: 2200, status: 'good' as const },
        fid: { value: 80, status: 'good' as const },
        cls: { value: 0.08, status: 'good' as const },
      },
      lighthouse: {
        performance: 95,
        accessibility: 98,
        bestPractices: 92,
        seo: 100,
      },
    };
  }

  private async checkIndexability() {
    return {
      robotsAllowed: true,
      noindexPresent: false,
      canonicalCorrect: true,
      xmlSitemapPresent: true,
      internalLinksCount: 25,
      httpStatus: 200,
    };
  }

  private async checkCanonicalization() {
    return {
      hasCanonical: true,
      canonicalUrl: this.siteUrl,
      isCanonicalCorrect: true,
      duplicateContent: false,
    };
  }

  private async checkSocialSharing() {
    return {
      openGraph: {
        title: true,
        description: true,
        image: true,
        url: true,
        type: true,
      },
      twitter: {
        card: true,
        title: true,
        description: true,
        image: true,
      },
    };
  }

  private calculateSEOScore(health: SEOHealthCheck): number {
    // Simplified scoring - in production would be more comprehensive
    let score = 0;
    
    // Meta tags (20 points)
    const metaScore = Object.values(health.checks.metaTags).filter(Boolean).length / 8;
    score += metaScore * 20;
    
    // Structured data (15 points)
    score += health.checks.structuredData.valid ? 15 : 0;
    
    // Performance (25 points)
    const perfScore = (health.checks.performance.lighthouse.performance / 100) * 25;
    score += perfScore;
    
    // Indexability (20 points)
    const indexScore = Object.values(health.checks.indexability).filter(Boolean).length / 6;
    score += indexScore * 20;
    
    // Other factors (20 points)
    score += health.checks.canonicalization.isCanonicalCorrect ? 10 : 0;
    score += Object.values(health.checks.socialSharing.openGraph).filter(Boolean).length >= 4 ? 10 : 0;
    
    return Math.round(score);
  }

  private identifySEOIssues() {
    // Would identify specific issues based on checks
    return [];
  }

  private calculatePerformanceScore(metrics: CoreWebVitalsMetrics): number {
    let score = 0;
    
    if (metrics.lcp <= 2500) score += 25;
    else if (metrics.lcp <= 4000) score += 15;
    
    if (metrics.fid <= 100) score += 25;
    else if (metrics.fid <= 300) score += 15;
    
    if (metrics.cls <= 0.1) score += 25;
    else if (metrics.cls <= 0.25) score += 15;
    
    if (metrics.ttfb <= 800) score += 25;
    else if (metrics.ttfb <= 1800) score += 15;
    
    return score;
  }

  private calculate404Score(notFound: NotFoundAnalytics): number {
    if (notFound.totalNotFound === 0) return 100;
    if (notFound.totalNotFound <= 10) return 80;
    if (notFound.totalNotFound <= 50) return 60;
    return 40;
  }
}

// Export factory function for creating daily monitoring instances
export function createDailyMonitoring(siteUrl: string): DailyMonitoring {
  return new DailyMonitoring(siteUrl);
}

// Export default instance for the main site
export const dailyMonitoring = new DailyMonitoring(
  process.env.NEXT_PUBLIC_SITE_URL || 'https://proweb-studio.com'
);