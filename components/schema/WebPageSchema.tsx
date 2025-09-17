import { Organization, WebPage, WithContext } from 'schema-dts';

interface WebPageSchemaProps {
  name: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  mainEntity?: any;
  breadcrumb?: any;
}

export function WebPageSchema({
  name,
  description,
  url,
  datePublished,
  dateModified,
  mainEntity,
  breadcrumb
}: WebPageSchemaProps) {
  const schema: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    datePublished: datePublished || new Date().toISOString(),
    dateModified: dateModified || new Date().toISOString(),
    publisher: {
      '@type': 'Organization',
      name: 'ProWeb Studio',
      url: 'https://prowebstudio.nl',
      logo: {
        '@type': 'ImageObject',
        url: 'https://prowebstudio.nl/logo.png',
        width: '250',
        height: '60'
      },
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'NL',
        addressLocality: 'Amsterdam'
      }
    },
    inLanguage: 'nl-NL',
    ...(mainEntity && { mainEntity }),
    ...(breadcrumb && { breadcrumb })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
