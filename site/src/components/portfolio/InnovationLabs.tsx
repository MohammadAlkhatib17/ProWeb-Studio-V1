'use client';

import { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';

import { LiveBadge, FooterLeft, FooterRight } from '@/components/overlay/HUDCopy';
import SceneHUD from '@/components/overlay/SceneHUD';

// Dynamically import the 3D component with loading fallback
const TechPlaygroundScene = dynamic(() => import('@/components/TechPlaygroundScene'), {
    loading: () => (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                <p className="text-cyan-300 text-sm">Loading R&D Lab...</p>
            </div>
        </div>
    ),
    ssr: false
});

export default function InnovationLabs() {
    const [material, setMaterial] = useState<'crystal' | 'energy'>('crystal');
    const [palette, setPalette] = useState<'anwar' | 'sunfire'>('anwar');
    const [animationState, setAnimationState] = useState<'idle' | 'active' | 'perpetual'>('idle');
    const [interactionHeat, setInteractionHeat] = useState(0);
    const [isLowPerformanceMode, setIsLowPerformanceMode] = useState(false);

    useEffect(() => {
        const connection = (navigator as { connection?: { effectiveType?: string } }).connection;
        const isSlowConnection = connection && (
            connection.effectiveType === 'slow-2g' ||
            connection.effectiveType === '2g' ||
            connection.effectiveType === '3g'
        );
        const isLowEndDevice = navigator.hardwareConcurrency <= 2;
        if (isSlowConnection || isLowEndDevice) setIsLowPerformanceMode(true);
    }, []);

    useEffect(() => {
        const cooldown = setInterval(() => {
            setInteractionHeat((prev) => Math.max(0, prev - 0.1));
        }, 100);
        return () => clearInterval(cooldown);
    }, []);

    const handleMaterialToggle = useCallback(() => {
        setMaterial((prev) => (prev === 'crystal' ? 'energy' : 'crystal'));
        setInteractionHeat((prev) => Math.min(1, prev + 0.3));
    }, []);

    const handlePaletteToggle = useCallback(() => {
        setPalette((prev) => (prev === 'anwar' ? 'sunfire' : 'anwar'));
        setInteractionHeat((prev) => Math.min(1, prev + 0.3));
    }, []);

    const handleAnimationToggle = useCallback(() => {
        setAnimationState((prev) => {
            if (prev === 'idle') {
                setInteractionHeat(1);
                return 'active';
            } else if (prev === 'active') {
                return 'perpetual';
            } else {
                return 'idle';
            }
        });
    }, []);

    const getAnimationButtonText = () => {
        switch (animationState) {
            case 'idle': return 'Start Animatie';
            case 'active': return 'Eeuwige Modus';
            case 'perpetual': return 'Stop Animatie';
            default: return 'Start Animatie';
        }
    };

    const getInteractionStyling = (baseClasses: string) => {
        const heatLevel = Math.floor(interactionHeat * 3);
        const heatStyles = [
            '',
            'ring-2 ring-cyan-400/30',
            'ring-2 ring-cyan-400/60 shadow-cyan-400/20',
            'ring-4 ring-cyan-400 shadow-lg shadow-cyan-400/40 scale-105',
        ];
        return `${baseClasses} ${heatStyles[heatLevel]} transition-all duration-500`;
    };

    return (
        <section id="innovation-labs" className="relative py-24 lg:py-32 overflow-hidden border-t border-white/5 bg-black/20">

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-sm font-medium mb-6">
                        <span>R&D Division</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        ProWeb <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">Labs</span>
                    </h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Dit is waar wij de regels breken. Geen klanten, geen deadlines, alleen pure innovatie.
                        Experimenteer zelf met onze WebGL engine.
                    </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-4 mb-12">
                    <button
                        onClick={handleMaterialToggle}
                        className={getInteractionStyling('px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors')}
                    >
                        {material === 'crystal' ? '🔮 Crystal Mode' : '⚡ Energy Mode'}
                    </button>
                    <button
                        onClick={handlePaletteToggle}
                        className={getInteractionStyling('px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors')}
                    >
                        {palette === 'anwar' ? '🌊 Anwar Palette' : '🌅 Sunfire Palette'}
                    </button>
                    <button
                        onClick={handleAnimationToggle}
                        className={`px-6 py-3 rounded-lg font-bold text-black transition-all shadow-lg hover:shadow-cyan-500/20 hover:scale-105 ${animationState === 'idle' ? 'bg-gradient-to-r from-cyan-400 to-blue-500' :
                            animationState === 'active' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                                'bg-gradient-to-r from-red-400 to-pink-500 text-white'
                            }`}
                    >
                        {getAnimationButtonText()}
                    </button>
                </div>

                {/* 3D Canvas */}
                <div className="relative rounded-2xl bg-slate-900/60 ring-1 ring-white/10 overflow-hidden w-full h-[550px] md:h-auto md:aspect-[16/9] shadow-2xl shadow-cyan-900/20">
                    <div className="absolute inset-0 z-0">
                        <TechPlaygroundScene
                            materialMode={material}
                            palette={palette}
                            animationState={animationState}
                            interactionHeat={interactionHeat}
                            autoRotate={!isLowPerformanceMode}
                        />
                    </div>

                    <div className="hidden md:block absolute inset-0 z-10 pointer-events-none">
                        <SceneHUD
                            topLeft={<LiveBadge />}
                            bottomLeft={<FooterLeft />}
                            bottomRight={<FooterRight />}
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}
