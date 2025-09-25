import Script from 'next/script';

// Helper function to build absolute URLs safely
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.SITE_URL ??
  'https://prowebstudio.nl'
).replace(/\/+$/, '');

interface Service {
  name: string;
  description: string;
  serviceType?: string;
  knowsAbout?: string[];
  aggregateRating?: {
    ratingValue: string;
    reviewCount: string;
    bestRating?: string;
    worstRating?: string;
  };
  reviews?: Array<{
    author: string;
    datePublished: string;
    reviewBody: string;
    reviewRating: {
      ratingValue: string;
      bestRating?: string;
      worstRating?: string;
    };
  }>;
}

interface ServiceSchemaProps {
  services: Service[];
}

export default function ServiceSchema({ services }: ServiceSchemaProps) {
  const serviceSchemas = services.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "description": service.description,
    ...(service.serviceType && { "serviceType": service.serviceType }),
    "provider": {
      "@id": `${SITE_URL.replace(/\/$/, '')}#organization`
    },
    "areaServed": {
      "@type": "Place",
      "name": "Netherlands",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "NL"
      }
    },
    "inLanguage": "nl-NL",
    "knowsAbout": service.knowsAbout || [
      "website laten maken",
      "webdesign Nederland", 
      "professionele websites",
      "maatwerk webdevelopment",
      "responsive design",
      "SEO optimalisatie",
      "zoekmachine optimalisatie",
      "Nederlandse webdiensten"
    ],
    ...(service.aggregateRating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": service.aggregateRating.ratingValue,
        "reviewCount": service.aggregateRating.reviewCount,
        "bestRating": service.aggregateRating.bestRating || "5",
        "worstRating": service.aggregateRating.worstRating || "1"
      }
    }),
    ...(service.reviews && service.reviews.length > 0 && {
      "review": service.reviews.map(review => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": review.author
        },
        "datePublished": review.datePublished,
        "reviewBody": review.reviewBody,
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.reviewRating.ratingValue,
          "bestRating": review.reviewRating.bestRating || "5",
          "worstRating": review.reviewRating.worstRating || "1"
        }
      }))
    })
  }));

  return (
    <>
      {serviceSchemas.map((schema, index) => (
        <Script
          key={index}
          id={`service-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0)
          }}
        />
      ))}
    </>
  );
}