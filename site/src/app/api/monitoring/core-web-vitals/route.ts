/**
 * API endpoint for Core Web Vitals monitoring
 * POST: Store vital event
 * GET: Retrieve recent events (protected)
 */

import { NextRequest, NextResponse } from 'next/server';
import { addVitalEvent, getVitalEvents, getAllVitalEvents } from '@/lib/monitoring/storage';
import { calculateStats } from '@/lib/monitoring/utils';
import type { VitalEvent } from '@/lib/monitoring/types';

// Node.js runtime for storage operations (see docs/ADR-runtime.md)
export const runtime = 'nodejs';
export const preferredRegion = ['cdg1', 'lhr1', 'fra1'];

/**
 * POST - Store a vital event
 */
export async function POST(request: NextRequest) {
  try {
    // Only accept monitoring data if enabled
    const isEnabled = process.env.NEXT_PUBLIC_ENABLE_MONITORING === 'true' || 
                     process.env.NODE_ENV === 'development';
    
    if (!isEnabled) {
      return NextResponse.json(
        { success: false, error: 'Monitoring not enabled' },
        { status: 403 }
      );
    }

    const event: VitalEvent = await request.json();
    
    // Basic validation
    if (!event.metric || !event.timestamp || !event.url) {
      return NextResponse.json(
        { success: false, error: 'Invalid event data' },
        { status: 400 }
      );
    }

    // Store the event
    addVitalEvent(event);

    return NextResponse.json(
      { success: true, timestamp: event.timestamp },
      { 
        status: 200,
        headers: { 'Cache-Control': 'no-store' }
      }
    );
  } catch (error) {
    console.error('Error storing vital event:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET - Retrieve recent events and stats (protected endpoint)
 */
export async function GET(request: NextRequest) {
  try {
    // Protect endpoint - only accessible in development or with auth token
    const isDevMode = process.env.NODE_ENV === 'development';
    const authToken = request.headers.get('authorization');
    const expectedToken = process.env.MONITORING_AUTH_TOKEN;
    
    const isAuthorized = isDevMode || 
                        (expectedToken && authToken === `Bearer ${expectedToken}`);
    
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const statsOnly = searchParams.get('stats') === 'true';

    if (statsOnly) {
      // Return only statistics
      const allEvents = getAllVitalEvents();
      const stats = calculateStats(allEvents);
      return NextResponse.json(
        { success: true, stats },
        { headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // Return recent events
    const events = getVitalEvents(limit);
    
    return NextResponse.json(
      { success: true, events, count: events.length },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Error retrieving vital events:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
