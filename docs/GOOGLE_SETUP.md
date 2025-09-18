# Google Services Setup Guide

This guide covers the setup and configuration of Google services for ProWeb Studio, including Google Analytics 4 (GA4) and Google Search Console.

## Table of Contents

- [Overview](#overview)
- [Google Analytics 4 Setup](#google-analytics-4-setup)
- [Google Search Console Setup](#google-search-console-setup)
- [Environment Configuration](#environment-configuration)
- [Implementation Usage](#implementation-usage)
- [Troubleshooting](#troubleshooting)
- [Privacy Considerations](#privacy-considerations)

## Overview

The Google services integration is designed to be:
- **Optional**: No runtime impact if environment variables are not provided
- **Graceful**: Safe fallbacks when services are unavailable
- **Privacy-focused**: Tracking only when explicitly configured
- **Development-friendly**: Easy to disable for local development

## Google Analytics 4 Setup

### Step 1: Create GA4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click "Start measuring" or "Create Property"
4. Fill in your property details:
   - Property name: "ProWeb Studio" (or your site name)
   - Reporting time zone: Select your timezone
   - Currency: Select your currency
5. Choose "Web" as your platform
6. Enter your website URL and stream name

### Step 2: Get Measurement ID

1. In your GA4 property, go to **Admin** (gear icon)
2. Under **Property**, click **Data Streams**
3. Click on your web stream
4. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 3: Configure Environment Variable

Add the measurement ID to your environment configuration:

```bash
# In your .env.local file
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual measurement ID.

### Step 4: Verify Installation

1. Build and run your application
2. Visit your website
3. In GA4, go to **Reports** > **Realtime**
4. You should see your visit appear in real-time data

## Google Search Console Setup

### Step 1: Add Property

1. Go to [Google Search Console](https://search.google.com/search-console/)
2. Sign in with your Google account
3. Click "Add Property"
4. Choose **URL prefix** method
5. Enter your website URL (e.g., `https://prowebstudio.nl`)

### Step 2: Verify Ownership

Choose one of the verification methods:

#### Method 1: HTML File Upload (Recommended)
1. Download the verification file from Search Console
2. Replace the content of `public/google-verification.html` with the downloaded file content
3. Or rename `public/google-verification.html` to match the filename provided by Google
4. Click "Verify" in Search Console

#### Method 2: HTML Meta Tag
1. Copy the meta tag provided by Google Search Console
2. Add it to your website's `<head>` section
3. Click "Verify" in Search Console

#### Method 3: DNS Record
1. Add the TXT record to your domain's DNS settings
2. Wait for DNS propagation (can take up to 24 hours)
3. Click "Verify" in Search Console

### Step 3: Submit Sitemap

1. In Search Console, go to **Sitemaps**
2. Enter your sitemap URL: `https://yourdomain.com/sitemap.xml`
3. Click "Submit"

## Environment Configuration

### Required Environment Variables

```bash
# Google Analytics 4 (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Site URL (required for proper tracking)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Development vs Production

#### Development (.env.local)
```bash
# Disable analytics in development
# NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

#### Production (.env.production)
```bash
# Enable analytics in production
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Implementation Usage

### Basic Setup

The GA4 library is designed to work automatically without any code changes required. However, you can enhance tracking with custom events.

### Custom Event Tracking

```typescript
import { trackEvent, trackButtonClick, trackFormSubmit } from '@/lib/ga';

// Track custom events
trackEvent('newsletter_signup', 'engagement', 'header_form');

// Track button clicks
trackButtonClick('cta_button', 'hero_section');

// Track form submissions
trackFormSubmit('contact_form', true); // success = true
```

### React Hook Usage

```typescript
import { useGA4 } from '@/lib/ga';

function MyComponent() {
  const ga = useGA4();
  
  const handleClick = () => {
    ga.trackButtonClick('feature_button', 'services_section');
  };
  
  return (
    <button onClick={handleClick}>
      Learn More
    </button>
  );
}
```

### Safe Execution

```typescript
import { safeGA4, trackEvent } from '@/lib/ga';

// Safely execute GA4 functions
safeGA4(() => {
  trackEvent('complex_interaction', 'engagement');
});
```

### Page View Tracking

Page views are automatically tracked by Next.js router events when GA4 is properly configured. No additional code needed.

## Troubleshooting

### GA4 Not Tracking

**Check the console for messages:**
```
GA4: Measurement ID not provided, analytics disabled
GA4: Initialized with measurement ID: G-XXXXXXXXXX
```

**Common Issues:**
1. **Missing Environment Variable**: Ensure `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
2. **Wrong Measurement ID Format**: Should start with `G-`
3. **Build Cache**: Clear Next.js cache: `rm -rf .next`
4. **Ad Blockers**: Some users may have ad blockers preventing GA4

### Search Console Verification Failed

**Common Issues:**
1. **File Not Found**: Ensure verification file is in `public/` directory
2. **Wrong Filename**: Match the exact filename provided by Google
3. **Caching**: Clear CDN/browser cache
4. **DNS Propagation**: Wait up to 24 hours for DNS changes

### Events Not Appearing

**Debug Steps:**
1. Check browser console for errors
2. Verify `isGA4Enabled()` returns `true`
3. Use GA4 DebugView for real-time event debugging
4. Ensure events are called after GA4 initialization

## Privacy Considerations

### GDPR Compliance

When implementing GA4, consider:

1. **Cookie Consent**: Implement cookie consent banner
2. **Data Processing Agreement**: Review Google's data processing terms
3. **Privacy Policy**: Update privacy policy to mention GA4 usage
4. **User Rights**: Provide opt-out mechanisms

### Cookie Configuration

```typescript
// Configure GA4 for GDPR compliance
window.gtag('config', GA_MEASUREMENT_ID, {
  anonymize_ip: true,
  cookie_flags: 'SameSite=None;Secure',
  allow_google_signals: false, // Disable for stricter privacy
});
```

### Data Retention

Configure data retention settings in GA4:
1. Go to **Admin** > **Data Settings** > **Data Retention**
2. Set appropriate retention period (14 months recommended)
3. Enable "Reset on new activity" if desired

## Advanced Configuration

### Custom Dimensions

```typescript
// Track custom dimensions
window.gtag('config', GA_MEASUREMENT_ID, {
  custom_map: {
    dimension1: 'user_type',
    dimension2: 'content_category'
  }
});

// Send custom dimension data
trackEvent('page_view', 'engagement', undefined, undefined, {
  user_type: 'premium',
  content_category: 'tutorial'
});
```

### Enhanced Ecommerce (if applicable)

```typescript
// Track purchases
window.gtag('event', 'purchase', {
  transaction_id: '12345',
  value: 99.99,
  currency: 'EUR',
  items: [{
    item_id: 'service_1',
    item_name: 'Web Development',
    category: 'Services',
    quantity: 1,
    price: 99.99
  }]
});
```

## Security Notes

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Measurement ID**: While public, don't expose it unnecessarily
3. **Data Access**: Limit GA4 account access to necessary personnel
4. **Regular Audits**: Review GA4 settings and access regularly

## Support

For additional help:
- [Google Analytics Help Center](https://support.google.com/analytics/)
- [Google Search Console Help](https://support.google.com/webmasters/)
- [Next.js Analytics Documentation](https://nextjs.org/docs/messages/next-script-for-ga)

## Checklist

### GA4 Setup
- [ ] Created GA4 property
- [ ] Obtained measurement ID
- [ ] Added `NEXT_PUBLIC_GA_MEASUREMENT_ID` to environment
- [ ] Verified tracking in GA4 Realtime reports
- [ ] Configured data retention settings
- [ ] Updated privacy policy

### Search Console Setup
- [ ] Added property to Search Console
- [ ] Verified ownership using HTML file method
- [ ] Submitted sitemap
- [ ] Set up email notifications
- [ ] Configured international targeting (if applicable)

### Production Checklist
- [ ] Environment variables configured
- [ ] Analytics tracking verified
- [ ] Search Console verified
- [ ] Privacy policy updated
- [ ] Cookie consent implemented (if required)
- [ ] GDPR compliance reviewed
- [ ] Team access configured