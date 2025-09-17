import { Service, WithContext } from 'schema-dts';

interface PriceSpecification {
  minPrice: number;
  maxPrice?: number;
  currency: string;
  vatRate: number; // Dutch BTW rate (21%)
}

interface ServiceSchemaProps {
  name: string;
  description: string;
  provider: string;
  serviceType: string;
  areaServed: string[];
  priceRange?: PriceSpecification;
  offers?: Array<{
    name: string;
    price: number;
    description: string;
  }>;
}

export function ServiceSchema({
  name,
  description,
  provider,
  serviceType,
  areaServed,
  priceRange,
  offers
}: ServiceSchemaProps) {
  const schema: WithContext<Service> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType,
    provider: {
      '@type': 'Organization',
      name: provider
    },
    areaServed: areaServed.map(area => ({
      '@type': 'Country',
      name: area
    })),
    ...(priceRange && {
      priceRange: `€${priceRange.minPrice}${priceRange.maxPrice ? `-€${priceRange.maxPrice}` : '+'} incl. ${priceRange.vatRate}% BTW`,
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: priceRange.currency,
        lowPrice: priceRange.minPrice,
        ...(priceRange.maxPrice && { highPrice: priceRange.maxPrice }),
        // Dutch tax specification
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: priceRange.minPrice,
          priceCurrency: priceRange.currency,
          valueAddedTaxIncluded: true,
          valueAddedTaxRate: priceRange.vatRate
        }
      }
    }),
    ...(offers && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${name} Pakketten`,
        itemListElement: offers.map((offer, index) => ({
          '@type': 'Offer',
          position: index + 1,
          name: offer.name,
          description: offer.description,
          price: offer.price,
          priceCurrency: 'EUR',
          priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: offer.price,
            priceCurrency: 'EUR',
            valueAddedTaxIncluded: true,
            valueAddedTaxRate: 21,
            // Dutch notation
            description: `€${offer.price} incl. 21% BTW`
          }
        }))
      }
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
