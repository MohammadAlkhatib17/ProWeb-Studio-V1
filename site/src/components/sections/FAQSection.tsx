import React from "react";

interface FAQSectionProps {
  title: string;
  children: React.ReactNode;
}

const FAQSection: React.FC<FAQSectionProps> = ({ title, children }) => {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-cosmic-950/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-white mb-8 md:mb-12">
          {title}
        </h2>
        <div className="w-full">{children}</div>
      </div>
    </section>
  );
};

export default FAQSection;
