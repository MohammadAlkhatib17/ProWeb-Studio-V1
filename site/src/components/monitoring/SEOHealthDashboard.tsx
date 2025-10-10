'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye, 
  TrendingUp, 
  Search,
  BarChart3,
  Shield,
  Zap,
  Globe
} from 'lucide-react';
import type { 
  MonitoringDashboard, 
  SEOHealthCheck, 
  CoreWebVitalsMetrics,
  MonitoringAlert,
  SearchQueryData 
} from '@/lib/monitoring/types';

interface SEOHealthDashboardProps {
  className?: string;
}

export default function SEOHealthDashboard({ className }: SEOHealthDashboardProps) {
  const [dashboardData, setDashboardData] = useState<MonitoringDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/monitoring/dashboard');
      if (!response.ok) throw new Error('Failed to load dashboard data');
      
      const result = await response.json();
      setDashboardData(result.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load monitoring dashboard: {error}
          <button 
            onClick={handleRefresh}
            className="ml-2 underline hover:no-underline"
          >
            Try again
          </button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!dashboardData) {
    return (
      <Alert className={className}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          No monitoring data available. Please check your configuration.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SEO Health Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your website&apos;s SEO performance and health metrics
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          {refreshing ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              Refresh
            </>
          )}
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          title="SEO Score"
          value={dashboardData.overview.seoScore}
          type="score"
          icon={<Search className="h-4 w-4" />}
        />
        <OverviewCard
          title="Performance Score"
          value={dashboardData.overview.performanceScore}
          type="score"
          icon={<Zap className="h-4 w-4" />}
        />
        <OverviewCard
          title="Issues Found"
          value={dashboardData.overview.issuesCount}
          type="count"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <OverviewCard
          title="Active Alerts"
          value={dashboardData.overview.alertsCount}
          type="count"
          icon={<Shield className="h-4 w-4" />}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="seo">SEO Health</TabsTrigger>
          <TabsTrigger value="search">Search Queries</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <RecentAlertsCard alerts={dashboardData.recentAlerts} />
            <TopIssuesCard issues={dashboardData.topIssues} />
          </div>
          <CompetitorInsightsCard insights={dashboardData.competitorInsights} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <CoreWebVitalsCard metrics={dashboardData.coreWebVitals} />
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <SEOHealthCard health={dashboardData.seoHealth} />
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <SearchQueriesCard queries={dashboardData.searchQueries} />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <AlertsManagementCard alerts={dashboardData.recentAlerts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Overview Card Component
function OverviewCard({ 
  title, 
  value, 
  type, 
  icon 
}: { 
  title: string; 
  value: number; 
  type: 'score' | 'count'; 
  icon: React.ReactNode; 
}) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCountColor = (count: number) => {
    if (count === 0) return 'text-green-600';
    if (count <= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${type === 'score' ? getScoreColor(value) : getCountColor(value)}`}>
          {type === 'score' ? `${value}%` : value}
        </div>
        {type === 'score' && (
          <Progress value={value} className="mt-2" />
        )}
      </CardContent>
    </Card>
  );
}

// Recent Alerts Card
function RecentAlertsCard({ alerts }: { alerts: MonitoringAlert[] }) {
  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Recent Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No recent alerts. Everything looks good!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.slice(0, 5).map((alert) => (
          <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
            <AlertTriangle className={`h-4 w-4 mt-0.5 ${
              alert.severity === 'critical' ? 'text-red-600' :
              alert.severity === 'high' ? 'text-orange-600' :
              alert.severity === 'medium' ? 'text-yellow-600' :
              'text-blue-600'
            }`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm">{alert.title}</p>
                <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                  {alert.severity}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{alert.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(alert.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Top Issues Card
function TopIssuesCard({ issues }: { issues: any[] }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const priorityIssues = issues
    .filter(issue => issue.impact === 'high')
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Issues</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {priorityIssues.length === 0 ? (
          <p className="text-muted-foreground">No high-priority issues found.</p>
        ) : (
          priorityIssues.map((issue, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
              <div className={`h-2 w-2 rounded-full mt-2 ${
                issue.type === 'error' ? 'bg-red-600' :
                issue.type === 'warning' ? 'bg-yellow-600' :
                'bg-blue-600'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{issue.message}</p>
                <p className="text-sm text-muted-foreground">{issue.recommendation}</p>
                <Badge variant="outline" className="mt-1">
                  {issue.category}
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

// Core Web Vitals Card
function CoreWebVitalsCard({ metrics }: { metrics: CoreWebVitalsMetrics }) {
  const getVitalsStatus = (metric: string, value: number) => {
    const thresholds = {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      ttfb: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return 'unknown';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  const formatValue = (metric: string, value: number) => {
    if (metric === 'cls') return value.toFixed(3);
    return `${Math.round(value)}ms`;
  };

  const vitalsData = [
    { name: 'LCP', value: metrics.lcp, description: 'Largest Contentful Paint' },
    { name: 'FID', value: metrics.fid, description: 'First Input Delay' },
    { name: 'CLS', value: metrics.cls, description: 'Cumulative Layout Shift' },
    { name: 'TTFB', value: metrics.ttfb, description: 'Time to First Byte' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Core Web Vitals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {vitalsData.map((vital) => {
            const status = getVitalsStatus(vital.name.toLowerCase(), vital.value);
            return (
              <div key={vital.name} className="text-center p-4 rounded-lg border">
                <div className={`text-2xl font-bold ${
                  status === 'good' ? 'text-green-600' :
                  status === 'needs-improvement' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {formatValue(vital.name.toLowerCase(), vital.value)}
                </div>
                <div className="text-sm font-medium">{vital.name}</div>
                <div className="text-xs text-muted-foreground">{vital.description}</div>
                <Badge 
                  variant={status === 'good' ? 'default' : status === 'needs-improvement' ? 'secondary' : 'destructive'}
                  className="mt-2"
                >
                  {status.replace('-', ' ')}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// SEO Health Card
function SEOHealthCard({ health }: { health: SEOHealthCheck }) {
  const checkCategories = [
    { name: 'Meta Tags', data: health.checks.metaTags, icon: <Globe className="h-4 w-4" /> },
    { name: 'Structured Data', data: health.checks.structuredData, icon: <Search className="h-4 w-4" /> },
    { name: 'Performance', data: health.checks.performance, icon: <Zap className="h-4 w-4" /> },
    { name: 'Indexability', data: health.checks.indexability, icon: <Eye className="h-4 w-4" /> },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            SEO Health Check
          </span>
          <Badge variant={health.status === 'healthy' ? 'default' : health.status === 'warning' ? 'secondary' : 'destructive'}>
            {health.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-2">{health.score}/100</div>
          <Progress value={health.score} className="w-full" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {checkCategories.map((category) => (
            <div key={category.name} className="p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-3">
                {category.icon}
                <span className="font-medium">{category.name}</span>
              </div>
              {/* Category-specific rendering would go here */}
              <div className="text-sm text-muted-foreground">
                Check details for {category.name.toLowerCase()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Search Queries Card
function SearchQueriesCard({ queries }: { queries: SearchQueryData[] }) {
  const topQueries = queries
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Top Search Queries
        </CardTitle>
      </CardHeader>
      <CardContent>
        {topQueries.length === 0 ? (
          <p className="text-muted-foreground">No search query data available.</p>
        ) : (
          <div className="space-y-4">
            {topQueries.map((query, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{query.query}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{query.impressions.toLocaleString()} impressions</span>
                    <span>{query.clicks} clicks</span>
                    <span>{(query.ctr * 100).toFixed(1)}% CTR</span>
                  </div>
                </div>
                <Badge variant="outline">
                  #{Math.round(query.averagePosition)}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Competitor Insights Card
function CompetitorInsightsCard({ insights }: { insights: any[] }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Competitor Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <p className="text-muted-foreground">No competitor insights available.</p>
        ) : (
          <div className="space-y-3">
            {insights.slice(0, 5).map((insight, index) => (
              <div key={index} className="p-3 rounded-lg border">
                <p className="font-medium">{insight.keyword}</p>
                <p className="text-sm text-muted-foreground">
                  Opportunity: {insight.opportunity} • Volume: {insight.searchVolume?.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Alerts Management Card
function AlertsManagementCard({ alerts }: { alerts: MonitoringAlert[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert Management</CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p className="text-muted-foreground">No alerts to manage.</p>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start justify-between p-4 rounded-lg border">
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`h-4 w-4 mt-1 ${
                    alert.severity === 'critical' ? 'text-red-600' :
                    alert.severity === 'high' ? 'text-orange-600' :
                    alert.severity === 'medium' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`} />
                  <div>
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-sm px-3 py-1 rounded bg-muted hover:bg-muted/80">
                    Acknowledge
                  </button>
                  <button className="text-sm px-3 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90">
                    Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}