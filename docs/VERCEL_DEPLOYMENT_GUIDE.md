# Vercel Deployment Guide

## Overview
This guide covers the complete setup for deploying ProWeb-Studio to Vercel with GitHub Actions CI/CD integration.

## Prerequisites
- ✅ Vercel account connected to GitHub repository
- ✅ GitHub repository: `contact-prowebstudio/ProWeb-Studio`
- ✅ Vercel project: `pro-web-studio`

---

## Step 1: Environment Variables Setup in Vercel Dashboard

Navigate to your Vercel project settings: `https://vercel.com/your-org/pro-web-studio/settings/environment-variables`

### Required Environment Variables

Set these variables for **Production**, **Preview**, and **Development** environments:

#### 1. Site Configuration
```bash
# Variable: SITE_URL
# Value: https://yoursite.com
# Environments: Production ✓, Preview ✗, Development ✗
# Description: Your production domain (without trailing slash)
```

#### 2. Analytics
```bash
# Variable: NEXT_PUBLIC_PLAUSIBLE_DOMAIN
# Value: yoursite.com
# Environments: Production ✓, Preview ✓, Development ✗
# Description: Domain registered in Plausible Analytics
```

#### 3. Contact Form Email
```bash
# Variable: CONTACT_INBOX
# Value: contact@yoursite.com
# Environments: Production ✓, Preview ✓, Development ✗
# Description: Email address to receive contact form submissions
```

#### 4. Google reCAPTCHA (Site Key)
```bash
# Variable: NEXT_PUBLIC_RECAPTCHA_SITE_KEY
# Value: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
# Environments: Production ✓, Preview ✓, Development ✓
# Description: Public reCAPTCHA site key (visible in client-side code)
# Note: Use test key above for development/preview, real key for production
```

#### 5. Google reCAPTCHA (Secret Key)
```bash
# Variable: RECAPTCHA_SECRET_KEY
# Value: 6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
# Environments: Production ✓, Preview ✓, Development ✓
# Description: Secret reCAPTCHA key (server-side only)
# ⚠️ SECURITY: Use test key above for dev/preview, store real key securely for production
```

### Environment-Specific Configuration

| Environment | SITE_URL | Analytics | Contact Form | reCAPTCHA |
|-------------|----------|-----------|--------------|-----------|
| **Production** | `https://yoursite.com` | Real domain | Real inbox | Production keys |
| **Preview** | Auto-set by Vercel | Preview domain | Test inbox | Test keys |
| **Development** | `http://localhost:3000` | Disabled | Test inbox | Test keys |

---

## Step 2: Vercel Project Configuration

The project already includes an optimized `site/vercel.json` file with:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm ci",
  "regions": ["cdg1", "lhr1", "fra1"]
}
```

### Key Settings:
- ✅ **Framework**: Automatically detected as Next.js
- ✅ **Build Command**: Uses standard `npm run build` (env validation auto-skipped on Vercel)
- ✅ **Regions**: European CDN nodes (Paris, London, Frankfurt)
- ✅ **Headers**: Configured for optimal caching and security

**No additional Vercel dashboard configuration needed!**

---

## Step 3: GitHub Actions CI/CD Setup

### Required GitHub Secrets

Navigate to: `https://github.com/contact-prowebstudio/ProWeb-Studio/settings/secrets/actions`

Add these secrets:

```bash
# 1. GITHUB_TOKEN (automatically provided by GitHub Actions)
# No action needed - this is built-in

# 2. VERCEL_TOKEN (Optional - only if using Vercel CLI in CI)
# Get from: https://vercel.com/account/tokens
# Value: Your Vercel personal access token

# 3. VERCEL_ORG_ID (Optional)
# Get from: Project Settings → General → Vercel ORG ID
# Value: team_xxxxxxxxxxxxx

# 4. VERCEL_PROJECT_ID (Optional)
# Get from: Project Settings → General → Project ID
# Value: prj_xxxxxxxxxxxxx
```

### Current CI Workflow

The updated `.github/workflows/ci.yml` now:

1. ✅ **Skips env validation** in bundle-size-check job (uses `SKIP_ENV_VALIDATION=true`)
2. ✅ **Waits for Vercel deployment** before running E2E tests
3. ✅ **Uses deployed URL** for Playwright tests (via `PLAYWRIGHT_TEST_BASE_URL`)
4. ✅ **Runs Lighthouse CI** on deployed Vercel preview URLs

---

## Step 4: How Environment Validation Works

### Local Development
```bash
# Uses .env.local or .env files
npm run dev  # No validation
npm run build  # Validates environment variables
```

### Vercel Deployment
```bash
# Automatically sets VERCEL=1
# Validation is SKIPPED (platform manages env vars)
# Uses environment variables from Vercel dashboard
```

### GitHub Actions CI
```bash
# Sets SKIP_ENV_VALIDATION=true
# Validation is SKIPPED for build jobs
# E2E tests run against deployed Vercel URLs
```

### Validation Logic Flow
```
Is VERCEL=1?           → YES → ✅ Skip validation (Vercel manages vars)
Is SKIP_ENV_VALIDATION → YES → ✅ Skip validation (CI override)
Is NODE_ENV=production → NO  → ✅ Skip validation (dev mode)
                       → YES → 🔍 Run full validation
```

---

## Step 5: Deployment Workflow

### Automatic Deployments

1. **Push to `main` branch**
   - ✅ Vercel deploys to production automatically
   - ✅ GitHub Actions runs CI checks in parallel
   - ✅ E2E tests run on deployed preview URL

2. **Open Pull Request**
   - ✅ Vercel creates preview deployment
   - ✅ GitHub Actions runs CI checks
   - ✅ Tests run on preview URL
   - ✅ Preview URL added to PR comments

### Manual Deployment (Optional)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## Step 6: Verifying Deployment Success

### Check Vercel Dashboard
1. Go to `https://vercel.com/your-org/pro-web-studio`
2. Verify deployment status: **Ready** ✅
3. Click deployment URL to test site

### Check GitHub Actions
1. Go to `https://github.com/contact-prowebstudio/ProWeb-Studio/actions`
2. Verify all checks pass:
   - ✅ `CI / quality-checks`
   - ✅ `CI / bundle-size-check`
   - ✅ `CI / e2e-tests`
   - ✅ `Lighthouse CI / lighthouse-ci`

### Test Deployment
```bash
# Test production URL
curl -I https://yoursite.com

# Should return:
# HTTP/2 200
# x-vercel-cache: HIT
# x-region: europe
```

---

## Step 7: Troubleshooting

### Issue: Build fails with "Environment validation failed"

**Solution:**
```bash
# Verify VERCEL=1 is set automatically by Vercel
# Check Vercel build logs for environment variables
# Ensure all required vars are set in Vercel dashboard
```

### Issue: E2E tests fail to find baseURL

**Solution:**
```bash
# Playwright automatically uses VERCEL_URL when available
# Ensure GitHub Action waits for deployment completion
# Check playwright.config.ts getBaseURL() function
```

### Issue: Lighthouse CI fails

**Solution:**
```bash
# Ensure LHCI_GITHUB_APP_TOKEN is set (automatic via GITHUB_TOKEN)
# Verify Vercel deployment is complete before running Lighthouse
# Check that waitForDeployment step succeeds
```

### Issue: "Some checks were not successful"

**Root Causes:**
1. ❌ Missing environment variables in Vercel dashboard
2. ❌ VERCEL=1 not being set automatically
3. ❌ CI running before deployment completes

**Quick Fix:**
```bash
# 1. Set SKIP_ENV_VALIDATION=true in problematic jobs
# 2. Ensure waitForDeployment step has sufficient timeout (300s)
# 3. Verify all GitHub secrets are set correctly
```

---

## Step 8: Production Checklist

Before deploying to production, ensure:

- [ ] All environment variables set in Vercel dashboard (Production environment)
- [ ] SITE_URL points to production domain (no trailing slash)
- [ ] Real reCAPTCHA keys configured (not test keys)
- [ ] Real CONTACT_INBOX email address configured
- [ ] Plausible Analytics domain registered and NEXT_PUBLIC_PLAUSIBLE_DOMAIN set
- [ ] Custom domain configured in Vercel (if not using vercel.app)
- [ ] SSL certificate active and valid
- [ ] GitHub Actions secrets configured (GITHUB_TOKEN auto-provided)
- [ ] CI workflow passing all checks
- [ ] E2E tests passing on preview deployments
- [ ] Lighthouse scores meet performance budgets

---

## Additional Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **GitHub Actions**: https://docs.github.com/en/actions
- **Playwright on Vercel**: https://playwright.dev/docs/ci-intro

---

## Support

If you encounter issues:

1. Check Vercel build logs: `https://vercel.com/your-org/pro-web-studio/deployments`
2. Check GitHub Actions logs: `https://github.com/contact-prowebstudio/ProWeb-Studio/actions`
3. Review this guide and `docs/DEPLOY.md`
4. Check `site/next.config.mjs` for validation logic
5. Verify environment variables in Vercel dashboard

---

## Summary

✅ **Environment validation automatically skips on Vercel** (detects `VERCEL=1`)  
✅ **CI workflow uses `SKIP_ENV_VALIDATION=true` for builds**  
✅ **E2E tests wait for deployment and use deployed URLs**  
✅ **Lighthouse CI runs on deployed preview URLs**  
✅ **All checks should pass after following this guide**

**Last Updated**: November 29, 2025
