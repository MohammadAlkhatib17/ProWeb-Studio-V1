# SEO Analysis: Sitemap & Robots Configuration

**Analysis Date:** September 18, 2025  
**Files Analyzed:** `src/app/robots.ts`, `src/app/sitemap.ts`

## Summary

✅ **SITE_URL Configuration:** Correctly configured with fallback hierarchy  
❌ **Route Coverage Issue:** Missing `/over-ons` route in sitemap  
✅ **Speeltuin Handling:** Properly excluded from sitemap (noindex page)  
✅ **Preview Protection:** Properly configured to disallow all routes on preview  
✅ **Canonical URLs:** Correctly generated for production domain  

## URL Configuration Analysis

### robots.ts Configuration
- **SITE_URL Source:** `process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl'`
- **Production Domain:** `https://prowebstudio.nl`
- **Preview Handling:** ✅ Correctly disallows all routes (`disallow: ['/']`) when `VERCEL_ENV === 'preview'`
- **Sitemap Reference:** ✅ Points to `${base}/sitemap.xml`

### Environment Configuration
- **Default Production URL:** `https://prowebstudio.nl`
- **Environment Variables:** Configured in `.env.example`

## Route Coverage Analysis

| Route | Status | Priority | Change Frequency | Last Modified | Source | Issue |
|-------|--------|----------|------------------|---------------|--------|-------|
| `/` | ✅ Included | 1.0 | weekly | File mtime or Current Date | `src/app/page.tsx` | None |
| `/diensten` | ✅ Included | 0.9 | monthly | File mtime or 2025-09-01 | `src/app/diensten/page.tsx` | None |
| `/over-ons` | ✅ **ADDED** | 0.8 | monthly | File mtime or 2025-09-01 | `src/app/over-ons/page.tsx` | **Fixed** |
| `/privacy` | ✅ Included | 0.3 | yearly | File mtime or 2025-05-25 | `src/app/privacy/page.tsx` | None |
| `/voorwaarden` | ✅ Included | 0.3 | yearly | File mtime or 2025-05-25 | `src/app/voorwaarden/page.tsx` | None |
| `/werkwijze` | ✅ Included | 0.8 | monthly | File mtime or 2025-08-15 | `src/app/werkwijze/page.tsx` | None |
| `/contact` | ✅ Included | 0.9 | monthly | File mtime or 2025-08-01 | `src/app/contact/page.tsx` | None |
| `/speeltuin` | ✅ **EXCLUDED** | - | - | - | - | **Properly excluded from sitemap** |

### Additional Service Routes
| Route | Status | Priority | Change Frequency | Last Modified | Source |
|-------|--------|----------|------------------|---------------|--------|
| `/diensten/website-laten-maken` | ✅ Included | 0.8 | monthly | File mtime or 2025-09-01 | `src/app/diensten/page.tsx` |
| `/diensten/3d-website-ontwikkeling` | ✅ Included | 0.8 | monthly | File mtime or 2025-09-01 | `src/app/diensten/page.tsx` |
| `/diensten/seo-optimalisatie` | ✅ Included | 0.8 | monthly | File mtime or 2025-09-01 | `src/app/diensten/page.tsx` |
| `/diensten/webshop-laten-maken` | ✅ Included | 0.8 | monthly | File mtime or 2025-09-01 | `src/app/diensten/page.tsx` |

## Issues Identified

### Resolved Issues

1. **Missing `/over-ons` Route** ✅ **RESOLVED**
   - **Previous Status:** Missing from sitemap configuration
   - **Resolution:** Added to sitemap with priority 0.8, monthly change frequency
   - **Source File:** `src/app/over-ons/page.tsx`
   - **Date Resolved:** September 18, 2025

2. **Hardcoded lastModified Dates** ✅ **RESOLVED**
   - **Previous Status:** All dates were static/hardcoded
   - **Resolution:** Implemented filesystem-based mtime reading with fallbacks
   - **Implementation:** `src/lib/sitemap-utils.ts` helper utility
   - **Date Resolved:** September 18, 2025
3. **Speeltuin Route Indexing** ✅ **RESOLVED**
   - **Previous Status:** Included in sitemap with priority 0.7
   - **Resolution:** Removed from sitemap entirely (noindex page should not be indexed)
   - **Date Resolved:** September 18, 2025

### Configuration Analysis

#### Last Modified Sources
- **Filesystem-based:** ✅ **IMPLEMENTED** - Routes now use actual file modification times (mtime)
  - **Implementation:** `src/lib/sitemap-utils.ts` with route-to-file mapping
  - **Fallback Logic:** Falls back to configured dates when mtime is unavailable
  - **Source Files:** Maps routes to their corresponding `page.tsx` files
- **Config-based:** Used as fallback when filesystem data unavailable
- **Dynamic:** Homepage uses `currentDate` for frequent updates when no mtime available

#### Change Frequency Distribution
- **Weekly:** `/` (homepage), `/speeltuin`
- **Monthly:** `/diensten`, `/werkwijze`, `/contact`, service subpages
- **Yearly:** `/privacy`, `/voorwaarden`

## Recommendations

### ✅ Completed Improvements

1. **Added Missing Route** ✅ **COMPLETED**
   - Added `/over-ons` route to sitemap with appropriate priority and change frequency
   
2. **Implemented Filesystem-based Last Modified** ✅ **COMPLETED**
   - Created `src/lib/sitemap-utils.ts` helper utility
   - Routes now use actual file modification times (mtime) when available
   - Graceful fallback to configured dates when mtime unavailable
   - Service sub-routes correctly map to their parent diensten page source

3. **Enhanced Route-to-File Mapping** ✅ **COMPLETED**
   - Complete mapping of all routes to their source `page.tsx` files
   - Service routes automatically inherit mtime from `/diensten` page
   - Error handling for missing files or inaccessible paths

### Future Enhancements

1. **Dynamic Content Integration**
   - Consider reading file modification times for static pages
   - Implement CMS-based lastMod for dynamic content when available

2. **Priority Optimization**
   - Monitor actual page performance and user engagement
   - Consider A/B testing different priority distributions

3. **Advanced Mtime Sources**
   - Consider multiple file dependencies (components, assets)
   - Implement content-based change detection for more accuracy

## Technical Implementation

### Current robots.ts Structure
```typescript
// Handles preview environments correctly
const isPreview = process.env.VERCEL_ENV === 'preview';
return {
  rules: isPreview
    ? [{ userAgent: '*', disallow: ['/'] }]
    : [{ userAgent: '*', allow: ['/'] }],
  sitemap: [`${base}/sitemap.xml`],
  host: base,
};
```

### Current sitemap.ts Structure
- **Mtime-based lastModified:** ✅ Uses `getRouteLastModified()` helper
- **Route-to-file mapping:** ✅ Complete mapping in `ROUTE_TO_FILE_MAP`
- **Fallback handling:** ✅ Graceful fallback to configured dates
- **Service route support:** ✅ Service sub-routes mapped to diensten source
- **Error handling:** ✅ Console warnings for missing files, continues operation

## Compliance Status

| Requirement | Status | Notes |
|-------------|--------|-------|
| SITE_URL resolves to production domain | ✅ Pass | Uses https://prowebstudio.nl |
| Canonical URLs correct | ✅ Pass | Properly generated from base URL |
| Previews are noindex | ✅ Pass | Disallowed in robots.txt for previews |
| All public routes included | ✅ Pass | All routes including /over-ons added |
| /speeltuin noindex | ✅ Pass | Excluded from sitemap (September 18, 2025) |
| Proper lastMod sources | ✅ Pass | ✨ **NEW:** Filesystem mtime-based with fallbacks |

**Overall Grade:** 🟢 **Excellent** - 6/6 requirements met

---

## Implementation Details

### New Sitemap Utils (`src/lib/sitemap-utils.ts`)

```typescript
// Route-to-file mapping for mtime computation
export const ROUTE_TO_FILE_MAP: Record<string, string> = {
  '/': 'src/app/page.tsx',
  '/diensten': 'src/app/diensten/page.tsx',
  '/werkwijze': 'src/app/werkwijze/page.tsx',
  '/contact': 'src/app/contact/page.tsx',
  '/over-ons': 'src/app/over-ons/page.tsx',
  '/privacy': 'src/app/privacy/page.tsx',
  '/voorwaarden': 'src/app/voorwaarden/page.tsx',
};

// Main function for getting lastModified with fallback
export function getRouteLastModified(route: string, fallbackDate?: Date): Date
```

### Features
- **Automatic mtime detection:** Reads actual file modification times
- **Graceful fallback:** Uses configured dates when files unavailable  
- **Service route mapping:** Sub-routes inherit parent page mtime
- **Error resilience:** Continues operation with warnings for missing files
- **Performance:** Cached file stats, minimal filesystem overhead