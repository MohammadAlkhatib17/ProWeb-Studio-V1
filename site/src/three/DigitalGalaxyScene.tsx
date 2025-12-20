/**
 * DigitalGalaxyScene.tsx
 * ProWeb Studio - "Digital Galaxy of Services"
 * 
 * An immersive 3D galaxy where each planet represents a service.
 * The central sun is ProWeb Studio's core, with orbiting service planets,
 * asteroid belts, nebulae, and interactive elements.
 * 
 * @author ProWeb Studio
 * @version 1.1.0 - Simplified for better compatibility
 */

'use client';

import * as React from 'react';
import { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    OrbitControls,
    Stars,
    Float,
    Html,
    Trail,
    Sparkles,
    Preload,
    AdaptiveDpr
} from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useRouter } from 'next/navigation';
import { KernelSize } from 'postprocessing';

import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ServicePlanet {
    id: string;
    name: string;
    dutchName: string;
    description: string;
    color: string;
    emissiveColor: string;
    orbitRadius: number;
    orbitSpeed: number;
    size: number;
    icon: string;
    features: string[];
    ctaText: string;
    ctaLink: string;
}

interface GalaxySceneProps {
    onServiceClick?: (serviceId: string) => void;
    autoRotate?: boolean;
    selectedService?: string | null;
}

type PerformanceTier = 'low' | 'medium' | 'high';

// ============================================================================
// CONFIGURATION
// ============================================================================

const SERVICES: ServicePlanet[] = [
    {
        id: 'web-development',
        name: 'Web Development',
        dutchName: 'Web Ontwikkeling',
        description: 'Razendsnelle Next.js websites met perfecte Core Web Vitals',
        color: '#00D9FF',
        emissiveColor: '#0099CC',
        orbitRadius: 4,
        orbitSpeed: 0.3,
        size: 0.5,
        icon: '🌐',
        features: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'SEO Optimized'],
        ctaText: 'Bekijk Web Services',
        ctaLink: '/diensten/website-laten-maken',
    },
    {
        id: 'ecommerce',
        name: 'E-commerce',
        dutchName: 'Webshop Ontwikkeling',
        description: 'Conversiegerichte webshops die verkopen terwijl je slaapt',
        color: '#FF2BD6',
        emissiveColor: '#CC0099',
        orbitRadius: 6,
        orbitSpeed: 0.2,
        size: 0.6,
        icon: '🛒',
        features: ['Shopify', 'WooCommerce', 'Payment Integration', 'Inventory'],
        ctaText: 'Start Jouw Webshop',
        ctaLink: '/diensten/webshop-laten-maken',
    },
    {
        id: '3d-experiences',
        name: '3D & WebGL',
        dutchName: '3D Ervaringen',
        description: 'Meeslepende 3D ervaringen die bezoekers betoveren',
        color: '#7A5CFF',
        emissiveColor: '#5533CC',
        orbitRadius: 8,
        orbitSpeed: 0.15,
        size: 0.55,
        icon: '✨',
        features: ['Three.js', 'React Three Fiber', 'WebGL', 'Product Viz'],
        ctaText: 'Ontdek 3D Mogelijkheden',
        ctaLink: '/diensten/3d-website-ervaringen',
    },
    {
        id: 'seo-performance',
        name: 'SEO & Performance',
        dutchName: 'SEO & Snelheid',
        description: 'Domineer de zoekresultaten met technische perfectie',
        color: '#00FF88',
        emissiveColor: '#00CC66',
        orbitRadius: 10,
        orbitSpeed: 0.1,
        size: 0.45,
        icon: '📈',
        features: ['Technical SEO', 'Core Web Vitals', 'Analytics', 'Optimization'],
        ctaText: 'Verbeter Jouw SEO',
        ctaLink: '/diensten/seo-optimalisatie',
    },
    {
        id: 'brand-identity',
        name: 'Brand Identity',
        dutchName: 'Merk Identiteit',
        description: 'Visuele identiteiten die blijven hangen',
        color: '#FFB200',
        emissiveColor: '#CC8800',
        orbitRadius: 12,
        orbitSpeed: 0.08,
        size: 0.4,
        icon: '🎨',
        features: ['Logo Design', 'Style Guide', 'Motion Design', 'UI/UX'],
        ctaText: 'Creëer Jouw Merk',
        ctaLink: '/diensten',
    },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getPerformanceConfig = (tier: PerformanceTier) => {
    const configs = {
        low: {
            starCount: 500,
            enableBloom: false,
            bloomIntensity: 0,
            dpr: [0.8, 1] as [number, number],
        },
        medium: {
            starCount: 1500,
            enableBloom: true,
            bloomIntensity: 1.0,
            dpr: [1, 1.5] as [number, number],
        },
        high: {
            starCount: 3000,
            enableBloom: true,
            bloomIntensity: 1.5,
            dpr: [1, 2] as [number, number],
        },
    };
    return configs[tier];
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * The Central Sun - ProWeb Studio Core
 * A glowing, pulsating sun at the center of the galaxy
 */
function CentralSun() {
    const sunRef = useRef<THREE.Mesh>(null!);
    const innerRef = useRef<THREE.Mesh>(null!);
    const coronaRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // Breathing pulse effect
        const pulse = Math.sin(time * 0.5) * 0.1 + 1;

        if (sunRef.current) {
            sunRef.current.scale.setScalar(pulse);
            sunRef.current.rotation.y = time * 0.1;
        }

        if (innerRef.current) {
            innerRef.current.rotation.y = -time * 0.15;
            innerRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
        }

        if (coronaRef.current) {
            coronaRef.current.rotation.z = time * 0.05;
            const coronaScale = 1 + Math.sin(time * 2) * 0.05;
            coronaRef.current.scale.setScalar(coronaScale);
        }
    });

    return (
        <group>
            {/* Outer Corona Glow */}
            <mesh ref={coronaRef}>
                <sphereGeometry args={[1.8, 32, 32]} />
                <meshBasicMaterial
                    color="#00D9FF"
                    transparent
                    opacity={0.15}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Main Sun Body */}
            <mesh ref={sunRef}>
                <sphereGeometry args={[1.2, 64, 64]} />
                <meshStandardMaterial
                    color="#FFFFFF"
                    emissive="#00D9FF"
                    emissiveIntensity={2}
                    roughness={0.2}
                    metalness={0.1}
                />
            </mesh>

            {/* Inner Core */}
            <mesh ref={innerRef}>
                <icosahedronGeometry args={[0.6, 2]} />
                <meshStandardMaterial
                    color="#7A5CFF"
                    emissive="#5533FF"
                    emissiveIntensity={1.5}
                    roughness={0.1}
                    metalness={0.8}
                />
            </mesh>

            {/* Energy Rings */}
            {[0, 1, 2].map((i) => (
                <mesh key={i} rotation={[Math.PI / 2 + i * 0.3, i * 0.5, 0]}>
                    <torusGeometry args={[1.5 + i * 0.2, 0.02, 16, 100]} />
                    <meshBasicMaterial
                        color={i === 0 ? '#00D9FF' : i === 1 ? '#7A5CFF' : '#FF2BD6'}
                        transparent
                        opacity={0.6 - i * 0.15}
                    />
                </mesh>
            ))}

            {/* Central Sparkles */}
            <Sparkles
                count={50}
                scale={3}
                size={3}
                speed={0.5}
                color="#00D9FF"
            />

            {/* ProWeb Studio Label */}
            <Html
                position={[0, -2.5, 0]}
                center
                distanceFactor={8}
                style={{ pointerEvents: 'none' }}
            >
                <div
                    className="text-white font-bold text-xl whitespace-nowrap select-none"
                    style={{ textShadow: '0 0 10px rgba(0, 217, 255, 0.8)' }}
                >
                    ProWeb Studio
                </div>
            </Html>
        </group>
    );
}

/**
 * Service Planet Component - Simplified version
 */
function ServicePlanetMesh({
    service,
    isSelected,
    isHovered,
    onHover,
    onClick,
}: {
    service: ServicePlanet;
    isSelected: boolean;
    isHovered: boolean;
    onHover: (hovered: boolean) => void;
    onClick: () => void;
}) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const groupRef = useRef<THREE.Group>(null!);
    const ringRef = useRef<THREE.Mesh>(null!);
    const orbitAngleRef = useRef(Math.random() * Math.PI * 2);
    const router = useRouter(); // Use Next.js router

    useFrame((state, delta) => {
        const time = state.clock.elapsedTime;

        // Orbit around the sun
        orbitAngleRef.current += delta * service.orbitSpeed;
        const x = Math.cos(orbitAngleRef.current) * service.orbitRadius;
        const z = Math.sin(orbitAngleRef.current) * service.orbitRadius;

        if (groupRef.current) {
            groupRef.current.position.x = x;
            groupRef.current.position.z = z;
            groupRef.current.position.y = Math.sin(time * 0.5 + service.orbitRadius) * 0.3;
        }

        // Self rotation
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.5;

            // Scale up when hovered/selected
            const targetScale = isHovered || isSelected ? 1.3 : 1;
            meshRef.current.scale.lerp(
                new THREE.Vector3(targetScale, targetScale, targetScale),
                0.1
            );
        }

        // Ring animation
        if (ringRef.current) {
            ringRef.current.rotation.z = time * 0.3;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Planet Trail */}
            <Trail
                width={isHovered ? 1.5 : 0.8}
                length={15}
                color={service.color}
                attenuation={(t) => t * t}
            >
                <mesh
                    ref={meshRef}
                    onPointerEnter={() => onHover(true)}
                    onPointerLeave={() => onHover(false)}
                    onClick={onClick}
                >
                    <sphereGeometry args={[service.size, 32, 32]} />
                    <meshStandardMaterial
                        color={service.color}
                        emissive={service.emissiveColor}
                        emissiveIntensity={isHovered ? 1.5 : 0.8}
                        metalness={0.3}
                        roughness={0.2}
                    />
                </mesh>
            </Trail>

            {/* Planet Ring (for E-commerce and 3D services) */}
            {(service.id === 'ecommerce' || service.id === '3d-experiences') && (
                <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
                    <torusGeometry args={[service.size * 1.5, 0.03, 8, 64]} />
                    <meshBasicMaterial
                        color={service.color}
                        transparent
                        opacity={0.6}
                    />
                </mesh>
            )}

            {/* Moons for larger planets */}
            {service.size >= 0.5 && (
                <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
                    <mesh position={[service.size * 2, 0, 0]}>
                        <sphereGeometry args={[service.size * 0.2, 16, 16]} />
                        <meshStandardMaterial
                            color={service.color}
                            emissive={service.emissiveColor}
                            emissiveIntensity={0.5}
                        />
                    </mesh>
                </Float>
            )}

            {/* Service Icon */}
            <Html
                position={[0, service.size + 0.5, 0]}
                center
                distanceFactor={15}
                style={{
                    pointerEvents: 'none',
                    userSelect: 'none',
                }}
            >
                <div className="text-2xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transform hover:scale-110 transition-transform duration-300">{service.icon}</div>
            </Html>

            {/* Info Popup on Hover */}
            {(isHovered || isSelected) && (
                <Html
                    position={[service.size + 1, 0, 0]}
                    distanceFactor={10}
                    style={{
                        pointerEvents: 'auto', // Always interactive when visible
                        zIndex: 100,
                    }}
                >
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 min-w-[280px] shadow-[0_0_30px_rgba(0,0,0,0.5)] transform transition-all duration-300 hover:border-cyan-500/30 group">
                        {/* Decorative glow */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>

                        <div className="relative">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-3xl p-2 bg-white/5 rounded-lg border border-white/10">{service.icon}</span>
                                <div>
                                    <h3 className="text-white font-bold text-lg leading-tight">{service.dutchName}</h3>
                                    <p className="text-cyan-400 text-xs font-medium tracking-wide">{service.name}</p>
                                </div>
                            </div>

                            <p className="text-slate-300 text-sm mb-4 leading-relaxed border-t border-white/5 pt-3">
                                {service.description}
                            </p>

                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {service.features.map((feature, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-1 bg-white/5 border border-white/5 rounded-[4px] text-[10px] text-cyan-200 uppercase tracking-wider"
                                    >
                                        {feature}
                                    </span>
                                ))}
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent bubbling to planet click
                                    router.push(service.ctaLink);
                                }}
                                className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold text-sm hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2 group-hover:shadow-cyan-500/25"
                            >
                                {service.ctaText}
                                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </div>
                    </div>
                </Html>
            )}

            {/* Atmospheric Glow */}
            <mesh>
                <sphereGeometry args={[service.size * 1.2, 32, 32]} />
                <meshBasicMaterial
                    color={service.color}
                    transparent
                    opacity={isHovered ? 0.3 : 0.1}
                    side={THREE.BackSide}
                />
            </mesh>
        </group>
    );
}

/**
 * Orbit Paths - Visual representation of planetary orbits
 */
function OrbitPaths() {
    return (
        <group rotation={[Math.PI / 2, 0, 0]}>
            {SERVICES.map((service) => (
                <mesh key={service.id}>
                    <ringGeometry args={[service.orbitRadius - 0.02, service.orbitRadius + 0.02, 128]} />
                    <meshBasicMaterial
                        color={service.color}
                        transparent
                        opacity={0.15}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}
        </group>
    );
}

/**
 * Lighting System
 */
function GalaxyLighting() {
    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight
                position={[0, 0, 0]}
                intensity={3}
                color="#00D9FF"
                distance={30}
                decay={2}
            />
            <pointLight
                position={[10, 5, 10]}
                intensity={0.5}
                color="#7A5CFF"
                distance={20}
                decay={2}
            />
            <pointLight
                position={[-10, -5, -10]}
                intensity={0.3}
                color="#FF2BD6"
                distance={20}
                decay={2}
            />
        </>
    );
}

// ============================================================================
// MAIN SCENE COMPONENT
// ============================================================================

function GalaxySceneContent({
    onServiceClick,
    autoRotate = true,
    selectedService,
}: GalaxySceneProps) {
    const [hoveredService, setHoveredService] = useState<string | null>(null);
    const [activeService, setActiveService] = useState<string | null>(selectedService || null);

    const { capabilities } = useDeviceCapabilities();

    const performanceTier: PerformanceTier = capabilities.isLowEndDevice
        ? 'low'
        : capabilities.isMobile
            ? 'medium'
            : 'high';

    const config = getPerformanceConfig(performanceTier);

    const handleServiceClick = useCallback((serviceId: string) => {
        setActiveService(prev => prev === serviceId ? null : serviceId);
        onServiceClick?.(serviceId);
    }, [onServiceClick]);

    // Synchronize prop state with internal state
    React.useEffect(() => {
        if (selectedService !== undefined) {
            setActiveService(selectedService);
        }
    }, [selectedService]);

    return (
        <>
            <color attach="background" args={['#030015']} />

            <GalaxyLighting />

            <OrbitControls
                enablePan={false}
                enableDamping
                dampingFactor={0.05}
                rotateSpeed={0.5}
                autoRotate={autoRotate && !hoveredService && !activeService}
                autoRotateSpeed={0.2}
                minDistance={5}
                maxDistance={25}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI * 0.75}
            />

            {/* Background Stars */}
            <Stars
                radius={50}
                depth={50}
                count={config.starCount}
                factor={4}
                saturation={0}
                fade
                speed={0.5}
            />

            {/* Central Sun */}
            <CentralSun />

            {/* Service Planets */}
            {SERVICES.map((service) => (
                <ServicePlanetMesh
                    key={service.id}
                    service={service}
                    isSelected={activeService === service.id}
                    isHovered={hoveredService === service.id}
                    onHover={(hovered) => setHoveredService(hovered ? service.id : null)}
                    onClick={() => handleServiceClick(service.id)}
                />
            ))}

            {/* Orbit Paths */}
            <OrbitPaths />

            {/* Post Processing */}
            {config.enableBloom && (
                <EffectComposer multisampling={capabilities.isMobile ? 2 : 4}>
                    <Bloom
                        intensity={config.bloomIntensity}
                        luminanceThreshold={0.2}
                        luminanceSmoothing={0.9}
                        kernelSize={capabilities.isMobile ? KernelSize.MEDIUM : KernelSize.LARGE}
                        mipmapBlur
                    />
                    <Vignette eskil={false} offset={0.1} darkness={0.5} />
                </EffectComposer>
            )}

            <AdaptiveDpr pixelated />
            <Preload all />
        </>
    );
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

export default function DigitalGalaxyScene({
    onServiceClick,
    autoRotate = true,
    selectedService,
}: GalaxySceneProps) {
    const { capabilities } = useDeviceCapabilities();

    const performanceTier: PerformanceTier = capabilities.isLowEndDevice
        ? 'low'
        : capabilities.isMobile
            ? 'medium'
            : 'high';

    const config = getPerformanceConfig(performanceTier);

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                minHeight: 600,
                background: 'radial-gradient(ellipse at center, #0a0520 0%, #030015 100%)',
            }}
        >
            <Canvas
                gl={{
                    antialias: !capabilities.isMobile,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    outputColorSpace: THREE.SRGBColorSpace,
                    powerPreference: 'high-performance',
                    alpha: false,
                    preserveDrawingBuffer: false,
                    failIfMajorPerformanceCaveat: false,
                    stencil: false,
                }}
                dpr={config.dpr}
                camera={{
                    position: [12, 8, 12],
                    fov: capabilities.isMobile ? 60 : 50,
                    near: 0.1,
                    far: 200,
                }}
                onCreated={(state) => {
                    // WebGL context loss prevention
                    const canvas = state.gl.domElement;
                    canvas.addEventListener('webglcontextlost', (event) => {
                        console.warn('WebGL context lost');
                        event.preventDefault();
                    });
                    canvas.addEventListener('webglcontextrestored', () => {
                        console.log('WebGL context restored');
                    });
                }}
            >
                <React.Suspense fallback={null}>
                    <GalaxySceneContent
                        onServiceClick={onServiceClick}
                        autoRotate={autoRotate}
                        selectedService={selectedService}
                    />
                </React.Suspense>
            </Canvas>

            {/* Instruction Overlay */}
            <div className="absolute bottom-4 left-4 text-white/60 text-xs pointer-events-none">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                    <span>Klik op een planeet voor meer info</span>
                </div>
            </div>

            {/* Legend */}
            <div className="absolute top-4 right-4 hidden md:block">
                <div className="bg-slate-900/70 backdrop-blur-sm border border-white/10 rounded-lg p-3">
                    <p className="text-white/80 text-xs font-medium mb-2">Onze Diensten</p>
                    <div className="space-y-1">
                        {SERVICES.map((service) => (
                            <div key={service.id} className="flex items-center gap-2 text-xs">
                                <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: service.color }}
                                />
                                <span className="text-white/60">{service.icon} {service.dutchName}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
