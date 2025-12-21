import SecureContactForm from '@/components/SecureContactForm';
import SEOSchema from '@/components/SEOSchema';
import { BackgroundImage } from '@/components/ui/responsive-image';
import { generateMetadata as generateMetadataUtil } from '@/lib/metadata';

import type { Metadata } from 'next';

export const dynamic = 'force-static';
export const revalidate = 86400; // 24 hours ISR

export async function generateMetadata(): Promise<Metadata> {
  return generateMetadataUtil({
    title: 'Contact ProWeb Studio | Website laten maken afspraak | Nederland',
    description:
      'Start uw website project vandaag. Gratis adviesgesprek over website laten maken, webshop bouwen of webdesign. Reactie binnen 1 werkdag. Video of op locatie in Nederland.',
    path: '/contact',
    keywords: [
      'contact proweb studio',
      'website laten maken afspraak',
      'webdesign consultatie',
      'gratis adviesgesprek website',
      'webontwikkeling nederland',
    ],
  });
}

export default function ContactPage() {
  const pageTitle = 'Contact ProWeb Studio | Website laten maken afspraak | Nederland';
  const pageDescription = 'Start uw website project vandaag. Gratis adviesgesprek over website laten maken, webshop bouwen of webdesign. Reactie binnen 1 werkdag. Video of op locatie in Nederland.';
  
  return (
    <main className="content-safe-top pt-20 md:pt-24 relative overflow-hidden">
      <SEOSchema
        pageType="contact"
        pageTitle={pageTitle}
        pageDescription={pageDescription}
      />
      {/* Full-bleed background to avoid top seam */}
      <BackgroundImage
        src="/assets/glowing_beacon_contact.avif"
        alt=""
        priority={true}
        quality={85}
        className="opacity-30 pointer-events-none -z-10"
      />
      <SecureContactForm />
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
          }),
        }}
      />
    </main>
  );
}
