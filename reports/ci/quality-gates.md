# Quality Gates Documentation

This document describes the CI quality gates that protect the main branch from regressions and maintain code quality standards.

## Overview

The CI pipeline implements several quality gates that must pass before code can be merged:

1. **TypeScript Type Checking** - No TypeScript compilation errors
2. **ESLint Code Quality** - No ESLint errors (warnings are allowed)
3. **Prettier Code Formatting** - Code must be properly formatted
4. **Test Suite** - All tests must pass
5. **Bundle Size Monitoring** - Bundle size increases must stay within acceptable limits
6. **Security Quality Gates** - Critical security configurations must be maintained

## Quality Gate Thresholds

### Code Quality Gates

These gates block merges when code quality issues are detected:

| Gate | Threshold | Override Label | Description |
|------|-----------|----------------|-------------|
| TypeScript | 0 errors | `code-quality-override` | All TypeScript compilation errors must be fixed |
| ESLint | 0 errors | `code-quality-override` | All ESLint errors must be resolved (warnings allowed) |
| Prettier | 0 diffs | `code-quality-override` | Code must be formatted according to Prettier rules |
| Tests | 0 failures | `code-quality-override` | All unit tests must pass |

### Security Quality Gates

These gates protect against security configuration regressions:

| Gate | Threshold | Override Label | Description |
|------|-----------|----------------|-------------|
| CSP unsafe-eval | 0 occurrences | `security-override` | Blocks re-introduction of unsafe-eval in CSP policies |
| Environment Variable Consistency | 100% compliance | `security-override` | All env vars used in code must be declared in env.required.mjs |

#### CSP unsafe-eval Protection

The CSP unsafe-eval check scans configuration files for the `unsafe-eval` directive:

- **Files Monitored**: `site/next.config.mjs`, `site/src/middleware.ts`
- **Pattern Detection**: Regex patterns for CSP headers containing `unsafe-eval`
- **Exception Handling**: Ignores commented code and documentation
- **Purpose**: Prevents regression after intentional removal of unsafe-eval

**Example Violation:**
```javascript
// This would trigger the quality gate
'Content-Security-Policy': 'script-src \'self\' \'unsafe-eval\''
```

**Resolution Steps:**
1. Remove `unsafe-eval` from CSP directives
2. Use nonces, hashes, or `strict-dynamic` for dynamic scripts
3. Refactor code to avoid `eval()` usage
4. Check `reports/security/csp-status.md` for guidance

#### Environment Variable Consistency

The environment variable consistency check ensures that all environment variables used in code are properly declared:

- **Files Scanned**: All `.ts`, `.tsx`, `.js`, `.jsx` files in `site/src/`
- **Config Files**: `site/next.config.mjs`, `site/middleware.ts`
- **Pattern Detection**: `process.env.VARIABLE_NAME` usage
- **Validation**: Cross-reference with `site/src/lib/env.required.mjs`

**Categories Validated:**
- **Critical Variables**: Must be in `CRITICAL_ENV_VARS` array
- **URL Variables**: Must be in `URL_VARS` array  
- **Recommended Variables**: Must be in `RECOMMENDED_ENV_VARS` array

**Example Violation:**
```javascript
// Code uses env var that's not declared in env.required.mjs
const apiKey = process.env.NEW_API_KEY; // ❌ Not in any required list
```

**Resolution Steps:**
1. Add missing variables to appropriate array in `env.required.mjs`
2. Update `.env.example` with documentation
3. Categorize as critical, URL, or recommended based on usage
4. Ensure deployment validation covers the new variable

### Bundle Size Gate

The bundle size gate monitors JavaScript bundle sizes to prevent performance regressions:

| Metric | Threshold | Override Label | Description |
|--------|-----------|----------------|-------------|
| Bundle Size Increase | **10%** | `bundle-size-override` | Blocks merges when any critical chunk grows by >10% |
| Warning Threshold | 5% | *(informational)* | Shows warnings for changes >5% but <10% |
| Critical Routes | `/`, `/diensten` | - | Routes that are monitored for bundle size |

#### Monitored Bundle Categories

- **vendors**: Core vendor libraries (React, Next.js, Framer Motion)
- **three-core**: Three.js core library
- **three-components**: 3D components for specific routes
- **polyfills**: Browser compatibility polyfills
- **app**: Application-specific code

## How to Override Quality Gates

Sometimes legitimate changes may trigger quality gates that need to be overridden. Here's how to handle each scenario:

### 1. Security Quality Gates Override

Security overrides should be extremely rare and require thorough justification:

**Step 1: Add the override label**
```bash
gh pr edit <PR_NUMBER> --add-label "security-override"
```

**Step 2: Document the justification**
Security overrides require detailed explanation including:
- Why the security check needs to be bypassed
- Risk assessment and mitigation measures
- Security team approval (if applicable)
- Timeline for addressing the underlying issue

**Example PR comment:**
```markdown
## Security Override Justification

**Gate Triggered**: CSP unsafe-eval detection

**Reason**: Critical third-party analytics integration requires eval() temporarily

**Risk Assessment**: 
- Limited to analytics script only
- Sandboxed in dedicated CSP context
- Monitored via CSP violation reports

**Mitigation**:
- Vendor working on eval-free version (ETA: 2 weeks)
- Added extra CSP monitoring
- Created follow-up issue #123 to remove override

**Approval**: Security team approved (Slack thread: https://...)
```

### 2. Bundle Size Override

When a bundle size increase is justified (new features, library updates, etc.):

**Step 1: Add the override label**
```bash
# Via GitHub CLI
gh pr edit <PR_NUMBER> --add-label "bundle-size-override"

# Or via GitHub web interface:
# Go to your PR → Labels → Add "bundle-size-override"
```

**Step 2: Document the reason**
Add a comment to your PR explaining:
- Why the bundle size increase is necessary
- What was added/changed that caused the increase
- Any optimization steps taken to minimize the impact

**Example PR comment:**
```markdown
## Bundle Size Override Justification

This PR adds the new 3D model viewer component which requires additional Three.js modules.

**Changes causing size increase:**
- Added GLTFLoader (+45KB)
- Added new particle system (+23KB)
- Total increase: ~68KB (8.2% on diensten route)

**Mitigation steps taken:**
- Implemented dynamic imports to load only when needed
- Compressed textures using DRACO compression
- Removed unused Three.js features

**Business justification:**
Critical feature for Q4 portfolio showcase launch.
```

### 3. Code Quality Override

For code quality gates (TypeScript, ESLint, Prettier, Tests):

**Step 1: Add the override label**
```bash
gh pr edit <PR_NUMBER> --add-label "code-quality-override"
```

**Step 2: Document the reason**
Code quality overrides should be rare. Valid reasons include:
- Emergency hotfixes for production issues
- Temporary workarounds for external library issues
- Planned technical debt that will be addressed in follow-up PRs

## Running Quality Checks Locally

Before pushing your changes, run these commands to catch issues early:

### All Quality Checks
```bash
cd site
npm run ci:quality-check
```

### Individual Checks
```bash
# TypeScript type checking
npm run typecheck

# ESLint
npm run lint

# Prettier formatting check
npm run format:check

# Run tests
npm run test

# Build with bundle analysis
npm run ci:build

# Security quality gates
node ../scripts/check-csp-unsafe-eval.js
node ../scripts/check-env-vars-consistency.js
```

### Bundle Size Analysis
```bash
# Generate current bundle analysis
npm run ci:build

# Compare with a specific bundle file
npm run bundle:compare current-bundle.json baseline-bundle.json
```

### Security Checks
```bash
# Check for CSP unsafe-eval violations
node scripts/check-csp-unsafe-eval.js

# Check environment variable consistency
node scripts/check-env-vars-consistency.js
```

## Troubleshooting Common Issues

### TypeScript Errors

**Problem**: `Type '...' is not assignable to type '...'`

**Solutions**:
1. Check type definitions in `src/types/`
2. Update component prop interfaces
3. Add proper type annotations
4. Use type assertions sparingly with `as` keyword

**Example fix**:
```typescript
// ❌ Before
const handleClick = (event) => { ... }

// ✅ After  
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => { ... }
```

### ESLint Errors

**Problem**: `'React' must be in scope when using JSX`

**Solution**: Add React import or update ESLint config
```typescript
// Add to top of file
import React from 'react';
```

**Problem**: `Missing dependency in useEffect hook`

**Solution**: Add missing dependencies or disable rule with justification
```typescript
// Option 1: Add dependency
useEffect(() => {
  fetchData(userId);
}, [userId, fetchData]);

// Option 2: Disable with reason (use sparingly)
useEffect(() => {
  fetchData();
}, []); // eslint-disable-line react-hooks/exhaustive-deps -- runs only on mount
```

### Prettier Formatting

**Problem**: `Code style issues found`

**Solution**: Run auto-formatting
```bash
npm run format
```

**Problem**: Prettier conflicts with ESLint

**Solution**: Check `.eslintrc.json` includes `eslint-config-prettier`

### Bundle Size Issues

**Problem**: Bundle size increased unexpectedly

**Diagnosis steps**:
1. Run `npm run ci:build` to generate analysis
2. Check `reports/bundles/analysis-data.json` for size breakdown
3. Identify which chunks grew and why

**Common causes & solutions**:

| Cause | Solution |
|-------|----------|
| New dependency added | Consider lighter alternatives, tree-shaking |
| Unused imports | Remove unused code, run ESLint autofix |
| Large assets included | Optimize images, use dynamic imports |
| Duplicate dependencies | Check for version conflicts in package.json |

### Test Failures

**Problem**: Tests fail in CI but pass locally

**Common causes**:
1. Missing test dependencies
2. Environment differences (timezone, locale)
3. Async test timing issues
4. File path differences (case sensitivity)

**Solutions**:
```bash
# Run tests in CI-like environment
NODE_ENV=test npm run test

# Run specific test file
npm run test -- path/to/test.spec.ts

# Run tests with verbose output
npm run test -- --reporter=verbose
```

### Security Gate Issues

**Problem**: CSP unsafe-eval detected

**Common causes**:
1. Third-party script using `eval()`
2. Dynamic code generation
3. Misconfigured CSP policy

**Solutions**:
```bash
# Check which files contain unsafe-eval
grep -r "unsafe-eval" site/next.config.mjs site/src/middleware.ts

# Review CSP status and guidance
cat reports/security/csp-status.md

# Consider alternatives:
# - Use nonces for inline scripts
# - Implement strict-dynamic
# - Refactor eval() usage to safer alternatives
```

**Problem**: Environment variable consistency failure

**Common causes**:
1. New env var used in code but not declared in `env.required.mjs`
2. Removed env var still listed in required arrays
3. Env var used in wrong category (critical vs recommended)

**Solutions**:
```bash
# Identify unlisted variables
node scripts/check-env-vars-consistency.js

# Update env.required.mjs with missing variables
# Edit site/src/lib/env.required.mjs and add to appropriate array:
# - CRITICAL_ENV_VARS: Required for app to function
# - URL_VARS: Site URL variants  
# - RECOMMENDED_ENV_VARS: Optional but beneficial

# Update .env.example with documentation
# Add new variables with placeholder values and comments
```

**Example fix for env var consistency**:
```javascript
// site/src/lib/env.required.mjs
export const CRITICAL_ENV_VARS = [
  'SITE_URL',
  'NEXT_PUBLIC_PLAUSIBLE_DOMAIN',
  'CONTACT_INBOX',
  'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
  'RECAPTCHA_SECRET_KEY',
  'NEW_API_KEY' // ← Add your new variable here
];
```

## Configuration Files

### Quality Gate Configuration
- **Location**: `.github/quality-gates.json`
- **Purpose**: Defines thresholds and settings for all quality gates

### Bundle Analysis Configuration  
- **Generation**: `site/scripts/analyze-bundle-data.js`
- **Comparison**: `site/scripts/bundle-compare.js`
- **Output**: `reports/bundles/analysis-data.json`

### CI Configuration
- **Location**: `.github/workflows/ci.yml`
- **Triggers**: Push to main, Pull Requests to main
- **Jobs**: `quality-checks`, `bundle-size-check`

## Updating Thresholds

To modify quality gate thresholds:

1. **Update configuration**:
   ```json
   // .github/quality-gates.json
   {
     "bundleSize": {
       "thresholdPercent": 15,  // Changed from 10%
       "warningThresholdPercent": 7  // Changed from 5%
     }
   }
   ```

2. **Update CI workflow**:
   ```yaml
   # .github/workflows/ci.yml
   env:
     BUNDLE_SIZE_THRESHOLD: 15  # Must match config
   ```

3. **Document the change**:
   - Update this documentation
   - Add entry to RELEASE_NOTES.md
   - Notify team of the change

## Best Practices

### For Developers

1. **Run quality checks locally** before pushing
2. **Keep PRs focused** to minimize bundle size changes
3. **Use dynamic imports** for large dependencies
4. **Document bundle size increases** with clear justification
5. **Review bundle analysis** when adding new dependencies
6. **Validate CSP changes** against security requirements
7. **Update env.required.mjs** when adding new environment variables
8. **Test security gates locally** using the provided scripts

### For Reviewers

1. **Check quality gate status** before approving
2. **Review override justifications** carefully
3. **Verify bundle size changes** are reasonable
4. **Ensure proper documentation** for overrides
5. **Consider long-term impact** of size increases
6. **Scrutinize security overrides** - require security team approval
7. **Validate environment variable changes** match actual usage
8. **Check CSP modifications** don't introduce vulnerabilities

### For Maintainers

1. **Monitor quality gate trends** over time
2. **Adjust thresholds** as project grows
3. **Review override patterns** for improvements
4. **Update documentation** when processes change
5. **Educate team** on quality gate benefits
6. **Regular security gate audits** to ensure effectiveness
7. **Monitor CSP violation reports** for real-world issues
8. **Maintain environment variable documentation** in sync with code

## Support

For questions or issues with quality gates:

1. **Check this documentation** first
2. **Review recent similar PRs** for examples
3. **Ask in team chat** for clarification
4. **Create an issue** for bugs or improvements

---

*Last updated: {{ date }}*
*Configuration version: 1.0*