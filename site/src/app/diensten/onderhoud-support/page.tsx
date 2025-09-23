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
  title: 'Website Onderhoud & Support | Technisch Beheer & Hosting Nederland – ProWeb Studio',
  description:
    'Professioneel website onderhoud en technische support. Hosting management, security updates, performance monitoring en 24/7 support voor Nederlandse websites.',
  alternates: {
    canonical: `${SITE_URL}/diensten/onderhoud-support`,
    languages: { 
      'nl-NL': `${SITE_URL}/diensten/onderhoud-support`,
      'x-default': `${SITE_URL}/diensten/onderhoud-support`
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
    title: 'Website Onderhoud & Support | Technisch Beheer & Hosting Nederland – ProWeb Studio',
    description: 'Professioneel website onderhoud en technische support. Hosting management, security updates, en performance monitoring.',
    url: `${SITE_URL}/diensten/onderhoud-support`,
    type: 'website',
    locale: 'nl_NL',
    images: [{ url: `${SITE_URL}/og`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Website Onderhoud & Support | Technisch Beheer & Hosting Nederland – ProWeb Studio',
    description: 'Professioneel website onderhoud en technische support. Hosting management, security updates.',
    images: [`${SITE_URL}/og`],
  },
};

const maintenanceFeatures = [
  {
    title: 'Technisch Onderhoud',
    description: 'Proactief onderhoud voor optimale website prestaties',
    icon: '🔧',
    details: [
      'Software updates & patches',
      'Security monitoring & fixes',
      'Performance optimalisatie',
      'Database maintenance'
    ]
  },
  {
    title: 'Hosting & Infrastructuur',
    description: 'Betrouwbare hosting met maximale uptime',
    icon: '🌐',
    details: [
      'Premium cloud hosting',
      'CDN & caching optimalisatie',
      'SSL certificaat beheer',
      'Automatische backups'
    ]
  },
  {
    title: 'Security Management',
    description: 'Complete beveiliging tegen cyber threats',
    icon: '🔒',
    details: [
      'Malware scanning & removal',
      'Firewall configuratie',
      'Security headers setup',
      'Vulnerability assessments'
    ]
  },
  {
    title: '24/7 Support',
    description: 'Altijd bereikbare technische ondersteuning',
    icon: '📞',
    details: [
      'Emergency response team',
      'Proactive monitoring',
      'Issue tracking systeem',
      'Gedetailleerde rapportages'
    ]
  }
];

const supportPackages = [
  {
    type: 'Basic Support',
    description: 'Essentieel onderhoud voor kleine websites',
    features: ['Maandelijkse updates', 'Security monitoring', 'Backup management', 'Email support'],
    price: '€75/maand',
    responseTime: '24 uur',
    recommended: false
  },
  {
    type: 'Professional Support',
    description: 'Uitgebreide ondersteuning voor zakelijke websites',
    features: ['Wekelijkse updates', 'Performance monitoring', 'Priority support', 'SEO monitoring'],
    price: '€150/maand',
    responseTime: '4 uur',
    recommended: true
  },
  {
    type: 'Enterprise Support',
    description: 'Premium onderhoud voor kritieke business applicaties',
    features: ['Dagelijkse monitoring', '24/7 phone support', 'Custom development', 'SLA garanties'],
    price: '€350/maand',
    responseTime: '1 uur',
    recommended: false
  },
  {
    type: 'E-commerce Support',
    description: 'Gespecialiseerd onderhoud voor webshops',
    features: ['Transaction monitoring', 'Payment gateway support', 'Inventory management', 'Sales reporting'],
    price: '€250/maand',
    responseTime: '2 uur',
    recommended: false
  }
];

const maintenanceServices = [
  {
    name: 'Content Updates',
    description: 'Regelmatige content updates en wijzigingen',
    icon: '📝',
    tasks: ['Tekst aanpassingen', 'Afbeelding uploads', 'Menu wijzigingen', 'Product catalogi']
  },
  {
    name: 'Performance Monitoring',
    description: 'Continue monitoring van website prestaties',
    icon: '📊',
    tasks: ['Load time tracking', 'Core Web Vitals', 'Error monitoring', 'User experience metrics']
  },
  {
    name: 'Security Maintenance',
    description: 'Proactieve beveiliging en threat prevention',
    icon: '🛡️',
    tasks: ['Security patches', 'Malware scans', 'Access control', 'Compliance checks']
  },
  {
    name: 'Backup & Recovery',
    description: 'Geautomatiseerde backups en disaster recovery',
    icon: '💾',
    tasks: ['Daily backups', 'Version control', 'Quick restore', 'Data integrity checks']
  }
];

const monitoringTools = [
  {
    tool: 'Uptime Monitoring',
    description: '24/7 beschikbaarheid controle',
    features: ['Multi-location checks', 'Instant alerts', 'Historical reports', 'SLA tracking']
  },
  {
    tool: 'Performance Analytics',
    description: 'Gedetailleerde prestatie metrieken',
    features: ['Page speed insights', 'User journey tracking', 'Conversion monitoring', 'A/B testing']
  },
  {
    tool: 'Security Scanning',
    description: 'Continue beveiligings checks',
    features: ['Vulnerability scans', 'Malware detection', 'SSL monitoring', 'Code analysis']
  },
  {
    tool: 'SEO Health Check',
    description: 'SEO prestaties monitoring',
    features: ['Ranking tracking', 'Technical SEO audit', 'Content optimization', 'Link monitoring']
  }
];

const faqItems = [
  {
    question: 'Wat is inbegrepen bij website onderhoud?',
    answer: 'Website onderhoud omvat technische updates, security patches, performance monitoring, backup management, content updates, en technische support. We zorgen ervoor dat uw website veilig, snel en up-to-date blijft.'
  },
  {
    question: 'Hoe vaak worden updates uitgevoerd?',
    answer: 'Dit hangt af van uw support pakket. Basic pakketten krijgen maandelijkse updates, Professional wekelijks, en Enterprise dagelijkse monitoring. Kritieke security updates worden altijd direct uitgevoerd.'
  },
  {
    question: 'Wat gebeurt er bij een website crash?',
    answer: 'Ons monitoring systeem detecteert problemen meestal binnen 1-5 minuten. We hebben 24/7 response teams en kunnen websites meestal binnen 15-60 minuten herstellen, afhankelijk van uw support level.'
  },
  {
    question: 'Kunnen jullie ook hosting verzorgen?',
    answer: 'Ja, we bieden premium managed hosting op enterprise-grade infrastructuur. Dit omvat CDN, SSL certificaten, automatische backups, en geoptimaliseerde servers voor maximale performance.'
  },
  {
    question: 'Wat zijn de kosten voor website onderhoud?',
    answer: 'Onderhoud pakketten starten vanaf €75/maand voor basis support tot €350/maand voor enterprise niveau. Prijzen hangen af van website complexiteit, traffic volume, en gewenste service levels.'
  },
  {
    question: 'Hoe worden security threats aangepakt?',
    answer: 'We gebruiken proactieve security monitoring, automatische malware scans, firewall management, en security patches. Bij security incidents hebben we rapid response protocollen en forensic analysis capabilities.'
  }
];

export default function OnderhoudenSupport() {
  return (
    <main className="pt-20 md:pt-24 relative overflow-hidden">
      {/* SEO Schema */}
      <SEOSchema 
        pageType="services"
        pageTitle="Website Onderhoud & Support"
        pageDescription="Professioneel website onderhoud en technische support met hosting management en security monitoring"
      />
      
      {/* Breadcrumbs */}
      <Breadcrumbs />
      
      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Website Onderhoud &{' '}
            <span className="gradient-text-primary">
              Support
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Zorgeloos website beheer met professioneel onderhoud, hosting management, 
            security monitoring en 24/7 technische ondersteuning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/contact"
              variant="primary"
              size="large"
              className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500"
            >
              Support Pakket Kiezen
            </Button>
            <Button
              href="/speeltuin"
              variant="secondary"
              size="large"
              className="border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white"
            >
              Monitoring Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Complete{' '}
              <span className="gradient-text-primary">
                Website Care
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Van technisch onderhoud tot hosting management - wij zorgen voor alle 
              aspecten van uw website zodat u zich kunt richten op uw business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {maintenanceFeatures.map((feature, index) => (
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

      {/* Support Packages Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-cosmic-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Support{' '}
              <span className="gradient-text-primary">
                Pakketten
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Kies het support niveau dat past bij uw website en business behoeften.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportPackages.map((pkg, index) => (
              <div
                key={index}
                className={`relative bg-cosmic-800/40 backdrop-blur-sm border rounded-xl p-8 transition-all duration-300 ${
                  pkg.recommended 
                    ? 'border-primary-500/80 bg-primary-900/20' 
                    : 'border-cosmic-700/30 hover:border-primary-500/50'
                }`}
              >
                {pkg.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs px-3 py-1 rounded-full">
                      Aanbevolen
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-semibold text-white mb-3">{pkg.type}</h3>
                <p className="text-gray-300 text-sm mb-4">{pkg.description}</p>
                <div className="text-2xl font-bold text-primary-400 mb-2">
                  {pkg.price}
                </div>
                <div className="text-sm text-gray-400 mb-6">
                  Response: {pkg.responseTime}
                </div>
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white mb-3">Inbegrepen:</h4>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-gray-300 flex items-center">
                        <span className="text-primary-400 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  href="/contact"
                  variant={pkg.recommended ? "primary" : "secondary"}
                  size="normal"
                  className={`w-full ${
                    pkg.recommended 
                      ? "bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500" 
                      : "border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white"
                  }`}
                >
                  Pakket Kiezen
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Maintenance Services Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Onderhoud{' '}
              <span className="gradient-text-primary">
                Services
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Uitgebreide onderhouds diensten om uw website in optimale staat te houden.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {maintenanceServices.map((service, index) => (
              <div
                key={index}
                className="bg-cosmic-800/30 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300 text-center"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-3">{service.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{service.description}</p>
                <div className="space-y-1">
                  {service.tasks.map((task, taskIndex) => (
                    <div key={taskIndex} className="text-xs text-gray-400">
                      • {task}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Monitoring Tools Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-cosmic-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Monitoring{' '}
              <span className="gradient-text-primary">
                & Analytics
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Geavanceerde monitoring tools voor complete inzichten in uw website prestaties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {monitoringTools.map((tool, index) => (
              <div
                key={index}
                className="bg-cosmic-800/40 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-8 hover:border-primary-500/50 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-white mb-3">{tool.tool}</h3>
                <p className="text-gray-300 text-sm mb-6">{tool.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  {tool.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="text-xs text-gray-400 bg-cosmic-700/30 rounded-lg p-3 text-center"
                    >
                      {feature}
                    </div>
                  ))}
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
              Support{' '}
              <span className="gradient-text-primary">
                Proces
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Gestructureerde aanpak voor optimaal website beheer en onderhoud.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Website Audit',
                description: 'Complete analyse van huidige staat en behoeften',
                duration: '1 week'
              },
              {
                step: '02',
                title: 'Setup & Migratie',
                description: 'Hosting setup en monitoring configuratie',
                duration: '1-2 weken'
              },
              {
                step: '03',
                title: 'Proactief Onderhoud',
                description: 'Continue monitoring en preventief onderhoud',
                duration: 'Doorlopend'
              },
              {
                step: '04',
                title: 'Rapportage & Optimalisatie',
                description: 'Maandelijkse rapporten en verbeteringen',
                duration: 'Maandelijks'
              }
            ].map((phase, index) => (
              <div
                key={index}
                className="relative bg-cosmic-800/30 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-6 text-center"
              >
                <div className="text-2xl font-bold text-primary-400 mb-3">{phase.step}</div>
                <h3 className="text-lg font-semibold text-white mb-3">{phase.title}</h3>
                <p className="text-gray-300 text-sm mb-3">{phase.description}</p>
                <div className="text-xs text-primary-300 font-medium">{phase.duration}</div>
                {index < 3 && (
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
            title="Veelgestelde Vragen over Website Onderhoud"
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
            Zorgeloos{' '}
            <span className="gradient-text-primary">
              Website Beheer
            </span>
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Laat ons uw website beheren zodat u zich kunt focussen op wat u het beste doet: 
            uw business laten groeien.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/contact"
              variant="primary"
              size="large"
              className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500"
            >
              Support Pakket Selecteren
            </Button>
            <Button
              href="/speeltuin"
              variant="secondary"
              size="large"
              className="border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white"
            >
              Live Monitoring Demo
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
                    description: 'Nieuwe websites met ingebouwd onderhoudsplan',
                    href: '/diensten/website-laten-maken',
                    icon: '🌐'
                  },
                  {
                    title: 'SEO Optimalisatie',
                    description: 'Continue SEO monitoring en verbetering',
                    href: '/diensten/seo-optimalisatie',
                    icon: '📈'
                  },
                  {
                    title: '3D Website Ervaringen',
                    description: 'Gespecialiseerd onderhoud voor complexe 3D sites',
                    href: '/diensten/3d-website-ervaringen',
                    icon: '🎮'
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