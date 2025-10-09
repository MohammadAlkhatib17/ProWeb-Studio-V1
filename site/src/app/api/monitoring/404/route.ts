/**
 * 404 Monitoring API endpoint
 * Handles tracking and analysis of 404 errors
 */

import { NextRequest, NextResponse } from 'next/server';
import { notFoundMonitor } from '@/lib/monitoring/not-found';


interface NotFoundRequest {
  url: string;
  referrer?: string;
  userAgent?: string;
  timestamp: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: NotFoundRequest = await request.json();
    
    if (!body.url || !body.timestamp) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get client IP
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Record the 404
    notFoundMonitor.record404(
      body.url,
      body.referrer,
      body.userAgent,
      ip
    );

    return NextResponse.json({
      success: true,
      data: { recorded: true },
      timestamp: Date.now(),
    });

  } catch (error) {
    console.error('404 monitoring API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');
    const url = searchParams.get('url');

    if (url) {
      // Get suggestions for a specific URL
      const suggestions = await notFoundMonitor.generateRedirectSuggestions(url);
      
      return NextResponse.json({
        success: true,
        data: { suggestions },
        timestamp: Date.now(),
      });
    } else {
      // Get analytics
      const analytics = notFoundMonitor.getAnalytics(days);
      
      return NextResponse.json({
        success: true,
        data: analytics,
        timestamp: Date.now(),
      });
    }

  } catch (error) {
    console.error('404 analytics API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}