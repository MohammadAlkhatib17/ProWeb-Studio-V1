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
      const allowedOrigins = [
        process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'https://prowebstudio.nl',
        'https://www.prowebstudio.nl'
      ];
      // Allow Vercel preview deployments
      const isVercelPreview = origin?.endsWith('.vercel.app');
      
      if (origin && !isVercelPreview && !allowedOrigins.includes(origin)) {
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

function createSecurityHeaders(nonce: string): Record<string, string> {
  return {
    // Nonce for inline scripts (unique per request)
    // Used in CSP when switching from Report-Only to Enforce mode
    // When enforced CSP is activated, this nonce will be used in:
    // - script-src directive: "script-src 'self' 'nonce-{nonce}' ..."
    // - Inline script tags: <script nonce="{nonce}">...</script>
    // This replaces 'unsafe-inline' directive for improved security
    'X-Nonce': nonce
  };
}

export async function middleware(req: NextRequest) {
  const ip = getClientIP(req);
  const path = req.nextUrl.pathname;
  const userAgent = req.headers.get('user-agent') || '';
  
  // Skip middleware for static files and Next.js internals
  if (
    path.startsWith('/_next/') ||
    path.startsWith('/static/') ||
    path.includes('.') && !path.includes('/api/')
  ) {
    return NextResponse.next();
  }

  // 1. Bot Detection
  if (detectBot(userAgent) && !path.startsWith('/api/')) {
    // Allow bots for SEO but block from sensitive areas
    if (path.includes('admin') || path.includes('dashboard')) {
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
    return new NextResponse('Unauthorized', { status: 401 });
  }
  
  // 4. Rate Limiting
  if (await isRateLimitedEdge(ip, path)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Rate limit exceeded: ${ip} ${path}`);
    } else {
      console.warn('Rate limit exceeded');
    }
    return new NextResponse('Too Many Requests', { 
      status: 429,
      headers: {
        'Retry-After': '10', // 10 seconds
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': (Date.now() + 10000).toString()
      }
    });
  }
  
  // 5. Generate nonce for CSP
  const nonce = (globalThis.crypto && 'randomUUID' in globalThis.crypto)
    ? globalThis.crypto.randomUUID()
    : Math.random().toString(36).slice(2);
  
  // 6. Set nonce on request headers for components to access
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('X-Nonce', nonce);
  
  // 7. Apply Security Headers
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  const securityHeaders = createSecurityHeaders(nonce);
  
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // 7. Apply Contact-specific CSP with nonce
  if (path === '/contact') {
    const cspValue = [
      "default-src 'self'",
      // ENFORCED: Using nonces for inline scripts - no unsafe-inline or unsafe-eval
      `script-src 'self' 'nonce-${nonce}' https://www.google.com https://www.gstatic.com https://www.googletagmanager.com https://js.cal.com https://plausible.io https://va.vercel-scripts.com`,
      `script-src-elem 'self' 'nonce-${nonce}' https://www.google.com https://www.gstatic.com https://plausible.io https://va.vercel-scripts.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "media-src 'self' https:",
      "frame-src 'self' https://www.google.com https://cal.com https://app.cal.com",
      "connect-src 'self' https://api.cal.com https://www.google-analytics.com https://plausible.io https://vitals.vercel-insights.com https://va.vercel-scripts.com",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ');
    
    response.headers.set('Content-Security-Policy', cspValue);
    response.headers.set('Expect-CT', 'max-age=86400, enforce');
    response.headers.set('X-Content-Type-Options', 'nosniff');
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
