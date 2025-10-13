"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/Button";

interface FAQItem {
  question: string;
  answer: string;
}

interface ServiceFAQItemProps {
  faq: FAQItem;
  index?: number;
}

export default function ServiceFAQItem({
  faq,
  index = 0,
}: ServiceFAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // Measure content height for smooth animation
  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(height);
    }
  }, [faq.answer]);

  // Generate unique IDs for accessibility
  const questionId = `service-faq-question-${index}`;
  const answerId = `service-faq-answer-${index}`;

  return (
    <div className="faq-card">
      <Button
        as="button"
        variant="secondary"
        size="normal"
        type="button"
        className="faq-card-header !border-transparent !bg-transparent hover:!bg-white/5 !text-inherit !p-0 w-full justify-start"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls={answerId}
      >
        <h3 className="faq-card-question">{faq.question}</h3>

        <div className="faq-card-icon-container">
          <svg
            className={`faq-card-icon ${isOpen ? "rotate-180" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </Button>

      <div
        className="faq-card-content-wrapper"
        style={{
          height: isOpen ? `${contentHeight}px` : "0px",
        }}
      >
        <div
          ref={contentRef}
          className="faq-card-content"
          id={answerId}
          role="region"
          aria-labelledby={questionId}
        >
          <p className="faq-card-answer">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
}
