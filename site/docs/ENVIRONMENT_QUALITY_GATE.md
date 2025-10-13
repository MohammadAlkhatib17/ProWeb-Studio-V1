# Environment Validation Quality Gate

## Overview

The environment validation quality gate ensures production builds fail fast when critical environment variables are missing or contain placeholder values. This prevents deployments with misconfigured environments and provides clear, actionable error messages to developers.

## Features

- ✅ **Production Build Failure**: Automatically fails production builds if required env vars are missing or invalid
- ✅ **Grouped Error Reporting**: Groups errors by configuration area (Analytics, Contact, reCAPTCHA, etc.)
- ✅ **Remediation Guidance**: Provides specific setup instructions for each configuration group
- ✅ **Development Mode Bypass**: Doesn't interfere with development workflows
- ✅ **CI Integration**: Runs as a quality gate in CI pipelines
- ✅ **Placeholder Detection**: Identifies common placeholder patterns and values

## Quality Gate Behavior

### Production Builds
- **Triggers**: `NODE_ENV=production`, `NEXT_PHASE=phase-production-build`, or `CI=true`
- **Action**: Validates all critical environment variables
- **Failure**: Exits with code 1 and detailed error messages if validation fails
- **Success**: Allows build to proceed

### Development Builds
- **Triggers**: `NODE_ENV=development` or unset
- **Action**: Skips validation by default
- **Override**: Use `FORCE_ENV_VALIDATION=true` to force validation in development

## Integration Points

### 1. Package.json Scripts
```json
{
  "build": "npm run validate-env && next build",
  "validate-env": "node scripts/validate-env.js",
  "quality-gate:env": "FORCE_ENV_VALIDATION=true npm run validate-env"
}
```

### 2. Next.js Configuration
The `next.config.mjs` runs validation during the Next.js build phase:
```javascript
// Validates environment before Next.js starts building
if (isProductionBuild()) {
  validateProductionEnvironment();
}
```

### 3. CI Pipeline
GitHub Actions workflow includes environment validation as a quality gate:
```yaml
- name: Environment validation quality gate
  run: |
    FORCE_ENV_VALIDATION=true npm run validate-env
```

## Configuration

### Critical Environment Variables
The following variables are required for production builds:

#### Site Configuration
- `SITE_URL`: Production domain (e.g., https://yourdomain.com)

#### Analytics
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`: Plausible analytics domain

#### Contact
- `CONTACT_INBOX`: Contact form destination email

#### reCAPTCHA
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`: Google reCAPTCHA site key
- `RECAPTCHA_SECRET_KEY`: Google reCAPTCHA secret key

### Placeholder Detection
The system automatically detects and rejects these placeholder patterns:
- `your_*_here` patterns
- `example.com`, `test@example.com`
- `placeholder`, `changeme`
- `localhost` URLs
- Empty strings

## Usage Examples

### Force Validation in Development
```bash
npm run quality-gate:env
```

### Test Production Build Locally
```bash
NODE_ENV=production npm run build
```

### CI Environment Setup
Set these environment variables in your CI/deployment platform:
```bash
SITE_URL=https://yourdomain.com
CONTACT_INBOX=contact@yourdomain.com
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_actual_site_key
RECAPTCHA_SECRET_KEY=your_actual_secret_key
```

## Error Output Example

When validation fails, you'll see grouped errors like this:

```
🚨 QUALITY GATE FAILED: Environment Validation Errors
============================================================
🔧 Site Configuration
   Primary site URL and domain settings

   ❌ SITE_URL: Missing required value

   💡 Guidance: Set your production domain. Example: https://yourdomain.com

🔧 reCAPTCHA
   Google reCAPTCHA spam protection

   ❌ NEXT_PUBLIC_RECAPTCHA_SITE_KEY: Contains placeholder value "your_recaptcha_site_key_here"
   ❌ RECAPTCHA_SECRET_KEY: Missing required value

   💡 Guidance: Get keys from Google reCAPTCHA console: https://www.google.com/recaptcha/admin

🔧 Remediation Steps:
   1. Set all required environment variables in your deployment platform
   2. Replace placeholder values with real configuration
   3. Verify values meet format requirements (URLs, emails, etc.)
   4. For local development: copy .env.example to .env.local

📚 Documentation: docs/DEPLOY_CHECKLIST.md
🔗 Environment Setup: docs/GOOGLE_SETUP.md
```

## Files Modified

### Core Implementation
- `src/lib/env.required.mjs`: Shared constants and validation functions (ESM)
- `src/lib/env.required.cjs`: Shared constants and validation functions (CommonJS)
- `scripts/validate-env.js`: Main validation script with grouped error reporting

### Integration
- `next.config.mjs`: Next.js build-time validation
- `package.json`: Build script integration and quality gate command
- `.github/workflows/ci.yml`: CI quality gate step

## Benefits

1. **Fail Fast**: Catches environment issues before deployment
2. **Clear Guidance**: Grouped errors with specific remediation steps  
3. **Developer Experience**: Doesn't interfere with development workflows
4. **CI Integration**: Prevents bad deployments from reaching production
5. **Maintainability**: Centralized configuration in shared modules
6. **Scalability**: Easy to add new environment variables and groups

## Troubleshooting

### Build Fails in Development
If the build fails in development mode, ensure you're not setting production environment variables:
```bash
# This will trigger validation in development
NODE_ENV=production npm run dev  # ❌ Don't do this

# Use normal development mode
npm run dev  # ✅ Correct
```

### Force Validation for Testing
To test the validation without changing NODE_ENV:
```bash
npm run quality-gate:env
```

### Override for Special Cases
If you need to skip validation temporarily (not recommended):
```bash
# Skip the validate-env step (build will still run Next.js validation)
BUILD_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ) next build
```