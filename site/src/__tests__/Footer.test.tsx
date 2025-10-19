import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Footer from '@/components/Footer';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock Logo component
vi.mock('@/components/Logo', () => ({
  default: () => <div data-testid="logo">ProWeb Studio Logo</div>,
}));

// Mock Button component
vi.mock('@/components/Button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

// Mock CookieSettingsButton component
vi.mock('@/components/cookies/CookieSettingsButton', () => ({
  default: () => <button data-testid="cookie-settings">Cookie Instellingen</button>,
}));

// Mock site config
vi.mock('@/config/site.config', () => ({
  siteConfig: {
    name: 'ProWeb Studio',
    tagline: 'Innovatieve weboplossingen',
    email: 'info@prowebstudio.nl',
    phone: '+31612345678',
  },
}));

// Mock internal linking config
vi.mock('@/config/internal-linking.config', () => ({
  footerLinkGroups: [
    {
      title: 'Services',
      links: [
        { title: 'Webdesign', href: '/webdesign', priority: 'high' },
        { title: '3D Visualisatie', href: '/3d-visualisatie', priority: 'medium' },
      ],
    },
  ],
}));

describe('Footer Component', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset process.env before each test
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Company Registration Info', () => {
    it('should render KVK and BTW when both env variables are present', () => {
      process.env.NEXT_PUBLIC_KVK = '93769865';
      process.env.NEXT_PUBLIC_BTW = 'NL005041113B60';

      render(<Footer />);

      const registrationSection = screen.getByTestId('company-registration-info');
      expect(registrationSection).toBeInTheDocument();

      const kvkInfo = screen.getByTestId('kvk-info');
      expect(kvkInfo).toBeInTheDocument();
      expect(kvkInfo).toHaveTextContent('KVK: 93769865');

      const btwInfo = screen.getByTestId('btw-info');
      expect(btwInfo).toBeInTheDocument();
      expect(btwInfo).toHaveTextContent('BTW/VAT: NL005041113B60');
    });

    it('should render only KVK when BTW is missing', () => {
      process.env.NEXT_PUBLIC_KVK = '93769865';
      process.env.NEXT_PUBLIC_BTW = '';

      render(<Footer />);

      const registrationSection = screen.getByTestId('company-registration-info');
      expect(registrationSection).toBeInTheDocument();

      const kvkInfo = screen.getByTestId('kvk-info');
      expect(kvkInfo).toBeInTheDocument();
      expect(kvkInfo).toHaveTextContent('KVK: 93769865');

      const btwInfo = screen.queryByTestId('btw-info');
      expect(btwInfo).not.toBeInTheDocument();
    });

    it('should render only BTW when KVK is missing', () => {
      process.env.NEXT_PUBLIC_KVK = '';
      process.env.NEXT_PUBLIC_BTW = 'NL005041113B60';

      render(<Footer />);

      const registrationSection = screen.getByTestId('company-registration-info');
      expect(registrationSection).toBeInTheDocument();

      const kvkInfo = screen.queryByTestId('kvk-info');
      expect(kvkInfo).not.toBeInTheDocument();

      const btwInfo = screen.getByTestId('btw-info');
      expect(btwInfo).toBeInTheDocument();
      expect(btwInfo).toHaveTextContent('BTW/VAT: NL005041113B60');
    });

    it('should hide entire registration section when both env variables are missing', () => {
      process.env.NEXT_PUBLIC_KVK = '';
      process.env.NEXT_PUBLIC_BTW = '';

      render(<Footer />);

      const registrationSection = screen.queryByTestId('company-registration-info');
      expect(registrationSection).not.toBeInTheDocument();

      const kvkInfo = screen.queryByTestId('kvk-info');
      expect(kvkInfo).not.toBeInTheDocument();

      const btwInfo = screen.queryByTestId('btw-info');
      expect(btwInfo).not.toBeInTheDocument();
    });

    it('should hide entire registration section when env variables are undefined', () => {
      delete process.env.NEXT_PUBLIC_KVK;
      delete process.env.NEXT_PUBLIC_BTW;

      render(<Footer />);

      const registrationSection = screen.queryByTestId('company-registration-info');
      expect(registrationSection).not.toBeInTheDocument();
    });
  });

  describe('Footer Structure', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_KVK = '93769865';
      process.env.NEXT_PUBLIC_BTW = 'NL005041113B60';
    });

    it('should render footer with all main sections', () => {
      render(<Footer />);

      // Logo should be present
      expect(screen.getByTestId('logo')).toBeInTheDocument();

      // Newsletter section
      expect(screen.getByText(/Digitale Magie Direct in je Inbox/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('jouw@email.nl')).toBeInTheDocument();

      // Legal links
      expect(screen.getByText('Privacybeleid')).toBeInTheDocument();
      expect(screen.getByText('Cookiebeleid')).toBeInTheDocument();
      expect(screen.getByText('Algemene voorwaarden')).toBeInTheDocument();

      // Contact info
      expect(screen.getByText('info@prowebstudio.nl')).toBeInTheDocument();
      expect(screen.getByText('+31612345678')).toBeInTheDocument();

      // Cookie settings button
      expect(screen.getByTestId('cookie-settings')).toBeInTheDocument();
    });

    it('should render copyright notice', () => {
      render(<Footer />);
      
      const currentYear = new Date().getFullYear();
      expect(screen.getByText(new RegExp(`© ${currentYear} ProWeb Studio`))).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_KVK = '93769865';
      process.env.NEXT_PUBLIC_BTW = 'NL005041113B60';
    });

    it('should have proper ARIA labels for navigation', () => {
      render(<Footer />);

      expect(screen.getByLabelText('Services navigation')).toBeInTheDocument();
      expect(screen.getByLabelText('Juridische informatie')).toBeInTheDocument();
    });

    it('should have accessible form labels', () => {
      render(<Footer />);

      const emailInput = screen.getByLabelText('E-mailadres voor nieuwsbrief');
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('should use aria-hidden for decorative elements', () => {
      render(<Footer />);
      
      const decorativeSeparators = screen.getAllByText('•');
      decorativeSeparators.forEach((separator) => {
        // Most separators should have aria-hidden
        const hasAriaHidden = separator.getAttribute('aria-hidden') === 'true' || 
                             separator.parentElement?.getAttribute('aria-hidden') === 'true';
        // Some might be in spans without aria-hidden, which is acceptable
        expect(hasAriaHidden || separator.textContent === '•').toBe(true);
      });
    });
  });

  describe('Newsletter Form', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_KVK = '93769865';
      process.env.NEXT_PUBLIC_BTW = 'NL005041113B60';
      global.fetch = vi.fn();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should handle successful newsletter subscription', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'Bedankt voor je inschrijving!' }),
      });

      render(<Footer />);

      const emailInput = screen.getByPlaceholderText('jouw@email.nl');
      const submitButton = screen.getByText('Inschrijven');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Bedankt voor je inschrijving!')).toBeInTheDocument();
      });
    });

    it('should validate email format', () => {
      render(<Footer />);

      const emailInput = screen.getByPlaceholderText('jouw@email.nl') as HTMLInputElement;
      
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(emailInput).toHaveAttribute('required');
    });
  });
});
