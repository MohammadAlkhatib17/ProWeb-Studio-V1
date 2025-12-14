'use client';

import Link from 'next/link';

import { CheckCircle2, ArrowRight, Zap, Target, Rocket } from 'lucide-react';

import { Button } from '@/components/Button';

interface PricingTier {
    name: string;
    price: string;
    description: string;
    features: string[];
    icon?: React.ReactNode;
    color?: string; // 'cyan' | 'magenta' | 'green' etc.
    cta?: string;
    href?: string;
    featured?: boolean;
}

interface PricingSectionProps {
    title?: string;
    subtitle?: string;
    tiers?: PricingTier[];
}

const defaultTiers: PricingTier[] = [
    {
        name: 'Kickstart',
        price: '€1.495',
        description: 'Perfect voor startups en ZZP\'ers die professioneel online willen starten.',
        features: [
            'Professioneel Webdesign (One-pager of tot 5 pagina\'s)',
            'Razendsnellle Next.js Technologie',
            'Basis SEO Optimalisatie',
            'Contactformulier & Google Maps',
            'Volledig Responsive (Mobiel Vriendelijk)',
        ],
        icon: <Zap className="w-6 h-6 text-cyan-400" />,
        color: 'cyan',
        cta: 'Start Project',
        href: '/contact?package=kickstart'
    },
    {
        name: 'Scale-up',
        price: '€2.995',
        description: 'Voor bedrijven die willen groeien met een complete digitale aanwezigheid.',
        features: [
            'Alles uit Kickstart +',
            'CMS Integratie (Beheer zelf je content)',
            'Uitgebreide SEO & Content Strategie',
            '10+ Pagina\'s & Blog Module',
            'Analytics Dashboard Integratie',
            'Meertaligheid optie (i18n)',
        ],
        icon: <Target className="w-6 h-6 text-magenta-400" />,
        color: 'magenta',
        featured: true,
        cta: 'Schaal Op',
        href: '/contact?package=scaleup'
    },
    {
        name: 'Enterprise',
        price: 'Maatwerk',
        description: 'Complexe platformen, webshops en interactieve 3D-ervaringen.',
        features: [
            'Alles uit Scale-up +',
            'Custom 3D & WebGL Experiences',
            'E-commerce / Webshop Functionaliteit',
            'API Koppelingen & Automatisering',
            'High-Performance SLA',
            'Dedicated Project Manager',
        ],
        icon: <Rocket className="w-6 h-6 text-green-400" />,
        color: 'green',
        cta: 'Bespreek Wensen',
        href: '/contact?package=enterprise'
    },
];

export default function PricingSection({
    title = "Transparante Investering in Groei",
    subtitle = "Geen verborgen kosten, geen verrassingen. Alleen heldere pakketten die zichzelf terugverdienen. Kies de motor voor uw digitale succes.",
    tiers = defaultTiers
}: PricingSectionProps) {

    // Helper to map generic config packages to visual tiers if needed, or use them directly
    // This ensures standard colors/icons if they aren't provided in the config
    const displayTiers = tiers.map((tier, index) => {
        // Default assignments if missing
        let defaultColor = 'cyan';
        let defaultIcon = <Zap className="w-6 h-6 text-cyan-400" />;

        if (index === 1) {
            defaultColor = 'magenta';
            defaultIcon = <Target className="w-6 h-6 text-magenta-400" />;
        } else if (index === 2) {
            defaultColor = 'green';
            defaultIcon = <Rocket className="w-6 h-6 text-green-400" />;
        }

        return {
            ...tier,
            color: tier.color || defaultColor,
            icon: tier.icon || defaultIcon,
            cta: tier.cta || (tier.price === 'Maatwerk' ? 'Bespreek Wensen' : 'Kies Pakket'),
            href: tier.href || `/contact?package=${tier.name.toLowerCase().replace(/\s+/g, '-')}`,
            featured: tier.featured !== undefined ? tier.featured : (index === 1) // Default middle tier as featured
        };
    });

    return (
        <section className="py-24 px-4 sm:px-6 relative overflow-hidden" id="pricing">
            {/* Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-cosmic-800/40 to-transparent opacity-50 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 gradient-text leading-tight">
                        {title}
                    </h2>
                    <p className="text-lg text-slate-300">
                        {subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {displayTiers.map((tier) => (
                        <div
                            key={tier.name}
                            className={`relative glass rounded-2xl p-8 border transition-all duration-300 hover:-translate-y-2 group flex flex-col h-full
                ${tier.featured
                                    ? 'border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)] bg-cosmic-800/60 scale-105 z-10'
                                    : 'border-white/10 hover:border-white/20 bg-cosmic-800/30'
                                }
              `}
                        >
                            {tier.featured && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                                    Meest Gekozen
                                </div>
                            )}

                            <div className="mb-8">
                                <div className={`w-12 h-12 rounded-xl bg-${tier.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    {tier.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-4xl font-bold text-white">{tier.price}</span>
                                    {tier.price !== 'Maatwerk' && !tier.price.includes('/m') && <span className="text-slate-400 text-sm">vanaf</span>}
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed min-h-[60px]">
                                    {tier.description}
                                </p>
                            </div>

                            <ul className="space-y-4 mb-8 border-t border-white/5 pt-8 flex-grow">
                                {tier.features.map((feature, j) => (
                                    <li key={j} className="flex items-start gap-3 text-sm text-slate-300">
                                        <CheckCircle2 className={`w-5 h-5 text-${tier.color}-400 shrink-0`} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                href={tier.href || '/contact'}
                                variant={tier.featured ? 'primary' : 'secondary'}
                                className="w-full justify-center group/btn mt-auto"
                            >
                                {tier.cta}
                                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-sm text-slate-500">
                        Alle prijzen zijn exclusief 21% BTW. <Link href="/contact" className="text-cyan-400 hover:underline">Neem contact op</Link> voor een offerte op maat.
                    </p>
                </div>
            </div>
        </section>
    );
}
