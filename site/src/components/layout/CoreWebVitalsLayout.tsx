import { ReactNode } from 'react';
import { getOptimizedFontPreloads, getDutchOptimizedResourceHints, getCriticalCSS } from '@/lib/web-vitals-optimization';

interface CoreWebVitalsLayoutProps {
  children: ReactNode;
  enableAdvancedOptimizations?: boolean;
  dutchOptimized?: boolean;
}

/**
 * Enhanced layout component with Core Web Vitals optimizations
 * Implements advanced resource hints, font preloading, and critical CSS
 */
export function CoreWebVitalsLayout({ 
  children, 
  enableAdvancedOptimizations = true,
  dutchOptimized = true 
}: CoreWebVitalsLayoutProps) {
  const fontPreloads = getOptimizedFontPreloads();
  const resourceHints = getDutchOptimizedResourceHints();
  
  return (
    <>
      {/* Critical CSS for above-the-fold content */}
      {enableAdvancedOptimizations && (
        <style 
          dangerouslySetInnerHTML={{ 
            __html: getCriticalCSS() 
          }} 
        />
      )}
      
      {/* Resource hints for optimal loading */}
      {dutchOptimized && resourceHints.map((hint, index) => (
        <link 
          key={index}
          rel={hint.rel}
          href={hint.href}
          {...(hint.crossOrigin && { crossOrigin: hint.crossOrigin as 'anonymous' | 'use-credentials' })}
        />
      ))}
      
      {/* Font preloads for faster text rendering */}
      {enableAdvancedOptimizations && fontPreloads.map((font, index) => (
        <link
          key={index}
          rel={font.rel}
          href={font.href}
          as={font.as}
          type={font.type}
          crossOrigin={font.crossOrigin as 'anonymous' | 'use-credentials'}
          {...(font.fetchpriority && { fetchpriority: font.fetchpriority })}
        />
      ))}
      
      {/* Content with optimized layout */}
      <div className="min-h-screen font-loading">
        {children}
      </div>
    </>
  );
}

export default CoreWebVitalsLayout;