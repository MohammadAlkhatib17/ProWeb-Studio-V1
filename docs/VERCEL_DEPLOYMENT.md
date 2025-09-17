# Vercel Deployment Guide

- Root Directory: `site/` (Project Settings → General)
- Framework Preset: Next.js (auto)
- Build Command: default (`npm run build`)
- Output Directory: default (`.next`)
- Node.js: 18.17+ (Node 20 recommended)

Environment variables (Project Settings → Environment Variables):
- SITE_URL, NEXT_PUBLIC_SITE_URL
- NEXT_PUBLIC_RECAPTCHA_SITE_KEY, RECAPTCHA_SECRET_KEY
- BREVO_SMTP_USER, BREVO_SMTP_PASS, CONTACT_INBOX
- Optional: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, NEXT_PUBLIC_ENABLE_WEB_VITALS

Verification steps:
1) Confirm build runs from `site/` in logs
2) Check `/api/contact` works with reCAPTCHA and email
3) Validate headers and PWA in production
4) Validate contact form a11y: error messages announce via screen readers (role="alert"), and native validation is disabled (`noValidate`) for consistent server-side validation.
