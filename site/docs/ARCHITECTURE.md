# Architecture Reference

> Complete technical architecture documentation for ProWeb Studio

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15.5 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 3.4 |
| 3D | Three.js 0.182, React Three Fiber 9.4, Drei 10.7 |
| Language | TypeScript 5.9 (strict mode) |
| Hosting | Vercel (Edge + Node.js runtimes) |
| Analytics | Plausible (privacy-first) |
| Caching | Upstash Redis (rate limiting) |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (routes)/           # Page routes
│   ├── api/                # API routes
│   └── layout.tsx          # Root layout with metadata
├── components/
│   ├── schemas/            # ⭐ Modular SEO Schema System
│   ├── cookies/            # Cookie consent (16 files)
│   ├── 3d/                 # Client-side 3D wrappers
│   ├── faq/                # FAQ components
│   ├── sections/           # Page sections
│   └── ui/                 # Shared UI components
├── three/                  # React Three Fiber scenes
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities, API, helpers
├── config/                 # Site configuration
└── types/                  # TypeScript types
```

---

## SEO Schema Architecture

Refactored from 3017-line monolith to modular system:

```
components/schemas/
├── index.tsx      # Main composer (120 lines)
├── utils.ts       # Shared utilities
├── core.ts        # Website, Organization, LocalBusiness
├── dutch.ts       # KVK, SBI, Compliance schemas
├── services.ts    # Service-specific schemas
├── breadcrumbs.ts # Navigation breadcrumbs
└── content.ts     # FAQ, HowTo, Article
```

**Usage:**
```tsx
import SEOSchema from '@/components/SEOSchema';

<SEOSchema
  pageType="homepage"
  includeFAQ={true}
/>
```

---

## 3D Architecture

### Component Hierarchy
```
HeroCanvas (wrapper)
└── Canvas (R3F)
    └── Suspense
        └── Scene (HeroScene, DigitalGalaxyScene, etc.)
            ├── Lighting
            ├── Geometry
            └── Effects
```

### Performance Optimization
- `useDeviceCapabilities` — Detect GPU tier, adjust DPR/shadows
- `useWebGLRecovery` — Handle context loss gracefully
- LOD system in complex scenes
- Async chunk loading for Three.js

### Available Scenes (17 total)
- `HeroScene` — Homepage portal effect
- `DigitalGalaxyScene` — Service planets galaxy
- `PortfolioScene` — Project showcase
- `CityHeroScene` — City landing pages
- See `src/three/README.md` for complete list

---

## Cookie Consent System

**Components:**
- `CookieConsentBanner` — Main banner UI
- `ConsentAwareAnalytics` — Conditional script loading
- `useCookieConsent` — State management hook

**Flow:**
1. Banner appears on first visit
2. User chooses: Accept All / Reject All / Customize
3. Consent stored in cookie (`proweb_consent`)
4. Analytics scripts only load after consent

**Compliance:** AVG/GDPR compliant, physically blocks tracking before consent.

---

## Middleware

`src/middleware.ts` handles:
- Bot detection & blocking
- Rate limiting (Upstash)
- Suspicious pattern detection
- CSP nonce generation
- Geographic optimization (Dutch users)
- Preview deployment noindex

---

## API Routes

| Route | Purpose |
|-------|---------|
| `/api/contact` | Contact form submission |
| `/api/csp-report` | CSP violation reporting |

All routes include:
- Rate limiting
- Input validation (Zod)
- Error handling

---

## Configuration Files

| File | Purpose |
|------|---------|
| `next.config.mjs` | Next.js configuration |
| `tailwind.config.ts` | Tailwind CSS theme |
| `tsconfig.json` | TypeScript settings |
| `lighthouserc.json` | Lighthouse CI thresholds |
| `vercel.json` | Vercel routing & headers |
| `eslint.config.mjs` | ESLint flat config |

---

## Scripts Reference

```bash
# Development
npm run dev              # Start with Turbopack
npm run dev:perf         # With performance monitoring

# Build
npm run build            # Production build
npm run build:prod       # With env validation
npm run build:analyze    # With bundle analyzer

# Quality
npm run typecheck        # TypeScript check
npm run lint             # ESLint
npm run format           # Prettier

# Testing
npm run test             # Vitest unit tests
npm run test:e2e         # Playwright E2E
npm run lhci:collect     # Lighthouse CI

# SEO
npm run seo:preflight    # Pre-deployment checks
npm run validate:sitemap # Sitemap validation
```

---

## Related Documentation

- [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md) — Production deployment
- [SECURITY.md](./SECURITY.md) — Security implementation
- [PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md) — Performance guide
- [LEGAL_COMPLIANCE.md](./LEGAL_COMPLIANCE.md) — Dutch legal requirements
