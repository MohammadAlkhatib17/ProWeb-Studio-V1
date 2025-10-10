import type { Metadata } from 'next';
import { BackgroundImage } from '@/components/ui/responsive-image';
import SecureContactForm from '@/components/SecureContactForm';
import SEOSchema from '@/components/SEOSchema';
import { 
  PageLayout, 
  SectionLayout, 
  SectionTitle,
  BodyText
} from '@/components/unified/LayoutComponents';

// Get canonical URL from environment with fallback
const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');

export const dynamic = 'force-static';
export const revalidate = 60 * 60 * 24;

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

export default function ContactPage() {
  return (
    <PageLayout className="relative overflow-hidden">
      <SEOSchema
        pageType="contact"
        pageTitle={metadata.title as string}
        pageDescription={metadata.description as string}
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
      
      <SectionLayout variant="content" id="seo-content">
        <div className="prose prose-invert max-w-none">
          <SectionTitle as="h1">Start het gesprek</SectionTitle>
          <BodyText>
            Vertel kort uw doel, doelgroep en gewenste deadline. We denken mee en
            komen met een concreet voorstel.
          </BodyText>
          
          <SectionTitle>Hoe wilt u contact?</SectionTitle>
          <ul className="space-y-3 text-slate-200">
            <li>
              <strong className="text-cyan-300">Formulier:</strong> naam, e‑mail, telefoon (optioneel),
              projecttype, bericht.
            </li>
            <li>
              <strong className="text-cyan-300">Afspraak plannen:</strong> direct via onze agenda.
            </li>
            <li>
              <strong className="text-cyan-300">E‑mail/telefoon:</strong> contact@prowebstudio.nl — +31686412430.
            </li>
          </ul>
          
          <SectionTitle>Wat gebeurt er daarna?</SectionTitle>
          <BodyText>
            We bevestigen ontvangst, plannen een call en leveren na de intake een
            duidelijke scope en planning.
          </BodyText>
          
          <SectionTitle>FAQ</SectionTitle>
          <div className="space-y-4">
            <BodyText>
              <strong className="text-cyan-300">Hoe snel reageren jullie?</strong> Binnen één werkdag.
            </BodyText>
            <BodyText>
              <strong className="text-cyan-300">Kunnen we NDA tekenen?</strong> Ja, op verzoek.
            </BodyText>
            <BodyText>
              <strong className="text-cyan-300">Werken jullie remote of op locatie?</strong> Beide opties zijn
              mogelijk.
            </BodyText>
          </div>
        </div>
      </SectionLayout>

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
    </PageLayout>
  );
}
