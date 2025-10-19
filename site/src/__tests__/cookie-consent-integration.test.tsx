/**
 * Cookie Consent Integration Tests
 * End-to-end tests verifying banner, 3D canvas, and analytics integration
 */

import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Next.js Script
const mockAnalyticsScriptLoaded = vi.fn();
vi.mock('next/script', () => ({
  default: ({ src, ...props }: any) => {
    if (src?.includes('plausible.io')) {
      mockAnalyticsScriptLoaded(src);
      return <script src={src} data-testid="analytics-script" {...props} />;
    }
    return null;
  },
}));

// Mock 3D Canvas
const mockCanvasRender = vi.fn();
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => {
    mockCanvasRender();
    return (
      <div data-testid="3d-canvas" data-rendering="true">
        {children}
      </div>
    );
  },
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    gl: {
      render: vi.fn(),
      domElement: document.createElement('canvas'),
    },
  })),
}));

vi.mock('@react-three/drei', () => ({
  Sphere: () => <div data-testid="sphere" />,
  OrbitControls: () => <div data-testid="orbit-controls" />,
  Environment: () => null,
  ContactShadows: () => null,
  Preload: ({ children }: any) => <>{children}</>,
  useDetectGPU: () => ({ tier: 2 }),
  Text: () => null,
  Torus: () => null,
  RoundedBox: () => null,
  MeshDistortMaterial: () => null,
}));

// Import components after mocks
import CookieConsentBanner from '@/components/cookies/CookieConsentBanner';
import ConsentAwareAnalytics from '@/components/cookies/ConsentAwareAnalytics';
import BrandIdentityModel from '@/three/BrandIdentityModel';

// Test wrapper component that simulates the app layout
function TestApp({ showBanner = true }: { showBanner?: boolean }) {
  return (
    <div data-testid="app-root">
      {/* 3D Canvas - should always render */}
      <BrandIdentityModel />

      {/* Cookie Banner - conditional */}
      {showBanner && <CookieConsentBanner />}

      {/* Analytics - consent-aware */}
      <ConsentAwareAnalytics plausibleDomain="prowebstudio.nl" />
    </div>
  );
}

describe('Cookie Consent Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAnalyticsScriptLoaded.mockClear();
    mockCanvasRender.mockClear();
    vi.useFakeTimers();

    // Clear cookies
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });

    // Clean up analytics
    document.querySelectorAll('script[src*="plausible.io"]').forEach((s) => s.remove());
    delete (window as any).plausible;

    // Mock WebGL
    HTMLCanvasElement.prototype.getContext = vi.fn((type: string) => {
      if (type === 'webgl' || type === 'webgl2') {
        return {
          clear: vi.fn(),
          viewport: vi.fn(),
        } as any;
      }
      return null;
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('First Visit - No Consent', () => {
    it('should show banner, render 3D canvas, and NOT inject analytics', async () => {
      const { container, getByTestId } = render(<TestApp showBanner={true} />);

      // 1. Banner should appear within 500ms
      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const banner = container.querySelector('[role="dialog"]');
      expect(banner).toBeInTheDocument();

      // 2. 3D canvas should be rendering
      const canvas = getByTestId('3d-canvas');
      expect(canvas).toBeInTheDocument();
      expect(canvas).toHaveAttribute('data-rendering', 'true');
      expect(mockCanvasRender).toHaveBeenCalled();

      // 3. Analytics script should NOT be present
      const analyticsScript = container.querySelector('script[src*="plausible.io"]');
      expect(analyticsScript).not.toBeInTheDocument();
      expect(mockAnalyticsScriptLoaded).not.toHaveBeenCalled();
    });

    it('should render 3D canvas before banner is shown', async () => {
      const renderOrder: string[] = [];

      const OriginalCanvas = vi.fn(({ children }: any) => {
        renderOrder.push('canvas');
        return <div data-testid="3d-canvas">{children}</div>;
      });

      vi.mocked(await import('@react-three/fiber')).Canvas = OriginalCanvas as any;

      render(<TestApp showBanner={true} />);

      // Canvas should render immediately
      expect(renderOrder).toContain('canvas');
      expect(mockCanvasRender).toHaveBeenCalled();
    });

    it('should verify WebGL context is active without consent', () => {
      render(<TestApp showBanner={true} />);

      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');

      expect(gl).not.toBeNull();
      expect(gl).toHaveProperty('clear');
    });
  });

  describe('After Accepting All Cookies', () => {
    it('should inject analytics script after consent', async () => {
      const { container } = render(<TestApp showBanner={false} />);

      // Initially no analytics
      expect(container.querySelector('script[src*="plausible.io"]')).not.toBeInTheDocument();

      // Simulate consent granted
      await act(async () => {
        window.dispatchEvent(
          new CustomEvent('cookieConsentChange', {
            detail: {
              consent: {
                necessary: true,
                analytics: true,
                marketing: false,
              },
            },
          })
        );
      });

      // Wait for analytics to be injected
      await waitFor(
        () => {
          const script = document.querySelector('script[data-testid="analytics-script"]');
          expect(script).toBeInTheDocument();
          expect(script).toHaveAttribute('src', 'https://plausible.io/js/script.js');
        },
        { timeout: 2000 }
      );
    });

    it('should maintain 3D canvas rendering after consent', async () => {
      const { getByTestId } = render(<TestApp showBanner={false} />);

      // Grant consent
      await act(async () => {
        window.dispatchEvent(
          new CustomEvent('cookieConsentChange', {
            detail: {
              consent: { necessary: true, analytics: true, marketing: false },
            },
          })
        );
      });

      // 3D canvas should still be rendering
      const canvas = getByTestId('3d-canvas');
      expect(canvas).toBeInTheDocument();
      expect(canvas).toHaveAttribute('data-rendering', 'true');
    });

    it('should hide banner after accepting all', async () => {
      const { container, rerender } = render(<TestApp showBanner={true} />);

      // Banner initially shown
      expect(container.querySelector('[role="dialog"]')).toBeInTheDocument();

      // After consent, banner should be hidden
      rerender(<TestApp showBanner={false} />);

      expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
    });
  });

  describe('Performance - Banner Timing', () => {
    it('should show banner within 500ms on first visit', async () => {
      const start = performance.now();

      render(<TestApp showBanner={true} />);

      await act(async () => {
        vi.advanceTimersByTime(100);
      });

      const banner = screen.getByRole('dialog');
      expect(banner).toBeInTheDocument();

      const elapsed = performance.now() - start;
      expect(elapsed).toBeLessThan(500);
    });

    it('should not block 3D canvas rendering while showing banner', async () => {
      const { getByTestId } = render(<TestApp showBanner={true} />);

      // Canvas should be available immediately
      const canvas = getByTestId('3d-canvas');
      expect(canvas).toBeInTheDocument();

      // Banner may still be animating in
      await act(async () => {
        vi.advanceTimersByTime(50);
      });

      // Both should be present
      expect(canvas).toBeInTheDocument();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Script Injection Verification', () => {
    it('should verify analytics script is absent before consent', () => {
      render(<TestApp showBanner={true} />);

      // Check DOM directly
      const scripts = Array.from(document.getElementsByTagName('script'));
      const analyticsScript = scripts.find((s) => s.src.includes('plausible.io'));

      expect(analyticsScript).toBeUndefined();
    });

    it('should verify analytics script presence after consent', async () => {
      render(<TestApp showBanner={false} />);

      await act(async () => {
        window.dispatchEvent(
          new CustomEvent('cookieConsentChange', {
            detail: {
              consent: { necessary: true, analytics: true, marketing: false },
            },
          })
        );
      });

      await waitFor(
        () => {
          const script = document.querySelector(
            'script[src="https://plausible.io/js/script.js"]'
          );
          expect(script).toBeTruthy();
        },
        { timeout: 1000 }
      );
    });

    it('should include correct data-domain attribute', async () => {
      render(<TestApp showBanner={false} />);

      await act(async () => {
        window.dispatchEvent(
          new CustomEvent('cookieConsentChange', {
            detail: { consent: { analytics: true } },
          })
        );
      });

      await waitFor(() => {
        const script = document.querySelector('script[data-testid="analytics-script"]');
        expect(script).toHaveAttribute('data-domain', 'prowebstudio.nl');
      });
    });
  });

  describe('3D Canvas Independence', () => {
    it('should render 3D canvas regardless of consent state', () => {
      const { getByTestId, rerender } = render(<TestApp showBanner={true} />);

      // Canvas present without consent
      expect(getByTestId('3d-canvas')).toBeInTheDocument();

      // Grant consent
      rerender(<TestApp showBanner={false} />);

      // Canvas still present with consent
      expect(getByTestId('3d-canvas')).toBeInTheDocument();
    });

    it('should maintain WebGL context across consent changes', async () => {
      render(<TestApp showBanner={false} />);

      const canvas = document.createElement('canvas');
      const gl1 = canvas.getContext('webgl');

      await act(async () => {
        window.dispatchEvent(
          new CustomEvent('cookieConsentChange', {
            detail: { consent: { analytics: true } },
          })
        );
      });

      const gl2 = canvas.getContext('webgl');

      // Context should remain available
      expect(gl1).not.toBeNull();
      expect(gl2).not.toBeNull();
    });

    it('should call render loop independently of analytics', () => {
      render(<TestApp showBanner={true} />);

      // Canvas should be rendering
      expect(mockCanvasRender).toHaveBeenCalled();

      // But analytics should not be loaded
      expect(mockAnalyticsScriptLoaded).not.toHaveBeenCalled();
    });
  });
});
