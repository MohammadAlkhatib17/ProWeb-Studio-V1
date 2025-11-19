# Utility Functions

Shared utility functions used throughout the ProWeb Studio application.

## Available Utilities

### 🔗 URL Utilities (`url.ts`)

Centralized URL management for consistent site URL handling across the application.

**Key Functions:**
- `getSiteURL()` - Get canonical site URL
- `getAbsoluteURL(path)` - Create absolute URLs
- `getOGImageURL()` - Get OpenGraph image URL
- `normalizeURL(url)` - Normalize URLs (remove trailing slashes, fragments)
- `isSameSiteURL(url)` - Check if URL is from same site
- `isProduction/isDevelopment()` - Environment helpers

**Usage Example:**
```typescript
import { getSiteURL, getAbsoluteURL } from '@/lib/utils/url';

// Get site URL
const siteUrl = getSiteURL();
// => "https://prowebstudio.nl"

// Create absolute URL
const aboutUrl = getAbsoluteURL('/about');
// => "https://prowebstudio.nl/about"
```

**Benefits:**
- ✅ DRY principle - single source of truth for site URLs
- ✅ Environment-aware (dev/staging/production)
- ✅ Eliminates 20+ duplicate SITE_URL patterns
- ✅ Fully tested with 100% coverage

**Migration Guide:**

Replace this pattern:
```typescript
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prowebstudio.nl';
```

With:
```typescript
import { getSiteURL } from '@/lib/utils/url';
const siteUrl = getSiteURL();
```

---

### 📝 Logger Utility (`logger.ts`)

Production-safe logging utility that automatically strips debug logs in production.

**Key Features:**
- Development-only debug logging
- Always-available error/warn/info methods
- Timer and grouping utilities
- TypeScript-friendly with full type safety

**Usage Example:**
```typescript
import { logger } from '@/lib/utils/logger';

// Debug logging (stripped in production)
logger.log('Debug information', { data: someData });

// Always logged
logger.error('Error occurred:', error);
logger.warn('Warning message');
logger.info('Info message');

// Performance timing
logger.time('operation');
// ... do work
logger.timeEnd('operation');
```

**Benefits:**
- ✅ Automatic production stripping via Next.js compiler
- ✅ Consistent logging API across codebase
- ✅ Zero overhead in production builds
- ✅ Type-safe with TypeScript

---

## Adding New Utilities

When adding new utility functions:

1. **Create the utility file** in `src/lib/utils/`
2. **Add comprehensive JSDoc** documentation
3. **Create unit tests** in the same directory with `.test.ts` suffix
4. **Export from index** if creating a utility module
5. **Update this README** with usage examples

**Example Structure:**
```typescript
/**
 * Description of what the utility does
 * 
 * @param param1 - Description
 * @returns Description
 * 
 * @example
 * ```ts
 * import { myUtil } from '@/lib/utils/my-util';
 * 
 * const result = myUtil('value');
 * ```
 */
export function myUtil(param1: string): string {
  // Implementation
}
```

---

## Testing Utilities

All utilities should have corresponding test files:

```bash
# Run all utility tests
npm test -- src/lib/utils

# Run with coverage
npm run test:coverage -- src/lib/utils
```

**Test Coverage Requirements:**
- Minimum 80% coverage for new utilities
- Test edge cases (null, undefined, empty strings)
- Test error handling
- Test TypeScript types

---

## Best Practices

1. **Keep utilities pure** - No side effects where possible
2. **Document thoroughly** - JSDoc for all public functions
3. **Test comprehensively** - Cover edge cases
4. **Type everything** - Full TypeScript typing
5. **Stay focused** - One utility, one purpose
6. **Consider tree-shaking** - Export individual functions

---

## Available Utilities Checklist

- [x] `url.ts` - URL management utilities
- [x] `logger.ts` - Production-safe logging
- [ ] `string.ts` - String manipulation (future)
- [ ] `date.ts` - Date formatting (future)
- [ ] `validation.ts` - Common validators (future)

---

**Last Updated:** November 19, 2025
