import type { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = 60 * 60 * 24;

import { LCPOptimizedImage } from "@/components/ui/LCPOptimizedImage";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import SEOSchema from "@/components/SEOSchema";
import DynamicOrbitSystem from "@/components/dynamic/DynamicOrbitSystem";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/Button";
import {
  PageLayout,
  SectionLayout,
  SectionTitle,
  BodyText,
} from "@/components/unified/LayoutComponents";
import { designSystem } from "@/lib/design-system";

// Get canonical URL from environment with fallback
const SITE_URL = (
  process.env.SITE_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://prowebstudio.nl"
).replace(/\/+$/, "");

export const metadata: Metadata = {
  title:
    "Website laten maken proces | Transparante werkwijze | ProWeb Studio Nederland",
  description:
    "Zo laten wij uw website maken: van intake tot launch in 5 stappen. Transparante communicatie, vaste prijzen, Nederlandse kwaliteit. Bekijk onze beproefde werkwijze.",
  alternates: {
    canonical: "/werkwijze",
    languages: {
      "nl-NL": "/werkwijze",
      "x-default": "/werkwijze",
    },
  },
  openGraph: {
    title:
      "Website laten maken proces | Transparante werkwijze | ProWeb Studio Nederland",
    description:
      "Zo laten wij uw website maken: van intake tot launch in 5 stappen. Transparante communicatie, vaste prijzen, Nederlandse kwaliteit. Bekijk onze beproefde werkwijze.",
    url: `${SITE_URL}/werkwijze`,
    type: "website",
    locale: "nl_NL",
  },
};

const steps = [
  {
    name: "Intake & Discovery",
    description: "We duiken diep in jouw visie en doelstellingen",
    details:
      "Uitgebreide analyse van uw bedrijfsdoelen, doelgroep en concurrentie",
    icon: "🎯",
    duration: "1-2 weken",
    deliverables: ["Projectbrief", "Requirement document", "Timeline"],
  },
  {
    name: "Strategie & Planning",
    description: "Data-gedreven plan voor maximale impact",
    details:
      "Technische architectuur, user experience strategie en performance goals",
    icon: "🚀",
    duration: "1 week",
    deliverables: ["Technische specificaties", "UX wireframes", "Projectplan"],
  },
  {
    name: "Creatief Design",
    description: "Visueel ontwerp dat jouw merk versterkt",
    details:
      "Moderne designs met focus op gebruikerservaring en merkidentiteit",
    icon: "🎨",
    duration: "2-3 weken",
    deliverables: ["UI mockups", "Design system", "Interactie prototypes"],
  },
  {
    name: "Development & Build",
    description: "Clean code, gebouwd voor de toekomst",
    details:
      "Moderne technologieën, optimale performance en toekomstbestendige code",
    icon: "⚡",
    duration: "3-5 weken",
    deliverables: ["Frontend development", "Backend integratie", "CMS setup"],
  },
  {
    name: "Testing & QA",
    description: "Rigoureus testen voor perfecte prestaties",
    details:
      "Cross-browser testing, performance optimalisatie en security audits",
    icon: "🔍",
    duration: "1 week",
    deliverables: ["Test rapport", "Performance metrics", "Security scan"],
  },
  {
    name: "Launch & Go-Live",
    description: "Soepele deployment en go-live begeleiding",
    details: "Gecontroleerde deployment met monitoring en backup procedures",
    icon: "🌟",
    duration: "3-5 dagen",
    deliverables: ["Live website", "Analytics setup", "Training materiaal"],
  },
  {
    name: "Growth & Optimization",
    description: "Continue optimalisatie en ondersteuning",
    details:
      "Data-analyse, conversie optimalisatie en technische ondersteuning",
    icon: "📈",
    duration: "Doorlopend",
    deliverables: ["Performance rapporten", "Optimalisaties", "24/7 support"],
  },
];

export default function Werkwijze() {
  return (
    <PageLayout>
      <Breadcrumbs />
      <SEOSchema
        pageType="werkwijze"
        pageTitle={metadata.title as string}
        pageDescription={metadata.description as string}
      />

      {/* Hero Section with Enhanced Visual Design */}
      <SectionLayout variant="hero">
        <div className="text-center mb-16">
          <h1 className={designSystem.typography.pageTitle}>
            Werkwijze — website laten maken: van intake tot launch
          </h1>
          <div className="h-6"></div> {/* 24px gap */}
          <p className={`${designSystem.typography.subtitle} max-w-prose mx-auto text-center`}>
            Een bewezen proces dat resultaat garandeert. Transparante
            communicatie, vaste prijzen en Nederlandse kwaliteit in elke fase.
          </p>
        </div>

        <div className="relative h-96 mb-12 mt-12">
          {/* Subtle ambient glow behind the composition */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none -z-10 portal-gradient opacity-60 blur-3xl"
          />
          <LCPOptimizedImage
            baseSrc="/assets/team_core_star"
            fallbackSrc="/assets/team_core_star.png"
            alt="Centrale ster die ons proces symboliseert"
            width={400}
            height={400}
            imageType="content"
            generateSrcSet={false}
            className="absolute inset-0 w-full h-full object-contain object-center mix-screen image-soft-glow mask-soft-edges no-pointer z-10 translate-y-[2%] md:translate-y-[1.5%]"
          />
          <div className="absolute inset-0 z-0 pointer-events-none">
            <ErrorBoundary>
              <DynamicOrbitSystem />
            </ErrorBoundary>
          </div>
        </div>

        {/* Enhanced Process Timeline */}
        <div className="space-y-8">
          <SectionTitle className="text-center mb-16">
            Ons Proces in Detail
          </SectionTitle>

          {/* Timeline Container */}
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-magenta-500 to-cyan-500 transform md:-translate-x-1/2 rounded-full"></div>

            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative flex items-center mb-16 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                {/* Timeline dot */}
                <div className="absolute left-8 md:left-1/2 w-6 h-6 bg-gradient-to-br from-cyan-500 to-magenta-500 rounded-full transform md:-translate-x-1/2 z-20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>

                {/* Step content card */}
                <div
                  className={`glass p-8 rounded-2xl ml-20 md:ml-0 md:w-5/12 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-500 group ${index % 2 === 0 ? "md:mr-auto md:text-right" : "md:ml-auto md:text-left"}`}
                >
                  {/* Step number and icon */}
                  <div
                    className={`flex items-center mb-6 ${index % 2 === 0 ? "md:justify-end" : "md:justify-start"}`}
                  >
                    <div className="text-4xl mr-4">{step.icon}</div>
                    <div>
                      <div className="text-3xl font-bold text-cyan-300">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="text-sm text-slate-400">
                        {step.duration}
                      </div>
                    </div>
                  </div>

                  {/* Step title and description */}
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors duration-300">
                    {step.name}
                  </h3>
                  <p className="text-lg text-cyan-300 mb-4">
                    {step.description}
                  </p>
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    {step.details}
                  </p>

                  {/* Deliverables */}
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3 opacity-80">
                      Deliverables:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {step.deliverables.map((deliverable, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-sm rounded-full border border-cyan-500/30"
                        >
                          {deliverable}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionLayout>

      {/* Enhanced Principles Section */}
      <SectionLayout variant="alternate">
        <div className="text-center mb-20">
          <SectionTitle className="mb-6">Onze Werkwijze Principes</SectionTitle>
          <BodyText className="max-w-2xl mx-auto text-xl text-slate-300">
            De fundamenten die elk project tot een succes maken
          </BodyText>
        </div>

        {/* Interactive Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Principle 1: Transparantie */}
          <div className="group relative">
            <div className="glass p-8 rounded-2xl hover:border-cyan-500/60 transition-all duration-500 h-full relative overflow-hidden">
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

              <div className="relative z-10">
                {/* Icon container */}
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="text-3xl">🔍</div>
                </div>

                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors duration-300 text-center">
                  Transparantie
                </h3>
                <p className="text-slate-300 leading-relaxed text-center mb-6">
                  Open communicatie tijdens het hele proces. Je weet altijd waar
                  we staan.
                </p>

                {/* Feature highlights */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-cyan-300">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                    Wekelijkse updates
                  </div>
                  <div className="flex items-center text-sm text-cyan-300">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                    Real-time voortgang
                  </div>
                  <div className="flex items-center text-sm text-cyan-300">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                    Vaste prijsafspraken
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Principle 2: Innovatie */}
          <div className="group relative">
            <div className="glass p-8 rounded-2xl hover:border-magenta-500/60 transition-all duration-500 h-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-magenta-500/5 via-transparent to-magenta-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-magenta-500/20 to-magenta-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="text-3xl">⚡</div>
                </div>

                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-magenta-400 transition-colors duration-300 text-center">
                  Innovatie
                </h3>
                <p className="text-slate-300 leading-relaxed text-center mb-6">
                  We gebruiken de nieuwste technologieën om je voorsprong te
                  geven.
                </p>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-magenta-400">
                    <div className="w-2 h-2 bg-magenta-400 rounded-full mr-3"></div>
                    Cutting-edge tech
                  </div>
                  <div className="flex items-center text-sm text-magenta-400">
                    <div className="w-2 h-2 bg-magenta-400 rounded-full mr-3"></div>
                    3D ervaringen
                  </div>
                  <div className="flex items-center text-sm text-magenta-400">
                    <div className="w-2 h-2 bg-magenta-400 rounded-full mr-3"></div>
                    AI integraties
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Principle 3: Kwaliteit */}
          <div className="group relative">
            <div className="glass p-8 rounded-2xl hover:border-cyan-500/60 transition-all duration-500 h-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="text-3xl">💎</div>
                </div>

                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors duration-300 text-center">
                  Kwaliteit
                </h3>
                <p className="text-slate-300 leading-relaxed text-center mb-6">
                  Geen compromissen. Elk detail wordt geperfectioneerd.
                </p>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-cyan-300">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                    Code reviews
                  </div>
                  <div className="flex items-center text-sm text-cyan-300">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                    Performance tests
                  </div>
                  <div className="flex items-center text-sm text-cyan-300">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                    Security audits
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Principle 4: Partnership */}
          <div className="group relative">
            <div className="glass p-8 rounded-2xl hover:border-magenta-500/60 transition-all duration-500 h-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-magenta-500/5 via-transparent to-magenta-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-magenta-500/20 to-magenta-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="text-3xl">🤝</div>
                </div>

                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-magenta-400 transition-colors duration-300 text-center">
                  Partnership
                </h3>
                <p className="text-slate-300 leading-relaxed text-center mb-6">
                  We zijn niet alleen leverancier, maar strategische partner in
                  jouw groei.
                </p>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-magenta-400">
                    <div className="w-2 h-2 bg-magenta-400 rounded-full mr-3"></div>
                    Strategisch advies
                  </div>
                  <div className="flex items-center text-sm text-magenta-400">
                    <div className="w-2 h-2 bg-magenta-400 rounded-full mr-3"></div>
                    Doorlopende support
                  </div>
                  <div className="flex items-center text-sm text-magenta-400">
                    <div className="w-2 h-2 bg-magenta-400 rounded-full mr-3"></div>
                    Groei coaching
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action section */}
        <div className="text-center mt-16">
          <div className="glass p-8 rounded-2xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Klaar voor een Professionele Samenwerking?
            </h3>
            <p className="text-slate-300 mb-8 text-lg">
              Ontdek hoe onze bewezen werkwijze uw digitale ambities
              werkelijkheid maakt.
            </p>
            <Button
              href="/contact"
              variant="primary"
              size="large"
              className="mr-4"
            >
              Start Uw Project
            </Button>
            <Button href="/diensten" variant="secondary" size="large">
              Bekijk Onze Diensten
            </Button>
          </div>
        </div>
      </SectionLayout>

      {/* Enhanced Content Section */}
      <SectionLayout variant="content" id="seo-content">
        <div className="max-w-5xl mx-auto">
          {/* Main content header */}
          <div className="text-center mb-16">
            <SectionTitle className="mb-8">
              Een Duidelijk Proces voor een Succesvolle Website
            </SectionTitle>
            <BodyText className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Ons bewezen stappenplan website bouwen garandeert resultaat,
              transparantie en een soepele samenwerking van start tot finish.
              Als betrouwbare webbouwer in Nederland hanteren wij een
              transparante werkwijze die zorgt voor voorspelbaar resultaat
              zonder verrassingen.
            </BodyText>
          </div>

          {/* Process Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="glass p-6 rounded-xl text-center group hover:border-cyan-500/50 transition-all duration-300">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Snelle Resultaten
              </h3>
              <p className="text-slate-300 text-sm">
                Efficiënte processen zorgen voor kortere doorlooptijden
              </p>
            </div>

            <div className="glass p-6 rounded-xl text-center group hover:border-magenta-500/50 transition-all duration-300">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Voorspelbare Kosten
              </h3>
              <p className="text-slate-300 text-sm">
                Transparante prijzen zonder verrassingen achteraf
              </p>
            </div>

            <div className="glass p-6 rounded-xl text-center group hover:border-cyan-500/50 transition-all duration-300">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Meetbare ROI
              </h3>
              <p className="text-slate-300 text-sm">
                Data-gedreven aanpak voor maximale business impact
              </p>
            </div>
          </div>

          {/* Detailed Process Steps */}
          <div className="mb-20">
            <SectionTitle className="text-center mb-12">
              De Fases van uw Project: Van Idee tot Groei
            </SectionTitle>

            <div className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Intake & Discovery",
                  description:
                    "Tijdens deze cruciale eerste fase duiken we diep in uw visie en doelstellingen, zodat we een website kunnen bouwen die perfect aansluit bij uw bedrijfsstrategie en doelgroep.",
                  color: "cyan",
                },
                {
                  step: "02",
                  title: "Strategie & Planning",
                  description:
                    "We ontwikkelen een data-gedreven plan voor maximale impact, waardoor uw investering in een nieuwe website direct bijdraagt aan uw bedrijfsdoelen en ROI.",
                  color: "magenta",
                },
                {
                  step: "03",
                  title: "Creatief Design",
                  description:
                    "Ons team creëert een visueel ontwerp dat uw merk versterkt en gebruikers overtuigt, resulterend in een professionele uitstraling die vertrouwen en conversie bevordert.",
                  color: "cyan",
                },
                {
                  step: "04",
                  title: "Development & Build",
                  description:
                    "We schrijven clean code en bouwen voor de toekomst, zodat uw website niet alleen vandaag perfect functioneert maar ook schaalbaar is voor toekomstige groei.",
                  color: "magenta",
                },
                {
                  step: "05",
                  title: "Testing & QA",
                  description:
                    "Door rigoureus testen garanderen we perfecte prestaties op alle apparaten en browsers, waardoor uw bezoekers altijd een optimale gebruikerservaring hebben.",
                  color: "cyan",
                },
                {
                  step: "06",
                  title: "Launch & Go-Live",
                  description:
                    "Onze soepele deployment en go-live begeleiding zorgen ervoor dat uw website probleemloos online gaat zonder downtime of technische problemen.",
                  color: "magenta",
                },
                {
                  step: "07",
                  title: "Growth & Optimization",
                  description:
                    "Continue optimalisatie en ondersteuning helpen uw website groeien met uw bedrijf, met regelmatige updates en prestatieverbeteringen.",
                  color: "cyan",
                },
              ].map((phase, index) => (
                <div
                  key={index}
                  id={`stap-${index + 1}`}
                  className={`glass p-8 rounded-xl hover:border-${phase.color}-500/50 transition-all duration-300 group`}
                >
                  <div className="flex items-start space-x-6">
                    <div
                      className={`flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-${phase.color}-500/20 to-${phase.color}-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <span
                        className={`text-2xl font-bold text-${phase.color}-300`}
                      >
                        {phase.step}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`text-xl font-bold text-white mb-3 group-hover:text-${phase.color}-300 transition-colors duration-300`}
                      >
                        {phase.title}
                      </h3>
                      <p className="text-slate-300 leading-relaxed">
                        {phase.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Our Process Works */}
          <div className="glass p-12 rounded-2xl mb-16">
            <SectionTitle className="text-center mb-8">
              Waarom Onze Werkwijze het Verschil Maakt
            </SectionTitle>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <BodyText className="text-lg leading-relaxed mb-6">
                  Onze gestructureerde aanpak betekent geen verrassingen: u
                  krijgt vooraf duidelijke tijdlijnen, transparante communicatie
                  in elke fase, en gegarandeerde kwaliteit door onze bewezen
                  methodiek.
                </BodyText>

                <BodyText className="text-lg leading-relaxed">
                  Dit stappenplan website bouwen heeft al tientallen Nederlandse
                  bedrijven geholpen hun online doelen te bereiken. Door deze
                  transparante werkwijze weet u precies wat u kunt verwachten en
                  wanneer.
                </BodyText>
              </div>

              <div className="space-y-4">
                <div className="flex items-center p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <div className="text-2xl mr-4">✓</div>
                  <span className="text-cyan-300 font-medium">
                    100% transparante communicatie
                  </span>
                </div>
                <div className="flex items-center p-4 rounded-lg bg-magenta-500/10 border border-magenta-500/20">
                  <div className="text-2xl mr-4">✓</div>
                  <span className="text-magenta-400 font-medium">
                    Vaste prijzen zonder bijkomende kosten
                  </span>
                </div>
                <div className="flex items-center p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <div className="text-2xl mr-4">✓</div>
                  <span className="text-cyan-300 font-medium">
                    Nederlandse kwaliteitsnormen
                  </span>
                </div>
                <div className="flex items-center p-4 rounded-lg bg-magenta-500/10 border border-magenta-500/20">
                  <div className="text-2xl mr-4">✓</div>
                  <span className="text-magenta-400 font-medium">
                    Doorlopende ondersteuning na launch
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="text-center">
            <div className="glass p-8 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-magenta-500/5 border border-cyan-500/20">
              <h3 className="text-2xl font-bold text-white mb-4">
                Start Vandaag Uw Digitale Transformatie
              </h3>
              <BodyText className="text-lg mb-8 max-w-2xl mx-auto">
                Ontdek hoe onze bewezen werkwijze uw visie omzet in een
                krachtige, resultaatgerichte website die uw bedrijf naar het
                volgende niveau brengt.
              </BodyText>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/contact" variant="primary" size="large">
                  Start uw project met ons bewezen proces
                </Button>
                <Button href="/diensten" variant="secondary" size="large">
                  Bekijk onze webdevelopment diensten
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <Button
                  href="/speeltuin"
                  variant="secondary"
                  className="inline-flex items-center"
                >
                  Bekijk voorbeelden van onze innovatieve 3D-technologie →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SectionLayout>

      {/* Enhanced FAQ Section */}
      <SectionLayout variant="alternate">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <SectionTitle className="mb-6">
              Veelgestelde Vragen over Onze Werkwijze
            </SectionTitle>
            <BodyText className="text-lg text-slate-300">
              Alles wat u wilt weten over ons transparante proces
            </BodyText>
          </div>

          <div className="space-y-6">
            {/* FAQ Item 1 */}
            <div className="glass p-8 rounded-xl group hover:border-cyan-500/50 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-cyan-300 transition-colors duration-300">
                Hoe lang duurt het proces van start tot launch?
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Een gemiddeld project doorloopt ons proces in 8-12 weken,
                afhankelijk van de complexiteit en omvang. Tijdens de intake
                maken we een gedetailleerde planning specifiek voor uw project,
                zodat u vanaf dag één weet wanneer uw website live gaat.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="glass p-8 rounded-xl group hover:border-magenta-500/50 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-magenta-400 transition-colors duration-300">
                Wat als ik tijdens het proces wijzigingen wil doorvoeren?
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Flexibiliteit is belangrijk. Kleinere aanpassingen worden direct
                doorgevoerd. Voor grotere wijzigingen bespreken we de impact op
                planning en budget transparant, zodat u altijd een weloverwogen
                keuze kunt maken.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="glass p-8 rounded-xl group hover:border-cyan-500/50 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-cyan-300 transition-colors duration-300">
                Hoe ziet de communicatie tijdens het project eruit?
              </h3>
              <p className="text-slate-300 leading-relaxed">
                U krijgt wekelijkse updates via e-mail en toegang tot ons
                projectportaal waar u real-time de voortgang kunt volgen.
                Daarnaast plannen we wekelijkse check-in gesprekken om alles
                door te spreken en eventuele vragen te beantwoorden.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="glass p-8 rounded-xl group hover:border-magenta-500/50 transition-all duration-300">
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-magenta-400 transition-colors duration-300">
                Wat gebeurt er na de launch van mijn website?
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Na de launch start onze groei-fase. We monitoren de performance,
                analyseren gebruikersdata en optimaliseren waar nodig. Daarnaast
                bieden we doorlopende technische ondersteuning en strategisch
                advies om uw online succes te maximaliseren.
              </p>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center space-x-4 glass p-6 rounded-xl">
              <div className="text-3xl">💬</div>
              <div className="text-left">
                <h4 className="text-lg font-semibold text-white">
                  Nog meer vragen?
                </h4>
                <p className="text-slate-300 text-sm">
                  We beantwoorden ze graag persoonlijk
                </p>
              </div>
              <Button href="/contact" variant="primary">
                Neem Contact Op
              </Button>
            </div>
          </div>
        </div>
      </SectionLayout>
    </PageLayout>
  );
}
