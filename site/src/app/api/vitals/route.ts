import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
// EU-first region priority: Amsterdam (for Dutch users), Frankfurt, Paris, Stockholm
export const preferredRegion = ['ams1', 'fra1', 'cdg1', 'arn1'];

interface WebVitalMetric {
  name: string;
  value: number;
  id: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  navigationType?: string;
}

export async function POST(request: NextRequest) {
  try {
    const metric: WebVitalMetric = await request.json();
    
    // Early return if no Plausible domain configured
    const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
    if (!plausibleDomain) {
      const response = NextResponse.json({ success: true });
      response.headers.set('Cache-Control', 'no-store');
      return response;
    }

    // Send to Plausible as custom event
    const plausibleUrl = 'https://plausible.io/api/event';
    
    await fetch(plausibleUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('user-agent') || '',
      },
      body: JSON.stringify({
        domain: plausibleDomain,
        name: 'Web Vital',
        url: request.headers.get('referer') || '',
        props: {
          metric: metric.name,
          value: Math.round(metric.value),
          rating: metric.rating,
        },
      }),
    }).catch(() => {
      // Silently fail - don't throw errors for analytics
    });

    const response = NextResponse.json({ success: true });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch {
    // Silently handle errors to avoid affecting user experience
    const response = NextResponse.json({ success: true });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  }
}