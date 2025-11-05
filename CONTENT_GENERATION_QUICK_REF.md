# CMS Content Generation - Quick Reference

## 📚 Import Everything

```typescript
import {
  // Core composers
  composeCityServicePage,
  getAllCityServiceCombinations,
  getFeaturedCityServices,
  
  // SEO & metadata
  getCityServiceSEO,
  getCityServiceStructuredData,
  getCityServiceBreadcrumbs,
  
  // Formatters
  formatCurrency,
  formatNumber,
  formatDate,
  formatPercentage,
  
  // Validation
  validateContent,
  validateAllCityServiceContent,
  
  // Data access
  getCityBySlug,
  getServiceBySlug,
  
  // Types
  City,
  Service,
  CityService,
} from '@/lib/content';
```

## 🚀 Common Use Cases

### 1. Generate Full Page
```typescript
const page = composeCityServicePage('amsterdam', 'website-laten-maken');

if (page) {
  console.log(page.content);  // Full Dutch content (350+ words)
  console.log(page.metadata.wordCount);  // 487
  console.log(page.metadata.isValid);  // true
}
```

### 2. Get SEO Metadata for Next.js
```typescript
// app/diensten/[service]/[city]/page.tsx
export async function generateMetadata({ params }) {
  const seo = getCityServiceSEO(params.city, params.service);
  
  return {
    title: seo?.title,
    description: seo?.description,
    keywords: seo?.keywords,
  };
}
```

### 3. Add Structured Data (JSON-LD)
```typescript
const structuredData = getCityServiceStructuredData('rotterdam', 'webshop-laten-maken');

// In your page:
<script type="application/ld+json">
  {JSON.stringify(structuredData)}
</script>
```

### 4. Generate All Static Paths
```typescript
export async function generateStaticParams() {
  const combinations = getAllCityServiceCombinations();
  
  return combinations.map(combo => ({
    service: combo.serviceSlug,
    city: combo.citySlug,
  }));
}
```

### 5. Format Dutch Currency & Numbers
```typescript
formatCurrency(1234.56);        // "€ 1.234,56"
formatCurrency(2500, false);    // "€ 2.500"
formatNumber(1234567.89);       // "1.234.567,89"
formatPercentage(0.15);         // "15%"
```

## 📊 Available Data

### Cities (5)
- `amsterdam` - Amsterdam
- `rotterdam` - Rotterdam
- `utrecht` - Utrecht
- `eindhoven` - Eindhoven
- `den-haag` - Den Haag

### Services (3)
- `website-laten-maken` - Website Laten Maken (€1,750 - €5,500)
- `webshop-laten-maken` - Webshop Laten Maken (€3,500 - €12,500)
- `seo-optimalisatie` - SEO Optimalisatie (€750/m - €2,500/m)

### Combinations (15)
All 5 cities × 3 services with unique local content

## 🔧 Content Structure

Each page includes:
1. **Introduction** - Local context paragraph
2. **Why Local** - Benefits of choosing local service
3. **Process** - Service delivery steps
4. **Pricing** - Transparent pricing with tiers
5. **Benefits** - Service advantages
6. **Local Examples** - Case studies
7. **FAQs** - City-specific questions
8. **Testimonials** - Customer reviews (if available)
9. **Market Insights** - Local market analysis (if available)
10. **CTA** - Call to action

## ✅ Quality Checks

### Validate Single Page
```typescript
const page = composeCityServicePage('utrecht', 'seo-optimalisatie');

if (page) {
  const { isValid, wordCount, validationErrors } = page.metadata;
  
  if (!isValid) {
    console.error('Validation failed:', validationErrors);
  }
}
```

### Validate All Pages
```typescript
const validation = validateAllCityServiceContent();

console.log(`Valid: ${validation.valid}/${validation.total}`);

if (validation.invalid > 0) {
  validation.details
    .filter(d => !d.isValid)
    .forEach(d => console.log(`${d.citySlug}/${d.serviceSlug}: ${d.errors}`));
}
```

## 🎨 Formatting Reference

| Function | Input | Output |
|----------|-------|--------|
| `formatCurrency(1234.56)` | 1234.56 | "€ 1.234,56" |
| `formatCurrency(2500, false)` | 2500 | "€ 2.500" |
| `formatNumber(1234567)` | 1234567 | "1.234.567" |
| `formatPercentage(0.15)` | 0.15 | "15%" |
| `formatPercentage(0.875, 1)` | 0.875 | "87,5%" |
| `formatDate(new Date())` | Date | "19 oktober 2024" |

## 📍 URLs & Routes

Pattern: `/diensten/{service}/{city}`

Examples:
- `/diensten/website-laten-maken/amsterdam`
- `/diensten/webshop-laten-maken/rotterdam`
- `/diensten/seo-optimalisatie/utrecht`

## 💡 Pro Tips

1. **Cache generated content** - Content is deterministic, safe to cache
2. **Pre-generate at build time** - Use `generateStaticParams()` in Next.js
3. **Add structured data** - Improves SEO and rich snippets
4. **Use breadcrumbs** - Better navigation and SEO
5. **Validate in CI/CD** - Run `validateAllCityServiceContent()` in tests

## 🐛 Troubleshooting

### Page returns `null`
```typescript
// Check if city and service exist
const city = getCityBySlug('amsterdam');
const service = getServiceBySlug('website-laten-maken');

if (!city) console.error('City not found');
if (!service) console.error('Service not found');
```

### Word count too low
```typescript
// Check validation errors
const page = composeCityServicePage('city', 'service');
console.log(page?.metadata.validationErrors);
```

### Type errors
```typescript
// Import types explicitly
import type { City, Service, CityService } from '@/lib/content';

const city: City = getCityBySlug('amsterdam')!;
```

## 📚 More Info

- Full documentation: `site/src/lib/content/README.md`
- Usage examples: `site/src/lib/content/examples.ts`
- Run examples: `npx tsx site/src/lib/content/examples.ts`

---

**Built with**: TypeScript + Zod + Next.js 14  
**Locale**: nl-NL (Dutch)  
**Status**: ✅ Production Ready
