import { siteConfig } from '@/config/site.config';
import { Button } from '@/components/Button';
import { ArrowRight } from 'lucide-react';
import { designSystem, designClasses } from '@/lib/design-system';
import MobileFAQItem from '@/components/MobileFAQItem';

// Dutch Market FAQ Component with Regional and Business-Specific Content
export default function DutchMarketFAQ() {
  const faqs = [
    // Business Growth & ROI
    {
      category: "Business Growth",
      question: "Hoe zorgt een professionele website voor meer omzet bij Nederlandse bedrijven?",
      answer: "Een professionele website verhoogt uw omzet door vertrouwen te wekken bij Nederlandse klanten, beter vindbaar te zijn in Google, en bezoekers om te zetten naar klanten. We focussen op Nederlandse zoekwoorden, lokale SEO, en gebruikersgedrag specifiek voor de Nederlandse markt.",
      keywords: ["bedrijfsgroei", "omzet verhogen", "nederlandse klanten", "ROI"]
    },
    {
      category: "Business Growth", 
      question: "Wat is het verschil tussen een goedkope website en een professionele website?",
      answer: "Een professionele website is een investering in uw bedrijfsgroei. Waar goedkope oplossingen vaak leiden tot technische problemen, slechte vindbaarheid en verloren klanten, bouwt een professionele website vertrouwen op en genereert structureel nieuwe business.",
      keywords: ["professionele website", "investering", "bedrijfsgroei", "kwaliteit"]
    },

    // Regional Targeting
    {
      category: "Regionale Service",
      question: "Bedienen jullie bedrijven in heel Nederland of alleen de Randstad?",
      answer: "We bedienen bedrijven door heel Nederland. Van Amsterdam tot Groningen, van Rotterdam tot Maastricht - alle Nederlandse ondernemers kunnen gebruik maken van onze diensten. We werken remote-first maar komen ook graag langs voor belangrijke meetings.",
      keywords: ["heel Nederland", "Amsterdam", "Rotterdam", "Groningen", "Maastricht", "Randstad"]
    },
    {
      category: "Regionale Service",
      question: "Kunnen jullie ook lokale SEO doen voor bedrijven buiten de grote steden?",
      answer: "Absoluut! Lokale SEO voor kleinere steden en regio's is vaak effectiever omdat er minder concurrentie is. We optimaliseren voor uw specifieke locatie, zorgen voor Google My Business optimalisatie, en richten ons op lokale zoektermen.",
      keywords: ["lokale SEO", "kleinere steden", "regionale optimalisatie", "Google My Business"]
    },

    // Dutch Business Culture
    {
      category: "Nederlandse Aanpak",
      question: "Hoe verschilt jullie Nederlandse aanpak van internationale webbureau's?",
      answer: "Onze no-nonsense aanpak past perfect bij de Nederlandse bedrijfscultuur. We zijn direct en transparant in onze communicatie, werken efficiënt zonder poespas, en begrijpen de Nederlandse markt en regelgeving. Plus: alles in het Nederlands, geen taalbarrières.",
      keywords: ["no-nonsense", "transparant", "nederlandse bedrijfscultuur", "direct"]
    },
    {
      category: "Nederlandse Aanpak",
      question: "Begrijpen jullie de specifieke behoeften van Nederlandse MKB-bedrijven?",
      answer: "Zeker! Het Nederlandse MKB heeft andere behoeften dan grote corporates. We bieden pragmatische, schaalbare oplossingen die passen bij uw budget en groeicurve. Van eenvoudige bedrijfswebsites tot volledige digitale transformatie - altijd maatwerk.",
      keywords: ["MKB", "Nederlandse ondernemers", "pragmatisch", "schaalbaar", "maatwerk"]
    },

    // Payment & Legal
    {
      category: "Betaling & Juridisch",
      question: "Welke Nederlandse betaalmethoden integreren jullie in webshops?",
      answer: "We integreren alle populaire Nederlandse betaalmethoden: iDEAL (essentieel!), creditcards, Bancontact, PayPal, en SEPA overschrijvingen. We werken met betrouwbare Nederlandse payment providers zoals Mollie en internationale spelers zoals Stripe.",
      keywords: ["iDEAL", "Nederlandse betaalmethoden", "Mollie", "webshop"]
    },
    {
      category: "Betaling & Juridisch",
      question: "Zijn jullie websites GDPR/AVG compliant voor Nederlandse bedrijven?",
      answer: "Ja, alle onze websites voldoen aan de Nederlandse AVG/GDPR wetgeving. We implementeren cookie banners, privacy statements, GDPR-vriendelijke analytics, en zorgen voor juiste data verwerking conform Nederlandse en Europese regelgeving.",
      keywords: ["GDPR", "AVG", "Nederlandse wetgeving", "privacy", "compliance"]
    },

    // Technical & Performance
    {
      category: "Technische Aspecten",
      question: "Gebruiken jullie Nederlandse hosting of internationale servers?",
      answer: "We bieden beide opties. Voor optimale snelheid en data sovereignty kunnen we kiezen voor Nederlandse hosting providers. Voor mondiale reach gebruiken we high-performance CDN's met Nederlandse datacenters (AWS Amsterdam, Google Cloud Brussels).",
      keywords: ["nederlandse hosting", "data sovereignty", "AWS Amsterdam", "CDN"]
    },
    {
      category: "Technische Aspecten",
      question: "Hoe zorgen jullie ervoor dat websites snel laden voor Nederlandse bezoekers?",
      answer: "We optimaliseren specifiek voor Nederlandse internetverbindingen en gebruikersgedrag. Door lokale hosting, optimale beeldcompressie, moderne caching, en Core Web Vitals optimalisatie presteren onze websites uitstekend in Nederland.",
      keywords: ["snelle websites", "Core Web Vitals", "Nederlandse internetverbindingen", "performance"]
    },

    // Competition & Market Position
    {
      category: "Marktpositie",
      question: "Wat maakt ProWeb Studio anders dan andere Nederlandse webbureau's?",
      answer: "Wij combineren Nederlandse betrouwbaarheid met cutting-edge technologie. Waar andere bureaus vaak oude systemen zoals WordPress gebruiken, bouwen wij moderne, snelle websites met Next.js en React. Plus: transparante prijzen en geen verborgen kosten.",
      keywords: ["Nederlandse betrouwbaarheid", "moderne technologie", "transparante prijzen", "Next.js"]
    },
    {
      category: "Marktpositie",
      question: "Kunnen jullie referenties geven van Nederlandse bedrijven?",
      answer: "Natuurlijk! We hebben ervaring met diverse Nederlandse bedrijven, van startups tot gevestigde MKB-ondernemingen. Op verzoek delen we case studies en referenties van vergelijkbare projecten in uw branche, altijd met toestemming van onze klanten.",
      keywords: ["Nederlandse referenties", "case studies", "MKB-ervaring", "branche-ervaring"]
    }
  ];

  const categories = [...new Set(faqs.map(faq => faq.category))];

  return (
    <section className={designClasses(
      designSystem.components.contentSection,
      designSystem.spacing.container
    )}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className={designClasses(designSystem.typography.sectionTitle, "mb-6")}>
            Veelgestelde vragen van Nederlandse ondernemers
          </h2>
          <p className={designClasses(designSystem.typography.bodyPrimary, "max-w-3xl mx-auto")}>
            Antwoorden op de belangrijkste vragen over website laten maken, 
            specifiek voor de Nederlandse markt en bedrijfscultuur.
          </p>
        </div>

        {categories.map((category, categoryIndex) => (
          <div key={category} className="mb-12 md:mb-16">
            <h3 className={designClasses(
              designSystem.typography.subsectionTitle, 
              "mb-6 md:mb-8 border-b border-cyan-400/20 pb-3"
            )}>
              {category}
            </h3>
            
            <div className="space-y-3 md:space-y-4">
              {faqs
                .filter(faq => faq.category === category)
                .map((faq, faqIndex) => (
                  <MobileFAQItem
                    key={`${categoryIndex}-${faqIndex}`}
                    faq={{
                      question: faq.question,
                      answer: faq.answer,
                      keywords: faq.keywords
                    }}
                    index={faqIndex}
                  />
                ))}
            </div>
          </div>
        ))}

        {/* Call to Action */}
        <div className={designClasses(
          designSystem.effects.glass,
          "mt-12 md:mt-16 text-center p-6 md:p-8 rounded-xl border-l-4 border-l-cyan-500/30",
          designSystem.effects.gradientSubtle
        )}>
          <h3 className={designClasses(designSystem.typography.subsectionTitle, "mb-4")}>
            Nog vragen over website laten maken?
          </h3>
          <p className={designClasses(designSystem.typography.bodyPrimary, "mb-6 md:mb-8 max-w-2xl mx-auto")}>
            Elke ondernemer heeft unieke vragen en uitdagingen. We beantwoorden graag 
            uw specifieke vragen over website ontwikkeling, SEO, of digitale strategie.
          </p>
          <Button
            href="/contact"
            variant="primary"
          >
            <span className="flex items-center gap-2">
              Stel uw vraag
              <ArrowRight className="w-4 h-4" />
            </span>
          </Button>
        </div>
      </div>

      {/* Structured Data for FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            '@id': `${siteConfig.url}/dutch-market-faq`,
            name: 'Nederlandse ondernemers FAQ - Website laten maken',
            description: 'Veelgestelde vragen van Nederlandse bedrijven over professionele website ontwikkeling, SEO, en digitale groei',
            inLanguage: 'nl-NL',
            mainEntity: faqs.map((faq, index) => ({
              '@type': 'Question',
              '@id': `${siteConfig.url}/dutch-market-faq#faq-${index + 1}`,
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
                author: {
                  '@type': 'Organization',
                  '@id': `${siteConfig.url}#organization`,
                  name: siteConfig.name,
                  url: siteConfig.url,
                },
              },
            })),
            about: {
              '@type': 'Thing',
              name: 'Website laten maken Nederland',
              description: 'Nederlandse markt specifieke vragen over website ontwikkeling en digitale groei'
            },
            publisher: {
              '@type': 'Organization',
              '@id': `${siteConfig.url}#organization`,
              name: siteConfig.name,
              url: siteConfig.url,
            },
          }),
        }}
      />
    </section>
  );
}