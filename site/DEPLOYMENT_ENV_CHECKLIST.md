# Production Deployment Environment Variables Checklist

## ⚠️ Critical Variables (Required for Production)

Before deploying to production, ensure these environment variables are set:

### 1. Site Configuration

```bash
SITE_URL=https://prowebstudio.nl
NEXT_PUBLIC_SITE_URL=https://prowebstudio.nl
SITE_NAME=ProWeb Studio
NEXT_PUBLIC_SITE_NAME=ProWeb Studio
```

**Why:** Used for canonical URLs, Open Graph, sitemaps, and metadata.

### 2. Contact Information

```bash
CONTACT_INBOX=contact@prowebstudio.nl
NEXT_PUBLIC_CONTACT_INBOX=contact@prowebstudio.nl
PHONE=+31686412430
NEXT_PUBLIC_PHONE=+31686412430
```

**Why:** Displayed in footer, contact page, schema.org structured data.  
**New:** `PHONE` variable now required (was previously hardcoded).

### 3. Analytics & Monitoring

```bash
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=prowebstudio.nl
NEXT_PUBLIC_ENABLE_WEB_VITALS=true
```

**Why:** Privacy-friendly analytics and Core Web Vitals monitoring.

### 4. Dutch Business Registration

```bash
NEXT_PUBLIC_KVK=93769865
NEXT_PUBLIC_BTW=NL005041113B60
```

**Why:** Legal compliance and schema.org LocalBusiness data.

---

## 🔒 Secret Variables (Never Commit)

```bash
# Email Service (Brevo)
BREVO_SMTP_USER=96686c002@smtp-brevo.com
BREVO_SMTP_PASS=xsmtpsib-***
BREVO_LIST_ID=3
BREVO_API_KEY=xkeysib-***

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeEacMr***
RECAPTCHA_SECRET_KEY=6LeEacMr***

# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=https://***
UPSTASH_REDIS_REST_TOKEN=***
```

---

## 🎯 Vercel-Specific Configuration

### Environment Variable Scope

| Variable | Development | Preview | Production |
|----------|-------------|---------|------------|
| `SITE_URL` | localhost:3000 | preview-url | prowebstudio.nl |
| `VERCEL_ENV` | development | preview | production |
| All secrets | ✅ Set | ✅ Set | ✅ Set |

### Setting Variables in Vercel

1. Navigate to project settings: **Settings → Environment Variables**
2. Add each variable with appropriate scope:
   - **Production:** Production deployments only
   - **Preview:** Preview deployments (branches)
   - **Development:** Local development (optional)
3. Click **Save** after each variable

---

## 🧪 Testing Environment Variables

### Local Development

1. Copy example file:
   ```bash
   cp site/.env.example site/.env.local
   ```

2. Fill in values:
   ```bash
   # Edit site/.env.local with your values
   SITE_URL=http://localhost:3000
   PHONE=+31686412430
   # ... other variables
   ```

3. Test:
   ```bash
   cd site
   npm run dev
   ```

### Verify Variables Loaded

```typescript
// In any server component or API route
console.log('SITE_URL:', process.env.SITE_URL);
console.log('PHONE:', process.env.PHONE);
```

---

## 🚨 Common Issues & Solutions

### Issue: "Missing PHONE variable"

**Solution:** Add to Vercel environment variables:
```
PHONE=+31686412430
NEXT_PUBLIC_PHONE=+31686412430
```

### Issue: Preview shows production domain

**Solution:** Ensure `VERCEL_ENV` is correctly set by Vercel (automatic).

### Issue: Hardcoded fallback values showing

**Solution:** Check that production environment variables are set in Vercel dashboard.

---

## ✅ Pre-Deployment Checklist

- [ ] All critical variables set in Vercel
- [ ] Secrets added to production scope only
- [ ] Preview deployments have correct `VERCEL_ENV=preview`
- [ ] Test production build locally: `npm run build && npm run start`
- [ ] Verify phone number from env (not placeholder)
- [ ] Verify email from env (not placeholder)
- [ ] Check robots.txt on preview (should block crawlers)
- [ ] Check robots.txt on production (should allow crawlers)
- [ ] Verify hreflang tags in page source
- [ ] Confirm `lang="nl"` on `<html>` tag

---

## 📊 Monitoring After Deployment

1. **Check Vercel Deployment Logs**
   - Look for environment variable warnings
   - Verify build completed successfully

2. **Test Production Site**
   ```bash
   # View source
   curl -I https://prowebstudio.nl
   
   # Check robots.txt
   curl https://prowebstudio.nl/robots.txt
   
   # Check meta tags
   curl -s https://prowebstudio.nl | grep -i "og:locale"
   ```

3. **Google Search Console**
   - Monitor hreflang tag recognition
   - Check for indexing errors
   - Verify Dutch language targeting

---

## 🔄 Rollback Procedure

If environment variables cause issues:

1. **Quick Fix:** Revert to previous deployment in Vercel dashboard
2. **Variable Fix:** Update specific variable and redeploy
3. **Full Rollback:** 
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

---

## 📝 Notes

- **Fallbacks:** All variables have safe fallbacks for development
- **Security:** Never commit `.env.local` to git (already in `.gitignore`)
- **PHONE:** New requirement as of this deployment
- **Preview Safety:** Preview deployments automatically get `noindex` robots

---

## 🆘 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Verify environment variables in Vercel dashboard
3. Test locally with `.env.local`
4. Review `NL_LOCALE_ENFORCEMENT_SUMMARY.md` for details

**Last Updated:** October 19, 2025  
**Version:** 1.0.0
