/**
 * Security validation utilities for API routes
 * Implements strict origin and fetch metadata checks
 */

export interface SecurityValidationResult {
  valid: boolean;
  error?: string;
  code?: string;
}

/**
 * Get the expected host for the application
 * Handles different environments and deployment contexts
 */
export function getExpectedHost(): string {
  // In production, use SITE_URL or VERCEL_URL
  if (process.env.NODE_ENV === "production") {
    const siteUrl = process.env.SITE_URL || process.env.VERCEL_URL;
    if (siteUrl) {
      try {
        return new URL(siteUrl).host;
      } catch {
        // Fallback if URL parsing fails
        return siteUrl.replace(/^https?:\/\//, "").split("/")[0];
      }
    }
  }

  // Development default
  return "localhost:3000";
}

/**
 * Validate Origin header
 * Rejects requests with missing or foreign origins
 */
export function validateOrigin(request: Request): SecurityValidationResult {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // Origin header is required for POST requests
  if (!origin && !referer) {
    return {
      valid: false,
      error: "Missing origin information",
      code: "MISSING_ORIGIN",
    };
  }

  const expectedHost = getExpectedHost();

  // Validate origin if present
  if (origin) {
    try {
      const originUrl = new URL(origin);
      if (originUrl.host !== expectedHost) {
        return {
          valid: false,
          error: "Invalid origin",
          code: "FOREIGN_ORIGIN",
        };
      }
    } catch {
      return {
        valid: false,
        error: "Malformed origin",
        code: "MALFORMED_ORIGIN",
      };
    }
  }

  // Validate referer as fallback
  if (!origin && referer) {
    try {
      const refererUrl = new URL(referer);
      if (refererUrl.host !== expectedHost) {
        return {
          valid: false,
          error: "Invalid referer",
          code: "FOREIGN_REFERER",
        };
      }
    } catch {
      return {
        valid: false,
        error: "Malformed referer",
        code: "MALFORMED_REFERER",
      };
    }
  }

  return { valid: true };
}

/**
 * Validate Host header
 * Ensures the Host header matches the expected application host
 */
export function validateHost(request: Request): SecurityValidationResult {
  const host = request.headers.get("host");

  if (!host) {
    return {
      valid: false,
      error: "Missing host header",
      code: "MISSING_HOST",
    };
  }

  const expectedHost = getExpectedHost();

  // Normalize hosts for comparison (remove port for standard ports)
  const normalizeHost = (h: string) => {
    return h.replace(/:80$/, "").replace(/:443$/, "");
  };

  if (normalizeHost(host) !== normalizeHost(expectedHost)) {
    return {
      valid: false,
      error: "Invalid host header",
      code: "INVALID_HOST",
    };
  }

  return { valid: true };
}

/**
 * Validate Sec-Fetch-Site header
 * Enforces same-origin policy for sensitive operations
 */
export function validateSecFetchSite(
  request: Request,
): SecurityValidationResult {
  const secFetchSite = request.headers.get("sec-fetch-site");

  // sec-fetch-site is not available in all browsers/contexts
  // In development or when missing, we rely on origin validation
  if (!secFetchSite) {
    if (process.env.NODE_ENV === "development") {
      return { valid: true };
    }
    // In production, log but don't block (some browsers/tools don't send this)
    console.warn("sec-fetch-site header missing in production request");
    return { valid: true };
  }

  // For form posts, we expect 'same-origin' or 'same-site'
  if (secFetchSite !== "same-origin" && secFetchSite !== "same-site") {
    return {
      valid: false,
      error: "Cross-origin request not allowed",
      code: "CROSS_ORIGIN_REQUEST",
    };
  }

  return { valid: true };
}

/**
 * Validate Sec-Fetch-Mode header
 * Ensures appropriate fetch mode for form submissions
 */
export function validateSecFetchMode(
  request: Request,
): SecurityValidationResult {
  const secFetchMode = request.headers.get("sec-fetch-mode");

  // sec-fetch-mode is not available in all browsers/contexts
  if (!secFetchMode) {
    if (process.env.NODE_ENV === "development") {
      return { valid: true };
    }
    // In production, log but don't block
    console.warn("sec-fetch-mode header missing in production request");
    return { valid: true };
  }

  // For API requests from forms, we expect 'cors', 'same-origin', or 'navigate'
  const validModes = ["cors", "same-origin", "navigate", "no-cors"];

  if (!validModes.includes(secFetchMode)) {
    return {
      valid: false,
      error: "Invalid fetch mode",
      code: "INVALID_FETCH_MODE",
    };
  }

  return { valid: true };
}

/**
 * Comprehensive security validation for API requests
 * Combines all security checks into a single validation
 */
export function validateRequestSecurity(
  request: Request,
): SecurityValidationResult {
  // Validate origin
  const originResult = validateOrigin(request);
  if (!originResult.valid) {
    return originResult;
  }

  // Validate host
  const hostResult = validateHost(request);
  if (!hostResult.valid) {
    return hostResult;
  }

  // Validate Sec-Fetch-Site
  const fetchSiteResult = validateSecFetchSite(request);
  if (!fetchSiteResult.valid) {
    return fetchSiteResult;
  }

  // Validate Sec-Fetch-Mode
  const fetchModeResult = validateSecFetchMode(request);
  if (!fetchModeResult.valid) {
    return fetchModeResult;
  }

  return { valid: true };
}

/**
 * Get security headers for API responses
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Cache-Control": "no-store, no-cache, must-revalidate, private",
  };
}
