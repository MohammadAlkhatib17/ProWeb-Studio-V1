/**
 * Monitoring Dashboard API endpoint
 * Aggregates all monitoring data for the main dashboard
 */

import { NextRequest, NextResponse } from 'next/server';

import { structuredDataAutomation } from '@/lib/monitoring/structured-data';
import { AlertManager, PerformanceMonitor } from '@/lib/monitoring/utils';
import type { MonitoringDashboard, MonitoringAPIResponse } from '@/lib/monitoring/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siteUrl = searchParams.get('url') || process.env.NEXT_PUBLIC_SITE_URL || 'https://proweb-studio.com';
    
    // Get current timestamp
    const timestamp = Date.now();
    
    // Gather data from all monitoring systems
    const [
      coreWebVitals,
      seoHealth,
      searchQueries,
      alerts
    ] = await Promise.allSettled([
      getCoreWebVitals(siteUrl),
      getSEOHealth(siteUrl),
      getSearchQueries(),
      getAlerts()
    ]);

    // Create dashboard data
    const dashboardData: MonitoringDashboard = {
      timestamp,
      overview: {
        seoScore: getResultValue(seoHealth)?.score || 0,
        performanceScore: calculatePerformanceScore(getResultValue(coreWebVitals)),
        issuesCount: getResultValue(seoHealth)?.issues?.length || 0,
        alertsCount: getResultValue(alerts)?.filter((a: any) => !a.resolved).length || 0,
      },
      recentAlerts: getResultValue(alerts) || [],
      coreWebVitals: getResultValue(coreWebVitals) || getDefaultWebVitals(),
      seoHealth: getResultValue(seoHealth) || getDefaultSEOHealth(),
      searchQueries: getResultValue(searchQueries) || [],
      topIssues: getResultValue(seoHealth)?.issues?.slice(0, 5) || [],
      competitorInsights: [], // Would be populated with actual data
    };

    const response: MonitoringAPIResponse<MonitoringDashboard> = {
      success: true,
      data: dashboardData,
      timestamp,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Dashboard API error:', error);
    
    const errorResponse: MonitoringAPIResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      timestamp: Date.now(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

async function getCoreWebVitals(url: string) {
  try {
    const performanceMonitor = PerformanceMonitor.getInstance();
    const metrics = performanceMonitor.getMetrics(url, 1); // Last 24 hours
    
    if (metrics.length === 0) {
      return getDefaultWebVitals();
    }

    // Return the most recent metrics
    return metrics[metrics.length - 1];
  } catch (error) {
    console.error('Failed to get Core Web Vitals:', error);
    return getDefaultWebVitals();
  }
}

async function getSEOHealth(siteUrl: string) {
  try {
    const structuredDataCheck = await structuredDataAutomation.runDailyCheck(siteUrl);
    
    // Create a mock SEO health check for demo purposes
    // In production, this would aggregate data from multiple sources
    return {
      url: siteUrl,
      timestamp: Date.now(),
      status: structuredDataCheck.valid ? ('healthy' as const) : ('warning' as const),
      checks: {
        metaTags: {
          title: true,
          description: true,
          keywords: true,
          robots: true,
          canonical: true,
          hreflang: false,
          openGraph: true,
          twitterCard: true,
        },
        structuredData: structuredDataCheck,
        performance: {
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
        },
        indexability: {
          robotsAllowed: true,
          noindexPresent: false,
          canonicalCorrect: true,
          xmlSitemapPresent: true,
          internalLinksCount: 25,
          httpStatus: 200,
        },
        canonicalization: {
          hasCanonical: true,
          canonicalUrl: siteUrl,
          isCanonicalCorrect: true,
          duplicateContent: false,
        },
        socialSharing: {
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
        },
      },
      score: structuredDataCheck.valid ? 95 : 75,
      issues: structuredDataAutomation.generateSEOIssues(
        structuredDataAutomation.getLatestResults(siteUrl) || {
          valid: true,
          errors: [],
          warnings: [],
          richSnippets: [],
          schemaTypes: [],
          coverage: {
            totalPages: 10,
            pagesWithSchema: 8,
            coveragePercentage: 80,
            schemaTypeDistribution: {},
            missingSchemaPages: [],
          },
        }
      ),
    };
  } catch (error) {
    console.error('Failed to get SEO health:', error);
    return getDefaultSEOHealth();
  }
}

async function getSearchQueries() {
  try {
    // This would integrate with Google Search Console API
    // For now, return mock data
    return [
      {
        query: 'web development services',
        impressions: 1250,
        clicks: 95,
        ctr: 0.076,
        averagePosition: 4.2,
        timestamp: Date.now(),
        device: 'desktop' as const,
        country: 'NL',
        page: '/',
      },
      {
        query: 'custom website design',
        impressions: 890,
        clicks: 67,
        ctr: 0.075,
        averagePosition: 5.8,
        timestamp: Date.now(),
        device: 'mobile' as const,
        country: 'NL',
        page: '/services',
      },
      {
        query: 'react development company',
        impressions: 650,
        clicks: 42,
        ctr: 0.065,
        averagePosition: 6.1,
        timestamp: Date.now(),
        device: 'desktop' as const,
        country: 'NL',
        page: '/services',
      },
    ];
  } catch (error) {
    console.error('Failed to get search queries:', error);
    return [];
  }
}

async function getAlerts() {
  try {
    return AlertManager.getAlerts({ resolved: false });
  } catch (error) {
    console.error('Failed to get alerts:', error);
    return [];
  }
}

function getResultValue<T>(result: PromiseSettledResult<T>): T | null {
  return result.status === 'fulfilled' ? result.value : null;
}

function calculatePerformanceScore(metrics: any): number {
  if (!metrics) return 0;
  
  // Simple scoring based on Core Web Vitals
  let score = 0;
  
  // LCP scoring
  if (metrics.lcp <= 2500) score += 25;
  else if (metrics.lcp <= 4000) score += 15;
  
  // FID scoring
  if (metrics.fid <= 100) score += 25;
  else if (metrics.fid <= 300) score += 15;
  
  // CLS scoring
  if (metrics.cls <= 0.1) score += 25;
  else if (metrics.cls <= 0.25) score += 15;
  
  // TTFB scoring
  if (metrics.ttfb <= 800) score += 25;
  else if (metrics.ttfb <= 1800) score += 15;
  
  return score;
}

function getDefaultWebVitals() {
  return {
    fcp: 1200,
    lcp: 2200,
    fid: 80,
    cls: 0.08,
    ttfb: 600,
    timestamp: Date.now(),
    url: '/',
    userAgent: 'Default',
  };
}

function getDefaultSEOHealth() {
  return {
    url: '/',
    timestamp: Date.now(),
    status: 'healthy' as const,
    checks: {
      metaTags: {
        title: true,
        description: true,
        keywords: true,
        robots: true,
        canonical: true,
        hreflang: false,
        openGraph: true,
        twitterCard: true,
      },
      structuredData: {
        present: true,
        valid: true,
        types: ['Organization', 'WebSite'],
        errors: [],
        warnings: [],
        richSnippetsEligible: true,
      },
      performance: {
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
      },
      indexability: {
        robotsAllowed: true,
        noindexPresent: false,
        canonicalCorrect: true,
        xmlSitemapPresent: true,
        internalLinksCount: 25,
        httpStatus: 200,
      },
      canonicalization: {
        hasCanonical: true,
        canonicalUrl: '/',
        isCanonicalCorrect: true,
        duplicateContent: false,
      },
      socialSharing: {
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
      },
    },
    score: 95,
    issues: [],
  };
}