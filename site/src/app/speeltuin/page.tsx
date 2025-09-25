import type { Metadata } from 'next';

// Get canonical URL from environment with fallback
import { getSiteUrl } from '@/lib/siteUrl';

export const dynamic = 'force-static';
export const revalidate = 60 * 60 * 24;

export const metadata: Metadata = {
  title: 'Tech Playground – ProWeb Studio',
  description: 'Experimenteer met WebGL, Three.js en 3D-interfaces. Onze speeltuin voor performance en UX-onderzoek.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: { 
    canonical: `${getSiteUrl()}/speeltuin`,
    languages: { 
      'nl-NL': '/speeltuin',
      'x-default': '/speeltuin'
    },
  },
  openGraph: {
    title: 'Tech Playground – ProWeb Studio',
    description: 'Experimenteer met WebGL, Three.js en 3D-interfaces. Onze speeltuin voor performance en UX-onderzoek.',
    url: `${getSiteUrl()}/speeltuin`,
    type: 'website',
    locale: 'nl_NL',
    images: [{ url: `${getSiteUrl()}/og`, width: 1200, height: 630 }],
  },
};

import SpeeltuinClient from './SpeeltuinClient';


export default function Page() {
  return (
    <main className="relative overflow-hidden content-safe-top pt-20 md:pt-24">
      <SpeeltuinClient />
    </main>
  );
}
