/**
 * DigitalGalaxyLabs.tsx
 * ProWeb Studio - Digital Galaxy Labs Section
 * 
 * A comprehensive wrapper component for the Digital Galaxy Scene
 * with controls, loading states, and seamless integration into the portfolio page.
 * 
 * @author ProWeb Studio
 * @version 1.0.0
 */

'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Rocket, Sparkles, Globe, ShoppingCart, TrendingUp, Palette } from 'lucide-react';

import { LiveBadge, FooterLeft, FooterRight } from '@/components/overlay/HUDCopy';
import SceneHUD from '@/components/overlay/SceneHUD';

// Dynamically import the 3D component with loading fallback
const DigitalGalaxyScene = dynamic(() => import('@/three/DigitalGalaxyScene'), {
    loading: () => (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
            <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                    {/* Animated galaxy loading spinner */}
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping" />
                    <div className="absolute inset-2 rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-magenta-400 border-l-transparent animate-spin" />
                    <div className="absolute inset-4 rounded-full border-2 border-t-transparent border-r-cyan-300 border-b-transparent border-l-magenta-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                    <div className="absolute inset-6 rounded-full bg-gradient-to-br from-cyan-500 to-magenta-500 animate-pulse" />
                </div>
                <p className="text-cyan-300 text-sm font-medium mb-1">Universum Laden...</p>
                <p className="text-slate-500 text-xs">Bereid je voor op de reis</p>
            </div>
        </div>
    ),
    ssr: false,
});

// Service information for quick access buttons
const GALAXY_SERVICES = [
    {
        id: 'web-development',
        icon: Globe,
        label: 'Web Dev',
        color: 'from-cyan-500 to-blue-500',
    },
    {
        id: 'ecommerce',
        icon: ShoppingCart,
        label: 'E-commerce',
        color: 'from-magenta-500 to-purple-500',
    },
    {
        id: '3d-experiences',
        icon: Sparkles,
        label: '3D/WebGL',
        color: 'from-purple-500 to-indigo-500',
    },
    {
        id: 'seo-performance',
        icon: TrendingUp,
        label: 'SEO',
        color: 'from-green-500 to-emerald-500',
    },
    {
        id: 'brand-identity',
        icon: Palette,
        label: 'Branding',
        color: 'from-orange-500 to-yellow-500',
    },
];

export default function DigitalGalaxyLabs() {
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [isAutoRotate, setIsAutoRotate] = useState(true);

    const handleServiceClick = useCallback((serviceId: string) => {
        setSelectedService(prev => prev === serviceId ? null : serviceId);
        // Pause auto-rotate when a service is selected
        if (serviceId !== selectedService) {
            setIsAutoRotate(false);
        }
    }, [selectedService]);

    const handleQuickSelect = useCallback((serviceId: string) => {
        setSelectedService(serviceId);
        setIsAutoRotate(false);
    }, []);

    const resetGalaxy = useCallback(() => {
        setSelectedService(null);
        setIsAutoRotate(true);
    }, []);

    return (
        <section
            id="digital-galaxy"
            className="relative py-24 lg:py-32 overflow-hidden border-t border-white/5 bg-gradient-to-b from-black/20 via-slate-900/30 to-black/20"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-magenta-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
                        <Rocket className="w-4 h-4" />
                        <span>Interactieve Ervaring</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        De <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-magenta-400 to-purple-400">Digitale Melkweg</span>
                    </h2>

                    <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
                        Ontdek ons complete universum van digitale diensten. Elk planeet vertegenwoordigt
                        een expertisegebied waar wij uw visie tot leven brengen.
                    </p>

                    {/* Quick Navigation Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                        <span className="text-slate-400 text-sm mr-2">Snelle Navigatie:</span>
                        {GALAXY_SERVICES.map((service) => {
                            const IconComponent = service.icon;
                            return (
                                <button
                                    key={service.id}
                                    onClick={() => handleQuickSelect(service.id)}
                                    className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                    transition-all duration-300 transform hover:scale-105
                    ${selectedService === service.id
                                            ? `bg-gradient-to-r ${service.color} text-white shadow-lg`
                                            : 'bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                                        }
                  `}
                                >
                                    <IconComponent className="w-4 h-4" />
                                    <span className="hidden sm:inline">{service.label}</span>
                                </button>
                            );
                        })}
                        {selectedService && (
                            <button
                                onClick={resetGalaxy}
                                className="px-4 py-2 rounded-full text-sm text-slate-400 hover:text-white transition-colors"
                            >
                                ✕ Reset
                            </button>
                        )}
                    </div>
                </div>

                {/* 3D Canvas Container */}
                <div className="relative rounded-2xl bg-slate-900/60 ring-1 ring-white/10 overflow-hidden w-full h-[600px] md:h-auto md:aspect-[16/9] shadow-2xl shadow-cyan-900/20">

                    {/* The 3D Scene */}
                    <div className="absolute inset-0 z-0">
                        <DigitalGalaxyScene
                            onServiceClick={handleServiceClick}
                            autoRotate={isAutoRotate}
                            selectedService={selectedService}
                        />
                    </div>

                    {/* HUD Overlay */}
                    <div className="hidden md:block absolute inset-0 z-10 pointer-events-none">
                        <SceneHUD
                            topLeft={
                                <div className="flex items-center gap-3">
                                    <LiveBadge />
                                    <span className="text-cyan-300/80 text-xs">
                                        {selectedService ? 'Planeet geselecteerd' : 'Verken het universum'}
                                    </span>
                                </div>
                            }
                            bottomLeft={<FooterLeft />}
                            bottomRight={
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setIsAutoRotate(!isAutoRotate)}
                                        className="text-xs text-white/60 hover:text-white/90 transition-colors flex items-center gap-1"
                                    >
                                        {isAutoRotate ? '⏸ Pauzeer rotatie' : '▶ Auto-rotatie'}
                                    </button>
                                    <FooterRight />
                                </div>
                            }
                        />
                    </div>

                    {/* Mobile Instructions */}
                    <div className="md:hidden absolute bottom-4 left-4 right-4 text-center">
                        <p className="text-white/50 text-xs">
                            👆 Tik en sleep om te roteren • 🤏 Knijp om te zoomen
                        </p>
                    </div>
                </div>

                {/* Bottom CTA Section */}
                <div className="mt-12 text-center">
                    <div className="inline-flex flex-col sm:flex-row items-center gap-4">
                        <Link
                            href="/contact"
                            className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-magenta-500 text-white font-bold text-lg hover:from-cyan-400 hover:to-magenta-400 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 flex items-center gap-2"
                        >
                            <Rocket className="w-5 h-5" />
                            Start Jouw Reis
                        </Link>
                        <Link
                            href="/diensten"
                            className="px-8 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-all duration-300 flex items-center gap-2"
                        >
                            Bekijk Alle Diensten →
                        </Link>
                    </div>

                    <p className="mt-6 text-slate-400 text-sm">
                        Elke planeet in ons universum vertegenwoordigt jaren van expertise en honderden succesvolle projecten.
                    </p>
                </div>

            </div>

            {/* Background Gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-magenta-500/10 rounded-full blur-[120px] pointer-events-none" />
        </section>
    );
}
