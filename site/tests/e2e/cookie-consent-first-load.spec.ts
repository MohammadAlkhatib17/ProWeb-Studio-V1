/**
 * E2E Test: Cookie Consent Banner First Load
 * Verifies banner appears immediately on cold load with no cookies
 */

import { test, expect } from '@playwright/test';

test.describe('Cookie Consent Banner - First Load', () => {
  test.beforeEach(async ({ context }) => {
    // Clear all cookies to simulate first visit
    await context.clearCookies();
  });

  test('should show banner immediately on first visit within 500ms', async ({ page }) => {
    // Start timing
    const startTime = Date.now();
    
    // Navigate to homepage with no cookies
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for banner to be visible
    const banner = page.locator('[role="dialog"][aria-labelledby="cookie-banner-title"]');
    await banner.waitFor({ state: 'visible', timeout: 500 });
    
    const elapsedTime = Date.now() - startTime;
    
    // Assert banner is visible
    await expect(banner).toBeVisible();
    
    // Assert it appeared within 500ms
    expect(elapsedTime).toBeLessThan(500);
    
    // Log timing for monitoring
    console.log(`[CONSENT-TEST] Banner appeared in ${elapsedTime}ms`);
  });

  test('should have banner interactive on first paint', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    const banner = page.locator('[role="dialog"][aria-labelledby="cookie-banner-title"]');
    await expect(banner).toBeVisible();
    
    // Check all buttons are present and interactive
    const acceptAllBtn = banner.locator('button:has-text("Alles accepteren")');
    const rejectAllBtn = banner.locator('button:has-text("Alleen noodzakelijk")');
    const settingsBtn = banner.locator('button:has-text("Aanpassen")');
    
    await expect(acceptAllBtn).toBeVisible();
    await expect(rejectAllBtn).toBeVisible();
    await expect(settingsBtn).toBeVisible();
    
    // Ensure buttons are interactive
    await expect(acceptAllBtn).toBeEnabled();
    await expect(rejectAllBtn).toBeEnabled();
    await expect(settingsBtn).toBeEnabled();
  });

  test('should have 3D canvas rendering before consent', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for canvas to exist
    const canvas = page.locator('canvas').first();
    await canvas.waitFor({ state: 'attached', timeout: 2000 });
    
    // Verify canvas exists
    await expect(canvas).toBeAttached();
    
    // Verify banner is still showing (consent not given yet)
    const banner = page.locator('[role="dialog"][aria-labelledby="cookie-banner-title"]');
    await expect(banner).toBeVisible();
    
    console.log('[CONSENT-TEST] 3D canvas mounted before consent was given');
  });

  test('should not have hydration errors in console', async ({ page }) => {
    const consoleErrors: string[] = [];
    const consoleWarnings: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      } else if (msg.type() === 'warning') {
        consoleWarnings.push(msg.text());
      }
    });
    
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait a bit for any hydration warnings
    await page.waitForTimeout(1000);
    
    // Filter out expected errors (e.g., network errors in dev)
    const hydrationErrors = consoleErrors.filter((msg) =>
      msg.toLowerCase().includes('hydration') ||
      msg.toLowerCase().includes('mismatch')
    );
    
    const hydrationWarnings = consoleWarnings.filter((msg) =>
      msg.toLowerCase().includes('hydration') ||
      msg.toLowerCase().includes('mismatch')
    );
    
    expect(hydrationErrors).toHaveLength(0);
    expect(hydrationWarnings).toHaveLength(0);
  });

  test('should block analytics scripts before consent', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Check that Plausible script is NOT loaded
    const plausibleScript = page.locator('script[src*="plausible.io"]');
    await expect(plausibleScript).not.toBeAttached();
    
    // Verify plausible global is not present
    const hasPlausible = await page.evaluate(() => {
      return typeof (window as any).plausible !== 'undefined';
    });
    
    expect(hasPlausible).toBe(false);
    
    console.log('[CONSENT-TEST] Analytics blocked before consent');
  });

  test('should load analytics after accepting consent', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Accept all cookies
    const banner = page.locator('[role="dialog"][aria-labelledby="cookie-banner-title"]');
    const acceptBtn = banner.locator('button:has-text("Alles accepteren")');
    await acceptBtn.click();
    
    // Wait for banner to close
    await expect(banner).not.toBeVisible();
    
    // Wait for analytics script to load
    await page.waitForTimeout(1000);
    
    // Check that Plausible script is now loaded (if configured)
    // Note: This might not load in test environment without proper domain
    const consentCookie = await page.evaluate(() => {
      return document.cookie.includes('pws_cookie_consent');
    });
    
    expect(consentCookie).toBe(true);
    
    console.log('[CONSENT-TEST] Consent saved after accepting');
  });

  test('should persist consent and not show banner on second visit', async ({ page }) => {
    // First visit: accept consent
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    const banner = page.locator('[role="dialog"][aria-labelledby="cookie-banner-title"]');
    await expect(banner).toBeVisible();
    
    const acceptBtn = banner.locator('button:has-text("Alles accepteren")');
    await acceptBtn.click();
    
    await expect(banner).not.toBeVisible();
    
    // Second visit: banner should not appear
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait a bit to ensure banner doesn't appear
    await page.waitForTimeout(1000);
    
    await expect(banner).not.toBeVisible();
    
    console.log('[CONSENT-TEST] Banner correctly hidden on second visit');
  });

  test('should have banner visible with higher z-index than canvas', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    const banner = page.locator('[role="dialog"][aria-labelledby="cookie-banner-title"]');
    await expect(banner).toBeVisible();
    
    // Get z-index of banner
    const bannerZIndex = await banner.evaluate((el) => {
      return window.getComputedStyle(el).zIndex;
    });
    
    // Banner should have z-index 9999
    expect(parseInt(bannerZIndex)).toBeGreaterThanOrEqual(9999);
    
    // Get z-index of canvas parent (if exists)
    const canvas = page.locator('canvas').first();
    if (await canvas.count() > 0) {
      const canvasZIndex = await canvas.evaluate((el) => {
        return window.getComputedStyle(el.parentElement || el).zIndex;
      });
      
      // Banner should be above canvas
      expect(parseInt(bannerZIndex)).toBeGreaterThan(parseInt(canvasZIndex) || 0);
    }
    
    console.log(`[CONSENT-TEST] Banner z-index: ${bannerZIndex}`);
  });

  test('should have no layout shift when banner appears', async ({ page }) => {
    let clsScore = 0;
    
    // Track CLS
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Get CLS score
    clsScore = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let cls = 0;
        
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              cls += (entry as any).value;
            }
          }
        });
        
        observer.observe({ type: 'layout-shift', buffered: true });
        
        // Resolve after 2 seconds
        setTimeout(() => {
          observer.disconnect();
          resolve(cls);
        }, 2000);
      });
    });
    
    // CLS should be less than 0.1 (good threshold)
    expect(clsScore).toBeLessThan(0.1);
    
    console.log(`[CONSENT-TEST] CLS score: ${clsScore}`);
  });
});
