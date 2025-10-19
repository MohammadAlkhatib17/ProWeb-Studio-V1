import type { Metadata } from 'next';
import { Suspense } from 'react';

import Link from 'next/link';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Button } from '@/components/Button';
import SEOSchema from '@/components/SEOSchema';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQSection from '@/components/sections/FAQSection';

export const dynamic = 'force-static';
export const revalidate = 7200; // 2 hours - service content is fairly stable
export const fetchCache = 'force-cache';

// Get canonical URL from environment with fallback
const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: '3D Website Ervaringen | WebGL & Three.js Ontwikkeling Nederland – ProWeb Studio',
  description:
    'Interactieve 3D websites en WebGL ervaringen die onderscheidend zijn. Three.js development, 3D visualisaties en immersieve web experiences voor Nederlandse bedrijven.',
  alternates: {
    canonical: `${SITE_URL}/diensten/3d-website-ervaringen`,
    languages: { 
      'nl-NL': `${SITE_URL}/diensten/3d-website-ervaringen`,
      'x-default': `${SITE_URL}/diensten/3d-website-ervaringen`
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
    title: '3D Website Ervaringen | WebGL & Three.js Ontwikkeling Nederland – ProWeb Studio',
    description: 'Interactieve 3D websites en WebGL ervaringen die onderscheidend zijn. Three.js development, 3D visualisaties en immersieve web experiences.',
    url: `${SITE_URL}/diensten/3d-website-ervaringen`,
    type: 'website',
    locale: 'nl_NL',
    images: [{ url: `${SITE_URL}/og`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '3D Website Ervaringen | WebGL & Three.js Ontwikkeling Nederland – ProWeb Studio',
    description: 'Interactieve 3D websites en WebGL ervaringen die onderscheidend zijn.',
    images: [`${SITE_URL}/og`],
  },
};

const threeDFeatures = [
  {
    title: 'WebGL & Three.js',
    description: 'Geavanceerde 3D graphics direct in de browser zonder plugins',
    icon: '🎮',
    details: [
      'Hardware-versnelde 3D rendering',
      'Cross-browser compatibiliteit',
      'Optimale performance op alle apparaten',
      'Progressive enhancement strategie'
    ]
  },
  {
    title: 'Interactieve Visualisaties',
    description: 'Product configurators, virtual tours en 3D showcases',
    icon: '🔍',
    details: [
      '360° product viewers',
      'Virtual showroom tours',
      'Real-time configurators',
      'Augmented reality integraties'
    ]
  },
  {
    title: 'Performance Optimalisatie',
    description: 'Snelle laadtijden en smooth animaties op alle apparaten',
    icon: '⚡',
    details: [
      'Adaptive quality scaling',
      'Lazy loading van 3D assets',
      'Mobile performance optimalisatie',
      'Bandwidth-bewuste streaming'
    ]
  },
  {
    title: 'Immersieve Experiences',
    description: 'VR-ready websites en futuristische gebruikerservaringen',
    icon: '🥽',
    details: [
      'WebXR / WebVR ondersteuning',
      'Gesture-based interactie',
      'Spatial audio integratie',
      'Multi-user 3D omgevingen'
    ]
  }
];

const experienceTypes = [
  {
    type: '3D Product Showcase',
    description: 'Interactieve productpresentaties met 360° views en configuraties',
    useCases: ['E-commerce visualisatie', 'Automotive configurators', 'Meubel customization', 'Technische producten'],
    startingPrice: '€3.500',
    complexity: 'Medium'
  },
  {
    type: 'Virtual Showroom',
    description: 'Immersieve digitale ruimtes voor bedrijfspresentaties',
    useCases: ['Real estate tours', 'Museum experiences', 'Retail environments', 'Event spaces'],
    startingPrice: '€6.500',
    complexity: 'Hoog'
  },
  {
    type: 'Interactive Portfolio',
    description: 'Creatieve 3D portfolio websites voor kunstenaars en designers',
    useCases: ['Artist portfolios', 'Architecture visualisatie', 'Design showcases', 'Creative agencies'],
    startingPrice: '€2.500',
    complexity: 'Laag'
  },
  {
    type: 'Gamified Experiences',
    description: 'Speelse 3D elementen en mini-games voor engagement',
    useCases: ['Brand activations', 'Educational platforms', 'Marketing campaigns', 'User onboarding'],
    startingPrice: '€4.500',
    complexity: 'Hoog'
  }
];

const technologies = [
  {
    name: 'Three.js',
    description: 'Industry-standard 3D library voor web development',
    icon: '📐',
    applications: ['3D scenes', 'Lighting & shadows', 'Material systems', 'Animation frameworks']
  },
  {
    name: 'WebGL/WebGPU',
    description: 'Low-level graphics APIs voor maximale performance',
    icon: '🖥️',
    applications: ['Shader programming', 'GPU computing', 'Custom rendering', 'Performance optimization']
  },
  {
    name: 'React Three Fiber',
    description: 'React renderer voor Three.js met declaratieve syntax',
    icon: '⚛️',
    applications: ['Component-based 3D', 'State management', 'Event handling', 'React ecosystem']
  },
  {
    name: 'Blender Integration',
    description: 'Professional 3D content creation en asset pipeline',
    icon: '🎨',
    applications: ['3D modeling', 'Animation export', 'Asset optimization', 'Material authoring']
  }
];

const faqItems = [
  {
    question: 'Wat zijn de voordelen van 3D websites?',
    answer: 'Websites maken websites onderscheidend en vergrotende betrokkenheid. Ze bieden unieke product presentaties, verhogen conversie rates, verbeteren brand herinnering en creëren viral social media content. Perfecte voor bedrijven die zich willen onderscheiden.'
  },
  {
    question: 'Werken 3D websites op mobiele apparaten?',
    answer: 'Ja, alle 3D ervaringen worden geoptimaliseerd voor mobiele apparaten. We gebruiken adaptive quality scaling, touch-vriendelijke interacties en bandwidth-bewuste loading. Op oudere toestellen vallen we automatisch terug naar 2D alternatieven.'
  },
  {
    question: 'Hebben gebruikers speciale software nodig?',
    answer: 'Nee, moderne browsers ondersteunen WebGL native. Geen plugins of downloads vereist. We ondersteunen alle major browsers (Chrome, Firefox, Safari, Edge) en bieden fallbacks voor oudere browsers.'
  },
  {
    question: 'Wat zijn de kosten voor 3D website ontwikkeling?',
    answer: 'Prijzen starten vanaf €2.500 voor eenvoudige 3D portfolio\'s tot €6.500+ voor complexe virtual showrooms. Kosten hangen af van complexiteit, aantal 3D assets, interactiviteit en custom animaties. We bieden altijd een gedetailleerde offerte.'
  },
  {
    question: 'Hoe lang duurt de ontwikkeling van een 3D website?',
    answer: '3D projecten duren meestal 4-12 weken afhankelijk van complexiteit. Dit omvat conceptontwikkeling, 3D asset creatie, development, optimalisatie en testing. We houden u bij elke milestone op de hoogte.'
  },
  {
    question: 'Kunnen bestaande websites worden uitgebreid met 3D?',
    answer: 'Absoluut! We kunnen 3D elementen integreren in bestaande websites. Van eenvoudige product viewers tot complexe interactieve secties - alles is mogelijk zonder volledige rebuild.'
  }
];

export default function ThreeDWebsiteErvaringen() {
  return (
    <main className="pt-20 md:pt-24 relative overflow-hidden">
      {/* SEO Schema */}
      <SEOSchema 
        pageType="services"
        pageTitle="3D Website Ervaringen"
        pageDescription="Interactieve 3D websites en WebGL ervaringen met Three.js development"
      />
      
      {/* Breadcrumbs */}
      <Breadcrumbs />
      
      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-section">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            3D Website{' '}
            <span className="gradient-text-primary">
              Ervaringen
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Onderscheidende websites met interactieve 3D ervaringen. WebGL, Three.js en 
            immersieve visualisaties die indruk maken en converteren.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/contact"
              variant="primary"
              size="large"
              className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500"
            >
              3D Project Bespreken
            </Button>
            <Button
              href="/speeltuin"
              variant="secondary"
              size="large"
              className="border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white"
            >
              Bekijk 3D Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Geavanceerde{' '}
              <span className="gradient-text-primary">
                3D Technologieën
              </span>
            </h2>
            <p className="text-lg text-slate-200 max-w-3xl mx-auto">
              We gebruiken cutting-edge web technologieën om 3D ervaringen te creëren 
              die werken in elke moderne browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {threeDFeatures.map((feature, index) => (
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

      {/* Experience Types Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-section bg-cosmic-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              3D Experience{' '}
              <span className="gradient-text-primary">
                Types
              </span>
            </h2>
            <p className="text-lg text-slate-200 max-w-3xl mx-auto">
              Van eenvoudige product viewers tot complexe virtual environments - 
              we realiseren elke 3D visie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {experienceTypes.map((type, index) => (
              <div
                key={index}
                className="bg-cosmic-800/40 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-8 hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white">{type.type}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    type.complexity === 'Laag' ? 'bg-green-500/20 text-green-300' :
                    type.complexity === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {type.complexity}
                  </span>
                </div>
                <p className="text-slate-200 text-sm mb-4">{type.description}</p>
                <div className="text-xl font-bold text-primary-400 mb-4">
                  Vanaf {type.startingPrice}
                </div>
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white mb-2">Toepassingen:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {type.useCases.map((useCase, useCaseIndex) => (
                      <div
                        key={useCaseIndex}
                        className="text-xs text-slate-400 bg-cosmic-700/30 rounded-lg p-2 text-center"
                      >
                        {useCase}
                      </div>
                    ))}
                  </div>
                </div>
                <Button
                  href="/contact"
                  variant="secondary"
                  size="normal"
                  className="w-full border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white"
                >
                  Meer Info
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              3D Development{' '}
              <span className="gradient-text-primary">
                Stack
              </span>
            </h2>
            <p className="text-lg text-slate-200 max-w-3xl mx-auto">
              We werken met de meest geavanceerde tools en frameworks voor 
              professionele 3D web development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="bg-cosmic-800/30 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300 text-center"
              >
                <div className="text-4xl mb-4">{tech.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-3">{tech.name}</h3>
                <p className="text-slate-200 text-sm mb-4">{tech.description}</p>
                <div className="space-y-1">
                  {tech.applications.map((app, appIndex) => (
                    <div key={appIndex} className="text-xs text-slate-400">
                      {app}
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
              3D Development{' '}
              <span className="gradient-text-primary">
                Proces
              </span>
            </h2>
            <p className="text-lg text-slate-200 max-w-3xl mx-auto">
              Van concept tot immersieve 3D ervaring - professioneel en gestructureerd.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                step: '01',
                title: 'Concept & Design',
                description: 'Visuele concepten en 3D scene planning',
                duration: '1-2 weken'
              },
              {
                step: '02',
                title: '3D Asset Creation',
                description: 'Modellering, texturing en animatie development',
                duration: '2-4 weken'
              },
              {
                step: '03',
                title: 'WebGL Development',
                description: 'Three.js implementatie en browser optimalisatie',
                duration: '3-6 weken'
              },
              {
                step: '04',
                title: 'Interactie Design',
                description: 'User experience en responsive adaptatie',
                duration: '1-2 weken'
              },
              {
                step: '05',
                title: 'Performance Testing',
                description: 'Cross-device testing en load optimization',
                duration: '1 week'
              }
            ].map((phase, index) => (
              <div
                key={index}
                className="relative bg-cosmic-800/30 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-6 text-center"
              >
                <div className="text-2xl font-bold text-primary-400 mb-3">{phase.step}</div>
                <h3 className="text-lg font-semibold text-white mb-3">{phase.title}</h3>
                <p className="text-slate-200 text-sm mb-3">{phase.description}</p>
                <div className="text-xs text-primary-300 font-medium">{phase.duration}</div>
                {index < 4 && (
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
            title="Veelgestelde Vragen over 3D Website Ontwikkeling"
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
            Klaar voor een{' '}
            <span className="gradient-text-primary">
              3D Website?
            </span>
          </h2>
          <p className="text-lg text-slate-200 mb-8 max-w-2xl mx-auto">
            Laten we uw visie omzetten in een interactieve 3D ervaring die uw bezoekers 
            zal verbazen en uw merk onderscheidt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/contact"
              variant="primary"
              size="large"
              className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500"
            >
              Start 3D Project
            </Button>
            <Button
              href="/speeltuin"
              variant="secondary"
              size="large"
              className="border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white"
            >
              Ontdek Onze 3D Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <ErrorBoundary>
        <Suspense fallback={<div className="h-64 bg-cosmic-900/30" />}>
          <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 bg-cosmic-900/30">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 text-center">
                Gerelateerde{' '}
                <span className="gradient-text-primary">
                  Diensten
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: 'Website Laten Maken',
                    description: 'Professionele websites als basis voor 3D experiences',
                    href: '/diensten/website-laten-maken',
                    icon: '🌐'
                  },
                  {
                    title: 'Webshop Laten Maken',
                    description: '3D product visualisaties in e-commerce',
                    href: '/diensten/webshop-laten-maken',
                    icon: '🛒'
                  },
                  {
                    title: 'Onderhoud & Support',
                    description: 'Technisch beheer van complexe 3D systemen',
                    href: '/diensten/onderhoud-support',
                    icon: '🔧'
                  }
                ].map((service, index) => (
                  <Link
                    key={index}
                    href={service.href}
                    className="group bg-cosmic-800/30 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-3xl mb-4">{service.icon}</div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-300 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-slate-400 text-sm">{service.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}