# Security Headers Environment Configuration

## CSP_REPORT_ONLY Environment Variable

The `CSP_REPORT_ONLY` environment variable controls whether the Content Security Policy is enforced or operates in report-only mode.

### Values:

- `CSP_REPORT_ONLY=true`: Enables report-only mode
  - Uses `Content-Security-Policy-Report-Only` header
  - Violations are reported but not blocked
  - Recommended for staging/testing environments

- `CSP_REPORT_ONLY=false` or unset: Enables enforcement mode
  - Uses `Content-Security-Policy` header
  - Violations are blocked
  - Recommended for production environments

### Example Usage:

**Staging Environment:**

```bash
CSP_REPORT_ONLY=true
```

**Production Environment:**

```bash
CSP_REPORT_ONLY=false
# or simply omit the variable
```

### Testing CSP Configuration:

1. **Start in report-only mode** to identify violations without breaking functionality
2. **Monitor `/api/csp-report`** endpoint for violation reports
3. **Fix identified issues** by updating CSP policies or code
4. **Switch to enforcement mode** once violations are resolved

### CSP Violation Reports:

All violations are sent to `/api/csp-report` which logs:

- Blocked URI
- Violated directive
- Source file and line number
- User agent and IP (anonymized)
- Timestamp and CSP mode

This data helps identify legitimate resources that need to be allowlisted or security issues that need to be addressed.
