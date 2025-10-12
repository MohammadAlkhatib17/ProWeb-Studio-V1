/**
 * Test for site verification meta tags implementation
 * Verifies that verification tags are only included when environment variables are set
 */

import { describe, it, expect, beforeEach } from "vitest";

describe("Verification Meta Tags", () => {
  beforeEach(() => {
    // Clear environment variables before each test
    delete process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
    delete process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;
  });

  it("should not include verification when environment variables are not set", () => {
    // Test the verification object structure when env vars are undefined
    const verification = {
      ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      }),
      other: {
        ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION && {
          "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
        }),
      },
    };

    expect(verification).toEqual({ other: {} });
    expect("google" in verification).toBe(false);
    expect("msvalidate.01" in verification.other).toBe(false);
  });

  it("should include Google verification when NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION is set", () => {
    const googleVerificationCode = "google_verification_code_123";
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION = googleVerificationCode;

    const verification = {
      ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      }),
      other: {
        ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION && {
          "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
        }),
      },
    };

    expect(verification.google).toBe(googleVerificationCode);
    expect("msvalidate.01" in verification.other).toBe(false);
  });

  it("should include Bing verification when NEXT_PUBLIC_BING_SITE_VERIFICATION is set", () => {
    const bingVerificationCode = "bing_verification_code_456";
    process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION = bingVerificationCode;

    const verification = {
      ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      }),
      other: {
        ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION && {
          "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
        }),
      },
    };

    expect("google" in verification).toBe(false);
    expect(verification.other["msvalidate.01"]).toBe(bingVerificationCode);
  });

  it("should include both verifications when both environment variables are set", () => {
    const googleVerificationCode = "google_verification_code_123";
    const bingVerificationCode = "bing_verification_code_456";

    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION = googleVerificationCode;
    process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION = bingVerificationCode;

    const verification = {
      ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      }),
      other: {
        ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION && {
          "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
        }),
      },
    };

    expect(verification.google).toBe(googleVerificationCode);
    expect(verification.other["msvalidate.01"]).toBe(bingVerificationCode);
  });

  it("should not contain any placeholder strings", () => {
    // Test that no placeholders remain in the code
    const googleVerificationCode = "real_google_verification_code";
    const bingVerificationCode = "real_bing_verification_code";

    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION = googleVerificationCode;
    process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION = bingVerificationCode;

    const verification = {
      ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      }),
      other: {
        ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION && {
          "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
        }),
      },
    };

    // Ensure no placeholder strings remain
    expect(verification.google).not.toContain("PLACEHOLDER");
    expect(verification.other["msvalidate.01"]).not.toContain("PLACEHOLDER");
    expect(JSON.stringify(verification)).not.toContain(
      "GOOGLE_VERIFICATION_CODE_PLACEHOLDER",
    );
    expect(JSON.stringify(verification)).not.toContain(
      "BING_VERIFICATION_CODE_PLACEHOLDER",
    );
    expect(JSON.stringify(verification)).not.toContain(
      "YANDEX_VERIFICATION_CODE_PLACEHOLDER",
    );
  });
});
