import { test, expect } from "@playwright/test";

test.describe("Homepage Core Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load homepage with essential elements", async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/ProWeb Studio/i);

    // Check main navigation
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.locator("text=Diensten")).toBeVisible();
    await expect(page.locator("text=Werkwijze")).toBeVisible();
    await expect(page.locator("text=Over ons")).toBeVisible();
    await expect(page.locator("text=Contact")).toBeVisible();

    // Check hero section
    await expect(page.locator("h1")).toBeVisible();

    // Check CTA button
    const ctaButton = page
      .locator('a[href="/contact"], button:has-text("Contact")')
      .first();
    await expect(ctaButton).toBeVisible();
  });

  test("should have good performance metrics", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/");

    // Wait for essential content to load
    await expect(page.locator("h1")).toBeVisible();

    const loadTime = Date.now() - startTime;

    // Basic performance check - page should load within reasonable time
    expect(loadTime).toBeLessThan(5000); // 5 seconds max

    // Check that images are loading
    const images = page.locator("img");
    const imageCount = await images.count();

    if (imageCount > 0) {
      // Wait for first image to load
      await expect(images.first()).toBeVisible();
    }
  });

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Check mobile navigation (hamburger menu if exists)
    const mobileNav = page.locator(
      '[aria-label*="menu"], .hamburger, .mobile-menu-button',
    );
    if ((await mobileNav.count()) > 0) {
      await expect(mobileNav.first()).toBeVisible();
    }

    // Check content is visible and not cut off
    await expect(page.locator("h1")).toBeVisible();

    // Ensure no horizontal scroll
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5); // Allow 5px tolerance
  });

  test("should navigate to key pages", async ({ page }) => {
    await page.goto("/");

    // Test navigation to services page
    await page.click("text=Diensten");
    await expect(page).toHaveURL(/.*\/diensten/);
    await expect(page.locator("h1")).toBeVisible();

    // Go back to home
    await page.goto("/");

    // Test navigation to contact page
    await page.click("text=Contact");
    await expect(page).toHaveURL(/.*\/contact/);
    await expect(page.locator("h1")).toBeVisible();
  });
});
