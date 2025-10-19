# Security Headers Architecture Diagram

## CSP Nonce Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     Client Request                               │
│                  GET https://prowebstudio.nl/                    │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Edge Middleware                               │
│                  (src/middleware.ts)                             │
│                                                                   │
│  1. Generate Nonce                                               │
│     ┌────────────────────────────────────┐                      │
│     │ const nonceBytes = new Uint8Array(16);                    │
│     │ crypto.getRandomValues(nonceBytes);                       │
│     │ nonce = btoa(...) // "abc123..."                          │
│     └────────────────────────────────────┘                      │
│                                                                   │
│  2. Build CSP with Nonce                                         │
│     ┌────────────────────────────────────┐                      │
│     │ script-src 'nonce-abc123...'       │                      │
│     │ style-src 'nonce-abc123...'        │                      │
│     │ frame-ancestors 'none'             │                      │
│     └────────────────────────────────────┘                      │
│                                                                   │
│  3. Set Headers                                                  │
│     ┌────────────────────────────────────┐                      │
│     │ Content-Security-Policy-Report-Only │ (Oct 19-26)         │
│     │ Content-Security-Policy             │ (After Oct 26)      │
│     │ x-nonce: abc123...                  │                      │
│     │ Strict-Transport-Security           │                      │
│     │ X-Frame-Options: DENY               │                      │
│     │ Referrer-Policy: strict-origin...   │                      │
│     └────────────────────────────────────┘                      │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js App Router                          │
│                    (app/layout.tsx)                              │
│                                                                   │
│  1. Read Nonce from Headers                                      │
│     ┌────────────────────────────────────┐                      │
│     │ const nonce = headers().get('x-nonce')                    │
│     └────────────────────────────────────┘                      │
│                                                                   │
│  2. Pass Nonce to Components                                     │
│     ┌────────────────────────────────────┐                      │
│     │ <SEOSchema nonce={nonce} />        │                      │
│     │ <ConsentAwareAnalytics nonce={nonce} />                   │
│     └────────────────────────────────────┘                      │
└───────────────────────────┬─────────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│    SEOSchema Component   │  │ ConsentAwareAnalytics    │
│                          │  │                          │
│  <Script                 │  │  <Script                 │
│    id="org-schema"       │  │    src="plausible.io"    │
│    nonce={nonce}         │  │    nonce={nonce}         │
│    type="application/    │  │    async                 │
│          ld+json"        │  │  />                      │
│    dangerouslySetInner   │  │                          │
│    HTML={{...}}          │  │  Only loads after        │
│  />                      │  │  cookie consent          │
└──────────┬───────────────┘  └──────────┬───────────────┘
           │                             │
           └──────────┬──────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                      HTML Response                               │
│                                                                   │
│  <html>                                                           │
│    <head>                                                         │
│      <meta property="csp-nonce" content="abc123..." />           │
│      <script nonce="abc123..." type="application/ld+json">       │
│        {"@type": "Organization", ...}                            │
│      </script>                                                    │
│    </head>                                                        │
│    <body>                                                         │
│      <script nonce="abc123..." src="plausible.io" async />       │
│    </body>                                                        │
│  </html>                                                          │
│                                                                   │
│  Headers:                                                         │
│    Content-Security-Policy-Report-Only:                          │
│      script-src 'self' 'nonce-abc123...' 'strict-dynamic' ...    │
│    Strict-Transport-Security: max-age=63072000; preload          │
│    X-Frame-Options: DENY                                         │
│    X-Content-Type-Options: nosniff                               │
│    Referrer-Policy: strict-origin-when-cross-origin              │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Browser                                     │
│                                                                   │
│  1. Parse CSP Header                                             │
│     ✓ nonce-abc123... matches <script nonce="abc123...">        │
│     ✓ Allow script execution                                     │
│     ✓ strict-dynamic allows dynamically loaded scripts           │
│                                                                   │
│  2. Enforce Security Headers                                     │
│     ✓ HSTS: Force HTTPS for 2 years                             │
│     ✓ X-Frame-Options: Block iframe embedding                    │
│     ✓ X-Content-Type-Options: No MIME sniffing                   │
│                                                                   │
│  3. Report Violations (Report-Only Phase)                        │
│     POST /api/csp-report with violation details                  │
│     (Console shows warning, not error)                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  CSP Violation Reporting                         │
│                  (app/api/csp-report/route.ts)                   │
│                                                                   │
│  Receives violation reports:                                     │
│  {                                                                │
│    "document-uri": "https://prowebstudio.nl/",                   │
│    "violated-directive": "script-src",                           │
│    "blocked-uri": "https://evil.com/hack.js",                    │
│    "disposition": "report" // or "enforce"                       │
│  }                                                                │
│                                                                   │
│  Logs to console/database:                                       │
│  - Timestamp                                                      │
│  - Client IP                                                      │
│  - User Agent                                                     │
│  - Violation details                                              │
│  - Monitoring window status                                       │
└─────────────────────────────────────────────────────────────────┘
```

## CSP Enforcement Timeline

```
┌─────────────────────────────────────────────────────────────────┐
│                     Oct 19, 2025                                 │
│                   Deployment Day                                 │
│                                                                   │
│  Mode: Report-Only                                               │
│  Header: Content-Security-Policy-Report-Only                     │
│  Impact: Violations logged, not blocked                          │
│  Action: Intensive monitoring begins                             │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Day 1: Hourly checks
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Oct 21, 2025                                 │
│                   Mid-Week Review                                │
│                                                                   │
│  Review: CSP violation reports                                   │
│  Analyze: Patterns and trends                                    │
│  Action: Adjust whitelist if needed                              │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Day 3-6: Daily monitoring
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Oct 24, 2025                                 │
│                Pre-Enforcement Check                             │
│                                                                   │
│  Verify: Zero critical violations                                │
│  Test: All functionality works                                   │
│  Prepare: For enforcement switch                                 │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Day 6: Final preparations
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Oct 26, 2025                                 │
│                 Enforcement Switch Day                           │
│                   (AUTOMATIC)                                    │
│                                                                   │
│  Mode: Enforce                                                   │
│  Header: Content-Security-Policy (enforced)                      │
│  Impact: Violations now blocked                                  │
│  Trigger: Date-based in middleware.ts:                           │
│                                                                   │
│  if (now > cspMonitoringEnd) {                                   │
│    response.headers.set('Content-Security-Policy', cspValue);   │
│  }                                                                │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Day 7: Post-enforcement validation
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Oct 27, 2025                                 │
│                Post-Enforcement Day                              │
│                                                                   │
│  Mode: Enforced                                                  │
│  Verify: No blocked resources                                    │
│  Monitor: User reports                                           │
│  Validate: All features work                                     │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Week 2: Standard monitoring
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Nov 2, 2025                                  │
│                  Success Validation                              │
│                                                                   │
│  Generate: Final report                                          │
│  Document: Lessons learned                                       │
│  Archive: Violation logs                                         │
│  Status: COMPLETE                                                │
└─────────────────────────────────────────────────────────────────┘
```

## Security Headers Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                     HTTP Response                                │
└─────────────────────────────────────────────────────────────────┘
  │
  ├─► Content-Security-Policy-Report-Only (Oct 19-26)
  │   OR
  ├─► Content-Security-Policy (After Oct 26)
  │   └─► default-src 'self'
  │   └─► script-src 'self' 'nonce-{random}' 'strict-dynamic' plausible.io
  │   └─► style-src 'self' 'nonce-{random}' 'unsafe-inline' fonts.googleapis.com
  │   └─► img-src 'self' data: https: blob:
  │   └─► font-src 'self' fonts.gstatic.com data:
  │   └─► connect-src 'self' plausible.io vitals.vercel-insights.com
  │   └─► object-src 'none'
  │   └─► base-uri 'self'
  │   └─► frame-ancestors 'none'
  │   └─► form-action 'self'
  │   └─► upgrade-insecure-requests
  │   └─► report-uri /api/csp-report
  │
  ├─► Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  │   └─► Forces HTTPS for 2 years
  │   └─► Includes all subdomains
  │   └─► Eligible for browser preload list
  │
  ├─► X-Frame-Options: DENY
  │   └─► Prevents ALL iframe embedding
  │   └─► Clickjacking protection
  │
  ├─► X-Content-Type-Options: nosniff
  │   └─► Forces declared Content-Type
  │   └─► Prevents MIME sniffing attacks
  │
  ├─► Referrer-Policy: strict-origin-when-cross-origin
  │   └─► Same-origin: Full URL
  │   └─► Cross-origin HTTPS: Origin only
  │   └─► HTTPS→HTTP: No referrer
  │
  ├─► Permissions-Policy: camera=(), microphone=(), geolocation=(), ...
  │   └─► Blocks unused browser APIs
  │   └─► Privacy protection
  │
  ├─► Cross-Origin-Opener-Policy: same-origin
  │   └─► Isolates browsing context
  │   └─► Prevents Spectre-like attacks
  │
  ├─► Cross-Origin-Resource-Policy: same-origin
  │   └─► Protects resources from cross-origin access
  │   └─► Defense in depth
  │
  └─► x-nonce: {random-16-bytes}
      └─► Available to components via headers()
      └─► Used in <Script nonce={nonce} />
```

## Whitelist Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│              Allowed Third-Party Domains                         │
│                   (Minimal Whitelist)                            │
└─────────────────────────────────────────────────────────────────┘
  │
  ├─► plausible.io
  │   ├─► script-src: Load analytics script
  │   ├─► connect-src: Send analytics events
  │   └─► Purpose: Privacy-friendly analytics (cookieless)
  │
  ├─► vitals.vercel-insights.com
  │   ├─► connect-src: Send Core Web Vitals
  │   └─► Purpose: Performance monitoring
  │
  ├─► fonts.googleapis.com
  │   ├─► style-src: Load font CSS
  │   └─► Purpose: Google Fonts stylesheets
  │
  └─► fonts.gstatic.com
      ├─► font-src: Load font files (woff2, etc.)
      └─► Purpose: Google Fonts CDN

Total: 4 domains (NO wildcards)
```

## Rollback Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              Critical Issue Detected                             │
│         (User-facing breakage or violations)                     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │  Assess Severity     │
                 └──────────┬───────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
    ┌──────────────────┐        ┌──────────────────┐
    │  Minor Issue     │        │ Critical Issue   │
    │  (e.g., false    │        │ (e.g., forms     │
    │   positive)      │        │   broken)        │
    └─────┬────────────┘        └────────┬─────────┘
          │                              │
          ▼                              ▼
    ┌──────────────────┐        ┌──────────────────┐
    │ Adjust Whitelist │        │ Emergency        │
    │ Add domain to    │        │ Rollback         │
    │ CSP directives   │        │                  │
    └─────┬────────────┘        └────────┬─────────┘
          │                              │
          ▼                              ▼
    ┌──────────────────┐        ┌──────────────────┐
    │ Deploy update    │        │ Comment out CSP  │
    │ ~5 minutes       │        │ in middleware    │
    └─────┬────────────┘        └────────┬─────────┘
          │                              │
          ▼                              ▼
    ┌──────────────────┐        ┌──────────────────┐
    │ Verify fix       │        │ Deploy           │
    │                  │        │ IMMEDIATELY      │
    └──────────────────┘        └────────┬─────────┘
                                         │
                                         ▼
                                ┌──────────────────┐
                                │ Verify CSP       │
                                │ disabled         │
                                └────────┬─────────┘
                                         │
                                         ▼
                                ┌──────────────────┐
                                │ Investigate      │
                                │ root cause       │
                                └──────────────────┘
```

---

**Diagram Version:** 1.0  
**Last Updated:** October 19, 2025  
**Status:** Production Ready
