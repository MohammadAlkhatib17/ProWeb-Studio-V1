# Security Quality Gates Implementation

## Overview

Extended CI pipeline with two new security quality gates to protect against:
1. CSP configuration regressions (re-introduction of `unsafe-eval`)
2. Environment variable inconsistencies between code usage and declared requirements

## Implementation

### New Scripts
- `scripts/check-csp-unsafe-eval.js` - Scans CSP configurations for `unsafe-eval` directive
- `scripts/check-env-vars-consistency.js` - Validates env var usage matches `env.required.mjs`

### CI Integration
- Added "Security quality gates" step to `.github/workflows/ci.yml`
- Runs as part of existing `quality-checks` job
- Fails CI build if violations detected

### Environment Variable Structure
Updated `site/src/lib/env.required.mjs` with comprehensive categorization:
- `CRITICAL_ENV_VARS` - Required for production
- `URL_VARS` - Site URL variations
- `RECOMMENDED_ENV_VARS` - Optional but beneficial
- `OPTIONAL_ENV_VARS` - Legal/business information
- `DEVELOPMENT_ENV_VARS` - Build tools and development features

## Documentation

Updated `reports/ci/quality-gates.md` with:
- Security gate descriptions and thresholds
- Override procedures (requires `security-override` label)
- Troubleshooting guides
- Local testing instructions
- Best practices for developers and reviewers

## Usage

### Local Testing
```bash
# Check CSP configuration
node scripts/check-csp-unsafe-eval.js

# Check environment variable consistency
node scripts/check-env-vars-consistency.js

# Test both (simulate CI)
scripts/test-security-gates.sh
```

### Override Process
Security overrides require:
1. Add `security-override` label to PR
2. Detailed justification including risk assessment
3. Security team approval (for CSP violations)
4. Timeline for addressing underlying issue

## Acceptance Criteria

✅ **CI pipeline updated**: Security gates integrated into existing workflow  
✅ **CSP unsafe-eval protection**: Detects and blocks re-introduction  
✅ **Environment variable validation**: Ensures code usage matches declarations  
✅ **Documentation**: Comprehensive guide in `reports/ci/quality-gates.md`  
✅ **Testing**: Scripts validated with both passing and failing scenarios  

## Benefits

1. **Security regression prevention**: Automatic detection of CSP policy weakening
2. **Deployment consistency**: Environment validation matches actual code requirements
3. **Developer experience**: Clear error messages and resolution guidance
4. **Maintainability**: Centralized environment variable management
5. **Compliance**: Automated enforcement of security standards

---

**Files Modified:**
- `.github/workflows/ci.yml` - Added security quality gates step
- `site/src/lib/env.required.mjs` - Expanded environment variable categorization  
- `site/src/lib/env.required.cjs` - Updated CommonJS version for consistency
- `reports/ci/quality-gates.md` - Added security gates documentation

**Files Added:**
- `scripts/check-csp-unsafe-eval.js` - CSP validation script
- `scripts/check-env-vars-consistency.js` - Environment variable validation script
- `scripts/test-security-gates.sh` - Testing and validation script