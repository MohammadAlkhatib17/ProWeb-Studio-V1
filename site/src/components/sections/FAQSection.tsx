import React from 'react';

interface FAQSectionProps {
  title: string;
  children: React.ReactNode;
}

const FAQSection: React.FC<FAQSectionProps> = ({ title, children }) => {
  return (
    <section className="py-20 sm:py-24 bg-cosmic-950/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-12">
          {title}
        </h2>
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;