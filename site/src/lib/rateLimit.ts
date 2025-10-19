import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Check if Redis environment variables are configured
const hasRedisConfig = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

// Interface for rate limit result
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// Interface for mock rate limiter to match Ratelimit interface
interface MockRateLimiter {
  limit: (identifier: string) => Promise<RateLimitResult>;
  resetUsageForIdentifier: (identifier: string) => Promise<{ success: boolean }>;
  getRemaining: (identifier: string) => Promise<number>;
}

// In-memory rate limiter for development (when Redis is not configured)
class InMemoryRateLimiter implements MockRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private windowMs: number;
  private maxRequests: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async limit(identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    // Get existing requests for this identifier
    let timestamps = this.requests.get(identifier) || [];
    
    // Remove timestamps outside the current window
    timestamps = timestamps.filter(ts => ts > windowStart);
    
    // Check if limit is exceeded
    const success = timestamps.length < this.maxRequests;
    
    if (success) {
      timestamps.push(now);
      this.requests.set(identifier, timestamps);
    }
    
    const remaining = Math.max(0, this.maxRequests - timestamps.length);
    const reset = timestamps.length > 0 ? timestamps[0] + this.windowMs : now + this.windowMs;
    
    return {
      success,
      limit: this.maxRequests,
      remaining,
      reset,
    };
  }

  async resetUsageForIdentifier(identifier: string): Promise<{ success: boolean }> {
    this.requests.delete(identifier);
    return { success: true };
  }

  async getRemaining(identifier: string): Promise<number> {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const timestamps = (this.requests.get(identifier) || []).filter(ts => ts > windowStart);
    return Math.max(0, this.maxRequests - timestamps.length);
  }

  // Cleanup old entries periodically
  cleanup() {
    const now = Date.now();
    for (const [identifier, timestamps] of this.requests.entries()) {
      const filtered = timestamps.filter(ts => ts > now - this.windowMs);
      if (filtered.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, filtered);
      }
    }
  }
}

// Rate limiter configurations for different endpoints
export const rateLimitConfig = {
  contact: { requests: 60, window: '1 m' }, // 60 requests per minute
  subscribe: { requests: 30, window: '1 m' }, // 30 requests per minute
  default: { requests: 100, window: '1 m' }, // 100 requests per minute for other endpoints
} as const;

// Create rate limiters for each endpoint
let contactRateLimiter: Ratelimit | MockRateLimiter;
let subscribeRateLimiter: Ratelimit | MockRateLimiter;
let defaultRateLimiter: Ratelimit | MockRateLimiter;

if (hasRedisConfig) {
  const redis = Redis.fromEnv();
  
  contactRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(rateLimitConfig.contact.requests, rateLimitConfig.contact.window),
    analytics: true,
    prefix: 'rl:contact:',
  });
  
  subscribeRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(rateLimitConfig.subscribe.requests, rateLimitConfig.subscribe.window),
    analytics: true,
    prefix: 'rl:subscribe:',
  });
  
  defaultRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(rateLimitConfig.default.requests, rateLimitConfig.default.window),
    analytics: true,
    prefix: 'rl:default:',
  });
} else {
  // Create in-memory rate limiters for development
  contactRateLimiter = new InMemoryRateLimiter(rateLimitConfig.contact.requests, 60 * 1000);
  subscribeRateLimiter = new InMemoryRateLimiter(rateLimitConfig.subscribe.requests, 60 * 1000);
  defaultRateLimiter = new InMemoryRateLimiter(rateLimitConfig.default.requests, 60 * 1000);
  
  // Cleanup old entries every minute
  if (typeof setInterval !== 'undefined') {
    setInterval(() => {
      (contactRateLimiter as InMemoryRateLimiter).cleanup();
      (subscribeRateLimiter as InMemoryRateLimiter).cleanup();
      (defaultRateLimiter as InMemoryRateLimiter).cleanup();
    }, 60 * 1000);
  }
}

// Extract IP address from request
export function getClientIP(request: Request): string {
  // Try to get IP from various headers (Vercel/proxy headers)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }
  
  return 'unknown';
}

// Rate limit a request and return appropriate response if limited
export async function checkRateLimit(
  identifier: string,
  limiter: Ratelimit | MockRateLimiter,
  endpoint: string
): Promise<RateLimitResult> {
  const result = await limiter.limit(identifier);
  
  // Log over-limit events
  if (!result.success) {
    const resetDate = new Date(result.reset);
    console.warn(`[Rate Limit] ${endpoint}: IP ${identifier} exceeded limit. Limit: ${result.limit}, Reset: ${resetDate.toISOString()}`);
  }
  
  return result;
}

// Export rate limiters
export { contactRateLimiter, subscribeRateLimiter, defaultRateLimiter };

// Legacy export for backward compatibility
export const rateLimiter = defaultRateLimiter;
