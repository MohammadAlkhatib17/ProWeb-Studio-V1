# ProWeb Studio Bundle Analysis Report

> **Generated**: September 18, 2025  
> **Target Routes**: `/` (homepage) and `/diensten`  
> **Analysis Type**: Client-side JavaScript shipping audit  

## Executive Summary

The ProWeb Studio Next.js application currently ships **3.22 MB** of JavaScript to clients, with **65.3% (2.1 MB) attributed to Three.js and related 3D components**. This analysis identifies significant optimization opportunities to reduce initial bundle size while maintaining the rich 3D experience.

## Current Bundle Composition

### Top 10 Client Modules by Size

| Rank | Chunk File | Size | Purpose |
|------|------------|------|---------|
| 1 | `vendors-b4d2ca312d3396c4.js` | 1010.93 KB | Core vendor libraries (React, Next.js, etc.) |
| 2 | `three.28fe42e6d1f97f5c.js` | 738.21 KB | **Three.js core library** |
| 3 | `913-3d00645556b1377a.js` | 706.74 KB | **3D components chunk (diensten, over-ons, werkwijze)** |
| 4 | `664-0b7500cac858a52b.js` | 706.65 KB | **3D components chunk (homepage)** |
| 5 | `polyfills-42372ed130431b0a.js` | 109.96 KB | Browser polyfills |
| 6 | `971.db1c395c454adea8.js` | 17.3 KB | Additional utilities |
| 7 | `webpack-764d153ed8507f1e.js` | 3.74 KB | Webpack runtime |
| 8 | `main-app-fae5f06674b24dca.js` | 457 B | App main chunk |
| 9 | `main-7c4af4d9ba1c6ff2.js` | 152 B | Pages main chunk |

### Bundle Size by Route

| Route | Total Size | 3D Components |
|-------|------------|---------------|
| `/` (Homepage) | **1.68 MB** | ✅ |
| `/diensten` | **1.68 MB** | ✅ |
| `/over-ons` | **1.68 MB** | ✅ |
| `/werkwijze` | **1.68 MB** | ✅ |
| `/contact` | 1015.12 KB | ❌ |
| `/privacy` | 1015.12 KB | ❌ |
| `/voorwaarden` | 1015.12 KB | ❌ |

## Three.js Library Analysis

### Core Three.js Breakdown
- **Three.js Core**: 738.21 KB (23% of total bundle)
- **@react-three/fiber**: Included in vendors chunk
- **@react-three/drei**: Distributed across 3D component chunks
- **Custom 3D Components**: 1.41 MB (44% of total bundle)

### Components Using Three.js (Eager Loading)

**Homepage (`/`)**:
- `HeroCanvas` → `HeroScene` → Multiple 3D primitives
- `HexagonalPrism` (dynamically imported but still large)

**Services (`/diensten`)**:
- `ServicesPolyhedra` (dynamically imported)

**About (`/over-ons`)**:
- `AboutScene` → `HelixKnot`, `ParallaxRig`, `StarsShell`

**Process (`/werkwijze`)**:
- Custom 3D visualization components

## Lazy-Loading Candidates

### 🎯 High Impact Optimizations

#### 1. Contact Form Components
- **Path**: `src/components/SecureContactForm.tsx`
- **Current**: Eagerly loaded on `/contact`
- **Opportunity**: Dynamic import with interaction-based loading
- **Estimated Savings**: 50-100 KB

#### 2. 3D Scene Components (Route-Specific)
- **Paths**:
  - `src/three/ServicesPolyhedra.tsx` ✅ (already dynamic)
  - `src/three/AboutScene.tsx` (eager on `/over-ons`)
  - `src/three/HeroScene.tsx` ✅ (already dynamic) 
  - `src/three/HelixKnot.tsx` (eager via AboutScene)
  - `src/three/ParallaxRig.tsx` (eager via HeroScene)

#### 3. Advanced 3D Materials & Effects
- **Paths**:
  - `src/three/HelixKnot.tsx` (MeshTransmissionMaterial)
  - `src/three/CrystalLogo.tsx` (MeshTransmissionMaterial)
- **Current**: Bundled with main 3D chunks
- **Opportunity**: Separate material chunks

#### 4. Development & Debug Components
- **Path**: `src/components/PerformanceDebug.tsx`
- **Current**: Potentially included in production
- **Opportunity**: Environment-conditional loading

### 🔧 Medium Impact Optimizations

#### 5. Schema Components (SEO)
- **Paths**:
  - `src/components/FAQSchema.tsx`
  - `src/components/BreadcrumbSchema.tsx`
  - `src/components/ServiceSchema.tsx`
- **Current**: Eagerly loaded on multiple routes
- **Opportunity**: Route-specific dynamic imports

#### 6. Utility Libraries
- **Components**: Zod validation, DOMPurify
- **Current**: Bundled with forms
- **Opportunity**: Async validation chunks

## Proposed Dynamic Import Boundaries

### 🚀 Phase 1: Critical Path Optimization

```
src/components/SecureContactForm.tsx
├── Dynamic import trigger: User interaction with contact CTA
├── Chunk isolation: Form validation + submission logic
└── Expected reduction: 80-120 KB from main bundle

src/three/AboutScene.tsx
├── Dynamic import trigger: Route navigation to /over-ons
├── Chunk isolation: HelixKnot + ParallaxRig + StarsShell
└── Expected reduction: 200-300 KB from diensten/over-ons shared chunk
```

### 🎨 Phase 2: 3D Material Optimization

```
src/three/materials/
├── MeshTransmissionMaterial.tsx (new file)
│   ├── Import: HelixKnot, CrystalLogo materials
│   └── Expected reduction: 100-150 KB
├── AdvancedMaterials.tsx (new file)
│   ├── Import: Specialized shaders and materials
│   └── Expected reduction: 50-100 KB
```

### 🛠️ Phase 3: Feature-Specific Chunking

```
src/features/
├── Contact/
│   ├── SecureContactForm.tsx
│   ├── CalEmbed.tsx
│   └── ContactValidation.ts
├── Playground/
│   ├── TechPlaygroundScene.tsx
│   └── Interactive3DComponents.tsx
└── SEO/
    ├── AllSchemas.tsx (consolidated)
    └── StructuredData.ts
```

## Expected Bundle Size Reductions

### Before/After Projections

| Optimization | Current Size | Projected Size | Savings |
|--------------|-------------|----------------|---------|
| **Main Bundle** | 1.68 MB | 1.1-1.2 MB | **28-34%** |
| Homepage (`/`) | 1.68 MB | 1.1 MB | 35% |
| Services (`/diensten`) | 1.68 MB | 1.15 MB | 32% |
| Contact (`/contact`) | 1.01 MB | 0.95 MB | 6% |
| Total 3D Assets | 2.1 MB | 1.4-1.6 MB | 24-33% |

### Cumulative Impact
- **First Paint**: Improved by 400-600ms on 3G
- **Interactive**: Faster by 200-400ms 
- **3D Load**: Delayed but user-initiated
- **SEO Score**: No impact (SSR maintained)

## Safe Implementation Checklist

### ✅ Zero-Risk Changes (No UI/UX Impact)

- [ ] Dynamic import `SecureContactForm` with interaction trigger
- [ ] Route-split schema components (FAQ, Breadcrumb, Service)
- [ ] Environment-conditional debug component loading
- [ ] Separate advanced 3D material chunks

### ⚠️ Low-Risk Changes (Minimal UX Impact)

- [ ] Dynamic import `AboutScene` components on route navigation
- [ ] Lazy-load advanced Three.js materials on scene interaction
- [ ] Split playground components by feature interaction

### 🔄 Testing Required Changes

- [ ] Verify 3D scene loading states don't cause layout shift
- [ ] Ensure contact form appears instantly on user interaction
- [ ] Validate SEO schemas load before page indexing
- [ ] Test 3D material swapping doesn't cause visual glitches

## Implementation Priority

### Phase 1 (Immediate - High ROI)
1. **Contact Form Dynamic Import** - 80-120 KB savings
2. **Schema Component Splitting** - 30-50 KB savings
3. **Debug Component Removal** - 20-40 KB savings

### Phase 2 (Short-term - Performance)
1. **Advanced 3D Material Chunking** - 100-150 KB savings
2. **Route-Specific 3D Scene Optimization** - 200-300 KB savings

### Phase 3 (Long-term - Architecture)
1. **Feature-Based Code Splitting** - Additional 10-15% optimization
2. **Micro-Frontend 3D Module** - Advanced bundling strategy

## Monitoring & Validation

### Bundle Analysis Automation
- Weekly bundle size reports via CI/CD
- Core Web Vitals impact measurement
- 3D loading performance metrics

### Success Metrics
- **Target**: Reduce main bundle by 25-35%
- **Measure**: First Load JS < 1.2 MB for non-3D routes
- **Monitor**: 3D-enabled routes maintain <1.5 MB initial load
- **Validate**: No degradation in Time to Interactive

---

**Report Generated**: September 18, 2025  
**Next Review**: Implement Phase 1 optimizations and measure impact  
**Contact**: Bundle optimization tracking via ProWeb Studio performance monitoring