import type { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = 60 * 60 * 24;

import { ErrorBoundary } from "@/components/ErrorBoundary";
import SEOSchema from "@/components/SEOSchema";
import DynamicFlowingRibbons from "@/components/dynamic/DynamicFlowingRibbons";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/Button";
import {
  PageLayout,
  SectionLayout,
  PageTitle,
  SectionTitle,
  BodyText,
  GridLayout,
} from "@/components/unified/LayoutComponents";

// Get canonical URL from environment with fallback
const SITE_URL = (
  process.env.SITE_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://prowebstudio.nl"
).replace(/\/+$/, "");

export const metadata: Metadata = {
  title:
    "Over ProWeb Studio | Nederlandse webdesign specialisten | Betrouwbare partner",
  description:
    "Ontmoet het ProWeb Studio team. Nederlandse webdesign experts met transparante werkwijze en no-nonsense aanpak. Pragmatische oplossingen voor ondernemers die resultaat willen.",
  alternates: {
    canonical: "/over-ons",
    languages: {
      "nl-NL": "/over-ons",
      "x-default": "/over-ons",
    },
  },
  openGraph: {
    title:
      "Over ProWeb Studio | Nederlandse webdesign specialisten | Betrouwbare partner",
    description:
      "Ontmoet het ProWeb Studio team. Nederlandse webdesign experts met transparante werkwijze en no-nonsense aanpak. Pragmatische oplossingen voor ondernemers die resultaat willen.",
    url: `${SITE_URL}/over-ons`,
    type: "website",
    locale: "nl_NL",
  },
};

export default function OverOnsPage() {
  return (
    <PageLayout>
      <Breadcrumbs />
      <SEOSchema
        pageType="over-ons"
        pageTitle={metadata.title as string}
        pageDescription={metadata.description as string}
      />

      <SectionLayout variant="hero">
        <PageTitle>Architecten van de Digitale Toekomst</PageTitle>
        <BodyText className="max-w-3xl mx-auto text-center text-cyan-300">
          Wij zijn ProWeb Studio. We zijn een team van strategen, ontwerpers en
          ontwikkelaars met een gedeelde passie: het bouwen van buitengewone
          digitale ervaringen.
        </BodyText>
      </SectionLayout>

      <SectionLayout variant="content">
        <GridLayout variant="twoColumn">
          <div>
            <SectionTitle className="mb-6">
              Onze Filosofie: Voorbij het Traditionele
            </SectionTitle>
            <BodyText className="mb-6">
              Natuurlijk kunnen we een standaard website bouwen in een week.
              Maar onze passie ligt niet in het herhalen van wat al bestaat. Wij
              geloven in vooruitgang. In het verleggen van grenzen.
            </BodyText>
            <BodyText>
              Waarom vasthouden aan traditionele oplossingen als de technologie
              van morgen vandaag al binnen handbereik is? ProWeb Studio is
              opgericht om die toekomst te bouwen. Wij kiezen bewust voor de
              meest geavanceerde, performante en meeslepende technologieën, niet
              omdat het kan, maar omdat het uw merk de voorsprong geeft die het
              verdient.
            </BodyText>
          </div>
          <div className="h-[300px] sm:h-[350px] md:h-[400px] rounded-2xl overflow-hidden border border-cosmic-700/60 bg-cosmic-800/20 relative">
            <ErrorBoundary>
              <DynamicFlowingRibbons />
            </ErrorBoundary>
          </div>
        </GridLayout>
      </SectionLayout>

      <SectionLayout variant="alternate">
        <div className="text-center">
          <SectionTitle className="mb-6">Onze Missie</SectionTitle>
          <BodyText className="max-w-3xl mx-auto">
            Onze missie is het empoweren van Nederlandse bedrijven door het
            creëren van digitale ervaringen die niet alleen technisch superieur
            zijn, maar ook een diepe, blijvende indruk achterlaten. We
            transformeren complexe ideeën in intuïtieve, snelle en meeslepende
            websites die groei stimuleren.
          </BodyText>
        </div>
      </SectionLayout>

      <SectionLayout variant="content">
        <div className="text-center">
          <SectionTitle className="mb-6">
            Klaar om samen te bouwen?
          </SectionTitle>
          <BodyText className="mb-8 max-w-3xl mx-auto">
            Uw visie verdient de beste technologie en een team dat uw ambitie
            deelt. Laten we het gesprek starten.
          </BodyText>
          <Button href="/contact" variant="primary" size="large">
            Neem Contact Op
          </Button>
        </div>
      </SectionLayout>
    </PageLayout>
  );
}
