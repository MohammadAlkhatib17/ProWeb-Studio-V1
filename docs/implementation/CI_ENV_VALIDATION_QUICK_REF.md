# CI Environment Validation - Quick Reference

## 🎯 What It Does

Automatically validates production environment variables in CI to catch configuration issues before deployment.

## ✅ Acceptance Criteria Met

- ✅ CI fails on missing/placeholder `CRITICAL_ENV_VARS`
- ✅ CI passes with minimal valid environment
- ✅ No secret leakage in logs
- ✅ Duration impact: ~5 seconds (well under 2-minute constraint)

## 📁 Files Modified/Added

### New Files
- `scripts/validate-production-env.js` - Validation script
- `.env.ci` - CI environment configuration
- `scripts/test-env-validation.sh` - Test suite
- `docs/CI_ENV_VALIDATION.md` - Full documentation

### Modified Files
- `.github/workflows/ci.yml` - Added validation steps to 2 jobs
- `.github/workflows/lhci.yml` - Added validation steps

## 🔑 Critical Variables Validated

```javascript
SITE_URL
NEXT_PUBLIC_PLAUSIBLE_DOMAIN
CONTACT_INBOX
NEXT_PUBLIC_RECAPTCHA_SITE_KEY
RECAPTCHA_SECRET_KEY
```

## 🚀 Quick Test Locally

```bash
# Run all validation tests
./scripts/test-env-validation.sh

# Test CI environment manually
set -a && source .env.ci && set +a
NODE_ENV=production node scripts/validate-production-env.js
```

## 📊 CI Workflow Steps

Each workflow now includes:

1. **Load CI environment** - Sources `.env.ci` and exports to `GITHUB_ENV`
2. **Validate production environment** - Runs validation script
3. **Validate Next.js config** - Tests config loading in production mode
4. **Build** - Proceeds with normal build (now with validated env)

## 🛡️ Security

- Values > 20 chars are masked in logs
- `.env.ci` uses Google's official test keys (safe for CI)
- No production secrets in repository
- Detects placeholder patterns: `example.com`, `placeholder`, `changeme`, etc.

## 🔧 Troubleshooting

### CI Failing?

Check the error output for which variable is failing:

```
❌ SITE_URL is not set
❌ CONTACT_INBOX contains placeholder/invalid value
```

### Valid Values Required

- ❌ `https://example.com` - rejected (contains "example")
- ❌ `test@example.com` - rejected (contains "example")
- ❌ `placeholder` - rejected (placeholder value)
- ✅ `https://mysite.com` - accepted
- ✅ `contact@mysite.com` - accepted

## 📈 Next Steps

All workflows now validate environment configuration before building. If you need to:

1. **Add new critical variables**: Update `site/src/lib/env.required.mjs`
2. **Update CI values**: Edit `.env.ci`
3. **Test changes**: Run `./scripts/test-env-validation.sh`

## 📚 Full Documentation

See `docs/CI_ENV_VALIDATION.md` for complete details.
