# Cleanup Inventory Report

Generated: 2025-10-12T09:58:32.231Z

## Summary

- **Total Files Analyzed**: 189
- **Total Assets Analyzed**: 14
- **Total Dependencies**: 47
- **Unused Items Found**: 155
- **Estimated File Savings**: 113 files
- **Estimated Size Savings**: 1061.9 KB

## Unreferenced Files

Found 113 items:

- **src/middleware.ts**
  - No import references found
  - Confidence: medium

- **src/three/index.tsx**
  - No import references found
  - Confidence: medium

- **src/three/StarfieldInstanced.tsx**
  - No import references found
  - Confidence: medium

- **src/three/ServicesPolyhedra.tsx**
  - No import references found
  - Confidence: medium

- **src/three/PortfolioScene.tsx**
  - No import references found
  - Confidence: medium

- **src/three/PortfolioComputer.tsx**
  - No import references found
  - Confidence: medium

- **src/three/PortalScene.tsx**
  - No import references found
  - Confidence: medium

- **src/three/PerformanceOptimizations.tsx**
  - No import references found
  - Confidence: medium

- **src/three/OrbitRings.tsx**
  - No import references found
  - Confidence: medium

- **src/three/HaloPlane.tsx**
  - No import references found
  - Confidence: medium

_... and 103 more items_

## Unused Assets

Found 1 items:

- **public/assets/hero/nebula_helix.jpg**
  - No references found in source code
  - Confidence: medium

## Potentially Unused Deps

Found 18 items:

- **package.json** (@vercel/speed-insights)
  - No import statements found
  - Confidence: low

- **package.json** (sharp)
  - No import statements found
  - Confidence: low

- **package.json** (@lhci/cli)
  - No import statements found
  - Confidence: low

- **package.json** (@testing-library/jest-dom)
  - No import statements found
  - Confidence: low

- **package.json** (@types/cheerio)
  - No import statements found
  - Confidence: low

- **package.json** (@types/glob)
  - No import statements found
  - Confidence: low

- **package.json** (@types/nodemailer)
  - No import statements found
  - Confidence: low

- **package.json** (@types/react-dom)
  - No import statements found
  - Confidence: low

- **package.json** (@types/three)
  - No import statements found
  - Confidence: low

- **package.json** (@vitest/ui)
  - No import statements found
  - Confidence: low

_... and 8 more items_

## Placeholder Content

Found 23 items:

- **src/lib/web-vitals-optimization.ts** at line 106
  - Contains placeholder or TODO content
  - Confidence: high

- **src/app/layout.test.ts** at line 93
  - Contains placeholder or TODO content
  - Confidence: high

- **src/app/layout.test.ts** at line 94
  - Contains placeholder or TODO content
  - Confidence: high

- **src/app/layout.test.ts** at line 112
  - Contains placeholder or TODO content
  - Confidence: high

- **src/components/SecureContactForm.tsx** at line 422
  - Contains placeholder or TODO content
  - Confidence: high

- **src/components/SecureContactForm.tsx** at line 423
  - Contains placeholder or TODO content
  - Confidence: high

- **src/components/SecureContactForm.tsx** at line 452
  - Contains placeholder or TODO content
  - Confidence: high

- **src/components/SecureContactForm.tsx** at line 453
  - Contains placeholder or TODO content
  - Confidence: high

- **src/components/SecureContactForm.tsx** at line 483
  - Contains placeholder or TODO content
  - Confidence: high

- **src/components/SecureContactForm.tsx** at line 484
  - Contains placeholder or TODO content
  - Confidence: high

_... and 13 more items_

## Recommendations

- Review medium/low confidence items manually before deletion
- Test application thoroughly after removing unused code
- Consider dynamic imports that may not be detected by static analysis
- Verify API routes and metadata generators are not incorrectly flagged
- Check for code generation tools that may reference "unused" files
- Review placeholder content for business logic that should be preserved

## False Positives (Known Safe Items)

- src/app/**/page.tsx - Next.js route files
- src/app/**/layout.tsx - Next.js layout files
- src/app/**/error.tsx - Next.js error boundaries
- src/app/**/loading.tsx - Next.js loading components
- src/app/**/not-found.tsx - Next.js 404 pages
- src/app/robots.txt - SEO robots file
- src/app/sitemap*.xml - SEO sitemap files
- public/manifest.json - PWA manifest
- public/sw.js - Service worker
- public/icons/* - PWA icons
- public/fonts/* - Web fonts
