# Centralized Metadata System

This directory contains the centralized metadata system for the Dutch-first ProWeb Studio website.

## Features

✅ **Dutch-first defaults** - All titles, descriptions, and keywords optimized for the Dutch market
✅ **Centralized metadata generation** - Single source of truth for all page metadata
✅ **JSON-LD structured data helpers** - Easy generation of Schema.org markup
✅ **Hreflang support** - Proper language and regional targeting
✅ **Type-safe** - Full TypeScript support

## Structure

```
src/lib/metadata/
├── defaults.ts          # Dutch metadata defaults and constants
├── generator.ts         # Metadata generation utilities
├── structured-data.ts   # JSON-LD schema helpers
└── index.ts            # Main exports
```

## Usage

### Basic Page Metadata

Use predefined page metadata for common pages:

```tsx
// app/page.tsx
import { generatePageMetadata } from '@/lib/metadata';

export const metadata = generatePageMetadata('home');
```

Available page keys:
- `'home'` - Homepage with full Dutch SEO
- `'services'` - Services/Diensten page
- `'contact'` - Contact page
- `'werkwijze'` - Process/Werkwijze page
- `'over-ons'` - About page
- `'portfolio'` - Portfolio page
- `'speeltuin'` - Playground/Demo page
- `'privacy'` - Privacy policy
- `'voorwaarden'` - Terms and conditions

### Custom Metadata

For pages that need custom metadata:

```tsx
import { generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata({
  title: 'Custom Page Title',
  description: 'Custom description in Dutch',
  keywords: ['custom', 'keywords'],
  path: '/custom-page',
  ogImage: {
    url: '/images/custom-og.png',
    width: 1200,
    height: 630,
    alt: 'Custom OG image',
  },
});
```

### Structured Data (JSON-LD)

Add structured data to any page:

```tsx
import { PageStructuredData } from '@/components/metadata';
import { generateFAQSchema } from '@/lib/metadata';

export default function MyPage() {
  const faqs = [
    {
      question: 'Wat kost een website?',
      answer: 'De kosten variëren afhankelijk van...',
    },
  ];

  return (
    <main>
      <PageStructuredData
        pageType="generic"
        title="My Page Title"
        description="My page description"
        url="https://prowebstudio.nl/my-page"
        breadcrumbs={[
          { name: 'Home', url: 'https://prowebstudio.nl/' },
          { name: 'My Page', url: 'https://prowebstudio.nl/my-page' },
        ]}
        additionalSchemas={[
          generateFAQSchema(faqs),
        ]}
      />
      
      {/* Your page content */}
    </main>
  );
}
```

### Available Structured Data Helpers

```tsx
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateWebPageSchema,
  generateBreadcrumbSchema,
  generateServiceSchema,
  generateFAQSchema,
  generateLocalBusinessSchema,
  generateServiceListSchema,
} from '@/lib/metadata';

// Organization schema (company info)
const orgSchema = generateOrganizationSchema();

// Service schema
const serviceSchema = generateServiceSchema({
  name: 'Website laten maken',
  description: 'Professionele websites...',
  url: 'https://prowebstudio.nl/diensten',
  serviceType: 'Web Development',
  offers: [
    {
      name: 'Basis pakket',
      price: '2500',
      priceCurrency: 'EUR',
    },
  ],
});

// FAQ schema
const faqSchema = generateFAQSchema([
  {
    question: 'Hoe lang duurt het ontwikkelen van een website?',
    answer: 'Gemiddeld 4-6 weken voor een complete website.',
  },
]);

// Service list schema
const serviceListSchema = generateServiceListSchema([
  {
    name: 'Website ontwikkeling',
    description: 'Professionele websites op maat',
    url: 'https://prowebstudio.nl/diensten/website-laten-maken',
  },
  {
    name: 'Webshop laten maken',
    description: 'E-commerce oplossingen',
    url: 'https://prowebstudio.nl/diensten/webshop-laten-maken',
  },
]);
```

## Dutch Defaults

All metadata includes Dutch-optimized defaults:

- **Locale**: `nl_NL` for Open Graph
- **Language**: `nl` for HTML lang attribute
- **Hreflang**: `nl-NL` for language targeting
- **Country**: `NL` (Netherlands)
- **Region**: Amsterdam/Netherlands

## Hreflang Links

The root layout (`app/layout.tsx`) includes hreflang links:

```tsx
<html lang="nl">
  <head>
    <link rel="alternate" hrefLang="nl" href={`${SITE_URL}/`} />
    <link rel="alternate" hrefLang="nl-NL" href={`${SITE_URL}/`} />
    <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}/`} />
    {/* ... */}
  </head>
</html>
```

## Performance

- No runtime overhead for metadata generation
- Structured data is rendered server-side
- Minimal bundle size increase (< 15 KB gzipped)
- No new dependencies required

## Validation

Validate structured data with:

1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Schema.org Validator**: https://validator.schema.org/
3. **Structured Data Testing Tool**: https://search.google.com/structured-data/testing-tool

## Examples

See these files for complete examples:

- `app/page.tsx` - Homepage with full structured data
- `app/diensten/page.tsx` - Services page with service list schema
- `app/layout.tsx` - Root layout with Dutch lang attribute and hreflang

## Migration Guide

To migrate existing pages:

1. Replace static metadata exports:
   ```tsx
   // Before
   export const metadata = {
     title: 'My Page',
     description: 'Description',
   };

   // After
   import { generateMetadata } from '@/lib/metadata';
   
   export const metadata = generateMetadata({
     title: 'My Page',
     description: 'Description',
     path: '/my-page',
   });
   ```

2. Replace manual JSON-LD scripts:
   ```tsx
   // Before
   <script
     type="application/ld+json"
     dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
   />

   // After
   import { PageStructuredData } from '@/components/metadata';
   
   <PageStructuredData
     pageType="generic"
     title="My Page"
     description="Description"
     url="https://prowebstudio.nl/my-page"
   />
   ```

## Benefits

1. **Consistency** - All pages use the same Dutch metadata defaults
2. **DRY** - No duplicate metadata definitions
3. **Type Safety** - TypeScript ensures correct structure
4. **SEO Optimized** - All metadata follows Dutch SEO best practices
5. **Easy to Maintain** - Update defaults in one place
6. **Performance** - Server-side rendering, no client-side overhead
7. **Validation** - Structured data follows Schema.org standards

## Notes

- All metadata is in Dutch by default
- Open Graph locale is set to `nl_NL`
- Hreflang targets `nl-NL` (primary) and `nl` (fallback)
- Keywords are merged with default Dutch keywords
- Robots.txt is already handled by `app/robots.ts`
- Sitemap is already handled by `app/sitemap.ts`
