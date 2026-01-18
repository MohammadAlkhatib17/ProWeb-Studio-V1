'use client';

/**
 * MarketInsightCards - City-specific market facts and statistics
 * Ethical alternative to testimonials - uses real data to build trust
 */

import type { Stad } from '@/config/steden.config';
import type { Dienst } from '@/config/diensten.config';

// Service-specific market insights that can be combined with city data
const serviceInsights: Record<string, { icon: string; title: string; fact: string }[]> = {
    'website-laten-maken': [
        { icon: '⚡', title: 'Snelheid = Conversie', fact: '53% van mobiele bezoekers verlaat een site die langer dan 3 seconden laadt.' },
        { icon: '📱', title: 'Mobile-First', fact: '67% van alle websitebezoeken in Nederland komt van mobiele apparaten.' },
        { icon: '🎯', title: 'Eerste Indruk', fact: 'Bezoekers vormen binnen 0.05 seconden een mening over uw website.' },
    ],
    'webshop-laten-maken': [
        { icon: '🛒', title: 'E-commerce Groei', fact: 'Nederlandse B2C e-commerce groeide met 12% naar €35 miljard in 2024.' },
        { icon: '💳', title: 'Checkout Optimalisatie', fact: '70% van online winkelwagens wordt verlaten voor checkout.' },
        { icon: '🚚', title: 'Snelle Levering', fact: '48% van consumenten kiest een webshop op basis van levertijd.' },
    ],
    'seo-optimalisatie': [
        { icon: '🔍', title: 'Organisch Verkeer', fact: '68% van alle online ervaringen begint met een zoekmachine.' },
        { icon: '📊', title: 'Klikgedrag', fact: 'De #1 positie in Google ontvangt 27.6% van alle klikken.' },
        { icon: '🏆', title: 'Lokaal Zoeken', fact: '46% van alle Google-zoekopdrachten heeft lokale intentie.' },
    ],
    '3d-website-ervaringen': [
        { icon: '🎮', title: 'Engagement', fact: 'Interactieve 3D-content verhoogt engagement met 300-400%.' },
        { icon: '👁️', title: 'Aandacht', fact: 'Bezoekers besteden 5.5x meer tijd op paginas met 3D-elementen.' },
        { icon: '🧠', title: 'Herinnering', fact: 'Visuele content wordt 65% beter onthouden dan tekst.' },
    ],
    'onderhoud-support': [
        { icon: '🛡️', title: 'Security', fact: '43% van alle cyberaanvallen richt zich op kleine bedrijven.' },
        { icon: '⏱️', title: 'Downtime Kost', fact: 'Gemiddelde kosten van website-downtime: €5.600 per minuut.' },
        { icon: '🔄', title: 'Updates', fact: '39% van gehackte WordPress-sites had verouderde software.' },
    ],
};

interface MarketInsightCardsProps {
    stad: Stad;
    dienst: Dienst;
    className?: string;
}

export default function MarketInsightCards({ stad, dienst, className = '' }: MarketInsightCardsProps) {
    const insights = serviceInsights[dienst.slug] || serviceInsights['website-laten-maken'];
    const cityContent = stad.serviceContent?.[dienst.slug];

    return (
        <section className={`py-section ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="text-xs uppercase tracking-wider text-cyan-400 font-medium mb-3 block">
                        📈 Marktinzichten
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Waarom {dienst.name} in {stad.name}?
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Data-gedreven redenen om te investeren in uw digitale aanwezigheid
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {insights.map((insight, index) => (
                        <div
                            key={index}
                            className="bg-cosmic-800/30 border border-cosmic-700/50 rounded-xl p-6 hover:border-cyan-500/30 transition-all"
                        >
                            <div className="text-3xl mb-4">{insight.icon}</div>
                            <h3 className="text-lg font-semibold text-white mb-2">{insight.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{insight.fact}</p>
                        </div>
                    ))}
                </div>

                {/* City-specific stat if available */}
                {cityContent?.localStats && (
                    <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-700/30 rounded-xl p-6 md:p-8">
                        <div className="flex items-start gap-4">
                            <div className="text-3xl">🏙️</div>
                            <div>
                                <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                                    Specifiek voor {stad.name}
                                </h3>
                                <p className="text-slate-200 leading-relaxed">
                                    {cityContent.localStats}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Industry context */}
                {stad.localIndustries && stad.localIndustries.length > 0 && (
                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500">
                            Relevante sectoren in {stad.name}:
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 mt-3">
                            {stad.localIndustries.map((industry, idx) => (
                                <span
                                    key={idx}
                                    className="text-xs px-3 py-1 bg-cosmic-800/50 text-slate-300 rounded-full"
                                >
                                    {industry}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
