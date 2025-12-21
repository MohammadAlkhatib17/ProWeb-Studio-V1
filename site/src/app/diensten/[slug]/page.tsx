import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { HeroCanvas, ServiceHeroScene } from '@/components/3d/ClientScene';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/Button';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import FAQSection from '@/components/sections/FAQSection';
import SEOSchema from '@/components/SEOSchema';
import { getAllDienstSlugs, getDienstBySlug, diensten } from '@/config/diensten.config';
import { generateMetadata as generateMetadataUtil } from '@/lib/metadata';
import PricingSection from '@/components/sections/PricingSection';

import type { Metadata } from 'next';

export const dynamic = 'force-static';
export const revalidate = 86400; // 24 hours ISR

interface ServicePageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    return getAllDienstSlugs().map((slug) => ({
        slug,
    }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
    const { slug } = await params;
    const dienst = getDienstBySlug(slug);

    if (!dienst) {
        return {
            title: 'Dienst niet gevonden | ProWeb Studio',
            description: 'De opgevraagde dienst is niet gevonden.',
        };
    }

    return generateMetadataUtil({
        title: `${dienst.title} - ProWeb Studio`,
        description: dienst.description,
        path: `/diensten/${dienst.slug}`,
        keywords: dienst.keywords,
    });
}

export default async function ServicePage({ params }: ServicePageProps) {
    const { slug } = await params;
    const dienst = getDienstBySlug(slug);

    if (!dienst) {
        notFound();
    }

    // Related services
    const relatedServices = diensten
        .filter(d => dienst.relatedDiensten.includes(d.slug))
        .slice(0, 3);

    return (
        <main className="relative content-safe-top pt-20 md:pt-24 overflow-hidden">
            <SEOSchema
                pageType="services"
                pageTitle={dienst.title}
                pageDescription={dienst.description}
                includeFAQ={!!dienst.faq}
            />

            <Breadcrumbs />

            {/* Hero Section with 3D Background */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-section-lg">
                {/* 3D Scene Layer */}
                <div className="absolute inset-0 z-0">
                    <HeroCanvas>
                        <ServiceHeroScene serviceSlug={dienst.slug} />
                    </HeroCanvas>
                    {/* Overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-cosmic-900/40 via-cosmic-900/60 to-cosmic-900 pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-cosmic-900/50 to-cosmic-900 pointer-events-none" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-sm font-medium mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.2)] animate-fade-in">
                        <span className="text-xl mr-1">{dienst.icon}</span>
                        <span className="uppercase tracking-wide text-xs">{dienst.deliveryTime} levertijd</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight tracking-tight drop-shadow-2xl">
                        {dienst.name.split(' ').slice(0, -1).join(' ')}{' '}
                        <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x p-2">
                            {dienst.name.split(' ').slice(-1)}
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-100 mb-10 leading-relaxed max-w-3xl mx-auto drop-shadow-lg font-light">
                        {dienst.shortDescription}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                        <Button
                            href="/contact"
                            variant="primary"
                            size="large"
                            className="shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] transform hover:-translate-y-1 transition-all duration-300"
                        >
                            Start Project Vanaf {dienst.pricing.from}
                        </Button>
                        <Button
                            href="#werkwijze"
                            variant="secondary"
                            size="large"
                            className="backdrop-blur-xl bg-white/5 border-white/10 hover:bg-white/10"
                        >
                            Bekijk Proces
                        </Button>
                    </div>
                </div>
            </section>

            {/* Main Content Areas */}

            {/* 1. Benefits Grid (Glassmorphism) */}
            <section className="relative z-10 py-section px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Waarom kiezen voor <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">ProWeb Studio?</span>
                        </h2>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                            Wij combineren technische perfectie met oogstrelend design.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {dienst.featuresDetail?.map((feature, idx) => (
                            <div key={idx} className="group relative p-8 rounded-3xl bg-black/20 border border-white/5 backdrop-blur-sm hover:bg-white/5 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-900/40 to-blue-900/40 flex items-center justify-center text-3xl mb-6 border border-white/10 text-cyan-400 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-900/20">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">{feature.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-4">{feature.description}</p>
                                <ul className="space-y-2">
                                    {feature.details.map((detail, i) => (
                                        <li key={i} className="flex items-center text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 mr-2"></span>
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 2. Pricing Packages (If available) */}
            {dienst.packages && (
                <PricingSection
                    title={`Prijzen voor ${dienst.name}`}
                    subtitle={`Transparante tarieven voor ${dienst.name}. Kies het pakket dat bij u past.`}
                    tiers={dienst.packages}
                />
            )}

            {/* 3. Process Steps (Visual) */}
            {dienst.process && (
                <section id="werkwijze" className="relative z-10 py-section px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                                Ons <span className="text-purple-400">Proces</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {dienst.process.map((step, idx) => (
                                <div key={idx} className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl opacity-20 blur group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                                    <div className="relative p-8 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 h-full flex flex-col items-center text-center hover:bg-black/60 transition-colors">
                                        <div className="text-6xl font-black text-white/5 mb-4 group-hover:text-cyan-500/10 transition-colors">{step.step}</div>
                                        <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                                        <p className="text-slate-400 text-sm mb-4 leading-relaxed">{step.description}</p>
                                        <div className="mt-auto px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-cyan-300 font-mono">
                                            {step.duration}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 4. FAQ */}
            {dienst.faq && (
                <ErrorBoundary>
                    <Suspense fallback={<div className="h-64" />}>
                        <FAQSection title="Veelgestelde Vragen">
                            <div className="space-y-4 max-w-3xl mx-auto">
                                {dienst.faq.map((item, idx) => (
                                    <div key={idx} className="bg-cosmic-800/30 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-6 hover:border-cyan-500/30 transition-colors">
                                        <h3 className="text-lg font-bold text-white mb-2">{item.question}</h3>
                                        <p className="text-slate-400 leading-relaxed">{item.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </FAQSection>
                    </Suspense>
                </ErrorBoundary>
            )}

            {/* CTA */}
            <section className="relative z-10 py-section-lg text-center px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
                        Klaar voor de volgende stap?
                    </h2>
                    <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                        Laat ons uw visie vertalen naar een digitaal meesterwerk.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button href="/contact" variant="primary" size="large" className="shadow-lg shadow-cyan-500/25">
                            Start Uw Project
                        </Button>
                        <Button href="/portfolio" variant="secondary" size="large">
                            Bekijk Cases
                        </Button>
                    </div>
                </div>
            </section>

            {/* Related Services Links */}
            <section className="py-section bg-black/20 backdrop-blur-sm border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-white mb-8 text-center">Gerelateerde Diensten</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedServices.map((d) => (
                            <Link key={d.slug} href={`/diensten/${d.slug}`} className="group p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-cyan-500/30 transition-all hover:-translate-y-1 backdrop-blur-sm">
                                <div className="text-3xl mb-4">{d.icon}</div>
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">{d.name}</h3>
                                <p className="text-sm text-slate-400">{d.shortDescription}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

        </main>
    );
}
