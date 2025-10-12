/**
 * Integration tests for CSP headers and middleware nonce functionality
 */

import { NextRequest } from "next/server";
import { middleware } from "../middleware";

// Mock environment for testing
const originalEnv = process.env;

beforeEach(() => {
  process.env = { ...originalEnv };
});

afterEach(() => {
  process.env = originalEnv;
});

describe("Middleware Nonce Generation", () => {
  it("should generate unique nonces for each request", async () => {
    const req1 = new NextRequest("https://example.com/contact");
    const req2 = new NextRequest("https://example.com/contact");

    const response1 = await middleware(req1);
    const response2 = await middleware(req2);

    const nonce1 = response1.headers.get("X-Nonce");
    const nonce2 = response2.headers.get("X-Nonce");

    expect(nonce1).toBeTruthy();
    expect(nonce2).toBeTruthy();
    expect(nonce1).not.toBe(nonce2);
  });

  it("should set geographic hints correctly", async () => {
    const req = new NextRequest("https://example.com/", {
      headers: {
        "x-vercel-ip-country": "NL",
        "x-forwarded-for": "31.123.45.67",
      },
    });

    const response = await middleware(req);

    expect(response.headers.get("X-Geographic-Hint")).toBe("nl");
    expect(response.headers.get("X-Edge-Region")).toBe("lhr1");
  });

  it("should set X-Robots-Tag for playground routes", async () => {
    const req = new NextRequest("https://example.com/speeltuin");
    const response = await middleware(req);

    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, follow");
  });

  it("should set X-Robots-Tag for error pages", async () => {
    const req = new NextRequest("https://example.com/not-found");
    const response = await middleware(req);

    expect(response.headers.get("X-Robots-Tag")).toBe(
      "noindex, nofollow, nocache, nosnippet, noarchive, noimageindex",
    );
  });

  it("should enhance CSP with nonce for contact page", async () => {
    process.env.CSP_REPORT_ONLY = "false";

    const req = new NextRequest("https://example.com/contact");
    const response = await middleware(req);

    const csp = response.headers.get("Content-Security-Policy");
    const nonce = response.headers.get("X-Nonce");

    expect(csp).toContain(`'nonce-${nonce}'`);
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain("report-uri /api/csp-report");
  });

  it("should use report-only CSP when environment variable is set", async () => {
    process.env.CSP_REPORT_ONLY = "true";

    const req = new NextRequest("https://example.com/contact");
    const response = await middleware(req);

    expect(response.headers.has("Content-Security-Policy-Report-Only")).toBe(
      true,
    );
    expect(response.headers.has("Content-Security-Policy")).toBe(false);
  });

  it("should optimize caching for Dutch users", async () => {
    const req = new NextRequest("https://example.com/", {
      headers: {
        "x-vercel-ip-country": "NL",
        "x-forwarded-for": "31.123.45.67",
      },
    });

    const response = await middleware(req);

    expect(response.headers.get("Cache-Control")).toContain("max-age=7200");
    expect(response.headers.get("X-Cache-Strategy")).toBe("dutch-optimized");
  });

  it("should skip processing for static files", async () => {
    const req = new NextRequest("https://example.com/_next/static/chunk.js");
    const response = await middleware(req);

    // Should pass through without modification
    expect(response.headers.get("X-Nonce")).toBeFalsy();
  });
});

describe("Rate Limiting Integration", () => {
  it("should not modify headers when rate limit is not exceeded", async () => {
    const req = new NextRequest("https://example.com/", {
      headers: {
        "x-forwarded-for": "192.168.1.1",
      },
    });

    const response = await middleware(req);

    expect(response.status).toBe(200);
    expect(response.headers.get("X-Nonce")).toBeTruthy();
  });
});

describe("Security Validation", () => {
  it("should block suspicious requests", async () => {
    const req = new NextRequest(
      "https://example.com/?test=<script>alert(1)</script>",
    );

    const response = await middleware(req);

    expect(response.status).toBe(400);
  });

  it("should validate POST requests", async () => {
    const req = new NextRequest("https://example.com/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    });

    const response = await middleware(req);

    expect(response.status).toBe(401); // Missing origin/referer
  });
});

export {};
