# JavaScript Bundle Metrics Per Route

## Validation Run: September 21, 2025

### Overview
- **Total Bundle Size**: 3.31 MB (3,475,703 bytes)
- **Next.js Version**: 14.2.5
- **Bundle Analyzer Version**: 15.5.2
- **Analysis Generated**: 2025-09-21

### Route-Specific JavaScript Metrics

#### Homepage (/) - 488 kB First Load JS
- **Page-specific JS**: 187 kB
- **Shared JS**: 301 kB
- **Key Components**:
  - Three.js core library: 740.07 KB
  - 3D components for homepage: 706.65 KB
  - Vendors (React, Next.js, Framer Motion): 1010.67 KB

#### Services Page (/diensten) - 485 kB First Load JS  
- **Page-specific JS**: 184 kB
- **Shared JS**: 301 kB
- **Key Components**:
  - Three.js components: 709.57 KB
  - Service-specific chunks loaded on demand

#### Contact Page (/contact) - 306 kB First Load JS
- **Page-specific JS**: 5.44 kB
- **Shared JS**: 301 kB
- **Lightweight**: Minimal 3D components

#### Other Static Pages - 301-302 kB First Load JS
- **About Us (/over-ons)**: 646 B + 301 kB shared
- **Privacy (/privacy)**: 478 B + 301 kB shared  
- **Terms (/voorwaarden)**: 478 B + 301 kB shared
- **Process (/werkwijze)**: 628 B + 301 kB shared
- **Playground (/speeltuin)**: 4.7 kB + 301 kB shared

### Top JavaScript Chunks Analysis

| Rank | File | Size | Category | Description |
|------|------|------|----------|-------------|
| 1 | vendors-9117e187e007decf.js | 1010.67 KB | vendors | Core vendor libraries |
| 2 | three.b786edeabfa9cee0.js | 740.07 KB | three-core | Three.js core library |
| 3 | 807-7de7c7d775d62f8e.js | 709.57 KB | three-components | Three.js components |
| 4 | 664-f801609d76f1f761.js | 706.65 KB | three-components | 3D homepage components |
| 5 | polyfills-42372ed130431b0a.js | 109.96 KB | polyfills | Browser polyfills |

### Performance Characteristics

#### Strengths
- **Route-based code splitting**: Non-3D pages are lightweight
- **Shared vendor chunk**: Efficient caching across routes
- **Static generation**: Most pages pre-rendered for fast delivery

#### Optimization Opportunities
- **3D-heavy routes**: Homepage and services have largest JS payload
- **Three.js optimization**: Consider lazy loading for non-critical 3D components
- **Vendor chunk size**: 1MB vendor bundle could be further optimized

### Bundle Validation Results

✅ **Build Success**: Production build completed without errors
✅ **Code Splitting**: Proper route-based splitting implemented  
✅ **Static Generation**: 15/15 pages successfully generated
✅ **Bundle Analysis**: Detailed metrics captured for optimization

### Recommendations

1. **Implement progressive loading** for Three.js components on homepage
2. **Consider route-based Three.js chunks** to reduce initial payload
3. **Monitor vendor bundle growth** with dependency updates
4. **Implement bundle size budgets** in CI pipeline

---
*Generated during validation run on September 21, 2025*