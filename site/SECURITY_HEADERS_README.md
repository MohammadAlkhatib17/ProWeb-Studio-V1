# Single Source of Truth Security Headers Implementation

This implementation centralizes all security headers in `next.config.mjs` with nonce support via middleware, following security best practices.

## Architecture Overview

### Single Source of Truth

All security headers are defined in `site/next.config.mjs` in the `async headers()` function, eliminating duplication and ensuring consistency.

### Middleware Responsibilities

`site/src/middleware.ts` is focused only on:

- **Nonce generation** for inline scripts
- **Rate limiting**
- **X-Robots-Tag** for specific routes
- **Geographic hints** for performance optimization

## Security Headers Implementation

### Content Security Policy (CSP)

- **Minimal explicit allowlists** for external resources
- **Environment-controlled toggle** via `CSP_REPORT_ONLY`
- **Nonce enhancement** for inline scripts on specific pages
- **Report endpoint** at `/api/csp-report` for violation tracking

**Allowed external domains:**

- `plausible.io` - Analytics
- `va.vercel-scripts.com` - Vercel Analytics
- `www.google.com`, `www.gstatic.com` - Google services (Maps, reCAPTCHA)
- `js.cal.com`, `cal.com`, `app.cal.com` - Cal.com scheduling
- `fonts.googleapis.com`, `fonts.gstatic.com` - Google Fonts

### Other Security Headers

- **Strict-Transport-Security**: 2-year max-age with preload
- **X-Content-Type-Options**: nosniff for all resources
- **Referrer-Policy**: strict-origin-when-cross-origin for pages, no-referrer for APIs
- **Permissions-Policy**: Minimal permissions (fullscreen=self only)
- **Cross-Origin policies**: same-origin (no isolation to preserve R3F/Three.js compatibility)

## Environment Configuration

### CSP Report-Only Mode

```bash
# Staging - report violations without blocking
CSP_REPORT_ONLY=true

# Production - enforce CSP
CSP_REPORT_ONLY=false
```

## Path-Specific Headers

### Main Pages (`/:path*`)

- Full security header suite
- CSP with external resource allowlists
- Performance-optimized caching

### API Routes (`/api/:path*`)

- Restrictive CSP: `default-src 'none'; frame-ancestors 'none'`
- No caching headers
- API versioning headers

### Static Assets

- Long-term immutable caching
- Content-Type protection

### Special Routes

- **`/speeltuin`**: `X-Robots-Tag: noindex, follow`
- **Error pages**: `X-Robots-Tag: noindex, nofollow, nocache, nosnippet, noarchive, noimageindex`
- **Preview deployments**: `X-Robots-Tag: noindex, nofollow`

## Nonce Implementation

### Generation

- Unique nonce per request using `crypto.randomUUID()` or fallback
- Attached to request headers as `X-Nonce`
- Available to React components via headers

### CSP Enhancement

Contact page (`/contact`) gets enhanced CSP with nonce:

```
script-src 'self' 'nonce-{unique-nonce}' https://plausible.io ...
```

### Usage in Components

```typescript
import { headers } from 'next/headers';

export default function ContactPage() {
  const nonce = headers().get('X-Nonce');

  return (
    <script nonce={nonce}>
      // Safe inline script
    </script>
  );
}
```

## CSP Violation Reporting

### Endpoint: `/api/csp-report`

Handles POST requests with violation data:

```json
{
  "blocked-uri": "https://malicious.com/script.js",
  "document-uri": "https://prowebstudio.nl/contact",
  "violated-directive": "script-src 'self'",
  "source-file": "https://prowebstudio.nl/contact",
  "line-number": 42
}
```

### Logging

- Environment-aware logging (report-only vs enforcement)
- Violation type classification (eval, inline, external)
- Client IP and User-Agent tracking
- Production-ready for database storage

## Testing

### Unit Tests (`security-headers.test.ts`)

- CSP report-only toggle validation
- Header presence and values per path
- Permissions Policy configuration
- API route security headers

### Integration Tests (`middleware-integration.test.ts`)

- Nonce uniqueness
- Geographic hint generation
- X-Robots-Tag application
- Rate limiting integration
- Security validation

### E2E Tests (`csp-validation.spec.ts`)

- Report-only mode functionality
- Enforcement mode blocking
- Cross-browser compatibility
- Nonce-enabled inline scripts

## Performance Optimizations

### Geographic Hints

Dutch users get optimized caching:

```
Cache-Control: public, max-age=7200, s-maxage=86400, stale-while-revalidate=3600
X-Cache-Strategy: dutch-optimized
```

### Edge Region Selection

- Netherlands: `lhr1` (London)
- EU: `fra1` (Frankfurt)
- Global: `cdg1` (Paris)

## Migration Notes

### Removed Duplications

- Eliminated header duplication between `next.config.mjs` and `middleware.ts`
- Replaced `X-Frame-Options` with CSP `frame-ancestors` directive
- Consolidated API headers in single location

### Cross-Origin Isolation

Avoided `Cross-Origin-Embedder-Policy: require-corp` to prevent breaking:

- Three.js/R3F asset loading
- External font resources
- Third-party embeds (Cal.com, Google Maps)

## Monitoring & Debugging

### CSP Violation Analysis

1. Monitor `/api/csp-report` endpoint
2. Analyze violation patterns
3. Update CSP allowlists as needed
4. Test in report-only mode first

### Header Verification

```bash
curl -I https://prowebstudio.nl/
curl -I https://prowebstudio.nl/api/contact
curl -I https://prowebstudio.nl/assets/logo.png
```

### Environment Testing

```bash
# Test report-only mode
CSP_REPORT_ONLY=true npm run dev

# Test enforcement mode
CSP_REPORT_ONLY=false npm run dev
```

## Security Considerations

### Nonce Security

- Unique per request (not per user/session)
- Generated server-side
- Not logged or cached
- Rotates automatically

### CSP Bypass Prevention

- No `unsafe-inline` in script-src (except legacy fallback)
- No `unsafe-eval`
- Strict allowlists for external resources
- Regular review of violation reports

### Rate Limiting

- IP-based limiting in middleware
- Separate limits for HTML and API requests
- Configurable thresholds
- Geographic considerations for Dutch users

This implementation provides a robust, maintainable security header system with comprehensive monitoring and testing capabilities.
