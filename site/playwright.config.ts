import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Test Configuration
 * 
 * Purpose: CI-optimized browser testing for cookie banner & 3D canvas
 * Budget: <3 minutes total CI time
 * 
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  
  /* Opt out of parallel tests on CI for stability */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use */
  reporter: process.env.CI ? 'list' : 'html',
  
  /* Shared settings for all projects */
  use: {
    /* Base URL for navigation */
    baseURL: 'http://localhost:3000',
    
    /* Collect trace on first retry */
    trace: 'on-first-retry',
    
    /* Screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Video on failure */
    video: 'retain-on-failure',
    
    /* Viewport size */
    viewport: { width: 1280, height: 720 },
    
    /* Ignore HTTPS errors (for localhost) */
    ignoreHTTPSErrors: true,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Headless mode for CI
        headless: true,
      },
    },
  ],

  /* Run local dev server before starting tests */
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 minutes for build + start
    stdout: 'pipe',
    stderr: 'pipe',
  },
  
  /* Global timeout for each test */
  timeout: 30 * 1000, // 30 seconds per test
  
  /* Expect timeout for assertions */
  expect: {
    timeout: 10 * 1000, // 10 seconds for assertions
  },
});
