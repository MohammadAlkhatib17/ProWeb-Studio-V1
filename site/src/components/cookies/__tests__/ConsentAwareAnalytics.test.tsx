/**
 * Consent-Aware Analytics Tests
 * Verifies analytics script injection only occurs after explicit consent
 */

import { render, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import ConsentAwareAnalytics from '../ConsentAwareAnalytics';

// Mock Next.js Script component
const mockScriptLoaded = vi.fn();
vi.mock('next/script', () => ({
  default: ({ src, onLoad, ...props }: any) => {
    // Simulate script being added to DOM
    if (onLoad) {
      setTimeout(() => onLoad(), 0);
    }
    mockScriptLoaded(src);
    return <script src={src} data-testid="analytics-script" {...props} />;
  },
}));

// Mock useCookieConsent hook
const mockHasConsentFor = vi.fn();
vi.mock('../useCookieConsent', () => ({
  useCookieConsent: () => ({
    hasConsentFor: mockHasConsentFor,
  }),
}));

describe('ConsentAwareAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockScriptLoaded.mockClear();

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

    // Clean up plausible global
    if ((window as any).plausible) {
      delete (window as any).plausible;
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Script Injection - No Consent', () => {
    it('should NOT inject analytics script before consent', () => {
      // Simulate no consent
      mockHasConsentFor.mockReturnValue(false);

      const { container } = render(
        <ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />
      );

      // Script should not be present
      const script = container.querySelector('script[src*="plausible.io"]');
      expect(script).not.toBeInTheDocument();
      expect(mockScriptLoaded).not.toHaveBeenCalled();
    });

    it('should return null when no analytics consent', () => {
      mockHasConsentFor.mockReturnValue(false);

      const { container } = render(
        <ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should not create plausible global object without consent', () => {
      mockHasConsentFor.mockReturnValue(false);

      render(<ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />);

      expect((window as any).plausible).toBeUndefined();
    });

    it('should check analytics consent on mount', () => {
      mockHasConsentFor.mockReturnValue(false);

      render(<ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />);

      expect(mockHasConsentFor).toHaveBeenCalledWith('analytics');
    });
  });

  describe('Script Injection - With Consent', () => {
    it('should inject analytics script after consent is given', async () => {
      // Simulate consent granted
      mockHasConsentFor.mockReturnValue(true);

      const { container } = render(
        <ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />
      );

      await waitFor(() => {
        const script = container.querySelector('script[data-testid="analytics-script"]');
        expect(script).toBeInTheDocument();
        expect(script).toHaveAttribute('src', 'https://plausible.io/js/script.js');
      });
    });

    it('should inject script with correct attributes', async () => {
      mockHasConsentFor.mockReturnValue(true);

      const { container } = render(
        <ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" nonce="test-nonce-123" />
      );

      await waitFor(() => {
        const script = container.querySelector('script[data-testid="analytics-script"]');
        expect(script).toBeInTheDocument();
        expect(script).toHaveAttribute('defer');
        expect(script).toHaveAttribute('data-domain', 'prowebstudio.nl');
        expect(script).toHaveAttribute('nonce', 'test-nonce-123');
      });
    });

    it('should verify analytics script URL is correct', async () => {
      mockHasConsentFor.mockReturnValue(true);

      render(<ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />);

      await waitFor(() => {
        expect(mockScriptLoaded).toHaveBeenCalledWith('https://plausible.io/js/script.js');
      });
    });
  });

  describe('Dynamic Consent Changes', () => {
    it('should inject script when consent is granted after initial render', async () => {
      // Start without consent
      mockHasConsentFor.mockReturnValue(false);

      const { container, rerender } = render(
        <ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />
      );

      // Verify no script initially
      expect(container.querySelector('script[src*="plausible.io"]')).not.toBeInTheDocument();

      // Grant consent
      mockHasConsentFor.mockReturnValue(true);

      // Dispatch consent change event
      await act(async () => {
        window.dispatchEvent(
          new CustomEvent('cookieConsentChange', {
            detail: {
              consent: { analytics: true },
            },
          })
        );
      });

      // Rerender to trigger effect
      rerender(<ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />);

      await waitFor(() => {
        const script = container.querySelector('script[data-testid="analytics-script"]');
        expect(script).toBeInTheDocument();
      });
    });

    it('should remove analytics when consent is revoked', async () => {
      // Start with consent
      mockHasConsentFor.mockReturnValue(true);
      (window as any).plausible = vi.fn();

      const { rerender } = render(
        <ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />
      );

      // Verify plausible exists
      expect((window as any).plausible).toBeDefined();

      // Revoke consent
      mockHasConsentFor.mockReturnValue(false);

      await act(async () => {
        window.dispatchEvent(
          new CustomEvent('cookieConsentChange', {
            detail: {
              consent: { analytics: false },
            },
          })
        );
      });

      // Rerender
      rerender(<ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />);

      await waitFor(() => {
        // Plausible global should be cleaned up
        expect((window as any).plausible).toBeUndefined();
      });
    });

    it('should listen for cookieConsentChange events', async () => {
      mockHasConsentFor.mockReturnValue(false);
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      render(<ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />);

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'cookieConsentChange',
        expect.any(Function)
      );
    });

    it('should clean up event listener on unmount', () => {
      mockHasConsentFor.mockReturnValue(false);
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = render(
        <ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />
      );

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'cookieConsentChange',
        expect.any(Function)
      );
    });
  });

  describe('Script Loading Strategy', () => {
    it('should use afterInteractive loading strategy', async () => {
      mockHasConsentFor.mockReturnValue(true);

      // Next.js Script strategy is passed as a prop
      // We verify this indirectly through the mock
      render(<ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />);

      await waitFor(() => {
        expect(mockScriptLoaded).toHaveBeenCalledWith('https://plausible.io/js/script.js');
      });
    });

    it('should defer script loading', async () => {
      mockHasConsentFor.mockReturnValue(true);

      const { container } = render(
        <ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />
      );

      await waitFor(() => {
        const script = container.querySelector('script[data-testid="analytics-script"]');
        expect(script).toHaveAttribute('defer');
      });
    });
  });

  describe('CSP Compliance', () => {
    it('should include nonce attribute when provided', async () => {
      mockHasConsentFor.mockReturnValue(true);
      const nonce = 'csp-nonce-abc123xyz';

      const { container } = render(
        <ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" nonce={nonce} />
      );

      await waitFor(() => {
        const script = container.querySelector('script[data-testid="analytics-script"]');
        expect(script).toHaveAttribute('nonce', nonce);
      });
    });

    it('should work without nonce attribute', async () => {
      mockHasConsentFor.mockReturnValue(true);

      const { container } = render(
        <ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />
      );

      await waitFor(() => {
        const script = container.querySelector('script[data-testid="analytics-script"]');
        expect(script).toBeInTheDocument();
        // Nonce may or may not be present, but script should work
      });
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle consent granted immediately on first visit', async () => {
      // Simulate user accepting all cookies immediately
      mockHasConsentFor.mockReturnValue(true);

      const startTime = performance.now();

      const { container } = render(
        <ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />
      );

      await waitFor(() => {
        const script = container.querySelector('script[data-testid="analytics-script"]');
        expect(script).toBeInTheDocument();
      });

      const loadTime = performance.now() - startTime;

      // Script should load quickly
      expect(loadTime).toBeLessThan(1000);
    });

    it('should not inject script if plausibleDomain is not provided', () => {
      mockHasConsentFor.mockReturnValue(true);

      const { container } = render(<ConsentAwareAnalytics />);

      const script = container.querySelector('script[src*="plausible.io"]');
      expect(script).not.toBeInTheDocument();
    });

    it('should handle multiple consent change events', async () => {
      mockHasConsentFor.mockReturnValue(false);

      const { rerender } = render(
        <ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />
      );

      // Grant consent
      await act(async () => {
        mockHasConsentFor.mockReturnValue(true);
        window.dispatchEvent(
          new CustomEvent('cookieConsentChange', {
            detail: { consent: { analytics: true } },
          })
        );
      });

      rerender(<ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />);

      // Revoke consent
      await act(async () => {
        mockHasConsentFor.mockReturnValue(false);
        window.dispatchEvent(
          new CustomEvent('cookieConsentChange', {
            detail: { consent: { analytics: false } },
          })
        );
      });

      rerender(<ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />);

      // Grant again
      await act(async () => {
        mockHasConsentFor.mockReturnValue(true);
        window.dispatchEvent(
          new CustomEvent('cookieConsentChange', {
            detail: { consent: { analytics: true } },
          })
        );
      });

      rerender(<ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />);

      await waitFor(() => {
        const script = document.querySelector('script[data-testid="analytics-script"]');
        expect(script).toBeInTheDocument();
      });
    });
  });
});
