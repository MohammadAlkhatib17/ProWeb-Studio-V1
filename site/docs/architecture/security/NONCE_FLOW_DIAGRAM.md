# CSP Nonce Flow - Visual Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         REQUEST LIFECYCLE                                │
└─────────────────────────────────────────────────────────────────────────┘

  Browser Request
       │
       ▼
┌──────────────────────┐
│   middleware.ts      │
│  ┌────────────────┐  │
│  │ 1. Generate    │  │  crypto.getRandomValues(16 bytes)
│  │    Nonce       │  │  → Base64 encode
│  └────────────────┘  │  → "nonce-ABC123XYZ..."
│  ┌────────────────┐  │
│  │ 2. Set Headers │  │  requestHeaders.set('x-nonce', nonce)
│  └────────────────┘  │  response.headers.set('x-nonce', nonce)
│  ┌────────────────┐  │
│  │ 3. Build CSP   │  │  script-src 'self' 'nonce-ABC...' 'strict-dynamic'
│  └────────────────┘  │  response.headers.set('Content-Security-Policy', ...)
└──────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         layout.tsx (Server Component)                     │
│                                                                           │
│  const headersList = headers()                                           │
│  const nonce = headersList.get('x-nonce') || ''                          │
│                                                                           │
│  return (                                                                 │
│    <html>                                                                 │
│      <head>                                                               │
│        <meta property="csp-nonce" content={nonce} />  ← Next.js internal │
│      </head>                                                              │
│      <body>                                                               │
│        ┌──────────────────────────────────────┐                          │
│        │ <ConsentAwareAnalytics nonce={nonce}>│                          │
│        └──────────────────────────────────────┘                          │
│                        │                                                  │
│                        ▼                                                  │
│        ┌─────────────────────────────────────────────┐                   │
│        │  <Script                                    │                   │
│        │    src="plausible.io/js/script.js"         │                   │
│        │    nonce={nonce}  ← Matches CSP             │                   │
│        │  />                                         │                   │
│        └─────────────────────────────────────────────┘                   │
│                                                                           │
│        ┌──────────────────────────────────────┐                          │
│        │ <SEOSchema nonce={nonce} />          │                          │
│        └──────────────────────────────────────┘                          │
│                        │                                                  │
│                        ▼                                                  │
│        ┌───────────────────────────────────────────────────────┐         │
│        │  SEOSchema Component                                  │         │
│        │  ┌─────────────────────────────────────────────────┐  │         │
│        │  │ <Script id="website-schema" nonce={nonce}>     │  │         │
│        │  │   {JSON.stringify(websiteSchema)}              │  │         │
│        │  │ </Script>                                       │  │         │
│        │  └─────────────────────────────────────────────────┘  │         │
│        │  ┌─────────────────────────────────────────────────┐  │         │
│        │  │ <Script id="organization-schema" nonce={nonce}>│  │         │
│        │  │   {JSON.stringify(organizationSchema)}         │  │         │
│        │  │ </Script>                                       │  │         │
│        │  └─────────────────────────────────────────────────┘  │         │
│        │  ... (21 more schemas with unique IDs + nonce)       │         │
│        └───────────────────────────────────────────────────────┘         │
│                                                                           │
│        {children}  ← Pages can access nonce via headers()                │
│      </body>                                                              │
│    </html>                                                                │
│  )                                                                        │
└──────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                Page Components (e.g., services/page.tsx)                  │
│                                                                           │
│  import { headers } from 'next/headers'                                  │
│  import { PageStructuredData } from '@/components/metadata/...'          │
│                                                                           │
│  export default function ServicesPage() {                                │
│    return (                                                               │
│      <>                                                                   │
│        <PageStructuredData                                               │
│          pageType="services"                                             │
│          title="Diensten"                                                │
│          description="..."                                               │
│          url="https://site.com/diensten"                                 │
│        />                                                                 │
│        ... page content ...                                               │
│      </>                                                                  │
│    )                                                                      │
│  }                                                                        │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────────────┐
│            PageStructuredData Component (Server Component)                │
│                                                                           │
│  export function PageStructuredData(props) {                             │
│    const headersList = headers()                                         │
│    const nonce = headersList.get('x-nonce') || ''  ← Read from headers   │
│                                                                           │
│    const schemas = [                                                     │
│      generateOrganizationSchema(),                                       │
│      generateWebSiteSchema(),                                            │
│      generateWebPageSchema(props),                                       │
│      ... more schemas ...                                                 │
│    ]                                                                      │
│                                                                           │
│    return (                                                               │
│      <StructuredData                                                     │
│        data={schemas}                                                    │
│        nonce={nonce}                    ← Pass nonce                     │
│        id={`page-structured-data-${pageType}`}  ← Unique ID             │
│      />                                                                   │
│    )                                                                      │
│  }                                                                        │
└──────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                  StructuredData Component (Reusable)                      │
│                                                                           │
│  interface StructuredDataProps {                                         │
│    data: Record<string, unknown> | Array<...>                            │
│    nonce?: string                                                        │
│    id?: string                                                           │
│  }                                                                        │
│                                                                           │
│  export function StructuredData({                                        │
│    data,                                                                 │
│    nonce,                                                                │
│    id = 'structured-data'                                                │
│  }: StructuredDataProps) {                                               │
│                                                                           │
│    const jsonLd = Array.isArray(data)                                    │
│      ? { '@context': 'https://schema.org', '@graph': data }             │
│      : data                                                               │
│                                                                           │
│    return (                                                               │
│      <Script                                                             │
│        id={id}                  ← Unique per instance                    │
│        type="application/ld+json"                                        │
│        strategy="afterInteractive"                                       │
│        nonce={nonce}            ← CSP nonce                              │
│        dangerouslySetInnerHTML={{                                        │
│          __html: JSON.stringify(jsonLd)                                  │
│        }}                                                                 │
│      />                                                                   │
│    )                                                                      │
│  }                                                                        │
└──────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         HTML OUTPUT                                       │
│                                                                           │
│  <!DOCTYPE html>                                                         │
│  <html>                                                                  │
│    <head>                                                                │
│      <meta property="csp-nonce" content="ABC123XYZ..." />               │
│                                                                           │
│      <script                                                             │
│        id="website-schema"                                               │
│        type="application/ld+json"                                        │
│        nonce="ABC123XYZ..."      ← Matches CSP header ✓                 │
│      >                                                                    │
│        {"@context":"https://schema.org","@type":"WebSite",...}          │
│      </script>                                                           │
│                                                                           │
│      <script                                                             │
│        id="organization-schema"                                          │
│        type="application/ld+json"                                        │
│        nonce="ABC123XYZ..."      ← Matches CSP header ✓                 │
│      >                                                                    │
│        {"@context":"https://schema.org","@type":"Organization",...}     │
│      </script>                                                           │
│                                                                           │
│      <!-- 21 more schema scripts with nonce -->                          │
│                                                                           │
│      <script                                                             │
│        src="https://plausible.io/js/script.js"                          │
│        nonce="ABC123XYZ..."      ← Matches CSP header ✓                 │
│      ></script>                                                          │
│    </head>                                                               │
│    <body>...</body>                                                      │
│  </html>                                                                  │
│                                                                           │
│  Response Headers:                                                        │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ Content-Security-Policy:                                          │  │
│  │   script-src 'self' 'nonce-ABC123XYZ...' 'strict-dynamic' https:  │  │
│  │ x-nonce: ABC123XYZ...                                             │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                    BROWSER CSP ENFORCEMENT                                │
│                                                                           │
│  Browser checks each script against CSP:                                 │
│                                                                           │
│  ✓ <script nonce="ABC123XYZ..."> → ALLOWED (nonce matches)              │
│  ✓ <script nonce="ABC123XYZ..."> → ALLOWED (nonce matches)              │
│  ✓ <script nonce="ABC123XYZ..."> → ALLOWED (nonce matches)              │
│  ...                                                                      │
│  ✗ <script>malicious()</script>  → BLOCKED (no nonce)                   │
│  ✗ <script src="evil.com">       → BLOCKED (not in CSP)                 │
│                                                                           │
│  Console: [Zero CSP violations] ✓                                        │
└──────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                         COMPONENT HIERARCHY                              │
└─────────────────────────────────────────────────────────────────────────┘

RootLayout (layout.tsx)
 │
 ├─ nonce = headers().get('x-nonce')
 │
 ├─ ConsentAwareAnalytics
 │   └─ <Script nonce={nonce} src="plausible.io/..." />
 │
 ├─ SEOSchema
 │   ├─ <Script id="website-schema" nonce={nonce} />
 │   ├─ <Script id="organization-schema" nonce={nonce} />
 │   ├─ <Script id="localbusiness-schema" nonce={nonce} />
 │   ├─ <Script id="webpage-schema" nonce={nonce} />
 │   ├─ <Script id="logo-schema" nonce={nonce} />
 │   ├─ <Script id="website-service-schema" nonce={nonce} />
 │   ├─ <Script id="webshop-service-schema" nonce={nonce} />
 │   ├─ <Script id="seo-service-schema" nonce={nonce} />
 │   ├─ <Script id="primary-image-schema" nonce={nonce} /> (conditional)
 │   ├─ <Script id="breadcrumb-schema" nonce={nonce} /> (conditional)
 │   ├─ <Script id="faq-schema" nonce={nonce} /> (conditional)
 │   ├─ <Script id="howto-schema" nonce={nonce} /> (conditional)
 │   ├─ <Script id="kvk-schema" nonce={nonce} /> (conditional)
 │   ├─ <Script id="compliance-schema" nonce={nonce} />
 │   ├─ <Script id="professional-accreditation-schema" nonce={nonce} />
 │   ├─ <Script id="business-classification-schema" nonce={nonce} />
 │   ├─ <Script id="industry-compliance-schema" nonce={nonce} />
 │   ├─ <Script id="dutch-review-schema" nonce={nonce} />
 │   ├─ <Script id="google-business-profile-schema" nonce={nonce} /> (cond.)
 │   ├─ <Script id="dutch-awards-schema" nonce={nonce} />
 │   ├─ <Script id="dutch-business-article-schema" nonce={nonce} />
 │   ├─ <Script id="dutch-website-guide-schema" nonce={nonce} />
 │   └─ <Script id="dutch-seo-guide-schema" nonce={nonce} />
 │
 └─ {children} → Page Components
      │
      └─ PageStructuredData
           │
           ├─ nonce = headers().get('x-nonce')
           │
           └─ StructuredData
                └─ <Script id="page-structured-data-{pageType}" nonce={nonce} />


┌─────────────────────────────────────────────────────────────────────────┐
│                         SECURITY MODEL                                   │
└─────────────────────────────────────────────────────────────────────────┘

Request 1:  nonce = "xyz123"  →  CSP: script-src 'nonce-xyz123'
            ├─ Script #1 nonce="xyz123"  ✓ Executes
            ├─ Script #2 nonce="xyz123"  ✓ Executes
            └─ Script #3 (no nonce)      ✗ Blocked

Request 2:  nonce = "abc789"  →  CSP: script-src 'nonce-abc789'
            ├─ Script #1 nonce="abc789"  ✓ Executes
            ├─ Script #2 nonce="xyz123"  ✗ Blocked (old nonce)
            └─ Script #3 (no nonce)      ✗ Blocked

Benefits:
 • Each request gets unique nonce (not replayable)
 • Old nonces don't work on new requests
 • Injected scripts without nonce are blocked
 • XSS attacks neutralized
 • Content integrity enforced
