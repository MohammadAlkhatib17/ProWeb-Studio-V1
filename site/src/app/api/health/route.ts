import { NextResponse } from 'next/server';

// Edge runtime for simple health check API (see docs/ADR-runtime.md)
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const preferredRegion = ['cdg1', 'lhr1', 'fra1'];

export async function GET() {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    region: process.env.VERCEL_REGION || 'unknown',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime?.() || 0,
    memory: process.memoryUsage?.() || {},
    performance: {
      timeToFirstByte: Date.now(),
      edge: true
    }
  };

  const response = NextResponse.json(healthData, { status: 200 });
  
  // Short cache for health checks
  response.headers.set('Cache-Control', 'public, max-age=30, s-maxage=60');
  response.headers.set('X-Health-Check', 'true');
  
  return response;
}

export async function HEAD() {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Cache-Control', 'public, max-age=30, s-maxage=60');
  response.headers.set('X-Health-Check', 'true');
  return response;
}