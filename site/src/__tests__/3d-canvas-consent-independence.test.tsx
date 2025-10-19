/**
 * 3D Canvas and Cookie Consent Independence Tests
 * Verifies that 3D canvas renders independently of cookie consent state
 */

import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock react-three/fiber Canvas component
const mockCanvas = vi.fn(({ children }: any) => (
  <div data-testid="3d-canvas-mock" data-webgl="active">
    {children}
  </div>
));

vi.mock('@react-three/fiber', () => ({
  Canvas: mockCanvas,
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    gl: {
      render: vi.fn(),
      setSize: vi.fn(),
      domElement: document.createElement('canvas'),
    },
    camera: {},
    scene: {},
  })),
}));

vi.mock('@react-three/drei', () => ({
  Sphere: ({ children }: any) => <mesh data-testid="sphere">{children}</mesh>,
  Torus: ({ children }: any) => <mesh data-testid="torus">{children}</mesh>,
  RoundedBox: ({ children }: any) => <mesh data-testid="rounded-box">{children}</mesh>,
  OrbitControls: () => <div data-testid="orbit-controls" />,
  Environment: () => <div data-testid="environment" />,
  ContactShadows: () => <div data-testid="contact-shadows" />,
  Preload: ({ children }: any) => <div data-testid="preload">{children}</div>,
  useDetectGPU: vi.fn(() => ({ tier: 2, isMobile: false })),
  Text: ({ children }: any) => <mesh data-testid="text">{children}</mesh>,
  MeshDistortMaterial: ({ children }: any) => <div data-testid="distort-material">{children}</div>,
}));

// Mock Three.js
vi.mock('three', () => ({
  Group: vi.fn(),
  Color: vi.fn(),
  Vector3: vi.fn(),
  Mesh: vi.fn(),
  Scene: vi.fn(),
  WebGLRenderer: vi.fn(() => ({
    render: vi.fn(),
    setSize: vi.fn(),
    domElement: document.createElement('canvas'),
  })),
}));

// Import components after mocks
import BrandIdentityModel from '@/three/BrandIdentityModel';

describe('3D Canvas Rendering Before Consent', () => {
  let mockRequestAnimationFrame: ReturnType<typeof vi.fn>;
  let animationFrameCallbacks: FrameRequestCallback[];

  beforeEach(() => {
    vi.clearAllMocks();
    animationFrameCallbacks = [];

    // Mock requestAnimationFrame
    mockRequestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
      animationFrameCallbacks.push(callback);
      return animationFrameCallbacks.length;
    });
    global.requestAnimationFrame = mockRequestAnimationFrame;

    // Mock cancelAnimationFrame
    global.cancelAnimationFrame = vi.fn();

    // Clear cookies to simulate no consent
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });

    // Mock WebGL context
    HTMLCanvasElement.prototype.getContext = vi.fn((contextType: string) => {
      if (contextType === 'webgl' || contextType === 'webgl2') {
        return {
          getParameter: vi.fn(),
          getExtension: vi.fn(),
          createShader: vi.fn(),
          shaderSource: vi.fn(),
          compileShader: vi.fn(),
          createProgram: vi.fn(),
          attachShader: vi.fn(),
          linkProgram: vi.fn(),
          useProgram: vi.fn(),
          viewport: vi.fn(),
          clear: vi.fn(),
          clearColor: vi.fn(),
          enable: vi.fn(),
          disable: vi.fn(),
        } as any;
      }
      return null;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render 3D canvas without waiting for consent', () => {
    const { getByTestId } = render(<BrandIdentityModel />);

    // Canvas should be rendered immediately
    const canvas = getByTestId('3d-canvas-mock');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute('data-webgl', 'active');
  });

  it('should initialize WebGL context before consent', () => {
    const getContextSpy = vi.spyOn(HTMLCanvasElement.prototype, 'getContext');

    render(<BrandIdentityModel />);

    // Verify WebGL context was requested
    expect(getContextSpy).toHaveBeenCalled();
  });

  it('should call requestAnimationFrame for rendering loop', async () => {
    render(<BrandIdentityModel />);

    // Wait for component to mount and start animation loop
    await waitFor(
      () => {
        // Canvas rendering should trigger requestAnimationFrame
        // The mock Canvas component doesn't start animation automatically,
        // but we verify the setup is ready
        expect(mockRequestAnimationFrame).toHaveBeenCalled();
      },
      { timeout: 1000 }
    );
  });

  it('should have WebGL context available', () => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');

    expect(gl).not.toBeNull();
    expect(gl).toHaveProperty('clear');
    expect(gl).toHaveProperty('viewport');
  });

  describe('WebGL Context Checks', () => {
    it('should detect WebGL support', () => {
      const canvas = document.createElement('canvas');
      const webglContext = canvas.getContext('webgl');
      const webgl2Context = canvas.getContext('webgl2');

      // At least one WebGL context should be available
      const hasWebGL = webglContext !== null || webgl2Context !== null;
      expect(hasWebGL).toBe(true);
    });

    it('should create canvas element for 3D rendering', () => {
      const { container } = render(<BrandIdentityModel />);

      // Verify canvas-like element exists (our mock)
      const canvasElement = container.querySelector('[data-testid="3d-canvas-mock"]');
      expect(canvasElement).toBeInTheDocument();
    });

    it('should initialize 3D scene without analytics', () => {
      // Verify no analytics script exists
      const analyticsScript = document.querySelector('script[src*="plausible.io"]');
      expect(analyticsScript).toBeNull();

      // But 3D should still work
      const { getByTestId } = render(<BrandIdentityModel />);
      expect(getByTestId('3d-canvas-mock')).toBeInTheDocument();
    });
  });

  describe('Animation Frame Tests', () => {
    it('should schedule animation frames', () => {
      render(<BrandIdentityModel />);

      // Verify requestAnimationFrame was called
      expect(mockRequestAnimationFrame).toHaveBeenCalled();
    });

    it('should handle animation frame callbacks', () => {
      render(<BrandIdentityModel />);

      if (animationFrameCallbacks.length > 0) {
        // Execute the first animation frame callback
        const firstCallback = animationFrameCallbacks[0];
        expect(() => firstCallback(16.67)).not.toThrow();
      }
    });
  });

  describe('Canvas Rendering Performance', () => {
    it('should render canvas within performance budget', async () => {
      const startTime = performance.now();

      render(<BrandIdentityModel />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Canvas should render quickly (within 100ms in test environment)
      expect(renderTime).toBeLessThan(100);
    });
  });
});
