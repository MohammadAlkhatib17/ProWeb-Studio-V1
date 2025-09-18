# API Error Handling Security Report

## Overview

This document describes the secure error handling implementation for ProWeb Studio's API endpoints to prevent leakage of internal system details while maintaining proper logging for debugging.

## Security Principles

1. **Generic Client Messages**: All API responses to clients use generic, user-friendly messages in Dutch
2. **Detailed Server Logging**: Complete error details are logged server-side for debugging
3. **No Cache Policy**: All API responses include `Cache-Control: no-store` header
4. **No Internal Data Exposure**: No stack traces, database errors, or service details exposed to clients

## API Endpoints

### `/api/contact` (Contact Form)

#### Client-Facing Error Messages:
- **Validation Failure**: `"Formulier gegevens zijn ongeldig. Controleer alle velden en probeer opnieuw."`
- **reCAPTCHA Failure**: `"Beveiligingsverificatie mislukt. Probeer opnieuw."`
- **Server Error**: `"Er is een fout opgetreden bij het verzenden van uw bericht. Probeer het later opnieuw."`
- **Success**: `"Bericht succesvol verzonden"`

#### Server-Side Logging:
```typescript
// Validation errors with detailed validation results
console.warn(`Invalid contact form submission from ${clientIP}:`, parsed.error.flatten());

// reCAPTCHA failures with IP tracking
console.warn(`reCAPTCHA verification failed from ${clientIP}`);

// Successful submissions with message ID for tracking
console.log(`Contact form submitted successfully from ${clientIP}: ${info.messageId}`);

// Server errors with full error details
console.error('Error sending contact email:', error);
```

### `/api/subscribe` (Newsletter Subscription)

#### Client-Facing Error Messages:
- **Configuration Error**: `"Service tijdelijk niet beschikbaar. Probeer het later opnieuw."`
- **Invalid Email**: `"Ongeldig e-mailadres opgegeven."`
- **Brevo API Error**: `"Inschrijving mislukt. Probeer het later opnieuw."`
- **Server Error**: `"Inschrijving mislukt. Probeer het later opnieuw."`
- **Success**: `"Successfully subscribed!"`

#### Server-Side Logging:
```typescript
// Configuration issues
console.error('Brevo API key or List ID is not configured in .env.local');

// Successful subscriptions with email and list ID
console.log(`[Newsletter Subscription] Successfully added ${email} to list ID ${listId}.`);

// Brevo API errors with status and email context
console.error(`[Brevo API Error] Status: ${response.status}, Email: ${email}`, errorData);

// General errors with full context
console.error('[API/SUBSCRIBE] Error:', error);
```

### `/api/vitals` (Web Vitals Analytics)

#### Client-Facing Messages:
- **Success/Error**: `{ "success": true }` (Always returns success to avoid affecting UX)

#### Server-Side Logging:
- Analytics errors are silently caught to prevent affecting user experience
- No explicit logging to avoid noise in analytics endpoint

## Security Improvements Implemented

### Before (Security Issues):
1. **Contact API**: Exposed validation details via `parsed.error.flatten()`
2. **Contact API**: Returned internal `messageId` in response
3. **Contact API**: Exposed error messages based on environment mode
4. **Subscribe API**: Directly returned Brevo API error messages
5. **Subscribe API**: Exposed internal error objects to clients
6. **Vitals API**: Missing Cache-Control headers

### After (Secure Implementation):
1. ✅ All validation errors return generic messages to clients
2. ✅ Message IDs logged server-side only, not exposed to clients  
3. ✅ All errors return consistent generic messages regardless of environment
4. ✅ Third-party API errors logged but not exposed to clients
5. ✅ Complete error context preserved in server logs for debugging
6. ✅ All API responses include `Cache-Control: no-store` header

## Cache Control Implementation

All API endpoints now include the `Cache-Control: no-store` header:

```typescript
response.headers.set('Cache-Control', 'no-store');
```

This ensures:
- API responses are never cached by browsers or proxies
- Sensitive data doesn't persist in caches
- Fresh responses for each request

## Example Error Flow

### Client Request with Invalid Data:
```json
// Client sends invalid email to /api/subscribe
{ "email": "invalid-email" }
```

### Client Response (Generic):
```json
{
  "ok": false,
  "error": "Ongeldig e-mailadres opgegeven."
}
```

### Server Logs (Detailed):
```
[Validation Error] Invalid email format for subscription request from 192.168.1.100
Zod validation error: { email: ["Invalid email address"] }
```

## Security Benefits

1. **Information Disclosure Prevention**: No internal system details leaked to attackers
2. **Professional User Experience**: Clear, user-friendly error messages in Dutch
3. **Full Debug Capability**: Complete error context preserved for developers
4. **Cache Security**: No sensitive API data cached anywhere
5. **Consistent Response Format**: Predictable error handling across all endpoints

## Monitoring & Alerting

Consider implementing alerts for:
- High frequency of validation errors (potential attack)
- reCAPTCHA failures (bot detection)
- Service configuration errors
- Third-party API failures

## Last Updated
September 18, 2025 - Initial secure error handling implementation