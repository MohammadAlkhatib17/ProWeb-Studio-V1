import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Button } from '@/components/Button';
import SEOSchema from '@/components/SEOSchema';
import Breadcrumbs from '@/components/Breadcrumbs';


export const dynamic = 'force-static';
export const revalidate = 7200; // 2 hours - pricing content is fairly stable
export const fetchCache = 'force-cache';

// Get canonical URL from environment with fallback
const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Prijzen & Tarieven | Website laten maken kosten – ProWeb Studio',
  description:
    'Transparante website prijzen vanaf €750. Professionele websites, webshops en 3D ervaringen voor Nederlandse bedrijven. Geen verborgen kosten, vaste tarieven per project.',
  alternates: {
    canonical: '/prijzen',
    languages: { 
      'nl-NL': '/prijzen',
      'x-default': '/prijzen'
    },
  },
  openGraph: {
    title: 'Prijzen & Tarieven | Website laten maken kosten – ProWeb Studio',
    description:
      'Transparante website prijzen vanaf €750. Geen verborgen kosten, vaste tarieven voor websites, webshops en 3D ervaringen.',
    url: `${SITE_URL}/prijzen`,
    type: 'website',
    locale: 'nl_NL',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Pricing packages data
const pricingPackages = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect voor kleine bedrijven en ZZP\'ers die een professionele online aanwezigheid willen',
    price: '750',
    originalPrice: null,
    popular: false,
    features: [
      'Tot 5 pagina\'s',
      'Responsive design',
      'Basis SEO optimalisatie',
      'Contact formulier',
      'Google Analytics setup',
      '3 maanden support',
      'SSL certificaat',
      'Mobiel geoptimaliseerd'
    ],
    cta: 'Start nu',
    deliveryTime: '2-3 weken',
    includes: 'Eenmalige investering excl. BTW'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Voor groeiende bedrijven die meer functionaliteiten en uitgebreide ondersteuning nodig hebben',
    price: '2500',
    originalPrice: null,
    popular: true,
    features: [
      'Tot 15 pagina\'s',
      'Premium design',
      'Geavanceerde SEO',
      'CMS systeem',
      'Blog functionaliteit',
      'Social media integratie',
      '12 maanden support',
      'Performance optimalisatie',
      'Google My Business setup',
      'Schema markup'
    ],
    cta: 'Meest gekozen',
    deliveryTime: '3-4 weken',
    includes: 'Eenmalige investering excl. BTW'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Complexe websites met maatwerk functionaliteiten voor grote organisaties',
    price: '5000',
    originalPrice: null,
    popular: false,
    features: [
      'Onbeperkt pagina\'s',
      'Volledig maatwerk design',
      'Technische SEO audit',
      'Custom CMS oplossing',
      'API integraties',
      'Multi-language support',
      '24 maanden support',
      'Performance monitoring',
      'Security hardening',
      'A/B testing setup',
      'Advanced analytics',
      '3D elementen mogelijk'
    ],
    cta: 'Op maat gemaakt',
    deliveryTime: '4-8 weken',
    includes: 'Vanaf-prijs excl. BTW'
  }
];

// Additional services
const additionalServices = [
  {
    name: 'Webshop Starter',
    price: '2750',
    description: 'Eenvoudige webshop tot 50 producten',
    features: ['iDEAL integratie', 'Basis inventory', 'Mobiel geoptimaliseerd']
  },
  {
    name: 'Webshop Professional',
    price: '4500',
    description: 'Uitgebreide webshop voor groeiende bedrijven',
    features: ['Onbeperkt producten', 'Alle betaalmethoden', 'Analytics integratie']
  },
  {
    name: '3D Ervaringen',
    price: '2500',
    description: 'Interactieve 3D visualisaties en animaties',
    features: ['WebGL technologie', 'Product visualisatie', 'Custom animaties']
  },
  {
    name: 'SEO Optimalisatie',
    price: '1500',
    description: 'Uitgebreide SEO audit en optimalisatie',
    features: ['Technische SEO', 'Content optimalisatie', 'Link building']
  }
];

// FAQ items with structured data ready
const pricingFAQ = [
  {
    question: 'Wat zijn de exacte kosten voor het laten maken van een website?',
    answer: 'Onze website prijzen zijn transparant en starten vanaf €750 voor een Starter website tot €5.000+ voor Enterprise oplossingen. De exacte kosten hangen af van het aantal pagina\'s, gewenste functionaliteiten en maatwerk elementen. Alle prijzen zijn exclusief BTW en er zijn geen verborgen kosten.'
  },
  {
    question: 'Zijn er extra kosten na oplevering van de website?',
    answer: 'Nee, onze pakketten bevatten alles wat u nodig heeft. De genoemde prijzen zijn eenmalige investeringen. Voor hosting en domein rekenen we €15-25 per maand na het eerste jaar. Support is al inbegrepen volgens het gekozen pakket.'
  },
  {
    question: 'Kan ik een website op maat laten maken binnen mijn budget?',
    answer: 'Absoluut! We werken graag binnen uw budget. Tijdens een gratis kennismaking bespreken we uw wensen en maken we een op maat gemaakte offerte. We kunnen functionaliteiten faseren om binnen uw budget te blijven.'
  },
  {
    question: 'Wat is inbegrepen in de verschillende prijspakketten?',
    answer: 'Elk pakket bevat responsive design, SEO optimalisatie, SSL certificaat en support. Het Professional pakket voegt CMS, blog en extended support toe. Enterprise bevat maatwerk design, API integraties en 24 maanden support.'
  },
  {
    question: 'Hoe werkt de betaling voor website ontwikkeling?',
    answer: 'We werken met een 50% vooruitbetaling bij start en 50% bij oplevering. Voor grotere projecten kunnen we een betalingsschema in termijnen afspreken. Betaling is mogelijk via bankovermaking of factuur.'
  },
  {
    question: 'Krijg ik eigendom van de website en broncode?',
    answer: 'Ja, na volledige betaling krijgt u volledig eigendom van uw website inclusief alle broncode, afbeeldingen en content. U bent niet afhankelijk van ons voor toekomstige wijzigingen.'
  },
  {
    question: 'Wat gebeurt er als ik niet tevreden ben met het resultaat?',
    answer: 'Wij werken met een 100% tevredenheidsgarantie. We blijven revisies maken tot u volledig tevreden bent. Mocht het echt niet lukken, dan krijgt u uw geld terug - dat is nog nooit gebeurd!'
  },
  {
    question: 'Hoeveel kost een webshop laten maken?',
    answer: 'Webshop prijzen starten vanaf €2.750 voor een Starter webshop tot €8.500+ voor Enterprise oplossingen met complexe functionaliteiten. Elke webshop wordt op maat gemaakt met Nederlandse betaalmethoden zoals iDEAL.'
  }
];

export default function PrijzenPage() {
  const breadcrumbs = [
    { title: 'Home', href: '/' },
    { title: 'Prijzen', href: '/prijzen' }
  ];

  return (
    <main className="relative pt-24 md:pt-32 overflow-hidden">
      <SEOSchema
        pageType="prijzen"
        pageTitle={metadata.title as string}
        pageDescription={metadata.description as string}
        includeFAQ={true}
        serviceOffers={pricingPackages.map(pkg => ({
          name: `${pkg.name} Website Pakket`,
          description: pkg.description,
          price: pkg.price,
          priceSpecification: {
            currency: 'EUR',
            value: pkg.price,
            valueAddedTaxIncluded: false
          },
          features: pkg.features,
          deliveryTime: pkg.deliveryTime
        }))}
      />

      {/* Pricing-specific structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'OfferCatalog',
            '@id': `${SITE_URL}/prijzen#offers`,
            name: 'ProWeb Studio Website Prijzen',
            description: 'Transparante website tarieven voor Nederlandse bedrijven',
            mainEntity: pricingPackages.map(pkg => ({
              '@type': 'Offer',
              '@id': `${SITE_URL}/prijzen#${pkg.id}`,
              name: `${pkg.name} Website Pakket`,
              description: pkg.description,
              price: pkg.price,
              priceCurrency: 'EUR',
              priceSpecification: {
                '@type': 'PriceSpecification',
                price: pkg.price,
                priceCurrency: 'EUR',
                valueAddedTaxIncluded: false,
                eligibleRegion: 'NL'
              },
              category: 'Website Development',
              availability: 'https://schema.org/InStock',
              seller: {
                '@type': 'Organization',
                '@id': `${SITE_URL}#organization`,
                name: 'ProWeb Studio',
                url: SITE_URL
              },
              eligibleRegion: {
                '@type': 'Place',
                name: 'Netherlands',
                address: {
                  '@type': 'PostalAddress',
                  addressCountry: 'NL'
                }
              },
              validFrom: new Date().toISOString(),
              itemOffered: {
                '@type': 'Service',
                name: `${pkg.name} Website Development`,
                serviceType: 'Website Development',
                provider: {
                  '@id': `${SITE_URL}#organization`
                },
                areaServed: 'NL'
              },
              includesObject: pkg.features.map(feature => ({
                '@type': 'Service',
                name: feature
              }))
            }))
          })
        }}
      />

      {/* FAQ structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            '@id': `${SITE_URL}/prijzen#faq`,
            mainEntity: pricingFAQ.map((faq, index) => ({
              '@type': 'Question',
              '@id': `${SITE_URL}/prijzen#faq-${index + 1}`,
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
                author: {
                  '@type': 'Organization',
                  '@id': `${SITE_URL}#organization`
                }
              }
            }))
          })
        }}
      />

      <ErrorBoundary>
        <Suspense fallback={<div className="min-h-screen bg-cosmic-900" />}>
          {/* Breadcrumbs */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          {/* Hero Section */}
          <section className="relative px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-cosmic-900">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Transparante{' '}
                <span className="gradient-text-primary">Prijzen</span>
              </h1>
              <p className="text-xl text-slate-200 max-w-3xl mx-auto mb-8">
                Eerlijke tarieven voor professioneel webdesign. Geen verborgen kosten, 
                geen maandelijkse abonnementen. Investeer eenmalig in uw digitale toekomst.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  href="/contact"
                  variant="primary"
                  size="large"
                >
                  Gratis offerte aanvragen
                </Button>
                <Button
                  href="#pakketten"
                  variant="secondary"
                  size="large"
                >
                  Bekijk pakketten
                </Button>
              </div>
            </div>
          </section>

          {/* Pricing Packages */}
          <section id="pakketten" className="py-20 px-4 sm:px-6 lg:px-8 bg-cosmic-900/50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Website Pakketten &{' '}
                  <span className="gradient-text-primary">Tarieven</span>
                </h2>
                <p className="text-lg text-slate-200 max-w-3xl mx-auto">
                  Kies de oplossing die perfect past bij uw bedrijf en budget. 
                  Alle pakketten bevatten professioneel design en zijn volledig responsive.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {pricingPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    id={pkg.id}
                    className={`relative bg-cosmic-800/60 backdrop-blur-sm border rounded-xl p-8 hover:scale-105 transition-all duration-300 ${
                      pkg.popular 
                        ? 'border-primary-500/50 shadow-xl shadow-primary-500/20' 
                        : 'border-cosmic-700/30 hover:border-primary-500/30'
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                          Meest populair
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                      <p className="text-slate-300 text-sm mb-6">{pkg.description}</p>
                      
                      <div className="mb-6">
                        <span className="text-4xl font-bold text-primary-400">€{pkg.price}</span>
                        <div className="text-slate-400 text-sm mt-1">{pkg.includes}</div>
                        <div className="text-slate-300 text-sm mt-1">Oplevering: {pkg.deliveryTime}</div>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-slate-200 flex items-start text-sm">
                          <span className="text-primary-400 mr-3 mt-0.5 flex-shrink-0">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      href="/contact"
                      variant={pkg.popular ? "primary" : "secondary"}
                      size="large"
                      className="w-full"
                    >
                      {pkg.cta}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Additional Services */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cosmic-800/30">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Aanvullende{' '}
                  <span className="gradient-text-primary">Diensten</span>
                </h2>
                <p className="text-lg text-slate-200 max-w-3xl mx-auto">
                  Breid uw website uit met geavanceerde functionaliteiten. 
                  Perfecte toevoegingen voor elk pakket.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {additionalServices.map((service, index) => (
                  <div
                    key={index}
                    className="bg-cosmic-800/40 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300"
                  >
                    <h3 className="text-xl font-semibold text-white mb-2">{service.name}</h3>
                    <div className="text-2xl font-bold text-primary-400 mb-3">
                      Vanaf €{service.price}
                    </div>
                    <p className="text-slate-300 text-sm mb-4">{service.description}</p>
                    <ul className="space-y-1 mb-4">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-slate-400 text-xs flex items-center">
                          <span className="text-primary-400 mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      href="/contact"
                      variant="secondary"
                      size="normal"
                      className="w-full"
                    >
                      Meer info
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cosmic-900/50">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Veelgestelde{' '}
                  <span className="gradient-text-primary">Vragen</span>
                </h2>
                <p className="text-lg text-slate-200">
                  Alles wat u wilt weten over onze prijzen en dienstverlening
                </p>
              </div>

              <div className="space-y-6">
                {pricingFAQ.map((faq, index) => (
                  <details key={index} className="bg-cosmic-800/40 rounded-lg border border-cosmic-700/30">
                    <summary className="p-6 cursor-pointer text-white font-medium hover:text-primary-300 transition-colors">
                      {faq.question}
                    </summary>
                    <div className="px-6 pb-6 text-slate-200 text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-900/20 to-secondary-900/20">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Klaar om te Starten?
              </h2>
              <p className="text-xl text-slate-200 mb-8">
                Laten we uw digitale ambities bespreken in een gratis kennismarkingsgesprek. 
                Geen verplichtingen, wel veel inspiratie en concrete mogelijkheden.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  href="/contact"
                  variant="primary"
                  size="large"
                >
                  Gratis gesprek plannen
                </Button>
                <Button
                  href="/diensten"
                  variant="secondary"
                  size="large"
                >
                  Bekijk alle diensten
                </Button>
              </div>
            </div>
          </section>
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}