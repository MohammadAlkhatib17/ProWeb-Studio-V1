# SEO Preflight Script Hardening Summary

## Overview

The `seo-preflight.ts` script has been comprehensively hardened to eliminate false positives and provide robust validation according to the specifications. This hardening maintains zero impact on runtime/UI while significantly improving validation accuracy.

## Key Enhancements

### 1. Robust JSON-LD Collection & Graph Flattening ✅

**Implementation:**

- Parse ALL `<script type="application/ld+json">` scripts on each page
- Handle `@graph` arrays by extracting and flattening all items
- Build unified flat array of nodes across all scripts per page
- Helper utilities: `byType(type)` and `byId(id)` for safe querying

**Benefits:**

- Eliminates false negatives from multi-script JSON-LD setups
- Handles complex graph structures correctly
- Provides type-safe querying with helper methods

### 2. Enhanced Singleton Checks ✅

**Validations:**

- Exactly one `BreadcrumbList` per page
- Exactly one `FAQPage` on `/diensten` only
- Exactly one `HowTo` on `/werkwijze` only
- Exactly one `WebPage` per page with @id ending `#webpage`
- `primaryImageOfPage` validation (ImageObject with @id ending `#primaryimage`)

**Improvements:**

- Shows @id values in error messages for debugging
- Handles both string and array @type values
- Proper singleton enforcement vs. "at least one" checks

### 3. Services/Offers/Catalog Validation on /diensten ✅

**Requirements Enforced:**

- Exactly 3 `Service` nodes
- Each Service must have `offers` with:
  - `@type: "Offer"`
  - `category: "service"`
  - `availability: "https://schema.org/InStock"`
  - `eligibleRegion: "NL"`
  - `url` ending with `#website`, `#webshop`, or `#seo`
- `OfferCatalog` present with `itemListElement` length 3

**Benefits:**

- Precise offer validation prevents malformed structured data
- Ensures proper service categorization and availability

### 4. Organization/LocalBusiness Consistency ✅

**Comprehensive Checks:**

- Same @id between Organization and LocalBusiness
- `serviceArea`: 12 `DefinedRegion` with `addressCountry: "NL"`
- `contactPoint` with `contactType: "sales"`, `availableLanguage: ["nl","en"]`, `areaServed: "NL"`, URL to `/contact`
- `potentialAction`: `ScheduleAction` with `EntryPoint` target having `urlTemplate` ending with `/contact`

**Validation Depth:**

- Detailed field-level validation
- Proper array handling for multi-value fields
- Cross-referencing between related entities

### 5. Enhanced Sitemap Hygiene ✅

**Validations:**

- No URLs contain `#` fragments
- All URLs are absolute and HTTPS
- Sitemap accessibility (HTTP 200)

**Improvements:**

- More descriptive error messages
- Better HTTP status handling

### 6. DOM-Level Internal Anchor Validation ✅

**Methodology:**

- `/diensten`: Assert presence of `id="website"`, `id="webshop"`, `id="seo"` in HTML
- Homepage: Collect internal links to `/diensten#(website|webshop|seo)` (optional)
- **No HEAD requests** on fragment URLs (client-side only)

**Benefits:**

- Validates actual DOM elements vs. HTTP responses
- Avoids false failures from fragment URL HEAD requests
- Provides clear missing ID feedback

### 7. Environment-Aware Robots Meta Validation ✅

**Logic:**

- Production: Fail if `noindex` found on canonical pages (`/`, `/diensten`, `/werkwijze`, `/over-ons`, `/contact`)
- Preview/Staging: Skip noindex check (report only)
- Detection: `VERCEL_ENV=preview`, `NODE_ENV=development`, `NEXT_PUBLIC_ENVIRONMENT=staging`

**Benefits:**

- Prevents production SEO disasters
- Allows preview environments flexibility
- Clear environment detection

### 8. Enhanced Server Lifecycle Management ✅

**Robust Cleanup:**

- Graceful SIGTERM followed by SIGKILL after timeout
- `finally` block ensures cleanup in all exit paths
- Fallback `pkill -f "next start"` for orphaned processes
- Async cleanup with proper error handling

**Benefits:**

- Prevents port conflicts in CI
- Clean resource management
- Reliable test isolation

### 9. Enhanced Output & Debugging ✅

**Features:**

- Schema type counts logged per route (e.g., `Service: 3, Offer: 3`)
- Failed singleton checks show @id values for duplication source identification
- Detailed error messages with specific reasons
- Enhanced debugging tips in output
- Maintains compact ✅/❌ table format

**Benefits:**

- Faster debugging of schema issues
- Clear error attribution
- Professional CI output

## Usage

The script maintains the same interface:

```bash
npm run build
npm run seo:preflight
```

**CI Integration:**

```bash
npm run ci:build  # Includes seo:preflight and fails on assertion breaks
```

## Acceptance Criteria Met

✅ Running `npm run seo:preflight` after `npm run build` passes on current project (no false duplicates)  
✅ CI (`npm run ci:build`) fails if any assertion breaks  
✅ No runtime/UI changes  
✅ Minimal build speed impact  
✅ Enhanced debugging with type counts and @id values  
✅ Robust server lifecycle management  
✅ DOM-level anchor validation  
✅ Environment-aware robots meta checking

## Technical Implementation

**Core Classes:**

- `JsonLdHelper`: Provides type-safe querying with `byType()` and `byId()` methods
- `SEOPreflightChecker`: Main orchestrator with enhanced validation methods

**Key Methods:**

- `parseJsonLd()`: Robust JSON-LD extraction with @graph handling
- `validateServiceArea()`: 12 DefinedRegion validation
- `validateContactPoint()`: Sales contact validation
- `validatePotentialAction()`: ScheduleAction validation
- `checkInternalAnchors()`: DOM-level anchor presence checking

**Error Handling:**

- Comprehensive try-catch with meaningful error messages
- Graceful degradation for non-critical failures
- Enhanced cleanup in all exit scenarios

This hardened implementation provides production-ready SEO validation with comprehensive error prevention and detailed debugging capabilities.
