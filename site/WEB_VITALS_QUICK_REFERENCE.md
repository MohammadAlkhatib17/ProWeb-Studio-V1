# Web Vitals Optimization Quick Reference

## 🎯 Quick Start

### Verify Implementation
```bash
# Check monitoring dashboard
Open browser → Navigate to /app/_internal/monitoring

# Look for:
✓ P75 INP ≤ 200ms (green indicator)
✓ Reduced "Poor" ratings percentage
✓ Higher "Good" ratings percentage
```

### Test Optimizations

#### 1. Contact Form (site/src/components/SecureContactForm.tsx)
```bash
Action: Type rapidly in form fields
Expected: Smooth input, validation appears after you stop typing
Optimization: 500ms debounced validation + useTransition
```

#### 2. Header Scroll (site/src/components/Header.tsx)
```bash
Action: Scroll page up/down rapidly
Expected: Smooth scrolling, no jank
Optimization: RAF-throttled scroll handler
```

#### 3. Footer Newsletter (site/src/components/Footer.tsx)
```bash
Action: Type email address
Expected: No input lag
Optimization: 300ms debounced state update
```

---

## 🔧 New Hooks Usage

### Debouncing
```typescript
import { useDebounce, useDebouncedCallback } from '@/hooks/useDebounce';

// Debounce a value
const debouncedSearch = useDebounce(searchTerm, 300);

// Debounce a callback
const handleSearch = useDebouncedCallback((term: string) => {
  // Expensive search operation
}, 500);
```

### Throttling
```typescript
import { useThrottle, useRAFThrottle } from '@/hooks/useThrottle';

// Throttle scroll handler (best for visual updates)
const handleScroll = useRAFThrottle(() => {
  setScrollPosition(window.scrollY);
});

// Throttle by time interval
const handleResize = useThrottledCallback(() => {
  // Expensive layout calculation
}, 200);
```

### Idle Scheduling
```typescript
import { useIdleCallback } from '@/hooks/useIdleCallback';

// Defer non-critical work
useIdleCallback(() => {
  // Load analytics, widgets, etc.
}, { timeout: 3000 });
```

### Lazy Loading
```typescript
import { useLazyComponent, useDeferredResource } from '@/hooks/useLazyComponent';

// Lazy load component during idle time
const { Component } = useLazyComponent(
  () => import('./HeavyWidget'),
  { waitForInput: true, timeout: 5000 }
);

// Defer image loading
const shouldLoadImage = useDeferredResource({ timeout: 2000 });
{shouldLoadImage && <img src="/heavy-image.jpg" />}
```

---

## 📊 Monitoring Dashboard

### Access
```
URL: /app/_internal/monitoring
Auth: Available in dev, requires NEXT_PUBLIC_ENABLE_MONITORING=true in prod
```

### Key Metrics
| Metric | Target | Good | Needs Improvement | Poor |
|--------|--------|------|-------------------|------|
| **INP** | ≤200ms | ≤200ms | 200-500ms | >500ms |
| **LCP** | ≤2500ms | ≤2500ms | 2500-4000ms | >4000ms |
| **CLS** | ≤0.1 | ≤0.1 | 0.1-0.25 | >0.25 |

### P75 Indicators
- **P75 INP**: 75th percentile of all INP measurements (target: ≤200ms)
- **Green ✓**: Target met
- **Red ✗**: Target not met
- **Yellow highlight**: Metric needs attention

---

## 🔍 Performance Debugging

### Chrome DevTools
```bash
1. Open DevTools (F12)
2. Go to Performance tab
3. Click Record (Ctrl+E)
4. Interact with page (type in forms, scroll, click)
5. Stop recording
6. Check:
   - Web Vitals section (INP, LCP, CLS)
   - Bottom-Up tab (long tasks > 50ms)
   - Main thread activity
```

### Console Logging (Development)
```javascript
// INP events are auto-logged in development
[INP Attribution] {
  value: 156,
  rating: 'good',
  eventType: 'click',
  eventTarget: 'BUTTON',
  inputDelay: 8,
  processingDuration: 125,
  presentationDelay: 23
}
```

---

## ⚡ Performance Tips

### Do's ✅
- ✅ Debounce input handlers (300-500ms)
- ✅ Throttle scroll/resize with rAF
- ✅ Defer non-critical work to idle time
- ✅ Use `useTransition` for heavy updates
- ✅ Lazy-load below-the-fold content
- ✅ Monitor P75 metrics, not just averages

### Don'ts ❌
- ❌ Validate on every keystroke
- ❌ Update state in scroll handlers directly
- ❌ Load all widgets on page load
- ❌ Block main thread during interactions
- ❌ Ignore P75 outliers
- ❌ Optimize based on averages alone

---

## 🚨 Troubleshooting

### High INP (>200ms)
```typescript
// Check for:
1. Synchronous validation in event handlers
2. Heavy computations in onClick/onChange
3. Blocking third-party scripts
4. Large DOM updates during interactions

// Solutions:
- Add debouncing: useDebouncedCallback(fn, 500)
- Defer updates: startTransition(() => setState(...))
- Split work: useIdleCallback for non-critical tasks
```

### Long Tasks (>50ms)
```typescript
// Check for:
1. Unthrottled scroll/resize handlers
2. Expensive render operations
3. Synchronous API calls
4. Large list rendering

// Solutions:
- Throttle: useRAFThrottle(handler)
- Virtualize lists: use react-window
- Debounce searches: useDebounce(query, 300)
```

### Layout Shift (CLS)
```typescript
// Not addressed in this implementation
// (No visual changes made per requirements)
```

---

## 📦 Files Reference

### Hooks (site/src/hooks/)
- `useDebounce.ts` - Input debouncing
- `useThrottle.ts` - Event throttling
- `useIdleCallback.ts` - Idle scheduling
- `useLazyComponent.ts` - Lazy loading

### Components (site/src/components/)
- `SecureContactForm.tsx` - Debounced form validation
- `Header.tsx` - RAF-throttled scroll
- `Footer.tsx` - Debounced newsletter input
- `RealUserVitals.tsx` - INP attribution logging

### Monitoring (site/src/app/_internal/monitoring/)
- `page.tsx` - P75 metrics dashboard

### Types (site/src/lib/monitoring/)
- `types.ts` - MonitoringStats with P75 fields

---

## 🎯 Acceptance Criteria Checklist

- [ ] **RUM Dashboard**: Shows P75 INP ≤ 200ms
  - Navigate to `/app/_internal/monitoring`
  - Check "P75 INP Target" card
  - Verify green ✓ indicator

- [ ] **Long Tasks Reduction**: ≥30% fewer long tasks
  - Record performance profile (DevTools)
  - Count long tasks before/after
  - Verify 30%+ reduction

- [ ] **No Accessibility/SEO Regression**
  - Run Lighthouse audit
  - Check Accessibility score (should be 100%)
  - Check SEO score (should be 100%)

---

## 🔗 Related Documentation

- Full Implementation: `WEB_VITALS_INP_OPTIMIZATION_SUMMARY.md`
- Web Vitals: https://web.dev/vitals/
- INP Optimization: https://web.dev/optimize-inp/
- React Performance: https://react.dev/learn/render-and-commit

---

**Last Updated**: October 19, 2025  
**Status**: ✅ Ready for Testing
