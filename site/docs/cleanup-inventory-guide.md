# Cleanup Inventory Analysis Guide

## Overview

The cleanup inventory script performs static analysis to identify potentially unused code, files, assets, and dependencies. This guide explains how to interpret the results and make safe cleanup decisions.

## Confidence Levels

### High Confidence ✅

- **Safe to remove** after basic verification
- Unused variables/imports detected by TypeScript/ESLint
- Clear placeholder content (`TODO`, `FIXME`, etc.)
- Literal ellipsis characters (`…`)

### Medium Confidence ⚠️

- **Review carefully** before removal
- Files with no static import references (may use dynamic imports)
- Assets not found in source code (may be loaded dynamically)
- Files that could be entry points or special Next.js files

### Low Confidence ⚡

- **Manual verification required**
- Dependencies without explicit imports (may be build tools, plugins)
- Type-only packages (`@types/*`)
- CLI tools and dev dependencies

## Category Analysis

### Unreferenced Files

**Common False Positives:**

- Next.js middleware (`src/middleware.ts`) - Used by Next.js automatically
- Three.js components loaded via `React.lazy()` or `dynamic()`
- Test files and utilities
- Type declaration files

**How to Verify:**

1. Check for dynamic imports: `grep -r "import('@/path/to/file')" src/`
2. Check for lazy loading: `grep -r "lazy(() => import" src/`
3. Verify Next.js conventions (middleware, API routes)
4. Check build tools and config files

### Unused Assets

**Common False Positives:**

- PWA icons referenced in `manifest.json`
- Fonts loaded via CSS `@font-face`
- Images loaded by libraries or frameworks
- Assets referenced in dynamic content

**How to Verify:**

1. Check manifest.json for icon references
2. Search CSS files for asset references
3. Check for base64 encoded versions
4. Verify og:image and metadata usage

### Potentially Unused Dependencies

**Common False Positives:**

- Build tools (`@next/bundle-analyzer`, `@lhci/cli`)
- Next.js plugins (used in config, not imported)
- Type-only packages (`@types/*`)
- Runtime dependencies used by frameworks

**How to Verify:**

1. Check `next.config.mjs` for plugin usage
2. Verify build script dependencies
3. Check if used by other dependencies (transitive)
4. Review framework automatic imports

### Placeholder Content

**Generally Safe to Clean:**

- Comments with `TODO`, `FIXME`, `HACK`
- Literal ellipsis characters (`…`)
- Test data marked as placeholders
- Temporary implementation notes

**Keep if:**

- Contains business logic or requirements
- Part of user-facing error messages
- Used in documentation or comments explaining code

## Review Workflow

### 1. High Confidence Items

```bash
# Review ESLint/TS unused variables
npm run cleanup:check-unused

# Fix automatically where possible
npm run lint:fix
```

### 2. Medium Confidence Items

```bash
# Search for dynamic usage
grep -r "import('@/three/" src/
grep -r "lazy(() => import" src/

# Check Next.js special files
ls src/middleware.ts src/app/layout.tsx src/app/error.tsx
```

### 3. Low Confidence Items

```bash
# Check build tool usage
grep -r "@lhci/cli" package.json *.config.*
grep -r "@next/bundle-analyzer" package.json *.config.*

# Verify type dependencies
npm ls @types/node @types/react
```

## Safe Deletion Checklist

Before deleting any items:

- [ ] Build passes: `npm run build`
- [ ] Tests pass: `npm run test`
- [ ] TypeScript checks: `npm run typecheck`
- [ ] ESLint passes: `npm run lint`
- [ ] E2E tests pass: `npm run test:e2e`

After deletion:

- [ ] Development server starts: `npm run dev`
- [ ] All pages load without errors
- [ ] 3D scenes render correctly
- [ ] PWA functionality intact
- [ ] Bundle analysis completes: `npm run build:analyze`

## Common Deletion Patterns

### Remove Unused Imports

```typescript
// Before
import { UnusedComponent } from "./components";
import { usedFunction, unusedFunction } from "./utils";

// After
import { usedFunction } from "./utils";
```

### Remove Placeholder Content

```typescript
// Before
const placeholder = "TODO: implement real logic here...";
const data = {
  name: "Placeholder Name",
  // More placeholder data...
};

// After
const data = {
  name: "Real Implementation",
  // Actual data structure
};
```

### Remove Unused Files

Only after confirming no dynamic imports:

```bash
# Search for all possible import patterns
grep -r "ComponentName" src/
grep -r "file-name" src/
grep -r "@/path/to/file" src/
```

## Automation Scripts

The inventory includes several helper scripts:

- `npm run cleanup:inventory` - Full analysis report
- `npm run cleanup:check-unused` - Quick unused variable check
- `npm run lint` - ESLint with unused detection
- `npm run typecheck` - TypeScript unused parameter check

## Integration with CI

The cleanup inventory can be integrated into CI to:

1. Block PRs that introduce unused code
2. Generate reports for regular cleanup reviews
3. Track bundle size impact of cleanup efforts
4. Enforce coding standards automatically

See `PR-6: CI Guardrails` for implementation details.
