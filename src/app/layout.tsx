import { Metadata } from 'next';
import { seoConfig } from '@/lib/seo-config';
import './globals.css';
import '../styles/fonts.css';
import { StructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: {
    default: seoConfig.defaultTitle,
    template: seoConfig.titleTemplate,
  },
  description: seoConfig.defaultDescription,
  keywords: 'website laten maken, webdesign, website ontwikkeling, professionele website, maatwerk website, amsterdam, nederland',
  authors: [{ name: 'ProWeb Studio', url: 'https://prowebstudio.nl' }],
  creator: 'ProWeb Studio',
  publisher: 'ProWeb Studio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(seoConfig.siteUrl),
  alternates: {
    canonical: '/',
    languages: {
      'nl-NL': '/',
      'en-US': '/en',
    },
  },
  openGraph: {
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    url: seoConfig.siteUrl,
    siteName: seoConfig.siteName,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ProWeb Studio - Website Laten Maken',
      },
    ],
    locale: 'nl_NL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    creator: seoConfig.twitterHandle,
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  other: {
    'geo.region': 'NL-NH',
    'geo.placename': 'Amsterdam',
    'geo.position': '52.3702;4.8952',
    'ICBM': '52.3702, 4.8952',
    'content-language': 'nl-NL',
    'distribution': 'global',
    'revisit-after': '7 days',
    'rating': 'general',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical font weights */}
        <link
          rel="preload"
          href="/fonts/inter-v13-latin-latin-ext-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/inter-v13-latin-latin-ext-600.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Preconnect to font CDN if using external fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">
        {children}
        {/* Global structured data */}
        <StructuredData type="organization" />
        <StructuredData type="speakable" />
      </body>
    </html>
  );
}