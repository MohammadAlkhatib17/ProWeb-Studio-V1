'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  keywords?: string[];
}

interface MobileFAQItemProps {
  faq: FAQItem;
  index: number;
  isOpen?: boolean;
  onToggle?: (index: number) => void;
}

export default function MobileFAQItem({ 
  faq, 
  index, 
  isOpen = false, 
  onToggle 
}: MobileFAQItemProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Use external state if provided, otherwise use internal state
  const actualIsOpen = onToggle ? isOpen : internalIsOpen;
  
  // Handle toggle
  const handleToggle = () => {
    if (onToggle) {
      onToggle(index);
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  // Measure content height for smooth animation
  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(height);
    }
  }, [faq.answer, faq.keywords]);

  // Generate unique IDs for accessibility
  const questionId = `faq-question-${index}`;
  const answerId = `faq-answer-${index}`;

  return (
    <div className="faq-card group">
      <button
        type="button"
        className="faq-card-header"
        onClick={handleToggle}
        aria-expanded={actualIsOpen}
        aria-controls={answerId}
        id={questionId}
      >
        <h3 className="faq-card-question">
          {faq.question}
        </h3>
        
        <div className="faq-card-icon-container">
          <ChevronDown 
            className={`faq-card-icon ${actualIsOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </div>
      </button>

      <div
        className="faq-card-content-wrapper"
        style={{ 
          height: actualIsOpen ? `${contentHeight}px` : '0px'
        }}
      >
        <div
          ref={contentRef}
          className="faq-card-content"
          id={answerId}
          role="region"
          aria-labelledby={questionId}
        >
          <p className="faq-card-answer">
            {faq.answer}
          </p>
          
          {faq.keywords && faq.keywords.length > 0 && actualIsOpen && (
            <div className="faq-card-keywords">
              {faq.keywords.map((keyword, keywordIndex) => (
                <span 
                  key={keywordIndex}
                  className="faq-card-keyword"
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