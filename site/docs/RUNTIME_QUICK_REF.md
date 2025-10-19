# Runtime Configuration Quick Reference

**ADR**: [docs/ADR-runtime.md](./ADR-runtime.md) | **Summary**: [docs/RUNTIME_ALIGNMENT_SUMMARY.md](./RUNTIME_ALIGNMENT_SUMMARY.md)

---

## 🎯 Decision Tree: Which Runtime?

```
┌─────────────────────────────────────┐
│   Creating New Route/API?           │
└─────────────┬───────────────────────┘
              │
              ▼
    ┌─────────────────────┐
    │ Does it need Node.js │
    │ built-ins or packages?│
    │ (fs, nodemailer, etc) │
    └──────┬────────────────┘
           │
      ┌────┴────┐
      │         │
     YES       NO
      │         │
      ▼         ▼
   ┌────┐   ┌──────┐
   │Node│   │ Edge │
   │.js │   │      │
   └────┘   └──────┘
```

---

## 📋 Configuration Templates

### API Route - Edge Runtime
```typescript
import { NextRequest, NextResponse } from 'next/server';

// Edge runtime for [REASON] (see docs/ADR-runtime.md)
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const preferredRegion = ['cdg1', 'lhr1', 'fra1'];

export async function GET(request: NextRequest) {
  // Pure logic, no Node.js dependencies
  return NextResponse.json({ data: 'example' });
}
```

### API Route - Node.js Runtime
```typescript
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer'; // Node.js-only package

// Node.js runtime required for nodemailer (see docs/ADR-runtime.md)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const preferredRegion = ['cdg1', 'lhr1', 'fra1'];

export async function POST(request: NextRequest) {
  // Can use Node.js ecosystem
  await sendEmail();
  return NextResponse.json({ success: true });
}
```

### Sitemap Route
```typescript
// Edge runtime for static XML generation (see docs/ADR-runtime.md)
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const preferredRegion = ['cdg1', 'lhr1', 'fra1'];

export async function GET() {
  const xml = generateSitemap();
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
```

### Page (Marketing/Static)
```typescript
import type { Metadata } from 'next';

// NO runtime or preferredRegion - let App Router optimize
export const dynamic = 'force-static'; // or 'force-dynamic'
export const revalidate = 3600; // as needed

export const metadata: Metadata = {
  title: 'Page Title',
};

export default function Page() {
  return <main>Content</main>;
}
```

---

## 🌍 Region Configuration

**Chosen Regions**: `['cdg1', 'lhr1', 'fra1']`

| Code | City | Country | Distance to NL |
|------|------|---------|----------------|
| `cdg1` | Paris | 🇫🇷 France | ~400km (Primary) |
| `lhr1` | London | 🇬🇧 UK | ~350km |
| `fra1` | Frankfurt | 🇩🇪 Germany | ~450km |

**Rationale**: Triangle formation covering Western Europe with <50ms latency to Netherlands

---

## ✅ Checklist Before Deployment

- [ ] Runtime explicitly set (`edge` or `nodejs`)?
- [ ] `preferredRegion = ['cdg1', 'lhr1', 'fra1']` present?
- [ ] Dependencies compatible with chosen runtime?
- [ ] ADR reference comment included?
- [ ] Verification script passes: `npm run verify:runtime`

---

## 🚫 Common Mistakes

### ❌ Missing Region Configuration
```typescript
export const runtime = 'edge';
// Missing: export const preferredRegion = ['cdg1', 'lhr1', 'fra1'];
```

### ❌ Edge Runtime with Node.js Package
```typescript
export const runtime = 'edge';
import nodemailer from 'nodemailer'; // ❌ Won't work!
```

### ❌ Page with Runtime Override (unnecessary)
```typescript
// pages/index.tsx
export const runtime = 'edge'; // ❌ Don't override on pages
export const preferredRegion = [...]; // ❌ Let CDN handle this
```

### ❌ Wrong Region Format
```typescript
export const preferredRegion = 'cdg1'; // ❌ Must be array
export const preferredRegion = ['cdg1']; // ❌ Include all 3 regions
```

---

## 🔧 Verification Commands

```bash
# Run verification script
npm run verify:runtime

# Or manually
./scripts/verify-runtime-config.sh

# Find routes missing runtime
grep -L "export const runtime" $(find src/app -name "route.ts")

# Find routes missing preferredRegion
grep -L "preferredRegion" $(find src/app -name "route.ts")
```

---

## 📊 Current Configuration Status

**API Routes**: 6 routes configured
- Edge: 4 (health, vitals, subscribe, ...)
- Node.js: 2 (contact, csp-report, monitoring)

**Sitemap Routes**: 4 routes configured
- All Edge runtime

**Pages**: 19+ pages
- No runtime overrides (App Router optimized)

---

## 🔗 Quick Links

- **ADR Document**: [docs/ADR-runtime.md](./ADR-runtime.md)
- **Implementation Summary**: [docs/RUNTIME_ALIGNMENT_SUMMARY.md](./RUNTIME_ALIGNMENT_SUMMARY.md)
- **Verification Script**: [scripts/verify-runtime-config.sh](../scripts/verify-runtime-config.sh)
- **Next.js Docs**: [Route Segment Config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)

---

## 🆘 Need Help?

1. Check ADR for detailed rationale
2. Run verification script
3. Review existing route examples
4. Consult team lead if unsure

**When in doubt**: Use Edge runtime unless you have a specific Node.js dependency
