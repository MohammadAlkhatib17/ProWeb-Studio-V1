# E2E Testing: Cookie Banner & 3D Canvas Independence

## Overview

This test suite validates critical UX requirements for the cookie consent banner and 3D canvas rendering on fresh user profiles (no cookies).

**CI Budget:** <3 minutes total  
**Browser:** Headless Chromium  
**Network:** Localhost only (no external dependencies)

---

## Test Coverage

### 1. Cookie Banner Performance
- ✅ Banner appears within **500ms** on fresh profile
- ✅ Banner is **interactive** within 500ms
- ✅ No hydration errors or warnings

### 2. 3D Canvas Independence
- ✅ Canvas renders **before** consent is given
- ✅ Canvas remains visible **after rejecting** consent
- ✅ WebGL context initializes correctly
- ✅ Canvas has valid dimensions

### 3. Console Validation
- ✅ No hydration-related errors
- ✅ No cookie/consent-related errors
- ✅ Clean console output during initialization

### 4. Parallel Rendering
- ✅ Banner and canvas render simultaneously (not sequentially)
- ✅ Total load time <2 seconds

---

## Running Tests

### Local Development
```bash
cd site

# Run with UI (recommended for debugging)
npm run test:e2e

# Run in headless mode (CI-style)
npm run test:e2e:ci
```

### CI Pipeline
Tests run automatically on every PR via `.github/workflows/ci.yml`:
- Job name: `e2e-tests`
- Runs after `quality-checks` job
- Fails PR if any test fails

---

## File Structure

```
site/
├── tests/
│   └── e2e/
│       └── banner-canvas.spec.ts    # Test suite
├── playwright.config.ts              # Playwright configuration
└── package.json                      # Scripts: test:e2e, test:e2e:ci
```

---

## Configuration

### Playwright Config (`playwright.config.ts`)
- **Browser:** Chromium (headless in CI)
- **Base URL:** `http://localhost:3000`
- **Viewport:** 1280x720
- **Timeout:** 30s per test, 10s per assertion
- **Retries:** 1 retry on CI, 0 locally
- **Web Server:** Auto-builds and starts Next.js

### Environment
- Uses CI environment variables from `.env.ci`
- Production build mode (`NODE_ENV=production`)
- No external network requests

---

## Test Scenarios

### Test 1: Banner Visibility Timing
```typescript
test('cookie banner visible within 500ms on fresh profile')
```
**Validates:**
- Banner appears ≤500ms after page load
- Uses `domcontentloaded` event
- Fails if timeout exceeded

**Selectors:**
- `[data-testid="cookie-consent-banner"]`
- `[role="dialog"][aria-label*="cookie"]`
- `.cookie-banner`

---

### Test 2: Canvas Before Consent
```typescript
test('3D canvas present before consent given')
```
**Validates:**
- `<canvas>` element exists before user interaction
- WebGL context initializes successfully
- Canvas is visible within 2 seconds

---

### Test 3: Canvas After Rejection
```typescript
test('canvas remains visible after rejecting consent')
```
**Validates:**
- Canvas persists after clicking "Reject"
- No conditional rendering based on consent state

**Selectors:**
- `button:has-text("Reject")`
- `button:has-text("Decline")`
- `[data-testid="cookie-reject"]`

---

### Test 4: Console Hygiene
```typescript
test('no console errors related to hydration or cookies')
```
**Validates:**
- Zero console errors containing "cookie", "consent", "hydration"
- No React hydration warnings
- Clean console after 2-second settle period

---

### Test 5: Interactive Performance
```typescript
test('performance: banner interactive within 500ms')
```
**Validates:**
- Accept button is clickable ≤500ms
- Button responds to click event
- No UI blocking during hydration

---

### Test 6: Canvas Dimensions
```typescript
test('3D canvas has valid dimensions')
```
**Validates:**
- Canvas width > 0
- Canvas height > 0
- Proper CSS layout (no zero-sized elements)

---

### Test 7: Simultaneous Rendering
```typescript
test('both banner and canvas render simultaneously')
```
**Validates:**
- Banner and canvas appear in parallel
- Total load time <2 seconds
- No sequential blocking

---

## Acceptance Criteria

### ✅ CI Passes If:
1. Cookie banner appears **<500ms** on fresh profile
2. 3D canvas renders **before** consent interaction
3. **Zero** console errors related to:
   - Hydration
   - Cookies
   - Consent
4. All 7 test scenarios pass

### ❌ CI Fails If:
1. Banner timing **>500ms**
2. Canvas missing/broken before consent
3. Any hydration errors in console
4. Any test scenario fails

---

## Debugging Failed Tests

### Banner Not Found
```bash
# Check selectors in site/src/components/CookieConsentBanner.tsx
# Ensure data-testid="cookie-consent-banner" is present
```

### Canvas Not Rendering
```bash
# Verify 3D components in site/src/components/
# Check Dynamic3DWrapper.tsx for conditional rendering
# Review 3D_CONSENT_INDEPENDENCE_QUICK_REF.md
```

### Hydration Errors
```bash
# Review COOKIE_BANNER_HYDRATION_QUICK_REF.md
# Check component order in site/src/app/layout.tsx
# Ensure CookieConsentBanner is first in <body>
```

### Timeout Issues
```bash
# Increase timeout in playwright.config.ts (last resort)
# Check build time in CI logs
# Verify network tab shows no blocking requests
```

---

## Monitoring

### CI Metrics to Track
- **E2E test duration** (target: <3 minutes)
- **Banner timing** (target: <500ms, average <300ms)
- **Test flakiness** (target: 0% flaky tests)

### Local Performance Profiling
```bash
# Run with Playwright trace viewer
npx playwright test --trace on
npx playwright show-trace trace.zip
```

---

## Architecture References

- [3D_CONSENT_INDEPENDENCE_QUICK_REF.md](../3D_CONSENT_INDEPENDENCE_QUICK_REF.md) - 3D rendering independence
- [COOKIE_BANNER_HYDRATION_QUICK_REF.md](../COOKIE_BANNER_HYDRATION_QUICK_REF.md) - Banner optimization
- [COOKIE_CONSENT_ARCHITECTURE.md](../../COOKIE_CONSENT_ARCHITECTURE.md) - Overall consent system

---

## Maintenance

### Adding New Tests
1. Create test in `tests/e2e/banner-canvas.spec.ts`
2. Follow naming: `test('descriptive name')`
3. Keep test duration <10 seconds
4. Use strict timeouts (fail fast)

### Updating Selectors
1. Prefer `data-testid` attributes
2. Fallback to semantic selectors (`role`, `aria-label`)
3. Avoid brittle class selectors

### CI Budget
Current: ~2 minutes  
Budget: <3 minutes  
Headroom: ~1 minute

---

## Troubleshooting

### "Cannot find module '@playwright/test'"
```bash
cd site
npm install
npx playwright install chromium
```

### "Browser not found"
```bash
npx playwright install --with-deps chromium
```

### "Server already running" error
```bash
# Kill existing Next.js server
lsof -ti:3000 | xargs kill -9
```

### Tests pass locally, fail in CI
```bash
# Run in CI mode locally
CI=true npm run test:e2e:ci

# Check CI environment variables
cat .env.ci
```

---

**Last Updated:** October 19, 2025  
**CI Job:** `e2e-tests` in `.github/workflows/ci.yml`  
**Contact:** #performance-optimization channel
