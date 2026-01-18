import Link from 'next/link';
import { notFound } from 'next/navigation';

import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/Button';
import ContentSuggestions from '@/components/ContentSuggestions';
import { DutchBusinessInfo } from '@/components/local-seo';
import MarketInsightCards from '@/components/MarketInsightCards';
import PricingSection from '@/components/sections/PricingSection';
import StickyMobileCTA from '@/components/StickyMobileCTA';
import TechTrustStrip from '@/components/TechTrustStrip';
import { Icon } from '@/components/ui/Icon';
import {
  getDienstBySlug,
  getRelatedDiensten,
  getAllDienstSlugs,
  isDienstAvailableInStad,
} from '@/config/diensten.config';
import {
  getStadBySlug,
  getNearbySteden,
  getAllStadSlugs,
} from '@/config/steden.config';
import {
  generateStadDienstMetadata,
  generateStadDienstSchema
} from '@/lib/seo/steden-metadata';

import type { Metadata } from 'next';

export const dynamic = 'force-static';
export const revalidate = 259200; // 72 hours ISR

interface StadDienstPageProps {
  params: Promise<{
    stad: string;
    dienst: string;
  }>;
}

// Generate static params for all city+service combinations
export async function generateStaticParams() {
  const stadSlugs = getAllStadSlugs();
  const dienstSlugs = getAllDienstSlugs();

  const combinations = [];

  for (const stadSlug of stadSlugs) {
    for (const dienstSlug of dienstSlugs) {
      // Only generate pages for valid combinations
      if (isDienstAvailableInStad()) {
        combinations.push({
          stad: stadSlug,
          dienst: dienstSlug,
        });
      }
    }
  }

  return combinations;
}

// Generate metadata for each city+service page
export async function generateMetadata({ params }: StadDienstPageProps): Promise<Metadata> {
  const { stad: stadSlug, dienst: dienstSlug } = await params;
  const stad = getStadBySlug(stadSlug);
  const dienst = getDienstBySlug(dienstSlug);

  if (!stad || !dienst) {
    return {
      title: 'Pagina niet gevonden | ProWeb Studio',
      description: 'De opgevraagde pagina is niet gevonden.',
    };
  }

  return generateStadDienstMetadata({ stad, dienst });
}

export default async function StadDienstPage({ params }: StadDienstPageProps) {
  const { stad: stadSlug, dienst: dienstSlug } = await params;
  const stad = getStadBySlug(stadSlug);
  const dienst = getDienstBySlug(dienstSlug);

  // 404 if either stad or dienst not found, or if service not available in city
  if (!stad || !dienst || !isDienstAvailableInStad()) {
    notFound();
  }

  const nearbySteden = getNearbySteden(stad.slug).slice(0, 3);
  const relatedDiensten = getRelatedDiensten(dienst.slug).slice(0, 3);

  const stadDienstSchema = generateStadDienstSchema(stad, dienst);

  return (
    <main className="pt-20 md:pt-24 relative overflow-hidden">
      <Breadcrumbs />

      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(stadDienstSchema),
        }}
      />

      {/* Hero Section */}
      <section className="relative py-section-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            {/* Breadcrumb-like navigation */}
            <div className="flex items-center gap-2 mb-6 text-sm">
              <Link href="/steden" className="text-cyan-300 hover:text-cyan-200">
                Steden
              </Link>
              <span className="text-slate-400">→</span>
              <Link href={`/steden/${stad.slug}`} className="text-cyan-300 hover:text-cyan-200">
                {stad.name}
              </Link>
              <span className="text-slate-400">→</span>
              <span className="text-slate-400">{dienst.name}</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <Icon name={dienst.icon} className="w-8 h-8 text-cyan-400" />
              <span className="text-cyan-300 font-medium">{stad.name} • {stad.province}</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {dienst.name}
              </span>
              {' '}in {stad.name}
            </h1>

            <p className="text-xl md:text-2xl text-slate-200 mb-8 leading-relaxed">
              {dienst.description} Speciaal voor ondernemers en bedrijven in {stad.name} en omgeving.
            </p>

            <div className="flex items-center gap-6 mb-8 text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                Vanaf {dienst.pricing.from}
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                {dienst.deliveryTime}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                href="/contact"
                variant="primary"
                size="large"
              >
                Vraag Offerte Aan →
              </Button>
              <Button
                href={`/steden/${stad.slug}`}
                variant="secondary"
                size="large"
              >
                Andere Diensten in {stad.name}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMMATIC SEO: City-Specific Content Section */}
      {stad.serviceContent?.[dienst.slug] && (
        <section className="py-section bg-gradient-to-b from-cyan-900/10 to-transparent">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-cyan-300 mb-6">
              {stad.serviceContent[dienst.slug].localHeadline}
            </h2>
            <p className="text-xl text-slate-200 leading-relaxed mb-8">
              {stad.serviceContent[dienst.slug].localParagraph}
            </p>

            {/* Local Stats Callout */}
            {stad.serviceContent[dienst.slug].localStats && (
              <div className="p-6 bg-cosmic-800/50 rounded-xl border-l-4 border-cyan-500 mb-8">
                <div className="flex items-start gap-4">
                  <Icon name="📊" className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                  <p className="text-slate-300 italic">
                    {stad.serviceContent[dienst.slug].localStats}
                  </p>
                </div>
              </div>
            )}

            {/* Local Case Study */}
            {stad.serviceContent[dienst.slug].localCaseStudy && (
              <div className="p-6 bg-cosmic-800/30 rounded-xl border border-cosmic-700/50 mb-8">
                <div className="flex items-start gap-4">
                  <Icon name="🏆" className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                  <div>
                    <span className="text-xs uppercase tracking-wider text-amber-400 font-medium">Resultaat in {stad.name}</span>
                    <p className="text-slate-200 mt-2">
                      {stad.serviceContent[dienst.slug].localCaseStudy}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Service Details - Uses Rich Features if available, else standard list */}
      <section className="py-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {dienst.featuresDetail ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              {dienst.featuresDetail.map((feature, index) => (
                <div
                  key={index}
                  className="bg-cosmic-800/30 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-8 hover:border-primary-500/50 transition-all duration-300"
                >
                  <div className="text-cyan-400 mb-4">
                    <Icon name={feature.icon} className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-200 mb-6">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="text-sm text-slate-400 flex items-center">
                        <span className="text-cyan-300 mr-2">✓</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Features */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">
                  Wat is Inbegrepen?
                </h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Bij {dienst.name} in {stad.name} krijgt u een complete oplossing
                  die is afgestemd op uw specifieke behoeften en doelen.
                </p>
                <ul className="space-y-4">
                  {dienst.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-cyan-300 text-xl mt-1 flex-shrink-0">✓</span>
                      <span className="text-slate-200">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">
                  Voordelen voor Uw Bedrijf
                </h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Ontdek hoe {dienst.name} uw bedrijf in {stad.name} naar
                  een hoger niveau kan tillen.
                </p>
                <ul className="space-y-4">
                  {dienst.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-blue-300 text-xl mt-1 flex-shrink-0">★</span>
                      <span className="text-slate-200">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Packages / Pricing Models - Render if available */}
      {dienst.packages && (
        <PricingSection
          title={`Pakketten voor ${dienst.name} in ${stad.name}`}
          subtitle={`Transparante tarieven voor ${stad.name}. Kies het pakket dat bij u past.`}
          tiers={dienst.packages}
        />
      )}

      {/* Process Section - Render if available */}
      {dienst.process && (
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-section">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ons{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Ontwikkelproces
                </span>
              </h2>
              <p className="text-lg text-slate-200 max-w-3xl mx-auto">
                Van eerste gesprek tot succesvolle lancering in {stad.name}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {dienst.process.map((phase, index) => (
                <div
                  key={index}
                  className="relative bg-cosmic-800/30 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-8 text-center"
                >
                  <div className="text-4xl font-bold text-cyan-400 mb-4">{phase.step}</div>
                  <h3 className="text-xl font-semibold text-white mb-4">{phase.title}</h3>
                  <p className="text-slate-200 mb-4">{phase.description}</p>
                  <div className="text-sm text-cyan-300 font-medium">{phase.duration}</div>
                  {index < (dienst.process?.length || 0) - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section - Render if available */}
      {dienst.faq && (
        <section className="py-section bg-cosmic-800/20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">
                Veelgestelde Vragen
              </h2>
            </div>
            <div className="space-y-6">
              {dienst.faq.map((item, index) => (
                <div key={index} className="bg-cosmic-800/30 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">{item.question}</h3>
                  <p className="text-slate-200 leading-relaxed">{item.answer}</p>
                </div>
              ))}

              {/* PROGRAMMATIC SEO: City-Specific FAQ Items */}
              {stad.serviceContent?.[dienst.slug]?.localFAQ?.map((item, index) => (
                <div key={`local-${index}`} className="bg-cosmic-800/30 backdrop-blur-sm border border-cyan-700/30 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <span className="text-xs bg-cyan-900/50 text-cyan-300 px-2 py-1 rounded-full flex-shrink-0 mt-1">
                      {stad.name}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-3">{item.q}</h3>
                      <p className="text-slate-200 leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Target Audience & Use Cases */}
      <section className="py-section bg-cosmic-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Target Audience */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Voor Wie is Deze Dienst?
              </h2>
              <p className="text-slate-400 mb-6">
                {dienst.name} is ideaal voor:
              </p>
              <div className="space-y-3">
                {dienst.targetAudience.map((audience, index) => (
                  <div key={index} className="flex items-center gap-3 bg-cosmic-800/30 rounded-lg p-4">
                    <Icon name="👥" className="w-6 h-6 text-cyan-400" />
                    <span className="text-white font-medium">{audience} in {stad.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Use Cases */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Toepassingen
              </h2>
              <p className="text-slate-400 mb-6">
                Voorbeelden van projecten die we kunnen realiseren:
              </p>
              <ul className="space-y-3">
                {dienst.useCases.map((useCase, index) => (
                  <li key={index} className="flex items-start gap-3 bg-cosmic-800/30 rounded-lg p-4">
                    <span className="text-cyan-300 text-lg mt-0.5 flex-shrink-0">→</span>
                    <span className="text-slate-200">{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>



      {/* SPIDERWEB STRATEGY: Cross-Selling Internal Links */}
      {relatedDiensten.length > 0 && (
        <section className="py-section bg-cosmic-800/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-medium mb-3 block">
                🔗 Strategische Combinatie
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Maximaliseer Uw Resultaat in {stad.name}
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                {stad.localIndustries ? (
                  <>
                    Bedrijven in <span className="text-cyan-300">{stad.localIndustries[0]}</span> combineren {dienst.name.toLowerCase()} vaak met deze diensten
                  </>
                ) : (
                  <>Ontdek diensten die perfect combineren met {dienst.name}</>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedDiensten.map((relatedDienst) => (
                <Link
                  key={relatedDienst.slug}
                  href={`/steden/${stad.slug}/${relatedDienst.slug}`}
                  className="group bg-cosmic-800/30 border border-cosmic-700/50 rounded-xl p-6 hover:border-amber-400/50 transition-all duration-300 hover:bg-cosmic-800/50 hover:shadow-lg hover:shadow-amber-500/10"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-amber-400">
                      <Icon name={relatedDienst.icon} className="w-10 h-10" />
                    </div>
                    <span className="text-xs bg-amber-900/30 text-amber-300 px-2 py-1 rounded-full">
                      + {dienst.name}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-amber-300 transition-colors">
                    {relatedDienst.name}
                  </h3>

                  <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
                    {relatedDienst.shortDescription}
                  </p>

                  {/* Cross-Sell Value Proposition */}
                  <div className="text-xs text-slate-500 mb-4 p-3 bg-cosmic-900/50 rounded-lg">
                    💡 {dienst.name} + {relatedDienst.name} = Complete digitale aanwezigheid
                  </div>

                  <div className="flex items-center text-amber-300 text-sm font-medium">
                    Bekijk in {stad.name}
                    <span className="ml-2 group-hover:translate-x-2 transition-transform duration-200">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Link to All Services in This City */}
            <div className="text-center mt-8">
              <Link
                href={`/steden/${stad.slug}`}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-300 transition-colors"
              >
                Bekijk alle 5 diensten in {stad.name}
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* SPIDERWEB STRATEGY: Geographic Internal Linking */}
      {nearbySteden.length > 0 && (
        <section className="py-section bg-gradient-to-b from-transparent to-cyan-900/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs uppercase tracking-wider text-cyan-400 font-medium mb-3 block">
                🕸️ Regionaal Netwerk
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {dienst.name} in de Regio
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Ook actief in steden rondom {stad.name}? Ontdek onze lokale expertise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {nearbySteden.map((nearbyStad) => (
                <Link
                  key={nearbyStad.slug}
                  href={`/steden/${nearbyStad.slug}/${dienst.slug}`}
                  className="group bg-cosmic-800/30 border border-cosmic-700/50 rounded-xl p-6 hover:border-cyan-400/50 transition-all duration-300 hover:bg-cosmic-800/50 hover:shadow-lg hover:shadow-cyan-500/10"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {nearbyStad.name}
                    </h3>
                    <span className="text-xs bg-cosmic-700/50 px-2 py-1 rounded-full text-slate-300">
                      {nearbyStad.province}
                    </span>
                  </div>

                  {/* Industry Context - Shows why this service is relevant */}
                  {nearbyStad.localIndustries && nearbyStad.localIndustries.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {nearbyStad.localIndustries.slice(0, 3).map((industry, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-0.5 bg-cyan-900/30 text-cyan-300 rounded"
                        >
                          {industry}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                    {nearbyStad.shortDescription}
                  </p>

                  <div className="flex items-center text-cyan-300 text-sm font-medium">
                    {dienst.name} in {nearbyStad.name}
                    <span className="ml-2 group-hover:translate-x-2 transition-transform duration-200">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Deep Link to Main Cities Page */}
            <div className="text-center mt-8">
              <Link
                href="/steden"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-300 transition-colors"
              >
                Bekijk alle 16 steden waar we {dienst.name.toLowerCase()} aanbieden
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Business Info Section */}
      <section className="py-section bg-cosmic-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Start Vandaag Nog
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Klaar om te beginnen met {dienst.name} in {stad.name}?
              Neem contact op voor een vrijblijvend gesprek.
            </p>
          </div>

          <DutchBusinessInfo
            variant="full"
            showAddress={true}
            showOpeningHours={true}
            showContact={true}
            showRegistration={true}
          />
        </div>
      </section>

      <ContentSuggestions
        customSuggestions={[
          {
            title: 'Vraag Offerte Aan',
            href: '/contact',
            description: `Plan een gesprek over ${dienst.name} in ${stad.name}`
          },
          {
            title: `Andere Diensten in ${stad.name}`,
            href: `/steden/${stad.slug}`,
            description: 'Bekijk alle beschikbare diensten'
          },
          {
            title: 'Onze Werkwijze',
            href: '/werkwijze',
            description: 'Hoe wij samen tot resultaat komen'
          }
        ]}
      />

      {/* COMPETENCE PROOF: Tech Trust Strip */}
      <TechTrustStrip />

      {/* COMPETENCE PROOF: Market Insight Cards */}
      <MarketInsightCards stad={stad} dienst={dienst} />

      {/* COMPETENCE PROOF: Sticky Mobile CTA */}
      <StickyMobileCTA dienstName={dienst.name} stadName={stad.name} />
    </main>
  );
}
