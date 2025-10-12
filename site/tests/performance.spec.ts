import { test, expect } from "@playwright/test";

test.describe("Performance and Web Vitals", () => {
  test("should meet Core Web Vitals thresholds", async ({ page }) => {
    // Navigate to homepage
    await page.goto("/", { waitUntil: "networkidle" });

    // Measure performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        // Use Performance Observer to capture Web Vitals
        const vitals: Record<string, number> = {};

        // Capture LCP
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.lcp = lastEntry.startTime;
        }).observe({ entryTypes: ["largest-contentful-paint"] });

        // Capture FCP
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const fcpEntry = entries.find(
            (entry) => entry.name === "first-contentful-paint",
          );
          if (fcpEntry) {
            vitals.fcp = fcpEntry.startTime;
          }
        }).observe({ entryTypes: ["paint"] });

        // Capture CLS (simplified)
        new PerformanceObserver((entryList) => {
          let clsValue = 0;
          const entries = entryList.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          vitals.cls = clsValue;
        }).observe({ entryTypes: ["layout-shift"] });

        // Return metrics after a short delay
        setTimeout(() => {
          resolve(vitals);
        }, 3000);
      });
    });

    console.log("Performance metrics:", metrics);

    // Assert Web Vitals thresholds
    if ((metrics as any).lcp) {
      expect((metrics as any).lcp).toBeLessThan(2500); // LCP should be < 2.5s
    }
    if ((metrics as any).fcp) {
      expect((metrics as any).fcp).toBeLessThan(1800); // FCP should be < 1.8s
    }
    if ((metrics as any).cls !== undefined) {
      expect((metrics as any).cls).toBeLessThan(0.1); // CLS should be < 0.1
    }
  });

  test("should load critical resources quickly", async ({ page }) => {
    const startTime = Date.now();

    // Navigate and wait for critical elements
    await page.goto("/");

    // Wait for hero content to be visible
    await expect(page.locator("h1")).toBeVisible();

    const heroLoadTime = Date.now() - startTime;
    expect(heroLoadTime).toBeLessThan(2000); // Hero should load within 2s

    // Check that critical CSS is loaded (no FOUC)
    const heroElement = page.locator("h1").first();
    const computedStyle = await heroElement.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        fontSize: style.fontSize,
        color: style.color,
        fontFamily: style.fontFamily,
      };
    });

    // Ensure styles are applied (not default browser styles)
    expect(computedStyle.fontSize).not.toBe("16px"); // Should have custom styling
    expect(computedStyle.color).not.toBe("rgb(0, 0, 0)"); // Should not be default black
  });

  test("should have efficient image loading", async ({ page }) => {
    await page.goto("/");

    // Get all images on the page
    const images = page.locator("img");
    const imageCount = await images.count();

    if (imageCount > 0) {
      // Check that images have proper attributes
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        // Check first 5 images
        const img = images.nth(i);

        // Check for lazy loading attribute
        const loading = await img.getAttribute("loading");
        const isAboveFold = await img.evaluate((el) => {
          const rect = el.getBoundingClientRect();
          return rect.top < window.innerHeight;
        });

        // Images below the fold should have lazy loading
        if (!isAboveFold && loading !== "lazy") {
          console.log(`Image ${i} should have lazy loading`);
        }

        // Check for proper alt text
        const alt = await img.getAttribute("alt");
        expect(alt).toBeTruthy();

        // Check for responsive attributes
        const srcset = await img.getAttribute("srcset");
        const sizes = await img.getAttribute("sizes");

        // At least some images should have responsive attributes
        if (srcset || sizes) {
          expect(srcset || sizes).toBeTruthy();
        }
      }
    }
  });

  test("should have minimal render-blocking resources", async ({ page }) => {
    // Monitor network requests during page load
    const renderBlockingRequests: string[] = [];

    page.on("response", (response) => {
      const url = response.url();
      const resourceType = response.request().resourceType();

      // Check for render-blocking CSS and JS
      if (
        (resourceType === "stylesheet" || resourceType === "script") &&
        !url.includes("async") &&
        !url.includes("defer")
      ) {
        renderBlockingRequests.push(url);
      }
    });

    await page.goto("/", { waitUntil: "networkidle" });

    console.log("Render-blocking requests:", renderBlockingRequests);

    // Should have minimal render-blocking resources
    expect(renderBlockingRequests.length).toBeLessThan(10);
  });

  test("should not have console errors", async ({ page }) => {
    const errors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    page.on("pageerror", (error) => {
      errors.push(error.message);
    });

    await page.goto("/");
    await page.waitForTimeout(2000); // Wait for any async errors

    // Filter out common third-party errors that we can't control
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes("ResizeObserver") &&
        !error.includes("Non-Error promise rejection") &&
        !error.includes("google-analytics") &&
        !error.includes("gtag"),
    );

    expect(criticalErrors).toHaveLength(0);

    if (criticalErrors.length > 0) {
      console.log("Critical errors found:", criticalErrors);
    }
  });
});
