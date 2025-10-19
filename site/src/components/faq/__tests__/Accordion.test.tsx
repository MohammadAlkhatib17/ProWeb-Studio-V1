import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Accordion, AccordionItem } from '../index';

describe('FAQ Accordion', () => {
  const mockFAQs = [
    {
      id: 'test-1',
      question: 'Hoe werkt dit?',
      answer: 'Dit is een test antwoord.',
      keywords: ['test', 'demo'],
    },
    {
      id: 'test-2',
      question: 'Wat kost het?',
      answer: 'De prijs varieert.',
      keywords: ['prijs', 'kosten'],
    },
  ];

  it('renders all FAQ items', () => {
    render(
      <Accordion type="single">
        {mockFAQs.map((faq) => (
          <AccordionItem key={faq.id} {...faq} />
        ))}
      </Accordion>
    );

    expect(screen.getByText('Hoe werkt dit?')).toBeInTheDocument();
    expect(screen.getByText('Wat kost het?')).toBeInTheDocument();
  });

  it('toggles item open/closed on click', () => {
    render(
      <Accordion type="single">
        {mockFAQs.map((faq) => (
          <AccordionItem key={faq.id} {...faq} />
        ))}
      </Accordion>
    );

    const firstButton = screen.getByRole('button', { name: /Hoe werkt dit/i });
    
    // Initially closed
    expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    
    // Click to open
    fireEvent.click(firstButton);
    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    
    // Answer should be visible
    expect(screen.getByText('Dit is een test antwoord.')).toBeInTheDocument();
    
    // Click to close
    fireEvent.click(firstButton);
    expect(firstButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes other items when opening a new one in single mode', () => {
    render(
      <Accordion type="single">
        {mockFAQs.map((faq) => (
          <AccordionItem key={faq.id} {...faq} />
        ))}
      </Accordion>
    );

    const firstButton = screen.getByRole('button', { name: /Hoe werkt dit/i });
    const secondButton = screen.getByRole('button', { name: /Wat kost het/i });
    
    // Open first item
    fireEvent.click(firstButton);
    expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    
    // Open second item - first should close
    fireEvent.click(secondButton);
    expect(secondButton).toHaveAttribute('aria-expanded', 'true');
    expect(firstButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('has proper ARIA attributes', () => {
    render(
      <Accordion type="single">
        <AccordionItem {...mockFAQs[0]} />
      </Accordion>
    );

    const button = screen.getByRole('button');
    const panelId = button.getAttribute('aria-controls');
    
    expect(button).toHaveAttribute('aria-expanded');
    expect(panelId).toBeTruthy();
    
    const panel = document.getElementById(panelId!);
    expect(panel).toHaveAttribute('role', 'region');
    expect(panel).toHaveAttribute('aria-labelledby', button.id);
  });

  it('supports keyboard navigation', () => {
    render(
      <Accordion type="single">
        {mockFAQs.map((faq) => (
          <AccordionItem key={faq.id} {...faq} />
        ))}
      </Accordion>
    );

    const buttons = screen.getAllByRole('button');
    
    // Focus first button
    buttons[0].focus();
    expect(document.activeElement).toBe(buttons[0]);
    
    // Arrow down should focus next button
    fireEvent.keyDown(buttons[0], { key: 'ArrowDown' });
    expect(document.activeElement).toBe(buttons[1]);
    
    // Arrow up should focus previous button
    fireEvent.keyDown(buttons[1], { key: 'ArrowUp' });
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('displays keywords when provided', () => {
    render(
      <Accordion type="single" defaultOpenId="test-1">
        <AccordionItem {...mockFAQs[0]} />
      </Accordion>
    );

    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('demo')).toBeInTheDocument();
  });

  it('meets minimum tap target size requirements', () => {
    render(
      <Accordion type="single">
        <AccordionItem {...mockFAQs[0]} />
      </Accordion>
    );

    const button = screen.getByRole('button');
    
    // Should have min-h-[48px] class or equivalent
    expect(button.className).toContain('min-h-[48px]');
  });
});
