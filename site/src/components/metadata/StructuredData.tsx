/**
 * StructuredData Component
 * Injects JSON-LD structured data into page <head>
 */

import Script from 'next/script';

interface StructuredDataProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
  nonce?: string;
}

export function StructuredData({ data, nonce }: StructuredDataProps) {
  // If data is an array, wrap in @graph
  const jsonLd = Array.isArray(data)
    ? {
        '@context': 'https://schema.org',
        '@graph': data,
      }
    : data;

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      strategy="afterInteractive"
      nonce={nonce}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  );
}
