import { NextRequest, NextResponse } from 'next/server';

import { rateLimiter } from '@/lib/rateLimit';

// Bot detection patterns
const BOT_USER_AGENTS = [
  'bot', 'crawler', 'spider', 'scraper', 'scanner', 'curl', 'wget',
  'python-requests', 'go-http-client', 'libwww-perl', 'postmanruntime'
];

const SUSPICIOUS_PATTERNS = [
  /eval\(/i, /javascript:/i, /<script/i, /onload=/i, /onclick=/i,
  /\bexec\b/i, /\bsystem\b/i, /\.\.\/\.\.\//i, /\bunion\b.*\bselect\b/i
];

// Geographic optimization for Dutch users
const DUTCH_IP_RANGES = [
  // Netherlands IP ranges (simplified for example)
  '31.', '37.', '46.', '62.', '77.', '78.', '80.', '81.', '82.', '83.',
  '84.', '85.', '86.', '87.', '88.', '89.', '90.', '91.', '92.', '93.',
  '94.', '95.', '109.', '130.', '145.', '146.', '149.', '176.', '178.',
  '185.', '188.', '193.', '194.', '195.', '212.', '213.', '217.'
];

function getGeographicHint(ip: string, countryHeader?: string): string {
  // Check if IP appears to be from Netherlands
  if (DUTCH_IP_RANGES.some(range => ip.startsWith(range))) {
    return 'nl';
  }
  
  // Check country header from CDN
  if (countryHeader) {
    const country = countryHeader.toLowerCase();
    if (country === 'nl' || country === 'netherlands') return 'nl';
    if (['de', 'be', 'fr', 'uk', 'gb'].includes(country)) return 'eu';
  }
  
  return 'global';
}

function getClientIP(req: NextRequest): string {
  // Check various headers for real IP
  const xForwardedFor = req.headers.get('x-forwarded-for');
  const xRealIp = req.headers.get('x-real-ip');
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  if (xRealIp) return xRealIp;
  if (cfConnectingIp) return cfConnectingIp;
  
  return req.ip || 'unknown';
}

async function isRateLimitedEdge(ip: string, path: string) {
  const key = `${ip}:${path.startsWith('/api/') ? 'api' : 'html'}`;
  const { success } = await rateLimiter.limit(key);
  return !success;
}

function detectBot(userAgent: string): boolean {
  if (!userAgent) return true; // No user agent is suspicious
  
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
}

function detectSuspiciousContent(req: NextRequest): boolean {
  const url = req.nextUrl.toString();
  const userAgent = req.headers.get('user-agent') || '';
  
  // Check URL for suspicious patterns
  if (SUSPICIOUS_PATTERNS.some(pattern => pattern.test(url))) {
    return true;
  }
  
  // Check User-Agent for suspicious patterns
  if (SUSPICIOUS_PATTERNS.some(pattern => pattern.test(userAgent))) {
    return true;
  }
  
  // Check for common attack vectors
  const searchParams = req.nextUrl.searchParams.toString();
  if (SUSPICIOUS_PATTERNS.some(pattern => pattern.test(searchParams))) {
    return true;
  }
  
  return false;
}

function validateRequest(req: NextRequest): { valid: boolean; reason?: string } {
  const userAgent = req.headers.get('user-agent') || '';
  const referer = req.headers.get('referer');
  const origin = req.headers.get('origin');
  
  // Check for missing critical headers on POST requests
  if (req.method === 'POST') {
    if (!origin && !referer) {
      return { valid: false, reason: 'Missing origin and referer headers' };
    }
    
    // Validate origin for API requests
    if (req.nextUrl.pathname.startsWith('/api/')) {
      const siteUrl = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/+$/, '');
      const allowedOrigins = [
        siteUrl,
      ];
      // Allow Vercel preview deployments
      const isVercelPreview = origin?.endsWith('.vercel.app');
      // Allow localhost on any port for development
      const isLocalhost = origin?.startsWith('http://localhost:') || origin?.startsWith('https://localhost:');
      
      if (origin && !isVercelPreview && !isLocalhost && !allowedOrigins.includes(origin)) {
        return { valid: false, reason: 'Invalid origin' };
      }
    }
  }
  
  // Check User-Agent length (too short or too long is suspicious)
  if (userAgent.length < 10 || userAgent.length > 500) {
    return { valid: false, reason: 'Suspicious user agent length' };
  }
  
  return { valid: true };
}

// Removed createSecurityHeaders - nonce now handled directly in CSP header

export async function middleware(req: NextRequest) {
  const ip = getClientIP(req);
  const path = req.nextUrl.pathname;
  const userAgent = req.headers.get('user-agent') || '';
  const country = req.headers.get('x-vercel-ip-country') || req.headers.get('cf-ipcountry');
  
  // Skip middleware for static files and Next.js internals
  if (
    path.startsWith('/_next/') ||
    path.startsWith('/static/') ||
    path.includes('.') && !path.includes('/api/')
  ) {
    return NextResponse.next();
  }

  // Geographic optimization hints
  const geoHint = getGeographicHint(ip, country || undefined);
  
  // 1. Bot Detection
  if (detectBot(userAgent) && !path.startsWith('/api/')) {
    // Allow bots for SEO but block from sensitive areas
    if (path.includes('admin') || path.includes('dashboard')) {
      if (path.startsWith('/api/')) {
        return NextResponse.json(
          { ok: false, error: 'Access Denied' },
          { status: 403 }
        );
      }
      return new NextResponse('Access Denied', { status: 403 });
    }
  }
  
  // 2. Suspicious Content Detection
  if (detectSuspiciousContent(req)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Suspicious request blocked: ${ip} ${path}`);
    } else {
      console.warn('Suspicious request blocked');
    }
    
    if (path.startsWith('/api/')) {
      return NextResponse.json(
        { ok: false, error: 'Bad Request' },
        { status: 400 }
      );
    }
    return new NextResponse('Bad Request', { status: 400 });
  }
  
  // 3. Request Validation
  const validation = validateRequest(req);
  if (!validation.valid) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Invalid request blocked: ${ip} ${path} - ${validation.reason}`);
    } else {
      console.warn('Invalid request blocked');
    }
    
    if (path.startsWith('/api/')) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return new NextResponse('Unauthorized', { status: 401 });
  }
  
  // 4. Rate Limiting
  if (await isRateLimitedEdge(ip, path)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Rate limit exceeded: ${ip} ${path}`);
    } else {
      console.warn('Rate limit exceeded');
    }
    
    const headers = {
      'Retry-After': '10', // 10 seconds
      'X-RateLimit-Limit': '100',
      'X-RateLimit-Remaining': '0',
      'X-RateLimit-Reset': (Date.now() + 10000).toString()
    };
    
    if (path.startsWith('/api/')) {
      return NextResponse.json(
        { ok: false, error: 'Too Many Requests' },
        { status: 429, headers }
      );
    }
    
    return new NextResponse('Too Many Requests', { 
      status: 429,
      headers
    });
  }
  
  // 5. Generate cryptographically secure nonce for CSP
  const nonceBytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(nonceBytes);
  const nonce = btoa(String.fromCharCode(...nonceBytes));
  
  // 6. Set nonce on request headers for components to access
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('X-Geographic-Hint', geoHint);
  requestHeaders.set('X-Client-IP', ip);
  
  // 7. Build strict CSP with nonce + strict-dynamic
  const isDev = process.env.NODE_ENV === 'development';
  const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || '';
  
  // CSP Report-Only Mode: Oct 19-26, 2025 (7 days monitoring)
  // After validation, switch to enforcement by changing header name
  const cspMonitoringStart = new Date('2025-10-19T00:00:00Z');
  const cspMonitoringEnd = new Date('2025-10-26T00:00:00Z');
  const now = new Date();
  const isMonitoringPhase = now >= cspMonitoringStart && now <= cspMonitoringEnd;
  
  const cspDirectives = [
    "default-src 'self'",
    // script-src: nonce + strict-dynamic; minimal whitelisted domains
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://plausible.io${isDev ? " 'unsafe-eval'" : ''}`,
    // style-src: nonce + unsafe-inline fallback for older browsers
    `style-src 'self' 'nonce-${nonce}' 'unsafe-inline' https://fonts.googleapis.com`,
    // img-src: allow data URIs and HTTPS images for OG/analytics
    "img-src 'self' data: https: blob:",
    // font-src: Google Fonts CDN
    "font-src 'self' https://fonts.gstatic.com data:",
    // connect-src: API endpoints and analytics
    `connect-src 'self' https://plausible.io https://vitals.vercel-insights.com${isDev ? ' ws://localhost:*' : ''}`,
    "media-src 'self' https: blob:",
    "object-src 'none'",
    "base-uri 'self'",
    // frame-ancestors: prevent clickjacking
    "frame-ancestors 'none'",
    "frame-src 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ];
  
  // Add CSP reporting endpoint
  if (siteUrl) {
    cspDirectives.push(`report-uri ${siteUrl}/api/csp-report`);
  }
  
  const cspValue = cspDirectives.join('; ');
  
  // 8. Apply Security Headers with CSP
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  
  // CSP Mode Selection: Report-Only for 7 days, then Enforce
  // CHANGE THIS LINE after monitoring period to enforce:
  // response.headers.set('Content-Security-Policy', cspValue);
  if (isMonitoringPhase) {
    response.headers.set('Content-Security-Policy-Report-Only', cspValue);
  } else {
    // After Oct 26, 2025: switch to enforcement
    response.headers.set('Content-Security-Policy', cspValue);
  }
  
  response.headers.set('x-nonce', nonce);
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // Add geographic and performance headers
  response.headers.set('X-Geographic-Hint', geoHint);
  response.headers.set('X-Edge-Region', geoHint === 'nl' ? 'lhr1' : geoHint === 'eu' ? 'fra1' : 'cdg1');
  
  // Enhanced caching for Dutch users
  if (geoHint === 'nl' && !path.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'public, max-age=7200, s-maxage=86400, stale-while-revalidate=3600');
    response.headers.set('X-Cache-Strategy', 'dutch-optimized');
  }
  
  // 8. Apply X-Robots-Tag for speeltuin route and error pages
  if (path === '/speeltuin' || path.startsWith('/speeltuin/')) {
    response.headers.set('X-Robots-Tag', 'noindex, follow');
  }
  
  // Apply X-Robots-Tag for error pages (404, 500, etc.)
  if (path === '/not-found' || path === '/error' || path.includes('/_error') || 
      (req.nextUrl.searchParams.has('error') && req.nextUrl.searchParams.get('error'))) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, nocache, nosnippet, noarchive, noimageindex');
  }
  
  // Apply X-Robots-Tag for preview deployments
  const host = req.headers.get('host') || '';
  const isProdHost = /(^|\.)prowebstudio\.nl$/i.test(host);
  if (process.env.VERCEL_ENV === 'preview' && !isProdHost) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  
  // Note: API headers (X-API-Version, Cache-Control, Pragma, Expires) are now
  // exclusively handled in next.config.mjs under async headers() for /api/:path*
  // to avoid duplication and ensure single source of truth
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|sw.js|assets|fonts|images|api/csp-report).*)',
  ],
};
