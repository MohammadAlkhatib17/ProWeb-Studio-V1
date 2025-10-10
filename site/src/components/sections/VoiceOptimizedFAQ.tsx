import React, { useState } from 'react';
import { SemanticSection, SemanticHeading } from '../layout/SemanticLayout';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { VOICE_SEARCH_FAQS } from '@/config/dutch-seo.config';
import { Button } from '@/components/Button';

interface VoiceOptimizedFAQProps {
  cityName?: string;
  serviceName?: string;
  showAll?: boolean;
  className?: string;
}

export default function VoiceOptimizedFAQ({ 
  cityName, 
  serviceName, 
  showAll = false,
  className = '' 
}: VoiceOptimizedFAQProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  
  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  // Filter FAQs based on service if provided
  const filteredFAQs = serviceName 
    ? VOICE_SEARCH_FAQS.filter(faq => 
        faq.keywords.some(keyword => 
          keyword.toLowerCase().includes(serviceName.toLowerCase().replace('-', ' '))
        )
      )
    : VOICE_SEARCH_FAQS;

  const displayFAQs = showAll ? filteredFAQs : filteredFAQs.slice(0, 6);

  // Generate structured data for voice search optimization
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `#faq-${serviceName || 'general'}`,
    inLanguage: 'nl-NL',
    mainEntity: displayFAQs.map((faq, index) => ({
      '@type': 'Question',
      '@id': `#faq-question-${index}`,
      name: cityName 
        ? faq.question.replace('Nederland', cityName)
        : faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: cityName 
          ? faq.answer.replace(/Nederland(?!\s)/g, cityName)
          : faq.answer
      }
    }))
  };

  return (
    <SemanticSection 
      as="section" 
      className={`py-20 bg-gradient-to-b from-cosmic-900 to-cosmic-800 ${className}`}
      aria-label="Veelgestelde vragen over website laten maken"
    >
      {/* Structured data for voice search */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <SemanticHeading 
            level={2} 
            className="text-3xl sm:text-4xl font-bold mb-6"
            keywords={['veelgestelde vragen', 'website laten maken', 'FAQ']}
          >
            Veelgestelde Vragen Over{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-magenta-400">
              Website Laten Maken{cityName ? ` in ${cityName}` : ' in Nederland'}
            </span>
          </SemanticHeading>
          <p className="text-xl text-slate-300">
            Alle antwoorden op uw vragen over <strong>professionele webdesign</strong> en 
            <strong>website ontwikkeling</strong> in Nederland
          </p>
        </header>

        <div className="space-y-4">
          {displayFAQs.map((faq, index) => {
            const isOpen = openItems.has(index);
            const localizedQuestion = cityName 
              ? faq.question.replace('Nederland', cityName)
              : faq.question;
            const localizedAnswer = cityName 
              ? faq.answer.replace(/Nederland(?!\s)/g, cityName)
              : faq.answer;

            return (
              <article 
                key={index}
                className="bg-cosmic-800/40 rounded-2xl border border-cosmic-700/60 hover:border-cosmic-600/80 transition-all duration-300 overflow-hidden"
                itemScope
                itemType="https://schema.org/Question"
              >
                <button
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-cosmic-800/60 transition-colors duration-200"
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 
                    className="text-lg sm:text-xl font-semibold text-cyan-300 pr-4 flex-1"
                    itemProp="name"
                  >
                    {localizedQuestion}
                  </h3>
                  <div className="flex-shrink-0 text-cyan-300">
                    {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                </button>
                
                {isOpen && (
                  <div 
                    id={`faq-answer-${index}`}
                    className="px-6 pb-6"
                    itemScope
                    itemType="https://schema.org/Answer"
                  >
                    <div 
                      className="text-slate-300 leading-relaxed prose prose-invert max-w-none"
                      itemProp="text"
                      dangerouslySetInnerHTML={{ 
                        __html: localizedAnswer.replace(
                          /\*\*(.*?)\*\*/g, 
                          '<strong class="text-cyan-300">$1</strong>'
                        )
                      }}
                    />
                    
                    {/* Keywords for SEO context */}
                    <div className="mt-4 text-xs text-slate-500">
                      <span className="sr-only">Gerelateerde zoektermen: </span>
                      {faq.keywords.join(', ')}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {!showAll && filteredFAQs.length > 6 && (
          <div className="text-center mt-12">
            <p className="text-slate-300 mb-4">
              Heeft u nog meer vragen over <strong>website laten maken</strong> of 
              <strong>webdesign</strong>? Neem gerust contact met ons op!
            </p>
            <Button 
              href="/contact"
              variant="primary"
              size="large"
            >
              Stel Uw Vraag - Gratis Advies
            </Button>
          </div>
        )}
      </div>
    </SemanticSection>
  );
}

// Component for embedding voice search optimized content
export function VoiceSearchOptimizedContent({ 
  children, 
  keywords = [],
  cityName,
  className = ''
}: {
  children: React.ReactNode;
  keywords?: string[];
  cityName?: string;
  className?: string;
}) {
  const localizedKeywords = cityName 
    ? keywords.map(k => k.includes('Nederland') ? k.replace('Nederland', cityName) : `${k} ${cityName}`)
    : keywords;

  return (
    <div 
      className={`voice-search-optimized ${className}`}
      data-keywords={localizedKeywords.join(',')}
      data-voice-search="true"
      data-location={cityName}
    >
      {children}
      
      {/* Hidden content for voice search queries */}
      <div className="sr-only" aria-hidden="true">
        <p>
          {localizedKeywords.join(', ')} - ProWeb Studio is uw specialist voor 
          {cityName ? ` webdesign in ${cityName}` : ' webdesign in Nederland'}.
        </p>
      </div>
    </div>
  );
}