import type { Metadata } from 'next';
import { Suspense } from 'react';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Button } from '@/components/Button';
import SEOSchema from '@/components/SEOSchema';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQSection from '@/components/sections/FAQSection';
import RelatedServices from '@/components/RelatedServices';
import RelatedLocations from '@/components/RelatedLocations';

export const dynamic = 'force-static';
export const revalidate = 7200; // 2 hours - service content is fairly stable
export const fetchCache = 'force-cache';

// Get canonical URL from environment with fallback
const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'SEO Optimalisatie | Technische SEO & Zoekmachineoptimalisatie Nederland – ProWeb Studio',
  description:
    'Professionele SEO optimalisatie en technische SEO diensten. Verhoog uw Google ranking met datagedreven SEO strategieën, Core Web Vitals optimalisatie en complete zoekmachine optimalisatie.',
  alternates: {
    canonical: `${SITE_URL}/diensten/seo-optimalisatie`,
    languages: { 
      'nl-NL': `${SITE_URL}/diensten/seo-optimalisatie`,
      'x-default': `${SITE_URL}/diensten/seo-optimalisatie`
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'SEO Optimalisatie | Technische SEO & Zoekmachineoptimalisatie Nederland – ProWeb Studio',
    description: 'Professionele SEO optimalisatie en technische SEO diensten. Verhoog uw Google ranking met datagedreven SEO strategieën.',
    url: `${SITE_URL}/diensten/seo-optimalisatie`,
    type: 'website',
    locale: 'nl_NL',
    images: [{ url: `${SITE_URL}/og`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Optimalisatie | Technische SEO & Zoekmachineoptimalisatie Nederland – ProWeb Studio',
    description: 'Professionele SEO optimalisatie en technische SEO diensten. Verhoog uw Google ranking met datagedreven strategieën.',
    images: [`${SITE_URL}/og`],
  },
};

const seoFeatures = [
  {
    title: 'Technische SEO',
    description: 'Complete technische optimalisatie voor betere rankings',
    icon: '🔧',
    details: [
      'Core Web Vitals optimalisatie',
      'Site speed & performance',
      'Crawlability & indexering',
      'Schema markup implementatie'
    ]
  },
  {
    title: 'Content Optimalisatie',
    description: 'SEO-geoptimaliseerde content die rankeren en converteren',
    icon: '📝',
    details: [
      'Keyword research & strategie',
      'On-page optimalisatie',
      'Content gap analyse',
      'Semantic SEO toepassing'
    ]
  },
  {
    title: 'Link Building',
    description: 'Autoriteit opbouw door kwalitatieve backlinks',
    icon: '🔗',
    details: [
      'High-authority link acquisition',
      'Guest posting strategieën',
      'Broken link building',
      'Internal linking optimalisatie'
    ]
  },
  {
    title: 'SEO Analytics',
    description: 'Data-driven SEO met gedetailleerde rapportages',
    icon: '📊',
    details: [
      'Google Analytics 4 setup',
      'Search Console optimalisatie',
      'Ranking monitoring',
      'ROI tracking & rapportage'
    ]
  }
];

const seoPackages = [
  {
    type: 'SEO Audit',
    description: 'Complete technische en content analyse van uw website',
    features: ['Technische SEO audit', 'Keyword analyse', 'Concurrentie onderzoek', 'Actieplan rapport'],
    price: '€750',
    duration: '1-2 weken',
    complexity: 'Basis'
  },
  {
    type: 'SEO Optimalisatie',
    description: 'Volledige on-page en technische SEO implementatie',
    features: ['Technische fixes', 'Content optimalisatie', 'Schema markup', 'Performance verbetering'],
    price: '€1.500',
    duration: '3-6 weken',
    complexity: 'Standaard'
  },
  {
    type: 'SEO Campaign',
    description: 'Maandelijkse SEO begeleiding met content en link building',
    features: ['Maandelijkse optimalisatie', 'Content creatie', 'Link building', 'Uitgebreide rapportage'],
    price: '€750/maand',
    duration: 'Doorlopend',
    complexity: 'Premium'
  },
  {
    type: 'Local SEO',
    description: 'Lokale SEO optimalisatie voor regionale bedrijven',
    features: ['Google Business Profile', 'Lokale citations', 'Review management', 'Local content'],
    price: '€950',
    duration: '2-4 weken',
    complexity: 'Specialistisch'
  }
];

const seoServices = [
  {
    name: 'Keyword Research',
    description: 'Uitgebreide keyword analyse voor uw branche',
    icon: '🔍',
    benefits: ['Zoekvolume analyse', 'Concurrentie mapping', 'Long-tail opportunities', 'Search intent classification']
  },
  {
    name: 'Technical SEO',
    description: 'Technische optimalisaties voor zoekmachine vriendelijkheid',
    icon: '⚙️',
    benefits: ['Site speed optimalisatie', 'Mobile-first indexing', 'Structured data', 'XML sitemaps']
  },
  {
    name: 'Content SEO',
    description: 'SEO-geoptimaliseerde content die werkelijk rankeren',
    icon: '✍️',
    benefits: ['Topic cluster strategie', 'E-A-T optimalisatie', 'Featured snippets targeting', 'Content refresh']
  },
  {
    name: 'Link Building',
    description: 'Kwalitatieve backlinks voor domain authority opbouw',
    icon: '🌐',
    benefits: ['White-hat technieken', 'Niche-relevante links', 'Brand mention building', 'Disavow management']
  }
];

const faqItems = [
  {
    question: 'Hoe lang duurt het voordat ik SEO resultaten zie?',
    answer: 'SEO is een lange termijn strategie. Technische verbeteringen kunnen binnen 2-8 weken zichtbaar zijn, maar significante ranking verbeteringen duren meestal 3-6 maanden. We focussen op duurzame groei met meetbare resultaten.'
  },
  {
    question: 'Wat is het verschil tussen SEO en SEA?',
    answer: 'SEO (Search Engine Optimization) richt zich op organische rankings en is gratis verkeer op lange termijn. SEA (Search Engine Advertising) is betaalde advertenties voor directe zichtbaarheid. SEO heeft een betere ROI op lange termijn.'
  },
  {
    question: 'Welke tools gebruiken jullie voor SEO?',
    answer: 'We werken met professionele SEO tools zoals Ahrefs, SEMrush, Screaming Frog, Google Search Console, Google Analytics 4, en PageSpeed Insights. Ook gebruiken we eigen developed tools voor specifieke analyses.'
  },
  {
    question: 'Kunnen jullie garanties geven voor SEO resultaten?',
    answer: 'Eerlijke SEO agencies geven geen ranking garanties omdat Google\'s algoritme constant verandert. Wel garanderen we professionele werkwijze, transparante rapportage en best practices implementatie volgens Google richtlijnen.'
  },
  {
    question: 'Wat kost SEO optimalisatie?',
    answer: 'SEO prijzen variëren van €750 voor een audit tot €750+ per maand voor continue optimalisatie. Kosten hangen af van website grootte, concurrentie niveau, en gewenste services. We bieden altijd een gedetailleerde offerte.'
  },
  {
    question: 'Hoe meten jullie SEO succes?',
    answer: 'We monitoren rankings, organisch verkeer, conversies, Core Web Vitals, en technische gezondheid. Maandelijkse rapportages tonen concrete vooruitgang met actionable insights en aanbevelingen voor verdere verbetering.'
  }
];

export default function SEOOptimalisatie() {
  return (
    <main className="pt-20 md:pt-24 relative overflow-hidden">
      {/* SEO Schema */}
      <SEOSchema 
        pageType="services"
        pageTitle="SEO Optimalisatie"
        pageDescription="Professionele SEO optimalisatie en technische SEO diensten voor betere Google rankings"
      />
      
      {/* Breadcrumbs */}
      <Breadcrumbs />
      
      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-section">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            SEO{' '}
            <span className="gradient-text-primary">
              Optimalisatie
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Verhoog uw zichtbaarheid in Google met datagedreven SEO strategieën. 
            Technische SEO, content optimalisatie en link building voor duurzame groei.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/contact"
              variant="primary"
              size="large"
              className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500"
            >
              SEO Analyse Aanvragen
            </Button>
            <Button
              href="/speeltuin"
              variant="secondary"
              size="large"
              className="border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white"
            >
              SEO Voorbeelden
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Volledige{' '}
              <span className="gradient-text-primary">
                SEO Service
              </span>
            </h2>
            <p className="text-lg text-slate-200 max-w-3xl mx-auto">
              Van technische optimalisatie tot content strategie - wij zorgen voor alle 
              aspecten van moderne zoekmachine optimalisatie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {seoFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-cosmic-800/30 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-8 hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-slate-200 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="text-sm text-slate-400 flex items-center">
                      <span className="text-primary-400 mr-2">✓</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Packages Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-section bg-cosmic-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              SEO{' '}
              <span className="gradient-text-primary">
                Pakketten
              </span>
            </h2>
            <p className="text-lg text-slate-200 max-w-3xl mx-auto">
              Van eenmalige audits tot doorlopende SEO begeleiding - 
              kies het pakket dat past bij uw doelen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {seoPackages.map((pkg, index) => (
              <div
                key={index}
                className="bg-cosmic-800/40 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-8 hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white">{pkg.type}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    pkg.complexity === 'Basis' ? 'bg-green-500/20 text-green-300' :
                    pkg.complexity === 'Standaard' ? 'bg-blue-500/20 text-blue-300' :
                    pkg.complexity === 'Premium' ? 'bg-purple-500/20 text-purple-300' :
                    'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {pkg.complexity}
                  </span>
                </div>
                <p className="text-slate-200 text-sm mb-4">{pkg.description}</p>
                <div className="text-xl font-bold text-primary-400 mb-2">
                  {pkg.price}
                </div>
                <div className="text-sm text-slate-400 mb-6">
                  Doorlooptijd: {pkg.duration}
                </div>
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white mb-3">Inbegrepen:</h4>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-slate-200 flex items-center">
                        <span className="text-primary-400 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  href="/contact"
                  variant="secondary"
                  size="normal"
                  className="w-full border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white"
                >
                  Pakket Selecteren
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Services Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Gespecialiseerde{' '}
              <span className="gradient-text-primary">
                SEO Diensten
              </span>
            </h2>
            <p className="text-lg text-slate-200 max-w-3xl mx-auto">
              Onze expertise spans alle facetten van moderne SEO - 
              van keyword research tot technische implementatie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {seoServices.map((service, index) => (
              <div
                key={index}
                className="bg-cosmic-800/30 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300 text-center"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-3">{service.name}</h3>
                <p className="text-slate-200 text-sm mb-4">{service.description}</p>
                <div className="space-y-1">
                  {service.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="text-xs text-slate-400">
                      • {benefit}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-section bg-cosmic-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              SEO{' '}
              <span className="gradient-text-primary">
                Werkwijze
              </span>
            </h2>
            <p className="text-lg text-slate-200 max-w-3xl mx-auto">
              Onze datagedreven aanpak zorgt voor meetbare en duurzame SEO resultaten.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            {[
              {
                step: '01',
                title: 'SEO Audit',
                description: 'Complete technische en content analyse',
                duration: '1 week'
              },
              {
                step: '02',
                title: 'Keyword Research',
                description: 'Uitgebreide zoekwoorden analyse',
                duration: '1 week'
              },
              {
                step: '03',
                title: 'Strategie Ontwikkeling',
                description: 'SEO roadmap en actieplan',
                duration: '1 week'
              },
              {
                step: '04',
                title: 'Technische Implementatie',
                description: 'On-page en technische optimalisaties',
                duration: '2-4 weken'
              },
              {
                step: '05',
                title: 'Content Optimalisatie',
                description: 'SEO content creatie en verbetering',
                duration: '2-6 weken'
              },
              {
                step: '06',
                title: 'Monitoring & Rapportage',
                description: 'Continue optimalisatie en tracking',
                duration: 'Doorlopend'
              }
            ].map((phase, index) => (
              <div
                key={index}
                className="relative bg-cosmic-800/30 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-6 text-center"
              >
                <div className="text-xl font-bold text-primary-400 mb-3">{phase.step}</div>
                <h3 className="text-lg font-semibold text-white mb-3">{phase.title}</h3>
                <p className="text-slate-200 text-sm mb-3">{phase.description}</p>
                <div className="text-xs text-primary-300 font-medium">{phase.duration}</div>
                {index < 5 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <ErrorBoundary>
        <Suspense fallback={<div className="h-96 bg-cosmic-900/30" />}>
          <FAQSection
            title="Veelgestelde Vragen over SEO Optimalisatie"
          >
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-cosmic-800/30 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">{item.question}</h3>
                  <p className="text-slate-200 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </FAQSection>
        </Suspense>
      </ErrorBoundary>

      {/* CTA Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start met{' '}
            <span className="gradient-text-primary">
              SEO Optimalisatie
            </span>
          </h2>
          <p className="text-lg text-slate-200 mb-8 max-w-2xl mx-auto">
            Laten we uw website naar de top van Google brengen met professionele 
            SEO strategieën die resultaten opleveren.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/contact"
              variant="primary"
              size="large"
              className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500"
            >
              Gratis SEO Analyse
            </Button>
            <Button
              href="/speeltuin"
              variant="secondary"
              size="large"
              className="border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white"
            >
              SEO Case Studies
            </Button>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <ErrorBoundary>
        <Suspense fallback={<div className="h-64 bg-cosmic-900/30" />}>
          <RelatedServices 
            currentService="/diensten/seo-optimalisatie"
            maxItems={5}
            className="bg-cosmic-900/30"
          />
        </Suspense>
      </ErrorBoundary>

      {/* Related Locations */}
      <ErrorBoundary>
        <Suspense fallback={<div className="h-64 bg-cosmic-900/30" />}>
          <RelatedLocations 
            currentService="/diensten/seo-optimalisatie"
            maxItems={6}
            className="bg-cosmic-900/20"
            title="SEO Optimalisatie in Deze Steden"
            description="Lokale en nationale SEO diensten beschikbaar in grote Nederlandse steden"
          />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}