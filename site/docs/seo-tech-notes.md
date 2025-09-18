PWA registration and verification

- Mount point: `src/app/layout.tsx` renders `PWAInstaller` at the end of `<body>`.
- Client-only: dynamically imported with `ssr: false` to avoid server render.
- Prod-only: guarded with `process.env.NODE_ENV === 'production'` to prevent dev registration.
- Registration: registers existing `/_root/sw.js` path (`/sw.js` from `public`) and waits for `navigator.serviceWorker.ready`; updates are handled silently without UI.
- Performance: registration deferred until `load` and scheduled on `requestIdleCallback` when available; respects `prefers-reduced-motion`.
- Headers/CSP: untouched; service worker served from `public/sw.js` with existing caching policy from `next.config.mjs`.

How to verify in DevTools

1) Local production run
   - Build and start:
     - `cd site`
     - `npm run build && npm run start`
   - Open Chrome > Application panel > Service Workers.
   - Expect: SW activated and running, scope `/`, no console errors.

2) Offline check
   - Visit `/`, `/diensten`, `/contact` online once.
   - Go offline (DevTools > Network > Offline) and reload those routes.
   - Expect: Offline fallback (`/offline.html`) or controlled 503 from SW, not a generic browser error.

3) CI check
   - `npm run test:pwa` runs a headless check using Puppeteer after a production build to assert `navigator.serviceWorker.controller` across key routes.

Core Web Vitals

- No UI added; registration deferred to avoid main-thread cost on first paint.
- Document baseline and post-change metrics in PR using existing Lighthouse workflow (`npm run perf:test`).
