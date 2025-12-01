import Link from 'next/link';

import Breadcrumbs from '@/components/Breadcrumbs';
import ContentSuggestions from '@/components/ContentSuggestions';
import { CitySelector, DutchBusinessInfo } from '@/components/local-seo';
import type { City } from '@/components/local-seo';
import { locations } from '@/config/internal-linking.config';
import { generateMetadata as generateMetadataUtil } from '@/lib/metadata';

import type { Metadata } from 'next';

export const dynamic = 'force-static';
export const revalidate = 60 * 60 * 24;

const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataUtil({
    title: 'Webdesign Locaties Nederland | ProWeb Studio in alle grote steden',
    description: 'ProWeb Studio biedt professionele webdesign diensten in heel Nederland. Van Amsterdam tot Rotterdam, Utrecht tot Den Haag - lokale expertise voor uw website project.',
    path: '/locaties',
    keywords: [
      'webdesign nederland',
      'website laten maken amsterdam',
      'webdesign rotterdam',
      'website ontwikkeling utrecht',
      'lokale webdesign',
    ],
  });
}

// Generate location schema
const locationsSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${SITE_URL}/locaties#locations`,
  inLanguage: 'nl-NL',
  name: 'ProWeb Studio Locaties Nederland',
  description: 'Webdesign en ontwikkeling diensten in Nederlandse steden',
  itemListElement: locations.map((location, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Place',
      '@id': `${SITE_URL}/locaties/${location.slug}`,
      name: location.name,
      description: location.description,
      address: {
        '@type': 'PostalAddress',
        addressRegion: location.region,
        addressCountry: 'NL',
      },
      containedInPlace: {
        '@type': 'Country',
        name: 'Netherlands',
      },
    },
  })),
};

export default function LocatiesPage() {
  return (
    <main className="pt-20 md:pt-24 relative overflow-hidden">
      <Breadcrumbs />
      
      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(locationsSchema),
        }}
      />

      {/* Hero Section */}
      <section className="relative py-section-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Webdesign Nederland
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Lokale expertise, nationale kwaliteit. ProWeb Studio biedt professionele 
            webdesign diensten in alle grote Nederlandse steden.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Start Uw Project
              <span className="ml-2">→</span>
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center px-8 py-4 border border-cyan-400 text-cyan-300 hover:bg-cyan-400 hover:text-cosmic-900 font-semibold rounded-lg transition-all duration-300"
            >
              Bekijk Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="py-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Onze Serviceregio&apos;s
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Van de Randstad tot Brabant, van Groningen tot Zeeland - 
              wij bieden lokale service met nationale expertise.
            </p>
          </div>

          {/* City Selector - Grid View */}
          <CitySelector
            cities={locations.map(loc => ({
              name: loc.name,
              slug: loc.slug,
              province: loc.region,
              popular: ['amsterdam', 'rotterdam', 'utrecht', 'den-haag', 'eindhoven'].includes(loc.slug),
            } as City))}
            variant="grid"
            highlightPopular={true}
            label="Kies uw locatie"
          />
        </div>
      </section>

      {/* Business Info Section */}
      <section className="py-section bg-cosmic-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Contact & Bedrijfsinformatie
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Neem contact op voor een vrijblijvend gesprek over uw website project.
            </p>
          </div>
          
          <DutchBusinessInfo 
            variant="compact"
            showAddress={true}
            showOpeningHours={true}
            showContact={true}
            showRegistration={true}
            className="max-w-xl mx-auto"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-section bg-gradient-to-r from-cosmic-900 to-cosmic-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Uw Stad Niet Gevonden?
          </h2>
          <p className="text-lg text-slate-200 mb-8 leading-relaxed">
            Geen probleem! We werken met klanten door heel Nederland. 
            Dankzij moderne technologie en bewezen processen leveren we 
            overal dezelfde hoge kwaliteit.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Neem Contact Op
            <span className="ml-2">→</span>
          </Link>
        </div>
      </section>

      <ContentSuggestions 
        customSuggestions={[
          { title: 'Bekijk Onze Diensten', href: '/diensten', description: 'Ontdek wat wij voor uw bedrijf kunnen betekenen' },
          { title: 'Portfolio Bekijken', href: '/portfolio', description: 'Zie voorbeelden van ons werk voor Nederlandse bedrijven' },
          { title: 'Werkwijze Leren', href: '/werkwijze', description: 'Hoe wij samen tot het beste resultaat komen' }
        ]}
      />
    </main>
  );
}