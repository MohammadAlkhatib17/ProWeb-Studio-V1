# Domain Configuration Report

## Canonical Domain Strategy

**Chosen Canonical Host**: `prowebstudio.nl` (apex domain)

## Redirect Configuration

### Primary Redirect Enforcement
**Location**: Platform level (Vercel)
- **Configuration**: Vercel Project Settings → Domains
- **Setup**: `www.prowebstudio.nl` configured to redirect to `prowebstudio.nl`
- **Redirect Type**: 301 (Permanent)
- **Performance**: Handled at edge/CDN level for optimal performance

### Fallback Redirect Implementation
**Location**: Application level (Next.js)
- **File**: `site/next.config.mjs`
- **Function**: `redirects()`
- **Purpose**: Safety fallback in case platform-level redirect fails
- **Configuration**:
  ```javascript
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.prowebstudio.nl',
          },
        ],
        destination: 'https://prowebstudio.nl/:path*',
        permanent: true,
      },
    ];
  }
  ```

## Implementation Details

### Redirect Hierarchy
1. **Primary**: Platform-level redirect (Vercel) - Handles most traffic at edge
2. **Fallback**: Application-level redirect (Next.js) - Catches any missed requests

### Benefits of This Approach
- **Performance**: Platform redirects are faster (handled at CDN edge)
- **Reliability**: Application fallback ensures 100% coverage
- **SEO**: Consistent 301 redirects preserve link equity
- **Maintenance**: Platform configuration is simpler to manage

### Environment Variables
The following environment variables support the canonical domain:
- `SITE_URL=https://prowebstudio.nl`
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=prowebstudio.nl`

### Verification
To verify redirect implementation:
1. Test `https://www.prowebstudio.nl` → should redirect to `https://prowebstudio.nl`
2. Test with various paths: `https://www.prowebstudio.nl/contact` → `https://prowebstudio.nl/contact`
3. Verify 301 status code using browser dev tools or curl

### DNS Configuration
Ensure DNS is configured correctly:
- `prowebstudio.nl` (A record) → Points to hosting provider
- `www.prowebstudio.nl` (CNAME) → Points to hosting provider or apex domain

## Compliance
✅ **Platform-level redirect configured** (as per DEPLOY.md documentation)  
✅ **Application-level fallback implemented** (next.config.mjs)  
✅ **Canonical domain documented** (prowebstudio.nl)  
✅ **301 permanent redirects used** (SEO best practice)  

Last Updated: September 18, 2025