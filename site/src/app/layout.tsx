import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';
import { headers } from 'next/headers';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { siteConfig } from '@/config/site.config';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CursorTrail from '@/components/CursorTrail';
import SEOSchema from '@/components/SEOSchema';
import { initProductionEnvValidation } from '@/lib/env.server';
import BackgroundLayer from '@/components/layout/BackgroundLayer';
import HeroBackground from '@/components/HeroBackground';
import TopVignetteOverlay from '@/components/layout/TopVignetteOverlay';
import PWAServiceWorker from '@/components/PWAServiceWorker';
import DutchPerformanceMonitor from '@/components/DutchPerformanceMonitor';
import { primaryFont } from '@/lib/fonts';
import { generateResourcePreconnects } from '@/lib/preconnect';
import ResourceHints from '@/components/ResourceHints';
import CriticalCSS from '@/components/CriticalCSS';
import { WebVitalsReporter, WebVitalsDisplay } from '@/components/WebVitalsDisplay';
// Enhanced metadata utilities available but not used in root layout

// Initialize environment validation for production deployments
initProductionEnvValidation();

// Get canonical URL from environment with fallback
const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

// Enhanced metadata with all SEO optimizations
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: 'Wij ontwerpen en bouwen snelle, veilige en schaalbare 3D‑websites die scoren in Google en converteren. Nederlandse kwaliteit, transparante prijzen. Vraag direct offerte aan!',
  keywords: [
    'website laten maken nederland',
    'website bouwen',
    'webdesign nederland',
    'webshop laten maken',
    'professionele website laten maken',
    'responsive webdesign',
    'bedrijfswebsite laten maken',
    'website ontwikkeling',
    'seo geoptimaliseerde website',
    'mkb-vriendelijk',
    'ondernemers',
    'nederlands webdesign bureau',
    'betrouwbare webdesign partner',
    'transparante communicatie',
    'no-nonsense aanpak',
    'iDEAL integratie',
    'nederlandse kwaliteit',
    'website laten maken amsterdam',
    'webdesign rotterdam',
    'website ontwikkeling den haag',
    'professionele website utrecht',
    'toekomstbestendig',
    'digital agency nederland',
    '3d website ervaringen',
    'interactieve webdesign',
    'modern webdesign',
    'webgl ontwikkeling'
  ],
  authors: [
    { name: 'ProWeb Studio', url: siteConfig.url },
    { name: 'ProWeb Studio Team' },
  ],
  creator: 'ProWeb Studio',
  publisher: 'ProWeb Studio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon-180.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  // Enhanced Open Graph for Dutch social media
  openGraph: {
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: 'Wij ontwerpen en bouwen snelle, veilige en schaalbare 3D‑websites die scoren in Google en converteren. Nederlandse kwaliteit, transparante prijzen. Vraag direct offerte aan!',
    url: SITE_URL,
    siteName: siteConfig.name,
    images: [
      {
        url: `${SITE_URL}/og`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Professionele 3D Websites & Webdesign Nederland`,
        type: 'image/png',
      },
    ],
    locale: 'nl_NL',
    alternateLocale: ['en_US', 'de_DE', 'fr_FR'],
    type: 'website',
    countryName: 'Netherlands',
    emails: [siteConfig.email],
    phoneNumbers: [siteConfig.phone],
  },
  // Enhanced Twitter Cards for Dutch content
  twitter: {
    card: 'summary_large_image',
    site: '@prowebstudio_nl',
    creator: '@prowebstudio_nl',
    title: `${siteConfig.name} - Professionele 3D Websites Nederland`,
    description: 'Snelle, veilige en schaalbare 3D‑websites die scoren in Google. Nederlandse kwaliteit, transparante prijzen. Vraag direct offerte aan!',
    images: [
      {
        url: `${SITE_URL}/og`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Professionele 3D Websites & Webdesign Nederland`,
      },
    ],
  },
  // Enhanced robots configuration
  robots: process.env.VERCEL_ENV === 'preview'
    ? {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
          'max-video-preview': 0,
          'max-image-preview': 'none' as const,
          'max-snippet': 0,
        },
      }
    : {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
          index: true,
          follow: true,
          noimageindex: false,
          'max-video-preview': -1,
          'max-image-preview': 'large' as const,
          'max-snippet': -1,
        },
      },
  // Canonical URL management
  alternates: {
    canonical: SITE_URL,
    languages: {
      'nl-NL': SITE_URL,
      'nl': SITE_URL,
      'x-default': SITE_URL,
    },
  },
  category: 'technology',
  classification: 'Business',
  referrer: 'strict-origin-when-cross-origin',
  applicationName: siteConfig.name,
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: 'black-translucent',
    startupImage: ['/icons/apple-touch-icon-180.png'],
  },
  // Enhanced other metadata with content freshness and rich snippets
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': siteConfig.name,
    'application-name': siteConfig.name,
    'msapplication-TileColor': '#6366f1',
    'msapplication-TileImage': '/icons/icon-192.png',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#6366f1',
    'color-scheme': 'dark light',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    HandheldFriendly: 'True',
    MobileOptimized: '320',
    'revisit-after': '3 days',
    audience: 'all',
    copyright: `© ${new Date().getFullYear()} ${siteConfig.name}`,
    designer: siteConfig.name,
    owner: siteConfig.name,
    url: SITE_URL,
    'identifier-URL': SITE_URL,
    pagename: siteConfig.name,
    category: 'internet',
    // Dublin Core metadata
    'dc.title': `${siteConfig.name} - Professionele 3D Websites Nederland`,
    'dc.creator': siteConfig.name,
    'dc.subject': 'Website Development, Web Design, 3D Websites, Nederlandse Webdesign',
    'dc.description': 'Professionele 3D websites en webdesign diensten in Nederland',
    'dc.publisher': siteConfig.name,
    'dc.contributor': siteConfig.name,
    'dc.date': new Date().toISOString(),
    'dc.type': 'text',
    'dc.format': 'text/html',
    'dc.identifier': SITE_URL,
    'dc.source': SITE_URL,
    'dc.language': 'nl-NL',
    'dc.relation': SITE_URL,
    'dc.coverage': 'Netherlands',
    'dc.rights': `© ${new Date().getFullYear()} ${siteConfig.name}`,
    // Geographic metadata
    'geo.region': 'NL',
    'geo.placename': 'Netherlands',
    'geo.position': '52.3676;4.9041',
    ICBM: '52.3676, 4.9041',
    // Content freshness
    'article:modified_time': new Date().toISOString(),
    'article:published_time': new Date().toISOString(),
    // Business metadata for rich snippets
    'business:contact_data:phone_number': siteConfig.phone,
    'business:contact_data:email': siteConfig.email,
    'business:contact_data:locality': 'Nederland',
    'business:contact_data:region': 'Nederland',
    'business:contact_data:country_name': 'Netherlands',
    // Social media verification
    'facebook-domain-verification': process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION || '',
    'google-site-verification': process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || process.env.GOOGLE_SITE_VERIFICATION || '',
    // Enhanced robots directives
    'robots': 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1',
    'googlebot': 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1',
    'bingbot': 'index,follow',
    'slurp': 'index,follow',
    'duckduckbot': 'index,follow',
    'facebookexternalhit': 'index,follow',
    'twitterbot': 'index,follow',
    'linkedinbot': 'index,follow',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const nonce = headersList.get('X-Nonce') || '';
  
  return (
    <html lang="nl-NL">
      <head>
        {/* Hreflang tags for Dutch market targeting */}
        <link rel="alternate" hrefLang="nl" href={`${SITE_URL}/`} />
        <link rel="alternate" hrefLang="nl-NL" href={`${SITE_URL}/`} />
        <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}/`} />
        
        {/* Critical CSS for above-the-fold content - improves LCP */}
        <CriticalCSS route="/" />
        
        {/* Enhanced Resource Hints for perfect Core Web Vitals */}
        <ResourceHints currentPath="/" enableRoutePrefetch={true} enableDNSPrefetch={true} />
        
        {/* Legacy resource hints (keeping for compatibility) */}
        {generateResourcePreconnects().map((resource, index) => {
          if (resource.type === 'preconnect') {
            return (
              <link
                key={`legacy-preconnect-${index}`}
                rel="preconnect"
                href={resource.href}
                {...(resource.crossOrigin !== undefined && { crossOrigin: resource.crossOrigin })}
              />
            );
          } else if (resource.type === 'dns-prefetch') {
            return (
              <link
                key={`legacy-dns-prefetch-${index}`}
                rel="dns-prefetch"
                href={resource.href}
              />
            );
          }
          return null;
        })}
        
        {/* Font preloads are handled automatically by Next.js */}
        
        {/* Critical image preloads are handled by Next.js Image component */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon-180.png" />
      </head>
      <body className={`${primaryFont.className} bg-transparent`}>
        <BackgroundLayer />
        {/**
         * Global cosmic background placed at the root, behind all content.
         * Why: Some routes add a safe top padding for the sticky header. When
         * the first section provides its own background (e.g. hero/canvas),
         * that padding area could expose a different root color/gradient,
         * creating a visible dark band beneath the header. Rendering the
         * nebula/star background globally ensures a single, consistent
         * backdrop from the very top across all pages while keeping header
         * wrappers fully transparent.
         */}
  <HeroBackground />
  {/* Global top vignette to unify luminance behind the header across routes */}
  <TopVignetteOverlay />
        <a href="#main" className="skip-to-content">
          Ga naar hoofdinhoud
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <CursorTrail />

        <SEOSchema nonce={nonce} pageType="generic" />
        <PWAServiceWorker />
        <DutchPerformanceMonitor />

        <Script
          defer
          data-domain={siteConfig.analytics.plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
          nonce={nonce}
        />
        <Analytics />
        <SpeedInsights />
        
        {/* Enhanced Web Vitals Monitoring */}
        <WebVitalsReporter />
        <WebVitalsDisplay showInProduction={process.env.NODE_ENV === 'development'} />
      </body>
    </html>
  );
}
