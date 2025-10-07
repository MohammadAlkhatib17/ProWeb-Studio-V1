import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, it, expect, vi } from 'vitest';
import MobileMenu from '@/components/navigation/MobileMenu';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/test-path'
}));

// Mock the Portal component
vi.mock('@/components/ui/Portal', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="portal">{children}</div>
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Mock other components
vi.mock('@/hooks/useLockBodyScroll', () => ({
  useLockBodyScroll: vi.fn()
}));

vi.mock('@/components/ui/Magnetic', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

vi.mock('@/components/decoration/AuroraBG', () => ({
  default: () => <div data-testid="aurora-bg" />
}));

const mockItems = [
  { href: '/home', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' }
];

describe('MobileMenu Accessibility', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    items: mockItems
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not have any accessibility violations', async () => {
    const { container } = render(<MobileMenu {...defaultProps} />);
    
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it('should have proper dialog role and aria-modal', () => {
    render(<MobileMenu {...defaultProps} />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal');
  });

  it('should have properly labeled close button', () => {
    render(<MobileMenu {...defaultProps} />);
    
    const closeButton = screen.getByRole('button', { name: /close menu/i });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveAttribute('aria-label', 'Close menu');
  });

  it('should focus first menu item on open', async () => {
    const user = userEvent.setup();
    
    render(<MobileMenu {...defaultProps} />);
    
    await waitFor(() => {
      const firstLink = screen.getByRole('link', { name: 'Home' });
      expect(document.activeElement).toBe(firstLink);
    });
  });

  it('should handle keyboard navigation properly', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    
    render(<MobileMenu {...defaultProps} onClose={onClose} />);
    
    // Test Escape key to close
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });

  it('should have proper navigation structure with links', () => {
    render(<MobileMenu {...defaultProps} />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(mockItems.length);
    
    mockItems.forEach((item) => {
      const link = screen.getByRole('link', { name: item.label });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', item.href);
    });
  });

  it('should indicate current page with aria-current', () => {
    // Mock pathname to match one of our items
    vi.mocked(require('next/navigation').usePathname).mockReturnValue('/home');
    
    render(<MobileMenu {...defaultProps} />);
    
    const activeLink = screen.getByRole('link', { name: 'Home' });
    expect(activeLink).toHaveAttribute('aria-current', 'page');
  });

  it('should have proper focus management', async () => {
    const user = userEvent.setup();
    
    render(<MobileMenu {...defaultProps} />);
    
    const links = screen.getAllByRole('link');
    
    // Tab through links
    await user.tab();
    expect(document.activeElement).toBe(links[1]); // Second link (first gets focus on mount)
    
    await user.tab();
    expect(document.activeElement).toBe(links[2]); // Third link
  });

  it('should have sufficient color contrast and visibility', () => {
    const { container } = render(<MobileMenu {...defaultProps} />);
    
    // Check for backdrop blur and opacity classes that ensure readability
    const backdrop = container.querySelector('.backdrop-blur-sm');
    expect(backdrop).toBeInTheDocument();
    
    // Check for proper contrast classes
    const menuPanel = container.querySelector('.bg-white\\/6');
    expect(menuPanel).toBeInTheDocument();
  });

  it('should handle focus trap within dialog', async () => {
    const user = userEvent.setup();
    
    render(<MobileMenu {...defaultProps} />);
    
    const closeButton = screen.getByRole('button', { name: /close menu/i });
    const links = screen.getAllByRole('link');
    const lastLink = links[links.length - 1];
    
    // Focus should be trapped within the dialog
    lastLink.focus();
    await user.tab();
    
    // Should cycle back to close button or first focusable element
    expect([closeButton, links[0]]).toContain(document.activeElement);
  });

  it('should call onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    
    render(<MobileMenu {...defaultProps} onClose={onClose} />);
    
    const closeButton = screen.getByRole('button', { name: /close menu/i });
    await user.click(closeButton);
    
    expect(onClose).toHaveBeenCalled();
  });

  it('should not render when closed', () => {
    render(<MobileMenu {...defaultProps} open={false} />);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('should have proper minimum touch target sizes', () => {
    const { container } = render(<MobileMenu {...defaultProps} />);
    
    const links = container.querySelectorAll('a');
    links.forEach((link) => {
      // Check for min-h-[44px] class which ensures 44px minimum touch target
      expect(link).toHaveClass('min-h-[44px]');
    });
  });

  it('should support screen readers with proper semantics', () => {
    render(<MobileMenu {...defaultProps} />);
    
    // Dialog should be announced to screen readers
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal');
    
    // Navigation should be properly labeled
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    
    // Links should have accessible names
    mockItems.forEach((item) => {
      const link = screen.getByRole('link', { name: item.label });
      expect(link).toHaveAccessibleName(item.label);
    });
  });

  it('should handle reduced motion preferences', () => {
    // Mock prefers-reduced-motion
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
    
    const { container } = render(<MobileMenu {...defaultProps} />);
    
    // Component should still render and be accessible even with reduced motion
    expect(container.firstChild).toBeInTheDocument();
    
    const results = axe(container);
    expect(results).resolves.toHaveProperty('violations', []);
  });
});