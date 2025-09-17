'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { generateCanonicalUrl, generateHreflangLinks, SITE_URL } from '@/utils/urlUtils';

interface MetaTagsProps {
  title: string;
  description: string;
  image?: string;
  noindex?: boolean;
  article?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

export function MetaTags({
  title,
  description,
  image = '/og-default.jpg',
  noindex = false,
  article = false,
  publishedTime,
  modifiedTime
}: MetaTagsProps) {
  const pathname = usePathname();
  const canonicalUrl = generateCanonicalUrl(pathname);
  const hreflangLinks = generateHreflangLinks(pathname);
  const absoluteImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Canonical URL - Always Absolute */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang Tags for Multilingual Support */}
      {hreflangLinks.map((link) => (
        <link
          key={link.lang}
          rel="alternate"
          hrefLang={link.lang}
          href={link.url}
        />
      ))}
      
      {/* Open Graph Tags */}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:site_name" content="ProWeb Studio" />
      <meta property="og:locale" content="nl_NL" />
      <meta property="og:locale:alternate" content="en_US" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
      
      {/* Article specific tags */}
      {article && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {article && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, follow" />}
    </Head>
  );
}
