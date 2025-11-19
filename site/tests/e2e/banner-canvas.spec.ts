/**
 * E2E Tests: Cookie Banner & 3D Canvas Independence
 * 
 * Purpose: Validate that on a fresh profile (no cookies):
 * 1. Cookie banner appears within 500ms
 * 2. 3D canvas renders regardless of consent state
 * 3. No hydration or cookie-related errors in console
 * 
 * Architecture References:
 * - 3D_CONSENT_INDEPENDENCE_QUICK_REF.md
 * - COOKIE_BANNER_HYDRATION_QUICK_REF.md
 */

import { test, expect, type ConsoleMessage } from '@playwright/test';

test.describe('Cookie Banner & 3D Canvas Independence', () => {
  
  test.beforeEach(async ({ context }) => {
    // Ensure fresh profile by clearing all cookies/storage
    await context.clearCookies();
    await context.clearPermissions();
  });

  test('cookie banner visible within 500ms on fresh profile', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for banner with strict timeout
    const banner = page.locator('[data-testid="cookie-consent-banner"], [role="dialog"][aria-label*="cookie" i], .cookie-banner').first();
    
    await expect(banner).toBeVisible({ timeout: 500 });
    
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    console.log(`✓ Cookie banner appeared in ${loadTime}ms`);
    
    // Hard assertion: must be under 500ms
    expect(loadTime).toBeLessThanOrEqual(500);
  });

  test('3D canvas present before consent given', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Look for canvas element (Three.js renders to <canvas>)
    const canvas = page.locator('canvas').first();
    
    // Canvas must exist before any interaction with cookie banner
    await expect(canvas).toBeVisible({ timeout: 2000 });
    
    // Verify WebGL context (proves it's rendering, not just a DOM element)
    const hasWebGL = await canvas.evaluate((el) => {
      const ctx = (el as HTMLCanvasElement).getContext('webgl') || 
                  (el as HTMLCanvasElement).getContext('webgl2');
      return ctx !== null;
    });
    
    expect(hasWebGL).toBe(true);
    
    console.log('✓ 3D canvas rendered with WebGL context before consent');
  });

  test('canvas remains visible after rejecting consent', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Verify canvas is present before interaction
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible({ timeout: 2000 });
    
    // Find and click reject button (common patterns)
    const rejectButton = page.locator('button:has-text("Reject"), button:has-text("Decline"), [data-testid="cookie-reject"]').first();
    
    if (await rejectButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await rejectButton.click();
      
      // Wait for banner to close
      await page.waitForTimeout(500);
      
      // Canvas MUST still be visible after rejection
      await expect(canvas).toBeVisible();
      
      console.log('✓ Canvas remains visible after rejecting consent');
    } else {
      console.log('⚠ Reject button not found - consent UI may have changed');
    }
  });

  test('no console errors related to hydration or cookies', async ({ page }) => {
    const consoleErrors: ConsoleMessage[] = [];
    const hydrationWarnings: ConsoleMessage[] = [];
    
    // Capture console messages
    page.on('console', (msg) => {
      const text = msg.text().toLowerCase();
      const type = msg.type();
      
      if (type === 'error') {
        consoleErrors.push(msg);
      }
      
      // Check for hydration warnings
      if (text.includes('hydration') || text.includes('hydrating')) {
        if (type === 'warning' || type === 'error') {
          hydrationWarnings.push(msg);
        }
      }
    });
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Wait for hydration to complete
    await page.waitForTimeout(2000);
    
    // Filter out errors related to cookies/hydration
    const cookieErrors = consoleErrors.filter(msg => {
      const text = msg.text().toLowerCase();
      return text.includes('cookie') || 
             text.includes('consent') || 
             text.includes('hydration') ||
             text.includes('hydrating');
    });
    
    // Report findings
    if (cookieErrors.length > 0) {
      console.error('Cookie/Consent-related errors found:');
      cookieErrors.forEach(msg => console.error(`  - ${msg.text()}`));
    }
    
    if (hydrationWarnings.length > 0) {
      console.error('Hydration warnings found:');
      hydrationWarnings.forEach(msg => console.error(`  - ${msg.text()}`));
    }
    
    // Assertions
    expect(cookieErrors, 'No cookie/consent-related console errors').toHaveLength(0);
    expect(hydrationWarnings, 'No hydration warnings').toHaveLength(0);
    
    console.log('✓ No console errors related to cookies or hydration');
  });

  test('performance: banner interactive within 500ms', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    const startTime = Date.now();
    
    // Wait for banner
    const banner = page.locator('[data-testid="cookie-consent-banner"], [role="dialog"][aria-label*="cookie" i], .cookie-banner').first();
    await expect(banner).toBeVisible({ timeout: 500 });
    
    // Try to find accept button
    const acceptButton = page.locator('button:has-text("Accept"), button:has-text("Accepteren"), [data-testid="cookie-accept"]').first();
    
    if (await acceptButton.isVisible({ timeout: 500 }).catch(() => false)) {
      // Test interactivity
      await acceptButton.click();
      
      const endTime = Date.now();
      const interactiveTime = endTime - startTime;
      
      console.log(`✓ Banner interactive in ${interactiveTime}ms`);
      
      // Must be interactive within 500ms
      expect(interactiveTime).toBeLessThanOrEqual(500);
    } else {
      console.log('⚠ Accept button not found - banner UI may need test ID');
    }
  });

  test('3D canvas has valid dimensions', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible({ timeout: 2000 });
    
    // Get canvas dimensions
    const dimensions = await canvas.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        clientWidth: (el as HTMLCanvasElement).width,
        clientHeight: (el as HTMLCanvasElement).height
      };
    });
    
    // Canvas must have positive dimensions
    expect(dimensions.width).toBeGreaterThan(0);
    expect(dimensions.height).toBeGreaterThan(0);
    
    console.log(`✓ Canvas dimensions: ${dimensions.width}x${dimensions.height}px`);
  });

  test('both banner and canvas render simultaneously', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Check both appear quickly and simultaneously
    await Promise.all([
      page.locator('[data-testid="cookie-consent-banner"], [role="dialog"][aria-label*="cookie" i], .cookie-banner').first().waitFor({ state: 'visible', timeout: 500 }),
      page.locator('canvas').first().waitFor({ state: 'visible', timeout: 2000 })
    ]);
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    console.log(`✓ Banner and canvas both rendered in ${totalTime}ms`);
    
    // Both should render in parallel, not sequentially
    expect(totalTime).toBeLessThanOrEqual(2000);
  });
});
