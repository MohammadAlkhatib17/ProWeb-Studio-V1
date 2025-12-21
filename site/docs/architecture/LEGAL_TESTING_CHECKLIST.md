# Dutch Legal Compliance - Testing Checklist

## Visual Testing

### Footer Legal Section
- [ ] Legal navigation appears above contact info in footer
- [ ] Links are displayed in order: Privacybeleid • Cookiebeleid • Algemene voorwaarden • Contact
- [ ] Links are properly styled (hover effects work)
- [ ] Links are underlined on hover
- [ ] Company info (KVK & BTW) displays below contact information
- [ ] Text is readable on all backgrounds (contrast check)

### Responsive Design
- [ ] **Mobile (< 640px)**: Legal links stack vertically or wrap properly
- [ ] **Tablet (640px - 1024px)**: Links remain accessible and well-spaced
- [ ] **Desktop (> 1024px)**: All elements align properly
- [ ] No horizontal scrolling on any screen size
- [ ] Touch targets are at least 44x44px on mobile

### Cookie Policy Page (`/cookiebeleid`)
- [ ] Page loads without errors
- [ ] All sections render correctly
- [ ] External links open in new tabs
- [ ] Breadcrumb or back navigation available
- [ ] Footer appears at bottom of page
- [ ] Page is scrollable on mobile

## Functional Testing

### Navigation
- [ ] Clicking "Privacybeleid" navigates to `/privacy`
- [ ] Clicking "Cookiebeleid" navigates to `/cookiebeleid`
- [ ] Clicking "Algemene voorwaarden" navigates to `/voorwaarden`
- [ ] Clicking "Contact" navigates to `/contact`
- [ ] All internal links use Next.js Link component (no full page reload)
- [ ] Browser back button works correctly

### Environment Variables
- [ ] With `NEXT_PUBLIC_KVK` set: KVK number displays correctly
- [ ] Without `NEXT_PUBLIC_KVK`: Shows "[Te bepalen]" placeholder
- [ ] With `NEXT_PUBLIC_BTW` set: BTW/VAT number displays correctly
- [ ] Without `NEXT_PUBLIC_BTW`: Shows "[Te bepalen]" placeholder

## Accessibility Testing (WCAG 2.1 AA)

### Keyboard Navigation
- [ ] Tab through all footer links in logical order
- [ ] Focus indicator is clearly visible on all links
- [ ] Enter key activates focused links
- [ ] No keyboard traps in footer
- [ ] Skip to main content link available

### Screen Reader Testing
- [ ] Legal navigation announced as "Juridische informatie navigation"
- [ ] All links have descriptive text
- [ ] Company info section is properly announced
- [ ] Heading hierarchy is correct (h2, h3 tags used properly)
- [ ] No empty links or buttons

### Visual Accessibility
- [ ] Text contrast ratio ≥ 4.5:1 for normal text
- [ ] Text contrast ratio ≥ 3:1 for large text
- [ ] Links are distinguishable from surrounding text
- [ ] Focus indicators have sufficient contrast
- [ ] No information conveyed by color alone

## SEO & Metadata Testing

### Cookie Policy Page
- [ ] Page title: "Cookiebeleid – ProWeb Studio"
- [ ] Meta description present and accurate
- [ ] `og:locale` set to `nl_NL`
- [ ] `og:type` set to `website`
- [ ] Canonical URL: `https://prowebstudio.nl/cookiebeleid`
- [ ] Hreflang tags: `nl`, `nl-NL`, `x-default`

### Check in Browser DevTools
```html
<html lang="nl">
<link rel="canonical" href="https://prowebstudio.nl/cookiebeleid" />
<link rel="alternate" hreflang="nl-NL" href="..." />
<meta property="og:locale" content="nl_NL" />
```

### Google Search Console
- [ ] Submit new cookie policy page for indexing
- [ ] Verify hreflang tags detected correctly
- [ ] Check for any crawl errors
- [ ] Verify mobile usability
- [ ] Confirm page is indexable (not blocked by robots.txt)

## Performance Testing

### Core Web Vitals
- [ ] No Cumulative Layout Shift (CLS) introduced in footer
- [ ] Footer loads without blocking main content
- [ ] Legal section doesn't cause reflow
- [ ] Images (if any) are optimized

### Lighthouse Audit
- [ ] Performance score ≥ 90
- [ ] Accessibility score = 100
- [ ] Best Practices score ≥ 90
- [ ] SEO score = 100

### Load Testing
- [ ] Footer renders in < 100ms
- [ ] Cookie policy page loads in < 2s (3G connection)
- [ ] No JavaScript errors in console
- [ ] No 404 errors for any links

## Legal Compliance Testing

### GDPR/AVG Compliance
- [ ] Cookie policy mentions data collection practices
- [ ] User rights are clearly explained
- [ ] Contact information for privacy questions provided
- [ ] Data retention periods mentioned
- [ ] Third-party cookies clearly identified

### Dutch ePrivacy
- [ ] Cookie consent banner integration works
- [ ] Cookie settings can be changed after initial consent
- [ ] Link to cookie policy from consent banner
- [ ] Non-essential cookies only after consent

### Content Accuracy
- [ ] All company information is accurate (when env vars set)
- [ ] All legal text is in Dutch
- [ ] No lorem ipsum or placeholder text in production
- [ ] Links to external privacy policies work
- [ ] Company registration numbers format correctly (NL prefix for BTW)

## Cross-Browser Testing

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Safari iOS (latest)
- [ ] Chrome Android (latest)
- [ ] Samsung Internet (if applicable)

### Test Points
- [ ] Footer layout consistent across browsers
- [ ] Legal links work in all browsers
- [ ] Focus states visible in all browsers
- [ ] No CSS rendering issues
- [ ] JavaScript features work (hover effects, etc.)

## Integration Testing

### Cookie Consent System
- [ ] Cookie settings button links to modal correctly
- [ ] Cookie policy link appears in consent banner
- [ ] Consent preferences are saved correctly
- [ ] Analytics load only after consent (if applicable)

### Internal Linking
- [ ] Legal pages link to each other where appropriate
- [ ] Footer appears on all pages consistently
- [ ] Navigation menu includes relevant legal links
- [ ] Sitemap includes new cookie policy page

## Production Deployment Checklist

### Pre-Deployment
- [ ] All tests above passed
- [ ] Environment variables configured in production
- [ ] Legal text reviewed by stakeholder/lawyer
- [ ] Translations verified by native Dutch speaker
- [ ] All links tested in production environment

### Post-Deployment
- [ ] Verify production site loads correctly
- [ ] Test all footer links on live site
- [ ] Check Google Analytics for errors
- [ ] Monitor for 404 errors in first 24 hours
- [ ] Submit sitemap to Google Search Console
- [ ] Verify social sharing (og:tags) works correctly

## Tools for Testing

### Automated Testing
- Lighthouse (Chrome DevTools)
- axe DevTools (Accessibility)
- WAVE Web Accessibility Evaluation Tool
- Google Mobile-Friendly Test
- PageSpeed Insights

### Manual Testing
- Screen readers: NVDA (Windows), VoiceOver (Mac/iOS)
- Browser DevTools (inspect HTML, check network)
- Responsive design mode in browsers
- Real device testing when possible

### Monitoring
- Google Search Console
- Plausible Analytics (if implemented)
- Server logs for 404 errors
- User feedback channels

---

**Last Updated:** October 19, 2025
**Status:** Ready for testing
**Priority:** High (Legal compliance)
