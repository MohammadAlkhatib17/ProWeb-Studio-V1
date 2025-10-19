# Core Web Vitals Monitoring System

Internal monitoring system for capturing and analyzing Core Web Vitals (LCP, CLS, INP).

## Features

- ✅ Client-side capture of LCP, CLS, and INP metrics
- ✅ In-memory storage with automatic cleanup (dev-safe)
- ✅ Internal dashboard for viewing recent events
- ✅ Environment-protected access
- ✅ Auto-refresh capability
- ✅ Minimal bundle impact (<10KB gzipped)

## Architecture

### Client-Side (`src/lib/monitoring/`)

- **types.ts** - TypeScript definitions for metrics and events
- **useWebVitals.ts** - React hook for capturing web vitals
- **utils.ts** - Helper functions for formatting and calculations
- **storage.ts** - In-memory event storage with cleanup
- **index.ts** - Central export point

### API Layer (`src/app/api/monitoring/`)

- **core-web-vitals/route.ts** - API endpoint for storing and retrieving metrics
  - `POST` - Store vital event (auto-enabled in dev)
  - `GET` - Retrieve events (protected)

### Dashboard (`src/app/_internal/monitoring/`)

- **page.tsx** - Internal monitoring dashboard
- Real-time statistics and event listing
- Protected by environment flag in production

## Usage

### Automatic Capture

Vitals are automatically captured on all pages via `WebVitalsReporter` in the root layout:

```tsx
// src/app/layout.tsx
import { WebVitalsReporter } from '@/components/WebVitalsReporter';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <WebVitalsReporter />
      </body>
    </html>
  );
}
```

### View Dashboard

Navigate to `/_internal/monitoring` to view captured metrics:

- Statistics cards showing averages and counts
- Real-time event table with auto-refresh
- Color-coded ratings (good/needs-improvement/poor)

### Environment Variables

```bash
# Enable monitoring in production (optional)
NEXT_PUBLIC_ENABLE_MONITORING=true

# Protect GET endpoint with auth token (optional)
MONITORING_AUTH_TOKEN=your-secret-token
```

### Access Control

- **Development**: Dashboard and API are fully accessible
- **Production without env flag**: Dashboard shows access denied
- **Production with NEXT_PUBLIC_ENABLE_MONITORING=true**: Full access
- **GET API with token**: Requires `Authorization: Bearer TOKEN` header

## API Endpoints

### POST /api/monitoring/core-web-vitals

Store a vital event:

```bash
curl -X POST http://localhost:3000/api/monitoring/core-web-vitals \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": 1234567890,
    "url": "https://example.com/",
    "metric": {
      "name": "LCP",
      "value": 2300,
      "rating": "good",
      "id": "abc123"
    }
  }'
```

Response:
```json
{
  "success": true,
  "timestamp": 1234567890
}
```

### GET /api/monitoring/core-web-vitals

Retrieve recent events:

```bash
# Development - no auth required
curl http://localhost:3000/api/monitoring/core-web-vitals?limit=50

# Production with token
curl http://localhost:3000/api/monitoring/core-web-vitals \
  -H "Authorization: Bearer your-secret-token"
```

Response:
```json
{
  "success": true,
  "events": [...],
  "count": 50
}
```

Get statistics only:
```bash
curl http://localhost:3000/api/monitoring/core-web-vitals?stats=true
```

## Bundle Size Impact

The monitoring system is designed to be lightweight:

- **Types**: ~1KB (tree-shaken)
- **Hook**: ~2KB (uses web-vitals library already in project)
- **Utils**: ~1KB
- **Total added JS**: ~4KB uncompressed, <2KB gzipped

The dashboard is code-split and only loaded when accessed.

## Storage

Events are stored **in-memory** with automatic cleanup:

- Maximum 1000 events retained
- Events older than 24 hours are automatically removed
- Storage resets on server restart (acceptable for dev monitoring)

For production persistence, extend `storage.ts` to write to:
- File system (`fs.writeFile`)
- Database (PostgreSQL, MongoDB)
- External service (Datadog, New Relic)

## Testing

1. Start the development server:
```bash
cd site
npm run dev
```

2. Navigate to any page to generate vitals

3. View the dashboard:
```
http://localhost:3000/_internal/monitoring
```

4. Check console for vitals logs (development only)

## Security

- ✅ No external network writes without env guards
- ✅ Dashboard protected in production
- ✅ API endpoint validates input
- ✅ Silent error handling (no user impact)
- ✅ Optional auth token for GET requests

## Next Steps

### Production Enhancements

1. **Persistent Storage**: Add database integration
2. **Alerts**: Trigger notifications for poor vitals
3. **Analytics**: Export to monitoring service
4. **Historical Trends**: Chart vitals over time
5. **Filtering**: Add URL/device/connection filters

### Example Database Integration

```typescript
// src/lib/monitoring/storage.ts
import { db } from '@/lib/db';

export async function addVitalEvent(event: VitalEvent): Promise<void> {
  await db.vitalEvents.create({
    data: event
  });
}

export async function getVitalEvents(limit: number): Promise<VitalEvent[]> {
  return db.vitalEvents.findMany({
    take: limit,
    orderBy: { timestamp: 'desc' }
  });
}
```

## Troubleshooting

### No events appearing

1. Check that you're navigating pages (vitals only fire on interaction)
2. Verify console for any errors
3. Ensure monitoring is enabled (`isMonitoringEnabled()`)

### Dashboard shows "Unauthorized"

1. In production, set `NEXT_PUBLIC_ENABLE_MONITORING=true`
2. Or add `MONITORING_AUTH_TOKEN` and pass in GET requests

### High memory usage

1. Reduce `MAX_EVENTS` in `storage.ts`
2. Decrease `MAX_AGE_MS` for faster cleanup
3. Implement database persistence

## References

- [Web Vitals](https://web.dev/vitals/)
- [web-vitals library](https://github.com/GoogleChrome/web-vitals)
- [Next.js Web Vitals](https://nextjs.org/docs/app/building-your-application/optimizing/analytics#web-vitals)
