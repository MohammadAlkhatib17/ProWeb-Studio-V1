# ProWeb Studio

> **Digitale innovatie met kosmische impact** — Next.js 15 + React 19 + Three.js

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)

---

## Quick Start

```bash
# Install dependencies
npm install

# Development (Turbopack)
npm run dev

# Production build
npm run build:prod

# Type check
npm run typecheck

# Lint
npm run lint

# Tests
npm run test           # Unit tests (Vitest)
npm run test:e2e       # E2E tests (Playwright)
```

---

## Architecture Overview

```
site/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/
│   │   ├── schemas/            # 🆕 Modular SEO Schema system
│   │   │   ├── index.tsx       # Main composer
│   │   │   ├── core.ts         # Website, Org, LocalBusiness
│   │   │   ├── dutch.ts        # KVK, SBI, compliance
│   │   │   ├── services.ts     # Service schemas
│   │   │   ├── breadcrumbs.ts  # Navigation
│   │   │   └── content.ts      # FAQ, HowTo, Article
│   │   ├── cookies/            # AVG/GDPR consent system
│   │   ├── 3d/                 # Client-side 3D wrappers
│   │   └── ...                 # UI components
│   ├── three/                  # React Three Fiber scenes
│   ├── hooks/
│   │   ├── useDeviceCapabilities.ts
│   │   └── useWebGLRecovery.ts # 🆕 WebGL context recovery
│   ├── lib/                    # Utilities & API
│   └── config/                 # Site configuration
├── tests/e2e/                  # Playwright E2E tests
│   ├── accessibility.spec.ts   # 🆕 WCAG 2.1 AA (axe-core)
│   └── cookie-consent-first-load.spec.ts
└── docs/                       # Technical documentation
```

---

## Key Features

### 🎮 3D Experiences (Three.js)
- **17 WebGL scenes** with React Three Fiber
- Device capability detection & LOD optimization
- WebGL context recovery mechanism
- Performance targets: <2s load, <100MB RAM, 60fps

### 🇳🇱 Dutch Market Optimization
- Complete Schema.org structured data (KVK, SBI, BTW)
- AVG/GDPR compliant cookie consent
- Dutch language metadata & geo-targeting
- Local SEO for 40+ Dutch cities

### 🔒 Security & Compliance
- CSP headers with nonce support
- Rate limiting (Upstash Redis)
- Bot detection & suspicious pattern blocking
- HSTS preload enabled

### 📊 Performance
- Lighthouse thresholds: Performance 90%, SEO 100%, Best Practices 95%
- Core Web Vitals optimized
- Image optimization (AVIF/WebP)
- Edge caching for Dutch users

---

## Testing

### Unit Tests
```bash
npm run test              # Run all
npm run test:coverage     # With coverage
```

### E2E Tests
```bash
npm run test:e2e          # Full suite
npm run test:e2e:ci       # CI mode
```

### Accessibility (WCAG 2.1 AA)
```bash
npm run test:e2e -- --grep="Accessibility"
```
Uses `@axe-core/playwright` for automated compliance testing.

### Performance
```bash
npm run lhci:collect      # Desktop Lighthouse
npm run lhci:collect:mobile  # Mobile
```

---

## CI/CD

**GitHub Workflows:**
- `ci.yml` — Lint, typecheck, bundle analysis
- `lhci.yml` — Lighthouse performance gates
- `vercel-deploy.yml` — Vercel deployment

**Quality Gates:**
- ESLint + Prettier pre-commit hooks
- TypeScript strict mode
- Bundle size monitoring
- Lighthouse performance thresholds

---

## Environment Variables

See `docs/DEPLOY_CHECKLIST.md` for complete setup.

**Required:**
```env
SITE_URL=https://prowebstudio.nl
NEXT_PUBLIC_SITE_URL=https://prowebstudio.nl
CONTACT_INBOX=contact@prowebstudio.nl
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=...
RECAPTCHA_SECRET_KEY=...
```

---

## Documentation

| Guide | Description |
|-------|-------------|
| [docs/DEPLOY_CHECKLIST.md](docs/DEPLOY_CHECKLIST.md) | Production deployment guide |
| [docs/SECURITY.md](docs/SECURITY.md) | Security implementation |
| [docs/PERFORMANCE_OPTIMIZATION.md](docs/PERFORMANCE_OPTIMIZATION.md) | Performance best practices |
| [src/three/README.md](src/three/README.md) | 3D component guide |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Complete architecture reference |
| [docs/LEGAL_COMPLIANCE.md](docs/LEGAL_COMPLIANCE.md) | Dutch legal requirements |

---

## License

© 2024-2026 ProWeb Studio. All rights reserved.

KVK: 93769865 | BTW: NL005041113B60
