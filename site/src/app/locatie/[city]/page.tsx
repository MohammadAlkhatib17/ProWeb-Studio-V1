import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { dutchCities, getCityBySlug, generateLocalKeywords, localBusinessData } from '@/config/local-seo.config';
import { 
  NAPDisplay, 
  ContactInfo, 
  LocalBusinessSchema, 
  CitySelector, 
  NearMeSearch 
} from '@/components/local-seo';

interface CityPageProps {
  params: {
    city: string;
  };
}

// Generate static params for all cities
export async function generateStaticParams() {
  return dutchCities.map((city) => ({
    city: city.slug,
  }));
}

// Generate metadata for each city page
export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const city = getCityBySlug(params.city);
  
  if (!city) {
    return {
      title: 'Stad niet gevonden',
      description: 'De opgegeven stad werd niet gevonden.'
    };
  }

  const baseKeywords = ['website laten maken', 'webdesign', 'webontwikkeling', 'wordpress', 'e-commerce'];
  const localKeywords = generateLocalKeywords(city, baseKeywords);
  
  const title = `Website Laten Maken ${city.name} | ProWeb Studio`;
  const description = `Professionele website laten maken in ${city.name}? ✓ Snelle 3D-websites ✓ SEO geoptimaliseerd ✓ Responsive design ✓ Lokale service ${city.province}. Vraag direct offerte!`;

  return {
    title,
    description,
    keywords: localKeywords,
    openGraph: {
      title,
      description,
      url: `https://prowebstudio.nl/locatie/${city.slug}`,
      siteName: 'ProWeb Studio',
      locale: 'nl_NL',
      type: 'website',
      images: [
        {
          url: `/og-images/city-${city.slug}.jpg`,
          width: 1200,
          height: 630,
          alt: `Website laten maken in ${city.name} - ProWeb Studio`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/og-images/city-${city.slug}.jpg`]
    },
    other: {
      'geo.region': `NL-${city.province}`,
      'geo.placename': city.name,
      'geo.position': `${city.coordinates.lat};${city.coordinates.lng}`,
      'ICBM': `${city.coordinates.lat}, ${city.coordinates.lng}`,
      'DC.title': title
    },
    alternates: {
      canonical: `https://prowebstudio.nl/locatie/${city.slug}`
    }
  };
}

export default function CityPage({ params }: CityPageProps) {
  const city = getCityBySlug(params.city);
  
  if (!city) {
    notFound();
  }

  const servicesData = [
    {
      title: 'Website Ontwikkeling',
      description: `Professionele websites ontwikkeld door lokale experts in ${city.name}`,
      features: ['Responsive Design', 'SEO Geoptimaliseerd', '3D Elementen', 'Snelle Laadtijden']
    },
    {
      title: 'E-commerce Oplossingen',
      description: `Webshops die verkopen voor bedrijven in ${city.name} en omgeving`,
      features: ['Nederlandse Betaalmethoden', 'Voorraadbeheersysteem', 'Mobiel Geoptimaliseerd', 'Analytics Integratie']
    },
    {
      title: 'SEO & Marketing',
      description: `Lokale zoekmachine optimalisatie voor bedrijven in ${city.localInfo.region}`,
      features: ['Lokale SEO', 'Google My Business', 'Content Marketing', 'Performance Tracking']
    }
  ];

  return (
    <>
      <LocalBusinessSchema city={city} />
      
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Website Laten Maken in{' '}
                <span className="text-blue-600 dark:text-blue-400">{city.name}</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto">
                Professionele 3D-websites die scoren in Google en converteren. 
                Lokale service in {city.name}, {city.province}. 
                Van concept tot lancering, wij zorgen voor uw online succes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <ContactInfo variant="horizontal" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Lokale Service
                </div>
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  3D Websites
                </div>
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  SEO Geoptimaliseerd
                </div>
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Nederlandse Kwaliteit
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Webdesign Services in {city.name}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Wij bieden complete webdiensten voor bedrijven in {city.name} en de regio {city.localInfo.region}. 
                Van startups tot gevestigde ondernemingen, wij hebben de expertise om uw online doelen te realiseren.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {servicesData.map((service, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Local Information Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Waarom Kiezen voor ProWeb Studio in {city.name}?
                </h2>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Lokale Expertise
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Wij kennen de markt in {city.name} en {city.province}. 
                        Onze lokale expertise helpt uw website beter presteren in lokale zoekopdrachten.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Bewezen Resultaten
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Onze websites scoren gemiddeld 95+ op Google PageSpeed Insights en 
                        zorgen voor meetbare groei in conversies voor onze klanten.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Persoonlijke Service
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        Directe communicatie, transparante prijzen en een persoonlijke aanpak. 
                        Wij zijn bereikbaar voor bedrijven in heel {city.localInfo.region}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Contact & Locatie
                </h3>
                
                <NAPDisplay variant="full" showHours={true} />
                
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Service Gebied
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Wij bedienen de gehele regio {city.localInfo.region} inclusief:
                  </p>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <span>{city.name}</span> • <span>Online dienstverlening</span> • <span>Nederland</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Near Me and City Selector */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Ook Service in Andere Steden
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Wij bedienen klanten door heel Nederland met dezelfde kwaliteit en service.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <NearMeSearch currentCity={city} />
              <CitySelector currentCity={city} />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600 dark:bg-blue-800">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Klaar voor een Nieuwe Website in {city.name}?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Vraag vandaag nog een vrijblijvende offerte aan en ontdek hoe wij 
              uw online aanwezigheid kunnen transformeren.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={`mailto:${localBusinessData.email}?subject=Offerte aanvraag website ${city.name}`}
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Vraag Offerte Aan
              </a>
              
              <a 
                href={`tel:${localBusinessData.phone}`}
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                {localBusinessData.phone}
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}