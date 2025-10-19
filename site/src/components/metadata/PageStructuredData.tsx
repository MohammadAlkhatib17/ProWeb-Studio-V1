/**
 * PageStructuredData Component
 * Generates and injects complete structured data for a page
 */

import { headers } from 'next/headers';
import { StructuredData } from './StructuredData';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateWebPageSchema,
  generateBreadcrumbSchema,
  generateLocalBusinessSchema,
} from '@/lib/metadata';

interface PageStructuredDataProps {
  pageType: 'home' | 'services' | 'contact' | 'about' | 'generic';
  title: string;
  description: string;
  url: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  additionalSchemas?: Array<Record<string, unknown>>;
}

export function PageStructuredData({
  pageType,
  title,
  description,
  url,
  breadcrumbs = [],
  additionalSchemas = [],
}: PageStructuredDataProps) {
  const headersList = headers();
  const nonce = headersList.get('x-nonce') || '';

  // Build schema array
  const schemas: Array<Record<string, unknown>> = [
    generateOrganizationSchema(),
    generateWebSiteSchema(),
    generateWebPageSchema({ title, description, url, breadcrumbs }),
  ];

  // Add breadcrumbs if available
  if (breadcrumbs.length > 0) {
    schemas.push(generateBreadcrumbSchema(breadcrumbs));
  }

  // Add LocalBusiness for home and contact pages
  if (pageType === 'home' || pageType === 'contact') {
    schemas.push(generateLocalBusinessSchema());
  }

  // Add any additional schemas
  schemas.push(...additionalSchemas);

  return <StructuredData data={schemas} nonce={nonce} id={`page-structured-data-${pageType}`} />;
}
