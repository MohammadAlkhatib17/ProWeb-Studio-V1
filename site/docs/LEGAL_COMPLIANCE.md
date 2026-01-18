# Dutch Legal Compliance

> AVG/GDPR, cookie consent, and business registration requirements

---

## Business Registration

### KVK (Chamber of Commerce)
- **Number:** 93769865
- **Verification:** https://www.kvk.nl/orderstraat/product-kiezen/?kvknummer=93769865

### BTW (VAT)
- **Number:** NL005041113B60
- **Displayed in:** Footer, contact page, Schema.org structured data

---

## Cookie Consent (AVG/GDPR)

### Implementation
- **Banner:** `CookieConsentBanner.tsx`
- **Analytics Loader:** `ConsentAwareAnalytics.tsx`
- **State Hook:** `useCookieConsent.ts`

### Compliance Checklist
- [x] Banner appears on first visit
- [x] Clear accept/reject options
- [x] Customization available
- [x] Analytics blocked until consent
- [x] Consent revocable at any time
- [x] Cookie preference persisted

### Cookie Types
| Category | Purpose | Blocked Before Consent |
|----------|---------|------------------------|
| Necessary | Site functionality | No |
| Analytics | Usage statistics | Yes |
| Marketing | Advertising | Yes (not implemented) |

---

## Privacy Requirements

### Data Processing
- Contact form: Name, email, message
- Storage: None locally (email forwarding only)
- Third parties: Plausible (analytics), Vercel (hosting)

### Privacy Statement
Located at `/privacy` — includes:
- Data controller information
- Types of data collected
- Purpose of processing
- Legal basis (legitimate interest / consent)
- Data subject rights
- Contact for privacy requests

### DSAR (Data Subject Access Requests)
Contact: contact@prowebstudio.nl

---

## Accessibility

### Requirements
- EN 301 549 (European standard)
- WCAG 2.1 Level AA

### Implementation
- Semantic HTML throughout
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast compliance (automated testing)
- Focus management in modals

### Testing
```bash
npm run test:e2e -- --grep="Accessibility"
```
Uses `@axe-core/playwright` for automated WCAG testing.

---

## Legal Pages

| Page | Route | Purpose |
|------|-------|---------|
| Privacy | `/privacy` | Privacy statement |
| Terms | `/voorwaarden` | Terms & conditions |
| Cookies | `/cookiebeleid` | Cookie policy |

---

## Schema.org Compliance

Dutch-specific schemas implemented:
- `Organization` with KVK identifier
- `LocalBusiness` with BTW/VAT
- Dutch service areas (provinces, cities)
- SBI business classification (62010)
- Compliance certifications

See: `src/components/schemas/dutch.ts`

---

## Checklist for New Deployments

- [ ] KVK number visible in footer
- [ ] BTW number visible in footer
- [ ] Privacy page accessible
- [ ] Cookie banner functional
- [ ] Analytics blocked pre-consent (verify in DevTools)
- [ ] Contact form sends to correct inbox
- [ ] reCAPTCHA configured

---

## Resources

- [Autoriteit Persoonsgegevens](https://autoriteitpersoonsgegevens.nl/) — Dutch DPA
- [KVK](https://www.kvk.nl/) — Chamber of Commerce
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) — Accessibility guidelines
