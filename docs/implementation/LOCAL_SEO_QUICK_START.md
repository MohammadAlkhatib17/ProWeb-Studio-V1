# Local SEO Quick Start Guide

## Setup (5 minutes)

### 1. Update Business Data (REQUIRED)

Edit both files with your actual business information:

#### File 1: `src/components/local-seo/LocalBusinessJSON.tsx`
```typescript
export const NAP_DATA = {
  name: 'ProWeb Studio',
  legalName: 'ProWeb Studio',
  kvk: process.env.NEXT_PUBLIC_KVK || undefined,  // ⚠️ SET THIS
  vat: process.env.NEXT_PUBLIC_BTW || undefined,  // ⚠️ SET THIS
  address: {
    streetAddress: 'Voorbeeldstraat 123',         // ⚠️ CHANGE THIS
    postalCode: '1234 AB',                         // ⚠️ CHANGE THIS
    addressLocality: 'Amsterdam',                  // ⚠️ CHANGE THIS
    addressRegion: 'Noord-Holland',
    addressCountry: 'NL',
  },
  phone: siteConfig.phone,  // ✅ Already set from config
  email: siteConfig.email,  // ✅ Already set from config
  geo: {
    latitude: '52.3676',   // ⚠️ CHANGE THIS
    longitude: '4.9041',   // ⚠️ CHANGE THIS
  },
  openingHours: ['Mo-Fr 09:00-17:00'],  // ⚠️ ADJUST IF NEEDED
};
```

#### File 2: `src/components/local-seo/DutchBusinessInfo.tsx`
```typescript
const BUSINESS_INFO = {
  name: 'ProWeb Studio',
  legalName: 'ProWeb Studio',
  kvk: process.env.NEXT_PUBLIC_KVK || 'KVK: [In aanvraag]',  // ⚠️ SET ENV VAR
  vat: process.env.NEXT_PUBLIC_BTW || 'BTW: NL[nummer]B01',  // ⚠️ SET ENV VAR
  address: {
    street: 'Voorbeeldstraat 123',      // ⚠️ MUST MATCH FILE 1
    postalCode: '1234 AB',              // ⚠️ MUST MATCH FILE 1
    city: 'Amsterdam',                  // ⚠️ MUST MATCH FILE 1
    country: 'Nederland',
  },
  phone: siteConfig.phone,    // ✅ Already set
  email: siteConfig.email,    // ✅ Already set
  openingHours: [
    { days: 'Maandag - Vrijdag', hours: '09:00 - 17:00' },  // ⚠️ ADJUST IF NEEDED
    { days: 'Weekend', hours: 'Op afspraak' },
  ],
};
```

### 2. Set Environment Variables

Add to your `.env.local`:
```bash
# Business Registration Numbers
NEXT_PUBLIC_KVK=12345678              # Your KVK number
NEXT_PUBLIC_BTW=NL123456789B01        # Your VAT/BTW number
```

### 3. Get Geo Coordinates

Find your business location coordinates:
1. Go to https://www.latlong.net/
2. Enter your address
3. Copy latitude and longitude
4. Update both NAP_DATA files

## Usage

### Services Page (Already Integrated ✅)
```tsx
// Already added to src/app/diensten/page.tsx
import { DutchBusinessInfo, LocalBusinessJSON } from '@/components/local-seo';

<DutchBusinessInfo variant="full" />
<LocalBusinessJSON areaServed={cities} />
```

### Location Pages (Already Integrated ✅)
```tsx
// Already added to src/app/locaties/[location]/page.tsx
import { DutchBusinessInfo, LocalBusinessJSON, CitySelector } from '@/components/local-seo';

<CitySelector cities={cities} variant="grid" currentCity={slug} />
<DutchBusinessInfo variant="full" />
<LocalBusinessJSON address={{ addressLocality: city }} />
```

### Add to Footer (Optional)
```tsx
// Edit src/components/Footer.tsx
import { DutchBusinessInfo } from '@/components/local-seo';

<footer>
  <DutchBusinessInfo variant="compact" />
</footer>
```

### Add to Contact Page (Optional)
```tsx
// Edit src/app/contact/page.tsx
import { DutchBusinessInfo } from '@/components/local-seo';

<DutchBusinessInfo variant="full" showRegistration={true} />
```

## Testing

### 1. Local Testing
```bash
# Start dev server
npm run dev

# Visit pages
# http://localhost:3000/diensten
# http://localhost:3000/locaties/amsterdam

# Check console for errors
```

### 2. Schema Validation
```bash
# Run validation script
./scripts/validate-local-seo.sh http://localhost:3000

# Or test specific URL with Google
# https://search.google.com/test/rich-results
```

### 3. Visual Testing
- [ ] Business info visible on services page
- [ ] City selector works on locations pages
- [ ] Contact information clickable (phone/email)
- [ ] Opening hours displayed correctly
- [ ] KVK/VAT numbers shown (if env vars set)
- [ ] Mobile responsive layout

### 4. Schema Testing
- [ ] View page source and search for `@type.*LocalBusiness`
- [ ] Verify NAP data in JSON-LD matches visual display
- [ ] Check all required schema fields present
- [ ] Test with Google Rich Results Test
- [ ] Validate with Schema.org validator

## Deployment Checklist

Before deploying to production:

- [ ] ✅ Updated NAP data in both files (matching exactly)
- [ ] ✅ Set NEXT_PUBLIC_KVK environment variable
- [ ] ✅ Set NEXT_PUBLIC_BTW environment variable
- [ ] ✅ Updated geo coordinates for main location
- [ ] ✅ Adjusted opening hours if needed
- [ ] ✅ Tested locally with validation script
- [ ] ✅ Validated schema with Google Rich Results Test
- [ ] ✅ Checked mobile responsiveness
- [ ] ✅ Verified no TypeScript errors (`npm run type-check`)
- [ ] ✅ Verified build succeeds (`npm run build`)

## Common Issues

### Schema Not Showing
- Check page source for JSON-LD script tag
- Ensure component is rendered (not in conditional that's false)
- Verify no JavaScript errors in console

### NAP Inconsistency
- Search codebase for old phone/address references
- Update both LocalBusinessJSON.tsx and DutchBusinessInfo.tsx
- Verify env variables are loaded correctly

### TypeScript Errors
- Run `npm run type-check` to see specific errors
- Ensure all imports use correct paths
- Check City type is imported where needed

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

## Monitoring

After deployment, monitor:
1. Google Search Console → Enhancements → LocalBusiness
2. Check for schema errors or warnings
3. Monitor organic search traffic to location pages
4. Track phone/email clicks from business info sections

## Support

Need help? Check:
- [Component README](../site/src/components/local-seo/README.md)
- [Implementation Summary](../LOCAL_SEO_IMPLEMENTATION.md)
- Google Search Console documentation
- Schema.org LocalBusiness documentation

## Quick Reference

**Total added JS:** ~7 KB gzipped  
**Components:** 3 (DutchBusinessInfo, CitySelector, LocalBusinessJSON)  
**Pages updated:** 3 (services, locations index, location detail)  
**Environment variables:** 2 (KVK, BTW)  
**Languages:** Dutch (Nederlands)  
**External dependencies:** 0  
**Schema type:** LocalBusiness  
**NAP sources:** 2 (must match exactly)
