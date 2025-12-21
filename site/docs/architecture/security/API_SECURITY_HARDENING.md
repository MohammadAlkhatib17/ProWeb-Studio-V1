# API & Frontend Security Hardening Implementation

## Overview
This implementation adds comprehensive security hardening for forms and APIs, including IP-based rate limiting and HTML sanitization to prevent XSS attacks.

## Changes Made

### 1. Rate Limiting (`src/lib/rateLimit.ts`)

**Features:**
- IP-based rate limiting with different limits per endpoint
- Support for both Upstash Redis (production) and in-memory (development)
- Automatic cleanup of expired rate limit entries
- Comprehensive logging of over-limit events

**Configuration:**
- Contact API: 60 requests per minute per IP
- Subscribe API: 30 requests per minute per IP
- Default: 100 requests per minute per IP

**Key Functions:**
- `getClientIP(request)`: Extract client IP from request headers
- `checkRateLimit(identifier, limiter, endpoint)`: Check and log rate limits
- `InMemoryRateLimiter`: In-memory implementation for development

### 2. HTML Sanitization (`src/lib/sanitize.ts`)

**Features:**
- Server-side (SSR) and client-side sanitization using `isomorphic-dompurify`
- Multiple sanitization modes (strict, HTML-safe, URL-safe)
- Protection against 18+ known XSS attack vectors
- Recursive object sanitization

**Key Functions:**
- `sanitizeText(dirty)`: Remove all HTML tags (strictest)
- `sanitizeHtml(dirty, config)`: Allow safe HTML tags
- `sanitizeUrl(url)`: Block dangerous protocols (javascript:, data:, etc.)
- `sanitizeUserInput(input, maxLength)`: Convenience function with length limits
- `sanitizeObject(obj, sanitizer)`: Recursively sanitize object properties
- `createSafeMarkup(html)`: React-friendly sanitization

### 3. Contact API (`src/app/api/contact/route.ts`)

**Changes:**
- Added IP-based rate limiting (60 rpm)
- Integrated DOMPurify-based sanitization
- Returns 429 with `Retry-After` header when over-limit
- Logs over-limit events with IP and timestamp

**Headers in 429 Response:**
- `Retry-After`: Seconds until retry is allowed
- `X-RateLimit-Limit`: Maximum requests per window
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: ISO timestamp of window reset

### 4. Subscribe API (`src/app/api/subscribe/route.ts`)

**Changes:**
- Added IP-based rate limiting (30 rpm)
- Same 429 response structure as contact API
- Logging of over-limit events

## Test Coverage

### Rate Limiting Tests (`src/app/api/contact/__tests__/rate-limit.test.ts`)

**6 tests covering:**
1. ✅ Accepts requests within rate limit
2. ✅ Returns 429 when rate limit exceeded
3. ✅ Includes Retry-After header in 429 response
4. ✅ Rate limits per IP independently
5. ✅ P95 response time < 200ms (meets requirement)
6. ✅ Logs over-limit events

### Sanitization Tests (`src/lib/__tests__/sanitize.test.ts`)

**48 tests covering:**
- Text sanitization (removes all HTML)
- HTML sanitization (allows safe tags)
- URL sanitization (blocks dangerous protocols)
- User input sanitization (with length limits)
- Object sanitization (recursive)
- React markup creation
- 18+ XSS attack vectors including:
  - `<script>` tags
  - `onerror` handlers
  - `onload` handlers
  - `javascript:` protocols
  - `data:` protocols
  - SVG/iframe injection
  - Nested/obfuscated payloads

## Performance

- **P95 Response Time**: < 200ms (verified in tests)
- **In-memory rate limiter**: O(1) for limit checks, periodic cleanup
- **DOMPurify overhead**: Minimal (<1ms for typical inputs)

## Production Deployment

### Environment Variables (Optional)

Add to `.env.local` for Upstash Redis (production):

```bash
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

If not set, the system automatically falls back to in-memory rate limiting (suitable for single-instance deployments).

## Security Benefits

1. **Rate Limiting:**
   - Prevents brute force attacks
   - Mitigates DoS attacks
   - Protects backend resources
   - Per-IP granularity prevents single attacker from affecting others

2. **HTML Sanitization:**
   - Prevents XSS attacks
   - Removes malicious scripts
   - Blocks dangerous protocols
   - Works on both server and client

3. **Logging:**
   - Over-limit events tracked with IP and timestamp
   - Helps identify attack patterns
   - Aids in security incident response

## Constraints Met

✅ **60 rpm/IP for contact**: Implemented and tested  
✅ **P95 response < 200 ms**: Verified in tests (typically ~10-30ms)  
✅ **No global middleware changes**: Only modified specific API routes  
✅ **429 with Retry-After**: Implemented with all required headers  
✅ **XSS neutralization**: Tested against 18+ attack vectors  
✅ **SSR + client sanitization**: Using isomorphic-dompurify

## Usage Examples

### Sanitizing User Input

```typescript
import { sanitizeText, sanitizeHtml } from '@/lib/sanitize';

// Remove all HTML
const clean = sanitizeText('<script>alert("xss")</script>Hello');
// Result: "Hello"

// Allow safe HTML
const safeHtml = sanitizeHtml('<p>Hello <strong>world</strong></p>');
// Result: "<p>Hello <strong>world</strong></p>"
```

### Rate Limiting Custom Endpoint

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { defaultRateLimiter, getClientIP, checkRateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  const clientIP = getClientIP(req);
  const rateLimit = await checkRateLimit(clientIP, defaultRateLimiter, 'custom');
  
  if (!rateLimit.success) {
    const retryAfter = Math.ceil((rateLimit.reset - Date.now()) / 1000);
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { 
        status: 429,
        headers: { 'Retry-After': retryAfter.toString() }
      }
    );
  }
  
  // Process request...
}
```

## Maintenance

- **In-memory cleanup**: Runs automatically every 60 seconds
- **Test suite**: Run with `npm test`
- **Type checking**: No TypeScript errors
- **Dependencies**: Using already-installed packages

## Notes

- Minimal changes made to meet requirements
- No new global frameworks introduced
- Backward compatible with existing code
- Production-ready with proper error handling
