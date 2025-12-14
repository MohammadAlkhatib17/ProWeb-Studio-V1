'use client';

import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';
import { useReducedMotion } from '@/hooks/useReducedMotion';

import ParallaxRig from './ParallaxRig';
import StarsShell from './StarsShell';

interface ServiceHeroSceneProps {
    serviceSlug: string;
}

// Service-specific color themes
const serviceThemes: Record<string, { primary: string; secondary: string; accent: string }> = {
    'website-laten-maken': { primary: '#4CC9F0', secondary: '#4361EE', accent: '#7209B7' }, // Cyan to Blue
    'webshop-laten-maken': { primary: '#F72585', secondary: '#B5179E', accent: '#4361EE' }, // Magenta to Purple
    'seo-optimalisatie': { primary: '#06D6A0', secondary: '#118AB2', accent: '#FFD166' }, // Green to Teal
    '3d-website-ervaringen': { primary: '#F77F00', secondary: '#D62828', accent: '#FCBF49' }, // Orange to Red
    'onderhoud-support': { primary: '#4895EF', secondary: '#3F37C9', accent: '#4CC9F0' }, // Stability Blue
};

export default function ServiceHeroScene({ serviceSlug }: ServiceHeroSceneProps) {
    const reduced = useReducedMotion();
    const { capabilities } = useDeviceCapabilities();

    // Get theme or fallback
    const theme = serviceThemes[serviceSlug] || serviceThemes['website-laten-maken'];

    const particleCount = capabilities.isMobile ? 300 : 600;
    const parallaxFactor = capabilities.isMobile ? 0.05 : 0.12;

    if (reduced) {
        return (
            <>
                <ambientLight intensity={0.6} />
                <mesh position={[0, 0, 0]}>
                    <icosahedronGeometry args={[1, 0]} />
                    <meshStandardMaterial color={theme.primary} emissive={theme.secondary} emissiveIntensity={0.2} />
                </mesh>
                <StarsShell count={particleCount} radius={15} opacity={0.3} />
            </>
        );
    }

    return (
        <ParallaxRig factor={parallaxFactor}>
            {/* Central Abstract Shape representing the Service */}
            <mesh position={[0, 0, 0]} rotation={[0.4, 0.2, 0]}>
                <icosahedronGeometry args={[1.2, 0]} />
                <meshStandardMaterial
                    color={theme.primary}
                    emissive={theme.secondary}
                    emissiveIntensity={0.4}
                    roughness={0.1}
                    metalness={0.9}
                    wireframe={true}
                />
            </mesh>

            {/* Inner solidified core */}
            <mesh position={[0, 0, 0]} rotation={[0.4, 0.2, 0]}>
                <icosahedronGeometry args={[0.8, 0]} />
                <meshStandardMaterial
                    color={theme.secondary}
                    emissive={theme.accent}
                    emissiveIntensity={0.2}
                    roughness={0.3}
                    metalness={0.6}
                />
            </mesh>

            {/* Orbiting Satellite */}
            <mesh position={[2, 1.5, -1]} rotation={[0, 0, 0.5]}>
                <octahedronGeometry args={[0.25, 0]} />
                <meshStandardMaterial
                    color={theme.accent}
                    emissive={theme.accent}
                    emissiveIntensity={0.8}
                />
            </mesh>

            <StarsShell count={particleCount} radius={18} opacity={0.5} />

            <ambientLight intensity={0.5} />
            <pointLight position={[5, 5, 5]} intensity={1.5} color={theme.primary} distance={20} />
            <pointLight position={[-5, -5, -5]} intensity={1} color={theme.secondary} distance={20} />
            <pointLight position={[0, 2, 0]} intensity={0.5} color="#ffffff" distance={10} />
        </ParallaxRig>
    );
}
