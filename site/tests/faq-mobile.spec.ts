import { test, expect } from '@playwright/test';

test.describe('FAQ Mobile Accordion Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a page with FAQ section
    await page.goto('/diensten');
  });

  test('should toggle FAQ items and maintain accessibility', async ({ page }) => {
    // Test on mobile viewport (360x640)
    await page.setViewportSize({ width: 360, height: 640 });
    
    // Find the first FAQ item
    const firstFAQ = page.locator('.faq-card').first();
    await expect(firstFAQ).toBeVisible();
    
    // Find the FAQ button and answer content
    const faqButton = firstFAQ.locator('.faq-card-header');
    const faqContent = firstFAQ.locator('.faq-card-content-wrapper');
    
    // Initially, FAQ should be collapsed
    await expect(faqButton).toHaveAttribute('aria-expanded', 'false');
    await expect(faqContent).toHaveCSS('height', '0px');
    
    // Click to expand FAQ
    await faqButton.click();
    
    // Wait for animation and check expanded state
    await expect(faqButton).toHaveAttribute('aria-expanded', 'true');
    
    // Check that content has height > 0 (it's expanded)
    await page.waitForFunction(() => {
      const content = document.querySelector('.faq-card-content-wrapper') as HTMLElement;
      return content && parseFloat(content.style.height) > 0;
    });
    
    // Click again to collapse
    await faqButton.click();
    await expect(faqButton).toHaveAttribute('aria-expanded', 'false');
    
    // Wait for collapse animation
    await page.waitForFunction(() => {
      const content = document.querySelector('.faq-card-content-wrapper') as HTMLElement;
      return content && parseFloat(content.style.height) === 0;
    });
  });

  test('should have proper keyboard navigation', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    
    const firstFAQ = page.locator('.faq-card .faq-card-header').first();
    
    // Focus the FAQ button
    await firstFAQ.focus();
    
    // Verify focus is visible
    await expect(firstFAQ).toBeFocused();
    
    // Press Enter to activate
    await page.keyboard.press('Enter');
    
    // Should be expanded
    await expect(firstFAQ).toHaveAttribute('aria-expanded', 'true');
    
    // Press Enter again to collapse
    await page.keyboard.press('Enter');
    
    // Should be collapsed
    await expect(firstFAQ).toHaveAttribute('aria-expanded', 'false');
  });

  test('should maintain rectangular card layout on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 }); // iPhone SE size
    
    // Check all FAQ cards have proper dimensions
    const faqCards = page.locator('.faq-card');
    const cardCount = await faqCards.count();
    
    for (let i = 0; i < Math.min(cardCount, 3); i++) {
      const card = faqCards.nth(i);
      const boundingBox = await card.boundingBox();
      
      if (boundingBox) {
        // Ensure width is much greater than height (rectangular, not square)
        expect(boundingBox.width).toBeGreaterThan(boundingBox.height);
        
        // Ensure card spans most of the container width
        expect(boundingBox.width).toBeGreaterThan(280); // Accounting for padding
      }
    }
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone 6/7/8 size
    
    const firstFAQ = page.locator('.faq-card').first();
    const faqButton = firstFAQ.locator('.faq-card-header');
    const faqContent = firstFAQ.locator('.faq-card-content');
    
    // Check button has proper attributes
    await expect(faqButton).toHaveAttribute('aria-expanded');
    await expect(faqButton).toHaveAttribute('aria-controls');
    await expect(faqButton).toHaveAttribute('id');
    
    // Check content has proper attributes
    await expect(faqContent).toHaveAttribute('role', 'region');
    await expect(faqContent).toHaveAttribute('aria-labelledby');
    await expect(faqContent).toHaveAttribute('id');
    
    // Verify aria-controls matches content id
    const buttonControls = await faqButton.getAttribute('aria-controls');
    const contentId = await faqContent.getAttribute('id');
    expect(buttonControls).toBe(contentId);
    
    // Verify aria-labelledby matches button id  
    const contentLabelledBy = await faqContent.getAttribute('aria-labelledby');
    const buttonId = await faqButton.getAttribute('id');
    expect(contentLabelledBy).toBe(buttonId);
  });

  test('should work with reduced motion preference', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 360, height: 640 });
    
    const firstFAQ = page.locator('.faq-card').first();
    const faqButton = firstFAQ.locator('.faq-card-header');
    
    // Should still function with reduced motion
    await faqButton.click();
    await expect(faqButton).toHaveAttribute('aria-expanded', 'true');
    
    await faqButton.click();
    await expect(faqButton).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('FAQ Visual Regression', () => {
  test('FAQ section collapsed state on mobile', async ({ page }) => {
    await page.goto('/diensten');
    await page.setViewportSize({ width: 360, height: 740 });
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Scroll to FAQ section
    await page.locator('text=Veelgestelde vragen').first().scrollIntoViewIfNeeded();
    
    // Take screenshot of FAQ section
    await expect(page.locator('.faq-card').first()).toHaveScreenshot('faq-collapsed-mobile.png');
  });

  test('FAQ section expanded state on mobile', async ({ page }) => {
    await page.goto('/diensten');
    await page.setViewportSize({ width: 360, height: 740 });
    
    await page.waitForLoadState('networkidle');
    
    // Find and expand first FAQ
    const firstFAQ = page.locator('.faq-card .faq-card-header').first();
    await firstFAQ.scrollIntoViewIfNeeded();
    await firstFAQ.click();
    
    // Wait for expansion animation
    await page.waitForTimeout(400);
    
    // Take screenshot of expanded FAQ
    await expect(page.locator('.faq-card').first()).toHaveScreenshot('faq-expanded-mobile.png');
  });
});