'use client';

import Head from 'next/head';
import { dutchProvinces } from '@/lib/seo-config';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  province?: string;
  canonicalUrl?: string;
}

export function SEOHead({ 
  title, 
  description, 
  keywords,
  province,
  canonicalUrl 
}: SEOHeadProps) {
  // Ensure title is under 60 chars
  const optimizedTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
  
  // Ensure description is 155-160 chars
  let optimizedDescription = description;
  if (description.length < 155) {
    optimizedDescription = description + ' Neem contact op!';
  } else if (description.length > 160) {
    optimizedDescription = description.substring(0, 157) + '...';
  }
  
  return (
    <Head>
      <title>{optimizedTitle}</title>
      <meta name="description" content={optimizedDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={optimizedTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="nl_NL" />
      
      {/* Geo-targeting for provinces */}
      {province && dutchProvinces.includes(province) && (
        <>
          <meta name="geo.region" content={`NL-${province}`} />
          <meta name="geo.placename" content={province} />
        </>
      )}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Language and region */}
      <meta httpEquiv="content-language" content="nl-NL" />
      <meta name="language" content="Dutch" />
      <meta name="distribution" content="Netherlands" />
    </Head>
  );
}
