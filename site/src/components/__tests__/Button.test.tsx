import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Button } from '../Button';

describe('Button', () => {
  it('renders as a link with the correct text', () => {
    render(<Button href="/test">Click me</Button>);
    const button = screen.getByRole('link', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('renders as a button when as="button" is specified', () => {
    const handleClick = vi.fn();
    render(<Button as="button" onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('has the correct href attribute for links', () => {
    render(<Button href="/test">Click me</Button>);
    const button = screen.getByRole('link');
    expect(button).toHaveAttribute('href', '/test');
  });

  it('handles button clicks correctly', () => {
    const handleClick = vi.fn();
    render(<Button as="button" onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies the primary variant class by default', () => {
    render(<Button href="/test">Click me</Button>);
    const button = screen.getByRole('link');
    expect(button).toHaveClass('bg-gradient-to-r from-cyan-500 to-magenta-500');
  });

  it('applies the secondary variant class when specified', () => {
    render(
      <Button href="/test" variant="secondary">
        Click me
      </Button>,
    );
    const button = screen.getByRole('link');
    expect(button).toHaveClass('border border-cyan-500/60');
  });

  it('applies the normal size class by default', () => {
    render(<Button href="/test">Click me</Button>);
    const button = screen.getByRole('link');
    expect(button).toHaveClass('px-6 py-3');
  });

  it('applies the large size class when specified', () => {
    render(
      <Button href="/test" size="large">
        Click me
      </Button>,
    );
    const button = screen.getByRole('link');
    expect(button).toHaveClass('md:px-10 md:py-4');
  });

  it('can be disabled when used as a button', () => {
    render(<Button as="button" disabled>Click me</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('applies custom className when provided', () => {
    render(<Button href="/test" className="custom-class">Click me</Button>);
    const button = screen.getByRole('link');
    expect(button).toHaveClass('custom-class');
  });
});
