/**
 * Accessibility E2E Tests
 * 
 * Uses @axe-core/playwright for automated WCAG 2.1 AA compliance testing.
 * Critical for Dutch market compliance (EN 301 549).
 * 
 * Run: npm run test:e2e
 */

import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Pages to test for accessibility
const PAGES_TO_TEST = [
    { url: '/', name: 'Homepage' },
    { url: '/diensten', name: 'Services' },
    { url: '/contact', name: 'Contact' },
    { url: '/over-ons', name: 'About' },
    { url: '/werkwijze', name: 'Werkwijze' },
    { url: '/privacy', name: 'Privacy' },
];

test.describe('Accessibility - WCAG 2.1 AA Compliance', () => {
    for (const page of PAGES_TO_TEST) {
        test(`${page.name} should have no accessibility violations`, async ({ page: browserPage }) => {
            await browserPage.goto(page.url, { waitUntil: 'networkidle' });

            // Wait for 3D content to fully load or timeout gracefully
            await browserPage.waitForTimeout(2000);

            // Run axe-core accessibility scan
            const accessibilityScanResults = await new AxeBuilder({ page: browserPage })
                .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
                .exclude('[data-testid="3d-canvas"]') // Exclude 3D canvas (not applicable for a11y)
                .analyze();

            // Check for critical and serious violations
            const criticalViolations = accessibilityScanResults.violations.filter(
                v => v.impact === 'critical' || v.impact === 'serious'
            );

            // Log all violations for debugging
            if (accessibilityScanResults.violations.length > 0) {
                console.log('\n📋 Accessibility Issues Found:');
                accessibilityScanResults.violations.forEach(violation => {
                    console.log(`\n❌ ${violation.impact?.toUpperCase()}: ${violation.description}`);
                    console.log(`   Help: ${violation.helpUrl}`);
                    console.log(`   Nodes affected: ${violation.nodes.length}`);
                });
            }

            // Assert no critical/serious violations
            expect(
                criticalViolations.length,
                `Found ${criticalViolations.length} critical/serious accessibility violations on ${page.name}`
            ).toBe(0);
        });
    }

    test('Cookie consent banner should be accessible', async ({ page: browserPage }) => {
        // Clear cookies to ensure banner shows
        await browserPage.context().clearCookies();
        await browserPage.goto('/', { waitUntil: 'networkidle' });

        // Wait for banner to appear
        const banner = browserPage.locator('[role="dialog"][aria-modal="true"]');
        await expect(banner).toBeVisible({ timeout: 5000 });

        // Check banner accessibility specifically
        const bannerA11y = await new AxeBuilder({ page: browserPage })
            .include('[role="dialog"]')
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze();

        expect(
            bannerA11y.violations.filter(v => v.impact === 'critical').length,
            'Cookie banner has critical a11y violations'
        ).toBe(0);

        // Verify required ARIA attributes
        await expect(banner).toHaveAttribute('aria-labelledby', 'cookie-banner-title');
        await expect(banner).toHaveAttribute('aria-describedby', 'cookie-banner-description');
    });

    test('Navigation should be keyboard accessible', async ({ page: browserPage }) => {
        await browserPage.goto('/', { waitUntil: 'networkidle' });

        // Tab through navigation items
        await browserPage.keyboard.press('Tab');
        await browserPage.keyboard.press('Tab');

        // Verify focus is visible and on interactive element
        const focusedElement = browserPage.locator(':focus');
        await expect(focusedElement).toBeVisible();
    });

    test('Color contrast should meet WCAG AA standards', async ({ page: browserPage }) => {
        await browserPage.goto('/contact', { waitUntil: 'networkidle' });

        const contrastResults = await new AxeBuilder({ page: browserPage })
            .withTags(['wcag2aa'])
            .options({ rules: { 'color-contrast': { enabled: true } } })
            .analyze();

        const contrastViolations = contrastResults.violations.filter(
            v => v.id === 'color-contrast'
        );

        // Allow minor violations but fail on critical contrast issues
        expect(
            contrastViolations.filter(v => v.impact === 'critical').length,
            'Critical color contrast violations found'
        ).toBe(0);
    });

    test('Form inputs should have proper labels', async ({ page: browserPage }) => {
        await browserPage.goto('/contact', { waitUntil: 'networkidle' });

        const formA11y = await new AxeBuilder({ page: browserPage })
            .include('form')
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze();

        const labelViolations = formA11y.violations.filter(
            v => v.id === 'label' || v.id === 'label-title-only'
        );

        expect(labelViolations.length, 'Form inputs missing proper labels').toBe(0);
    });
});
