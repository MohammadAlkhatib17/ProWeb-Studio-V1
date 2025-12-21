'use client';

import dynamic from 'next/dynamic';

/**
 * Client-side 3D Component Wrappers
 * 
 * In Next.js 15+, `ssr: false` with `next/dynamic` is not allowed in Server Components.
 * These wrappers allow using 3D components in Server Components by providing
 * pre-configured client-side dynamic imports.
 */

// Hero Components
export const HeroCanvas = dynamic(() => import('@/components/HeroCanvas'), {
    ssr: false,
    loading: () => null,
});

export const HeroScene = dynamic(() => import('@/three/HeroScene'), {
    ssr: false,
    loading: () => null,
});

// 3D Scenes
export const HexagonalPrism = dynamic(() => import('@/three/HexagonalPrism'), {
    ssr: false,
    loading: () => <div className="w-full h-full animate-pulse" />,
});

export const CityHeroScene = dynamic(() => import('@/three/CityHeroScene'), {
    ssr: false,
    loading: () => null,
});

export const PortalScene = dynamic(() => import('@/three/PortalScene'), {
    ssr: false,
    loading: () => null,
});

export const DigitalGalaxyScene = dynamic(() => import('@/three/DigitalGalaxyScene'), {
    ssr: false,
    loading: () => null,
});

export const ServiceHeroScene = dynamic(() => import('@/three/ServiceHeroScene'), {
    ssr: false,
    loading: () => null,
});

export const AboutScene = dynamic(() => import('@/three/AboutScene'), {
    ssr: false,
    loading: () => null,
});

export const PortfolioScene = dynamic(() => import('@/three/PortfolioScene'), {
    ssr: false,
    loading: () => null,
});

// Tech scenes
export const TechPlaygroundScene = dynamic(() => import('@/components/TechPlaygroundScene'), {
    ssr: false,
    loading: () => null,
});

// Simple showcase components
export const SimpleEcommerceShowcase = dynamic(() => import('@/components/SimpleEcommerceShowcase'), {
    ssr: false,
    loading: () => null,
});

export const SimpleBrandIdentityModel = dynamic(() => import('@/components/SimpleBrandIdentityModel'), {
    ssr: false,
    loading: () => null,
});

export const SimplePortfolioComputer = dynamic(() => import('@/components/SimplePortfolioComputer'), {
    ssr: false,
    loading: () => null,
});

export const ServicesPolyhedra = dynamic(() => import('@/three/ServicesPolyhedra'), {
    ssr: false,
    loading: () => (
        <div className="h-96 bg-cosmic-900/50 animate-pulse rounded-lg" />
    ),
});
