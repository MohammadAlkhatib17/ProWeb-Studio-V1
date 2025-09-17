import { lazy, Suspense } from 'react';
import HeroSection from '../components/home/HeroSection';
import ProcessSection from '../components/home/ProcessSection';
import CTASection from '../components/home/CTASection';
import FAQSection from '../components/home/FAQSection';

// Lazy load heavy components
const ServicesSection = lazy(() => import('../components/home/ServicesSection'));
const PortfolioSection = lazy(() => import('../components/home/PortfolioSection'));
const TestimonialsSection = lazy(() => import('../components/home/TestimonialsSection'));

const SectionLoader = () => (
  <div className="py-20 flex justify-center">
    <div className="animate-pulse w-full max-w-7xl mx-auto px-4">
      <div className="h-64 bg-gray-800 rounded-lg"></div>
    </div>
  </div>
);

export default function Home() {
  return (
    <main>
      <HeroSection />
      <Suspense fallback={<SectionLoader />}>
        <ServicesSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <PortfolioSection />
      </Suspense>
      <ProcessSection />
      <CTASection />
      <Suspense fallback={<SectionLoader />}>
        <TestimonialsSection />
      </Suspense>
      <FAQSection />
    </main>
  );
}