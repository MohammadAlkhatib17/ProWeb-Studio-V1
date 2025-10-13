import { siteConfig } from "@/config/site.config";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import { fadeInUp, staggerContainer, defaultViewport } from "@/lib/motion";
import { designSystem } from "@/lib/design-system";

// Component that showcases Dutch business culture integration and terminology
export default function DutchBusinessCulture() {
  const culturalValues = [
    {
      title: "No-nonsense aanpak",
      icon: "🎯",
      description:
        "Direct, eerlijk en zonder poespas. Wij zeggen wat we doen en doen wat we zeggen.",
      businessValue:
        "Geen verrassingen, heldere afspraken, efficiënte samenwerking",
      examples: [
        "Transparante prijzen",
        "Duidelijke deadlines",
        "Eerlijke communicatie",
      ],
    },
    {
      title: "Nederlandse kwaliteit",
      icon: "⭐",
      description:
        "Vakmanschap en aandacht voor detail, zoals u dat gewend bent van Nederlandse bedrijven.",
      businessValue: "Betrouwbare oplossingen die lang meegaan",
      examples: [
        "Zorgvuldige planning",
        "Kwalitatieve uitvoering",
        "Nazorg en onderhoud",
      ],
    },
    {
      title: "Pragmatische oplossingen",
      icon: "🔧",
      description:
        "Praktische oplossingen die werken voor uw specifieke situatie en budget.",
      businessValue: "Optimale ROI en resultaat voor uw investering",
      examples: [
        "Maatwerk binnen budget",
        "Schaalbare oplossingen",
        "Toekomstbestendig",
      ],
    },
    {
      title: "Transparante communicatie",
      icon: "💬",
      description:
        "Open en eerlijke communicatie over voortgang, mogelijkheden en eventuele uitdagingen.",
      businessValue: "Vertrouwen en betere samenwerking",
      examples: [
        "Wekelijkse updates",
        "Toegang tot dashboard",
        "Directe feedback",
      ],
    },
  ];

  const businessTerms = [
    {
      category: "MKB-gericht",
      terms: [
        {
          term: "MKB-vriendelijk",
          explanation:
            "Oplossingen die passen bij de behoeften en het budget van het midden- en kleinbedrijf",
          usage: "Onze MKB-vriendelijke pakketten starten vanaf €2.500",
        },
        {
          term: "Ondernemers onder elkaar",
          explanation:
            "We begrijpen de uitdagingen omdat we zelf ondernemers zijn",
          usage: "Van ondernemer tot ondernemer: we snappen uw ambitie",
        },
        {
          term: "Bedrijfsgroei ondersteunen",
          explanation: "Websites die meegroeien met uw bedrijf en ambities",
          usage: "Websites die uw bedrijfsgroei ondersteunen en accelereren",
        },
      ],
    },
    {
      category: "Nederlandse zakelijkheid",
      terms: [
        {
          term: "Afspraak is afspraak",
          explanation:
            "Betrouwbaarheid en het nakomen van afspraken staat centraal",
          usage: "Bij ons geldt: afspraak is afspraak, zonder uitzonderingen",
        },
        {
          term: "Nederlandse degelijkheid",
          explanation: "Solide, betrouwbare oplossingen die lang meegaan",
          usage: "Nederlandse degelijkheid in webdevelopment",
        },
        {
          term: "Gewoon goed",
          explanation: "Eenvoudig uitstekende kwaliteit zonder opsmuk",
          usage: "Gewoon goede websites die werken en verkopen",
        },
      ],
    },
    {
      category: "Markt & Compliance",
      terms: [
        {
          term: "AVG/GDPR-proof",
          explanation:
            "Volledig compliant met Nederlandse en Europese privacywetgeving",
          usage: "Alle websites zijn standaard AVG/GDPR-proof",
        },
        {
          term: "iDEAL-ready",
          explanation: "Geoptimaliseerd voor Nederlandse betaalgewoonten",
          usage: "iDEAL-ready webshops voor de Nederlandse markt",
        },
        {
          term: "BTW-transparant",
          explanation: "Heldere prijzen inclusief BTW, geen verborgen kosten",
          usage: "BTW-transparante prijzen vanaf €2.500 inclusief BTW",
        },
      ],
    },
  ];

  const dutchMarketInsights = [
    {
      insight:
        "Nederlandse consumenten vertrouwen websites met .nl domein 23% meer",
      action: "Wij adviseren altijd een .nl domein voor Nederlandse bedrijven",
      icon: "🇳🇱",
    },
    {
      insight: "87% van Nederlandse ondernemers prefereert lokale suppliers",
      action: "Nederlandse hosting en support zorgen voor vertrouwen",
      icon: "🤝",
    },
    {
      insight:
        "iDEAL wordt gebruikt bij 75% van alle online betalingen in Nederland",
      action: "iDEAL-integratie is essentieel voor webshop succes",
      icon: "💳",
    },
    {
      insight:
        "Nederlandse websites moeten binnen 3 seconden laden voor optimale conversie",
      action: "Performance-optimalisatie voor Nederlandse internetverbindingen",
      icon: "⚡",
    },
  ];

  return (
    <motion.section
      className="py-section px-4 sm:px-6"
      initial="initial"
      whileInView="animate"
      viewport={defaultViewport}
      variants={staggerContainer}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div className="text-center mb-16" variants={fadeInUp}>
          <h2 className={designSystem.typography.sectionTitle}>
            Nederlandse bedrijfscultuur in webdesign
          </h2>
          <p className={`${designSystem.typography.bodyPrimary} text-slate-200 max-w-4xl mx-auto mb-8`}>
            Websites die perfect aansluiten bij de Nederlandse manier van
            ondernemen. Met respect voor onze zakelijke cultuur en begrip van
            wat Nederlandse ondernemers echt nodig hebben.
          </p>
        </motion.div>

        {/* Cultural Values */}
        <motion.div className="mb-20" variants={fadeInUp}>
          <h3 className="text-2xl sm:text-3xl font-bold mb-12 text-center">
            Nederlandse waarden in ons werk
          </h3>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
          >
            {culturalValues.map((value, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 hover:border-cyan-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/10 border-l-4 border-l-cyan-500/20 hover:border-l-cyan-400"
              >
                <div className="flex items-start mb-4">
                  <span className="text-3xl mr-4">{value.icon}</span>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">
                      {value.title}
                    </h4>
                    <p className="text-slate-200 leading-relaxed mb-4">
                      {value.description}
                    </p>
                  </div>
                </div>

                <div className="bg-cyan-400/5 border border-cyan-400/20 rounded-lg p-4 mb-4">
                  <h5 className="text-sm font-semibold text-cyan-300 mb-2">
                    Zakelijke waarde:
                  </h5>
                  <p className="text-sm text-slate-200">
                    {value.businessValue}
                  </p>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-white mb-3">
                    Praktische voorbeelden:
                  </h5>
                  <ul className="space-y-2">
                    {value.examples.map((example, exampleIndex) => (
                      <li
                        key={exampleIndex}
                        className="flex items-center text-sm text-slate-200"
                      >
                        <span className="text-cyan-300 mr-2">✓</span>
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Business Terminology */}
        <div className="mb-20">
          <h3 className="text-2xl sm:text-3xl font-bold mb-12 text-center">
            Nederlandse zakelijke terminologie
          </h3>

          <div className="space-y-12">
            {businessTerms.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h4 className="text-xl font-bold mb-6 text-cyan-300 border-b border-cyan-400/20 pb-2">
                  {category.category}
                </h4>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {category.terms.map((termData, termIndex) => (
                    <div
                      key={termIndex}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 hover:border-cyan-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/10"
                    >
                      <h5 className="text-lg font-semibold text-white mb-3">
                        &ldquo;{termData.term}&rdquo;
                      </h5>
                      <p className="text-slate-200 text-sm mb-4 leading-relaxed">
                        {termData.explanation}
                      </p>
                      <div className="bg-purple-400/10 border border-purple-400/20 rounded-lg p-3">
                        <p className="text-sm text-purple-200 italic">
                          &ldquo;{termData.usage}&rdquo;
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Insights */}
        <div className="mb-20">
          <h3 className="text-2xl sm:text-3xl font-bold mb-12 text-center">
            Nederlandse markt inzichten
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dutchMarketInsights.map((insight, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-cyan-400/10 to-purple-400/10 border border-cyan-400/20 rounded-lg p-6 hover:border-cyan-400/40 transition-all duration-300"
              >
                <div className="flex items-start mb-4">
                  <span className="text-2xl mr-4">{insight.icon}</span>
                  <div>
                    <h4 className="font-semibold text-white mb-2">
                      Markt inzicht
                    </h4>
                    <p className="text-slate-200 text-sm leading-relaxed mb-4">
                      {insight.insight}
                    </p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h5 className="text-sm font-semibold text-cyan-300 mb-2">
                    Onze aanpak:
                  </h5>
                  <p className="text-sm text-slate-200">{insight.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cultural Understanding CTA */}
        <div className="bg-gradient-to-r from-neutral-800/60 to-neutral-900/60 border border-neutral-700 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4 text-white">
            Websites die passen bij Nederlandse ondernemers
          </h3>
          <p className="text-slate-200 mb-8 max-w-3xl mx-auto">
            Wij begrijpen de Nederlandse bedrijfscultuur omdat we er zelf deel
            van uitmaken. Van transparante prijzen tot betrouwbare afspraken -
            wij spreken uw taal, letterlijk en figuurlijk.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/over-ons" variant="primary">
              Leer ons kennen
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Button>

            <Button href="/werkwijze" variant="secondary">
              Onze werkwijze
            </Button>
          </div>

          {/* Key Dutch business principles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-neutral-600">
            <div className="text-center">
              <div className="text-cyan-300 font-semibold text-lg mb-1">
                100%
              </div>
              <div className="text-slate-300 text-sm">
                Nederlandse kwaliteit
              </div>
            </div>
            <div className="text-center">
              <div className="text-cyan-300 font-semibold text-lg mb-1">
                24u
              </div>
              <div className="text-slate-300 text-sm">Reactietijd max</div>
            </div>
            <div className="text-center">
              <div className="text-cyan-300 font-semibold text-lg mb-1">0</div>
              <div className="text-slate-300 text-sm">Verborgen kosten</div>
            </div>
            <div className="text-center">
              <div className="text-cyan-300 font-semibold text-lg mb-1">∞</div>
              <div className="text-slate-300 text-sm">Nazorg & support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Data for Dutch Business Culture */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "@id": `${siteConfig.url}/dutch-business-culture`,
            headline: "Nederlandse bedrijfscultuur in webdesign",
            description:
              "Hoe Nederlandse waarden en bedrijfscultuur worden geïntegreerd in professionele website ontwikkeling",
            author: {
              "@type": "Organization",
              "@id": `${siteConfig.url}#organization`,
              name: siteConfig.name,
              url: siteConfig.url,
            },
            publisher: {
              "@type": "Organization",
              "@id": `${siteConfig.url}#organization`,
              name: siteConfig.name,
              url: siteConfig.url,
            },
            inLanguage: "nl-NL",
            about: [
              {
                "@type": "Thing",
                name: "Nederlandse bedrijfscultuur",
                description:
                  "Waarden en principes die de Nederlandse zakelijke omgeving kenmerken",
              },
              {
                "@type": "Thing",
                name: "No-nonsense aanpak",
                description:
                  "Nederlandse directheid en transparantie in zakelijke communicatie",
              },
              {
                "@type": "Thing",
                name: "MKB-vriendelijk",
                description:
                  "Oplossingen die passen bij midden- en kleinbedrijf behoeften",
              },
            ],
            keywords: [
              "Nederlandse bedrijfscultuur",
              "no-nonsense aanpak",
              "MKB-vriendelijk",
              "Nederlandse kwaliteit",
              "transparante communicatie",
              "pragmatische oplossingen",
              "AVG/GDPR-proof",
              "iDEAL-ready",
            ].join(", "),
          }),
        }}
      />
    </motion.section>
  );
}
