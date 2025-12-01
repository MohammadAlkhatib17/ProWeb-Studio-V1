import { NextRequest } from 'next/server';

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { POST } from '@/app/api/contact/route';

// Mock nodemailer to provide createTransport
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({ messageId: 'test-message-id' })
    }))
  }
}));

// Mock environment variables
const mockEnv = {
  RECAPTCHA_SECRET_KEY: 'test-secret-key',
  BREVO_SMTP_USER: 'test-user',
  BREVO_SMTP_PASS: 'test-pass',
  CONTACT_INBOX: 'test@example.com',
  // No Upstash credentials - will use in-memory rate limiter
  UPSTASH_REDIS_REST_URL: undefined,
  UPSTASH_REDIS_REST_TOKEN: undefined,
};

vi.stubEnv('RECAPTCHA_SECRET_KEY', mockEnv.RECAPTCHA_SECRET_KEY);
vi.stubEnv('BREVO_SMTP_USER', mockEnv.BREVO_SMTP_USER);
vi.stubEnv('BREVO_SMTP_PASS', mockEnv.BREVO_SMTP_PASS);
vi.stubEnv('CONTACT_INBOX', mockEnv.CONTACT_INBOX);

// Mock fetch for reCAPTCHA verification
global.fetch = vi.fn() as unknown as typeof fetch;

describe('/api/contact - Rate Limiting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful reCAPTCHA response
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      json: () => Promise.resolve({
        success: true,
        score: 0.9
      })
    });
  });

  const createRequest = (body: Record<string, unknown>, ip: string = '192.168.1.1') => {
    return new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': ip,
      },
      body: JSON.stringify(body)
    });
  };

  const validFormData = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+31612345678',
    projectTypes: ['website'],
    message: 'This is a test message with more than 10 characters.',
    website: '', // Empty honeypot field
    recaptchaToken: 'test-recaptcha-token',
    timestamp: Date.now()
  };

  it('should accept requests within rate limit', async () => {
    const request = createRequest(validFormData, '192.168.1.100');
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.ok).toBe(true);
  });

  it('should return 429 when rate limit is exceeded', async () => {
    const testIP = '192.168.1.101';
    
    // Make 60 requests (the limit)
    const requests = Array.from({ length: 60 }, () => 
      POST(createRequest(validFormData, testIP))
    );
    
    await Promise.all(requests);
    
    // 61st request should be rate limited
    const response = await POST(createRequest(validFormData, testIP));
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.ok).toBe(false);
    expect(data.error).toContain('Te veel verzoeken');
    expect(data.retryAfter).toBeDefined();
    expect(typeof data.retryAfter).toBe('number');
  });

  it('should include Retry-After header in 429 response', async () => {
    const testIP = '192.168.1.102';
    
    // Exhaust rate limit
    const requests = Array.from({ length: 60 }, () => 
      POST(createRequest(validFormData, testIP))
    );
    await Promise.all(requests);
    
    // Next request should have Retry-After header
    const response = await POST(createRequest(validFormData, testIP));
    
    expect(response.status).toBe(429);
    expect(response.headers.get('Retry-After')).toBeDefined();
    expect(response.headers.get('X-RateLimit-Limit')).toBe('60');
    expect(response.headers.get('X-RateLimit-Remaining')).toBe('0');
    expect(response.headers.get('X-RateLimit-Reset')).toBeDefined();
  });

  it('should rate limit per IP address independently', async () => {
    const ip1 = '192.168.1.103';
    const ip2 = '192.168.1.104';
    
    // Exhaust limit for IP1
    const requests1 = Array.from({ length: 60 }, () => 
      POST(createRequest(validFormData, ip1))
    );
    await Promise.all(requests1);
    
    // IP1 should be rate limited
    const response1 = await POST(createRequest(validFormData, ip1));
    expect(response1.status).toBe(429);
    
    // IP2 should still work
    const response2 = await POST(createRequest(validFormData, ip2));
    expect(response2.status).toBe(200);
  });

  it('should have appropriate p95 response time under normal load', async () => {
    const times: number[] = [];
    const testIP = '192.168.1.105';
    
    // Make 20 requests and measure response times
    for (let i = 0; i < 20; i++) {
      const start = Date.now();
      await POST(createRequest(validFormData, testIP));
      const duration = Date.now() - start;
      times.push(duration);
    }
    
    // Calculate p95
    times.sort((a, b) => a - b);
    const p95Index = Math.ceil(times.length * 0.95) - 1;
    const p95 = times[p95Index];
    
    // P95 should be under 200ms (as per requirements)
    expect(p95).toBeLessThan(200);
  });

  it('should log over-limit events', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const testIP = '192.168.1.106';
    
    // Exhaust rate limit
    const requests = Array.from({ length: 60 }, () => 
      POST(createRequest(validFormData, testIP))
    );
    await Promise.all(requests);
    
    // Clear previous logs
    consoleSpy.mockClear();
    
    // Make over-limit request
    await POST(createRequest(validFormData, testIP));
    
    // Should have logged the event
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Rate Limit]')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('contact')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(testIP)
    );
    
    consoleSpy.mockRestore();
  });
});
