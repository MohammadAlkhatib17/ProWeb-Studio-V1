/// <reference types="vitest" />
import { afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import 'jest-axe/extend-expect';

// Cleanup React DOM between tests
afterEach(() => {
  cleanup();
});

// Provide default envs for tests where not explicitly mocked
process.env.RECAPTCHA_SECRET_KEY ||= 'test-secret-key';
process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||= 'test-site-key';
process.env.SITE_URL ||= 'http://localhost:3000';
process.env.NEXT_PUBLIC_SITE_URL ||= 'http://localhost:3000';

// Minimal grecaptcha shim if a test did not provide one
if (typeof window !== 'undefined' && !(window as any).grecaptcha) {
  (window as any).grecaptcha = {
    ready: (cb: () => void) => cb(),
    execute: async () => 'test-recaptcha-token',
  };
}
