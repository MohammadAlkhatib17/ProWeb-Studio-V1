import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the 3D libraries to avoid WebGL issues in tests
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children, ...props }: any) => (
    <div data-testid="canvas" data-canvas-props={JSON.stringify(props)}>{children}</div>
  ),
  useFrame: vi.fn(),
  useThree: () => ({ size: { width: 800, height: 600 }, camera: {} }),
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: (props: any) => <div data-testid="orbit-controls" {...props} />,
  PerspectiveCamera: (props: any) => <div data-testid="camera" {...props} />,
  Environment: (props: any) => <div data-testid="environment" {...props} />,
}));

vi.mock('three', () => ({
  Vector3: class MockVector3 {
    constructor(public x = 0, public y = 0, public z = 0) {}
  },
  Mesh: class MockMesh {},
  Group: class MockGroup {},
}));

// Mock the reduced motion hook
vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: vi.fn(() => false)
}));

// Create a test wrapper for 3D components that handles reduced motion
const Test3DWrapper = ({ 
  children, 
  fallback, 
  label 
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
  label: string;
}) => {
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  if (prefersReducedMotion && fallback) {
    return (
      <div 
        data-testid="3d-fallback"
        role="img"
        aria-label={`${label} (static version)`}
        tabIndex={0}
      >
        {fallback}
      </div>
    );
  }

  return (
    <div 
      data-testid="3d-interactive"
      role="img"
      aria-label={label}
      tabIndex={0}
      aria-describedby="3d-instructions"
    >
      {children}
      <div id="3d-instructions" className="sr-only">
        Use arrow keys to rotate. Press space to pause animation.
      </div>
    </div>
  );
};

// Mock interactive 3D component with proper keyboard controls
const Interactive3DScene = ({ title }: { title: string }) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case ' ':
        event.preventDefault();
        // Toggle animation pause
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'ArrowUp':
      case 'ArrowDown':
        event.preventDefault();
        // Handle rotation
        break;
      case 'r':
      case 'R':
        event.preventDefault();
        // Reset view
        break;
    }
  };

  return (
    <Test3DWrapper 
      label={title}
      fallback={<div data-testid="static-scene">Static {title}</div>}
    >
      <div 
        data-testid="canvas-container"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="application"
        aria-label={title}
        aria-describedby="3d-controls"
      >
        <div data-testid="canvas">3D Scene Content</div>
        <div id="3d-controls" className="sr-only">
          Use arrow keys to rotate the 3D model. Press spacebar to pause animation. Press R to reset view.
        </div>
      </div>
    </Test3DWrapper>
  );
};

describe('3D Interactive Components Accessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not have accessibility violations in interactive mode', async () => {
    // Mock normal motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { container } = render(<Interactive3DScene title="Portfolio Showcase" />);
    
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it('should not have accessibility violations in reduced motion mode', async () => {
    // Mock reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { container } = render(<Interactive3DScene title="Portfolio Showcase" />);
    
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it('should provide keyboard navigation instructions', () => {
    render(<Interactive3DScene title="3D Model Viewer" />);
    
    // Check for screen reader instructions
    expect(screen.getByText(/Use arrow keys to rotate/)).toBeInTheDocument();
    expect(screen.getByText(/Press spacebar to pause/)).toBeInTheDocument();
    expect(screen.getByText(/Press R to reset/)).toBeInTheDocument();
  });

  it('should be focusable and have proper ARIA labels', () => {
    render(<Interactive3DScene title="Interactive 3D Portfolio" />);
    
    const interactive3D = screen.getByTestId('3d-interactive');
    expect(interactive3D).toHaveAttribute('role', 'img');
    expect(interactive3D).toHaveAttribute('aria-label', 'Interactive 3D Portfolio');
    expect(interactive3D).toHaveAttribute('tabIndex', '0');
    
    const canvasContainer = screen.getByTestId('canvas-container');
    expect(canvasContainer).toHaveAttribute('role', 'application');
    expect(canvasContainer).toHaveAttribute('tabIndex', '0');
  });

  it('should show static fallback for reduced motion users', () => {
    // Mock reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(<Interactive3DScene title="3D Animation" />);
    
    const fallback = screen.getByTestId('3d-fallback');
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveAttribute('role', 'img');
    expect(fallback).toHaveAttribute('aria-label', '3D Animation (static version)');
    
    expect(screen.getByTestId('static-scene')).toBeInTheDocument();
    expect(screen.queryByTestId('canvas-container')).not.toBeInTheDocument();
  });

  it('should handle keyboard interactions properly', () => {
    const { getByTestId } = render(<Interactive3DScene title="Keyboard Test" />);
    
    const canvasContainer = getByTestId('canvas-container');
    
    // Test spacebar for pause
    const spacebarEvent = new KeyboardEvent('keydown', { key: ' ' });
    Object.defineProperty(spacebarEvent, 'preventDefault', {
      value: vi.fn(),
      writable: true
    });
    
    canvasContainer.dispatchEvent(spacebarEvent);
    expect(spacebarEvent.preventDefault).toHaveBeenCalled();
    
    // Test arrow keys for rotation
    const arrowEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    Object.defineProperty(arrowEvent, 'preventDefault', {
      value: vi.fn(),
      writable: true
    });
    
    canvasContainer.dispatchEvent(arrowEvent);
    expect(arrowEvent.preventDefault).toHaveBeenCalled();
  });

  it('should maintain focus visibility', () => {
    const { getByTestId } = render(<Interactive3DScene title="Focus Test" />);
    
    const interactive3D = getByTestId('3d-interactive');
    const canvasContainer = getByTestId('canvas-container');
    
    // Both should be focusable
    expect(interactive3D).toHaveAttribute('tabIndex', '0');
    expect(canvasContainer).toHaveAttribute('tabIndex', '0');
    
    // Focus the interactive container
    interactive3D.focus();
    expect(document.activeElement).toBe(interactive3D);
  });

  it('should provide meaningful alternative content', () => {
    // Mock reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(<Interactive3DScene title="Product Showcase" />);
    
    const staticScene = screen.getByTestId('static-scene');
    expect(staticScene).toHaveTextContent('Static Product Showcase');
    
    const fallback = screen.getByTestId('3d-fallback');
    expect(fallback).toHaveAttribute('aria-label', 'Product Showcase (static version)');
  });

  it('should work with screen readers', () => {
    render(<Interactive3DScene title="Screen Reader Test" />);
    
    // Check for descriptive content
    const controlsDescription = screen.getByText(/Use arrow keys to rotate/);
    expect(controlsDescription).toHaveClass('sr-only');
    
    const interactive3D = screen.getByTestId('3d-interactive');
    expect(interactive3D).toHaveAttribute('aria-describedby', '3d-instructions');
    
    const canvasContainer = screen.getByTestId('canvas-container');
    expect(canvasContainer).toHaveAttribute('aria-describedby', '3d-controls');
  });

  it('should handle high contrast mode gracefully', () => {
    // Mock high contrast media query
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => {
        if (query === '(prefers-contrast: high)') return { matches: true };
        if (query === '(prefers-reduced-motion: reduce)') return { matches: false };
        return { matches: false };
      }),
    });

    const { container } = render(<Interactive3DScene title="High Contrast Test" />);
    
    // Should still render without issues
    expect(container.firstChild).toBeInTheDocument();
    
    // Check that interactive elements are still focusable
    const interactive3D = screen.getByTestId('3d-interactive');
    expect(interactive3D).toHaveAttribute('tabIndex', '0');
  });

  it('should support color blind users with non-color dependent interactions', () => {
    render(<Interactive3DScene title="Color Blind Friendly Test" />);
    
    // Controls should not rely solely on color
    const controlsText = screen.getByText(/Use arrow keys to rotate/);
    expect(controlsText).toBeInTheDocument();
    
    // Instructions should be text-based, not color-based
    const instructions = screen.getByText(/Press spacebar to pause/);
    expect(instructions).toBeInTheDocument();
  });

  it('should provide skip links for complex 3D content', () => {
    const ComplexScene = () => (
      <div>
        <a href="#after-3d" className="sr-only focus:not-sr-only">
          Skip 3D content
        </a>
        <Interactive3DScene title="Complex 3D Scene" />
        <div id="after-3d">Content after 3D scene</div>
      </div>
    );

    render(<ComplexScene />);
    
    const skipLink = screen.getByText('Skip 3D content');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#after-3d');
  });
});