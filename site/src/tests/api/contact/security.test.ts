import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  validateRequestSecurity,
  validateOrigin,
  validateHost,
  validateSecFetchSite,
  validateSecFetchMode,
  getSecurityHeaders,
  getExpectedHost,
} from "@/lib/security-validation";
import { createRateLimitIdentifier } from "@/lib/rate-limiter";

// Mock environment variables for tests
beforeEach(() => {
  vi.stubEnv("SITE_URL", "https://test.example.com");
  vi.stubEnv("NODE_ENV", "test");
});

describe("Security Validation Tests", () => {
  const createMockRequest = (headers: Record<string, string>) => {
    const mockHeaders = new Map();
    Object.entries(headers).forEach(([key, value]) => {
      mockHeaders.set(key, value);
    });

    return {
      headers: {
        get: (name: string) => mockHeaders.get(name) || null,
      },
    } as Request;
  };

  describe("getExpectedHost", () => {
    it("should return host from SITE_URL in production", () => {
      vi.stubEnv("NODE_ENV", "production");
      vi.stubEnv("SITE_URL", "https://example.com");

      const host = getExpectedHost();
      expect(host).toBe("example.com");
    });

    it("should return localhost:3000 in development", () => {
      vi.stubEnv("NODE_ENV", "development");

      const host = getExpectedHost();
      expect(host).toBe("localhost:3000");
    });
  });

  describe("validateOrigin", () => {
    it("should accept valid origin", () => {
      const request = createMockRequest({
        origin: "http://localhost:3000",
      });

      const result = validateOrigin(request);
      expect(result.valid).toBe(true);
    });

    it("should reject missing origin and referer", () => {
      const request = createMockRequest({});

      const result = validateOrigin(request);
      expect(result.valid).toBe(false);
      expect(result.code).toBe("MISSING_ORIGIN");
    });

    it("should reject foreign origin", () => {
      const request = createMockRequest({
        origin: "https://malicious.com",
      });

      const result = validateOrigin(request);
      expect(result.valid).toBe(false);
      expect(result.code).toBe("FOREIGN_ORIGIN");
    });

    it("should reject malformed origin", () => {
      const request = createMockRequest({
        origin: "not-a-url",
      });

      const result = validateOrigin(request);
      expect(result.valid).toBe(false);
      expect(result.code).toBe("MALFORMED_ORIGIN");
    });

    it("should accept valid referer when origin is missing", () => {
      const request = createMockRequest({
        referer: "http://localhost:3000/contact",
      });

      const result = validateOrigin(request);
      expect(result.valid).toBe(true);
    });

    it("should reject foreign referer when origin is missing", () => {
      const request = createMockRequest({
        referer: "https://malicious.com/page",
      });

      const result = validateOrigin(request);
      expect(result.valid).toBe(false);
      expect(result.code).toBe("FOREIGN_REFERER");
    });
  });

  describe("validateHost", () => {
    it("should accept valid host", () => {
      const request = createMockRequest({
        host: "localhost:3000",
      });

      const result = validateHost(request);
      expect(result.valid).toBe(true);
    });

    it("should reject missing host", () => {
      const request = createMockRequest({});

      const result = validateHost(request);
      expect(result.valid).toBe(false);
      expect(result.code).toBe("MISSING_HOST");
    });

    it("should reject invalid host", () => {
      const request = createMockRequest({
        host: "malicious.com",
      });

      const result = validateHost(request);
      expect(result.valid).toBe(false);
      expect(result.code).toBe("INVALID_HOST");
    });

    it("should normalize hosts for port comparison", () => {
      // Set up production environment where HTTPS is expected
      vi.stubEnv("NODE_ENV", "production");
      vi.stubEnv("SITE_URL", "https://example.com");

      const request = createMockRequest({
        host: "example.com:443", // HTTPS default port should normalize to example.com
      });

      const result = validateHost(request);
      expect(result.valid).toBe(true);
    });
  });

  describe("validateSecFetchSite", () => {
    it("should accept same-origin requests", () => {
      const request = createMockRequest({
        "sec-fetch-site": "same-origin",
      });

      const result = validateSecFetchSite(request);
      expect(result.valid).toBe(true);
    });

    it("should accept same-site requests", () => {
      const request = createMockRequest({
        "sec-fetch-site": "same-site",
      });

      const result = validateSecFetchSite(request);
      expect(result.valid).toBe(true);
    });

    it("should reject cross-site requests", () => {
      const request = createMockRequest({
        "sec-fetch-site": "cross-site",
      });

      const result = validateSecFetchSite(request);
      expect(result.valid).toBe(false);
      expect(result.code).toBe("CROSS_ORIGIN_REQUEST");
    });

    it("should accept missing sec-fetch-site in development", () => {
      vi.stubEnv("NODE_ENV", "development");

      const request = createMockRequest({});

      const result = validateSecFetchSite(request);
      expect(result.valid).toBe(true);
    });
  });

  describe("validateSecFetchMode", () => {
    it("should accept valid fetch modes", () => {
      const validModes = ["cors", "same-origin", "navigate", "no-cors"];

      validModes.forEach((mode) => {
        const request = createMockRequest({
          "sec-fetch-mode": mode,
        });

        const result = validateSecFetchMode(request);
        expect(result.valid).toBe(true);
      });
    });

    it("should reject invalid fetch mode", () => {
      const request = createMockRequest({
        "sec-fetch-mode": "websocket",
      });

      const result = validateSecFetchMode(request);
      expect(result.valid).toBe(false);
      expect(result.code).toBe("INVALID_FETCH_MODE");
    });

    it("should accept missing sec-fetch-mode in development", () => {
      vi.stubEnv("NODE_ENV", "development");

      const request = createMockRequest({});

      const result = validateSecFetchMode(request);
      expect(result.valid).toBe(true);
    });
  });

  describe("validateRequestSecurity", () => {
    it("should pass comprehensive validation for valid request", () => {
      const request = createMockRequest({
        origin: "http://localhost:3000",
        host: "localhost:3000",
        "sec-fetch-site": "same-origin",
        "sec-fetch-mode": "cors",
      });

      const result = validateRequestSecurity(request);
      expect(result.valid).toBe(true);
    });

    it("should fail if origin validation fails", () => {
      const request = createMockRequest({
        origin: "https://malicious.com",
        host: "test.example.com",
        "sec-fetch-site": "same-origin",
        "sec-fetch-mode": "cors",
      });

      const result = validateRequestSecurity(request);
      expect(result.valid).toBe(false);
      expect(result.code).toBe("FOREIGN_ORIGIN");
    });

    it("should fail if host validation fails", () => {
      const request = createMockRequest({
        origin: "http://localhost:3000",
        host: "malicious.com",
        "sec-fetch-site": "same-origin",
        "sec-fetch-mode": "cors",
      });

      const result = validateRequestSecurity(request);
      expect(result.valid).toBe(false);
      expect(result.code).toBe("INVALID_HOST");
    });

    it("should fail if sec-fetch-site validation fails", () => {
      const request = createMockRequest({
        origin: "http://localhost:3000",
        host: "localhost:3000",
        "sec-fetch-site": "cross-site",
        "sec-fetch-mode": "cors",
      });

      const result = validateRequestSecurity(request);
      expect(result.valid).toBe(false);
      expect(result.code).toBe("CROSS_ORIGIN_REQUEST");
    });
  });

  describe("getSecurityHeaders", () => {
    it("should return all required security headers", () => {
      const headers = getSecurityHeaders();

      const expectedHeaders = {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Cache-Control": "no-store, no-cache, must-revalidate, private",
      };

      expect(headers).toEqual(expectedHeaders);
    });
  });

  describe("createRateLimitIdentifier", () => {
    it("should extract IP from x-forwarded-for header", () => {
      const request = createMockRequest({
        "x-forwarded-for": "192.168.1.100, 10.0.0.1",
      });

      const identifier = createRateLimitIdentifier(request as Request);
      expect(identifier).toBe("192.168.1.100");
    });

    it("should extract IP from x-real-ip header", () => {
      const request = createMockRequest({
        "x-real-ip": "192.168.1.200",
      });

      const identifier = createRateLimitIdentifier(request as Request);
      expect(identifier).toBe("192.168.1.200");
    });

    it("should extract IP from cf-connecting-ip header", () => {
      const request = createMockRequest({
        "cf-connecting-ip": "192.168.1.300",
      });

      const identifier = createRateLimitIdentifier(request as Request);
      expect(identifier).toBe("192.168.1.300");
    });

    it("should return sanitized identifier when no IP headers present", () => {
      const request = createMockRequest({});

      const identifier = createRateLimitIdentifier(request as Request);
      expect(identifier).toBe("unknown");
    });

    it("should sanitize IP addresses for Redis key safety", () => {
      const request = createMockRequest({
        "x-forwarded-for": "192.168.1.100[malicious]",
      });

      const identifier = createRateLimitIdentifier(request as Request);
      expect(identifier).toBe("192.168.1.100_malicious_");
    });
  });
});
