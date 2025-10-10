import { ReactNode } from 'react';

// Unified interfaces for service page components
export interface ServiceFeature {
  title: string;
  description: string;
  icon: string;
  details: string[];
}

export interface ServicePackage {
  name: string;
  description: string;
  features: string[];
  price: string;
  popular?: boolean;
  buttonText?: string;
}

export interface ServiceType {
  type: string;
  description: string;
  features: string[];
  startingPrice: string;
  badge?: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface StatisticItem {
  value: string;
  label: string;
  description: string;
}

export interface TrustIndicator {
  icon: string;
  title: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// Unified service page props
export interface ServicePageProps {
  // Hero Section
  title: string;
  subtitle: string;
  heroDescription: string;
  primaryCTA: string;
  secondaryCTA: string;
  
  // Features Section
  featuresTitle: string;
  featuresSubtitle: string;
  features: ServiceFeature[];
  
  // Service Types/Packages (optional)
  packagesTitle?: string;
  packagesSubtitle?: string;
  packages?: ServicePackage[];
  serviceTypes?: ServiceType[];
  
  // Process Section
  processTitle: string;
  processSubtitle: string;
  processSteps: ProcessStep[];
  
  // Statistics/Results Section (optional)
  statisticsTitle?: string;
  statistics?: StatisticItem[];
  
  // Trust Indicators Section
  trustTitle: string;
  trustIndicators: TrustIndicator[];
  
  // FAQ Section
  faqTitle: string;
  faqs: FAQItem[];
  
  // Final CTA Section
  finalCTATitle: string;
  finalCTADescription: string;
  finalPrimaryCTA: string;
  finalSecondaryCTA: string;
  
  // SEO & Meta
  pageSlug: string;
  ogImage?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
}

// Unified component for feature cards
export const FeatureCard = ({ feature }: { feature: ServiceFeature }) => (
  <div className="bg-cosmic-800/30 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-8 hover:border-primary-500/50 transition-all duration-300 group">
    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
    <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
    <p className="text-slate-200 mb-6">{feature.description}</p>
    <ul className="space-y-2">
      {feature.details.map((detail, detailIndex) => (
        <li key={detailIndex} className="text-sm text-slate-400 flex items-center">
          <span className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-3 flex-shrink-0"></span>
          {detail}
        </li>
      ))}
    </ul>
  </div>
);

// Unified component for package cards
export const PackageCard = ({ pkg }: { pkg: ServicePackage }) => (
  <div className={`relative bg-cosmic-800/40 backdrop-blur-sm border rounded-xl p-8 transition-all duration-300 hover:scale-105 ${
    pkg.popular 
      ? 'border-primary-500/50 ring-2 ring-primary-500/20 shadow-lg shadow-primary-500/10' 
      : 'border-cosmic-700/30 hover:border-primary-500/50'
  }`}>
    {pkg.popular && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <span className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
          Meest Populair
        </span>
      </div>
    )}
    
    <div className="text-center mb-8">
      <h3 className="text-xl font-semibold text-white mb-2">{pkg.name}</h3>
      <p className="text-slate-200 text-sm mb-4">{pkg.description}</p>
      <div className="text-3xl font-bold text-white mb-2">{pkg.price}</div>
    </div>

    <ul className="space-y-3 mb-8">
      {pkg.features.map((feature, featureIndex) => (
        <li key={featureIndex} className="text-slate-200 flex items-center">
          <span className="w-5 h-5 bg-primary-500/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
            <span className="w-2 h-2 bg-primary-400 rounded-full"></span>
          </span>
          {feature}
        </li>
      ))}
    </ul>

    <button className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
      pkg.popular 
        ? 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 text-white shadow-lg hover:shadow-xl' 
        : 'border border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white'
    }`}>
      {pkg.buttonText || 'Pakket Kiezen'}
    </button>
  </div>
);

// Unified component for process steps
export const ProcessStep = ({ step, isLast }: { step: ProcessStep; isLast: boolean }) => (
  <div className="flex items-start space-x-6">
    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center shadow-lg">
      <span className="text-white font-bold text-sm">{step.step}</span>
    </div>
    <div className="flex-1">
      <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
      <p className="text-slate-200">{step.description}</p>
      {!isLast && (
        <div className="w-px h-8 bg-gradient-to-b from-primary-500/50 to-transparent mt-6 ml-6"></div>
      )}
    </div>
  </div>
);

// Unified component for statistics
export const StatisticCard = ({ stat }: { stat: StatisticItem }) => (
  <div className="bg-cosmic-800/30 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-8 text-center hover:border-primary-500/50 transition-all duration-300">
    <div className="text-4xl font-bold text-primary-400 mb-2">{stat.value}</div>
    <div className="text-lg text-white mb-2">{stat.label}</div>
    <div className="text-sm text-slate-400">{stat.description}</div>
  </div>
);

// Unified component for trust indicators
export const TrustIndicator = ({ indicator }: { indicator: TrustIndicator }) => (
  <div className="text-center">
    <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-6 hover:bg-primary-500/30 transition-colors duration-300">
      <span className="text-2xl">{indicator.icon}</span>
    </div>
    <h3 className="text-xl font-semibold text-white mb-4">{indicator.title}</h3>
    <p className="text-slate-200">{indicator.description}</p>
  </div>
);

// Unified component for FAQ items
export const FAQItem = ({ faq }: { faq: FAQItem }) => (
  <div className="bg-cosmic-800/30 backdrop-blur-sm border border-cosmic-700/30 rounded-xl p-6 hover:border-primary-500/50 transition-all duration-300">
    <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
    <p className="text-slate-200">{faq.answer}</p>
  </div>
);

// Professional section component
export const ServiceSection = ({ 
  title, 
  subtitle, 
  children, 
  className = "",
  background = false 
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  background?: boolean;
}) => (
  <section className={`relative z-10 px-4 sm:px-6 lg:px-8 py-section ${background ? 'bg-cosmic-900/20' : ''} ${className}`}>
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          {title.split(' ').map((word, index, array) => {
            // Make the last 1-2 words gradient
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
        {subtitle && (
          <p className="text-lg text-slate-200 max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  </section>
);