# ADR: Next.js Runtime and Region Configuration Strategy

**Status**: Accepted  
**Date**: 2025-10-19  
**Decision Maker**: Senior Next.js Engineering Team  
**Context**: ProWeb Studio V1 - Dutch webdesign platform

---

## Context and Problem Statement

Our Next.js application serves a primarily European (Dutch) audience with diverse functionality:
- Static marketing pages (SSG)
- API routes requiring Node.js libraries (nodemailer, rate limiting)
- XML sitemaps (pure data generation)
- Monitoring/analytics endpoints
- Dynamic contact forms with server-side processing

We need a coherent strategy for:
1. **Runtime Selection**: Edge vs Node.js for each route type
2. **Regional Distribution**: Optimal Vercel regions for EU performance
3. **Consistency**: Clear patterns to prevent configuration drift

---

## Decision Drivers

### Performance Requirements
- **Target Audience**: Netherlands primary, Western Europe secondary
- **Performance Goals**: <1s TTFB, Core Web Vitals excellence
- **Geographic Distribution**: Minimize latency for EU users

### Technical Constraints
- **Edge Runtime Limitations**:
  - No Node.js built-ins (fs, child_process, crypto.randomBytes)
  - Limited package compatibility (nodemailer requires Node.js)
  - Smaller bundle size limits
  - No native module support
  
- **Node.js Runtime Benefits**:
  - Full npm ecosystem access
  - Complex business logic support
  - File system operations
  - Email sending, PDF generation, etc.

### Business Requirements
- **Maintainability**: Clear, documented patterns
- **Scalability**: Support future feature additions
- **Cost Efficiency**: Optimize for Vercel's pricing model
- **Developer Experience**: Predictable, well-understood patterns

---

## Decision

### Runtime Strategy

#### **Use Edge Runtime For:**

1. **Static XML Generation** (Sitemaps, RSS feeds)
   - **Rationale**: Pure data serialization, no external dependencies
   - **Benefits**: Global distribution, instant cold starts, lower cost
   - **Examples**: `/sitemap-*.xml/route.ts`

2. **Simple API Endpoints** (Health checks, analytics forwarding)
   - **Rationale**: Minimal logic, no Node.js dependencies
   - **Benefits**: <50ms response times, worldwide availability
   - **Examples**: `/api/health/route.ts`, `/api/vitals/route.ts`

3. **Read-Only Data APIs** (Configuration, public data)
   - **Rationale**: No database writes, pure transformations
   - **Benefits**: Automatic caching, geographic redundancy

#### **Use Node.js Runtime For:**

1. **Email/External Services** (Contact forms, subscriptions)
   - **Rationale**: Requires `nodemailer` or similar Node.js libraries
   - **Examples**: `/api/contact/route.ts`
   - **Trade-off**: Slightly higher latency acceptable for asynchronous operations

2. **Complex Business Logic** (Rate limiting, authentication)
   - **Rationale**: Needs sophisticated npm packages (memory stores, crypto)
   - **Examples**: `/api/csp-report/route.ts`

3. **File System Operations** (Log aggregation, report generation)
   - **Rationale**: Requires Node.js `fs` module
   - **Examples**: `/api/monitoring/core-web-vitals/route.ts`

#### **Pages (Default: No Runtime Override)**

- **Marketing Pages**: Rely on Next.js App Router defaults (automatic static optimization)
- **Rationale**: App Router intelligently determines rendering strategy
- **Exception**: Only override if specific requirements emerge

---

### Regional Distribution Strategy

#### **Chosen Regions**: `['cdg1', 'lhr1', 'fra1']`

**Primary Region**: Paris (`cdg1`)
- Closest to Dutch market (Amsterdam ~400km)
- Low latency to Netherlands (~15-25ms)

**Secondary Regions**: London (`lhr1`), Frankfurt (`fra1`)
- Geographic redundancy
- Cover UK and DACH markets
- Maintain <50ms latency across Western Europe

#### **Rationale**:
1. **Performance**: Triangle formation covers EU population centers
2. **Compliance**: All regions within EU/EEA for GDPR
3. **Redundancy**: Multi-region failover capability
4. **Cost**: Balanced distribution reduces single-region load

#### **Region Selection by Route Type**:
- **All API Routes**: Apply `preferredRegion = ['cdg1', 'lhr1', 'fra1']`
- **All Sitemap Routes**: Apply `preferredRegion = ['cdg1', 'lhr1', 'fra1']`
- **Pages**: No region override (handled by `vercel.json` at project level)

---

## Implementation Rules

### Code Standards

```typescript
// ✅ CORRECT: Edge runtime for simple APIs
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const preferredRegion = ['cdg1', 'lhr1', 'fra1'];

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}
```

```typescript
// ✅ CORRECT: Node.js runtime for complex logic
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const preferredRegion = ['cdg1', 'lhr1', 'fra1'];

export async function POST(req: NextRequest) {
  await sendEmail(); // Requires nodemailer
  return NextResponse.json({ success: true });
}
```

```typescript
// ❌ INCORRECT: Missing region configuration
export const runtime = 'edge';
// Missing: export const preferredRegion = ['cdg1', 'lhr1', 'fra1'];
```

### Required Exports (Per Route Type)

| Route Type | runtime | dynamic | revalidate | preferredRegion |
|-----------|---------|---------|------------|-----------------|
| **API (Edge)** | `'edge'` | `'force-dynamic'` | `0` (optional) | `['cdg1', 'lhr1', 'fra1']` |
| **API (Node)** | `'nodejs'` | `'force-dynamic'` | `0` (optional) | `['cdg1', 'lhr1', 'fra1']` |
| **Sitemap** | `'edge'` | `'force-dynamic'` | - | `['cdg1', 'lhr1', 'fra1']` |
| **Pages** | (none) | (app-specific) | (app-specific) | (none) |

### Configuration Priority

1. **Route-level exports** (highest precedence)
2. **`next.config.mjs`** (global defaults)
3. **`vercel.json`** (platform-level, regions only)

---

## Consequences

### Positive

✅ **Performance**: <50ms TTFB for EU users on edge routes  
✅ **Cost**: Edge functions ~10x cheaper than Node.js functions  
✅ **Clarity**: Explicit runtime per route eliminates guesswork  
✅ **Compliance**: All data processed within EU/EEA regions  
✅ **Scalability**: Geographic distribution handles traffic spikes  

### Negative

⚠️ **Complexity**: Developers must understand edge runtime limitations  
⚠️ **Migration**: Converting Node.js → Edge requires dependency audits  
⚠️ **Debugging**: Edge runtime errors can be less verbose  

### Mitigation Strategies

- **Documentation**: This ADR + inline comments in routes
- **Linting**: Custom ESLint rule to enforce `preferredRegion` exports
- **Testing**: Validate runtime compatibility in CI pipeline
- **Monitoring**: Track P95 latency per region in production

---

## Alternatives Considered

### Alternative 1: Node.js Everywhere
- **Rejected**: Higher cold start times, unnecessary for static content
- **Cost**: ~3x higher Vercel function costs

### Alternative 2: Edge Everywhere
- **Rejected**: Cannot support `nodemailer`, complex npm packages
- **Limitation**: Would require migrating to edge-compatible email services

### Alternative 3: Single Region (Paris only)
- **Rejected**: No failover, higher latency for UK/Germany users
- **Risk**: Single point of failure

### Alternative 4: Global Distribution (All Vercel Regions)
- **Rejected**: Unnecessary latency in APAC/Americas for EU-focused service
- **Cost**: Higher egress costs, diminishing returns

---

## Compliance and Future Considerations

### GDPR/Privacy
- All chosen regions (`cdg1`, `lhr1`, `fra1`) are EU/EEA based
- No user data processed outside European jurisdiction
- Aligns with Dutch Data Protection Authority (AP) guidelines

### Future Scalability
- **International Expansion**: Add regions via `vercel.json` globally
- **New Features**: Evaluate edge compatibility per feature
- **Performance Monitoring**: Re-assess region distribution annually

### Review Schedule
- **Quarterly**: Review P95 latency metrics per region
- **Annually**: Re-evaluate runtime choices based on framework updates
- **On Incident**: After any region-specific outages

---

## References

- [Vercel Edge Runtime Documentation](https://vercel.com/docs/functions/edge-functions)
- [Next.js Route Segment Config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config)
- [Vercel Regions List](https://vercel.com/docs/edge-network/regions)
- [Core Web Vitals Target](https://web.dev/vitals/)

---

## Approval

**Approved by**: Senior Engineering Team  
**Effective Date**: 2025-10-19  
**Next Review**: 2026-01-19  

---

## Quick Reference Checklist

Before merging any new route:

- [ ] Runtime explicitly set (`edge` or `nodejs`)?
- [ ] `preferredRegion = ['cdg1', 'lhr1', 'fra1']` present?
- [ ] Dependencies compatible with chosen runtime?
- [ ] `dynamic` configuration appropriate for route behavior?
- [ ] Inline comment explaining runtime choice (if non-obvious)?
