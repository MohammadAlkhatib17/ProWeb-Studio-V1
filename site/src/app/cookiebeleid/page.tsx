import LegalContentLayout from '@/components/LegalContentLayout';
import SEOSchema from '@/components/SEOSchema';
import { siteConfig } from '@/config/site.config';

import type { Metadata } from 'next';

// Get canonical URL from environment with fallback
const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');

export const dynamic = 'force-static';
export const revalidate = 86400; // 24 hours ISR

export const metadata: Metadata = {
  title: 'Cookiebeleid – ProWeb Studio',
  description:
    'Uitleg over welke cookies wij gebruiken, waarom en hoe u uw voorkeuren kunt beheren. Privacy-vriendelijke analytics zonder tracking.',
  alternates: { 
    canonical: '/cookiebeleid',
    languages: { 
      'nl-NL': '/cookiebeleid',
      'x-default': '/cookiebeleid'
    },
  },
  openGraph: {
    title: 'Cookiebeleid – ProWeb Studio',
    description:
      'Uitleg over welke cookies wij gebruiken, waarom en hoe u uw voorkeuren kunt beheren. Privacy-vriendelijke analytics zonder tracking.',
    url: `${SITE_URL}/cookiebeleid`,
    type: 'website',
    locale: 'nl_NL',
  },
};

export default function CookiebeleIdPage() {
  const name = siteConfig.name;
  const contactEmail = siteConfig.contact?.inbox ?? 'contact@prowebstudio.nl';
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <SEOSchema
        pageType="generic"
        pageTitle={metadata.title as string}
        pageDescription={metadata.description as string}
      />
      <LegalContentLayout>
        <h1>Cookiebeleid</h1>

        <p>
          Dit cookiebeleid beschrijft hoe <strong>{name}</strong> cookies en
          vergelijkbare technologieën gebruikt op onze website{' '}
          <a href={siteConfig.url}>{siteConfig.url}</a>.
        </p>

        <h2>1. Wat zijn cookies?</h2>
        <p>
          Cookies zijn kleine tekstbestanden die door uw browser worden opgeslagen
          wanneer u onze website bezoekt. Ze helpen de website te onthouden wie u
          bent en uw voorkeuren voor toekomstige bezoeken.
        </p>

        <h2>2. Welke cookies gebruiken wij?</h2>

        <h3>2.1 Strikt noodzakelijke cookies</h3>
        <p>
          Deze cookies zijn essentieel voor het functioneren van de website en
          kunnen niet worden uitgeschakeld. Ze worden alleen geplaatst als reactie
          op acties die u onderneemt, zoals het instellen van uw privacyvoorkeuren
          of het invullen van formulieren.
        </p>
        <ul>
          <li>
            <strong>Cookie consent</strong>: Slaat uw cookievoorkeuren op (naam:{' '}
            <code>cookie-consent</code>, looptijd: 1 jaar)
          </li>
          <li>
            <strong>Sessie cookies</strong>: Technische cookies voor
            formulierverwerking (sessieduur)
          </li>
        </ul>

        <h3>2.2 Analytische cookies (opt-in)</h3>
        <p>
          Wij gebruiken Plausible Analytics, een privacy-vriendelijke,
          cookieloze analytics-oplossing die voldoet aan de AVG, ePrivacy-richtlijn
          en CCPA. <strong>Plausible plaatst géén cookies</strong> en verzamelt
          géén persoonlijke gegevens.
        </p>
        <ul>
          <li>Geen IP-adressen worden opgeslagen</li>
          <li>Geen cross-site of cross-device tracking</li>
          <li>Alle data is geaggregeerd en anoniem</li>
          <li>Geen gebruik van vingerafdrukken</li>
          <li>100% eigendom van de data blijft bij ons</li>
        </ul>
        <p>
          Meer informatie:{' '}
          <a
            href="https://plausible.io/data-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Plausible Data Policy
          </a>
        </p>

        <h3>2.3 Functionele cookies (opt-in)</h3>
        <p>
          Deze cookies verbeteren de functionaliteit en personalisatie van de
          website, zoals het onthouden van uw taalvoorkeur of regiokeuze.
        </p>

        <h3>2.4 Marketing cookies (opt-in)</h3>
        <p>
          Wij gebruiken momenteel geen marketing of tracking cookies van derden.
          Mocht dit in de toekomst veranderen, dan vragen wij altijd vooraf uw
          expliciete toestemming.
        </p>

        <h2>3. Uw toestemming en keuzes</h2>
        <p>
          Bij uw eerste bezoek aan onze website wordt u gevraagd om toestemming te
          geven voor het gebruik van optionele cookies. U kunt uw voorkeuren op elk
          moment wijzigen via:
        </p>
        <ul>
          <li>De cookie-instellingen knop in de footer van elke pagina</li>
          <li>De instellingen van uw browser</li>
        </ul>

        <h2>4. Cookies van derden</h2>
        <p>
          Wij hosten externe content (zoals Cal.com voor afspraakplanning). Deze
          diensten kunnen hun eigen cookies plaatsen. Wij hebben geen controle over
          deze cookies. Raadpleeg het privacybeleid van deze diensten voor meer
          informatie:
        </p>
        <ul>
          <li>
            Cal.com:{' '}
            <a
              href="https://cal.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
          </li>
        </ul>

        <h2>5. Cookies beheren in uw browser</h2>
        <p>
          U kunt cookies op elk moment verwijderen of blokkeren via de instellingen
          van uw browser. Let op: het uitschakelen van bepaalde cookies kan invloed
          hebben op de functionaliteit van onze website.
        </p>
        <ul>
          <li>
            <a
              href="https://support.google.com/chrome/answer/95647"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Chrome
            </a>
          </li>
          <li>
            <a
              href="https://support.mozilla.org/nl/kb/cookies-verwijderen-gegevens-wissen-websites-opgeslagen"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mozilla Firefox
            </a>
          </li>
          <li>
            <a
              href="https://support.apple.com/nl-nl/guide/safari/sfri11471/mac"
              target="_blank"
              rel="noopener noreferrer"
            >
              Safari
            </a>
          </li>
          <li>
            <a
              href="https://support.microsoft.com/nl-nl/microsoft-edge/cookies-verwijderen-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
              target="_blank"
              rel="noopener noreferrer"
            >
              Microsoft Edge
            </a>
          </li>
        </ul>

        <h2>6. Web beacons en pixels</h2>
        <p>
          Wij gebruiken geen tracking pixels of web beacons die uw gedrag volgen
          over meerdere websites.
        </p>

        <h2>7. Do Not Track (DNT)</h2>
        <p>
          Onze analytics-oplossing (Plausible) respecteert de{' '}
          <code>Do Not Track</code> browser-instelling automatisch. Als u DNT heeft
          ingeschakeld, worden er geen analytics-gegevens verzameld.
        </p>

        <h2>8. Wijzigingen in dit cookiebeleid</h2>
        <p>
          Wij kunnen dit cookiebeleid van tijd tot tijd bijwerken. De meest recente
          versie is altijd beschikbaar op deze pagina. Belangrijke wijzigingen
          worden aangekondigd via onze website.
        </p>

        <h2>9. Contact</h2>
        <p>
          Vragen over ons cookiebeleid of over hoe wij cookies gebruiken? Neem
          contact met ons op via{' '}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>

        <hr />
        <p className="text-sm opacity-70">
          Laatst bijgewerkt: {today} | Voor uw privacy gebruiken wij alleen
          noodzakelijke cookies en cookieloze analytics.
        </p>

        {/* SEO Content Section */}
        <section
          id="seo-content"
          className="prose prose-invert max-w-none px-6 md:px-8 lg:px-12 py-12 md:py-16"
        >
          <h1>Cookiebeleid</h1>
          <h2>Wat zijn cookies?</h2>
          <p>
            Kleine tekstbestanden voor functionaliteit, voorkeuren en (optioneel)
            statistieken.
          </p>
          <h2>Welke cookies gebruiken wij?</h2>
          <ul>
            <li>
              <strong>Noodzakelijk:</strong> Sessie, consent-opslag.
            </li>
            <li>
              <strong>Analytisch:</strong> Plausible (cookieloos, AVG-conform).
            </li>
            <li>
              <strong>Functioneel:</strong> Taalvoorkeur (opt-in).
            </li>
            <li>
              <strong>Marketing:</strong> Geen (tenzij u expliciet toestemming
              geeft).
            </li>
          </ul>
          <h2>Uw rechten</h2>
          <p>
            U kunt uw cookievoorkeuren wijzigen via de footer-knop of
            browserinstellingen.
          </p>
          <h2>Plausible Analytics</h2>
          <p>
            Privacy-first, cookieloos, geen cross-site tracking, 100%
            AVG-compliant.
          </p>
          <h2>Contact</h2>
          <p>{contactEmail}</p>
        </section>
      </LegalContentLayout>
    </>
  );
}
