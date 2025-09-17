import { Metadata } from 'next';
import { StructuredData } from '@/components/StructuredData';
import { generateMetaTags } from '@/lib/seo-config';
import { generateServiceSchema } from '@/lib/schema';

export const metadata: Metadata = {
  ...generateMetaTags('services'),
};

export default function ServicesPage() {
  const breadcrumbs = [
    { name: 'Home', url: 'https://prowebstudio.nl' },
    { name: 'Services', url: 'https://prowebstudio.nl/services' },
  ];

  const services = [
    {
      name: 'Custom Website Development',
      description: 'Professional website development with Next.js and modern technologies',
      serviceType: 'WebDevelopment',
      areaServed: ['Amsterdam', 'Rotterdam', 'Den Haag', 'Utrecht'],
    },
    {
      name: 'E-commerce Solutions',
      description: 'Complete e-commerce platforms with payment integration',
      serviceType: 'E-commerce',
      areaServed: ['Amsterdam', 'Rotterdam', 'Den Haag', 'Utrecht', 'Eindhoven'],
    },
  ];

  return (
    <>
      <StructuredData type="breadcrumb" breadcrumbs={breadcrumbs} />
      {services.map((service, index) => (
        <StructuredData 
          key={index}
          type="custom" 
          data={generateServiceSchema(service)} 
        />
      ))}
      
      <div className="container">
        <h1 data-speakable>Our Services</h1>
        <div className="service-description" data-speakable>
          Professional web development services across the Netherlands
        </div>
        {/* ...existing code... */}
      </div>
    </>
  );
}