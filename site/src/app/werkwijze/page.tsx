import type { Metadata } from 'next';

export const dynamic = 'force-static';
export const revalidate = 60 * 60 * 24;

import { ResponsiveImage } from '@/components/ui/responsive-image';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import SEOSchema from '@/components/SEOSchema';
import DynamicOrbitSystem from '@/components/dynamic/DynamicOrbitSystem';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Button } from '@/components/Button';
import { 
  PageLayout, 
  SectionLayout, 
  PageTitle, 
  SectionTitle,
  BodyText,
  GridLayout,
  FeatureCard
} from '@/components/unified/LayoutComponents';

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
    <PageLayout>
      <Breadcrumbs />
      <SEOSchema
        pageType="werkwijze"
        pageTitle={metadata.title as string}
        pageDescription={metadata.description as string}
      />
      
      <SectionLayout variant="hero">
        <PageTitle>
          Werkwijze — website laten maken: van intake tot launch
        </PageTitle>
        <BodyText className="max-w-2xl mx-auto text-center text-cyan-300">
          Een bewezen proces dat resultaat garandeert
        </BodyText>

        <div className="relative h-96 mb-12 mt-12">
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

        <GridLayout variant="threeColumn">
          {steps.map((step, i) => (
            <div
              key={i}
              className="glass p-6 rounded-lg hover:border-cyan-500/50 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <span className="text-2xl md:text-3xl font-bold text-cyan-300 mr-3">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <SectionTitle as="h3" className="mb-0">{step.name}</SectionTitle>
              </div>
              <BodyText variant="secondary">{step.description}</BodyText>
            </div>
          ))}
        </GridLayout>
      </SectionLayout>

      <SectionLayout variant="alternate">
        <div className="text-center mb-12">
          <SectionTitle>Onze Principes</SectionTitle>
        </div>
        <GridLayout variant="twoColumn">
          <FeatureCard
            title="Transparantie"
            description="Open communicatie tijdens het hele proces. Je weet altijd waar we staan."
            className="text-cyan-300"
          />
          <FeatureCard
            title="Innovatie"
            description="We gebruiken de nieuwste technologieën om je voorsprong te geven."
            className="text-magenta-400"
          />
          <FeatureCard
            title="Kwaliteit"
            description="Geen compromissen. Elk detail wordt geperfectioneerd."
            className="text-cyan-300"
          />
          <FeatureCard
            title="Partnership"
            description="We zijn niet alleen leverancier, maar strategische partner in jouw groei."
            className="text-magenta-400"
          />
        </GridLayout>
      </SectionLayout>

      <SectionLayout variant="content" id="seo-content">
        <div className="prose prose-invert max-w-none">
          <SectionTitle as="h1">Een Duidelijk Proces voor een Succesvolle Website</SectionTitle>
          <BodyText>
            Ons bewezen stappenplan website bouwen garandeert resultaat,
            transparantie en een soepele samenwerking van start tot finish. Als
            betrouwbare webbouwer in Nederland hanteren wij een transparante
            werkwijze die zorgt voor voorspelbaar resultaat zonder verrassingen.
            Elk project doorloopt dezelfde zorgvuldige fasen, waardoor u altijd
            weet waar u aan toe bent tijdens het website laten maken proces.
          </BodyText>

          <SectionTitle>De Fases van uw Project: Van Idee tot Groei</SectionTitle>
          <ul className="space-y-4">
            <li id="stap-1" className="text-slate-200 leading-relaxed">
              <strong className="text-cyan-300">01. Intake:</strong> Tijdens deze cruciale eerste fase
              duiken we diep in uw visie en doelstellingen, zodat we een website
              kunnen bouwen die perfect aansluit bij uw bedrijfsstrategie en
              doelgroep.
            </li>
            <li id="stap-2" className="text-slate-200 leading-relaxed">
              <strong className="text-cyan-300">02. Strategie:</strong> We ontwikkelen een data-gedreven
              plan voor maximale impact, waardoor uw investering in een nieuwe
              website direct bijdraagt aan uw bedrijfsdoelen en ROI.
            </li>
            <li id="stap-3" className="text-slate-200 leading-relaxed">
              <strong className="text-cyan-300">03. Design:</strong> Ons team creëert een visueel ontwerp
              dat uw merk versterkt en gebruikers overtuigt, resulterend in een
              professionele uitstraling die vertrouwen en conversie bevordert.
            </li>
            <li id="stap-4" className="text-slate-200 leading-relaxed">
              <strong className="text-cyan-300">04. Development:</strong> We schrijven clean code en bouwen
              voor de toekomst, zodat uw website niet alleen vandaag perfect
              functioneert maar ook schaalbaar is voor toekomstige groei.
            </li>
            <li id="stap-5" className="text-slate-200 leading-relaxed">
              <strong className="text-cyan-300">05. QA:</strong> Door rigoureus testen garanderen we
              perfecte prestaties op alle apparaten en browsers, waardoor uw
              bezoekers altijd een optimale gebruikerservaring hebben.
            </li>
            <li id="stap-6" className="text-slate-200 leading-relaxed">
              <strong className="text-cyan-300">06. Launch:</strong> Onze soepele deployment en go-live
              begeleiding zorgen ervoor dat uw website probleemloos online gaat
              zonder downtime of technische problemen.
            </li>
            <li id="stap-7" className="text-slate-200 leading-relaxed">
              <strong className="text-cyan-300">07. Groei:</strong> Continue optimalisatie en ondersteuning
              helpen uw website groeien met uw bedrijf, met regelmatige updates en
              prestatieverbeteringen.
            </li>
          </ul>

          <SectionTitle>Waarom Onze Werkwijze het Verschil Maakt</SectionTitle>
          <BodyText>
            Onze gestructureerde aanpak betekent geen verrassingen: u krijgt
            vooraf duidelijke tijdlijnen, transparante communicatie in elke fase,
            en gegarandeerde kwaliteit door onze bewezen methodiek. Dit
            stappenplan website bouwen heeft al tientallen Nederlandse bedrijven
            geholpen hun online doelen te bereiken. Door deze transparante
            werkwijze weet u precies wat u kunt verwachten en wanneer, waardoor
            het website laten maken proces een stressloze en voorspelbare ervaring
            wordt die altijd tot een succesvol eindresultaat leidt.
          </BodyText>
          <BodyText>
            Ontdek meer over{' '}
            <Button href="/diensten" variant="secondary" className="inline-flex">
              onze webdevelopment diensten
            </Button>{' '}
            of bekijk{' '}
            <Button href="/speeltuin" variant="secondary" className="inline-flex">
              voorbeelden van onze innovatieve 3D-technologie
            </Button>{' '}
            om te zien hoe wij uw visie tot leven brengen.
          </BodyText>
          <div className="mt-8">
            <Button href="/contact" variant="primary" size="large">
              Start uw project met ons bewezen proces
            </Button>
          </div>
        </div>
      </SectionLayout>
    </PageLayout>
  );
}
