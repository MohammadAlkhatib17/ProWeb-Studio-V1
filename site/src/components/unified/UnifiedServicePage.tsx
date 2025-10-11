import { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Button } from '@/components/Button';
import SEOSchema from '@/components/SEOSchema';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQSection from '@/components/sections/FAQSection';
import {
  ServicePageProps,
  FeatureCard,
  PackageCard,
  ProcessStep,
  StatisticCard,
  TrustIndicator,
  FAQItem,
  ServiceSection
} from './ServicePageComponents';

export const dynamic = 'force-static';
export const revalidate = 7200; // 2 hours
export const fetchCache = 'force-cache';

interface UnifiedServicePageProps extends ServicePageProps {
  generatePageMetadata?: boolean;
}

export default function UnifiedServicePage({
  // Hero Section
  title,
  subtitle,
  heroDescription,
  primaryCTA,
  secondaryCTA,
  
  // Features Section
  featuresTitle,
  featuresSubtitle,
  features,
  
  // Service Types/Packages
  packagesTitle,
  packagesSubtitle,
  packages,
  serviceTypes,
  
  // Process Section
  processTitle,
  processSubtitle,
  processSteps,
  
  // Statistics Section
  statisticsTitle,
  statistics,
  
  // Trust Indicators
  trustTitle,
  trustIndicators,
  
  // FAQ Section
  faqTitle,
  faqs,
  
  // Final CTA
  finalCTATitle,
  finalCTADescription,
  finalPrimaryCTA,
  finalSecondaryCTA,
  
  // SEO (for future use)
  // pageSlug,
  // ogImage
}: UnifiedServicePageProps) {
  
  return (
    <main className="pt-20 md:pt-24 relative overflow-hidden">
      {/* SEO Schema */}
      <SEOSchema 
        pageType="services"
        pageTitle={title}
        pageDescription={heroDescription}
      />
      
      {/* Breadcrumbs */}
      <Breadcrumbs />
      
      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-section">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {title.split(' ').map((word, index, array) => {
              // Make the last 1-2 words gradient for visual impact
              const isGradient = index >= array.length - 2;
              return isGradient ? (
                <span key={index} className="gradient-text-primary">
                  {word}{index < array.length - 1 ? ' ' : ''}
                </span>
              ) : (
                <span key={index}>{word} </span>
              );
            })}
          </h1>
          {subtitle && (
            <p className="text-xl md:text-2xl text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
              {subtitle}
            </p>
          )}
          <p className="text-lg text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            {heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/contact"
              variant="primary"
              size="large"
              className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              {primaryCTA}
            </Button>
            <Button
              href="/portfolio"
              variant="secondary"
              size="large"
              className="border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white transform hover:-translate-y-0.5 transition-all duration-300"
            >
              {secondaryCTA}
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <ServiceSection 
        title={featuresTitle}
        subtitle={featuresSubtitle}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </ServiceSection>

      {/* Packages/Service Types Section */}
      {(packages || serviceTypes) && (
        <ServiceSection 
          title={packagesTitle || 'Service Opties'}
          subtitle={packagesSubtitle}
          background={true}
        >
          {packages && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <PackageCard key={index} pkg={pkg} />
              ))}
            </div>
          )}
          
          {serviceTypes && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {serviceTypes.map((type, index) => (
                <div
                  key={index}
                  className="bg-cosmic-800/40 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-8 hover:border-primary-500/50 transition-all duration-300"
                >
                  <div className="mb-6">
                    {type.badge && (
                      <span className="inline-block bg-primary-500/20 text-primary-400 text-xs font-medium px-3 py-1 rounded-full mb-3">
                        {type.badge}
                      </span>
                    )}
                    <h3 className="text-xl font-semibold text-white mb-2">{type.type}</h3>
                    <p className="text-slate-200 mb-4">{type.description}</p>
                    <div className="text-2xl font-bold text-primary-400 mb-4">{type.startingPrice}</div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {type.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-slate-200 flex items-center">
                        <span className="w-5 h-5 bg-primary-500/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <span className="w-2 h-2 bg-primary-400 rounded-full"></span>
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    href="/contact"
                    variant="secondary"
                    size="normal"
                    className="w-full border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white"
                  >
                    Meer Informatie
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ServiceSection>
      )}

      {/* Statistics Section */}
      {statistics && (
        <ServiceSection 
          title={statisticsTitle || 'Bewezen Resultaten'}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {statistics.map((stat, index) => (
              <StatisticCard key={index} stat={stat} />
            ))}
          </div>
        </ServiceSection>
      )}

      {/* Process Section */}
      <ServiceSection 
        title={processTitle}
        subtitle={processSubtitle}
      >
        <div className="max-w-4xl mx-auto space-y-8">
          {processSteps.map((step, index) => (
            <ProcessStep 
              key={index} 
              step={step} 
              isLast={index === processSteps.length - 1}
            />
          ))}
        </div>
      </ServiceSection>

      {/* Trust Indicators Section */}
      <ServiceSection 
        title={trustTitle}
        background={true}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustIndicators.map((indicator, index) => (
            <TrustIndicator key={index} indicator={indicator} />
          ))}
        </div>
      </ServiceSection>

      {/* FAQ Section */}
      <ErrorBoundary>
        <Suspense fallback={<div className="py-20 text-center text-white">Loading FAQ...</div>}>
          <FAQSection title={faqTitle}>
            <div className="space-y-3 md:space-y-4">
              {faqs.map((faq, index) => (
                <FAQItem key={index} faq={faq} index={index} />
              ))}
            </div>
          </FAQSection>
        </Suspense>
      </ErrorBoundary>

      {/* Final CTA Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {finalCTATitle.split(' ').map((word, index, array) => {
              const isGradient = index >= array.length - 2;
              return isGradient ? (
                <span key={index} className="gradient-text-primary">
                  {word}{index < array.length - 1 ? ' ' : ''}
                </span>
              ) : (
                <span key={index}>{word} </span>
              );
            })}
          </h2>
          <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
            {finalCTADescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/contact"
              variant="primary"
              size="large"
              className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
            >
              {finalPrimaryCTA}
            </Button>
            <Button
              href="tel:+31686412430"
              variant="secondary"
              size="large"
              className="border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white transform hover:-translate-y-0.5 transition-all duration-300"
            >
              {finalSecondaryCTA}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}