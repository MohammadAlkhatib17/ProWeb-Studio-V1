'use client'

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQItemClient = ({ faq }: { faq: FAQItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <details 
      className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-cyan-400/30 transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-cyan-400/10 border-l-4 border-l-cyan-500/20 hover:border-l-cyan-400"
      onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="flex items-start justify-between p-4 md:p-6 cursor-pointer list-none">
        <h3 className="text-base md:text-lg font-semibold text-white pr-4 group-hover:text-cyan-300 transition-colors duration-300">
          {faq.question}
        </h3>
        <div className={`flex-shrink-0 w-8 h-8 mt-1 rounded-full bg-cyan-400/10 flex items-center justify-center transition-all duration-300 ease-in-out group-hover:bg-cyan-400/20 border border-cyan-400/20 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-4 h-4 text-cyan-300 transition-all duration-300 ease-in-out" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </summary>
      
      <div className="px-4 md:px-6 pb-4 md:pb-6">
        <p className="text-base text-slate-200 leading-relaxed">
          {faq.answer}
        </p>
      </div>
    </details>
  );
};