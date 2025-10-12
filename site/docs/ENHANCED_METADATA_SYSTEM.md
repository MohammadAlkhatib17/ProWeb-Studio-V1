# Enhanced Metadata System Documentation

This enhanced metadata system provides comprehensive SEO optimization for your Next.js application with Dutch market focus.

## Overview

The enhanced metadata system includes:

1. **Dynamic Title Templates** - Location and service-based title generation
2. **Structured Snippet Optimization** - Rich snippets for better SERP appearance
3. **Dutch Social Media Optimization** - Open Graph and Twitter Cards
4. **Canonical URL Management** - Proper URL canonicalization
5. **Pagination Meta Tags** - prev/next pagination support
6. **Content Freshness Signals** - article:modified_time and publishing dates
7. **Optimized Meta Descriptions** - 150-160 characters with Dutch CTAs

## Core Files

- `/lib/metadata/index.ts` - Main metadata generation functions
- `/lib/metadata/structured-data.ts` - Structured data generation utilities
- `/components/StructuredData.tsx` - React components for JSON-LD injection
- `/components/metadata/MetaTags.tsx` - Additional meta tag components

## Usage Examples

### 1. Homepage Metadata

```tsx
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata("/", {
  title:
    "Website Laten Maken Nederland | Webdesign & Webshop Ontwikkeling – ProWeb Studio",
  description:
    "Website laten maken door Nederlandse webdesign experts. Professionele websites, webshops en 3D ervaringen voor MKB, startups en enterprise. Transparante prijzen, Nederlandse kwaliteit!",
  pageType: "homepage",
  lastModified: new Date().toISOString(),
  image: {
    url: "/og-homepage.png",
    alt: "ProWeb Studio - Professionele Website Laten Maken Nederland",
    width: 1200,
    height: 630,
  },
});
```

### 2. Location-Based Pages

```tsx
import { generateMetadata, type LocationKey } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: { location: string };
}): Promise<Metadata> {
  const locationKey = params.location as LocationKey;

  return generateMetadata(`/locaties/${params.location}`, {
    location: locationKey,
    pageType: "location",
    lastModified: new Date().toISOString(),
    image: {
      url: `/og-location-${params.location}.png`,
      alt: `Website laten maken ${params.location} - ProWeb Studio`,
      width: 1200,
      height: 630,
    },
  });
}
```

### 3. Service Pages

```tsx
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata(
  "/diensten/website-laten-maken",
  {
    service: "website-laten-maken",
    pageType: "service",
    lastModified: new Date().toISOString(),
    image: {
      url: "/og-website-laten-maken.png",
      alt: "Website Laten Maken Nederland - ProWeb Studio Webdesign Services",
      width: 1200,
      height: 630,
    },
  },
);
```

### 4. Pagination Pages

```tsx
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata("/portfolio", {
  pageType: "portfolio",
  pagination: {
    current: 2,
    total: 10,
    prevUrl: "/portfolio?page=1",
    nextUrl: "/portfolio?page=3",
  },
  lastModified: new Date().toISOString(),
});
```

### 5. Article/Blog Pages

```tsx
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata("/blog/seo-tips-2024", {
  title: "SEO Tips 2024: Hoger Scoren in Google Nederland",
  description:
    "Ontdek de beste SEO strategieën voor 2024. Praktische tips om hoger te scoren in Google en meer Nederlandse bezoekers te krijgen. Lees onze complete gids!",
  pageType: "article",
  lastModified: "2024-01-15T10:00:00.000Z",
  image: {
    url: "/blog/seo-tips-2024-cover.jpg",
    alt: "SEO Tips 2024 Nederland - ProWeb Studio",
    width: 1200,
    height: 630,
  },
});
```

## Structured Data Components

### Organization Data

```tsx
import { ProWebStudioOrganization } from "@/components/StructuredData";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <ProWebStudioOrganization nonce={nonce} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### FAQ Structured Data

```tsx
import { FAQStructuredData } from "@/components/StructuredData";

const faqs = [
  {
    question: "Hoeveel kost een website laten maken?",
    answer:
      "De kosten voor een website variëren van €2.500 voor een basispakket tot €15.000+ voor complexe projecten. Neem contact op voor een persoonlijke offerte.",
  },
  {
    question: "Hoe lang duurt website ontwikkeling?",
    answer:
      "Een gemiddelde website is binnen 4-6 weken gereed. Complexere projecten kunnen 8-12 weken duren. We houden u altijd op de hoogte van de voortgang.",
  },
];

export default function ServicePage() {
  return (
    <>
      <FAQStructuredData faqs={faqs} nonce={nonce} />
      {/* Your page content */}
    </>
  );
}
```

### Local Business Data

```tsx
import { LocationBusinessStructuredData } from "@/components/StructuredData";

const locationData = {
  name: "Amsterdam",
  coordinates: { lat: "52.3676", lng: "4.9041" },
  address: {
    streetAddress: "Herengracht 1",
    addressLocality: "Amsterdam",
    addressRegion: "Noord-Holland",
    postalCode: "1000 AA",
  },
};

export default function LocationPage() {
  return (
    <>
      <LocationBusinessStructuredData location={locationData} nonce={nonce} />
      {/* Your page content */}
    </>
  );
}
```

## Meta Tag Components

### Pagination Meta Tags

```tsx
import { PaginationMetaTags } from "@/components/metadata/MetaTags";

export default function PaginatedPage() {
  return (
    <>
      <PaginationMetaTags current={2} total={10} baseUrl="/portfolio" />
      {/* Your page content */}
    </>
  );
}
```

### Content Freshness Meta

```tsx
import { ContentFreshnessMeta } from "@/components/metadata/MetaTags";

export default function ArticlePage() {
  return (
    <>
      <ContentFreshnessMeta
        publishedTime="2024-01-01T12:00:00.000Z"
        modifiedTime={new Date().toISOString()}
      />
      {/* Your page content */}
    </>
  );
}
```

### Geographic Meta Tags

```tsx
import { GeographicMetaTags } from "@/components/metadata/MetaTags";

export default function LocationPage() {
  return (
    <>
      <GeographicMetaTags location="amsterdam" />
      {/* Your page content */}
    </>
  );
}
```

## Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SITE_URL=https://prowebstudio.nl
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_google_verification_code
NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION=your_facebook_verification_code
```

## Best Practices

### Meta Descriptions

- Keep between 150-160 characters
- Include strong Dutch CTAs
- Focus on user benefits
- Include target keywords naturally

### Title Tags

- Use dynamic templates with location/service variables
- Keep under 60 characters
- Include brand name consistently
- Front-load important keywords

### Images

- Always include alt text in Dutch
- Use consistent image dimensions (1200x630 for OG)
- Optimize file sizes for performance
- Include location/service-specific imagery

### Structured Data

- Include FAQ data on service pages
- Add LocalBusiness data for location pages
- Use Organization data on all pages
- Include breadcrumb navigation data

## Available Locations

The system includes pre-configured data for:

- Amsterdam (coordinates: 52.3676, 4.9041)
- Rotterdam (coordinates: 51.9225, 4.4792)
- Den Haag (coordinates: 52.0705, 4.3007)
- Utrecht (coordinates: 52.0907, 5.1214)
- Eindhoven (coordinates: 51.4416, 5.4697)
- Groningen (coordinates: 53.2194, 6.5665)

## Available Services

Pre-configured service templates:

- `website-laten-maken` - General website development
- `webshop-laten-maken` - E-commerce development
- `seo-optimalisatie` - SEO services
- `3d-website-ervaringen` - 3D web experiences
- `onderhoud-support` - Website maintenance

## Page Types

Supported page types for structured data:

- `homepage` - Main landing page
- `service` - Service description pages
- `location` - Location-specific pages
- `portfolio` - Portfolio/work showcase
- `contact` - Contact information
- `about` - About/company info
- `article` - Blog posts/articles

## Customization

### Adding New Locations

```tsx
// In /lib/metadata/index.ts
export const locationMetadata = {
  // ... existing locations
  "new-city": {
    city: "New City",
    region: "Province",
    coordinates: { lat: "52.0000", lng: "4.0000" },
    description: "Website laten maken New City - Description",
    cta: "Strong CTA for New City. Contact us today!",
  },
};
```

### Adding New Services

```tsx
// In /lib/metadata/index.ts
export const serviceMetadata = {
  // ... existing services
  "new-service": {
    title: "New Service Title",
    description: "New service description",
    keywords: ["keyword1", "keyword2", "keyword3"],
    cta: "Compelling CTA for new service. Get started now!",
  },
};
```

This enhanced metadata system ensures your Dutch website ranks well in search engines, displays beautifully on social media, and provides rich search result snippets that drive more clicks and conversions.
