Summary

- Mounted `PWAInstaller` at the end of `site/src/app/layout.tsx` body via dynamic import (client-only) and guard to run only in production.
- `PWAInstaller` now headless: registers `/sw.js`, waits for `ready`, updates silently, no visible UI.
- Respects `prefers-reduced-motion` and defers registration until after `load` (and `requestIdleCallback`) to avoid impacting initial paint and CWV.
- No changes to CSP/headers; existing `/sw.js` caching policy remains intact.

How to verify

1) Production mode: `cd site && npm run build && npm run start` then open the site.
2) Chrome DevTools > Application > Service Workers: should show an active SW with scope covering the site. No console errors.
3) Offline behavior: After one online visit, toggle Offline and reload `/`, `/diensten`, `/contact` — should serve offline fallback or SW-controlled responses.
4) CI check: `npm run test:pwa` asserts `navigator.serviceWorker.controller` on key routes.
5) CWV: Run `npm run perf:test` and confirm no degradation on first load compared to baseline.
