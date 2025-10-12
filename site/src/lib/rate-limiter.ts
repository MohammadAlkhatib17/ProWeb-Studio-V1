import { Redis } from "@upstash/redis";

/**
 * Rate limiter using Upstash Redis
 * - Permissive in local development
 * - Strict in production
 */

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  // Development: very permissive limits
  development: {
    requests: 100, // requests per window
    windowMs: 60 * 1000, // 1 minute
    keyPrefix: "dev_rate_limit",
  },
  // Production: strict limits
  production: {
    requests: 5, // requests per window
    windowMs: 60 * 1000, // 1 minute
    keyPrefix: "prod_rate_limit",
  },
};

let redis: Redis | null = null;

/**
 * Initialize Redis client
 */
function getRedisClient(): Redis | null {
  if (redis) return redis;

  // Check if Redis is properly configured
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn("Upstash Redis not configured - rate limiting disabled");
    return null;
  }

  try {
    redis = new Redis({
      url,
      token,
    });
    return redis;
  } catch (error) {
    console.error("Failed to initialize Redis client:", error);
    return null;
  }
}

/**
 * Check if request should be rate limited
 * @param identifier - Unique identifier for the request (IP, user ID, etc.)
 * @returns Promise<{ allowed: boolean, remaining: number, resetTime: number }>
 */
export async function checkRateLimit(identifier: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetTime: number;
}> {
  const isDev = process.env.NODE_ENV === "development";
  const config = isDev
    ? RATE_LIMIT_CONFIG.development
    : RATE_LIMIT_CONFIG.production;

  // In development without Redis, always allow
  if (isDev) {
    const redis = getRedisClient();
    if (!redis) {
      return {
        allowed: true,
        remaining: config.requests - 1,
        resetTime: Date.now() + config.windowMs,
      };
    }
  }

  // In production, Redis is required (enforced by build-time env validation)
  const redis = getRedisClient();
  if (!redis) {
    // This should never happen in production due to env validation
    console.error(
      "Redis client not available in production - blocking request",
    );
    return {
      allowed: false,
      remaining: 0,
      resetTime: Date.now() + config.windowMs,
    };
  }

  const key = `${config.keyPrefix}:${identifier}`;
  const now = Date.now();
  const windowStart = now - config.windowMs;

  try {
    // Use Redis pipeline for atomic operations
    const pipeline = redis.pipeline();

    // Remove old entries outside the window
    pipeline.zremrangebyscore(key, 0, windowStart);

    // Count current requests in window
    pipeline.zcard(key);

    // Add current request
    pipeline.zadd(key, { score: now, member: `${now}-${Math.random()}` });

    // Set expiration for cleanup
    pipeline.expire(key, Math.ceil(config.windowMs / 1000));

    const results = await pipeline.exec();

    if (!results || results.length < 3) {
      throw new Error("Pipeline execution failed");
    }

    const currentCount = (results[1] as { result: number }).result || 0;
    const requestsUsed = currentCount + 1; // +1 for the request we just added

    const allowed = requestsUsed <= config.requests;
    const remaining = Math.max(0, config.requests - requestsUsed);
    const resetTime = now + config.windowMs;

    // Log rate limit events in production
    if (!isDev && !allowed) {
      console.warn(
        `Rate limit exceeded for ${identifier}: ${requestsUsed}/${config.requests}`,
      );
    }

    return {
      allowed,
      remaining,
      resetTime,
    };
  } catch (error) {
    console.error("Rate limiting check failed:", error);

    // In development, fail open (allow request)
    if (isDev) {
      return {
        allowed: true,
        remaining: config.requests - 1,
        resetTime: now + config.windowMs,
      };
    }

    // In production, fail closed (block request)
    return {
      allowed: false,
      remaining: 0,
      resetTime: now + config.windowMs,
    };
  }
}

/**
 * Get rate limit headers for HTTP responses
 */
export function getRateLimitHeaders(rateLimitResult: {
  remaining: number;
  resetTime: number;
}): Record<string, string> {
  return {
    "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(rateLimitResult.resetTime / 1000).toString(),
  };
}

/**
 * Create rate limit identifier from request
 * Uses IP address with fallbacks
 */
export function createRateLimitIdentifier(request: Request): string {
  // Get IP from various headers (Vercel, Cloudflare, etc.)
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  // Extract IP from x-forwarded-for (could be comma-separated list)
  let ip = "unknown";

  if (cfConnectingIp) {
    ip = cfConnectingIp;
  } else if (realIp) {
    ip = realIp;
  } else if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first (client IP)
    ip = forwardedFor.split(",")[0].trim();
  }

  // Sanitize IP for use as Redis key
  return ip.replace(/[^a-zA-Z0-9\.\:]/g, "_");
}
