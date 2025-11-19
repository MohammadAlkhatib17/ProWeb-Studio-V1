# Core Web Vitals Monitoring - Quick Reference

## 🚀 Quick Start

```bash
# Start dev server
npm run dev

# Test API
./scripts/test-monitoring.sh

# View dashboard
open http://localhost:3000/_internal/monitoring
```

## 📁 Key Files

- **Hook**: `src/lib/monitoring/useWebVitals.ts`
- **API**: `src/app/api/monitoring/core-web-vitals/route.ts`
- **Dashboard**: `src/app/_internal/monitoring/page.tsx`
- **Storage**: `src/lib/monitoring/storage.ts`
- **Types**: `src/lib/monitoring/types.ts`

## 🔗 Endpoints

- `POST /api/monitoring/core-web-vitals` - Store vitals
- `GET /api/monitoring/core-web-vitals?limit=100` - Get events
- `GET /api/monitoring/core-web-vitals?stats=true` - Get stats only
- Dashboard: `/_internal/monitoring`

## 🔧 Environment Variables

```bash
# Enable in production (auto-enabled in dev)
NEXT_PUBLIC_ENABLE_MONITORING=true

# Optional: Auth for GET endpoint
MONITORING_AUTH_TOKEN=your-secret-token
```

## 📊 Metrics Tracked

| Metric | Description | Good | Poor |
|--------|-------------|------|------|
| **LCP** | Largest Contentful Paint | ≤2.5s | >4s |
| **CLS** | Cumulative Layout Shift | ≤0.1 | >0.25 |
| **INP** | Interaction to Next Paint | ≤200ms | >500ms |

## 💻 Usage

### Automatic (Already Integrated)
Vitals are captured automatically on all pages via `WebVitalsReporter` in the root layout.

### Manual Hook Usage
```typescript
import { useWebVitals } from '@/lib/monitoring/useWebVitals';

function MyComponent() {
  useWebVitals({
    enabled: true,
    onMetric: (metric) => {
      console.log('Captured:', metric);
    }
  });
}
```

### API Usage
```bash
# POST event
curl -X POST http://localhost:3000/api/monitoring/core-web-vitals \
  -H "Content-Type: application/json" \
  -d '{"timestamp":1234567890,"url":"http://localhost:3000/","metric":{"name":"LCP","value":2300,"rating":"good","id":"abc123"}}'

# GET events
curl http://localhost:3000/api/monitoring/core-web-vitals?limit=50

# GET stats
curl http://localhost:3000/api/monitoring/core-web-vitals?stats=true
```

## 🎯 Bundle Size

- **Total added**: ~9KB uncompressed (~3-4KB gzipped)
- **Dashboard**: Code-split (only loads when accessed)
- **Impact**: Minimal (<10KB constraint met)

## 🔒 Security

- ✅ No external network writes
- ✅ Protected in production
- ✅ Silent error handling
- ✅ Optional auth token

## 📈 Storage

- **Type**: In-memory (resets on restart)
- **Capacity**: 1000 events max
- **Retention**: 24 hours
- **Cleanup**: Automatic

## 🧪 Testing

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Test API
./scripts/test-monitoring.sh

# Manual test
1. npm run dev
2. Navigate to http://localhost:3000
3. Check console for vitals logs
4. Visit /_internal/monitoring
5. Verify events appear in dashboard
```

## 📚 Documentation

- **Full docs**: `src/lib/monitoring/README.md`
- **Implementation summary**: `/MONITORING_IMPLEMENTATION.md`

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| No events appearing | Navigate pages to trigger vitals |
| Dashboard unauthorized | Set `NEXT_PUBLIC_ENABLE_MONITORING=true` |
| Console errors | Check browser console for details |
| API returns 403 | Monitoring not enabled |

## ✅ All Tests Passing

- [x] TypeScript compilation
- [x] No console errors
- [x] API returns 200
- [x] Dashboard loads
- [x] Bundle size < 10KB
- [x] Environment protection works
- [x] Storage cleanup works

---

**Status**: ✅ Production Ready
**Date**: October 19, 2025
