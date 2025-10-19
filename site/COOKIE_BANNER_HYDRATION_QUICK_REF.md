# Cookie Banner Hydration - Quick Reference

> **TL;DR:** Cookie banner now loads first, heavy components deferred. Test with `./scripts/verify-cookie-banner-optimization.sh`

---

## 🎯 What Changed?

### Component Order (site/src/app/layout.tsx)
```tsx
<body>
  {/* 1. Cookie consent - FIRST for fastest hydration */}
  <CookieConsentBanner />
  <CookieSettingsModal />
  <ConsentAwareAnalytics />
  
  {/* 2. Visual layers */}
  <BackgroundLayer />
  <HeroBackground />
  <TopVignetteOverlay />
  
  {/* 3. Main content */}
  <Header />
  <main>{children}</main>
  <Footer />
  
  {/* 4. Heavy components - LAZY LOADED */}
  <CursorTrail />                  // ⚡ Now dynamic
  <DutchPerformanceMonitor />      // ⚡ Now dynamic
  <WebVitalsReporter />            // ⚡ Now dynamic
</body>
```

### Dynamic Imports
```tsx
// Top of layout.tsx
import dynamic from 'next/dynamic';

const CursorTrail = dynamic(() => import('@/components/CursorTrail'), { 
  ssr: false,
  loading: () => null 
});
```

---

## ✅ Quick Verification

```bash
# Run automated checks
cd site
./scripts/verify-cookie-banner-optimization.sh

# Expected: All ✓ green checkmarks
```

---

## 🧪 Manual Testing (1 min)

1. **Clear cookies:** Chrome DevTools → Application → Clear site data
2. **Reload page:** F5 or Cmd+R
3. **Check console:** No hydration warnings
4. **Click "Accept":** Should respond immediately

---

## 📊 Performance Targets

| Metric | Target | How to Check |
|--------|--------|--------------|
| Banner Interactive | < 500ms | Chrome DevTools Performance tab |
| Mobile LCP | < 2.5s | `npm run lighthouse:mobile` |
| CLS | < 0.02 | Lighthouse audit |
| Bundle Δ | < 5KB gz | `npm run build` |

---

## 🚨 Watch Out For

### ❌ DON'T
- Import heavy libraries in `layout.tsx` without `dynamic()`
- Add new components before `<CookieConsentBanner />`
- Remove `ssr: false` from lazy components
- Change component order without testing

### ✅ DO
- Keep cookie banner first in `<body>`
- Use `dynamic()` for new heavy components
- Run verification script after changes
- Test on mobile (4G throttling)

---

## 🔧 Adding New Heavy Components

```tsx
// 1. Import dynamically
const NewHeavyComponent = dynamic(() => import('@/components/NewHeavyComponent'), {
  ssr: false,
  loading: () => null
});

// 2. Place AFTER cookie consent
<body>
  <CookieConsentBanner />
  {/* ... other content ... */}
  <NewHeavyComponent />  {/* ✅ Lazy loaded */}
</body>
```

---

## 📈 Monitoring

### Development
```bash
# Check bundle size
npm run analyze

# Run lighthouse
npm run lighthouse:mobile

# Performance profiling
npm run dev
# Chrome DevTools > Performance > Record
```

### Production
Monitor these in analytics:
- Cookie consent acceptance rate
- Time to Interactive (TTI)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)

---

## 🐛 Common Issues

### "Hydration error" in console
**Fix:** Check `CookieConsentBanner` for server/client mismatches

### Banner slow to appear
**Fix:** Check network tab for blocking requests

### CLS increased
**Fix:** Ensure banner has fixed dimensions

### Bundle too large
**Fix:** Verify dynamic imports with `npm run analyze`

---

## 📚 Full Docs

- [COOKIE_BANNER_HYDRATION_OPTIMIZATION.md](./COOKIE_BANNER_HYDRATION_OPTIMIZATION.md) - Complete implementation details
- [COOKIE_CONSENT_ARCHITECTURE.md](../COOKIE_CONSENT_ARCHITECTURE.md) - System architecture
- [CORE_WEB_VITALS_OPTIMIZATION_GUIDE.md](../CORE_WEB_VITALS_OPTIMIZATION_GUIDE.md) - Performance guide

---

**Last Updated:** October 19, 2025  
**Contact:** #performance-optimization channel
