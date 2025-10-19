import React from 'react';

interface FAQSectionProps {
  title: string;
  children: React.ReactNode;
}

/**
 * FAQ Section wrapper component
 * 
 * Provides full-bleed layout on mobile with safe padding,
 * and centered max-width on desktop.
 */
const FAQSection: React.FC<FAQSectionProps> = ({ title, children }) => {
  return (
    <section className="py-20 sm:py-24 bg-cosmic-950/50">
      <div className="w-full">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12 px-4 sm:px-6">
          {title}
        </h2>
        {/* Children render with their own width constraints */}
        {children}
      </div>
    </section>
  );
};

export default FAQSection;