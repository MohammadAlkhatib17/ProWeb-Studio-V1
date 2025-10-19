# Local SEO Components - Dutch Market

This directory contains components specifically designed for local SEO optimization in the Dutch market. All components are built with NAP (Name, Address, Phone) consistency in mind and include Dutch language support.

## Components

### 1. DutchBusinessInfo
Displays consistent NAP information across the site for local SEO.

**Features:**
- Multiple display variants (full, compact, inline)
- KVK (Kamer van Koophandel) and VAT/BTW number display
- Address, opening hours, and contact information
- Fully accessible with semantic HTML
- Mobile-responsive design

**Usage:**
```tsx
import { DutchBusinessInfo } from '@/components/local-seo';

// Full variant with all information
<DutchBusinessInfo 
  variant="full"
  showAddress={true}
  showOpeningHours={true}
  showContact={true}
  showRegistration={true}
/>

// Compact variant for sidebars/footers
<DutchBusinessInfo 
  variant="compact"
  className="max-w-sm"
/>

// Inline variant for minimal display
<DutchBusinessInfo variant="inline" />
```

**Size:** ~3 KB gzipped

### 2. CitySelector
Interactive city/location selector for navigation and local SEO.

**Features:**
- Three display variants (dropdown, grid, compact)
- Search functionality with province support
- Popular cities highlighting
- Mobile-friendly responsive design
- Keyboard accessible

**Usage:**
```tsx
import { CitySelector } from '@/components/local-seo';
import type { City } from '@/components/local-seo';

const cities: City[] = [
  {
    name: 'Amsterdam',
    slug: 'amsterdam',
    province: 'Noord-Holland',
    popular: true,
  },
  // ... more cities
];

// Grid view (all cities visible)
<CitySelector
  cities={cities}
  variant="grid"
  highlightPopular={true}
  currentCity="amsterdam"
/>

// Dropdown with search
<CitySelector
  cities={cities}
  variant="dropdown"
  label="Kies uw locatie"
  onCitySelect={(city) => console.log(city)}
/>

// Compact for mobile
<CitySelector
  cities={cities}
  variant="compact"
/>
```

**Size:** ~2.5 KB gzipped

### 3. LocalBusinessJSON
Provides LocalBusiness JSON-LD structured data with NAP consistency.

**Features:**
- Centralized NAP data matching visual components
- Schema.org compliant LocalBusiness markup
- Support for location-specific overrides
- Service area/areaServed support
- Geo coordinates for maps integration

**Usage:**
```tsx
import { LocalBusinessJSON, NAP_DATA } from '@/components/local-seo';

// Default business schema
<LocalBusinessJSON />

// Location-specific override
<LocalBusinessJSON
  address={{
    addressLocality: 'Rotterdam',
    addressRegion: 'Zuid-Holland',
  }}
  geo={{
    latitude: '51.9225',
    longitude: '4.47917',
  }}
  areaServed={['Rotterdam', 'Den Haag', 'Dordrecht']}
/>

// Access centralized NAP data
console.log(NAP_DATA.phone); // For use in other components
```

**Size:** ~1.5 KB gzipped

## NAP Consistency

**CRITICAL:** All business information (Name, Address, Phone) must be consistent across:
1. Visual display (DutchBusinessInfo component)
2. Structured data (LocalBusinessJSON component)
3. Any other locations where business info appears

The NAP data is centralized in `LocalBusinessJSON.tsx`:

```typescript
export const NAP_DATA = {
  name: 'ProWeb Studio',
  phone: '+31686412430',
  email: 'contact@prowebstudio.nl',
  address: {
    streetAddress: 'Voorbeeldstraat 123',
    postalCode: '1234 AB',
    addressLocality: 'Amsterdam',
    // ...
  },
  // ...
};
```

**To update business information:**
1. Update `NAP_DATA` in `LocalBusinessJSON.tsx`
2. Update `BUSINESS_INFO` in `DutchBusinessInfo.tsx`
3. Ensure both sources match exactly

## Integration Examples

### Services Page
```tsx
import { DutchBusinessInfo, LocalBusinessJSON } from '@/components/local-seo';
import { locations } from '@/config/internal-linking.config';

export default function ServicesPage() {
  return (
    <>
      {/* Visual display */}
      <section>
        <DutchBusinessInfo variant="full" />
      </section>

      {/* Structured data */}
      <LocalBusinessJSON 
        areaServed={locations.map(loc => loc.name)}
      />
    </>
  );
}
```

### Location Pages
```tsx
import { DutchBusinessInfo, LocalBusinessJSON, CitySelector } from '@/components/local-seo';

export default function LocationPage({ location }) {
  return (
    <>
      {/* City selector */}
      <CitySelector
        cities={allCities}
        currentCity={location.slug}
        variant="grid"
      />

      {/* Business info */}
      <DutchBusinessInfo variant="full" />

      {/* Location-specific schema */}
      <LocalBusinessJSON
        address={{
          addressLocality: location.name,
          addressRegion: location.region,
        }}
        areaServed={[location.name, ...nearbyLocations]}
      />
    </>
  );
}
```

## Performance

Total added JavaScript: **~7 KB gzipped**
- DutchBusinessInfo: ~3 KB
- CitySelector: ~2.5 KB
- LocalBusinessJSON: ~1.5 KB

All components are:
- Tree-shakeable
- No external dependencies
- Server-side rendered where possible
- Optimized for Core Web Vitals

## Validation

### Testing LocalBusiness Schema
1. Use Google's Rich Results Test: https://search.google.com/test/rich-results
2. Use Schema.org Validator: https://validator.schema.org/
3. Check structured data in Google Search Console

### Testing NAP Consistency
1. Search for all instances of business name, phone, address on site
2. Verify they match exactly (including formatting)
3. Check JSON-LD matches visual display
4. Validate across all location pages

## Environment Variables

Optional environment variables for business data:
```env
NEXT_PUBLIC_KVK=12345678          # KVK number
NEXT_PUBLIC_BTW=NL123456789B01    # VAT/BTW number
```

If not set, placeholder text will be displayed.

## Dutch Language Notes

All text is in Dutch (Nederlands) for the Dutch market:
- "Openingstijden" = Opening hours
- "Adres" = Address
- "Contact" = Contact
- "Kies uw locatie" = Choose your location
- "Bedrijfsinformatie" = Business information
- "KVK" = Kamer van Koophandel (Chamber of Commerce)
- "BTW" = Belasting Toegevoegde Waarde (VAT)

## Accessibility

All components follow WCAG 2.1 AA standards:
- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Sufficient color contrast

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive enhancement for older browsers
- No JavaScript fallbacks where applicable
