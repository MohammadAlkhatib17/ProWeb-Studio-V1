import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { servicePages } from '@/lib/internal-links';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedServices } from '@/components/RelatedServices';
import { RelatedCaseStudies } from '@/components/RelatedCaseStudies';
import { ContextualLinks } from '@/components/ContextualLinks';
import Link from 'next/link';

interface ServicePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const service = servicePages.find(s => s.href === `/services/${params.slug}`);
  
  if (!service) return {};
  
  return {
    title: service.title,
    description: service.description,
  };
}

export async function generateStaticParams() {
  return servicePages.map(service => ({
    slug: service.href.replace('/services/', ''),
  }));
}

export default function ServicePage({ params }: ServicePageProps) {
  const servicePath = `/services/${params.slug}`;
  const service = servicePages.find(s => s.href === servicePath);
  
  if (!service) {
    notFound();
  }
  
  return (
    <>
      <Breadcrumbs />
      
      <section className="py-20">
        <div className="container">
          <h1 className="text-4xl font-bold mb-6">{service.label}</h1>
          <p className="text-xl text-gray-600 mb-8">{service.description}</p>
          
          {/* Main content with contextual links */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                <h2>Waarom {service.label}?</h2>
                <p>
                  Bij ProWeb Studio specialiseren we ons in {service.label.toLowerCase()}.
                  Onze expertise stelt ons in staat om oplossingen te leveren die perfect 
                  aansluiten bij uw bedrijfsdoelen. Of u nu een kleine onderneming bent of 
                  een groot bedrijf, wij hebben de kennis en ervaring om uw project tot een 
                  succes te maken.
                </p>
                
                <h2>Onze Aanpak</h2>
                <p>
                  We geloven in een persoonlijke aanpak waarbij we nauw samenwerken met onze 
                  klanten. Van het eerste gesprek tot de oplevering en daarna, we zijn er om 
                  u te ondersteunen. Bekijk onze{' '}
                  <Link href="/portfolio" className="text-primary hover:underline">
                    portfolio
                  </Link>{' '}
                  voor voorbeelden van ons werk, of{' '}
                  <Link href="/contact" className="text-primary hover:underline">
                    neem contact op
                  </Link>{' '}
                  voor een vrijblijvend gesprek.
                </p>
                
                <h2>Veelgestelde Vragen</h2>
                <p>
                  Heeft u vragen over {service.label.toLowerCase()}? Bekijk onze{' '}
                  <Link href="/blog/website-kosten-2024" className="text-primary hover:underline">
                    blog over website kosten
                  </Link>{' '}
                  of lees meer over{' '}
                  <Link href="/services/seo-optimization" className="text-primary hover:underline">
                    SEO optimalisatie
                  </Link>{' '}
                  om uw website beter vindbaar te maken.
                </p>
              </div>
              
              {/* CTA Section */}
              <div className="mt-12 p-8 bg-primary text-white rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Klaar om te starten?</h2>
                <p className="mb-6">
                  Laat uw {service.label.toLowerCase()} project werkelijkheid worden. 
                  Vraag vandaag nog een gratis offerte aan.
                </p>
                <Link
                  href="/contact"
                  className="inline-block px-6 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Vraag Offerte Aan
                </Link>
              </div>
            </div>
            
            {/* Sidebar with contextual links */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <ContextualLinks
                  keywords={service.keywords || []}
                  currentPath={servicePath}
                />
                
                {/* Quick links to other services */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Andere Diensten</h3>
                  <ul className="space-y-2">
                    {servicePages
                      .filter(s => s.href !== servicePath)
                      .slice(0, 5)
                      .map(s => (
                        <li key={s.href}>
                          <Link
                            href={s.href}
                            className="text-sm text-gray-600 hover:text-primary transition-colors"
                          >
                            → {s.label}
                          </Link>
                        </li>
                      ))}
                  </ul>
                  <Link
                    href="/services"
                    className="inline-block mt-4 text-sm text-primary hover:underline"
                  >
                    Alle diensten bekijken
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
      
      {/* Related case studies section */}
      <RelatedCaseStudies currentService={servicePath} />
      
      {/* Related services section */}
      <RelatedServices currentService={servicePath} />
    </>
  );
}
