import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axe } from 'jest-axe';

// Create a test component that uses prefers-reduced-motion
const TestReducedMotionComponent = ({ children }: { children: React.ReactNode }) => {
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  return (
    <div 
      data-testid="motion-test-component"
      data-reduced-motion={prefersReducedMotion}
      className={prefersReducedMotion ? 'motion-reduce' : 'motion-normal'}
      style={{
        animation: prefersReducedMotion ? 'none' : 'fade-in 0.3s ease-out',
        transition: prefersReducedMotion ? 'none' : 'all 0.2s ease-in-out'
      }}
    >
      {children}
    </div>
  );
};

// Mock 3D components that should respect reduced motion
const Mock3DComponent = () => {
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  return (
    <div 
      data-testid="3d-component"
      data-reduced-motion={prefersReducedMotion}
      role="img" 
      aria-label={prefersReducedMotion ? "Static 3D scene" : "Animated 3D scene"}
    >
      {prefersReducedMotion ? (
        <div data-testid="static-fallback">Static 3D Scene</div>
      ) : (
        <div data-testid="animated-scene">Animated 3D Scene</div>
      )}
    </div>
  );
};

describe('Prefers-Reduced-Motion Accessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should respect prefers-reduced-motion: reduce', () => {
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

    const { getByTestId } = render(
      <TestReducedMotionComponent>
        <p>Test content</p>
      </TestReducedMotionComponent>
    );

    const component = getByTestId('motion-test-component');
    expect(component).toHaveAttribute('data-reduced-motion', 'true');
    expect(component).toHaveClass('motion-reduce');
    expect(component).toHaveStyle('animation: none');
    expect(component).toHaveStyle('transition: none');
  });

  it('should allow normal motion when prefers-reduced-motion is not set', () => {
    // Mock normal motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { getByTestId } = render(
      <TestReducedMotionComponent>
        <p>Test content</p>
      </TestReducedMotionComponent>
    );

    const component = getByTestId('motion-test-component');
    expect(component).toHaveAttribute('data-reduced-motion', 'false');
    expect(component).toHaveClass('motion-normal');
    expect(component).toHaveStyle('animation: fade-in 0.3s ease-out');
    expect(component).toHaveStyle('transition: all 0.2s ease-in-out');
  });

  it('should provide static fallbacks for 3D components when motion is reduced', () => {
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

    const { getByTestId, queryByTestId } = render(<Mock3DComponent />);

    const component = getByTestId('3d-component');
    expect(component).toHaveAttribute('data-reduced-motion', 'true');
    expect(component).toHaveAttribute('aria-label', 'Static 3D scene');
    
    expect(getByTestId('static-fallback')).toBeInTheDocument();
    expect(queryByTestId('animated-scene')).not.toBeInTheDocument();
  });

  it('should show animated content when motion is not reduced', () => {
    // Mock normal motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { getByTestId, queryByTestId } = render(<Mock3DComponent />);

    const component = getByTestId('3d-component');
    expect(component).toHaveAttribute('data-reduced-motion', 'false');
    expect(component).toHaveAttribute('aria-label', 'Animated 3D scene');
    
    expect(getByTestId('animated-scene')).toBeInTheDocument();
    expect(queryByTestId('static-fallback')).not.toBeInTheDocument();
  });

  it('should not have accessibility violations with reduced motion', async () => {
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

    const { container } = render(
      <div>
        <TestReducedMotionComponent>
          <h1>Accessible Motion Test</h1>
          <p>This content respects user motion preferences</p>
        </TestReducedMotionComponent>
        <Mock3DComponent />
      </div>
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it('should handle media query changes dynamically', () => {
    // Mock matchMedia with callback support
    const mockMediaQuery = {
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockReturnValue(mockMediaQuery),
    });

    const { getByTestId, rerender } = render(<TestReducedMotionComponent>Test</TestReducedMotionComponent>);
    
    // Initially should allow motion
    expect(getByTestId('motion-test-component')).toHaveAttribute('data-reduced-motion', 'false');
    
    // Simulate media query change to reduced motion
    mockMediaQuery.matches = true;
    
    // Re-render to simulate state change
    rerender(<TestReducedMotionComponent>Test Updated</TestReducedMotionComponent>);
    
    // Should still be accessible and handle the change properly
    expect(getByTestId('motion-test-component')).toBeInTheDocument();
  });

  it('should provide meaningful alternative content for reduced motion', () => {
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

    const { getByTestId } = render(<Mock3DComponent />);

    const staticFallback = getByTestId('static-fallback');
    expect(staticFallback).toHaveTextContent('Static 3D Scene');
    
    // Ensure the alternative content is meaningful and accessible
    const component = getByTestId('3d-component');
    expect(component).toHaveAttribute('role', 'img');
    expect(component).toHaveAttribute('aria-label', 'Static 3D scene');
  });

  it('should maintain focus management with reduced motion', async () => {
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

    const FocusTestComponent = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      return (
        <div>
          <button 
            data-testid="focus-button"
            className={prefersReducedMotion ? 'focus:outline-2' : 'focus:outline-1'}
            style={{
              transition: prefersReducedMotion ? 'none' : 'all 0.2s'
            }}
          >
            Focus Test Button
          </button>
        </div>
      );
    };

    const { getByTestId } = render(<FocusTestComponent />);
    
    const button = getByTestId('focus-button');
    button.focus();
    
    expect(document.activeElement).toBe(button);
    expect(button).toHaveClass('focus:outline-2');
    expect(button).toHaveStyle('transition: none');
  });
});