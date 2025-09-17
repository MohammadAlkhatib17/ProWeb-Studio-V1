import { Metadata } from 'next';
import { generateMetaTags } from '@/lib/seo-config';
import { StructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  ...generateMetaTags('home'),
  other: {
    'geo.region': 'NL-NH',
    'geo.placename': 'Amsterdam',
    'geo.position': '52.3702;4.8952',
    'ICBM': '52.3702, 4.8952',
  },
};

export default function HomePage() {
  const breadcrumbs = [
    { name: 'Home', url: 'https://prowebstudio.nl' },
  ];

  // Assuming we have testimonials with ratings
  const aggregateRating = {
    value: 4.8,
    count: 47,
  };

  return (
    <>
      <StructuredData type="breadcrumb" breadcrumbs={breadcrumbs} />
      <StructuredData type="rating" rating={aggregateRating} />
      
      {/* ...existing code... */}
      
      {/* Add speakable attributes to important content */}
      <section className="hero">
        <h1 className="hero-headline" data-speakable>
          Professional Web Development Solutions in the Netherlands
        </h1>
        <p className="lead-text" data-speakable>
          We create modern, fast, and scalable websites that drive business growth
        </p>
        {/* ...existing code... */}
      </section>
    </>
  );
}