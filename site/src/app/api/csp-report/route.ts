import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
// EU-first region priority: Frankfurt, Paris, Stockholm, Amsterdam prioritizing NL traffic
export const preferredRegion = ['fra1', 'cdg1', 'arn1', 'ams1'];

// CSP Report-Only 48h Window Started: 2025-09-18T00:00:00Z
// Switch to enforcement after monitoring period ends: 2025-09-20T00:00:00Z
const CSP_MONITORING_START = new Date('2025-09-18T00:00:00Z');
const CSP_MONITORING_END = new Date('2025-09-20T00:00:00Z');

export async function POST(req: NextRequest) {
  try {
    const report = await req.json();
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const now = new Date();
    
    // Enhanced CSP violation logging with 48h window tracking
    const violationData = {
      timestamp: now.toISOString(),
      monitoringWindow: {
        inWindow: now >= CSP_MONITORING_START && now <= CSP_MONITORING_END,
        windowStart: CSP_MONITORING_START.toISOString(),
        windowEnd: CSP_MONITORING_END.toISOString(),
        hoursRemaining: Math.max(0, Math.round((CSP_MONITORING_END.getTime() - now.getTime()) / (1000 * 60 * 60)))
      },
      clientIP,
      userAgent: req.headers.get('user-agent')?.substring(0, 200),
      report: {
        blockedURI: report['blocked-uri'],
        documentURI: report['document-uri'],
        violatedDirective: report['violated-directive'],
        originalPolicy: report['original-policy']?.substring(0, 500),
        sourceFile: report['source-file'],
        lineNumber: report['line-number'],
        columnNumber: report['column-number'],
        disposition: report['disposition'] || 'report'
      }
    };
    
    // Log CSP violation with enhanced monitoring context
    console.warn('CSP Violation Report [48h Window]:', violationData);
    
    // Track specific violation types that may indicate need for unsafe-eval
    const violatedDirective = report['violated-directive'] || '';
    if (violatedDirective.includes('script-src') && report['blocked-uri'] === 'eval') {
      console.warn('⚠️  eval() usage detected - review if unsafe-eval removal is feasible');
    }
    
    // In production during 48h window:
    // 1. Store reports in a database with timestamp
    // 2. Send alerts for critical violations
    // 3. Aggregate reports for analysis
    // 4. Filter out known false positives
    // 5. Generate daily violation summaries
    
    const res = NextResponse.json({ received: true }, { status: 204 });
    res.headers.set('Cache-Control', 'no-store');
    return res;
  } catch (error) {
    console.error('CSP Report parsing error:', error);
    const res = NextResponse.json({ error: 'Invalid report' }, { status: 400 });
    res.headers.set('Cache-Control', 'no-store');
    return res;
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
