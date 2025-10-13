import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "@/lib/rateLimit";

/**
 * Note: Analytics consent is handled client-side via cookie consent system.
 * All analytics utilities in ga.ts check for user consent before making calls.
 * Middleware only handles CSP headers to allow analytics domains but doesn't
 * inject analytics scripts - those are conditionally loaded based on consent.
 */

// Logging counters for monitoring
let blockedUACount = 0;
let rateLimitCount = 0;

// Major search engine crawlers - NEVER block these
const ALLOWED_CRAWLERS = [
  /googlebot/i,
  /bingbot/i,
  /duckduckbot/i,
  /yandexbot/i,
  /applebot/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /slackbot/i,
  /whatsapp/i,
  /telegrambot/i,
  // Vercel bot for deployments
  /vercel-bot/i,
  // Lighthouse and other testing tools
  /lighthouse/i,
  /chrome-lighthouse/i,
  /pagespeed/i,
  // SEO tools that should be allowed
  /screaming\s?frog/i,
  /semrushbot/i,
  /ahrefsbot/i,
];

// Curated malicious bot patterns - more specific than broad substrings
const MALICIOUS_BOT_PATTERNS = [
  // Generic bot indicators (but exclude legitimate crawlers)
  /^(?!.*(googlebot|bingbot|duckduckbot|yandexbot|applebot|facebookexternalhit|twitterbot|linkedinbot|slackbot|whatsapp|telegrambot|vercel-bot|lighthouse|pagespeed|screaming\s?frog|semrushbot|ahrefsbot)).*bot\b/i,
  /^(?!.*(googlebot|bingbot|duckduckbot|yandexbot|applebot)).*crawler\b/i,
  /^(?!.*(googlebot|bingbot|duckduckbot|yandexbot|applebot)).*spider\b/i,
  
  // Scraping tools and automation
  /\b(scraper|scanner|harvester)\b/i,
  /\b(curl|wget|libcurl)\/[\d.]/i, // Block curl/wget with version numbers
  /python-requests(?!\/[\d.]+\s)/i,
  /go-http-client/i,
  /libwww-perl/i,
  /postmanruntime/i,
  /http_request2/i,
  /mechanize/i,
  /scrapy/i,
  
  // Suspicious automation tools
  /\b(selenium|phantomjs|headlesschrome|chromeheadless)\b/i,
  /\b(puppeteer|playwright)\b/i,
  /\b(webdriver|automation)\b/i,
  
  // Known malicious patterns
  /\b(nikto|sqlmap|nmap|masscan|zmap)\b/i,
  /\b(acunetix|nessus|openvas|w3af)\b/i,
  
  // Empty or minimal user agents
  /^[\s\-_.]*$/,
  /^[a-z]{1,3}$/i,
];

const SUSPICIOUS_PATTERNS = [
  /eval\(/i,
  /javascript:/i,
  /<script/i,
  /onload=/i,
  /onclick=/i,
  /\bexec\b/i,
  /\bsystem\b/i,
  /\.\.\/\.\.\//i,
  /\bunion\b.*\bselect\b/i,
];

// Geographic optimization for Dutch users
const DUTCH_IP_RANGES = [
  // Netherlands IP ranges (simplified for example)
  "31.",
  "37.",
  "46.",
  "62.",
  "77.",
  "78.",
  "80.",
  "81.",
  "82.",
  "83.",
  "84.",
  "85.",
  "86.",
  "87.",
  "88.",
  "89.",
  "90.",
  "91.",
  "92.",
  "93.",
  "94.",
  "95.",
  "109.",
  "130.",
  "145.",
  "146.",
  "149.",
  "176.",
  "178.",
  "185.",
  "188.",
  "193.",
  "194.",
  "195.",
  "212.",
  "213.",
  "217.",
];

function getGeographicHint(ip: string, countryHeader?: string): string {
  // Check if IP appears to be from Netherlands
  if (DUTCH_IP_RANGES.some((range) => ip.startsWith(range))) {
    return "nl";
  }

  // Check country header from CDN
  if (countryHeader) {
    const country = countryHeader.toLowerCase();
    if (country === "nl" || country === "netherlands") return "nl";
    if (["de", "be", "fr", "uk", "gb"].includes(country)) return "eu";
  }

  return "global";
}

function getClientIP(req: NextRequest): string {
  // Check various headers for real IP
  const xForwardedFor = req.headers.get("x-forwarded-for");
  const xRealIp = req.headers.get("x-real-ip");
  const cfConnectingIp = req.headers.get("cf-connecting-ip");

  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  if (xRealIp) return xRealIp;
  if (cfConnectingIp) return cfConnectingIp;

  return req.ip || "unknown";
}

async function isRateLimitedEdge(ip: string, path: string): Promise<boolean> {
  try {
    const key = `${ip}:${path.startsWith("/api/") ? "api" : "html"}`;
    const { success } = await rateLimiter.limit(key);
    return !success;
  } catch (error) {
    // If rate limiting fails, allow the request to proceed
    console.warn("Rate limiting error:", error);
    return false;
  }
}

function isAllowedCrawler(userAgent: string): boolean {
  if (!userAgent) return false;
  return ALLOWED_CRAWLERS.some((pattern) => pattern.test(userAgent));
}

function isMaliciousBot(userAgent: string): boolean {
  if (!userAgent) return true; // No user agent is suspicious
  
  // First check if it's an allowed crawler
  if (isAllowedCrawler(userAgent)) {
    return false;
  }
  
  // Then check against malicious patterns
  return MALICIOUS_BOT_PATTERNS.some((pattern) => pattern.test(userAgent));
}

function detectBot(userAgent: string): boolean {
  const isMalicious = isMaliciousBot(userAgent);
  
  if (isMalicious) {
    blockedUACount++;
    
    // Log blocked UA (anonymized in production)
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Bot detected and blocked: ${userAgent}`);
    } else {
      console.warn(`Bot blocked. Total blocked UAs: ${blockedUACount}`);
    }
  }
  
  return isMalicious;
}

function detectSuspiciousContent(req: NextRequest): boolean {
  const url = req.nextUrl.toString();
  const userAgent = req.headers.get("user-agent") || "";

  // Check URL for suspicious patterns
  if (SUSPICIOUS_PATTERNS.some((pattern) => pattern.test(url))) {
    return true;
  }

  // Check User-Agent for suspicious patterns
  if (SUSPICIOUS_PATTERNS.some((pattern) => pattern.test(userAgent))) {
    return true;
  }

  // Check for common attack vectors
  const searchParams = req.nextUrl.searchParams.toString();
  if (SUSPICIOUS_PATTERNS.some((pattern) => pattern.test(searchParams))) {
    return true;
  }

  return false;
}

function validateRequest(req: NextRequest): {
  valid: boolean;
  reason?: string;
} {
  const userAgent = req.headers.get("user-agent") || "";
  const referer = req.headers.get("referer");
  const origin = req.headers.get("origin");

  // Check for missing critical headers on POST requests
  if (req.method === "POST") {
    if (!origin && !referer) {
      return { valid: false, reason: "Missing origin and referer headers" };
    }

    // Validate origin for API requests
    if (req.nextUrl.pathname.startsWith("/api/")) {
      const allowedOrigins = [
        (
          process.env.SITE_URL ??
          process.env.NEXT_PUBLIC_SITE_URL ??
          "http://localhost:3000"
        ).replace(/\/+$/, ""),
        "https://prowebstudio.nl",
        "https://www.prowebstudio.nl",
      ];
      // Allow Vercel preview deployments
      const isVercelPreview = origin?.endsWith(".vercel.app");
      // Allow localhost on any port for development
      const isLocalhost =
        origin?.startsWith("http://localhost:") ||
        origin?.startsWith("https://localhost:");

      if (
        origin &&
        !isVercelPreview &&
        !isLocalhost &&
        !allowedOrigins.includes(origin)
      ) {
        return { valid: false, reason: "Invalid origin" };
      }
    }
  }

  // Check User-Agent length (too short or too long is suspicious)
  // Allow legitimate crawlers through even with short UAs
  if (!isAllowedCrawler(userAgent) && (userAgent.length < 10 || userAgent.length > 1000)) {
    return { valid: false, reason: "Suspicious user agent length" };
  }
  
  // Remove legacy browser version checks - modern browsers handle this automatically
  // Focus on detecting actual malicious patterns rather than old browser versions

  return { valid: true };
}

function createMiddlewareHeaders(
  nonce: string,
  geoHint: string,
  ip: string,
): Record<string, string> {
  return {
    // Nonce for inline scripts (unique per request)
    // Used to enhance CSP by allowing specific inline scripts
    "X-Nonce": nonce,
    // Geographic hint for performance optimization
    "X-Geographic-Hint": geoHint,
    // Edge region selection based on geography
    "X-Edge-Region":
      geoHint === "nl" ? "lhr1" : geoHint === "eu" ? "fra1" : "cdg1",
    // Client IP for logging (already anonymized by proxy)
    "X-Client-IP": ip,
    // Monitoring metrics
    "X-Blocked-UA-Count": blockedUACount.toString(),
    "X-Rate-Limit-Count": rateLimitCount.toString(),
  };
}

// Export metrics for monitoring (optional endpoint)
export function getMiddlewareMetrics() {
  return {
    blockedUserAgents: blockedUACount,
    rateLimitHits: rateLimitCount,
    timestamp: new Date().toISOString(),
  };
}

export async function middleware(req: NextRequest) {
  const ip = getClientIP(req);
  const path = req.nextUrl.pathname;
  const userAgent = req.headers.get("user-agent") || "";
  const country =
    req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry");

  // Skip middleware for static files and Next.js internals
  if (
    path.startsWith("/_next/") ||
    path.startsWith("/static/") ||
    (path.includes(".") && !path.includes("/api/"))
  ) {
    return NextResponse.next();
  }

  // Route Canonicalization - Redirect /locatie/ to /locaties/
  if (path.startsWith("/locatie/")) {
    const url = req.nextUrl.clone();
    url.pathname = path.replace("/locatie/", "/locaties/");
    return NextResponse.redirect(url, 301); // Permanent redirect
  }

  // Geographic optimization hints
  const geoHint = getGeographicHint(ip, country || undefined);

  // 1. Bot Detection - Only block malicious bots, allow legitimate crawlers
  const isMaliciousBotDetected = detectBot(userAgent);
  if (isMaliciousBotDetected && !path.startsWith("/api/")) {
    // Block malicious bots from sensitive areas
    if (path.includes("admin") || path.includes("dashboard")) {
      if (path.startsWith("/api/")) {
        return NextResponse.json(
          { ok: false, error: "Access Denied" },
          { status: 403 },
        );
      }
      return new NextResponse("Access Denied", { status: 403 });
    }
    
    // Block malicious bots from all pages to prevent scraping abuse
    if (path.startsWith("/api/")) {
      return NextResponse.json(
        { ok: false, error: "Bot Access Denied" },
        { status: 403 },
      );
    }
    return new NextResponse("Bot Access Denied", { status: 403 });
  }

  // 2. Suspicious Content Detection
  if (detectSuspiciousContent(req)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Suspicious request blocked: ${ip} ${path}`);
    } else {
      console.warn("Suspicious request blocked");
    }

    if (path.startsWith("/api/")) {
      return NextResponse.json(
        { ok: false, error: "Bad Request" },
        { status: 400 },
      );
    }
    return new NextResponse("Bad Request", { status: 400 });
  }

  // 3. Request Validation
  const validation = validateRequest(req);
  if (!validation.valid) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `Invalid request blocked: ${ip} ${path} - ${validation.reason}`,
      );
    } else {
      console.warn("Invalid request blocked");
    }

    if (path.startsWith("/api/")) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 4. Rate Limiting
  if (await isRateLimitedEdge(ip, path)) {
    rateLimitCount++;
    
    if (process.env.NODE_ENV !== "production") {
      console.warn(`Rate limit exceeded: ${ip} ${path}`);
    } else {
      console.warn(`Rate limit exceeded. Total 429s: ${rateLimitCount}`);
    }

    const headers = {
      "Retry-After": "10", // 10 seconds
      "X-RateLimit-Limit": "100",
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": (Date.now() + 10000).toString(),
    };

    if (path.startsWith("/api/")) {
      return NextResponse.json(
        { ok: false, error: "Too Many Requests" },
        { status: 429, headers },
      );
    }

    return new NextResponse("Too Many Requests", {
      status: 429,
      headers,
    });
  }

  // 5. Generate nonce for CSP
  const nonce =
    globalThis.crypto && "randomUUID" in globalThis.crypto
      ? globalThis.crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  // 6. Set nonce on request headers for components to access
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("X-Nonce", nonce);
  requestHeaders.set("X-Geographic-Hint", geoHint);
  requestHeaders.set("X-Client-IP", ip);

  // 7. Create response with enhanced request headers
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  const middlewareHeaders = createMiddlewareHeaders(nonce, geoHint, ip);

  // Apply middleware-specific headers only
  Object.entries(middlewareHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Enhanced caching for Dutch users (performance optimization)
  if (geoHint === "nl" && !path.startsWith("/api/")) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=7200, s-maxage=86400, stale-while-revalidate=3600",
    );
    response.headers.set("X-Cache-Strategy", "dutch-optimized");
  }

  // 8. Enhanced CSP with nonce injection for pages requiring inline scripts
  // Note: Base CSP is handled in next.config.mjs, this enhances it with nonce
  if (path === "/contact") {
    const cspReportOnly = process.env.CSP_REPORT_ONLY === "true";
    const cspHeaderName = cspReportOnly
      ? "Content-Security-Policy-Report-Only"
      : "Content-Security-Policy";

    const cspValue = [
      "default-src 'self'",
      // Enhanced script-src with nonce for inline scripts
      `script-src 'self' 'nonce-${nonce}' https://plausible.io https://va.vercel-scripts.com https://www.google.com https://www.gstatic.com https://js.cal.com`,
      `script-src-elem 'self' 'nonce-${nonce}' https://plausible.io https://va.vercel-scripts.com https://www.google.com https://www.gstatic.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "media-src 'self' https:",
      "frame-src 'self' https://www.google.com https://cal.com https://app.cal.com",
      "connect-src 'self' https://plausible.io https://vitals.vercel-insights.com https://va.vercel-scripts.com https://api.cal.com",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "upgrade-insecure-requests",
      "report-uri /api/csp-report",
    ].join("; ");

    response.headers.set(cspHeaderName, cspValue);
  }

  // 8. Apply X-Robots-Tag for speeltuin route and error pages
  if (path === "/speeltuin" || path.startsWith("/speeltuin/")) {
    response.headers.set("X-Robots-Tag", "noindex, follow");
  }

  // Apply X-Robots-Tag for error pages (404, 500, etc.)
  if (
    path === "/not-found" ||
    path === "/error" ||
    path.includes("/_error") ||
    (req.nextUrl.searchParams.has("error") &&
      req.nextUrl.searchParams.get("error"))
  ) {
    response.headers.set(
      "X-Robots-Tag",
      "noindex, nofollow, nocache, nosnippet, noarchive, noimageindex",
    );
  }

  // Apply X-Robots-Tag for preview deployments
  const host = req.headers.get("host") || "";
  const isProdHost = /(^|\.)prowebstudio\.nl$/i.test(host);
  if (process.env.VERCEL_ENV === "preview" && !isProdHost) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  // Note: All security headers (HSTS, CSP, X-Content-Type-Options, etc.) are now
  // centralized in next.config.mjs under async headers() for single source of truth
  // Middleware only handles: nonce generation, rate limiting, X-Robots-Tag, and geo hints

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.*\\.xml|manifest.json|sw.js|assets|fonts|images|api/csp-report).*)",
  ],
};
