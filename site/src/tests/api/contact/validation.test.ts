import { describe, it, expect } from "vitest";
import { z } from "zod";

// Import the schema from the contact route
// We'll recreate it here for testing since it's not exported
const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name must not exceed 100 characters")
    .regex(/^[a-zA-ZÀ-ÿ\s\-'\.]+$/, "Name contains invalid characters"),
  email: z
    .string()
    .email("Invalid email address")
    .max(254, "Email address too long")
    .refine((email) => {
      // Block temporary/disposable email services
      const disposableProviders = [
        "10minutemail",
        "tempmail",
        "guerrillamail",
        "mailinator",
      ];
      return !disposableProviders.some((provider) => email.includes(provider));
    }, "Temporary email addresses are not allowed"),
  phone: z
    .string()
    .optional()
    .refine(
      (phone) => !phone || /^[\+]?[0-9\s\-\(\)]+$/.test(phone),
      "Invalid phone number format",
    ),
  projectTypes: z
    .array(z.string())
    .min(1, "Select at least one project type")
    .max(10, "Too many project types selected")
    .refine((types) => {
      const validTypes = [
        "website",
        "webshop",
        "webapp",
        "mobile-app",
        "seo",
        "hosting",
        "maintenance",
        "consulting",
      ];
      return types.every((type) => validTypes.includes(type));
    }, "Invalid project type selected"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters long")
    .max(5000, "Message too long")
    .refine((msg) => {
      // Block common spam patterns
      const spamPatterns = [
        /\b(viagra|cialis|pharmacy|casino|poker|loan|mortgage|bitcoin|crypto)\b/i,
        /\b(click here|visit now|act now|limited time|free money)\b/i,
        /(https?:\/\/[^\s]+){3,}/i, // Multiple URLs
        /(.)\1{10,}/i, // Repeated characters
      ];
      return !spamPatterns.some((pattern) => pattern.test(msg));
    }, "Message contains prohibited content"),
  // Honeypot field (validated later; allowing any string to reach logic)
  website: z.string().optional(),
  // reCAPTCHA token
  recaptchaToken: z.string().min(1, "reCAPTCHA verification required"),
  // Timestamp to prevent replay attacks
  timestamp: z.number().refine((timestamp) => {
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    return timestamp > now - fiveMinutes && timestamp <= now;
  }, "Form submission expired, please refresh and try again"),
});

describe("Contact Form Schema Validation", () => {
  const validPayload = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+31 6 12345678",
    projectTypes: ["website", "seo"],
    message: "This is a valid message that is longer than 10 characters.",
    website: "", // honeypot field
    recaptchaToken: "valid-recaptcha-token",
    timestamp: Date.now() - 1000, // 1 second ago
  };

  describe("Valid Payloads", () => {
    it("should accept a complete valid payload", () => {
      const result = contactSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("should accept payload without optional phone field", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { phone: _phone, ...payload } = validPayload;

      const result = contactSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("should accept payload with empty website field (honeypot)", () => {
      const payload = { ...validPayload, website: "" };

      const result = contactSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("should accept valid Dutch characters in name", () => {
      const payload = { ...validPayload, name: "André van der Berg" };

      const result = contactSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("should accept multiple valid project types", () => {
      const payload = {
        ...validPayload,
        projectTypes: ["website", "webshop", "webapp", "mobile-app"],
      };

      const result = contactSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });
  });

  describe("Invalid Name Field", () => {
    it("should reject name that is too short", () => {
      const payload = { ...validPayload, name: "A" };

      const result = contactSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Name must be at least 2 characters long",
        );
      }
    });

    it("should reject name that is too long", () => {
      const payload = { ...validPayload, name: "A".repeat(101) };

      const result = contactSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Name must not exceed 100 characters",
        );
      }
    });

    it("should reject name with invalid characters", () => {
      const payload = { ...validPayload, name: "John@Doe" };

      const result = contactSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Name contains invalid characters",
        );
      }
    });
  });

  describe("Invalid Email Field", () => {
    it("should reject invalid email format", () => {
      const payload = { ...validPayload, email: "invalid-email" };

      const result = contactSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Invalid email address");
      }
    });

    it("should reject email that is too long", () => {
      const longEmail = "a".repeat(250) + "@example.com";
      const payload = { ...validPayload, email: longEmail };

      const result = contactSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Email address too long");
      }
    });

    it("should reject disposable email addresses", () => {
      const payload = { ...validPayload, email: "test@tempmail.com" };

      const result = contactSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Temporary email addresses are not allowed",
        );
      }
    });
  });

  describe("Invalid Phone Field", () => {
    it("should reject invalid phone format", () => {
      const payload = { ...validPayload, phone: "invalid-phone" };

      const result = contactSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Invalid phone number format",
        );
      }
    });

    it("should accept valid international phone formats", () => {
      const testCases = [
        "+31 6 12345678",
        "+1 555 123 4567",
        "06-12345678",
        "(555) 123-4567",
      ];

      testCases.forEach((phone) => {
        const payload = { ...validPayload, phone };
        const result = contactSchema.safeParse(payload);
        expect(result.success).toBe(true);
      });
    });
  });

  describe("Invalid Project Types", () => {
    it("should reject empty project types array", () => {
      const payload = { ...validPayload, projectTypes: [] };

      const result = contactSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Select at least one project type",
        );
      }
    });

    it("should reject too many project types", () => {
      const payload = {
        ...validPayload,
        projectTypes: new Array(11).fill("website"),
      };

      const result = contactSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Too many project types selected",
        );
      }
    });

    it("should reject invalid project types", () => {
      const payload = { ...validPayload, projectTypes: ["invalid-type"] };

      const result = contactSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Invalid project type selected",
        );
      }
    });
  });

  describe("Invalid Message Field", () => {
    it("should reject message that is too short", () => {
      const payload = { ...validPayload, message: "Short" };

      const result = contactSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Message must be at least 10 characters long",
        );
      }
    });

    it("should reject message that is too long", () => {
      const payload = { ...validPayload, message: "A".repeat(5001) };

      const result = contactSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Message too long");
      }
    });

    it("should reject messages with spam content - viagra", () => {
      const payload = {
        ...validPayload,
        message: "Buy viagra now for cheap prices!",
      };
      const result = contactSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Message contains prohibited content",
        );
      }
    });

    it("should reject messages with spam content - free money", () => {
      const payload = {
        ...validPayload,
        message: "Click here to win free money!",
      };
      const result = contactSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Message contains prohibited content",
        );
      }
    });

    it("should reject messages with spam content - casino", () => {
      const payload = {
        ...validPayload,
        message: "Visit casino for poker games",
      };
      const result = contactSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Message contains prohibited content",
        );
      }
    });

    it("should reject messages with spam content - multiple URLs", () => {
      const payload = {
        ...validPayload,
        message:
          "Visit https://spam1.comhttps://spam2.comhttps://spam3.com now!",
      };
      const result = contactSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Message contains prohibited content",
        );
      }
    });

    it("should reject messages with spam content - repeated characters", () => {
      const payload = { ...validPayload, message: "AAAAAAAAAAAAAAAAAAAA" }; // 20 repeated A's
      const result = contactSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Message contains prohibited content",
        );
      }
    });
  });

  describe("Invalid reCAPTCHA Token", () => {
    it("should reject empty reCAPTCHA token", () => {
      const payload = { ...validPayload, recaptchaToken: "" };

      const result = contactSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "reCAPTCHA verification required",
        );
      }
    });

    it("should reject missing reCAPTCHA token", () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { recaptchaToken: _recaptchaToken, ...payload } = validPayload;

      const result = contactSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe("Invalid Timestamp", () => {
    it("should reject expired timestamp", () => {
      const sixMinutesAgo = Date.now() - 6 * 60 * 1000;
      const payload = { ...validPayload, timestamp: sixMinutesAgo };

      const result = contactSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Form submission expired, please refresh and try again",
        );
      }
    });

    it("should reject future timestamp", () => {
      const future = Date.now() + 1000;
      const payload = { ...validPayload, timestamp: future };

      const result = contactSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Form submission expired, please refresh and try again",
        );
      }
    });

    it("should accept recent valid timestamp", () => {
      const recent = Date.now() - 30 * 1000; // 30 seconds ago
      const payload = { ...validPayload, timestamp: recent };

      const result = contactSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });
  });
});
