import type { Metadata } from 'next';

export const dynamic = 'force-static';
export const revalidate = 60 * 60 * 24;

import Link from 'next/link';

import Breadcrumbs from '@/components/Breadcrumbs';
import DynamicOrbitSystem from '@/components/dynamic/DynamicOrbitSystem';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import SEOSchema from '@/components/SEOSchema';
import { ResponsiveImage } from '@/components/ui/responsive-image';

// Get canonical URL from environment with fallback
const SITE_URL = (process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://prowebstudio.nl').replace(/\/+$/, '');

export const metadata: Metadata = {
  title: 'Website laten maken proces | Transparante werkwijze | ProWeb Studio Nederland',
  description:
    'Zo laten wij uw website maken: van intake tot launch in 5 stappen. Transparante communicatie, vaste prijzen, Nederlandse kwaliteit. Bekijk onze beproefde werkwijze.',
  alternates: {
    canonical: '/werkwijze',
    languages: { 
      'nl-NL': '/werkwijze',
      'x-default': '/werkwijze'
    },
  },
  openGraph: {
    title: 'Website laten maken proces | Transparante werkwijze | ProWeb Studio Nederland',
    description:
      'Zo laten wij uw website maken: van intake tot launch in 5 stappen. Transparante communicatie, vaste prijzen, Nederlandse kwaliteit. Bekijk onze beproefde werkwijze.',
    url: `${SITE_URL}/werkwijze`,
    type: 'website',
    locale: 'nl_NL',
  },
};

const steps = [
  {
    name: 'Intake',
    description: 'We duiken diep in jouw visie en doelstellingen',
  },
  { name: 'Strategie', description: 'Data-gedreven plan voor maximale impact' },
  { name: 'Design', description: 'Visueel ontwerp dat jouw merk versterkt' },
  { name: 'Development', description: 'Clean code, gebouwd voor de toekomst' },
  { name: 'QA', description: 'Rigoureus testen voor perfecte prestaties' },
  { name: 'Launch', description: 'Soepele deployment en go-live begeleiding' },
  { name: 'Groei', description: 'Continue optimalisatie en ondersteuning' },
];

export default function Werkwijze() {
  return (
    <main className="content-safe-top pt-20 md:pt-24">
      <Breadcrumbs />
      <SEOSchema
        pageType="werkwijze"
        pageTitle={metadata.title as string}
        pageDescription={metadata.description as string}
      />
      <section className="py-12 sm:py-section px-4 sm:px-6">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 glow-text">
              Werkwijze — website laten maken: van intake tot launch
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-cyan-300 max-w-2xl mx-auto">
              Een bewezen proces dat resultaat garandeert
            </p>
          </div>

          <div className="relative h-96 mb-12">
            {/* Subtle ambient glow behind the composition */}
            <div aria-hidden className="absolute inset-0 pointer-events-none -z-10 portal-gradient opacity-60 blur-3xl" />
            <ResponsiveImage
              src="/assets/team_core_star.png"
              alt="Centrale ster die ons proces symboliseert"
              fill
              priority
              quality={90}
              responsiveSizes="(max-width: 1024px) 100vw, 50vw"
              aspectRatio="1/1"
              className="object-contain object-center mix-screen image-soft-glow mask-soft-edges no-pointer z-10 translate-y-[2%] md:translate-y-[1.5%]"
            />
            <div className="absolute inset-0 z-0 pointer-events-none">
              <ErrorBoundary>
                <DynamicOrbitSystem />
              </ErrorBoundary>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className="glass p-6 rounded-lg hover:border-cyan-500/50 transition-all text-center flex flex-col h-full group hover:scale-105 duration-300"
              >
                {/* Number badge centered */}
                <div className="mb-4">
                  <span className="inline-block text-xl sm:text-2xl md:text-3xl font-bold text-cyan-300 bg-cyan-500/10 rounded-full w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                
                {/* Step name centered */}
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 group-hover:text-cyan-300 transition-colors duration-300 text-center">{step.name}</h3>
                
                {/* Description centered */}
                <p className="text-slate-200 text-center leading-relaxed flex-grow">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-section px-4 sm:px-6 bg-cosmic-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12">
            Onze Principes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="glass p-6 sm:p-7 md:p-8 rounded-lg text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-cyan-500/10 flex items-center justify-center text-3xl group-hover:bg-cyan-500/20 transition-colors duration-300">
                🔍
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-cyan-300">
                Transparantie
              </h3>
              <p className="text-slate-200 leading-relaxed">
                Open communicatie tijdens het hele proces. Je weet altijd waar
                we staan.
              </p>
            </div>
            <div className="glass p-6 sm:p-7 md:p-8 rounded-lg text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-magenta-500/10 flex items-center justify-center text-3xl group-hover:bg-magenta-500/20 transition-colors duration-300">
                💡
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-magenta-400">
                Innovatie
              </h3>
              <p className="text-slate-200 leading-relaxed">
                We gebruiken de nieuwste technologieën om je voorsprong te
                geven.
              </p>
            </div>
            <div className="glass p-6 sm:p-7 md:p-8 rounded-lg text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-cyan-500/10 flex items-center justify-center text-3xl group-hover:bg-cyan-500/20 transition-colors duration-300">
                ⭐
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-cyan-300">
                Kwaliteit
              </h3>
              <p className="text-slate-200 leading-relaxed">
                Geen compromissen. Elk detail wordt geperfectioneerd.
              </p>
            </div>
            <div className="glass p-6 sm:p-7 md:p-8 rounded-lg text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-magenta-500/10 flex items-center justify-center text-3xl group-hover:bg-magenta-500/20 transition-colors duration-300">
                🤝
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-magenta-400">
                Partnership
              </h3>
              <p className="text-slate-200 leading-relaxed">
                We zijn niet alleen leverancier, maar strategische partner in
                jouw groei.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="seo-content"
        className="py-section px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <article className="prose prose-invert max-w-none">
        <h1>Een Duidelijk Proces voor een Succesvolle Website</h1>
        <p>
          Ons bewezen stappenplan website bouwen garandeert resultaat,
          transparantie en een soepele samenwerking van start tot finish. Als
          betrouwbare webbouwer in Nederland hanteren wij een transparante
          werkwijze die zorgt voor voorspelbaar resultaat zonder verrassingen.
          Elk project doorloopt dezelfde zorgvuldige fasen, waardoor u altijd
          weet waar u aan toe bent tijdens het website laten maken proces.
        </p>

        <h2>De Fases van uw Project: Van Idee tot Groei</h2>
        <ul>
          <li id="stap-1">
            <strong>01. Intake:</strong> Tijdens deze cruciale eerste fase
            duiken we diep in uw visie en doelstellingen, zodat we een website
            kunnen bouwen die perfect aansluit bij uw bedrijfsstrategie en
            doelgroep.
          </li>
          <li id="stap-2">
            <strong>02. Strategie:</strong> We ontwikkelen een data-gedreven
            plan voor maximale impact, waardoor uw investering in een nieuwe
            website direct bijdraagt aan uw bedrijfsdoelen en ROI.
          </li>
          <li id="stap-3">
            <strong>03. Design:</strong> Ons team creëert een visueel ontwerp
            dat uw merk versterkt en gebruikers overtuigt, resulterend in een
            professionele uitstraling die vertrouwen en conversie bevordert.
          </li>
          <li id="stap-4">
            <strong>04. Development:</strong> We schrijven clean code en bouwen
            voor de toekomst, zodat uw website niet alleen vandaag perfect
            functioneert maar ook schaalbaar is voor toekomstige groei.
          </li>
          <li id="stap-5">
            <strong>05. QA:</strong> Door rigoureus testen garanderen we
            perfecte prestaties op alle apparaten en browsers, waardoor uw
            bezoekers altijd een optimale gebruikerservaring hebben.
          </li>
          <li id="stap-6">
            <strong>06. Launch:</strong> Onze soepele deployment en go-live
            begeleiding zorgen ervoor dat uw website probleemloos online gaat
            zonder downtime of technische problemen.
          </li>
          <li id="stap-7">
            <strong>07. Groei:</strong> Continue optimalisatie en ondersteuning
            helpen uw website groeien met uw bedrijf, met regelmatige updates en
            prestatieverbeteringen.
          </li>
        </ul>

        <h2>Waarom Onze Werkwijze het Verschil Maakt</h2>
        <p>
          Onze gestructureerde aanpak betekent geen verrassingen: u krijgt
          vooraf duidelijke tijdlijnen, transparante communicatie in elke fase,
          en gegarandeerde kwaliteit door onze bewezen methodiek. Dit
          stappenplan website bouwen heeft al tientallen Nederlandse bedrijven
          geholpen hun online doelen te bereiken. Door deze transparante
          werkwijze weet u precies wat u kunt verwachten en wanneer, waardoor
          het website laten maken proces een stressloze en voorspelbare ervaring
          wordt die altijd tot een succesvol eindresultaat leidt.
        </p>
        <p>
          Ontdek meer over{' '}
          <Link href="/diensten" className="text-cyan-300 hover:text-cyan-300">
            onze webdevelopment diensten
          </Link>{' '}
          of bekijk{' '}
          <Link href="/speeltuin" className="text-cyan-300 hover:text-cyan-300">
            voorbeelden van onze innovatieve 3D-technologie
          </Link>{' '}
          om te zien hoe wij uw visie tot leven brengen.
        </p>
        <div className="text-center mt-8">
          <Link href="/contact" className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-lg font-semibold hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/25">
            Start uw project met ons bewezen proces
          </Link>
        </div>
          </article>
        </div>
      </section>
    </main>
  );
}
