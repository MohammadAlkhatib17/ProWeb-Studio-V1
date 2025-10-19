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
  title: 'Webshop Laten Maken Nederland | E-commerce Ontwikkeling & iDEAL Integratie – ProWeb Studio',
  description:
    'Webshop laten maken met iDEAL betaling, voorraadbeheer en Nederlandse e-commerce functionaliteiten. Responsive webshops die verkopen - van productcatalogus tot checkout.',
  alternates: {
    canonical: `${SITE_URL}/diensten/webshop-laten-maken`,
    languages: { 
      'nl-NL': `${SITE_URL}/diensten/webshop-laten-maken`,
      'x-default': `${SITE_URL}/diensten/webshop-laten-maken`
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
    title: 'Webshop Laten Maken Nederland | E-commerce Ontwikkeling & iDEAL Integratie – ProWeb Studio',
    description: 'Webshop laten maken met iDEAL betaling, voorraadbeheer en Nederlandse e-commerce functionaliteiten. Responsive webshops die verkopen - van productcatalogus tot checkout.',
    url: `${SITE_URL}/diensten/webshop-laten-maken`,
    type: 'website',
    locale: 'nl_NL',
    images: [{ url: `${SITE_URL}/og`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Webshop Laten Maken Nederland | E-commerce Ontwikkeling & iDEAL Integratie – ProWeb Studio',
    description: 'Webshop laten maken met iDEAL betaling, voorraadbeheer en Nederlandse e-commerce functionaliteiten.',
    images: [`${SITE_URL}/og`],
  },
};

const ecommerceFeatures = [
  {
    title: 'iDEAL & Betaalintegraties',
    description: 'Veilige Nederlandse betaalmethoden inclusief iDEAL, Bancontact en creditcards',
    icon: '💳',
    details: [
      'iDEAL directe bankbetalingen',
      'Creditcard processing (Visa/Mastercard)',
      'PayPal en Bancontact support',
      'Veilige SSL-encryptie'
    ]
  },
  {
    title: 'Voorraadbeheer',
    description: 'Automatisch voorraadbeheer met real-time updates en notificaties',
    icon: '📦',
    details: [
      'Real-time voorraad tracking',
      'Automatische low-stock alerts',
      'Bulk product import/export',
      'Variant en optie beheer'
    ]
  },
  {
    title: 'Nederlandse E-commerce',
    description: 'Geoptimaliseerd voor Nederlandse wetgeving en consumentenrechten',
    icon: '🇳🇱',
    details: [
      'AVG/GDPR compliance',
      'Nederlandse retourwetgeving',
      'BTW-berekening en rapportage',
      'Thuiswinkel Waarborg integratie'
    ]
  },
  {
    title: 'Mobile Commerce',
    description: 'Volledig responsive webshops geoptimaliseerd voor mobiele verkoop',
    icon: '📱',
    details: [
      'Mobile-first checkout proces',
      'Touch-vriendelijke interface',
      'Progressive Web App features',
      'Snelle mobiele laadtijden'
    ]
  }
];

const webshopTypes = [
  {
    type: 'Starter Webshop',
    description: 'Ideaal voor startende ondernemers met beperkt productassortiment',
    features: ['Tot 50 producten', 'iDEAL integratie', 'Basis SEO', 'Responsive design'],
    startingPrice: '€2.750',
    popular: false
  },
  {
    type: 'Professional Webshop',
    description: 'Uitgebreide webshop voor groeiende bedrijven met meer functionaliteiten',
    features: ['Onbeperkt producten', 'Alle betaalmethoden', 'Geavanceerde SEO', 'Analytics integratie'],
    startingPrice: '€4.500',
    popular: true
  },
  {
    type: 'Enterprise Webshop',
    description: 'Custom e-commerce oplossingen voor grote bedrijven en complexe processen',
    features: ['Maatwerk ontwikkeling', 'API integraties', 'Multi-vendor support', 'Geavanceerde rapportage'],
    startingPrice: '€8.500',
    popular: false
  },
  {
    type: 'Marketplace Integratie',
    description: 'Koppeling met Bol.com, Amazon en andere Nederlandse marketplaces',
    features: ['Multi-channel verkoop', 'Voorraad synchronisatie', 'Order management', 'Pricing strategieën'],
    startingPrice: '€3.200',
    popular: false
  }
];

const faqItems = [
  {
    question: 'Wat zijn de kosten voor het laten maken van een webshop?',
    answer: 'Onze webshop prijzen starten vanaf €2.750 voor een starter webshop tot €8.500+ voor enterprise oplossingen. De exacte kosten hangen af van het aantal producten, gewenste functionaliteiten en maatwerk integraties. We bieden altijd een gratis offerte op maat.'
  },
  {
    question: 'Welke betaalmethoden kunnen geïntegreerd worden?',
    answer: 'We integreren alle populaire Nederlandse betaalmethoden: iDEAL, creditcards (Visa/Mastercard), PayPal, Bancontact, Apple Pay en Google Pay. Ook kunnen we specifieke betaalproviders zoals Mollie, Adyen of Stripe implementeren.'
  },
  {
    question: 'Is de webshop geschikt voor mobiele apparaten?',
    answer: 'Ja, alle webshops die wij ontwikkelen zijn volledig responsive en geoptimaliseerd voor mobiele verkoop. Met de groei van mobile commerce zorgen we ervoor dat het checkout-proces vlekkeloos verloopt op smartphones en tablets.'
  },
  {
    question: 'Hoe werkt het voorraadbeheer in de webshop?',
    answer: 'De webshop bevat een uitgebreid voorraadbeheer systeem met real-time updates. U ontvangt automatische meldingen bij lage voorraad, kunt bulk imports uitvoeren en productvarianten beheren. Ook synchronisatie met externe systemen is mogelijk.'
  },
  {
    question: 'Is de webshop compliant met Nederlandse wetgeving?',
    answer: 'Absoluut. Alle webshops worden ontwikkeld conform Nederlandse e-commerce wetgeving: AVG/GDPR privacy compliance, correcte BTW-berekening, retourrecht implementatie en optioneel Thuiswinkel Waarborg certificering.'
  },
  {
    question: 'Kan de webshop gekoppeld worden aan marketplaces zoals Bol.com?',
    answer: 'Ja, we kunnen uw webshop koppelen aan Nederlandse marketplaces zoals Bol.com, Amazon.nl en anderen. Dit zorgt voor gecentraal voorraadbeheer en orderverwerking vanuit één systeem.'
  }
];

export default function WebshopLatenMaken() {
  return (
    <main className="pt-20 md:pt-24 relative overflow-hidden">
      {/* SEO Schema */}
      <SEOSchema 
        pageType="services"
        pageTitle="Webshop Laten Maken"
        pageDescription="Professionele e-commerce ontwikkeling met iDEAL integratie en Nederlandse functionaliteiten"
      />
      
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-section">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Webshop Laten{' '}
            <span className="gradient-text-primary">
              Maken
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Professionele e-commerce oplossingen met iDEAL integratie. Van productcatalogus 
            tot Nederlandse checkout - webshops die écht verkopen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/contact"
              variant="primary"
              size="large"
              className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500"
            >
              Gratis Webshop Offerte
            </Button>
            <Button
              href="/portfolio"
              variant="secondary"
              size="large"
              className="border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white"
            >
              Bekijk Webshop Portfolio
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Nederlandse{' '}
              <span className="gradient-text-primary">
                E-commerce Expertise
              </span>
            </h2>
            <p className="text-lg text-slate-200 max-w-3xl mx-auto">
              Webshops die werken in de Nederlandse markt - van iDEAL betalingen 
              tot AVG compliance en Thuiswinkel integratie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {ecommerceFeatures.map((feature, index) => (
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

      {/* Webshop Types Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-section bg-cosmic-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Webshop Pakketten &{' '}
              <span className="gradient-text-primary">
                Prijzen
              </span>
            </h2>
            <p className="text-lg text-slate-200 max-w-3xl mx-auto">
              Van starter webshop tot enterprise e-commerce platform - 
              wij hebben de juiste oplossing voor uw business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {webshopTypes.map((type, index) => (
              <div
                key={index}
                className={`relative bg-cosmic-800/40 backdrop-blur-sm border rounded-xl p-6 hover:scale-105 transition-all duration-300 ${
                  type.popular 
                    ? 'border-primary-500/70 ring-2 ring-primary-500/30' 
                    : 'border-cosmic-700/30 hover:border-primary-500/50'
                }`}
              >
                {type.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      POPULAIR
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-3">{type.type}</h3>
                  <p className="text-slate-200 text-sm mb-4">{type.description}</p>
                  <div className="text-2xl font-bold text-primary-400 mb-4">
                    Vanaf {type.startingPrice}
                  </div>
                  <ul className="space-y-2 mb-6">
                    {type.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-xs text-slate-400 flex items-center">
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
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Webshop{' '}
              <span className="gradient-text-primary">
                Ontwikkelproces
              </span>
            </h2>
            <p className="text-lg text-slate-200 max-w-3xl mx-auto">
              Van concept tot succesvolle online verkoop - stap voor stap naar uw nieuwe webshop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'E-commerce Strategie',
                description: 'Doelgroep analyse, concurrentie onderzoek en verkoop strategie',
                duration: '1-2 weken'
              },
              {
                step: '02',
                title: 'UX/UI Design',
                description: 'Conversion-geoptimaliseerd design en gebruiksvriendelijke flows',
                duration: '2-3 weken'
              },
              {
                step: '03',
                title: 'Ontwikkeling',
                description: 'Frontend en backend development met betaal- en voorraadsystemen',
                duration: '4-8 weken'
              },
              {
                step: '04',
                title: 'Testing & Launch',
                description: 'Uitgebreid testen van checkout proces en live deployment',
                duration: '1-2 weken'
              }
            ].map((phase, index) => (
              <div
                key={index}
                className="relative bg-cosmic-800/30 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-6 text-center"
              >
                <div className="text-3xl font-bold text-primary-400 mb-4">{phase.step}</div>
                <h3 className="text-lg font-semibold text-white mb-3">{phase.title}</h3>
                <p className="text-slate-200 text-sm mb-3">{phase.description}</p>
                <div className="text-xs text-primary-300 font-medium">{phase.duration}</div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-section bg-cosmic-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Integraties &{' '}
              <span className="gradient-text-primary">
                Koppelingen
              </span>
            </h2>
            <p className="text-lg text-slate-200 max-w-3xl mx-auto">
              Verbind uw webshop met bestaande systemen en externe platforms voor 
              een naadloze workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                category: 'Betaalsystemen',
                integrations: ['Mollie', 'Adyen', 'Stripe', 'PayPal', 'iDEAL', 'Bancontact'],
                icon: '💳'
              },
              {
                category: 'Marketplaces',
                integrations: ['Bol.com', 'Amazon.nl', 'Coolblue', 'Wehkamp', 'eBay'],
                icon: '🛒'
              },
              {
                category: 'Business Tools',
                integrations: ['Exact Online', 'AFAS', 'Mailchimp', 'Google Analytics', 'Facebook Pixel'],
                icon: '⚙️'
              }
            ].map((category, index) => (
              <div
                key={index}
                className="bg-cosmic-800/30 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-8 hover:border-primary-500/50 transition-all duration-300"
              >
                <div className="text-4xl mb-4 text-center">{category.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-6 text-center">{category.category}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {category.integrations.map((integration, integrationIndex) => (
                    <div
                      key={integrationIndex}
                      className="text-sm text-slate-200 bg-cosmic-700/30 rounded-lg p-2 text-center"
                    >
                      {integration}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <ErrorBoundary>
        <Suspense fallback={<div className="h-96 bg-cosmic-900/30" />}>
          <FAQSection
            title="Veelgestelde Vragen over Webshop Ontwikkeling"
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
            Klaar om uw{' '}
            <span className="gradient-text-primary">
              Webshop te Lanceren?
            </span>
          </h2>
          <p className="text-lg text-slate-200 mb-8 max-w-2xl mx-auto">
            Begin vandaag nog met online verkopen. Onze e-commerce experts helpen u 
            van concept tot succesvolle webshop.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/contact"
              variant="primary"
              size="large"
              className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500"
            >
              Gratis E-commerce Consult
            </Button>
            <Button
              href="/werkwijze"
              variant="secondary"
              size="large"
              className="border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white"
            >
              Lees Over Onze Aanpak
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
                    description: 'Professionele websites voor bedrijven',
                    href: '/diensten/website-laten-maken',
                    icon: '🌐'
                  },
                  {
                    title: 'SEO Optimalisatie',
                    description: 'Hogere Google rankings voor meer verkoop',
                    href: '/diensten/seo-optimalisatie',
                    icon: '📈'
                  },
                  {
                    title: 'Onderhoud & Support',
                    description: 'Technisch beheer en doorontwikkeling',
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