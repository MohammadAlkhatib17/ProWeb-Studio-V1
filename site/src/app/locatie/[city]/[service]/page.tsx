import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { dutchCities, getCityBySlug, generateLocalKeywords, localBusinessData } from '@/config/local-seo.config';
import { NAPDisplay, ContactInfo } from '@/components/local-seo/NAPDisplay';
import LocalBusinessSchema from '@/components/local-seo/LocalBusinessSchema';

interface CityServicePageProps {
  params: {
    city: string;
    service: string;
  };
}

// Define valid services
const validServices = ['webdesign', 'webontwikkeling', 'ecommerce', 'seo'];

const serviceData = {
  webdesign: {
    title: 'Webdesign',
    description: 'Professioneel webdesign met moderne UI/UX en responsive layouts',
    features: ['Responsive Design', 'Modern UI/UX', 'Brand Identity', 'Gebruiksvriendelijkheid'],
    process: ['Design Research', 'Wireframing', 'Visual Design', 'Prototyping', 'User Testing']
  },
  webontwikkeling: {
    title: 'Webontwikkeling',
    description: 'Custom website ontwikkeling met de nieuwste technologieën',
    features: ['React/Next.js', 'TypeScript', 'API Integratie', 'Database Design'],
    process: ['Requirements Analysis', 'Architecture Planning', 'Development', 'Testing', 'Deployment']
  },
  ecommerce: {
    title: 'E-commerce',
    description: 'Complete webshop oplossingen die verkopen en converteren',
    features: ['Nederlandse Betaalmethoden', 'Voorraadbeheersysteem', 'Order Management', 'Analytics'],
    process: ['Business Analysis', 'Platform Selectie', 'Custom Development', 'Payment Integration', 'Launch']
  },
  seo: {
    title: 'SEO Services',
    description: 'Lokale en nationale zoekmachine optimalisatie voor betere vindbaarheidtegen',
    features: ['Keyword Research', 'On-page SEO', 'Technical SEO', 'Local SEO'],
    process: ['SEO Audit', 'Keyword Strategy', 'Content Optimization', 'Link Building', 'Monitoring']
  }
};

// Generate static params for major cities and services
export async function generateStaticParams() {
  const majorCities = dutchCities
    .sort((a, b) => b.population - a.population)
    .slice(0, 10); // Top 10 cities by population

  const params = [];
  for (const city of majorCities) {
    for (const service of validServices) {
      params.push({
        city: city.slug,
        service: service,
      });
    }
  }
  return params;
}

// Generate metadata for each city service page
export async function generateMetadata({ params }: CityServicePageProps): Promise<Metadata> {
  const city = getCityBySlug(params.city);
  const service = serviceData[params.service as keyof typeof serviceData];
  
  if (!city || !service) {
    return {
      title: 'Pagina niet gevonden',
      description: 'De opgegeven pagina werd niet gevonden.'
    };
  }

  const baseKeywords = [params.service, 'website laten maken', 'professioneel', 'lokaal'];
  const localKeywords = generateLocalKeywords(city, baseKeywords);
  
  const title = `${service.title} ${city.name} | Professionele ${service.title} Services | ProWeb Studio`;
  const description = `${service.description} in ${city.name}, ${city.province}. ✓ Lokale expertise ✓ Nederlandse kwaliteit ✓ Transparante prijzen. Vraag direct offerte!`;

  return {
    title,
    description,
    keywords: localKeywords,
    openGraph: {
      title,
      description,
      url: `https://prowebstudio.nl/locatie/${city.slug}/${params.service}`,
      siteName: 'ProWeb Studio',
      locale: 'nl_NL',
      type: 'website'
    },
    other: {
      'geo.region': `NL-${city.province}`,
      'geo.placename': city.name,
      'geo.position': `${city.coordinates.lat};${city.coordinates.lng}`,
      'ICBM': `${city.coordinates.lat}, ${city.coordinates.lng}`
    },
    alternates: {
      canonical: `https://prowebstudio.nl/locatie/${city.slug}/${params.service}`
    }
  };
}

export default function CityServicePage({ params }: CityServicePageProps) {
  const city = getCityBySlug(params.city);
  const service = serviceData[params.service as keyof typeof serviceData];
  
  if (!city || !service || !validServices.includes(params.service)) {
    notFound();
  }

  return (
    <>
      <LocalBusinessSchema city={city} />
      
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Breadcrumb */}
        <nav className="py-4 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <ol className="flex items-center space-x-2 text-sm">
              <li><a href="/" className="text-blue-600 dark:text-blue-400 hover:underline">Home</a></li>
              <span className="text-gray-400">/</span>
              <li><a href="/locaties" className="text-blue-600 dark:text-blue-400 hover:underline">Locaties</a></li>
              <span className="text-gray-400">/</span>
              <li><a href={`/locatie/${city.slug}`} className="text-blue-600 dark:text-blue-400 hover:underline">{city.name}</a></li>
              <span className="text-gray-400">/</span>
              <li className="text-gray-600 dark:text-gray-400">{service.title}</li>
            </ol>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                {service.title} in{' '}
                <span className="text-blue-600 dark:text-blue-400">{city.name}</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto">
                {service.description} voor bedrijven in {city.name} en de regio {city.localInfo.region}.
                Lokale expertise, Nederlandse kwaliteit.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <ContactInfo variant="horizontal" />
              </div>
            </div>
          </div>
        </section>

        {/* Service Features */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Waarom Kiezen voor {service.title} in {city.name}?
                </h2>
                
                <div className="space-y-4 mb-8">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mt-1">
                        <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{feature}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                          Professionele implementatie van {feature.toLowerCase()} voor uw project in {city.name}.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                    Lokale Voordelen in {city.name}
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                    <li>• Persoonlijke service in {city.localInfo.region}</li>
                    <li>• Kennis van lokale markt in {city.province}</li>
                    <li>• Snelle communicatie (bel {city.localInfo.dialCode})</li>
                    <li>• Nederlandse business practices en compliance</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Ons {service.title} Proces
                </h3>
                
                <div className="space-y-6">
                  {service.process.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{step}</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          Stap {index + 1} in ons bewezen {service.title.toLowerCase()} proces voor bedrijven in {city.name}.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Contact & Locatie
                  </h4>
                  <NAPDisplay variant="compact" />
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Service gebied: {city.name}, {city.localInfo.region}, {city.province}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Services */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Andere Diensten in {city.name}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {validServices
                .filter(s => s !== params.service)
                .map((serviceKey) => {
                  const relatedService = serviceData[serviceKey as keyof typeof serviceData];
                  return (
                    <a
                      key={serviceKey}
                      href={`/locatie/${city.slug}/${serviceKey}`}
                      className="group bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3">
                        {relatedService.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        {relatedService.description}
                      </p>
                      <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                        Meer informatie →
                      </div>
                    </a>
                  );
                })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600 dark:bg-blue-800">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Start Uw {service.title} Project in {city.name}
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Vraag vandaag nog een vrijblijvende offerte aan voor {service.title.toLowerCase()} diensten 
              in {city.name} en omgeving.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={`mailto:${localBusinessData.email}?subject=${service.title} aanvraag ${city.name}`}
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
                Direct Bellen
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}