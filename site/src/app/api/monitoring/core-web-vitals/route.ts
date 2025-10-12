/**
 * Core Web Vitals API endpoint
 * Handles collection and analysis of performance metrics
 */

import { NextRequest, NextResponse } from "next/server";
import { webVitalsMonitor } from "@/lib/monitoring/core-web-vitals";
import type { CoreWebVitalsMetrics } from "@/lib/monitoring/types";

interface WebVitalsRequest {
  metrics: CoreWebVitalsMetrics;
  timestamp: number;
  sessionId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: WebVitalsRequest = await request.json();

    if (!body.metrics || !body.sessionId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate metrics
    const { metrics } = body;
    if (!metrics.url || !metrics.timestamp) {
      return NextResponse.json(
        { success: false, error: "Invalid metrics data" },
        { status: 400 },
      );
    }

    // Store metrics
    const performanceMonitor = webVitalsMonitor["performanceMonitor"];
    performanceMonitor.recordMetric(metrics);

    // Check for performance alerts
    const alerts = performanceMonitor.checkThresholds(metrics);

    // Generate recommendations
    const recommendations =
      webVitalsMonitor.getPerformanceRecommendations(metrics);

    return NextResponse.json({
      success: true,
      data: {
        recorded: true,
        alerts: alerts.length,
        recommendations: recommendations.length,
      },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Core Web Vitals API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const days = parseInt(searchParams.get("days") || "7");

    if (!url) {
      return NextResponse.json(
        { success: false, error: "URL parameter is required" },
        { status: 400 },
      );
    }

    const performanceMonitor = webVitalsMonitor["performanceMonitor"];
    const metrics = performanceMonitor.getMetrics(url, days);

    if (metrics.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          metrics: [],
          summary: null,
        },
        timestamp: Date.now(),
      });
    }

    // Calculate summary statistics
    const summary = {
      totalSamples: metrics.length,
      averageMetrics: {
        lcp: metrics.reduce((sum, m) => sum + m.lcp, 0) / metrics.length,
        fid: metrics.reduce((sum, m) => sum + m.fid, 0) / metrics.length,
        cls: metrics.reduce((sum, m) => sum + m.cls, 0) / metrics.length,
        ttfb: metrics.reduce((sum, m) => sum + m.ttfb, 0) / metrics.length,
      },
      trends: generateTrends(metrics),
    };

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        summary,
      },
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Core Web Vitals GET API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

function generateTrends(metrics: CoreWebVitalsMetrics[]) {
  // Sort by timestamp
  const sorted = metrics.sort((a, b) => a.timestamp - b.timestamp);

  return {
    lcp: sorted.map((m) => ({ timestamp: m.timestamp, value: m.lcp })),
    fid: sorted.map((m) => ({ timestamp: m.timestamp, value: m.fid })),
    cls: sorted.map((m) => ({ timestamp: m.timestamp, value: m.cls })),
    ttfb: sorted.map((m) => ({ timestamp: m.timestamp, value: m.ttfb })),
  };
}
