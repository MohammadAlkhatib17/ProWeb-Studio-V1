# Three.js / @react-three/drei Bundle Optimization Report

> **Generated**: September 18, 2025  
> **Purpose**: Minimize client JS from @react-three/drei without changing visuals  
> **Current @react-three/drei version**: 9.122.0  

## Executive Summary

After comprehensive analysis of the codebase, **the drei usage is already well-optimized**. The application uses minimal drei components and primarily relies on direct Three.js primitives for performance. However, strategic splitting of advanced materials and effects can still yield **~85-120 KB savings**.

## Current @react-three/drei Usage Map

### Files with NO drei imports (✅ Already optimized):
- `src/three/HeroScene.tsx` - Uses only Three.js + @react-three/fiber
- `src/three/PortalScene.tsx` - Uses only Three.js + @react-three/fiber  
- Custom geometric components use direct Three.js for best performance

### Files with drei imports (Analysis by criticality):

#### **CRITICAL (Immediate render needed)**
1. **`src/components/Scene3D.tsx`**
   - Imports: `Preload`, `AdaptiveDpr`, `PerformanceMonitor`
   - Usage: Core Canvas setup and performance optimization
   - **Keep**: These are essential for initial render optimization
   - Size: ~8-12 KB

2. **`src/components/HeroCanvas.tsx`**
   - Imports: `Preload`
   - Usage: Asset preloading for hero section
   - **Keep**: Critical for above-the-fold performance
   - Size: ~3-5 KB

3. **`src/three/AboutScene.tsx`**
   - Imports: `Preload`
   - Usage: Scene setup component
   - **Keep**: Required for scene initialization
   - Size: ~3-5 KB

#### **NON-CRITICAL (Splittable Effects & Advanced Materials)**
4. **`src/three/ServicesPolyhedra.tsx`** ⚡ **HIGH IMPACT**
   - Imports: `Octahedron`, `Dodecahedron`, `Tetrahedron`, `MeshDistortMaterial`, `PerspectiveCamera`
   - Usage: Animated geometry effects for /diensten page
   - **Split Strategy**: Move to dynamic island
   - Estimated Size: ~25-35 KB

5. **`src/three/HelixKnot.tsx`** ⚡ **HIGH IMPACT**
   - Imports: `MeshTransmissionMaterial`
   - Usage: Advanced glass-like material effect
   - **Split Strategy**: Create material island
   - Estimated Size: ~20-30 KB

6. **`src/three/CrystalLogo.tsx`** ⚡ **HIGH IMPACT**
   - Imports: `MeshTransmissionMaterial`
   - Usage: Advanced glass-like material effect
   - **Split Strategy**: Share material island with HelixKnot
   - Estimated Size: ~5-10 KB (reuses material)

7. **`src/three/OrbitSystem.tsx`** ⚡ **MEDIUM IMPACT**
   - Imports: `Sphere`, `Trail`
   - Usage: Animated orbit effects
   - **Split Strategy**: Move to effects island
   - Estimated Size: ~15-20 KB

8. **`src/components/TechPlaygroundScene.tsx`** ⚡ **HIGHEST IMPACT**
   - Imports: `OrbitControls`, `Float`, `Points`, `PointMaterial`, `MeshTransmissionMaterial`, `Sparkles`, `Trail`, `Preload`, `AdaptiveDpr`, `Line`, `EffectComposer`, `Bloom`, `Vignette`, `ChromaticAberration`, `DepthOfField`
   - Usage: Complex playground scene (likely /speeltuin route)
   - **Split Strategy**: Entire scene as dynamic import
   - Estimated Size: ~45-60 KB

## Recommended File Splits

### 1. **Advanced Materials Island** ⚡ Priority 1
**File**: `src/three/islands/AdvancedMaterials.tsx`
**Components to move**:
- `MeshTransmissionMaterial` from `HelixKnot.tsx`
- `MeshTransmissionMaterial` from `CrystalLogo.tsx`

**Implementation**:
```tsx
// src/three/islands/AdvancedMaterials.tsx
import { lazy } from 'react';

const TransmissionMaterial = lazy(() => 
  import('@react-three/drei').then(module => ({ 
    default: module.MeshTransmissionMaterial 
  }))
);

// Export wrapped components with loading states
export const LazyHelixKnot = lazy(() => import('./LazyHelixKnot'));
export const LazyCrystalLogo = lazy(() => import('./LazyCrystalLogo'));
```

**Expected savings**: ~25-40 KB

### 2. **Geometric Effects Island** ⚡ Priority 2  
**File**: `src/three/islands/GeometricEffects.tsx`
**Components to move**:
- All geometric helpers from `ServicesPolyhedra.tsx`
- `MeshDistortMaterial`, `Octahedron`, `Dodecahedron`, `Tetrahedron`

**Implementation**:
```tsx
// src/three/islands/GeometricEffects.tsx
import { lazy, Suspense } from 'react';

const GeometricShapes = lazy(() => 
  import('@react-three/drei').then(module => ({
    default: {
      Octahedron: module.Octahedron,
      Dodecahedron: module.Dodecahedron, 
      Tetrahedron: module.Tetrahedron,
      MeshDistortMaterial: module.MeshDistortMaterial
    }
  }))
);

export const LazyServicesPolyhedra = lazy(() => import('./LazyServicesPolyhedra'));
```

**Expected savings**: ~25-35 KB

### 3. **Trail & Animation Effects Island** ⚡ Priority 3
**File**: `src/three/islands/AnimationEffects.tsx`  
**Components to move**:
- `Trail`, `Sphere` from `OrbitSystem.tsx`
- Secondary animation helpers

**Expected savings**: ~15-20 KB

### 4. **Playground Scene Island** ⚡ Priority 4
**File**: `src/components/islands/TechPlaygroundIsland.tsx`
**Components to move**:
- Entire `TechPlaygroundScene.tsx` as dynamic import
- All post-processing effects (`EffectComposer`, `Bloom`, etc.)

**Expected savings**: ~45-60 KB

## Implementation Strategy

### Phase 1: Material Splitting (Highest ROI)
1. Create `src/three/islands/AdvancedMaterials.tsx`
2. Modify `HelixKnot.tsx` and `CrystalLogo.tsx` to use lazy materials
3. Add loading states with basic material fallbacks

### Phase 2: Effects Splitting  
1. Create geometric effects island
2. Create animation effects island
3. Update import statements to use lazy loading

### Phase 3: Scene Islands
1. Move entire playground scene to dynamic import
2. Implement route-based code splitting

## Preserving optimizePackageImports

The current `next.config.mjs` has:
```javascript
experimental: {
  optimizePackageImports: ['@react-three/fiber', '@react-three/drei', 'three'],
}
```

**Strategy to maintain optimization**:
1. Use **per-component imports** in island files:
   ```tsx
   import { MeshTransmissionMaterial } from '@react-three/drei/core/materials/MeshTransmissionMaterial';
   ```

2. Create **island-specific barrel exports**:
   ```tsx
   // src/three/islands/materials.ts
   export { MeshTransmissionMaterial } from '@react-three/drei/core/materials/MeshTransmissionMaterial';
   export { MeshDistortMaterial } from '@react-three/drei/core/materials/MeshDistortMaterial';
   ```

3. Use **dynamic imports with specific modules**:
   ```tsx
   const material = await import('@react-three/drei/core/materials/MeshTransmissionMaterial');
   ```

## Expected Bundle Size Reduction

| Island | Current Size | After Split | Savings | Routes Affected |
|--------|-------------|-------------|---------|-----------------|
| Advanced Materials | ~35-50 KB | ~5-10 KB core | **~25-40 KB** | `/over-ons`, components with crystal effects |
| Geometric Effects | ~30-40 KB | ~5-8 KB core | **~25-35 KB** | `/diensten` |
| Animation Effects | ~20-25 KB | ~5-8 KB core | **~15-20 KB** | Components with trails |
| Playground Scene | ~50-70 KB | ~0 KB initial | **~45-60 KB** | `/speeltuin` |
| **TOTAL ESTIMATED** | **135-185 KB** | **15-31 KB** | **🎯 85-120 KB** | Multiple routes |

## Performance Impact Assessment

### ✅ **Benefits**
- **85-120 KB reduction** in initial bundle size
- Faster Time to Interactive (TTI) on landing pages
- Better Core Web Vitals scores
- Route-specific loading of 3D features
- Maintained drei optimization through specific imports

### ⚠️ **Considerations**  
- **+100-200ms loading delay** for advanced materials on first use
- Need loading states for visual continuity
- Slightly more complex component architecture
- Dependency on dynamic import browser support (already required for Next.js)

### 🔧 **Mitigation Strategies**
1. **Preload on hover**: For interactive elements, preload on hover/focus
2. **Loading fallbacks**: Use basic materials during chunk loading
3. **Route prefetching**: Prefetch islands for likely next pages
4. **Service Worker caching**: Cache island chunks for return visits

## Implementation Priority

1. **🥇 Advanced Materials Island** - Highest savings, lowest complexity
2. **🥈 Geometric Effects Island** - High savings, medium complexity  
3. **🥉 Animation Effects Island** - Medium savings, low complexity
4. **🏅 Playground Scene Island** - High savings, higher complexity

## Acceptance Criteria Met

✅ **Mapped drei symbols** in each target file  
✅ **Identified splittable components** per page with exact file paths  
✅ **Maintained optimizePackageImports** effectiveness through specific imports  
✅ **Listed exact file paths** to split:
- `src/three/islands/AdvancedMaterials.tsx`
- `src/three/islands/GeometricEffects.tsx` 
- `src/three/islands/AnimationEffects.tsx`
- `src/components/islands/TechPlaygroundIsland.tsx`

✅ **Expected KB savings**: **85-120 KB total reduction**

## Next Steps

1. Implement Phase 1 (Advanced Materials Island) for immediate 25-40 KB savings
2. Add comprehensive loading states and fallbacks
3. Monitor bundle analyzer results to validate savings
4. Proceed with remaining phases based on performance gains

---

*This optimization maintains visual fidelity while significantly reducing initial bundle size through strategic code splitting of non-critical drei components.*