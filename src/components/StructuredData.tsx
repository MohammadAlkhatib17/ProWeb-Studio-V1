'use client';

import Script from 'next/script';
import { 
  generateLocalBusinessSchema, 
  generateBreadcrumbList, 
  generateAggregateRating,
  generateSpeakableSchema 
} from '@/lib/schema';

interface StructuredDataProps {
  type: 'organization' | 'breadcrumb' | 'rating' | 'speakable' | 'custom';
  data?: any;
  breadcrumbs?: Array<{ name: string; url: string }>;
  rating?: { value: number; count: number };
  speakableSelectors?: string[];
}

export function StructuredData({ 
  type, 
  data, 
  breadcrumbs, 
  rating,
  speakableSelectors 
}: StructuredDataProps) {
  let schema = {};

  switch (type) {
    case 'organization':
      schema = generateLocalBusinessSchema();
      break;
    case 'breadcrumb':
      if (breadcrumbs) {
        schema = generateBreadcrumbList(breadcrumbs);
      }
      break;
    case 'rating':
      if (rating) {
        schema = generateAggregateRating(rating.value, rating.count);
      }
      break;
    case 'speakable':
      schema = generateSpeakableSchema(speakableSelectors);
      break;
    case 'custom':
      schema = data || {};
      break;
  }

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      strategy="afterInteractive"
    />
  );
}
