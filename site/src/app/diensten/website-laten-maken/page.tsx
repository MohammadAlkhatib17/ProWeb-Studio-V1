import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BackgroundImage } from '@/components/ui/responsive-image';
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
  title: 'Website Laten Maken Nederland | Professionele Webdesign & Ontwikkeling – ProWeb Studio',
  description:
    'Website laten maken door Nederlandse webdesign experts. Responsive websites, moderne technologieën, SEO-geoptimaliseerd. Van concept tot lancering - transparante prijzen, snelle oplevering.',
  alternates: {
    canonical: `${SITE_URL}/diensten/website-laten-maken`,
    languages: { 
      'nl-NL': `${SITE_URL}/diensten/website-laten-maken`,
      'x-default': `${SITE_URL}/diensten/website-laten-maken`
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
    title: 'Website Laten Maken Nederland | Professionele Webdesign & Ontwikkeling – ProWeb Studio',
    description: 'Website laten maken door Nederlandse webdesign experts. Responsive websites, moderne technologieën, SEO-geoptimaliseerd. Van concept tot lancering - transparante prijzen, snelle oplevering.',
    url: `${SITE_URL}/diensten/website-laten-maken`,
    type: 'website',
    locale: 'nl_NL',
    images: [{ url: `${SITE_URL}/og`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Website Laten Maken Nederland | Professionele Webdesign & Ontwikkeling – ProWeb Studio',
    description: 'Website laten maken door Nederlandse webdesign experts. Responsive websites, moderne technologieën, SEO-geoptimaliseerd.',
    images: [`${SITE_URL}/og`],
  },
};

const websiteFeatures = [
  {
    title: 'Responsive Webdesign',
    description: 'Websites die perfect werken op alle apparaten - van smartphone tot desktop',
    icon: '📱',
    details: [
      'Mobile-first ontwikkeling',
      'Optimaal gebruiksgemak op alle schermformaten',
      'Touch-vriendelijke interface',
      'Snelle laadtijden op mobiel'
    ]
  },
  {
    title: 'SEO-Geoptimaliseerd',
    description: 'Technische SEO en content-optimalisatie voor hogere Google rankings',
    icon: '🔍',
    details: [
      'Technische SEO-implementatie',
      'Schema markup en structured data',
      'Core Web Vitals optimalisatie',
      'Lokale SEO voor Nederlandse markt'
    ]
  },
  {
    title: 'Moderne Technologieën',
    description: 'Next.js, React en TypeScript voor snelle, veilige websites',
    icon: '⚡',
    details: [
      'Server-side rendering (SSR)',
      'Statische site generatie (SSG)',
      'Progressive Web App functionaliteiten',
      'Moderne JavaScript frameworks'
    ]
  },
  {
    title: 'Content Management',
    description: 'Eenvoudig uw website beheren met gebruisvriendelijke CMS-systemen',
    icon: '✏️',
    details: [
      'Headless CMS integratie',
      'Gebruiksvriendelijke admin interface',
      'Content workflows en approval',
      'Media management systeem'
    ]
  }
];

const websiteTypes = [
  {
    type: 'Bedrijfswebsite',
    description: 'Professionele corporate websites voor MKB en grote bedrijven',
    features: ['Corporate branding', 'Team pagina\'s', 'Nieuwsmodule', 'Contact formulieren'],
    startingPrice: '€2.500'
  },
  {
    type: 'Portfolio Website',
    description: 'Creatieve portfolio\'s voor kunstenaars, fotografen en designers',
    features: ['Galerij functionaliteit', 'Project showcases', 'Client testimonials', 'Social media integratie'],
    startingPrice: '€1.500'
  },
  {
    type: 'Landingspagina',
    description: 'Geoptimaliseerde landingspagina\'s voor marketing campagnes',
    features: ['Conversie optimalisatie', 'A/B testing setup', 'Analytics integratie', 'Lead capture forms'],
    startingPrice: '€750'
  },
  {
    type: 'Blog Platform',
    description: 'Content-gerichte websites met uitgebreide blog functionaliteiten',
    features: ['CMS integratie', 'SEO tools', 'Social sharing', 'Comment systeem'],
    startingPrice: '€1.200'
  }
];

const faqItems = [
  {
    question: 'Hoe lang duurt het om een website te laten maken?',
    answer: 'De ontwikkeltijd hangt af van de complexiteit van uw project. Een eenvoudige bedrijfswebsite is meestal binnen 2-3 weken klaar, terwijl meer complexe websites 4-8 weken kunnen duren. We houden u gedurende het hele proces op de hoogte van de voortgang.'
  },
  {
    question: 'Wat zijn de kosten voor het laten maken van een website?',
    answer: 'Onze website prijzen starten vanaf €750 voor een landingspagina tot €2.500+ voor complexe bedrijfswebsites. De exacte kosten hangen af van uw specifieke wensen en functionaliteiten. We bieden altijd een gratis offerte op maat.'
  },
  {
    question: 'Krijg ik een responsive website die werkt op mobiele apparaten?',
    answer: 'Absoluut! Alle websites die wij ontwikkelen zijn volledig responsive en geoptimaliseerd voor alle apparaten. We gebruiken een mobile-first aanpak om ervoor te zorgen dat uw website perfect werkt op smartphones, tablets en desktops.'
  },
  {
    question: 'Kan ik zelf de content van mijn website aanpassen?',
    answer: 'Ja, we implementeren gebruiksvriendelijke CMS-systemen waarmee u eenvoudig content kunt toevoegen, bewerken en verwijderen. We verzorgen ook training zodat u zelfstandig uw website kunt beheren.'
  },
  {
    question: 'Is mijn website geoptimaliseerd voor Google (SEO)?',
    answer: 'Alle websites worden standaard geoptimaliseerd voor zoekmachines. Dit omvat technische SEO, snelle laadtijden, mobile-vriendelijkheid en proper schema markup. Voor uitgebreide SEO hebben we separate pakketten beschikbaar.'
  }
];

export default function WebsiteLatenMaken() {
  return (
    <main className="pt-20 md:pt-24 relative overflow-hidden">
      {/* SEO Schema */}
      <SEOSchema 
        pageType="services"
        pageTitle="Website Laten Maken"
        pageDescription="Professionele website ontwikkeling en webdesign services voor Nederlandse bedrijven"
      />
      
      {/* Breadcrumbs */}
      <Breadcrumbs />
      
      {/* Background */}
      <BackgroundImage
        src="/assets/nebula_services_background.avif"
        alt=""
        className="opacity-60"
        priority
      />

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Website Laten{' '}
            <span className="gradient-text-primary">
              Maken
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Professionele websites die converteren. Van concept tot lancering - 
            responsive, snel en geoptimaliseerd voor Nederlandse bedrijven.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/contact"
              variant="primary"
              size="large"
              className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500"
            >
              Gratis Offerte Aanvragen
            </Button>
            <Button
              href="/portfolio"
              variant="secondary"
              size="large"
              className="border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white"
            >
              Bekijk Portfolio
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Waarom Kiezen Voor{' '}
              <span className="gradient-text-primary [&:not(:where(.no-js))]:text-transparent [&:where(.no-js)]:text-primary-400">
                ProWeb Studio
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Wij combineren creatief design met moderne technologie om websites te bouwen 
              die niet alleen mooi zijn, maar ook presteren.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {websiteFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-cosmic-800/30 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-8 hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="text-sm text-gray-400 flex items-center">
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

      {/* Website Types Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-cosmic-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Website Types &{' '}
              <span className="gradient-text-primary">
                Prijzen
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Van eenvoudige landingspagina&apos;s tot complexe bedrijfswebsites - 
              wij hebben de expertise voor elk type website.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {websiteTypes.map((type, index) => (
              <div
                key={index}
                className="bg-cosmic-800/40 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-3">{type.type}</h3>
                  <p className="text-gray-300 text-sm mb-4">{type.description}</p>
                  <div className="text-2xl font-bold text-primary-400 mb-4">
                    Vanaf {type.startingPrice}
                  </div>
                  <ul className="space-y-2 mb-6">
                    {type.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-xs text-gray-400 flex items-center">
                        <span className="text-primary-400 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    href="/contact"
                    variant="secondary"
                    size="normal"
                    className="w-full border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white"
                  >
                    Meer Info
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ons{' '}
              <span className="gradient-text-primary">
                Ontwikkelproces
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Van eerste gesprek tot succesvolle lancering - transparant en professioneel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Strategie & Planning',
                description: 'Intake gesprek, requirements analyse en projectplanning',
                duration: '1 week'
              },
              {
                step: '02',
                title: 'Design & Development',
                description: 'UX/UI design, frontend en backend ontwikkeling',
                duration: '2-6 weken'
              },
              {
                step: '03',
                title: 'Testing & Launch',
                description: 'Uitgebreid testen, optimalisatie en live deployment',
                duration: '1 week'
              }
            ].map((phase, index) => (
              <div
                key={index}
                className="relative bg-cosmic-800/30 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-8 text-center"
              >
                <div className="text-4xl font-bold text-primary-400 mb-4">{phase.step}</div>
                <h3 className="text-xl font-semibold text-white mb-4">{phase.title}</h3>
                <p className="text-gray-300 mb-4">{phase.description}</p>
                <div className="text-sm text-primary-300 font-medium">{phase.duration}</div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
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
            title="Veelgestelde Vragen over Website Ontwikkeling"
          >
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-cosmic-800/30 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">{item.question}</h3>
                  <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </FAQSection>
        </Suspense>
      </ErrorBoundary>

      {/* CTA Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Klaar om uw{' '}
            <span className="gradient-text-primary">
              Website te Laten Maken?
            </span>
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Neem contact op voor een vrijblijvend gesprek over uw website project. 
            We denken graag mee over de beste aanpak voor uw situatie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/contact"
              variant="primary"
              size="large"
              className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500"
            >
              Gratis Gesprek Plannen
            </Button>
            <Button
              href="/werkwijze"
              variant="secondary"
              size="large"
              className="border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white"
            >
              Lees Over Onze Werkwijze
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
                    title: 'Webshop Laten Maken',
                    description: 'E-commerce oplossingen met iDEAL integratie',
                    href: '/diensten/webshop-laten-maken',
                    icon: '🛒'
                  },
                  {
                    title: 'SEO Optimalisatie',
                    description: 'Hogere Google rankings voor meer bezoekers',
                    href: '/diensten/seo-optimalisatie',
                    icon: '📈'
                  },
                  {
                    title: '3D Website Ervaringen',
                    description: 'Interactieve 3D elementen en animaties',
                    href: '/diensten/3d-website-ervaringen',
                    icon: '🎯'
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
                    <p className="text-gray-400 text-sm">{service.description}</p>
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