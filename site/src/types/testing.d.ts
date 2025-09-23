/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom/vitest';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare module 'vitest' {
  interface Assertion<T = unknown>
    extends jest.Matchers<void, T>,
      TestingLibraryMatchers<T, void> {}
  
  interface AsymmetricMatchersContaining
    extends jest.Matchers<void, unknown>,
      TestingLibraryMatchers<unknown, void> {}
}

// Global test utilities from Vitest
declare global {
  const describe: typeof import('vitest')['describe'];
  const it: typeof import('vitest')['it'];
  const expect: typeof import('vitest')['expect'];
  const beforeAll: typeof import('vitest')['beforeAll'];
  const beforeEach: typeof import('vitest')['beforeEach'];
  const afterAll: typeof import('vitest')['afterAll'];
  const afterEach: typeof import('vitest')['afterEach'];
  const vi: typeof import('vitest')['vi'];
}