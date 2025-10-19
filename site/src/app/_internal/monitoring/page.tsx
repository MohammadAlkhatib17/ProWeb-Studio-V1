'use client';

/**
 * Internal monitoring dashboard for Core Web Vitals
 * Protected by environment flag in production
 * Displays recent vitals events and statistics
 */

import type { Metadata } from 'next';
import { useEffect, useState } from 'react';

// Internal page - noindex
export const metadata: Metadata = {
  title: 'Core Web Vitals Monitor - Internal',
  description: 'Internal monitoring dashboard for Core Web Vitals',
  robots: {
    index: false,
    follow: false,
  },
};
import type { VitalEvent, MonitoringStats } from '@/lib/monitoring/types';
import { formatMetricValue, getRatingColor, getMetricDescription } from '@/lib/monitoring/utils';

interface DashboardData {
  events: VitalEvent[];
  stats: MonitoringStats;
}

export default function MonitoringDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Check if monitoring is accessible
  useEffect(() => {
    const isDev = process.env.NODE_ENV === 'development';
    const isEnabled = process.env.NEXT_PUBLIC_ENABLE_MONITORING === 'true';
    
    if (!isDev && !isEnabled) {
      setError('Monitoring dashboard is not accessible in production without NEXT_PUBLIC_ENABLE_MONITORING=true');
      setLoading(false);
      return;
    }

    fetchData();
  }, []);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/monitoring/core-web-vitals');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch data');
      }

      // Calculate stats from events
      const stats = calculateStatsFromEvents(result.events || []);
      
      setData({
        events: result.events || [],
        stats,
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Core Web Vitals Monitor</h1>
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Core Web Vitals Monitor</h1>
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-400 font-semibold mb-2">Error</p>
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Core Web Vitals Monitor</h1>
            <p className="text-gray-400">Internal monitoring dashboard</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg ${
                autoRefresh 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                  : 'bg-gray-800 text-gray-400 border border-gray-700'
              }`}
            >
              {autoRefresh ? '🔄 Auto-refresh ON' : '⏸️ Auto-refresh OFF'}
            </button>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              Refresh Now
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {data && <StatsCards stats={data.stats} />}

        {/* Recent Events Table */}
        {data && <EventsTable events={data.events} />}
      </div>
    </div>
  );
}

function StatsCards({ stats }: { stats: MonitoringStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Total Events"
        value={stats.totalEvents.toString()}
        color="#6366f1"
      />
      
      {/* LCP Stats */}
      <StatCard
        title="Avg LCP"
        value={`${stats.avgLCP}ms`}
        subtitle={`P75: ${stats.p75LCP}ms`}
        color={getRatingColor(getRating('LCP', stats.avgLCP))}
      />
      
      {/* CLS Stats */}
      <StatCard
        title="Avg CLS"
        value={(stats.avgCLS / 1000).toFixed(3)}
        subtitle={`P75: ${(stats.p75CLS / 1000).toFixed(3)}`}
        color={getRatingColor(getRating('CLS', stats.avgCLS / 1000))}
      />
      
      {/* INP Stats - Most Important for This Task */}
      <StatCard
        title="Avg INP"
        value={`${stats.avgINP}ms`}
        subtitle={`P75: ${stats.p75INP}ms`}
        color={getRatingColor(getRating('INP', stats.avgINP))}
        highlight={stats.p75INP > 200}
      />
      
      <StatCard
        title="Good Ratings"
        value={`${stats.goodCount} (${percentage(stats.goodCount, stats.totalEvents)}%)`}
        color="#22c55e"
      />
      <StatCard
        title="Needs Improvement"
        value={`${stats.needsImprovementCount} (${percentage(stats.needsImprovementCount, stats.totalEvents)}%)`}
        color="#f59e0b"
      />
      <StatCard
        title="Poor Ratings"
        value={`${stats.poorCount} (${percentage(stats.poorCount, stats.totalEvents)}%)`}
        color="#ef4444"
      />
      
      {/* P75 INP Target Indicator */}
      <StatCard
        title="P75 INP Target"
        value={stats.p75INP <= 200 ? '✓ Met' : '✗ Not Met'}
        subtitle={`Target: ≤200ms`}
        color={stats.p75INP <= 200 ? '#22c55e' : '#ef4444'}
      />
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  subtitle, 
  color, 
  highlight 
}: { 
  title: string; 
  value: string; 
  subtitle?: string;
  color: string;
  highlight?: boolean;
}) {
  return (
    <div className={`bg-gray-900 border rounded-lg p-6 ${highlight ? 'border-yellow-500 ring-2 ring-yellow-500/50' : 'border-gray-800'}`}>
      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
  );
}

function EventsTable({ events }: { events: VitalEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-400">No events recorded yet</p>
        <p className="text-gray-500 text-sm mt-2">
          Navigate around the site to generate vitals data
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800 border-b border-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                Metric
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                Value
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                Rating
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                URL
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">
                Viewport
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {events.map((event, index) => (
              <tr key={`${event.timestamp}-${index}`} className="hover:bg-gray-800/50">
                <td className="px-4 py-3 text-sm text-gray-300">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="font-mono font-semibold text-indigo-400">
                    {event.metric.name}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {getMetricDescription(event.metric.name)}
                  </p>
                </td>
                <td className="px-4 py-3 text-sm font-mono">
                  {formatMetricValue(event.metric)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className="px-2 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: `${getRatingColor(event.metric.rating)}20`,
                      color: getRatingColor(event.metric.rating),
                    }}
                  >
                    {event.metric.rating}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400 max-w-xs truncate">
                  {new URL(event.url).pathname}
                </td>
                <td className="px-4 py-3 text-sm text-gray-400 font-mono">
                  {event.viewport ? `${event.viewport.width}×${event.viewport.height}` : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper functions
function calculateStatsFromEvents(events: VitalEvent[]): MonitoringStats {
  if (events.length === 0) {
    return {
      totalEvents: 0,
      avgLCP: 0,
      avgCLS: 0,
      avgINP: 0,
      p75LCP: 0,
      p75CLS: 0,
      p75INP: 0,
      goodCount: 0,
      needsImprovementCount: 0,
      poorCount: 0,
      recentEvents: [],
    };
  }

  const lcpValues: number[] = [];
  const clsValues: number[] = [];
  const inpValues: number[] = [];
  
  let goodCount = 0;
  let needsImprovementCount = 0;
  let poorCount = 0;

  events.forEach(event => {
    const { metric } = event;
    
    if (metric.name === 'LCP') lcpValues.push(metric.value);
    if (metric.name === 'CLS') clsValues.push(metric.value * 1000); // Scale for averaging
    if (metric.name === 'INP') inpValues.push(metric.value);
    
    if (metric.rating === 'good') goodCount++;
    else if (metric.rating === 'needs-improvement') needsImprovementCount++;
    else if (metric.rating === 'poor') poorCount++;
  });

  return {
    totalEvents: events.length,
    avgLCP: average(lcpValues),
    avgCLS: average(clsValues), // Keep scaled
    avgINP: average(inpValues),
    p75LCP: percentile(lcpValues, 75),
    p75CLS: percentile(clsValues, 75),
    p75INP: percentile(inpValues, 75),
    goodCount,
    needsImprovementCount,
    poorCount,
    recentEvents: events,
  };
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return Math.round(sorted[Math.max(0, index)] || 0);
}

function percentage(value: number, total: number): string {
  if (total === 0) return '0';
  return ((value / total) * 100).toFixed(1);
}

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  switch (name) {
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
    case 'INP':
      return value <= 200 ? 'good' : value <= 500 ? 'needs-improvement' : 'poor';
    default:
      return 'good';
  }
}
