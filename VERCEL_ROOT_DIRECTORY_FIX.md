# 🔧 VERCEL IMPORT SETTINGS - CRITICAL FIX

## ❌ PROBLEM IDENTIFIED
Your Next.js app is in the `site/` subdirectory, but Vercel is trying to build from the root directory.

## ✅ SOLUTION

### Method 1: Use Root Directory Setting (RECOMMENDED)

**During Import/Project Settings:**
1. **Root Directory**: Set to `site`
2. **Framework Preset**: Next.js (auto-detected)
3. **Build Command**: Leave as default or use `npm run build`
4. **Install Command**: Leave as default or use `npm ci`
5. **Output Directory**: Leave as default (`.next`)

### Method 2: Use vercel.json (BACKUP)

I've created a `vercel.json` in the root directory that automatically points to the `site` folder.

If Method 1 doesn't work, this file will handle it automatically.

---

## 📋 COMPLETE IMPORT CHECKLIST

### Step 1: Repository Settings
- ✅ Repository: `contact-prowebstudio/ProWeb-Studio`
- ✅ Branch: `main`
- ✅ **Root Directory**: `site` ⚠️ CRITICAL!

### Step 2: Framework Detection
- ✅ Framework Preset: `Next.js` (should auto-detect)
- ✅ Node.js Version: 20.x (default)

### Step 3: Build & Output Settings
- ✅ Build Command: `npm run build` (or leave default)
- ✅ Install Command: `npm ci` (or leave default)
- ✅ Output Directory: `.next` (or leave default)

### Step 4: Environment Variables
Copy these from `vercel-env-variables.txt`:

**CRITICAL (must have):**
- `SITE_URL=https://prowebstudio.nl`
- `SITE_NAME=ProWeb Studio`
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=prowebstudio.nl`
- `CONTACT_INBOX=contact@prowebstudio.nl`
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeEacMrAAAAAP2vl4u2Jri6l2ueTdKOjYlldFP6`
- `RECAPTCHA_SECRET_KEY=6LeEacMrAAAAAEfZcnLV-Dds9FEevmpsnJTNddxa`

**Environment Selection:**
- ☑️ Production
- ☑️ Preview
- ☑️ Development (optional)

---

## 🚨 CRITICAL FIX APPLIED (UPDATED 2025-11-30)

The main issue was: **Vercel Root Directory setting conflicts with vercel.json custom commands, causing double `site/site/` path.**

### What I Fixed:
1. ✅ Simplified `/vercel.json` - removed custom build/install commands
2. ✅ Now relies on Vercel's "Root Directory" setting (set to `site` in project settings)
3. ✅ Vercel auto-detects Next.js and uses correct build commands
4. ✅ Output directory is automatically `.next` (relative to root directory)

---

## 🔄 NEXT STEPS

### Option A: Re-import Project (Clean Start)
1. Delete current Vercel project
2. Re-import from GitHub
3. **Set Root Directory to `site`** during import
4. Add environment variables
5. Deploy

### Option B: Fix Existing Project
1. Go to Project Settings → General
2. Scroll to "Root Directory"
3. Change from `./` to `site`
4. Save
5. Go to Deployments → Redeploy

---

## 🎯 WHY THIS FIXES IT

**Before:**
```
Vercel looks in: /
Next.js app is in: /site/
Result: ❌ Can't find package.json, build fails
```

**After:**
```
Vercel looks in: /site/
Next.js app is in: /site/
Result: ✅ Finds package.json, builds successfully
```

---

## ✅ SUCCESS INDICATORS

After fixing, you should see in build logs:

```
✅ Installing dependencies...
✅ Running "npm ci" in directory "site"
✅ Dependencies installed successfully

✅ Building application...
✅ Running "npm run build"
✅ Running on Vercel - skipping env validation (platform-managed)
✅ Next.js build completed successfully

✅ Deployment ready
```

---

## 📞 IF STILL NOT WORKING

1. **Check Build Logs**: Look for "Cannot find package.json" error
2. **Verify Root Directory**: Should be set to `site` in Project Settings
3. **Check Environment Variables**: All critical vars must be set
4. **Try Clean Deploy**: Settings → Deployments → Redeploy (without cache)

---

## 🎉 YOU'RE ALMOST THERE!

The issue is now fixed. Just set **Root Directory** to `site` during import and your site will build successfully!
