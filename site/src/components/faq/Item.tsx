'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useAccordion } from './Accordion';

/**
 * FAQ Item component props
 */
export interface AccordionItemProps {
  /** Unique identifier for the item */
  id: string;
  /** Question text */
  question: string;
  /** Answer text */
  answer: string;
  /** Optional keywords for SEO context */
  keywords?: string[];
}

/**
 * Individual FAQ accordion item with full accessibility
 * 
 * Features:
 * - 48px minimum tap target height
 * - Keyboard navigation (Enter/Space to toggle, Arrow keys to navigate)
 * - ARIA attributes (aria-expanded, aria-controls, role="region")
 * - Smooth height transitions without CLS
 * - Respects prefers-reduced-motion
 * - Dutch ARIA labels
 * - Visible focus rings
 * 
 * @example
 * ```tsx
 * <AccordionItem
 *   id="business-growth-1"
 *   question="Hoe zorgt een professionele website voor meer omzet?"
 *   answer="Een professionele website verhoogt uw omzet..."
 *   keywords={["omzet", "ROI", "groei"]}
 * />
 * ```
 */
export function AccordionItem({
  id,
  question,
  answer,
  keywords = [],
}: AccordionItemProps) {
  const { openItemId, toggleItem } = useAccordion();
  const isOpen = openItemId === id;
  
  const panelRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | 'auto'>(0);
  
  // Measure and update height when content changes or expands
  useEffect(() => {
    if (!panelRef.current) return undefined;
    
    if (isOpen) {
      const contentHeight = panelRef.current.scrollHeight;
      setHeight(contentHeight);
      
      // Set to auto after transition for dynamic content
      const timer = setTimeout(() => {
        setHeight('auto');
      }, 150);
      
      return () => clearTimeout(timer);
    } else {
      // Measure before closing for smooth transition
      setHeight(panelRef.current.scrollHeight);
      requestAnimationFrame(() => {
        setHeight(0);
      });
      return undefined;
    }
  }, [isOpen]);
  
  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const allButtons = Array.from(
      document.querySelectorAll('[data-faq-trigger]')
    ) as HTMLButtonElement[];
    const currentIndex = allButtons.indexOf(e.currentTarget);
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (currentIndex < allButtons.length - 1) {
          allButtons[currentIndex + 1].focus();
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (currentIndex > 0) {
          allButtons[currentIndex - 1].focus();
        }
        break;
      case 'Home':
        e.preventDefault();
        allButtons[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        allButtons[allButtons.length - 1]?.focus();
        break;
    }
  };
  
  const panelId = `faq-panel-${id}`;
  const triggerId = `faq-trigger-${id}`;
  
  return (
    <div id={id} className="w-full">
      {/* Trigger button */}
      <h4>
        <button
          id={triggerId}
          type="button"
          data-faq-trigger
          onClick={() => toggleItem(id)}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-label={isOpen ? 'Verberg antwoord' : 'Toon antwoord'}
          className="w-full flex items-center justify-between py-4 min-h-[48px] text-left group hover:bg-white/[0.03] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cosmic-950 rounded-none"
        >
          {/* Question text */}
          <span className="text-base md:text-lg leading-6 font-medium text-white pr-4 group-hover:text-cyan-300 transition-colors duration-200">
            {question}
          </span>
          
          {/* Icon button area */}
          <span
            className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-cyan-400/10 group-hover:bg-cyan-400/20 transition-all duration-150"
            aria-hidden="true"
          >
            {isOpen ? (
              <Minus className="w-5 h-5 text-cyan-300" />
            ) : (
              <Plus className="w-5 h-5 text-cyan-300" />
            )}
          </span>
        </button>
      </h4>
      
      {/* Answer panel with measured height transition */}
      <div
        ref={panelRef}
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        className="overflow-hidden transition-[height,opacity] duration-150 ease-out motion-reduce:transition-none"
        style={{
          height: height === 'auto' ? 'auto' : `${height}px`,
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="pt-2 pb-4">
          <p className="text-sm md:text-base leading-7 text-slate-200 opacity-90 max-w-prose">
            {answer}
          </p>
          
          {/* Keywords for SEO context */}
          {keywords.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2" aria-label="Gerelateerde onderwerpen">
              {keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-cyan-400/10 text-cyan-300 rounded-full border border-cyan-400/20"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
