/**
 * Unit Test: useCookieConsent Hook
 * Verifies synchronous initial state computation on first load
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import * as cookieUtils from '@/components/cookies/cookie-utils';
import { useCookieConsent } from '@/components/cookies/useCookieConsent';

// Mock cookie utils
vi.mock('@/components/cookies/cookie-utils', () => ({
  getStoredConsent: vi.fn(),
  saveConsent: vi.fn(),
  hasConsent: vi.fn(),
}));

describe('useCookieConsent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });
  });

  it('should show banner immediately when no cookie exists (first visit)', () => {
    // Simulate no stored consent
    vi.mocked(cookieUtils.getStoredConsent).mockReturnValue(null);
    
    // Render hook
    const { result } = renderHook(() => useCookieConsent());
    
    // Assert banner is visible immediately (synchronous initial state)
    expect(result.current.showBanner).toBe(true);
    
    // Assert default consent is used
    expect(result.current.consent).toEqual({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  });

  it('should NOT show banner when valid consent cookie exists', () => {
    // Simulate stored consent
    const storedConsent = {
      version: 1,
      timestamp: Date.now(),
      consent: {
        necessary: true,
        analytics: true,
        marketing: false,
      },
    };
    
    vi.mocked(cookieUtils.getStoredConsent).mockReturnValue(storedConsent);
    
    // Render hook
    const { result } = renderHook(() => useCookieConsent());
    
    // Assert banner is NOT visible
    expect(result.current.showBanner).toBe(false);
    
    // Assert stored consent is used
    expect(result.current.consent).toEqual(storedConsent.consent);
  });

  it('should compute initial state synchronously without useEffect', () => {
    // This test verifies no async state updates in initial render
    vi.mocked(cookieUtils.getStoredConsent).mockReturnValue(null);
    
    let renderCount = 0;
    let initialShowBanner: boolean | null = null;
    
    const { result } = renderHook(() => {
      renderCount++;
      const hookResult = useCookieConsent();
      
      // Capture initial state on first render
      if (renderCount === 1) {
        initialShowBanner = hookResult.showBanner;
      }
      
      return hookResult;
    });
    
    // Should show banner on first render (synchronous)
    expect(initialShowBanner).toBe(true);
    expect(result.current.showBanner).toBe(true);
  });

  it('should save consent and hide banner when accepting all', () => {
    vi.mocked(cookieUtils.getStoredConsent).mockReturnValue(null);
    
    const { result } = renderHook(() => useCookieConsent());
    
    // Initial state: banner visible
    expect(result.current.showBanner).toBe(true);
    
    // Accept all
    act(() => {
      result.current.acceptAll();
    });
    
    // Assert consent was saved
    expect(cookieUtils.saveConsent).toHaveBeenCalledWith({
      necessary: true,
      analytics: true,
      marketing: true,
    });
    
    // Assert banner is hidden
    expect(result.current.showBanner).toBe(false);
    
    // Assert consent is updated
    expect(result.current.consent).toEqual({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  });

  it('should save consent and hide banner when rejecting all', () => {
    vi.mocked(cookieUtils.getStoredConsent).mockReturnValue(null);
    
    const { result } = renderHook(() => useCookieConsent());
    
    // Reject all
    act(() => {
      result.current.rejectAll();
    });
    
    // Assert consent was saved with only necessary
    expect(cookieUtils.saveConsent).toHaveBeenCalledWith({
      necessary: true,
      analytics: false,
      marketing: false,
    });
    
    // Assert banner is hidden
    expect(result.current.showBanner).toBe(false);
  });

  it('should open settings modal and hide banner', () => {
    vi.mocked(cookieUtils.getStoredConsent).mockReturnValue(null);
    
    const { result } = renderHook(() => useCookieConsent());
    
    // Open settings
    act(() => {
      result.current.openSettings();
    });
    
    // Assert settings modal is shown
    expect(result.current.showSettings).toBe(true);
    
    // Assert banner is hidden
    expect(result.current.showBanner).toBe(false);
  });

  it('should always enforce necessary=true when updating consent', () => {
    vi.mocked(cookieUtils.getStoredConsent).mockReturnValue(null);
    
    const { result } = renderHook(() => useCookieConsent());
    
    // Try to set necessary to false (should be ignored)
    act(() => {
      result.current.updateConsent({
        necessary: false,
        analytics: true,
        marketing: true,
      });
    });
    
    // Assert necessary is still true
    expect(cookieUtils.saveConsent).toHaveBeenCalledWith(
      expect.objectContaining({
        necessary: true,
      })
    );
    
    expect(result.current.consent.necessary).toBe(true);
  });

  it('should dispatch custom event when consent changes', () => {
    vi.mocked(cookieUtils.getStoredConsent).mockReturnValue(null);
    
    // Listen for custom event
    const eventListener = vi.fn();
    window.addEventListener('cookieConsentChange', eventListener);
    
    const { result } = renderHook(() => useCookieConsent());
    
    // Accept all
    act(() => {
      result.current.acceptAll();
    });
    
    // Assert event was dispatched
    expect(eventListener).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'cookieConsentChange',
        detail: expect.objectContaining({
          consent: {
            necessary: true,
            analytics: true,
            marketing: true,
          },
        }),
      })
    );
    
    window.removeEventListener('cookieConsentChange', eventListener);
  });

  it('should reconcile state when cookie changes externally (storage event)', () => {
    // Start with no consent
    vi.mocked(cookieUtils.getStoredConsent).mockReturnValue(null);
    
    const { result, rerender } = renderHook(() => useCookieConsent());
    
    // Initial state: banner visible
    expect(result.current.showBanner).toBe(true);
    
    // Simulate external cookie change (e.g., from another tab)
    const newConsent = {
      version: 1,
      timestamp: Date.now(),
      consent: {
        necessary: true,
        analytics: true,
        marketing: true,
      },
    };
    
    vi.mocked(cookieUtils.getStoredConsent).mockReturnValue(newConsent);
    
    // Dispatch storage event
    act(() => {
      window.dispatchEvent(new Event('storage'));
    });
    
    rerender();
    
    // Assert state is reconciled
    expect(result.current.showBanner).toBe(false);
    expect(result.current.consent).toEqual(newConsent.consent);
  });

  it('should not allow closing banner without consent on first visit', () => {
    vi.mocked(cookieUtils.getStoredConsent).mockReturnValue(null);
    
    const { result } = renderHook(() => useCookieConsent());
    
    // Try to close banner (should be no-op when no consent exists)
    act(() => {
      result.current.closeBanner();
    });
    
    // Banner should still be visible (no consent exists)
    expect(result.current.showBanner).toBe(true);
  });

  it('should allow closing banner when consent already exists', () => {
    // Start with existing consent
    const storedConsent = {
      version: 1,
      timestamp: Date.now(),
      consent: {
        necessary: true,
        analytics: true,
        marketing: false,
      },
    };
    
    vi.mocked(cookieUtils.getStoredConsent).mockReturnValue(storedConsent);
    
    const { result } = renderHook(() => useCookieConsent());
    
    // Banner should be hidden initially
    expect(result.current.showBanner).toBe(false);
    
    // Manually show banner (e.g., user clicks "manage cookies" link)
    act(() => {
      result.current.openSettings();
      result.current.closeSettings();
    });
    
    // Close banner
    act(() => {
      result.current.closeBanner();
    });
    
    // Banner should be hidden
    expect(result.current.showBanner).toBe(false);
  });
});
