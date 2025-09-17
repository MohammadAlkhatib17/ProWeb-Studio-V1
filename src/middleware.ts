import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const url = request.nextUrl;

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Cache headers for static assets
  if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|woff2?|ttf|eot)$/i)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Cache headers for CSS and JS
  if (url.pathname.match(/\.(css|js)$/i)) {
    response.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
  }

  // Cache headers for HTML pages
  if (!url.pathname.startsWith('/api')) {
    response.headers.set('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
  }

  // Add performance timing header
  response.headers.set('Server-Timing', `middleware;dur=${Date.now() - request.headers.get('x-middleware-start-time') || 0}`);

  return response;
}
