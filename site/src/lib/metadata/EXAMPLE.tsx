/**
 * Example: Using the centralized metadata system
 * 
 * This file demonstrates how to use the new metadata system
 * for a services detail page.
 */

import type { Metadata } from 'next';
import { generateMetadata, SITE_URL } from '@/lib/metadata';
import { PageStructuredData } from '@/components/metadata';
import { 
  generateServiceSchema, 
  generateFAQSchema,
} from '@/lib/metadata';

// Generate metadata using the centralized system
export const metadata: Metadata = generateMetadata({
  title: 'Website Laten Maken | Professionele Websites op Maat',
  description: 'Laat uw professionele website maken door ervaren developers. Van eenvoudige bedrijfswebsites tot complexe web applicaties. Nederlandse kwaliteit, transparante prijzen.',
  keywords: [
    'website laten maken',
    'professionele website',
    'website op maat',
    'bedrijfswebsite',
    'website ontwikkeling',
  ],
  path: '/diensten/website-laten-maken',
  ogImage: {
    url: '/assets/services/website-development-og.png',
    alt: 'Website Laten Maken - ProWeb Studio',
  },
});

export default function WebsiteLatenMakenPage() {
  // Page-specific structured data
  const breadcrumbs = [
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Diensten', url: `${SITE_URL}/diensten` },
    { name: 'Website Laten Maken', url: `${SITE_URL}/diensten/website-laten-maken` },
  ];

  const serviceSchema = generateServiceSchema({
    name: 'Website Laten Maken',
    description: 'Professionele website ontwikkeling op maat voor Nederlandse bedrijven',
    url: `${SITE_URL}/diensten/website-laten-maken`,
    serviceType: 'Web Development',
    offers: [
      {
        name: 'Basis Website Pakket',
        price: '2500',
        priceCurrency: 'EUR',
      },
      {
        name: 'Professioneel Website Pakket',
        price: '5000',
        priceCurrency: 'EUR',
      },
      {
        name: 'Enterprise Website Pakket',
        price: '10000',
        priceCurrency: 'EUR',
      },
    ],
  });

  const faqSchema = generateFAQSchema([
    {
      question: 'Hoeveel kost het om een website te laten maken?',
      answer: 'De kosten voor het laten maken van een website variëren tussen €2.500 en €10.000, afhankelijk van de complexiteit, functionaliteiten en design wensen.',
    },
    {
      question: 'Hoe lang duurt het ontwikkelen van een website?',
      answer: 'Een basis website is binnen 4-6 weken klaar. Meer complexe websites met maatwerk functionaliteiten kunnen 8-12 weken in beslag nemen.',
    },
    {
      question: 'Krijg ik ook ondersteuning na de oplevering?',
      answer: 'Ja, wij bieden doorlopend onderhoud, support en updates. U krijgt ook training om zelf content aan te passen.',
    },
    {
      question: 'Is mijn website ook geschikt voor mobiele apparaten?',
      answer: 'Absoluut! Alle websites die wij maken zijn fully responsive en geoptimaliseerd voor desktop, tablet en mobiel.',
    },
    {
      question: 'Wordt mijn website ook gevonden in Google?',
      answer: 'Ja, alle websites worden SEO-geoptimaliseerd opgeleverd met technische SEO, snelle laadtijden en gestructureerde data voor betere vindbaarheid.',
    },
  ]);

  return (
    <main className="pt-20 md:pt-24">
      {/* Inject structured data */}
      <PageStructuredData
        pageType="services"
        title={metadata.title as string}
        description={metadata.description as string}
        url={`${SITE_URL}/diensten/website-laten-maken`}
        breadcrumbs={breadcrumbs}
        additionalSchemas={[
          serviceSchema,
          faqSchema,
        ]}
      />

      {/* Page content */}
      <section className="py-section px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Website Laten Maken
          </h1>
          <p className="text-xl text-slate-200 mb-8">
            Professionele websites op maat voor Nederlandse bedrijven
          </p>

          {/* Your page content here */}
        </div>
      </section>
    </main>
  );
}
