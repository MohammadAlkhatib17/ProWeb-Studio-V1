# CMS Content Generation System

Comprehensive content generation system for Dutch city-service pages with type-safe schemas, fixtures, and pure helper functions.

## 📁 Directory Structure

```
cms/
├── schema/              # Zod schemas & TypeScript types
│   ├── city.schema.ts           # City entity schema
│   ├── service.schema.ts        # Service entity schema
│   ├── city-service.schema.ts   # CityService relationship schema
│   └── index.ts                 # Central schema exports
└── fixtures/            # Test/dev data with helper functions
    ├── cities.ts                # 5 major Dutch cities
    ├── services.ts              # 3 core services
    ├── city-services.ts         # 15 city×service combinations
    └── index.ts                 # Central fixture exports

site/src/lib/content/    # Content generation helpers
├── dutch-format.ts              # nl-NL formatting utilities
├── generators.ts                # Content section generators
├── composers.ts                 # Full page composition
└── index.ts                     # Central library exports
```

## 🎯 Features

### ✅ Type-Safe Schemas
- **Zod validation** with runtime type checking
- **TypeScript types** inferred from schemas
- **Dutch locale** validation (nl-NL)

### ✅ Comprehensive Fixtures
- **5 Dutch cities**: Amsterdam, Rotterdam, Utrecht, Eindhoven, Den Haag
- **3 core services**: Website Laten Maken, Webshop Laten Maken, SEO Optimalisatie
- **15 combinations**: Full city×service matrix with local customizations

### ✅ Content Generation
- **350+ words** minimum per page
- **≥70% uniqueness** target through template variations
- **Dutch language** (nl-NL) throughout
- **Local context** with city-specific examples, FAQs, testimonials

### ✅ Formatting Utilities
- Currency formatting (EUR)
- Number formatting (Dutch notation)
- Date formatting (Dutch locale)
- Phone, postal code, duration formatters

## 🚀 Quick Start

### Import Content Helpers

```typescript
import {
  composeCityServicePage,
  getAllCityServiceCombinations,
  getFeaturedCityServices,
  formatCurrency,
  formatNumber,
} from '@/lib/content';
```

### Generate Complete Page Content

```typescript
// Generate full page content for Amsterdam × Website Laten Maken
const page = composeCityServicePage('amsterdam', 'website-laten-maken');

if (page) {
  console.log(page.content);  // Full Dutch content (350+ words)
  console.log(page.metadata.wordCount);  // e.g., 487
  console.log(page.metadata.isValid);  // true if meets requirements
}
```

### Get All Available Combinations

```typescript
// Get all 15 city-service combinations
const combinations = getAllCityServiceCombinations();

combinations.forEach(combo => {
  console.log(`${combo.cityName} × ${combo.serviceName}`);
  // Amsterdam × Website Laten Maken
  // Amsterdam × Webshop Laten Maken
  // ... (15 total)
});
```

### Get Featured Combinations

```typescript
// Get top 6 featured combinations
const featured = getFeaturedCityServices(6);

// These are prioritized for homepage, landing pages
featured.forEach(combo => {
  console.log(`${combo.cityName} - ${combo.serviceName}`);
});
```

### Format Dutch Currency & Numbers

```typescript
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/content';

formatCurrency(1234.56);        // "€ 1.234,56"
formatCurrency(2500, false);    // "€ 2.500"
formatNumber(1234567.89);       // "1.234.567,89"
formatPercentage(0.15);         // "15%"
formatPercentage(0.875, 1);     // "87,5%"
```

## 📊 Data Structure

### City Schema

```typescript
{
  id: string;                        // UUID
  name: string;                      // "Amsterdam"
  slug: string;                      // "amsterdam"
  region: string;                    // "Randstad"
  province: string;                  // "Noord-Holland"
  description: string;               // Full description (100-500 chars)
  shortDescription: string;          // Brief intro (50-200 chars)
  metaDescription: string;           // SEO meta (120-160 chars)
  
  coordinates?: {                    // GPS position
    lat: number;
    lng: number;
  };
  
  stats: {                           // Local statistics
    population: number;
    businesses?: number;
    avgIncome?: number;
    internetPenetration?: number;
  };
  
  neighborhoods?: string[];          // ["Jordaan", "De Pijp", ...]
  landmarks?: string[];              // ["Dam Square", "Rijksmuseum", ...]
  localCharacteristics?: string[];   // For content generation
  targetIndustries?: string[];       // Key industries in city
  
  keywords: string[];                // SEO keywords (3-20)
  featured: boolean;                 // Highlight on homepage
  isActive: boolean;                 // Currently available
}
```

### Service Schema

```typescript
{
  id: string;                        // UUID
  name: string;                      // "Website Laten Maken"
  slug: string;                      // "website-laten-maken"
  description: string;               // Full description
  shortDescription: string;          // Brief intro
  
  pricingTiers: [{                   // Pricing packages
    name: string;                    // "Basis", "Professioneel", "Premium"
    price: number;                   // EUR amount
    features: string[];              // Included features
    popular: boolean;                // Highlight as recommended
    deliveryTime: string;            // "2-3 weken"
  }];
  
  processSteps: [{                   // Service delivery process
    title: string;
    description: string;
    step: number;
    duration?: string;
  }];
  
  faqs: [{                           // Service FAQs
    question: string;
    answer: string;
  }];
  
  features: string[];                // Key features
  benefits: string[];                // Client benefits
  keywords: string[];                // SEO keywords
}
```

### CityService Schema

```typescript
{
  id: string;                        // UUID
  cityId: string;                    // Reference to city
  citySlug: string;                  // "amsterdam"
  serviceId: string;                 // Reference to service
  serviceSlug: string;               // "website-laten-maken"
  
  // Content overrides
  titleOverride?: string;            // Custom title
  descriptionOverride?: string;      // Custom description
  metaDescriptionOverride?: string;  // Custom SEO meta
  
  // Local content
  localBenefits?: string[];          // City-specific benefits
  localExamples?: string[];          // Local project examples
  localFaqs?: FAQItem[];             // City-specific FAQs
  
  // Social proof
  testimonials?: [{                  // Local testimonials
    author: string;
    company?: string;
    text: string;
    rating: number;                  // 1-5
    location?: string;               // Neighborhood/area
  }];
  
  caseStudies?: [{                   // Local case studies
    title: string;
    client: string;
    industry: string;
    challenge: string;
    solution: string;
    results: string[];
  }];
  
  projectCount?: number;             // Projects completed in city
  
  // Market insights
  marketInsights?: {
    competitionLevel: 'low' | 'medium' | 'high';
    averageProjectValue?: number;
    popularServices?: string[];
    localTrends?: string[];
  };
  
  // Availability
  isAvailable: boolean;              // Service available in city
  waitingList: boolean;              // Accepting new clients
  priority: number;                  // Display priority (0-100)
  featured: boolean;                 // Feature this combination
}
```

## 🔧 Content Generation API

### `generateCityServiceContent(city, service, cityService?)`

Generates complete page content (350+ words) with all sections.

**Returns:**
- Introduction paragraph
- "Why choose local" section
- Process overview
- Pricing section
- Benefits list
- Local examples
- FAQs
- Testimonials (if available)
- Market insights (if available)
- Call-to-action

### `composeCityServicePage(citySlug, serviceSlug)`

Combines city, service, and cityService data into complete page with metadata.

**Returns:**
```typescript
{
  content: string;                   // Full page content in Markdown
  metadata: {
    city: City;                      // Full city data
    service: Service;                // Full service data
    cityService?: CityService;       // Override data (if exists)
    wordCount: number;               // Total words
    isValid: boolean;                // Meets requirements
    validationErrors: string[];      // Any validation issues
  };
}
```

### `getCityServiceSEO(citySlug, serviceSlug)`

Generates SEO metadata for page.

**Returns:**
```typescript
{
  title: string;                     // Page title (uses override if available)
  description: string;               // Meta description
  keywords: string[];                // Combined keywords
  canonical: string;                 // Canonical URL
}
```

### `getCityServiceStructuredData(citySlug, serviceSlug)`

Generates Schema.org JSON-LD structured data.

**Returns:**
```typescript
{
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: string,
  description: string,
  provider: { ... },                 // Organization info
  areaServed: { ... },               // City info
  offers: { ... },                   // Pricing info
  aggregateRating?: { ... },         // Rating (if testimonials exist)
}
```

## 📈 Quality Metrics

### Content Requirements
- ✅ Minimum 350 words per page
- ✅ ≥70% uniqueness through template variations
- ✅ Dutch (nl-NL) language throughout
- ✅ Local context and examples
- ✅ SEO-optimized structure

### Validation

```typescript
import { validateContent, validateAllCityServiceContent } from '@/lib/content';

// Validate single page content
const validation = validateContent(content);
console.log(validation.isValid);      // true/false
console.log(validation.wordCount);    // e.g., 487
console.log(validation.errors);       // ["Content too short", ...]

// Validate all 15 combinations
const summary = validateAllCityServiceContent();
console.log(summary.total);           // 15
console.log(summary.valid);           // e.g., 15
console.log(summary.invalid);         // e.g., 0
```

## 🧪 Testing Helpers

All functions are pure (no side effects) and easily testable:

```typescript
import { generateIntroduction, formatCurrency } from '@/lib/content';

// Test formatting
expect(formatCurrency(1500)).toBe('€ 1.500');

// Test content generation
const intro = generateIntroduction(mockCity, mockService);
expect(intro).toContain(mockCity.name);
expect(intro.length).toBeGreaterThan(100);
```

## 🌐 Usage in Next.js Pages

### Dynamic Route: `/diensten/[service]/[city]`

```typescript
// app/diensten/[service]/[city]/page.tsx
import { composeCityServicePage, getCityServiceSEO } from '@/lib/content';

export async function generateMetadata({ params }) {
  const seo = getCityServiceSEO(params.city, params.service);
  
  return {
    title: seo?.title,
    description: seo?.description,
    keywords: seo?.keywords,
  };
}

export default function CityServicePage({ params }) {
  const page = composeCityServicePage(params.city, params.service);
  
  if (!page) {
    notFound();
  }
  
  return (
    <article>
      <h1>{page.metadata.service.name} in {page.metadata.city.name}</h1>
      <div dangerouslySetInnerHTML={{ __html: marked(page.content) }} />
    </article>
  );
}
```

### Static Generation

```typescript
// Generate all 15 pages at build time
export async function generateStaticParams() {
  const combinations = getAllCityServiceCombinations();
  
  return combinations.map(combo => ({
    service: combo.serviceSlug,
    city: combo.citySlug,
  }));
}
```

## 📝 Fixtures Overview

### Cities (5)
1. **Amsterdam** - Capital, international focus, high competition
2. **Rotterdam** - Port city, modern architecture, pragmatic culture
3. **Utrecht** - Central, historical, student population
4. **Eindhoven** - Tech hub, innovative startups, design focus
5. **Den Haag** - Government, international organizations, formal

### Services (3)
1. **Website Laten Maken** - €1,750 - €5,500 (3 tiers)
2. **Webshop Laten Maken** - €3,500 - €12,500 (3 tiers)
3. **SEO Optimalisatie** - €750/m - €2,500/m (3 tiers)

### Combinations (15)
All 5 cities × 3 services with city-specific:
- Benefits
- Examples
- FAQs
- Market insights
- Project counts (32-94 per combination)

## 🔐 Type Safety

All fixtures are type-checked against Zod schemas:

```typescript
import { CitySchema, ServiceSchema, CityServiceSchema } from '@/cms/schema';

// Runtime validation
const validCity = CitySchema.parse(cityData);        // Throws if invalid
const safeCity = CitySchema.safeParse(cityData);     // Returns result object

// TypeScript inference
type City = z.infer<typeof CitySchema>;
```

## 📚 Additional Resources

- **Schema Definitions**: `/cms/schema/`
- **Fixture Data**: `/cms/fixtures/`
- **Content Helpers**: `/site/src/lib/content/`
- **Type Exports**: All available via `/cms/schema/index.ts`

## 🎨 Customization

### Add New City

```typescript
// cms/fixtures/cities.ts
const newCity: Omit<City, 'createdAt' | 'updatedAt'> = {
  id: 'new-uuid',
  name: 'Groningen',
  slug: 'groningen',
  // ... full city data
};

export const cityFixtures = [...existingCities, newCity];
```

### Add New Service

```typescript
// cms/fixtures/services.ts
const newService: Omit<Service, 'createdAt' | 'updatedAt'> = {
  id: 'new-uuid',
  name: 'App Development',
  slug: 'app-development',
  // ... full service data
};

export const serviceFixtures = [...existingServices, newService];
```

### Add City-Service Override

```typescript
// cms/fixtures/city-services.ts
const newOverride: Omit<CityService, 'createdAt' | 'updatedAt'> = {
  id: 'new-uuid',
  cityId: 'groningen-id',
  citySlug: 'groningen',
  serviceId: 'app-dev-id',
  serviceSlug: 'app-development',
  localBenefits: [...],
  // ... customizations
};

export const cityServiceFixtures = [...existing, newOverride];
```

## 🚦 Status

✅ **Complete**
- Zod schemas for City, Service, CityService
- 5 city fixtures with comprehensive Dutch data
- 3 service fixtures with pricing and FAQs
- 15 city-service combinations with local customizations
- Dutch formatting utilities (currency, numbers, dates)
- Content generation functions (350+ words per page)
- Content composition helpers
- SEO metadata generators
- Structured data generators
- Validation utilities

⏳ **Future Enhancements**
- Additional cities (Groningen, Maastricht, Tilburg, Breda, etc.)
- More services (Logo Design, Hosting, Maintenance, etc.)
- Multi-language support (English, German)
- A/B testing variations
- Content performance analytics

---

**Built with:** TypeScript, Zod, Next.js 14  
**Locale:** nl-NL (Dutch)  
**License:** Internal use only
