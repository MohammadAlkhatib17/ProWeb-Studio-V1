# Vercel Deployment - Quick Validation Checklist

## Pre-Deployment Checklist

### 1. Vercel Dashboard Setup
- [ ] Project connected to GitHub repository
- [ ] Framework preset: **Next.js** (auto-detected)
- [ ] Build command: `npm run build`
- [ ] Install command: `npm ci`
- [ ] Root directory: `site`

### 2. Environment Variables (Vercel Dashboard)

#### Production Environment
- [ ] `SITE_URL` = `https://yoursite.com` (your actual domain)
- [ ] `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` = `yoursite.com`
- [ ] `CONTACT_INBOX` = `contact@yoursite.com` (real email)
- [ ] `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` = (real production key)
- [ ] `RECAPTCHA_SECRET_KEY` = (real production secret)

#### Preview Environment
- [ ] `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` = `yoursite.com` (or preview domain)
- [ ] `CONTACT_INBOX` = `test@yoursite.com` (test email)
- [ ] `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` = `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI` (test key)
- [ ] `RECAPTCHA_SECRET_KEY` = `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe` (test secret)

#### Development Environment (Optional)
- [ ] Same as Preview OR leave empty

### 3. GitHub Repository Setup
- [ ] Repository: `contact-prowebstudio/ProWeb-Studio`
- [ ] GitHub Actions enabled
- [ ] `.github/workflows/ci.yml` exists and updated
- [ ] `GITHUB_TOKEN` available (automatic)

### 4. Code Changes Applied
- [ ] `scripts/validate-production-env.js` - Fixed early return bug
- [ ] `site/scripts/validate-env.js` - Added Vercel detection
- [ ] `site/next.config.mjs` - Added SKIP_ENV_VALIDATION check
- [ ] `site/playwright.config.ts` - Already uses VERCEL_URL
- [ ] `site/vercel.json` - Build command changed to `npm run build`
- [ ] `.github/workflows/ci.yml` - Added SKIP_ENV_VALIDATION to build job

---

## Deployment Verification

### Step 1: Trigger Deployment
```bash
# Method 1: Push to main branch
git add .
git commit -m "fix: Vercel deployment configuration"
git push origin main

# Method 2: Create pull request
git checkout -b fix/vercel-deployment
git add .
git commit -m "fix: Vercel deployment configuration"
git push origin fix/vercel-deployment
# Then create PR on GitHub
```

### Step 2: Monitor Vercel Deployment
1. Go to: `https://vercel.com/your-org/pro-web-studio`
2. Watch build logs in real-time
3. Look for: ✅ "Building... Complete!"
4. Expected output in logs:
   ```
   ✅ Running on Vercel - skipping env validation (platform-managed)
   ▲ Next.js Build Output
   Route (app)                    Size     First Load JS
   ┌ ○ /                         XXX kB        XXX kB
   ...
   ✓ Build completed successfully
   ```

### Step 3: Monitor GitHub Actions
1. Go to: `https://github.com/contact-prowebstudio/ProWeb-Studio/actions`
2. Click on latest workflow run
3. Verify all jobs pass:

#### Expected Results:
```
✅ CI / quality-checks (push)
   - Lint: ✅ PASSED
   - Type check: ✅ PASSED

✅ CI / bundle-size-check (push)
   - Build: ✅ PASSED (with SKIP_ENV_VALIDATION=true)
   - Analyze: ✅ PASSED

✅ CI / e2e-tests (push)
   - Wait for Vercel: ✅ PASSED
   - Run Playwright: ✅ PASSED

✅ Lighthouse CI / lighthouse-ci (push)
   - Wait for Vercel: ✅ PASSED
   - Run Lighthouse: ✅ PASSED
```

### Step 4: Test Deployed Site
```bash
# Get deployment URL from Vercel or GitHub Action output
# Example: https://pro-web-studio-abc123.vercel.app

# Test homepage
curl -I https://pro-web-studio-abc123.vercel.app/

# Expected response:
HTTP/2 200
content-type: text/html; charset=utf-8
x-vercel-cache: MISS
x-region: cdg1

# Test contact page (should load without errors)
curl https://pro-web-studio-abc123.vercel.app/contact
```

---

## Common Issues & Quick Fixes

### ❌ Issue: "Environment validation failed"
**Diagnosis:**
```bash
# Check Vercel build logs for:
❌ SITE_URL is not set
❌ RECAPTCHA_SECRET_KEY contains placeholder value
```

**Fix:**
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add missing variables for **Production** environment
3. Click "Redeploy" on latest deployment

---

### ❌ Issue: CI job "e2e-tests" fails with "baseURL not found"
**Diagnosis:**
```bash
# Check GitHub Actions logs for:
Error: baseURL is not set
```

**Fix:**
- Ensure `waitForDeployment` step succeeds
- Verify `PLAYWRIGHT_TEST_BASE_URL` is set from deployment output
- Check playwright.config.ts has `getBaseURL()` function

---

### ❌ Issue: "Some checks were not successful" in GitHub PR
**Diagnosis:**
- One or more CI jobs failed before fixes were applied

**Fix:**
1. Apply all code changes from this guide
2. Commit and push to trigger new CI run:
   ```bash
   git add .
   git commit -m "fix: Apply Vercel deployment fixes"
   git push
   ```
3. Wait for new CI run to complete

---

### ❌ Issue: Build succeeds on Vercel but fails in CI
**Diagnosis:**
- CI is not using `SKIP_ENV_VALIDATION=true`

**Fix:**
- Verify `.github/workflows/ci.yml` has:
  ```yaml
  env:
    SKIP_ENV_VALIDATION: 'true'
  ```
- Or add to specific job:
  ```yaml
  - name: Build
    run: npm run build
    env:
      SKIP_ENV_VALIDATION: 'true'
  ```

---

## Success Criteria

All of these should be ✅ GREEN:

### Vercel Dashboard
- [ ] Latest deployment status: **Ready** ✅
- [ ] No build errors in logs
- [ ] Site accessible at deployment URL
- [ ] Environment variables show in build logs (values hidden)

### GitHub Actions
- [ ] All CI jobs pass (4/4 checks)
- [ ] No red X marks in PR or commit status
- [ ] Playwright tests complete successfully
- [ ] Lighthouse CI completes successfully

### Site Functionality
- [ ] Homepage loads correctly
- [ ] Contact form accessible (3D canvas loads)
- [ ] No console errors in browser DevTools
- [ ] reCAPTCHA widget displays correctly
- [ ] Form submission works (sends to CONTACT_INBOX)

---

## Next Steps After Successful Deployment

1. **Custom Domain Setup** (if not using vercel.app):
   - Add domain in Vercel: Project Settings → Domains
   - Update DNS records per Vercel instructions
   - Update `SITE_URL` environment variable
   - Redeploy

2. **Analytics Verification**:
   - Visit deployed site
   - Check Plausible dashboard for pageviews
   - Verify events are being tracked

3. **Performance Monitoring**:
   - Review Lighthouse CI reports
   - Check Core Web Vitals in Vercel Analytics
   - Monitor bundle size reports

4. **Security Verification**:
   - Run security headers check: https://securityheaders.com/
   - Verify CSP headers are applied
   - Test reCAPTCHA on contact form

---

## Emergency Rollback

If deployment breaks production:

```bash
# Option 1: Rollback in Vercel Dashboard
1. Go to Deployments tab
2. Find last working deployment
3. Click three dots → "Promote to Production"

# Option 2: Revert Git commit
git revert HEAD
git push origin main
# Vercel will auto-deploy reverted version

# Option 3: Manual deployment of specific commit
vercel --prod --force
```

---

## Support & Documentation

- **Full Guide**: `docs/VERCEL_DEPLOYMENT_GUIDE.md`
- **Deployment Docs**: `docs/DEPLOY.md`
- **Environment Vars**: `.env.example`
- **Vercel Docs**: https://vercel.com/docs
- **GitHub Actions**: https://docs.github.com/en/actions

---

**Last Updated**: November 29, 2025
**Status**: ✅ Ready for deployment
