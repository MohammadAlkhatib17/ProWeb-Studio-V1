import Link from 'next/link';

import Breadcrumbs from '@/components/Breadcrumbs';
import SEOSchema from '@/components/SEOSchema';

import type { Metadata } from 'next';

// Get canonical URL from environment with fallback
const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');

export const dynamic = 'force-static';
export const revalidate = 86400; // 24 hours ISR

export const metadata: Metadata = {
  title: 'Site Overzicht – Alle pagina&apos;s van ProWeb Studio | Website navigatie',
  description: 'Volledig overzicht van ProWeb Studio. Vind gemakkelijk alle pagina&apos;s, diensten, portfolio en contactinformatie voor professionele webdevelopment in Nederland.',
  alternates: {
    canonical: '/overzicht-site',
    languages: {
      'nl-NL': '/overzicht-site',
      'x-default': '/overzicht-site'
    },
  },
  openGraph: {
    title: 'Site Overzicht – ProWeb Studio',
    description: 'Volledig overzicht van ProWeb Studio. Vind gemakkelijk alle pagina\'s, diensten, portfolio en contactinformatie.',
    url: `${SITE_URL}/overzicht-site`,
    type: 'website',
    locale: 'nl_NL',
  },
};

const sitemapSections = [
  {
    title: 'Hoofdpagina\'s',
    description: 'De belangrijkste pagina\'s van ProWeb Studio',
    icon: '🏠',
    links: [
      { href: '/', title: 'Homepage', description: 'Welkom bij ProWeb Studio - Uw partner voor innovatieve weboplossingen' },
      { href: '/over-ons', title: 'Over Ons', description: 'Leer ons team en onze missie kennen' },
      { href: '/contact', title: 'Contact', description: 'Neem contact op voor uw webproject' },
    ]
  },
  {
    title: 'Diensten & Services',
    description: 'Onze webdevelopment en design diensten',
    icon: '🛠️',
    links: [
      { href: '/diensten', title: 'Alle Diensten', description: 'Volledig overzicht van onze webdevelopment services' },
      { href: '/werkwijze', title: 'Werkwijze', description: 'Onze projectaanpak van concept tot oplevering' },
    ]
  },
  {
    title: 'Portfolio & Showcases',
    description: 'Onze projecten en technische demonstraties',
    icon: '🎨',
    links: [
      { href: '/portfolio', title: 'Portfolio', description: 'Bekijk onze gerealiseerde webprojecten en case studies' },
    ]
  },
  {
    title: 'Juridisch & Beleid',
    description: 'Voorwaarden, privacy en juridische informatie',
    icon: '📋',
    links: [
      { href: '/privacy', title: 'Privacybeleid', description: 'Hoe wij omgaan met uw persoonlijke gegevens' },
      { href: '/voorwaarden', title: 'Algemene Voorwaarden', description: 'Voorwaarden voor samenwerking met ProWeb Studio' },
    ]
  },
];

const keywordCategories = [
  {
    title: 'Website Laten Maken',
    keywords: [
      'Website laten maken Nederland',
      'Professionele website ontwikkeling',
      'Maatwerk webdesign',
      'Responsive website bouwen',
      'WordPress alternatieven',
    ]
  },
  {
    title: '3D Web Technologie',
    keywords: [
      'WebGL ontwikkeling',
      'Three.js websites',
      'Interactieve 3D ervaringen',
      'React Three Fiber',
      '3D productconfigurators',
    ]
  },
  {
    title: 'Performance & SEO',
    keywords: [
      'Core Web Vitals optimalisatie',
      'Technische SEO',
      'Website snelheidsoptimalisatie',
      'Google PageSpeed verbetering',
      'Zoekmachine optimalisatie',
    ]
  },
  {
    title: 'E-commerce & Webshops',
    keywords: [
      'Webshop laten maken',
      'E-commerce ontwikkeling',
      'Online verkoop platform',
      'Betaalsysteem integratie',
      'Headless commerce',
    ]
  },
];

export default function SitemapPage() {
  return (
    <main className="content-safe-top pt-20 md:pt-24">
      <Breadcrumbs />

      <SEOSchema
        pageType="generic"
        pageTitle={metadata.title as string}
        pageDescription={metadata.description as string}
      />

      {/* Hero Section */}
      <section className="py-12 sm:py-section px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 glow-text">
            Site Overzicht ProWeb Studio
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-200 max-w-3xl mx-auto mb-8">
            Navigeer gemakkelijk door alle pagina&apos;s van ProWeb Studio. Van diensten tot portfolio,
            van technische showcases tot contactinformatie - vind hier alles wat u zoekt.
          </p>
        </div>
      </section>

      {/* Main Sitemap Sections */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sitemapSections.map((section, index) => (
              <div key={index} className="glass p-6 sm:p-8 rounded-xl">
                <div className="flex items-center mb-6">
                  <span className="text-3xl mr-3" aria-hidden="true">{section.icon}</span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-cyan-300">
                      {section.title}
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                      {section.description}
                    </p>
                  </div>
                </div>

                <ul className="space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="block p-4 rounded-lg bg-cosmic-800/40 border border-cosmic-700/60 hover:border-cyan-500/60 transition-all duration-300 group"
                      >
                        <h3 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          {link.title}
                        </h3>
                        <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                          {link.description}
                        </p>
                        <div className="flex items-center mt-2 text-cyan-300 text-sm">
                          <span>Bezoek pagina</span>
                          <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Keywords Section */}
      <section className="py-12 px-4 sm:px-6 bg-cosmic-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center gradient-text">
            Onze Expertisegebieden
          </h2>
          <p className="text-slate-200 text-center mb-12 max-w-3xl mx-auto">
            ProWeb Studio specialiseert zich in diverse aspecten van moderne webdevelopment.
            Ontdek onze kerncompetenties en hoe wij uw digitale ambities kunnen realiseren.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {keywordCategories.map((category, index) => (
              <div key={index} className="glass p-6 rounded-xl">
                <h3 className="text-xl font-bold text-cyan-300 mb-4">
                  {category.title}
                </h3>
                <ul className="space-y-2">
                  {category.keywords.map((keyword, keywordIndex) => (
                    <li key={keywordIndex} className="text-slate-200 text-sm flex items-center">
                      <span className="text-cyan-300 mr-2 text-xs">▸</span>
                      {keyword}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
            Snelle Acties
          </h2>
          <p className="text-slate-200 mb-8">
            Weet u al wat u zoekt? Spring direct naar de meest populaire pagina&apos;s.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/contact"
              className="p-4 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-lg font-semibold hover:scale-105 transition-all duration-300 hover:shadow-xl"
            >
              Contact Opnemen
            </Link>
            <Link
              href="/diensten"
              className="p-4 border-2 border-cyan-400/60 text-cyan-100 rounded-lg hover:bg-cyan-400/10 transition-all duration-300"
            >
              Bekijk Diensten
            </Link>

            <Link
              href="/portfolio"
              className="p-4 border-2 border-gray-600 text-gray-100 rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center glass p-8 rounded-xl">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">
            Klaar om uw Website Project te Starten?
          </h2>
          <p className="text-slate-200 mb-6">
            Van concept tot conversie - ProWeb Studio realiseert digitale oplossingen
            die uw bedrijf naar het volgende niveau tillen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25"
            >
              Plan Gratis Strategiesessie
            </Link>
            <Link
              href="/werkwijze"
              className="px-8 py-4 border-2 border-gray-600 rounded-lg font-semibold text-lg hover:border-white hover:bg-white/10 transition-all duration-300"
            >
              Ontdek Onze Werkwijze
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}