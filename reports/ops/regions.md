# API Routes Regional Configuration

This document provides a comprehensive mapping of all API routes and their regional deployment configuration to ensure EU data locality compliance.

## Route Configuration Overview

| Route | Runtime | Preferred Region | Status | Purpose |
|-------|---------|------------------|--------|---------|
| `/api/vitals` | `nodejs` | `fra1` | ✅ Configured | Web Vitals analytics collection |
| `/api/csp-report` | `nodejs` | `fra1` | ✅ Configured | Content Security Policy violation reporting |
| `/api/contact` | `nodejs` | `fra1` | ✅ Configured | Contact form submission and email processing |
| `/api/subscribe` | `nodejs` | `fra1` | ✅ Configured | Newsletter subscription via Brevo API |

## Regional Configuration Details

### Frankfurt Region (fra1)
All API routes are configured to deploy to the **Frankfurt (fra1)** region, which provides:

- **Geographic Location**: Frankfurt, Germany 🇩🇪
- **Compliance**: Full EU GDPR compliance
- **Data Residency**: All data processing remains within EU borders
- **Latency**: Optimized for European users
- **Infrastructure**: Vercel's Frankfurt edge region

### Runtime Configuration
All API routes use **Node.js runtime** (`runtime = 'nodejs'`) for:
- Full Node.js API compatibility
- Access to server-side libraries (nodemailer, etc.)
- Complex business logic processing
- Database and external API integrations

## EU Data Locality Compliance

### Privacy Posture Confirmation ✅

**ProWeb Studio's API infrastructure is fully compliant with EU data protection requirements:**

1. **Data Processing Location**
   - All API routes execute in Frankfurt, Germany (fra1)
   - No data crosses EU borders during processing
   - Server-side computations remain within EU jurisdiction

2. **External Service Integration**
   - **Email Service**: Brevo (EU-based email service provider)
   - **Analytics**: Plausible (EU-based, privacy-first analytics)
   - **CSP Reporting**: Server-side logging within EU infrastructure

3. **Data Flow Compliance**
   ```
   User (EU) → Vercel Edge (fra1) → API Route (fra1) → External EU Services
   ```
   - All data flows remain within EU regulatory boundaries
   - No third-party data processors outside EU jurisdiction
   - Minimal data collection with explicit consent

4. **Technical Safeguards**
   - `preferredRegion: 'fra1'` enforces EU deployment
   - Server-side validation and sanitization
   - Secure data transmission (HTTPS/TLS)
   - No client-side tracking without consent

## Route-Specific Data Handling

### `/api/vitals` - Web Vitals Collection
**Data Type**: Performance metrics (anonymous)
**Processing**: 
- Collects Core Web Vitals for performance monitoring
- Forwards anonymized metrics to Plausible Analytics (EU)
- No personally identifiable information stored

**EU Compliance**: ✅ Anonymous performance data, no PII

### `/api/csp-report` - Security Violation Reporting  
**Data Type**: Security policy violations
**Processing**:
- Logs CSP violations for security monitoring
- Temporary server-side logging for analysis
- IP addresses anonymized in logs

**EU Compliance**: ✅ Security logging with data minimization

### `/api/contact` - Contact Form Processing
**Data Type**: Contact information (name, email, message)
**Processing**:
- Validates and sanitizes form submissions
- Sends emails via Brevo (EU-based service)
- Implements anti-spam and security measures
- No permanent storage of form data

**EU Compliance**: ✅ Explicit consent, minimal processing, EU service providers

### `/api/subscribe` - Newsletter Subscription
**Data Type**: Email addresses for newsletter subscription
**Processing**:
- Validates email format and domain
- Integrates with Brevo API for list management
- Provides unsubscribe mechanisms
- Double opt-in process

**EU Compliance**: ✅ Explicit consent, right to unsubscribe, EU-based processor

## Monitoring and Maintenance

### Regional Configuration Verification
To verify all routes are properly configured for EU deployment:

```bash
# Check all API route configurations
grep -r "preferredRegion" site/src/app/api/
grep -r "runtime" site/src/app/api/
```

Expected output should show `fra1` for all routes.

### Deployment Validation
Monitor deployment logs to ensure routes are deployed to the correct region:
- Vercel deployment dashboard shows function region
- Server logs indicate processing location
- Response headers can include region information

### Privacy Compliance Checklist

- [x] All API routes configured for EU region (fra1)
- [x] No data processing outside EU jurisdiction  
- [x] EU-based external service providers only
- [x] Minimal data collection with explicit consent
- [x] Secure data transmission and storage
- [x] User rights implementation (unsubscribe, data access)
- [x] Regular privacy compliance reviews

## Configuration Management

### Environment Variables
Regional configuration is managed through:
- Route-level exports (`preferredRegion`)
- Environment-specific deployment settings
- Vercel project configuration

### Updating Regional Settings
To modify regional settings:

1. Update route files: `export const preferredRegion = 'fra1'`
2. Verify in deployment logs
3. Update this documentation
4. Test data flow compliance

### Emergency Procedures
In case of regional compliance issues:
1. Immediate deployment rollback capability
2. Data audit and compliance verification
3. Notification to data protection officer
4. Documentation of incident and resolution

---

**Last Updated**: September 18, 2025  
**Configuration Version**: 1.0  
**Compliance Review**: Q3 2025  
**Next Review**: Q1 2026

**Compliance Officer**: ProWeb Studio Team  
**Data Protection Contact**: [privacy@proweb-studio.nl]

---

*This document confirms that ProWeb Studio's API infrastructure maintains full EU data locality and GDPR compliance through strategic regional deployment and careful service provider selection.*