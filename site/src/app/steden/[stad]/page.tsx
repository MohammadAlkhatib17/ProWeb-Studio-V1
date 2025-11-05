import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  getStadBySlug, 
  getNearbySteden, 
  getAllStadSlugs 
} from '@/config/steden.config';
import { diensten } from '@/config/diensten.config';
import { generateStadMetadata, generateStadSchema } from '@/lib/seo/steden-metadata';
import { Button } from '@/components/Button';
import Breadcrumbs from '@/components/Breadcrumbs';
import ContentSuggestions from '@/components/ContentSuggestions';
import { DutchBusinessInfo } from '@/components/local-seo';

export const dynamic = 'force-static';
export const revalidate = 172800; // 48 hours ISR

interface StadPageProps {
  params: {
    stad: string;
  };
}

// Generate static params for all cities
export async function generateStaticParams() {
  return getAllStadSlugs().map((slug) => ({
    stad: slug,
  }));
}

// Generate metadata for each city
export async function generateMetadata({ params }: StadPageProps): Promise<Metadata> {
  const stad = getStadBySlug(params.stad);
  
  if (!stad) {
    return {
      title: 'Stad niet gevonden | ProWeb Studio',
      description: 'De opgevraagde stad is niet gevonden.',
    };
  }

  return generateStadMetadata({ stad });
}

export default function StadPage({ params }: StadPageProps) {
  const stad = getStadBySlug(params.stad);
  
  if (!stad) {
    notFound();
  }

  const nearbySteden = getNearbySteden(stad.slug);
  const availableDiensten = diensten.filter(dienst => 
    stad.relatedServices.includes(dienst.slug)
  );

  const stadSchema = generateStadSchema(stad);

  return (
    <main className="pt-20 md:pt-24 relative overflow-hidden">
      <Breadcrumbs />
      
      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(stadSchema),
        }}
      />

      {/* Hero Section */}
      <section className="relative py-section-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">📍</span>
              <span className="text-cyan-300 font-medium">{stad.province} • {stad.region}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Website laten maken{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {stad.name}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-200 mb-8 leading-relaxed">
              {stad.description}
            </p>
            
            <div className="flex items-center gap-6 mb-8 text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                {stad.population.toLocaleString('nl-NL')} inwoners
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                {availableDiensten.length} diensten beschikbaar
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                href="/contact"
                variant="primary"
                size="large"
              >
                Start Uw Project in {stad.name} →
              </Button>
              <Button
                href="/portfolio"
                variant="secondary"
                size="large"
              >
                Bekijk Portfolio
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Available Services */}
      <section className="py-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Onze Diensten in {stad.name}
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Professionele webdiensten speciaal afgestemd op de behoeften 
              van bedrijven in {stad.name} en omgeving.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableDiensten.map((dienst) => (
              <Link
                key={dienst.slug}
                href={`/steden/${stad.slug}/${dienst.slug}`}
                className="group bg-cosmic-800/30 border border-cosmic-700/50 rounded-lg p-6 hover:border-cyan-400/50 transition-all duration-300 hover:bg-cosmic-800/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{dienst.icon}</span>
                  <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">
                    {dienst.deliveryTime}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                  {dienst.name}
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {dienst.shortDescription}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-cyan-300 font-medium">
                    Vanaf {dienst.pricing.from}
                  </span>
                  <span className="text-cyan-300 group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {availableDiensten.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-6">
                Alle onze diensten zijn beschikbaar in {stad.name}.
              </p>
              <Link
                href="/diensten"
                className="inline-flex items-center px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-cosmic-900 font-semibold rounded-lg transition-colors duration-200"
              >
                Bekijk Alle Diensten
                <span className="ml-2">→</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-section bg-cosmic-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Waarom Kiezen voor ProWeb Studio in {stad.name}?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-cosmic-900 font-bold text-lg">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Lokale Kennis, Nationale Expertise
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  We begrijpen de unieke karakteristieken van {stad.name} 
                  en combineren dit met onze landelijke ervaring in webdesign. 
                  Van lokale bedrijven tot nationale merken.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-cosmic-900 font-bold text-lg">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  SEO voor {stad.name}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  Lokale SEO-optimalisatie zorgt ervoor dat uw website 
                  goed vindbaar is voor klanten in {stad.name} en omgeving. 
                  Word gevonden door de juiste doelgroep.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-cosmic-900 font-bold text-lg">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Persoonlijke Service
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  Directe communicatie in het Nederlands en persoonlijke aandacht. 
                  We zijn altijd bereikbaar voor vragen of aanpassingen. 
                  Geen grote corporate afstand.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-cosmic-900 font-bold text-lg">4</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Bewezen Resultaten
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  Tevreden klanten door heel Nederland, waaronder succesvolle 
                  projecten voor bedrijven in en rond {stad.name}. 
                  Van startup tot enterprise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Cities */}
      {nearbySteden.length > 0 && (
        <section className="py-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ook Actief in de Omgeving van {stad.name}
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Naast {stad.name} bedienen wij ook graag andere steden in {stad.region}.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {nearbySteden.map((nearbyStad) => (
                <Link
                  key={nearbyStad.slug}
                  href={`/steden/${nearbyStad.slug}`}
                  className="group bg-cosmic-800/30 border border-cosmic-700/50 rounded-lg p-6 hover:border-cyan-400/50 transition-all duration-300 hover:bg-cosmic-800/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {nearbyStad.name}
                    </h3>
                    <span className="text-xl">📍</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-3">{nearbyStad.province}</p>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    {nearbyStad.shortDescription}
                  </p>
                  <div className="flex items-center text-cyan-300 text-sm font-medium">
                    Bekijk diensten in {nearbyStad.name}
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/steden"
                className="inline-flex items-center text-cyan-300 hover:text-cyan-200 font-medium"
              >
                Bekijk alle steden waar wij actief zijn
                <span className="ml-2">→</span>
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
              Neem Contact Op voor Website Project in {stad.name}
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Klaar om uw online aanwezigheid in {stad.name} te versterken? 
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
            title: 'Plan Een Gesprek', 
            href: '/contact', 
            description: `Bespreek uw website project voor ${stad.name}` 
          },
          { 
            title: 'Bekijk Onze Werkwijze', 
            href: '/werkwijze', 
            description: 'Ontdek hoe wij samen tot het beste resultaat komen' 
          },
          { 
            title: 'Portfolio Inzien', 
            href: '/portfolio', 
            description: 'Zie voorbeelden van onze professionele websites' 
          }
        ]}
      />
    </main>
  );
}
