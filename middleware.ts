import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { normalizeUrl } from './utils/urlUtils';

// Redirect map for old URLs to new URLs
const redirectMap: Record<string, string> = {
  '/Over-Ons': '/over-ons',
  '/over_ons': '/over-ons',
  '/Diensten': '/diensten',
  '/Portfolio': '/portfolio',
  '/portfolio/WebDesign': '/portfolio/web-design',
  '/Contact': '/contact',
  '/Werkwijze': '/werkwijze',
  '/Blog': '/blog',
  '/blog/SEO_Tips': '/blog/seo-tips',
  '/Prijzen': '/prijzen',
  // Add more redirects as needed
};

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  
  // Check if URL needs redirect from redirect map
  if (redirectMap[pathname]) {
    const url = request.nextUrl.clone();
    url.pathname = redirectMap[pathname];
    return NextResponse.redirect(url, 301);
  }
  
  // Check if URL contains uppercase letters or underscores
  if (pathname !== pathname.toLowerCase() || pathname.includes('_')) {
    const url = request.nextUrl.clone();
    url.pathname = normalizeUrl(pathname);
    return NextResponse.redirect(url, 301);
  }
  
  // Remove trailing slash except for homepage
  if (pathname !== '/' && pathname.endsWith('/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url, 301);
  }
  
  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Add cache headers for static assets
  if (request.nextUrl.pathname.match(/\.(ico|jpg|jpeg|png|gif|webp|svg)$/)) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  }
  
  // Add stale-while-revalidate for HTML pages
  if (!request.nextUrl.pathname.startsWith('/api')) {
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400'
    );
  }
  
  // Add Vercel-specific headers for edge caching
  response.headers.set('x-vercel-cache', 'HIT');
  response.headers.set('x-vercel-region', 'ams1');
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
