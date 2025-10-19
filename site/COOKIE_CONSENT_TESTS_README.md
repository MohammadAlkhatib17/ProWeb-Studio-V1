# Cookie Consent Test Suite - Quick Reference

## ✅ All Tests Passing: 34/34

## Running Tests

### Run All Cookie Consent Tests
```bash
npm test -- --run src/components/cookies/__tests__/
```

### Run Specific Test File
```bash
# Banner tests (16 tests)
npm test -- --run src/components/cookies/__tests__/CookieConsentBanner.test.tsx

# Analytics tests (18 tests)
npm test -- --run src/components/cookies/__tests__/ConsentAwareAnalytics.test.tsx
```

### Watch Mode
```bash
npm test src/components/cookies/__tests__/
```

## What's Tested

### 1. Cookie Banner (16 tests)
✅ Banner appears within 500ms on first visit  
✅ Banner hidden when consent exists  
✅ Backdrop overlay with proper z-index  
✅ Accept/Reject/Settings button interactions  
✅ ESC key to close  
✅ Accessibility (ARIA labels, modal, 44px touch targets)  
✅ Dutch privacy messaging  
✅ Layout shift prevention

### 2. Analytics Injection (18 tests)
✅ NO analytics script before consent  
✅ Analytics script injected ONLY after consent  
✅ Correct script attributes (`defer`, `data-domain`, `nonce`)  
✅ Dynamic consent changes (grant → revoke → grant)  
✅ Event listeners (setup + cleanup)  
✅ CSP compliance with nonce  
✅ Plausible global cleanup on revoke

## Key Test Patterns

### Timing Tests (No Flaky Timers)
```javascript
vi.useFakeTimers();
vi.advanceTimersByTime(100);
expect(banner).toBeInTheDocument();
```

### Analytics Verification
```javascript
// Before consent
expect(container.querySelector('script[src*="plausible.io"]')).not.toBeInTheDocument();

// After consent
await waitFor(() => {
  const script = container.querySelector('script[data-testid="analytics-script"]');
  expect(script).toHaveAttribute('src', 'https://plausible.io/js/script.js');
});
```

### Cookie Management
```javascript
// Tests automatically clear cookies before each test
// No manual cleanup needed
```

## Files

- `src/components/cookies/__tests__/CookieConsentBanner.test.tsx`
- `src/components/cookies/__tests__/ConsentAwareAnalytics.test.tsx`
- `src/__tests__/3d-canvas-consent-independence.test.tsx` (needs refinement)
- `src/__tests__/cookie-consent-integration.test.tsx` (needs refinement)

## CI Integration

Add to your CI pipeline:
```yaml
- name: Run Cookie Consent Tests
  run: npm test -- --run src/components/cookies/__tests__/
```

## Coverage

- **34 passing tests**
- **Zero app code changes** (test-only)
- **Deterministic** (no flaky timers)
- **Fast** (~250ms total)

---

📚 **Full documentation:** See `COOKIE_CONSENT_TESTS_SUMMARY.md`
