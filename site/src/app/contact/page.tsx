import type { Metadata } from 'next';
import ServerContactForm from '@/components/ServerContactForm';
import SEOSchema from '@/components/SEOSchema';
import { NonceScript } from '@/lib/nonce';

// Get canonical URL from environment with fallback
const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');

export const dynamic = 'force-dynamic'; // Allow server-side processing for forms
export const revalidate = false;

export const metadata: Metadata = {
  title: 'Contact ProWeb Studio | Website laten maken afspraak | Nederland',
  description:
    'Start uw website project vandaag. Gratis adviesgesprek over website laten maken, webshop bouwen of webdesign. Reactie binnen 1 werkdag. Video of op locatie in Nederland.',
  alternates: {
    canonical: '/contact',
    languages: { 
      'nl-NL': '/contact',
      'x-default': '/contact'
    },
  },
  openGraph: {
    title: 'Contact ProWeb Studio | Website laten maken afspraak | Nederland',
    description:
      'Start uw website project vandaag. Gratis adviesgesprek over website laten maken, webshop bouwen of webdesign. Reactie binnen 1 werkdag. Video of op locatie in Nederland.',
    url: `${SITE_URL}/contact`,
    type: 'website',
    locale: 'nl_NL',
  },
};

interface ContactPageProps {
  searchParams: { success?: string; error?: string };
}

export default function ContactPage({ searchParams }: ContactPageProps) {
  return (
    <main className="content-safe-top pt-20 md:pt-24 relative overflow-hidden">
      <SEOSchema
        pageType="contact"
        pageTitle={metadata.title as string}
        pageDescription={metadata.description as string}
      />
      {/* Pure CSS background image to avoid client JS */}
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none -z-10"
        style={{
          backgroundImage: "url('/assets/glowing_beacon_contact.avif')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <ServerContactForm searchParams={searchParams} />
      <section
        id="seo-content"
        className="prose prose-invert max-w-none px-6 md:px-8 lg:px-12 py-12 md:py-16"
      >
        <h1>Start het gesprek</h1>
        <p>
          Vertel kort uw doel, doelgroep en gewenste deadline. We denken mee en
          komen met een concreet voorstel.
        </p>
        <h2>Hoe wilt u contact?</h2>
        <ul>
          <li>
            <strong>Formulier:</strong> naam, e‑mail, telefoon (optioneel),
            projecttype, bericht.
          </li>
          <li>
            <strong>Afspraak plannen:</strong> direct via onze agenda.
          </li>
          <li>
            <strong>E‑mail/telefoon:</strong> contact@prowebstudio.nl — +31686412430.
          </li>
        </ul>
        <h2>Wat gebeurt er daarna?</h2>
        <p>
          We bevestigen ontvangst, plannen een call en leveren na de intake een
          duidelijke scope en planning.
        </p>
        <h2>FAQ</h2>
        <p>
          <strong>Hoe snel reageren jullie?</strong> Binnen één werkdag.
        </p>
        <p>
          <strong>Kunnen we NDA tekenen?</strong> Ja, op verzoek.
        </p>
        <p>
          <strong>Werken jullie remote of op locatie?</strong> Beide opties zijn
          mogelijk.
        </p>
      </section>

      <NonceScript>
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Hoe snel reageren jullie?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Binnen één werkdag.',
              },
            },
            {
              '@type': 'Question',
              name: 'Kunnen we NDA tekenen?',
              acceptedAnswer: { '@type': 'Answer', text: 'Ja, op verzoek.' },
            },
            {
              '@type': 'Question',
              name: 'Werken jullie remote of op locatie?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Beide opties zijn mogelijk.',
              },
            },
          ],
        })}
      </NonceScript>
    </main>
  );
}
