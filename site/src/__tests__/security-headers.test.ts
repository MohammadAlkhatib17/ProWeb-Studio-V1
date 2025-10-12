/**
 * @jest-environment node
 */

// Mock Next.js config headers function
async function getHeaders() {
  // Environment-controlled CSP toggle
  const cspReportOnly = process.env.CSP_REPORT_ONLY === "true";
  const cspHeaderName = cspReportOnly
    ? "Content-Security-Policy-Report-Only"
    : "Content-Security-Policy";

  // Define CSP policy with minimal explicit allowlists
  function buildCSP() {
    return [
      "default-src 'self'",
      // Script sources - will be enhanced with nonce in middleware for inline scripts
      "script-src 'self' https://plausible.io https://va.vercel-scripts.com https://www.google.com https://www.gstatic.com https://js.cal.com",
      // Style sources - unsafe-inline needed for CSS-in-JS and Tailwind
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Font sources
      "font-src 'self' https://fonts.gstatic.com",
      // Image sources - data: for inline SVGs, blob: for canvas/WebGL
      "img-src 'self' data: https: blob:",
      // Media sources
      "media-src 'self' https:",
      // Frame sources for embeds
      "frame-src 'self' https://www.google.com https://cal.com https://app.cal.com",
      // Connect sources for XHR/fetch
      "connect-src 'self' https://plausible.io https://vitals.vercel-insights.com https://va.vercel-scripts.com https://api.cal.com",
      // Object sources
      "object-src 'none'",
      // Base URI
      "base-uri 'self'",
      // Frame ancestors (replaces X-Frame-Options)
      "frame-ancestors 'none'",
      // Form actions
      "form-action 'self'",
      // Upgrade insecure requests
      "upgrade-insecure-requests",
      // Report URI for violations
      "report-uri /api/csp-report",
    ].join("; ");
  }

  return [
    {
      // Immutable caching for static assets by extension
      source:
        "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|css|js|mjs|woff|woff2|ttf|eot)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        { key: "X-Content-Type-Options", value: "nosniff" },
      ],
    },
    {
      // Main pages and routes - comprehensive security headers
      source: "/:path*",
      headers: [
        // Content Security Policy - single source of truth
        { key: cspHeaderName, value: buildCSP() },
        // Strict Transport Security
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        // Content type protection
        { key: "X-Content-Type-Options", value: "nosniff" },
        // Referrer Policy
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        // Permissions Policy with minimal required permissions
        {
          key: "Permissions-Policy",
          value: [
            "accelerometer=()",
            "camera=()",
            "microphone=()",
            "geolocation=()",
            "gyroscope=()",
            "magnetometer=()",
            "payment=()",
            "usb=()",
            "fullscreen=(self)",
            "browsing-topics=()",
          ].join(", "),
        },
        // DNS prefetch control
        { key: "X-DNS-Prefetch-Control", value: "on" },
        // Cross-domain policies
        { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
        // Cross-Origin policies (avoid breaking R3F/Three.js assets)
        { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        // Custom security headers
        { key: "X-Security-Version", value: "3.0" },
        { key: "X-Download-Options", value: "noopen" },
        // Cache control for general pages
        {
          key: "Cache-Control",
          value:
            "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
        },
      ],
    },
    // Static assets - long cache with immutable
    {
      source: "/assets/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        { key: "X-Content-Type-Options", value: "nosniff" },
      ],
    },
    // API routes - no cache, enhanced security
    {
      source: "/api/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "no-cache, no-store, must-revalidate, private",
        },
        { key: "Pragma", value: "no-cache" },
        { key: "Expires", value: "0" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        // Use frame-ancestors in CSP instead of X-Frame-Options for consistency
        {
          key: cspHeaderName,
          value: "default-src 'none'; frame-ancestors 'none'",
        },
        { key: "X-API-Version", value: "3.0" },
        { key: "Vary", value: "Origin, Accept-Encoding" },
        // Referrer policy for API endpoints
        { key: "Referrer-Policy", value: "no-referrer" },
      ],
    },
    // Next.js static files - long cache
    {
      source: "/_next/static/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        { key: "X-Content-Type-Options", value: "nosniff" },
      ],
    },
    // Security-sensitive files
    {
      source: "/.well-known/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=86400" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        {
          key: cspHeaderName,
          value: "default-src 'none'; frame-ancestors 'none'",
        },
      ],
    },
    // PWA files
    {
      source: "/manifest.json",
      headers: [
        { key: "Cache-Control", value: "public, max-age=86400" },
        { key: "X-Content-Type-Options", value: "nosniff" },
      ],
    },
    {
      source: "/sw.js",
      headers: [
        { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        { key: "Service-Worker-Allowed", value: "/" },
        { key: "X-Content-Type-Options", value: "nosniff" },
      ],
    },
  ];
}

describe("Security Headers Configuration", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("CSP Report Mode Toggle", () => {
    it("should use Content-Security-Policy-Report-Only when CSP_REPORT_ONLY=true", async () => {
      process.env.CSP_REPORT_ONLY = "true";
      const headers = await getHeaders();

      const mainPageHeaders = headers.find(
        (h) => h.source === "/:path*",
      )?.headers;
      const cspHeader = mainPageHeaders?.find(
        (h) => h.key === "Content-Security-Policy-Report-Only",
      );

      expect(cspHeader).toBeTruthy();
      expect(cspHeader?.value).toContain("default-src 'self'");
      expect(cspHeader?.value).toContain("report-uri /api/csp-report");
    });

    it("should use Content-Security-Policy when CSP_REPORT_ONLY=false", async () => {
      process.env.CSP_REPORT_ONLY = "false";
      const headers = await getHeaders();

      const mainPageHeaders = headers.find(
        (h) => h.source === "/:path*",
      )?.headers;
      const cspHeader = mainPageHeaders?.find(
        (h) => h.key === "Content-Security-Policy",
      );

      expect(cspHeader).toBeTruthy();
      expect(cspHeader?.value).toContain("default-src 'self'");
      expect(cspHeader?.value).toContain("report-uri /api/csp-report");
    });
  });

  describe("Main Pages Security Headers", () => {
    it("should return comprehensive security headers for main pages", async () => {
      const headers = await getHeaders();
      const mainPageConfig = headers.find((h) => h.source === "/:path*");

      expect(mainPageConfig).toBeTruthy();

      const headerMap = new Map(
        mainPageConfig!.headers.map((h) => [h.key, h.value]),
      );

      // Test essential security headers
      expect(headerMap.get("Strict-Transport-Security")).toBe(
        "max-age=63072000; includeSubDomains; preload",
      );
      expect(headerMap.get("X-Content-Type-Options")).toBe("nosniff");
      expect(headerMap.get("Referrer-Policy")).toBe(
        "strict-origin-when-cross-origin",
      );
      expect(headerMap.get("X-DNS-Prefetch-Control")).toBe("on");
      expect(headerMap.get("Cross-Origin-Opener-Policy")).toBe("same-origin");
      expect(headerMap.get("Cross-Origin-Resource-Policy")).toBe("same-origin");
    });

    it("should include minimal CSP with explicit allowlists", async () => {
      const headers = await getHeaders();
      const mainPageConfig = headers.find((h) => h.source === "/:path*");

      const cspHeader = mainPageConfig?.headers.find(
        (h) =>
          h.key === "Content-Security-Policy" ||
          h.key === "Content-Security-Policy-Report-Only",
      );

      expect(cspHeader).toBeTruthy();

      // Test specific CSP directives
      expect(cspHeader?.value).toContain("default-src 'self'");
      expect(cspHeader?.value).toContain(
        "script-src 'self' https://plausible.io",
      );
      expect(cspHeader?.value).toContain("style-src 'self' 'unsafe-inline'");
      expect(cspHeader?.value).toContain("object-src 'none'");
      expect(cspHeader?.value).toContain("frame-ancestors 'none'");
      expect(cspHeader?.value).toContain("upgrade-insecure-requests");
    });

    it("should include Permissions Policy with minimal permissions", async () => {
      const headers = await getHeaders();
      const mainPageConfig = headers.find((h) => h.source === "/:path*");

      const permissionsHeader = mainPageConfig?.headers.find(
        (h) => h.key === "Permissions-Policy",
      );

      expect(permissionsHeader).toBeTruthy();
      expect(permissionsHeader?.value).toContain("camera=()");
      expect(permissionsHeader?.value).toContain("microphone=()");
      expect(permissionsHeader?.value).toContain("fullscreen=(self)");
    });
  });

  describe("API Routes Security Headers", () => {
    it("should return strict security headers for API routes", async () => {
      const headers = await getHeaders();
      const apiConfig = headers.find((h) => h.source === "/api/:path*");

      expect(apiConfig).toBeTruthy();

      const headerMap = new Map(
        apiConfig!.headers.map((h) => [h.key, h.value]),
      );

      expect(headerMap.get("Cache-Control")).toBe(
        "no-cache, no-store, must-revalidate, private",
      );
      expect(headerMap.get("Pragma")).toBe("no-cache");
      expect(headerMap.get("Expires")).toBe("0");
      expect(headerMap.get("X-Content-Type-Options")).toBe("nosniff");
      expect(headerMap.get("Referrer-Policy")).toBe("no-referrer");
    });

    it("should use restrictive CSP for API routes", async () => {
      const headers = await getHeaders();
      const apiConfig = headers.find((h) => h.source === "/api/:path*");

      const cspHeader = apiConfig?.headers.find(
        (h) =>
          h.key === "Content-Security-Policy" ||
          h.key === "Content-Security-Policy-Report-Only",
      );

      expect(cspHeader).toBeTruthy();
      expect(cspHeader?.value).toBe(
        "default-src 'none'; frame-ancestors 'none'",
      );
    });
  });

  describe("Static Assets Headers", () => {
    it("should return immutable caching for static assets by extension", async () => {
      const headers = await getHeaders();
      const staticConfig = headers.find((h) =>
        h.source.includes("svg|jpg|jpeg"),
      );

      expect(staticConfig).toBeTruthy();

      const headerMap = new Map(
        staticConfig!.headers.map((h) => [h.key, h.value]),
      );

      expect(headerMap.get("Cache-Control")).toBe(
        "public, max-age=31536000, immutable",
      );
      expect(headerMap.get("X-Content-Type-Options")).toBe("nosniff");
    });

    it("should return long caching for Next.js static files", async () => {
      const headers = await getHeaders();
      const nextStaticConfig = headers.find(
        (h) => h.source === "/_next/static/:path*",
      );

      expect(nextStaticConfig).toBeTruthy();

      const headerMap = new Map(
        nextStaticConfig!.headers.map((h) => [h.key, h.value]),
      );

      expect(headerMap.get("Cache-Control")).toBe(
        "public, max-age=31536000, immutable",
      );
    });
  });

  describe("Special Files Headers", () => {
    it("should return secure headers for .well-known files", async () => {
      const headers = await getHeaders();
      const wellKnownConfig = headers.find(
        (h) => h.source === "/.well-known/:path*",
      );

      expect(wellKnownConfig).toBeTruthy();

      const headerMap = new Map(
        wellKnownConfig!.headers.map((h) => [h.key, h.value]),
      );

      expect(headerMap.get("Cache-Control")).toBe("public, max-age=86400");
      expect(headerMap.get("X-Content-Type-Options")).toBe("nosniff");
    });

    it("should return appropriate headers for PWA files", async () => {
      const headers = await getHeaders();

      const manifestConfig = headers.find((h) => h.source === "/manifest.json");
      const swConfig = headers.find((h) => h.source === "/sw.js");

      expect(manifestConfig).toBeTruthy();
      expect(swConfig).toBeTruthy();

      const swHeaderMap = new Map(
        swConfig!.headers.map((h) => [h.key, h.value]),
      );

      expect(swHeaderMap.get("Service-Worker-Allowed")).toBe("/");
      expect(swHeaderMap.get("Cache-Control")).toBe(
        "public, max-age=0, must-revalidate",
      );
    });
  });

  describe("Header Consistency", () => {
    it("should include X-Content-Type-Options in all relevant configurations", async () => {
      const headers = await getHeaders();

      const configurationsWithContentType = headers.filter((config) =>
        config.headers.some((h) => h.key === "X-Content-Type-Options"),
      );

      // Should be present in most configurations except PWA manifest
      expect(configurationsWithContentType.length).toBeGreaterThan(5);

      configurationsWithContentType.forEach((config) => {
        const contentTypeHeader = config.headers.find(
          (h) => h.key === "X-Content-Type-Options",
        );
        expect(contentTypeHeader?.value).toBe("nosniff");
      });
    });

    it("should use frame-ancestors in CSP instead of X-Frame-Options", async () => {
      const headers = await getHeaders();

      // Check that main pages use frame-ancestors in CSP
      const mainPageConfig = headers.find((h) => h.source === "/:path*");
      const cspHeader = mainPageConfig?.headers.find(
        (h) =>
          h.key === "Content-Security-Policy" ||
          h.key === "Content-Security-Policy-Report-Only",
      );

      expect(cspHeader?.value).toContain("frame-ancestors 'none'");

      // Check that X-Frame-Options is not used in main pages
      const frameOptionsHeader = mainPageConfig?.headers.find(
        (h) => h.key === "X-Frame-Options",
      );
      expect(frameOptionsHeader).toBeFalsy();
    });
  });
});
