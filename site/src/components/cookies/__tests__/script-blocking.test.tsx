/**
 * Script Blocking Tests
 * Verifies that analytics/marketing scripts do NOT load before explicit consent
 * Critical for AVG/GDPR compliance
 */

import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import ConsentAwareAnalytics from '../ConsentAwareAnalytics';

// Mock Next.js Script component
const mockScriptLoaded = vi.fn();
vi.mock('next/script', () => ({
  default: ({ src, ...props }: any) => {
    mockScriptLoaded(src);
    return <script src={src} data-testid="analytics-script" {...props} />;
  },
}));

// Mock Vercel Analytics
const mockVercelAnalytics = vi.fn();
vi.mock('@vercel/analytics/react', () => ({
  Analytics: () => {
    mockVercelAnalytics('vercel-analytics');
    return <div data-testid="vercel-analytics" />;
  },
}));

// Mock Vercel Speed Insights
const mockSpeedInsights = vi.fn();
vi.mock('@vercel/speed-insights/next', () => ({
  SpeedInsights: () => {
    mockSpeedInsights('speed-insights');
    return <div data-testid="speed-insights" />;
  },
}));

// Mock useCookieConsent hook
const mockHasConsentFor = vi.fn();
vi.mock('../useCookieConsent', () => ({
  useCookieConsent: () => ({
    hasConsentFor: mockHasConsentFor,
  }),
}));

describe('Script Blocking - AVG/GDPR Compliance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockScriptLoaded.mockClear();
    mockVercelAnalytics.mockClear();
    mockSpeedInsights.mockClear();

    // Clear all cookies
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });

    // Remove any existing analytics scripts
    document.querySelectorAll('script[src*="plausible.io"]').forEach((script) => {
      script.remove();
    });
    document.querySelectorAll('script[src*="vercel"]').forEach((script) => {
      script.remove();
    });

    // Clean up analytics globals
    if ((window as any).plausible) {
      delete (window as any).plausible;
    }
    if ((window as any).va) {
      delete (window as any).va;
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('No Consent - No Scripts', () => {
    it('should NOT load Plausible script without consent', () => {
      mockHasConsentFor.mockReturnValue(false);

      const { container } = render(
        <ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />
      );

      // No script should be present
      const script = container.querySelector('script[src*="plausible.io"]');
      expect(script).not.toBeInTheDocument();
      expect(mockScriptLoaded).not.toHaveBeenCalled();
    });

    it('should NOT load Vercel Analytics without consent', () => {
      mockHasConsentFor.mockReturnValue(false);

      const { container } = render(
        <ConsentAwareAnalytics enableVercelAnalytics={true} />
      );

      // Vercel Analytics should not be rendered
      const analytics = container.querySelector('[data-testid="vercel-analytics"]');
      expect(analytics).not.toBeInTheDocument();
      expect(mockVercelAnalytics).not.toHaveBeenCalled();
    });

    it('should NOT load Speed Insights without consent', () => {
      mockHasConsentFor.mockReturnValue(false);

      const { container } = render(
        <ConsentAwareAnalytics enableSpeedInsights={true} />
      );

      // Speed Insights should not be rendered
      const speedInsights = container.querySelector('[data-testid="speed-insights"]');
      expect(speedInsights).not.toBeInTheDocument();
      expect(mockSpeedInsights).not.toHaveBeenCalled();
    });

    it('should NOT load ANY analytics without consent', () => {
      mockHasConsentFor.mockReturnValue(false);

      const { container } = render(
        <ConsentAwareAnalytics
          plausibleDomain="prowebstudio.nl"
          enableVercelAnalytics={true}
          enableSpeedInsights={true}
        />
      );

      // Nothing should be rendered
      expect(container.firstChild).toBeNull();
      expect(mockScriptLoaded).not.toHaveBeenCalled();
      expect(mockVercelAnalytics).not.toHaveBeenCalled();
      expect(mockSpeedInsights).not.toHaveBeenCalled();
    });

    it('should NOT create analytics global objects without consent', () => {
      mockHasConsentFor.mockReturnValue(false);

      render(
        <ConsentAwareAnalytics
          plausibleDomain="prowebstudio.nl"
          enableVercelAnalytics={true}
          enableSpeedInsights={true}
        />
      );

      // No global analytics objects should exist
      expect((window as any).plausible).toBeUndefined();
      expect((window as any).va).toBeUndefined();
      expect((window as any).webVitals).toBeUndefined();
    });

    it('should NOT make network requests without consent', () => {
      const fetchSpy = vi.spyOn(global, 'fetch');
      mockHasConsentFor.mockReturnValue(false);

      render(
        <ConsentAwareAnalytics
          plausibleDomain="prowebstudio.nl"
          enableVercelAnalytics={true}
          enableSpeedInsights={true}
        />
      );

      // No analytics-related network requests should be made
      expect(fetchSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('plausible')
      );
      expect(fetchSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('vercel')
      );
      expect(fetchSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('analytics')
      );

      fetchSpy.mockRestore();
    });
  });

  describe('With Consent - Scripts Load', () => {
    it('should load Plausible script after consent', async () => {
      mockHasConsentFor.mockReturnValue(true);

      const { container } = render(
        <ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />
      );

      await waitFor(() => {
        const script = container.querySelector('script[data-testid="analytics-script"]');
        expect(script).toBeInTheDocument();
        expect(mockScriptLoaded).toHaveBeenCalledWith('https://plausible.io/js/script.js');
      });
    });

    it('should load Vercel Analytics after consent', async () => {
      mockHasConsentFor.mockReturnValue(true);

      const { container } = render(
        <ConsentAwareAnalytics enableVercelAnalytics={true} />
      );

      await waitFor(() => {
        const analytics = container.querySelector('[data-testid="vercel-analytics"]');
        expect(analytics).toBeInTheDocument();
        expect(mockVercelAnalytics).toHaveBeenCalledWith('vercel-analytics');
      });
    });

    it('should load Speed Insights after consent', async () => {
      mockHasConsentFor.mockReturnValue(true);

      const { container } = render(
        <ConsentAwareAnalytics enableSpeedInsights={true} />
      );

      await waitFor(() => {
        const speedInsights = container.querySelector('[data-testid="speed-insights"]');
        expect(speedInsights).toBeInTheDocument();
        expect(mockSpeedInsights).toHaveBeenCalledWith('speed-insights');
      });
    });

    it('should load ALL analytics tools after consent', async () => {
      mockHasConsentFor.mockReturnValue(true);

      render(
        <ConsentAwareAnalytics
          plausibleDomain="prowebstudio.nl"
          enableVercelAnalytics={true}
          enableSpeedInsights={true}
        />
      );

      await waitFor(() => {
        expect(mockScriptLoaded).toHaveBeenCalledWith('https://plausible.io/js/script.js');
        expect(mockVercelAnalytics).toHaveBeenCalled();
        expect(mockSpeedInsights).toHaveBeenCalled();
      });
    });
  });

  describe('Consent Changes - Dynamic Loading', () => {
    it('should load scripts when consent is granted after mount', async () => {
      // Start without consent
      mockHasConsentFor.mockReturnValue(false);

      const { container, rerender } = render(
        <ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />
      );

      // Verify no script initially
      expect(container.querySelector('script[src*="plausible.io"]')).not.toBeInTheDocument();

      // Grant consent
      mockHasConsentFor.mockReturnValue(true);
      window.dispatchEvent(
        new CustomEvent('cookieConsentChange', {
          detail: { consent: { analytics: true } },
        })
      );

      rerender(<ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />);

      await waitFor(() => {
        expect(mockScriptLoaded).toHaveBeenCalledWith('https://plausible.io/js/script.js');
      });
    });

    it('should remove scripts when consent is revoked', async () => {
      // Start with consent
      mockHasConsentFor.mockReturnValue(true);
      (window as any).plausible = vi.fn();
      (window as any).va = vi.fn();

      const { rerender } = render(
        <ConsentAwareAnalytics
          plausibleDomain="prowebstudio.nl"
          enableVercelAnalytics={true}
        />
      );

      // Verify analytics exist
      expect((window as any).plausible).toBeDefined();
      expect((window as any).va).toBeDefined();

      // Revoke consent
      mockHasConsentFor.mockReturnValue(false);
      window.dispatchEvent(
        new CustomEvent('cookieConsentChange', {
          detail: { consent: { analytics: false } },
        })
      );

      rerender(
        <ConsentAwareAnalytics
          plausibleDomain="prowebstudio.nl"
          enableVercelAnalytics={true}
        />
      );

      await waitFor(() => {
        // Analytics globals should be cleaned up
        expect((window as any).plausible).toBeUndefined();
        expect((window as any).va).toBeUndefined();
      });
    });
  });

  describe('CSP Compliance', () => {
    it('should include nonce when provided', async () => {
      mockHasConsentFor.mockReturnValue(true);
      const nonce = 'test-nonce-123456';

      const { container } = render(
        <ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" nonce={nonce} />
      );

      await waitFor(() => {
        const script = container.querySelector('script[data-testid="analytics-script"]');
        expect(script).toHaveAttribute('nonce', nonce);
      });
    });
  });

  describe('First Visit - Default Behavior', () => {
    it('should block all scripts on first visit (no consent cookie)', () => {
      // Simulate first visit - no cookie
      mockHasConsentFor.mockReturnValue(false);

      const { container } = render(
        <ConsentAwareAnalytics
          plausibleDomain="prowebstudio.nl"
          enableVercelAnalytics={true}
          enableSpeedInsights={true}
        />
      );

      // Verify NOTHING is loaded
      expect(container.firstChild).toBeNull();
      expect(mockScriptLoaded).not.toHaveBeenCalled();
      expect(mockVercelAnalytics).not.toHaveBeenCalled();
      expect(mockSpeedInsights).not.toHaveBeenCalled();

      // Verify no analytics globals
      expect((window as any).plausible).toBeUndefined();
      expect((window as any).va).toBeUndefined();
    });

    it('should verify hasConsentFor("analytics") is checked on mount', () => {
      mockHasConsentFor.mockReturnValue(false);

      render(<ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />);

      // Verify consent was checked for analytics category
      expect(mockHasConsentFor).toHaveBeenCalledWith('analytics');
    });
  });

  describe('Integration - Real-world Scenarios', () => {
    it('should handle rapid consent changes gracefully', async () => {
      mockHasConsentFor.mockReturnValue(false);

      const { rerender } = render(
        <ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />
      );

      // Grant consent
      mockHasConsentFor.mockReturnValue(true);
      window.dispatchEvent(
        new CustomEvent('cookieConsentChange', {
          detail: { consent: { analytics: true } },
        })
      );
      rerender(<ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />);

      // Immediately revoke
      mockHasConsentFor.mockReturnValue(false);
      window.dispatchEvent(
        new CustomEvent('cookieConsentChange', {
          detail: { consent: { analytics: false } },
        })
      );
      rerender(<ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />);

      // Grant again
      mockHasConsentFor.mockReturnValue(true);
      window.dispatchEvent(
        new CustomEvent('cookieConsentChange', {
          detail: { consent: { analytics: true } },
        })
      );
      rerender(<ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />);

      await waitFor(() => {
        // Should load after final consent grant
        expect(mockScriptLoaded).toHaveBeenCalled();
      });
    });

    it('should not load when only marketing consent is given', () => {
      // User accepts marketing but rejects analytics
      mockHasConsentFor.mockImplementation((category) => {
        return category === 'marketing';
      });

      render(
        <ConsentAwareAnalytics
          plausibleDomain="prowebstudio.nl"
          enableVercelAnalytics={true}
          enableSpeedInsights={true}
        />
      );

      // Analytics should NOT load (we specifically check for 'analytics' consent)
      expect(mockScriptLoaded).not.toHaveBeenCalled();
      expect(mockVercelAnalytics).not.toHaveBeenCalled();
      expect(mockSpeedInsights).not.toHaveBeenCalled();
    });

    it('should respect partial analytics enablement', async () => {
      mockHasConsentFor.mockReturnValue(true);

      // Only enable Plausible, not Vercel tools
      render(
        <ConsentAwareAnalytics
          plausibleDomain="prowebstudio.nl"
          enableVercelAnalytics={false}
          enableSpeedInsights={false}
        />
      );

      await waitFor(() => {
        // Plausible should load
        expect(mockScriptLoaded).toHaveBeenCalledWith('https://plausible.io/js/script.js');
        
        // Vercel tools should NOT load
        expect(mockVercelAnalytics).not.toHaveBeenCalled();
        expect(mockSpeedInsights).not.toHaveBeenCalled();
      });
    });
  });
});
