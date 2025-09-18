# Web Vitals to Plausible Analytics Integration

## Audit Summary

**Status**: ✅ **PROPERLY CONFIGURED AND SECURE**

The `/api/vitals` route and `reportWebVitals` usage has been audited and confirmed to be correctly implemented with proper production-only posting and secure error handling.

## Configuration Verification

### Environment Controls
- **Production Check**: Metrics are only collected when `process.env.NODE_ENV === 'production'`
- **Feature Toggle**: Collection requires `NEXT_PUBLIC_ENABLE_WEB_VITALS=true`
- **Double Gating**: Both client (`WebVitalsReporter.tsx`) and server (`reportWebVitals.ts`) enforce these checks
- **Plausible Domain**: Requires `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` environment variable

### Implementation Flow
```
Next.js Web Vitals Hook → WebVitalsReporter → reportWebVitals → /api/vitals → Plausible Analytics
```

## Core Web Vitals Mapping

### Naming Convention
All metrics are sent to Plausible as custom events with the following structure:

**Event Name**: `"Web Vital"`
**Event Properties**:
- `metric`: The Web Vital type (CLS, LCP, INP, FCP, FID, TTFB)
- `value`: Rounded numeric value in appropriate units
- `rating`: Performance rating (good, needs-improvement, poor)

### Metric Details

#### 1. Cumulative Layout Shift (CLS)
- **Plausible Event**: `"Web Vital"`
- **Property Values**:
  - `metric: "CLS"`
  - `value: 0.05` (example, rounded to 2 decimal places)
  - `rating: "good"` (≤0.1), `"needs-improvement"` (≤0.25), `"poor"` (>0.25)

#### 2. Largest Contentful Paint (LCP)
- **Plausible Event**: `"Web Vital"`
- **Property Values**:
  - `metric: "LCP"`
  - `value: 2340` (milliseconds, rounded)
  - `rating: "good"` (≤2500ms), `"needs-improvement"` (≤4000ms), `"poor"` (>4000ms)

#### 3. Interaction to Next Paint (INP)
- **Plausible Event**: `"Web Vital"`
- **Property Values**:
  - `metric: "INP"`
  - `value: 150` (milliseconds, rounded)
  - `rating: "good"` (≤200ms), `"needs-improvement"` (≤500ms), `"poor"` (>500ms)

#### 4. First Contentful Paint (FCP)
- **Plausible Event**: `"Web Vital"`
- **Property Values**:
  - `metric: "FCP"`
  - `value: 1200` (milliseconds, rounded)
  - `rating: "good"` (≤1800ms), `"needs-improvement"` (≤3000ms), `"poor"` (>3000ms)

#### 5. First Input Delay (FID) - Legacy
- **Plausible Event**: `"Web Vital"`
- **Property Values**:
  - `metric: "FID"`
  - `value: 85` (milliseconds, rounded)
  - `rating: "good"` (≤100ms), `"needs-improvement"` (≤300ms), `"poor"` (>300ms)

#### 6. Time to First Byte (TTFB)
- **Plausible Event**: `"Web Vital"`
- **Property Values**:
  - `metric: "TTFB"`
  - `value: 650` (milliseconds, rounded)
  - `rating: "good"` (≤800ms), `"needs-improvement"` (≤1800ms), `"poor"` (>1800ms)

## Sample Payloads

### Client-Side (reportWebVitals.ts → /api/vitals)
```json
{
  "name": "LCP",
  "value": 2340.5,
  "id": "v3-1698765432123-456789",
  "rating": "good",
  "delta": 45.2,
  "navigationType": "navigate"
}
```

### Server-Side (/api/vitals → Plausible)
```json
{
  "domain": "prowebstudio.nl",
  "name": "Web Vital",
  "url": "https://prowebstudio.nl/diensten",
  "props": {
    "metric": "LCP",
    "value": 2341,
    "rating": "good"
  }
}
```

### Complete Examples by Metric

#### CLS Event
```json
{
  "domain": "prowebstudio.nl",
  "name": "Web Vital",
  "url": "https://prowebstudio.nl/",
  "props": {
    "metric": "CLS",
    "value": 0.05,
    "rating": "good"
  }
}
```

#### INP Event
```json
{
  "domain": "prowebstudio.nl",
  "name": "Web Vital",
  "url": "https://prowebstudio.nl/contact",
  "props": {
    "metric": "INP",
    "value": 180,
    "rating": "good"
  }
}
```

## Toggle Configuration Guide

### Environment Variables

#### Production Environment
```bash
# Required for Web Vitals collection
NEXT_PUBLIC_ENABLE_WEB_VITALS=true
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=prowebstudio.nl

# Standard Next.js environment
NODE_ENV=production
```

#### Development Environment
```bash
# Disable Web Vitals collection in development
NEXT_PUBLIC_ENABLE_WEB_VITALS=false
# OR simply omit the variable (defaults to false)

# Optional: Plausible domain for testing
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=prowebstudio.nl

# Standard Next.js environment
NODE_ENV=development
```

### Toggle Behavior

#### Enabled State (`NEXT_PUBLIC_ENABLE_WEB_VITALS=true` + Production)
- ✅ Web Vitals are collected via `useReportWebVitals` hook
- ✅ Metrics are processed and sent to `/api/vitals`
- ✅ Events are forwarded to Plausible Analytics
- ✅ Silent error handling prevents user experience impact

#### Disabled State (Development OR `NEXT_PUBLIC_ENABLE_WEB_VITALS=false`)
- ⏹️ `useReportWebVitals` hook still initialized (preserves React Rules of Hooks)
- ⏹️ Metrics are collected but discarded at component level
- ⏹️ No API calls made to `/api/vitals`
- ⏹️ No data sent to Plausible

### Manual Toggle Commands

#### Enable Web Vitals Collection
```bash
# Set environment variable
export NEXT_PUBLIC_ENABLE_WEB_VITALS=true

# Restart Next.js application
npm run build && npm start
```

#### Disable Web Vitals Collection
```bash
# Unset or set to false
export NEXT_PUBLIC_ENABLE_WEB_VITALS=false
# OR
unset NEXT_PUBLIC_ENABLE_WEB_VITALS

# Restart Next.js application
npm run build && npm start
```

## Security Implementation

### Error Handling
- **Silent Failures**: All fetch operations use `.catch(() => {})` to prevent user-facing errors
- **Non-Blocking**: Analytics failures do not impact application functionality
- **Graceful Degradation**: Missing environment variables result in no-op behavior

### Data Privacy
- **Production Only**: No metrics collected during development
- **Minimal Data**: Only performance metrics sent, no user PII
- **Cookieless**: Plausible integration respects user privacy
- **Explicit Consent**: Requires explicit enablement via environment variable

### Performance Impact
- **Keepalive**: Uses `keepalive: true` for non-blocking requests
- **Background Processing**: Analytics runs without blocking user interactions
- **Minimal Payload**: Only essential metric data transmitted

## Verification Commands

### Check Environment Configuration
```bash
# Verify environment variables
echo "Web Vitals: $NEXT_PUBLIC_ENABLE_WEB_VITALS"
echo "Plausible Domain: $NEXT_PUBLIC_PLAUSIBLE_DOMAIN"
echo "Node Environment: $NODE_ENV"
```

### Test API Endpoint
```bash
# Test the vitals API endpoint (production only)
curl -X POST https://prowebstudio.nl/api/vitals \
  -H "Content-Type: application/json" \
  -H "Referer: https://prowebstudio.nl/" \
  -d '{
    "name": "LCP",
    "value": 2500,
    "id": "test-123",
    "rating": "good"
  }'
```

### Monitor Plausible Events
1. Open [Plausible Dashboard](https://plausible.io/prowebstudio.nl)
2. Navigate to "Goals" or "Custom Events"
3. Look for "Web Vital" events
4. Filter by properties: `metric`, `value`, `rating`

## Troubleshooting

### Common Issues

#### No Events in Plausible
- ✅ Verify `NEXT_PUBLIC_ENABLE_WEB_VITALS=true`
- ✅ Confirm `NODE_ENV=production`
- ✅ Check `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set correctly
- ✅ Ensure Plausible script is loaded on the page

#### Events Not Triggering
- ✅ Check browser Network tab for `/api/vitals` requests
- ✅ Verify Web Vitals are being measured (slow network/interactions)
- ✅ Confirm component `WebVitalsReporter` is rendered in layout

#### API Errors
- ✅ Check server logs for any unhandled errors
- ✅ Verify Plausible API accessibility
- ✅ Confirm request format matches expected schema

### Debug Mode
For debugging, temporarily modify the error handling to log issues:

```typescript
// In reportWebVitals.ts (development only)
.catch((error) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Web Vitals API Error:', error);
  }
});
```

## Conclusion

The Web Vitals integration is properly configured with:
- ✅ Production-only collection
- ✅ Secure environment variable gating
- ✅ Proper Plausible event mapping
- ✅ Silent error handling
- ✅ Performance-conscious implementation

The system provides valuable Core Web Vitals data to Plausible Analytics while maintaining user privacy and application performance.