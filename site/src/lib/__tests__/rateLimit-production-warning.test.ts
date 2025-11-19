import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Rate Limit - Production Warning', () => {
  const originalConsole = console.warn;

  beforeEach(() => {
    vi.resetModules();
    console.warn = vi.fn();
  });

  afterEach(() => {
    console.warn = originalConsole;
    vi.unstubAllEnvs();
  });

  it('should log warning in production without Redis config', async () => {
    // Set production environment without Redis config
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');

    // Import the module to trigger the warning
    await import('@/lib/rateLimit');

    // Verify warning was logged
    expect(console.warn).toHaveBeenCalledWith(
      '[Rate Limit] Production environment without Upstash Redis config; using in-memory limiter only (not recommended for high-traffic or public forms).'
    );
  });

  it('should not log warning in production with Redis config', async () => {
    // Set production environment with Redis config
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://test-redis.upstash.io');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'test-token');

    // Import the module
    await import('@/lib/rateLimit');

    // Verify no warning was logged
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('should not log warning in development without Redis config', async () => {
    // Set development environment without Redis config
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');

    // Import the module
    await import('@/lib/rateLimit');

    // Verify no warning was logged
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('should not log warning in test environment without Redis config', async () => {
    // Set test environment without Redis config
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '');

    // Import the module
    await import('@/lib/rateLimit');

    // Verify no warning was logged
    expect(console.warn).not.toHaveBeenCalled();
  });
});