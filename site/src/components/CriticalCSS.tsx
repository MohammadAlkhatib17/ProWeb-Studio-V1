/**
 * Critical CSS extraction utilities for perfect Core Web Vitals
 * Implements above-the-fold CSS inlining and non-critical CSS deferring
 */

// Critical CSS extraction utilities for perfect Core Web Vitals

/**
 * Critical CSS for above-the-fold content
 * This should contain only the minimal styles needed for LCP elements
 */
export const CRITICAL_CSS = `
  /* Reset and base styles for immediate render */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* Prevent layout shift with font loading */
  html {
    font-family: system-ui, -apple-system, sans-serif;
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  body {
    margin: 0;
    font-family: inherit;
    line-height: inherit;
    color: #ffffff;
    background-color: transparent;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Header critical styles */
  header {
    position: sticky;
    top: 0;
    z-index: 50;
    backdrop-filter: blur(8px);
    background-color: rgba(0, 0, 0, 0.8);
  }

  /* Navigation critical styles */
  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Logo critical styles */
  .logo {
    font-size: 1.5rem;
    font-weight: 700;
    color: #6366f1;
    text-decoration: none;
  }

  /* Hero section critical styles for LCP */
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow: hidden;
  }

  .hero-content {
    position: relative;
    z-index: 10;
    max-width: 800px;
    padding: 0 2rem;
  }

  .hero h1 {
    font-size: clamp(2rem, 5vw, 4rem);
    font-weight: 700;
    line-height: 1.1;
    margin: 0 0 1rem 0;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero p {
    font-size: clamp(1rem, 2vw, 1.25rem);
    color: #e5e7eb;
    margin: 0 0 2rem 0;
    line-height: 1.6;
  }

  /* CTA Button critical styles */
  .cta-button {
    display: inline-block;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    text-decoration: none;
    border-radius: 0.5rem;
    font-weight: 600;
    transition: transform 0.2s ease;
  }

  .cta-button:hover {
    transform: translateY(-2px);
  }

  /* Background critical styles */
  .background-layer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -10;
    background: radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
  }

  /* Prevent layout shift */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Loading states to prevent CLS */
  .loading {
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .loaded {
    opacity: 1;
  }

  /* Skip to content for accessibility */
  .skip-to-content {
    position: absolute;
    top: -40px;
    left: 6px;
    background: #6366f1;
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 1000;
  }

  .skip-to-content:focus {
    top: 6px;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    nav {
      padding: 1rem;
    }
    
    .hero-content {
      padding: 0 1rem;
    }
  }
`;

/**
 * Generate critical CSS with dynamic content based on route
 */
export function getCriticalCSS(route: string = '/') {
  let routeSpecificCSS = '';

  switch (route) {
    case '/':
      routeSpecificCSS = `
        /* Homepage specific critical CSS */
        .three-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
      `;
      break;
    case '/diensten':
      routeSpecificCSS = `
        /* Services page critical CSS */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin: 2rem 0;
        }
      `;
      break;
    case '/contact':
      routeSpecificCSS = `
        /* Contact page critical CSS */
        .contact-form {
          max-width: 600px;
          margin: 0 auto;
        }
      `;
      break;
  }

  return CRITICAL_CSS + routeSpecificCSS;
}

/**
 * Critical CSS component to inline above-the-fold styles
 */
export function CriticalCSS({ route = '/' }: { route?: string }) {
  const criticalStyles = getCriticalCSS(route);

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: criticalStyles,
      }}
      data-critical-css
    />
  );
}

/**
 * Non-critical CSS loader component
 * Defers loading of non-critical styles to improve LCP
 */
export function DeferredCSS({ hrefs }: { hrefs: string[] }) {
  return (
    <>
      {hrefs.map((href, index) => (
        <link
          key={`deferred-css-${index}`}
          rel="preload"
          href={href}
          as="style"
          onLoad={(e) => {
            const target = e.target as HTMLLinkElement;
            target.onload = null;
            target.rel = 'stylesheet';
          }}
        />
      ))}
      {/* Fallback for browsers that don't support preload */}
      <noscript>
        {hrefs.map((href, index) => (
          <link key={`fallback-css-${index}`} rel="stylesheet" href={href} />
        ))}
      </noscript>
    </>
  );
}

/**
 * Font display optimization for web fonts
 */
export function OptimizedFontCSS() {
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          /* Font display optimization */
          @font-face {
            font-family: 'Inter';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2') format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }
          
          @font-face {
            font-family: 'Inter';
            font-style: normal;
            font-weight: 600;
            font-display: swap;
            src: url('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2') format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }
          
          @font-face {
            font-family: 'Inter';
            font-style: normal;
            font-weight: 700;
            font-display: swap;
            src: url('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiA.woff2') format('woff2');
            unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }
        `,
      }}
    />
  );
}

/**
 * CSS loading strategy for progressive enhancement
 */
export function ProgressiveCSS() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          // Progressive CSS loading
          (function() {
            // Load non-critical CSS after page load
            if (window.addEventListener) {
              window.addEventListener('load', function() {
                // Load Tailwind and other non-critical styles
                var nonCriticalCSS = [
                  '/_next/static/css/app/layout.css',
                  '/_next/static/css/app/globals.css'
                ];
                
                nonCriticalCSS.forEach(function(href) {
                  var link = document.createElement('link');
                  link.rel = 'stylesheet';
                  link.href = href;
                  link.media = 'print';
                  link.onload = function() { this.media = 'all'; };
                  document.head.appendChild(link);
                });
              });
            }
          })();
        `,
      }}
    />
  );
}

export default CriticalCSS;