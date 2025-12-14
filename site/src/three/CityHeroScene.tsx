'use client';

import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';
import { useReducedMotion } from '@/hooks/useReducedMotion';

import ParallaxRig from './ParallaxRig';
import StarsShell from './StarsShell';

interface CityHeroSceneProps {
  citySlug: string;
}

// City-specific color themes for personalized visual identity
const cityThemes: Record<string, { primary: string; secondary: string; accent: string }> = {
  amsterdam: { primary: '#FF6B35', secondary: '#004E89', accent: '#FFD23F' }, // Orange, blue, golden
  rotterdam: { primary: '#00A878', secondary: '#FF6B6B', accent: '#3DCCC7' }, // Port green, red, teal
  utrecht: { primary: '#FED766', secondary: '#009FB7', accent: '#F77F00' }, // Cathedral gold, blue, orange
  'den-haag': { primary: '#7209B7', secondary: '#F72585', accent: '#4CC9F0' }, // Royal purple, magenta, cyan
  eindhoven: { primary: '#ED254E', secondary: '#47E5BC', accent: '#F9DC5C' }, // Tech red, green, yellow
  tilburg: { primary: '#06A77D', secondary: '#D62828', accent: '#F77F00' }, // Green, red, orange
  groningen: { primary: '#4A90E2', secondary: '#F5A623', accent: '#50E3C2' }, // Northern blue, amber, turquoise
  almere: { primary: '#00B4D8', secondary: '#90E0EF', accent: '#0077B6' }, // Water blues
  breda: { primary: '#9D4EDD', secondary: '#FF6D00', accent: '#C77DFF' }, // Purple, orange, light purple
  nijmegen: { primary: '#2A9D8F', secondary: '#E76F51', accent: '#F4A261' }, // Teal, coral, sandy
  haarlem: { primary: '#E63946', secondary: '#F1FAEE', accent: '#A8DADC' }, // Red, cream, light blue
  arnhem: { primary: '#52B788', secondary: '#2D6A4F', accent: '#95D5B2' }, // Forest greens
  amersfoort: { primary: '#457B9D', secondary: '#E63946', accent: '#F1FAEE' }, // Blue, red, cream
  zaanstad: { primary: '#06D6A0', secondary: '#118AB2', accent: '#FFD23F' }, // Windmill green, blue, golden
  'den-bosch': { primary: '#D62828', secondary: '#003049', accent: '#F77F00' }, // Bossche red, navy, orange
};

export default function CityHeroScene({ citySlug }: CityHeroSceneProps) {
  const reduced = useReducedMotion();
  const { capabilities } = useDeviceCapabilities();

  // Get city theme or fallback to Amsterdam theme
  const theme = cityThemes[citySlug] || cityThemes.amsterdam;

  // Performance-optimized particle count based on device
  const particleCount = capabilities.isMobile ? 300 : 600;
  const parallaxFactor = capabilities.isMobile ? 0.05 : 0.1;

  // Disable animations for reduced motion preference
  if (reduced) {
    return (
      <>
        <ambientLight intensity={0.6} />
        <mesh position={[0, 0, 0]}>
          <torusKnotGeometry args={[1, 0.3, 128, 16]} />
          <meshStandardMaterial color={theme.primary} emissive={theme.secondary} emissiveIntensity={0.2} />
        </mesh>
        <StarsShell count={particleCount} radius={15} opacity={0.3} />
      </>
    );
  }

  return (
    <ParallaxRig factor={parallaxFactor}>
      {/* City-themed geometric centerpiece */}
      <mesh position={[0, 0, 0]} rotation={[0.2, 0.3, 0]}>
        <torusKnotGeometry args={[1, 0.3, 128, 16]} />
        <meshStandardMaterial
          color={theme.primary}
          emissive={theme.secondary}
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Subtle orbital accent shape */}
      <mesh position={[2.5, 1, -1]} rotation={[0.5, 0, 0.3]}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color={theme.accent}
          emissive={theme.accent}
          emissiveIntensity={0.5}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      {/* Particle background - city atmosphere */}
      <StarsShell count={particleCount} radius={15} opacity={0.4} />

      {/* Three-point lighting for depth */}
      <ambientLight intensity={capabilities.isMobile ? 0.4 : 0.5} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color={theme.primary} distance={15} decay={2} />
      <pointLight position={[-5, -3, -3]} intensity={0.6} color={theme.secondary} distance={12} decay={2} />
      <pointLight position={[0, -5, 3]} intensity={0.4} color={theme.accent} distance={10} decay={2} />
    </ParallaxRig>
  );
}
