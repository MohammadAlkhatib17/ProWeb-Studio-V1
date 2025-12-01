import { SITE_URL, dutchMetadataDefaults } from '@/lib/metadata/defaults';

import StedenClientPage from './client-page';

import type { Metadata } from 'next';

export const dynamic = 'force-static';
export const revalidate = 86400; // 24 hours ISR

const canonicalUrl = `${SITE_URL}/steden`;

// Metadata must be exported from Server Component
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Website Laten Maken in Nederland | Webdesign in Alle Grote Steden | ProWeb Studio',
  description: 'Professionele website laten maken in heel Nederland. Van Amsterdam tot Groningen, van Rotterdam tot Nijmegen - lokale webdesign expertise met nationale kwaliteit. Ontdek onze diensten in uw stad.',
  keywords: [
    'website laten maken nederland',
    'webdesign nederland',
    'website maken amsterdam',
    'webdesign rotterdam',
    'website utrecht',
    'webshop laten maken',
    'lokale webdesign',
    'website per stad',
    'nederlandse webdesigner',
    'regionale webdesign',
  ],
  alternates: {
    canonical: canonicalUrl,
    languages: {
      'nl-NL': canonicalUrl,
      'nl': canonicalUrl,
      'x-default': canonicalUrl,
    },
  },
  openGraph: {
    title: 'Website Laten Maken in Nederland | ProWeb Studio',
    description: 'Professionele webdesign diensten in alle grote Nederlandse steden. Lokale expertise, nationale kwaliteit.',
    url: canonicalUrl,
    siteName: 'ProWeb Studio',
    locale: dutchMetadataDefaults.locale,
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/og`,
        width: 1200,
        height: 630,
        alt: 'ProWeb Studio - Website Laten Maken Nederland',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Website Laten Maken in Nederland | ProWeb Studio',
    description: 'Professionele webdesign diensten in alle grote Nederlandse steden.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function StedenPage() {
  return <StedenClientPage />;
}
