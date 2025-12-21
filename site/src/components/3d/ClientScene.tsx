'use client';

import dynamic from 'next/dynamic';

import { CosmicLoader, CosmicSkeleton } from '@/components/ui/CosmicLoader';

/**
 * Client-side 3D Component Wrappers
 * 
 * In Next.js 15+, `ssr: false` with `next/dynamic` is not allowed in Server Components.
 * These wrappers allow using 3D components in Server Components by providing
 * pre-configured client-side dynamic imports with premium loading states.
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

// 3D Scenes with premium loaders
export const HexagonalPrism = dynamic(() => import('@/three/HexagonalPrism'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center">
            <CosmicLoader size="sm" minimal />
        </div>
    ),
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
    loading: () => (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
            <CosmicLoader size="lg" message="Universum Laden..." submessage="Bereid je voor op de reis" />
        </div>
    ),
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
    loading: () => (
        <div className="w-full h-full flex items-center justify-center">
            <CosmicLoader size="md" message="Technologie Laden..." />
        </div>
    ),
});

// Simple showcase components
export const SimpleEcommerceShowcase = dynamic(() => import('@/components/SimpleEcommerceShowcase'), {
    ssr: false,
    loading: () => <CosmicSkeleton className="w-full h-full min-h-[300px]" />,
});

export const SimpleBrandIdentityModel = dynamic(() => import('@/components/SimpleBrandIdentityModel'), {
    ssr: false,
    loading: () => <CosmicSkeleton className="w-full h-full min-h-[300px]" />,
});

export const SimplePortfolioComputer = dynamic(() => import('@/components/SimplePortfolioComputer'), {
    ssr: false,
    loading: () => <CosmicSkeleton className="w-full h-full min-h-[300px]" />,
});

export const ServicesPolyhedra = dynamic(() => import('@/three/ServicesPolyhedra'), {
    ssr: false,
    loading: () => <CosmicSkeleton className="h-96 rounded-lg" />,
});

