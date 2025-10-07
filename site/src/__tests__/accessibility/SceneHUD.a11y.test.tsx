import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, it, expect } from 'vitest';
import SceneHUD from '@/components/overlay/SceneHUD';

describe('SceneHUD Accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(
      <SceneHUD
        topLeft="Live Demo"
        bottomLeft="Interactive 3D Scene"
        bottomRight="Press 'Tab' to navigate"
      />
    );
    
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it('should render with proper semantic structure', () => {
    render(
      <SceneHUD
        topLeft="Live Demo"
        bottomLeft="Interactive 3D Scene"
        bottomRight="Controls: Tab to navigate"
      />
    );
    
    // Check that content is properly labeled and accessible
    expect(screen.getByText('Live Demo')).toBeInTheDocument();
    expect(screen.getByText('Interactive 3D Scene')).toBeInTheDocument();
    expect(screen.getByText('Controls: Tab to navigate')).toBeInTheDocument();
  });

  it('should have proper pointer-events configuration for overlay', () => {
    const { container } = render(
      <SceneHUD topLeft="Test" />
    );
    
    const overlayContainer = container.firstChild as HTMLElement;
    expect(overlayContainer).toHaveClass('pointer-events-none');
    
    // Interactive elements should have pointer-events-auto
    const interactiveElements = container.querySelectorAll('.pointer-events-auto');
    expect(interactiveElements.length).toBeGreaterThan(0);
  });

  it('should maintain readability with backdrop blur and contrast', () => {
    const { container } = render(
      <SceneHUD
        topLeft="High Contrast Test"
        bottomLeft="Backdrop Blur Test"
      />
    );
    
    // Check for backdrop blur classes that ensure readability
    const blurElements = container.querySelectorAll('.backdrop-blur-md, .backdrop-blur-xl');
    expect(blurElements.length).toBeGreaterThan(0);
    
    // Check for high contrast background
    const contrastElements = container.querySelectorAll('[class*="bg-white/"]');
    expect(contrastElements.length).toBeGreaterThan(0);
  });

  it('should be screen reader friendly', () => {
    render(
      <SceneHUD
        topLeft="Status: Active"
        bottomLeft="Scene: 3D Portfolio Showcase"
        bottomRight="Navigation: Use arrow keys"
      />
    );
    
    // Text content should be accessible to screen readers
    expect(screen.getByText('Status: Active')).toBeVisible();
    expect(screen.getByText('Scene: 3D Portfolio Showcase')).toBeVisible();
    expect(screen.getByText('Navigation: Use arrow keys')).toBeVisible();
  });

  it('should handle empty content gracefully', async () => {
    const { container } = render(<SceneHUD />);
    
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it('should maintain proper z-index layering for accessibility', () => {
    const { container } = render(
      <SceneHUD topLeft="Layer Test" />
    );
    
    const overlayContainer = container.firstChild as HTMLElement;
    expect(overlayContainer).toHaveClass('z-20');
    
    // Ensure it's above canvas but below modals/dialogs
    const zIndexStyle = window.getComputedStyle(overlayContainer).zIndex;
    const zIndexValue = parseInt(zIndexStyle);
    expect(zIndexValue).toBe(20);
  });
});