'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';

/**
 * Accordion context for managing single-open behavior
 */
interface AccordionContextValue {
  /** Currently open item ID */
  openItemId: string | null;
  /** Function to toggle an item */
  toggleItem: (id: string) => void;
  /** Whether only one item can be open at a time (mobile behavior) */
  isSingleOpen: boolean;
}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);

export const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('useAccordion must be used within an Accordion');
  }
  return context;
};

/**
 * Accordion component props
 */
export interface AccordionProps {
  /** Child FAQ items */
  children: React.ReactNode;
  /** Type: 'single' for one open at a time, 'multiple' for multiple */
  type?: 'single' | 'multiple';
  /** Default open item ID */
  defaultOpenId?: string | null;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Accessible FAQ Accordion component
 * 
 * Features:
 * - Single-open mode on mobile (only one item expanded at a time)
 * - Full keyboard navigation (Tab, Enter/Space, Arrow keys)
 * - URL hash sync for deep linking (#faq=slug)
 * - ARIA attributes for screen readers
 * - Smooth transitions with prefers-reduced-motion support
 * - Zero CLS (measured height transitions)
 * 
 * @example
 * ```tsx
 * <Accordion type="single" defaultOpenId="business-1">
 *   <AccordionItem id="business-1" question="..." answer="..." />
 *   <AccordionItem id="business-2" question="..." answer="..." />
 * </Accordion>
 * ```
 */
export function Accordion({
  children,
  type = 'single',
  defaultOpenId = null,
  className = '',
}: AccordionProps) {
  const [openItemId, setOpenItemId] = useState<string | null>(defaultOpenId);

  // Sync with URL hash on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const hash = window.location.hash;
    const faqMatch = hash.match(/#faq=([^&]+)/);
    
    if (faqMatch) {
      const itemId = decodeURIComponent(faqMatch[1]);
      setOpenItemId(itemId);
      
      // Scroll to the item after a short delay
      setTimeout(() => {
        const element = document.getElementById(itemId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  const toggleItem = (id: string) => {
    setOpenItemId(prev => {
      const newId = prev === id ? null : id;
      
      // Update URL hash
      if (typeof window !== 'undefined') {
        const newHash = newId ? `#faq=${encodeURIComponent(newId)}` : '#';
        window.history.replaceState(null, '', newHash);
      }
      
      return type === 'single' ? newId : prev;
    });
  };

  const value: AccordionContextValue = {
    openItemId,
    toggleItem,
    isSingleOpen: type === 'single',
  };

  return (
    <AccordionContext.Provider value={value}>
      <div
        className={`w-full divide-y divide-white/10 ${className}`}
        role="region"
        aria-label="Veelgestelde vragen"
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}
