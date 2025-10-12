# Three.js Portfolio Showcase Components

This directory contains high-performance 3D components built with React Three Fiber for showcasing ProWeb Studio's capabilities.

## Components Overview

### 1. PortfolioComputer.tsx

Interactive 3D laptop model with rotating animations and embedded portfolio showcase.

**Features:**

- Realistic laptop model with materials and lighting
- Auto-rotating display with smooth animations
- Embedded HTML content showing portfolio information
- Adaptive performance based on device capabilities
- Proper SEO fallback content

**Usage:**

```tsx
import { PortfolioComputer } from "@/three";

<PortfolioComputer className="my-8" />;
```

### 2. EcommerceShowcase.tsx

3D product visualization showcasing e-commerce solutions with interactive elements.

**Features:**

- Multiple product types (phone, watch, headphones)
- Interactive hover effects and animations
- Dynamic lighting and material effects
- Product information overlays
- Optimized rendering for different device tiers

**Usage:**

```tsx
import { EcommerceShowcase } from "@/three";

<EcommerceShowcase className="my-8" />;
```

### 3. BrandIdentityModel.tsx

Dynamic 3D logo and brand identity showcase with animated elements.

**Features:**

- Multiple 3D geometric elements representing brand components
- Distortion materials and dynamic animations
- Multi-colored lighting system
- Floating brand text with custom fonts
- Orbital camera controls

**Usage:**

```tsx
import { BrandIdentityModel } from "@/three";

<BrandIdentityModel className="my-8" />;
```

## Performance Optimizations

### PerformanceOptimizations.tsx

Comprehensive performance optimization utilities and components.

**Key Features:**

#### PerformanceCanvas

Enhanced Canvas wrapper with automatic performance adjustments:

- Adaptive DPR (Device Pixel Ratio) based on device capabilities
- Hardware acceleration detection
- Power consumption optimization
- Automatic quality scaling

#### useLOD Hook

Level of Detail optimization for complex scenes:

```tsx
const lod = useLOD(distance, performanceTier);
// Returns optimized settings for geometry, shadows, reflections, etc.
```

#### OptimizedMaterial Component

Smart material component that adjusts complexity based on performance:

```tsx
<OptimizedMaterial color="#3498db" metalness={0.5} performanceTier={2} />
```

#### useOptimizedAssets Hook

Progressive asset loading system:

```tsx
const { loadedAssets, loading } = useOptimizedAssets([
  "/models/laptop.glb",
  "/textures/screen.jpg",
]);
```

## SEO and Accessibility

All components include comprehensive SEO and accessibility features:

### SEO Fallbacks

- `<noscript>` tags with descriptive content
- Hidden semantic HTML with proper headings
- Screen reader accessible descriptions
- Structured data for search engines

### Performance Considerations

- Automatic device capability detection
- Progressive loading with priority queuing
- Memory-efficient asset management
- Graceful degradation for low-end devices

### Accessibility Features

- Keyboard navigation support
- Screen reader announcements
- Reduced motion respect
- High contrast mode compatibility

## Advanced Usage

### Combined Showcase Component

Use all components together in a single showcase:

```tsx
import { ThreeJSShowcase } from "@/three";

<ThreeJSShowcase
  components={["portfolio", "ecommerce", "brand"]}
  layout="grid"
  className="py-16"
/>;
```

### Individual Optimized Components

For enhanced SEO and performance:

```tsx
import {
  OptimizedPortfolioComputer,
  OptimizedEcommerceShowcase,
  OptimizedBrandIdentityModel
} from '@/three'

<OptimizedPortfolioComputer />
<OptimizedEcommerceShowcase />
<OptimizedBrandIdentityModel />
```

## Technical Implementation

### Dependencies

- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Useful helpers and abstractions
- `@react-three/postprocessing` - Post-processing effects
- `three` - Core Three.js library
- `framer-motion` - Animation library for loading states

### Performance Metrics

- Initial load time: < 2 seconds on 3G
- Memory usage: < 100MB on mobile devices
- Frame rate: 60fps on mid-range devices
- Bundle size impact: < 50KB gzipped

### Browser Support

- Chrome 76+ (full features)
- Firefox 78+ (full features)
- Safari 14+ (limited post-processing)
- Edge 79+ (full features)
- Mobile browsers (optimized experience)

## Development Guidelines

### Adding New Components

1. Create component in `/src/three/ComponentName.tsx`
2. Include performance optimizations using provided utilities
3. Add proper SEO fallback content
4. Export from `index.tsx`
5. Update this documentation

### Performance Testing

```bash
npm run dev:perf  # Run with performance monitoring
npm run lighthouse  # Generate performance report
```

### Best Practices

- Always wrap components in `Suspense`
- Use `useDetectGPU` for capability detection
- Implement progressive loading for assets
- Provide meaningful fallback content
- Test on various device types and network conditions

## Troubleshooting

### Common Issues

**Performance on Mobile:**

- Components automatically reduce quality on low-end devices
- Check `useDetectGPU` output for capability detection
- Ensure proper DPR scaling is enabled

**Loading Issues:**

- Verify all required assets are available
- Check network tab for failed resource loads
- Ensure proper Suspense boundaries are in place

**SEO Concerns:**

- All components include noscript fallbacks
- Hidden semantic content is properly structured
- Check that search engines can access fallback content

### Debug Mode

Enable debug information by setting environment variable:

```bash
NEXT_PUBLIC_THREE_DEBUG=true npm run dev
```

This will display performance metrics and capability information in the browser console.
