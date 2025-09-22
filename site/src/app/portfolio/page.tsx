import type { Metadata } from 'next';
import { siteConfig } from '@/config/site.config';
import PortfolioHero from '../../components/portfolio/PortfolioHero';
import WebDevelopmentShowcase from '../../components/portfolio/WebDevelopmentShowcase';
import EcommerceShowcase from '../../components/portfolio/EcommerceShowcase';
import BrandIdentityShowcase from '../../components/portfolio/BrandIdentityShowcase';
import MobileShowcase from '../../components/portfolio/MobileShowcase';
import CaseStudies from '../../components/portfolio/CaseStudies';
import PortfolioSchema from '../../components/portfolio/PortfolioSchema';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Portfolio | Onze Beste Werk - 3D Web & App Ontwikkeling',
  description:
    'Bekijk ons portfolio van hoogwaardige websites, webshops en mobiele applicaties. Van 3D interactieve ervaringen tot e-commerce platforms - ontdek ons Nederlandse vakmanschap.',
  keywords: [
    'portfolio webdesign nederland',
    'website portfolio',
    'webshop voorbeelden',
    '3d website portfolio',
    'responsive design voorbeelden',
    'dutch web development',
    'e-commerce portfolio',
    'mobile app design nederland',
    'interactieve websites',
    'webontwikkeling portfolio'
  ],
  openGraph: {
    title: 'Portfolio | ProWeb Studio - Nederlandse Web Development',
    description: 'Ontdek ons portfolio van innovatieve websites en apps. Van 3D interactieve ervaringen tot prestatie-geoptimaliseerde e-commerce platforms.',
    url: `${siteConfig.url}/portfolio`,
    siteName: siteConfig.name,
    images: [
      {
        url: '/assets/og/portfolio-og.jpg',
        width: 1200,
        height: 630,
        alt: 'ProWeb Studio Portfolio - Nederlandse Web Development'
      }
    ],
    locale: 'nl_NL',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio | ProWeb Studio - Nederlandse Web Development',
    description: 'Ontdek ons portfolio van innovatieve websites en apps. Van 3D ervaringen tot prestatie-geoptimaliseerde platforms.',
    images: ['/assets/og/portfolio-og.jpg']
  },
  alternates: {
    canonical: `${siteConfig.url}/portfolio`
  }
};

const breadcrumbs = [
  { title: 'Home', href: '/' },
  { title: 'Portfolio', href: '/portfolio' }
];

export default function PortfolioPage() {
  return (
    <>
      <PortfolioSchema />
      <main className="relative min-h-screen overflow-x-hidden">
        {/* Breadcrumbs */}
        <div className="relative z-10 pt-24 pb-8">
          <div className="container mx-auto px-safe">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </div>

        {/* Portfolio Hero Section */}
        <PortfolioHero />

        {/* Showcase Sections */}
        <section className="relative py-16 lg:py-24">
          {/* Web Development Showcase */}
          <WebDevelopmentShowcase />
          
          {/* E-commerce Platform Showcase */}
          <EcommerceShowcase />
          
          {/* Brand Identity Showcase */}
          <BrandIdentityShowcase />
          
          {/* Mobile-Responsive Design Showcase */}
          <MobileShowcase />
        </section>

        {/* Detailed Case Studies */}
        <CaseStudies />

        {/* Call to Action */}
        <section className="relative py-16 lg:py-24 bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-stellar-900">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container relative mx-auto px-safe text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Klaar voor Jullie Volgende Project?
            </h2>
            <p className="text-xl text-cosmic-200 mb-8 max-w-2xl mx-auto">
              Laat ons jullie visie tot leven brengen met cutting-edge 3D technologie en Nederlandse precisie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-stellar-500 to-cosmic-500 hover:from-stellar-400 hover:to-cosmic-400 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Start Jullie Project
              </a>
              <a
                href="/diensten"
                className="inline-flex items-center px-8 py-4 border-2 border-stellar-400 text-stellar-400 hover:bg-stellar-400 hover:text-white font-semibold rounded-lg transition-all duration-300"
              >
                Bekijk Onze Diensten
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}