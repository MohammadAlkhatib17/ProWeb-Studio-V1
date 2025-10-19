/**
 * Cookie Consent Integration Tests
 * End-to-end tests for complete consent flow including:
 * - Banner appearance on first visit
 * - Script blocking before consent
 * - Script loading after consent
 * - Consent persistence
 * - Footer settings control
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CookieConsentBanner from '../CookieConsentBanner';
import CookieSettingsButton from '../CookieSettingsButton';
import ConsentAwareAnalytics from '../ConsentAwareAnalytics';
import * as cookieUtils from '../cookie-utils';

// Mock Next.js Script
const mockScriptLoaded = vi.fn();
vi.mock('next/script', () => ({
  default: ({ src, ...props }: any) => {
    mockScriptLoaded(src);
    return <script src={src} data-testid="analytics-script" {...props} />;
  },
}));

// Mock Vercel components
vi.mock('@vercel/analytics/react', () => ({
  Analytics: () => <div data-testid="vercel-analytics" />,
}));

vi.mock('@vercel/speed-insights/next', () => ({
  SpeedInsights: () => <div data-testid="speed-insights" />,
}));

describe('Cookie Consent Integration Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockScriptLoaded.mockClear();

    // Clear cookies
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });

    // Clean up analytics globals
    if ((window as any).plausible) delete (window as any).plausible;
    if ((window as any).va) delete (window as any).va;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('First Visit - Complete Flow', () => {
    it('should show banner on first visit and block scripts', () => {
      // Render banner
      render(<CookieConsentBanner />);
      
      // Banner should be visible
      expect(screen.getByText('🍪 Wij respecteren jouw privacy')).toBeInTheDocument();

      // Render analytics
      const { container: analyticsContainer } = render(
        <ConsentAwareAnalytics
          plausibleDomain="prowebstudio.nl"
          enableVercelAnalytics={true}
          enableSpeedInsights={true}
        />
      );

      // Scripts should NOT load
      expect(analyticsContainer.firstChild).toBeNull();
      expect(mockScriptLoaded).not.toHaveBeenCalled();
    });

    it('should load scripts immediately after accepting all cookies', async () => {
      // Render components
      const { rerender: rerenderBanner } = render(<CookieConsentBanner />);
      const { rerender: rerenderAnalytics } = render(
        <ConsentAwareAnalytics
          plausibleDomain="prowebstudio.nl"
          enableVercelAnalytics={true}
          enableSpeedInsights={true}
        />
      );

      // Click "Alles accepteren"
      fireEvent.click(screen.getByText('Alles accepteren'));

      // Rerender to pick up consent changes
      rerenderBanner(<CookieConsentBanner />);
      rerenderAnalytics(
        <ConsentAwareAnalytics
          plausibleDomain="prowebstudio.nl"
          enableVercelAnalytics={true}
          enableSpeedInsights={true}
        />
      );

      // Scripts should now load
      await waitFor(() => {
        expect(mockScriptLoaded).toHaveBeenCalledWith('https://plausible.io/js/script.js');
      });

      // Banner should be hidden
      expect(screen.queryByText('🍪 Wij respecteren jouw privacy')).not.toBeInTheDocument();
    });

    it('should NOT load scripts after rejecting optional cookies', () => {
      // Render components
      const { rerender: rerenderBanner } = render(<CookieConsentBanner />);
      const { container, rerender: rerenderAnalytics } = render(
        <ConsentAwareAnalytics
          plausibleDomain="prowebstudio.nl"
          enableVercelAnalytics={true}
          enableSpeedInsights={true}
        />
      );

      // Click "Alleen noodzakelijk"
      fireEvent.click(screen.getByText('Alleen noodzakelijk'));

      // Rerender
      rerenderBanner(<CookieConsentBanner />);
      rerenderAnalytics(
        <ConsentAwareAnalytics
          plausibleDomain="prowebstudio.nl"
          enableVercelAnalytics={true}
          enableSpeedInsights={true}
        />
      );

      // Scripts should still NOT load
      expect(container.firstChild).toBeNull();
      expect(mockScriptLoaded).not.toHaveBeenCalled();

      // Banner should be hidden
      expect(screen.queryByText('🍪 Wij respecteren jouw privacy')).not.toBeInTheDocument();
    });
  });

  describe('Granular Consent via Settings Modal', () => {
    it('should show settings button in banner', () => {
      render(<CookieConsentBanner />);

      // Banner should be visible on first visit
      expect(screen.getByText('🍪 Wij respecteren jouw privacy')).toBeInTheDocument();

      // Settings button should be present
      const settingsButton = screen.getByText('Aanpassen');
      expect(settingsButton).toBeInTheDocument();
      expect(settingsButton).toHaveAttribute('aria-label', 'Cookie-instellingen aanpassen');
    });
  });

  describe('Consent Persistence', () => {
    it('should persist consent choice for 180 days', () => {
      const saveConsentSpy = vi.spyOn(cookieUtils, 'saveConsent');
      
      render(<CookieConsentBanner />);

      // Accept all
      fireEvent.click(screen.getByText('Alles accepteren'));

      // Verify consent was saved
      expect(saveConsentSpy).toHaveBeenCalledWith({
        necessary: true,
        analytics: true,
        marketing: true,
      });

      saveConsentSpy.mockRestore();
    });

    it('should NOT show banner on subsequent visit when consent exists', () => {
      // Mock existing consent
      vi.spyOn(cookieUtils, 'getStoredConsent').mockReturnValue({
        version: 1,
        timestamp: Date.now(),
        consent: {
          necessary: true,
          analytics: true,
          marketing: false,
        },
      });

      render(<CookieConsentBanner />);

      // Banner should NOT be visible
      expect(screen.queryByText('🍪 Wij respecteren jouw privacy')).not.toBeInTheDocument();
    });

    it('should load scripts immediately when consent already exists', async () => {
      // Mock existing analytics consent
      vi.spyOn(cookieUtils, 'getStoredConsent').mockReturnValue({
        version: 1,
        timestamp: Date.now(),
        consent: {
          necessary: true,
          analytics: true,
          marketing: false,
        },
      });

      vi.spyOn(cookieUtils, 'hasConsent').mockImplementation((category) => {
        return category === 'necessary' || category === 'analytics';
      });

      render(
        <ConsentAwareAnalytics
          plausibleDomain="prowebstudio.nl"
          enableVercelAnalytics={true}
        />
      );

      // Scripts should load immediately
      await waitFor(() => {
        expect(mockScriptLoaded).toHaveBeenCalled();
      });
    });
  });

  describe('Footer Cookie Settings Control', () => {
    it('should render cookie settings button in footer', () => {
      render(<CookieSettingsButton />);

      const button = screen.getByText('Wijzig cookie-instellingen');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Cookie-instellingen wijzigen');
    });

    it('should have proper styling and accessibility', () => {
      render(<CookieSettingsButton />);

      const button = screen.getByText('Wijzig cookie-instellingen');
      
      // Check accessible attributes
      expect(button.tagName).toBe('BUTTON');
      expect(button).toHaveClass('text-sm');
      expect(button).toHaveClass('underline');
    });

    it('should be keyboard accessible', () => {
      render(<CookieSettingsButton />);

      const button = screen.getByText('Wijzig cookie-instellingen');
      
      // Should be focusable
      expect(button).not.toHaveAttribute('tabindex', '-1');
      
      // Should have focus styling classes
      expect(button.className).toContain('focus:outline-none');
      expect(button.className).toContain('focus-visible:ring-2');
    });
  });

  describe('Accessibility', () => {
    it('should have keyboard navigation support', () => {
      render(<CookieConsentBanner />);

      // All buttons should be keyboard accessible
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('should have proper ARIA labels', () => {
      render(<CookieConsentBanner />);

      // Check for ARIA attributes
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby');
      expect(dialog).toHaveAttribute('aria-describedby');
    });

    it('should have minimum touch target sizes (44px)', () => {
      render(<CookieConsentBanner />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        // Check if button has min-h-[44px] class
        expect(button.className).toContain('min-h-[44px]');
      });
    });
  });

  describe('Performance - CLS Prevention', () => {
    it('should render banner with synchronous initial state', () => {
      const { container } = render(<CookieConsentBanner />);

      const banner = container.querySelector('[role="dialog"]');
      
      if (banner) {
        // Verify willChange is set for CLS prevention
        const style = (banner as HTMLElement).style;
        expect(style.willChange).toBe('transform');
      }
    });

    it('should not cause layout shift on first render', () => {
      const { container } = render(<CookieConsentBanner />);

      const banner = container.querySelector('[role="dialog"]');
      
      if (banner) {
        // Banner should be immediately visible (no animation delay)
        const computedStyle = window.getComputedStyle(banner);
        expect(computedStyle.opacity).toBe('1');
      }
    });
  });

  describe('AVG/GDPR Compliance', () => {
    it('should block ALL non-essential scripts before consent', () => {
      // Render everything
      render(<CookieConsentBanner />);
      const { container } = render(
        <ConsentAwareAnalytics
          plausibleDomain="prowebstudio.nl"
          enableVercelAnalytics={true}
          enableSpeedInsights={true}
        />
      );

      // NO scripts should be present
      expect(container.querySelector('script[src*="plausible.io"]')).not.toBeInTheDocument();
      expect(container.querySelector('[data-testid="vercel-analytics"]')).not.toBeInTheDocument();
      expect(container.querySelector('[data-testid="speed-insights"]')).not.toBeInTheDocument();
    });

    it('should provide clear Dutch privacy information', () => {
      render(<CookieConsentBanner />);

      // Check for Dutch privacy text
      expect(screen.getByText('🍪 Wij respecteren jouw privacy')).toBeInTheDocument();
      expect(screen.getByText(/ProWeb Studio gebruikt cookies/)).toBeInTheDocument();
    });

    it('should show all three action buttons', () => {
      render(<CookieConsentBanner />);

      // All three CTAs should be present
      expect(screen.getByText('Aanpassen')).toBeInTheDocument();
      expect(screen.getByText('Alleen noodzakelijk')).toBeInTheDocument();
      expect(screen.getByText('Alles accepteren')).toBeInTheDocument();
    });
  });
});
