import Link from 'next/link';
import { siteConfig } from '@/config/site.config';
import { Button } from '@/components/Button';

// Regional targeting component for major Dutch cities and regions
export default function DutchRegionalTargeting() {
  const regions = [
    {
      name: "Amsterdam",
      province: "Noord-Holland",
      description: "Website laten maken in Amsterdam voor startups, scale-ups en gevestigde bedrijven. Moderne webdesign voor de hoofdstad.",
      features: ["Startup-vriendelijk", "Snelle oplevering", "Internationale uitstraling", "Tech-savvy oplossingen"],
      keywords: ["website laten maken Amsterdam", "webdesign Amsterdam", "startup website Amsterdam"],
      population: "900k+ inwoners",
      businesses: "50k+ bedrijven"
    },
    {
      name: "Rotterdam",
      province: "Zuid-Holland",
      description: "Professionele websites voor Rotterdam&apos;s zakelijke sector. Van haven-gerelateerde bedrijven tot moderne dienstverlening.",
      features: ["Zakelijke focus", "Haven & logistiek expertise", "B2B optimalisatie", "Robuuste oplossingen"],
      keywords: ["website bouwen Rotterdam", "bedrijfswebsite Rotterdam", "webdesign Rotterdam"],
      population: "650k+ inwoners", 
      businesses: "35k+ bedrijven"
    },
    {
      name: "Den Haag",
      province: "Zuid-Holland",
      description: "Website ontwikkeling voor Den Haag&apos;s overheid, juridische sector en internationale organisaties. Compliance en professionaliteit voorop.",
      features: ["Overheid-compliant", "Juridische sector", "Internationale standaarden", "GDPR expertise"],
      keywords: ["website laten maken Den Haag", "overheid website", "juridische website"],
      population: "550k+ inwoners",
      businesses: "30k+ bedrijven"
    },
    {
      name: "Utrecht",
      province: "Utrecht", 
      description: "Centrale ligging, dynamische economie. Websites voor Utrecht&apos;s diverse bedrijfsleven, van tech tot traditionele sectoren.",
      features: ["Centrale locatie", "Diverse sectoren", "Innovatieve oplossingen", "Snelle bereikbaarheid"],
      keywords: ["professionele website Utrecht", "webdesign Utrecht", "website ontwikkeling Utrecht"],
      population: "360k+ inwoners",
      businesses: "25k+ bedrijven"
    },
    {
      name: "Eindhoven",
      province: "Noord-Brabant",
      description: "Tech-hub van Nederland. Websites voor Eindhoven&apos;s high-tech industrie, startups en innovatieve bedrijven.",
      features: ["High-tech focus", "Brainport regio", "Innovatie-gericht", "Tech-startup ecosystem"],
      keywords: ["website laten maken Eindhoven", "tech website Eindhoven", "startup website"],
      population: "235k+ inwoners",
      businesses: "18k+ bedrijven"
    },
    {
      name: "Tilburg",
      province: "Noord-Brabant",
      description: "Sterke zakelijke gemeenschap in Tilburg. Websites voor industrie, logistiek en moderne dienstverlening.",
      features: ["Industriële expertise", "Logistieke sector", "MKB-gericht", "Pragmatische aanpak"],
      keywords: ["website bouwen Tilburg", "bedrijfswebsite Tilburg", "webdesign Noord-Brabant"],
      population: "220k+ inwoners",
      businesses: "15k+ bedrijven"
    },
    {
      name: "Groningen",
      province: "Groningen",
      description: "Noordelijke kwaliteit en innovatie. Websites voor Groningen&apos;s energie sector, universiteit en lokale bedrijven.",
      features: ["Energie sector", "Universitaire omgeving", "Noordelijke kwaliteit", "Duurzame focus"],
      keywords: ["website laten maken Groningen", "webdesign Noord-Nederland", "energie website"],
      population: "235k+ inwoners",
      businesses: "16k+ bedrijven"
    },
    {
      name: "Almere",
      province: "Flevoland",
      description: "Snelgroeiende stad met moderne bedrijven. Websites voor Almere&apos;s dynamische ondernemersklimaat.",
      features: ["Snelle groei", "Moderne bedrijven", "Jonge demografie", "Digitale innovatie"],
      keywords: ["website ontwikkeling Almere", "moderne website Almere", "webdesign Flevoland"],
      population: "215k+ inwoners",
      businesses: "12k+ bedrijven"
    }
  ];

  const provinces = [
    {
      name: "Randstad",
      description: "Het economische hart van Nederland. Websites voor bedrijven in de Randstad met focus op bereikbaarheid en schaalgroei.",
      cities: ["Amsterdam", "Rotterdam", "Den Haag", "Utrecht"],
      keywords: ["website laten maken Randstad", "webdesign Randstad", "zakelijke website"]
    },
    {
      name: "Noord-Holland",
      description: "Van Amsterdam tot de Wadden. Diverse websites voor toerisme, tech, en traditionele Noord-Hollandse bedrijven.",
      cities: ["Amsterdam", "Haarlem", "Alkmaar", "Hoorn"],
      keywords: ["website Noord-Holland", "webdesign provincie", "lokale website"]
    },
    {
      name: "Zuid-Holland", 
      description: "Haven, overheid en zakelijke dienstverlening. Robuuste websites voor Zuid-Holland&apos;s diverse economie.",
      cities: ["Rotterdam", "Den Haag", "Leiden", "Dordrecht"],
      keywords: ["website Zuid-Holland", "haven website", "overheid website"]
    }
  ];

  return (
    <section className="py-section px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 glow-text">
            Website laten maken door heel Nederland
          </h2>
          <p className="text-lg sm:text-xl text-slate-200 max-w-4xl mx-auto mb-8">
            Van Amsterdam tot Groningen, van Rotterdam tot Maastricht - wij bedienen Nederlandse 
            ondernemers door het hele land. Lokale kennis, landelijke kwaliteit.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-cyan-300">
            <span className="bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20">
              🇳🇱 Heel Nederland
            </span>
            <span className="bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20">
              🚀 Remote + On-site
            </span>
            <span className="bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20">
              💼 Alle sectoren
            </span>
          </div>
        </div>

        {/* Major Cities Grid */}
        <div className="mb-20">
          <h3 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
            Grote steden &amp; regio&apos;s
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {regions.map((region, index) => (
              <div 
                key={index}
                className="bg-neutral-800/40 border border-neutral-700 rounded-lg p-6 hover:border-cyan-400/30 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-white mb-1">{region.name}</h4>
                  <p className="text-sm text-cyan-300">{region.province}</p>
                  <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>{region.population}</span>
                    <span>{region.businesses}</span>
                  </div>
                </div>
                
                <p className="text-slate-200 text-sm mb-4 leading-relaxed">
                  {region.description}
                </p>
                
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-cyan-300 mb-2">Specialisaties:</h5>
                  <ul className="text-xs text-slate-200 space-y-1">
                    {region.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <span className="text-cyan-300 mr-2">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Keywords for SEO */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {region.keywords.slice(0, 2).map((keyword, keywordIndex) => (
                    <span 
                      key={keywordIndex}
                      className="text-xs px-2 py-1 bg-cyan-400/10 text-cyan-300 rounded border border-cyan-400/20"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
                
                <Link 
                  href="/contact"
                  className="block text-center py-2 px-4 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 border border-cyan-400/30 text-cyan-300 rounded hover:from-cyan-400/30 hover:to-purple-400/30 transition-all duration-300 text-sm font-medium"
                >
                  Start project in {region.name}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Provincial Coverage */}
        <div className="mb-16">
          <h3 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
            Provinciale dekking
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {provinces.map((province, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-neutral-800/40 to-neutral-900/40 border border-neutral-700 rounded-lg p-6 hover:border-cyan-400/30 transition-all duration-300"
              >
                <h4 className="text-xl font-bold text-white mb-3">{province.name}</h4>
                <p className="text-slate-200 mb-4 leading-relaxed">
                  {province.description}
                </p>
                
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-cyan-300 mb-2">Belangrijkste steden:</h5>
                  <div className="flex flex-wrap gap-2">
                    {province.cities.map((city, cityIndex) => (
                      <span 
                        key={cityIndex}
                        className="text-xs px-2 py-1 bg-purple-400/10 text-purple-300 rounded border border-purple-400/20"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {province.keywords.map((keyword, keywordIndex) => (
                    <span 
                      key={keywordIndex}
                      className="text-xs px-2 py-1 bg-cyan-400/10 text-cyan-300 rounded border border-cyan-400/20"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Local Benefits */}
        <div className="bg-gradient-to-r from-cyan-400/10 to-purple-400/10 border border-cyan-400/20 rounded-lg p-8 mb-16">
          <h3 className="text-2xl font-bold mb-6 text-center text-white">
            Waarom lokaal Nederland, wereldwijd denken?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-cyan-300 text-xl">🇳🇱</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Nederlandse kennis</h4>
              <p className="text-sm text-slate-200">Begrip van lokale markt, cultuur en zakelijke gewoonten</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-cyan-300 text-xl">⚡</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Snelle communicatie</h4>
              <p className="text-sm text-slate-200">Zelfde tijdzone, directe bereikbaarheid, snelle reacties</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-cyan-300 text-xl">🔒</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Nederlandse compliance</h4>
              <p className="text-sm text-slate-200">GDPR/AVG, BTW, Nederlandse wetgeving - alles geregeld</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-cyan-300 text-xl">🤝</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Persoonlijke service</h4>
              <p className="text-sm text-slate-200">Van video calls tot on-site meetings - wat u prefereert</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4 text-white">
            Klaar om uw website te laten maken?
          </h3>
          <p className="text-slate-200 mb-8 max-w-2xl mx-auto">
            Ongeacht waar in Nederland uw bedrijf gevestigd is, wij helpen u met een 
            professionele website die resultaat levert voor uw lokale of landelijke markt.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/contact"
              variant="primary"
            >
              Start uw project
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Button>
            
            <Button
              href="/diensten"
              variant="secondary"
            >
              Bekijk onze diensten
            </Button>
          </div>
        </div>
      </div>

      {/* Structured Data for Regional Coverage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            '@id': `${siteConfig.url}/regional-coverage`,
            name: 'Website laten maken door heel Nederland',
            description: 'Professionele website ontwikkeling voor bedrijven door heel Nederland. Van Amsterdam tot Groningen, lokale kennis met landelijke kwaliteit.',
            provider: {
              '@type': 'Organization',
              '@id': `${siteConfig.url}#organization`,
              name: siteConfig.name,
              url: siteConfig.url,
            },
            areaServed: regions.map(region => ({
              '@type': 'City',
              name: region.name,
              addressRegion: region.province,
              addressCountry: 'NL'
            })),
            serviceArea: [
              {
                '@type': 'Country',
                name: 'Netherlands',
                '@id': 'https://en.wikipedia.org/wiki/Netherlands'
              }
            ],
            inLanguage: 'nl-NL',
            serviceType: 'Website ontwikkeling en webdesign',
            keywords: regions.flatMap(region => region.keywords).join(', ')
          }),
        }}
      />
    </section>
  );
}