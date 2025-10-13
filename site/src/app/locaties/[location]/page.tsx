import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import dynamicImport from "next/dynamic";
import {
  getCityBySlug,
  getNearbyLocations,
  generateStaticParams as generateCityStaticParams,
} from "@/data/cities";
import { getServicesForCity } from "@/config/enhanced-services.config";
import { Button } from "@/components/Button";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedServices from "@/components/RelatedServices";
import ContentSuggestions from "@/components/ContentSuggestions";
import { CustomContentHero } from "@/components/unified/HeroSection";
import {
  generateMetadata as generateEnhancedMetadata,
  type LocationKey,
} from "@/lib/metadata";

// Dynamic import for 3D background - matches homepage
const HeroCanvas = dynamicImport(() => import("@/components/HeroCanvas"), {
  ssr: false,
  loading: () => null,
});

const HeroScene = dynamicImport(() => import("@/three/HeroScene"), {
  ssr: false,
  loading: () => null,
});

export const dynamic = "force-static";
export const revalidate = 60 * 60 * 24;

const SITE_URL = (
  process.env.SITE_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://prowebstudio.nl"
).replace(/\/+$/, "");

interface LocationPageProps {
  params: {
    location: string;
  };
}

// Generate static params for all locations
export async function generateStaticParams() {
  return generateCityStaticParams();
}

// Generate metadata for each location using enhanced metadata system
export async function generateMetadata({
  params,
}: LocationPageProps): Promise<Metadata> {
  const location = getCityBySlug(params.location);

  if (!location) {
    return {
      title: "Locatie niet gevonden | ProWeb Studio",
      description: "De opgevraagde locatie is niet gevonden.",
    };
  }

  const locationKey = params.location as LocationKey;

  return generateEnhancedMetadata(`/locaties/${params.location}`, {
    location: locationKey,
    pageType: "location",
    lastModified: new Date().toISOString(),
    image: {
      url: `/og-location-${params.location}.png`,
      alt: `Website laten maken ${location.name} - ProWeb Studio`,
      width: 1200,
      height: 630,
    },
  });
}

export default function LocationPage({ params }: LocationPageProps) {
  const location = getCityBySlug(params.location);

  if (!location) {
    notFound();
  }

  const nearbyLocations = getNearbyLocations(location.slug);
  const locationServices = getServicesForCity();

  // Location-specific schema - Online business serving the city
  const locationSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/locaties/${location.slug}#service`,
    name: `ProWeb Studio - Website Services ${location.name}`,
    description: location.description,
    url: `${SITE_URL}/locaties/${location.slug}`,
    serviceType: location.relatedServices.map((service: string) =>
      service.replace(/-/g, " ").replace(/^\w/, (c: string) => c.toUpperCase()),
    ),
    provider: {
      "@type": "Organization",
      name: "ProWeb Studio",
      url: SITE_URL,
      telephone: "+31686412430",
      email: "contact@prowebstudio.nl",
    },
    areaServed: {
      "@type": "City",
      name: location.name,
      containedInPlace: {
        "@type": "State",
        name: location.region,
        containedInPlace: {
          "@type": "Country",
          name: "Netherlands",
        },
      },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `Webdesign Diensten ${location.name}`,
      itemListElement: locationServices.map((service, index) => ({
        "@type": "OfferCatalogItem",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.description,
          areaServed: {
            "@type": "City",
            name: location.name,
          },
        },
      })),
    },
    parentOrganization: {
      "@id": `${SITE_URL}#organization`,
    },
  };

  return (
    <main className="relative content-safe-top pt-20 md:pt-24 overflow-hidden">
      <Breadcrumbs />

      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(locationSchema),
        }}
      />

      {/* HERO SECTION - Matches homepage design */}
      <CustomContentHero
        title={`Website Laten Maken ${location.name}`}
        backgroundContent={
          <HeroCanvas>
            <HeroScene />
          </HeroCanvas>
        }
        className="homepage-hero motion-safe:animate-fade-in"
      >
        {/* Location badge */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-2xl">🏛️</span>
          <span className="text-cyan-300 font-medium">{location.region}</span>
        </div>

        {/* Location-specific description */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-100 max-w-prose mx-auto text-center leading-relaxed motion-safe:animate-slide-up">
          {location.description} Wij transformeren uw digitale visie tot
          werkelijkheid met razendsnelle, interactieve websites die uw merk in{" "}
          {location.name} tot leven brengen.
        </p>

        {/* Location stats */}
        {location.population && (
          <div className="flex items-center justify-center gap-6 text-slate-300 flex-wrap">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
              {location.population.toLocaleString("nl-NL")} inwoners
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              {locationServices.length} beschikbare diensten
            </span>
          </div>
        )}

        {/* CTA buttons with unified gap */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button href="/contact" variant="primary" size="large">
            Start Uw Project in {location.name}
          </Button>
          <Button href="/portfolio" variant="secondary" size="large">
            Bekijk Portfolio →
          </Button>
        </div>

        {/* Promotional Banner - Same style as homepage */}
        <div className="motion-safe:animate-fade-in-delayed">
          <div className="relative mx-auto max-w-md">
            {/* Animated glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-magenta-500 to-cyan-500 rounded-lg blur opacity-75 animate-pulse"></div>

            {/* Main promotional banner */}
            <div className="relative bg-gradient-to-r from-cyan-500/20 to-magenta-500/20 backdrop-blur-sm border border-cyan-300/30 rounded-lg px-6 py-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-yellow-400 text-sm font-bold">
                  🎉 LOKALE ACTIE {location.name.toUpperCase()}
                </span>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-bounce">
                  HOT
                </span>
              </div>

              <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-magenta-300 mb-1">
                30% KORTING
              </div>

              <p className="text-sm text-cyan-200 font-medium mb-2">
                Op alle website projecten in {location.name}
              </p>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Lokale service
                </span>
                <span className="text-slate-400">•</span>
                <span className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3 text-cyan-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Transparante prijzen
                </span>
              </div>
            </div>
          </div>
        </div>
      </CustomContentHero>

      {/* Online-First Approach Section */}
      <section
        aria-label="Our Approach"
        className="py-section px-4 sm:px-6 bg-cosmic-900/20"
      >
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-16 text-center leading-tight">
              Waarom Kiezen Bedrijven in {location.name} voor ProWeb Studio?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 flex items-center justify-center text-3xl">
                  💻
                </div>
                <h3 className="text-xl font-bold mb-4 text-cyan-300">
                  100% Online Samenwerking
                </h3>
                <p className="text-slate-400">
                  We begrijpen de unieke karakteristieken van {location.name}{" "}
                  als {location.characteristics?.[0]}
                  en combineren dit met onze landelijke ervaring in webdesign.
                  Van lokale SEO tot branche-specifieke oplossingen.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 flex items-center justify-center text-3xl">
                  🎯
                </div>
                <h3 className="text-xl font-bold mb-4 text-cyan-300">
                  Lokale SEO Expertise
                </h3>
                <p className="text-slate-400">
                  Lokale SEO-optimalisatie specifiek voor {location.name} en{" "}
                  {location.region}. Wij zorgen ervoor dat uw website goed
                  vindbaar is voor klanten in de regio, van{" "}
                  {location.localTerms?.[0]} tot de hele provincie.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 flex items-center justify-center text-3xl">
                  🤝
                </div>
                <h3 className="text-xl font-bold mb-4 text-cyan-300">
                  Persoonlijke Videocall Support
                </h3>
                <p className="text-slate-400">
                  Directe communicatie en persoonlijke aandacht voor uw project
                  in {location.name}. We zijn altijd bereikbaar voor vragen,
                  aanpassingen en ondersteuning bij uw digitale groei.
                </p>
              </div>
            </div>

            <div className="mt-16 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-cyan-500/10 to-magenta-500/10 border border-cyan-300/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-4 text-center">
                  Bewezen Resultaten in {location.name}
                </h3>
                <p className="text-slate-400 text-center mb-6">
                  Tevreden klanten door heel Nederland, waaronder succesvolle
                  projecten voor bedrijven in{" "}
                  {location.keyIndustries.join(", ")}
                  in en rond {location.name}. Van startups tot enterprise.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button href="/portfolio" variant="secondary" size="normal">
                    Bekijk Onze Case Studies
                  </Button>
                  <Button href="/contact" variant="primary" size="normal">
                    Start Gratis Videocall
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Available Services Section */}
      <section aria-label="Services" className="py-section px-4 sm:px-6 glass">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center leading-tight">
              Alle Webdesign Diensten Beschikbaar in {location.name}
            </h2>
            <p className="text-slate-400 text-center max-w-3xl mx-auto">
              Onze complete dienstverlening is volledig online beschikbaar voor
              bedrijven in {location.name} en {location.region}. Van eenvoudige
              websites tot complexe e-commerce platformen - alles ontwikkeld met
              persoonlijke begeleiding via videocalls.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-stretch">
            {locationServices.map((service) => (
              <article
                key={service.href}
                className="rounded-2xl border border-cosmic-700/60 bg-cosmic-800/40 p-6 sm:p-7 md:p-8 hover:bg-cosmic-800/60 transition-all duration-300 hover:border-cosmic-600/80 hover:shadow-2xl hover:shadow-cyan-500/10 group relative overflow-hidden flex flex-col h-full"
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-magenta-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative z-10 flex flex-col h-full">
                  {/* Service icon with emoji representation */}
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 flex items-center justify-center text-2xl">
                    {service.title.includes("Website")
                      ? "🌐"
                      : service.title.includes("Webshop")
                        ? "🛒"
                        : service.title.includes("SEO")
                          ? "🎯"
                          : "✨"}
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 group-hover:text-cyan-300 transition-colors duration-300 leading-tight text-center">
                    {service.title}
                  </h3>

                  <p className="text-slate-200 leading-relaxed text-sm mb-4 flex-grow text-center">
                    {service.description}
                  </p>

                  <div className="text-center mt-auto">
                    <Link
                      href={service.href}
                      className="inline-flex items-center text-cyan-300 hover:text-cyan-300 transition-colors duration-200 text-sm font-medium"
                    >
                      Meer informatie over {service.title.toLowerCase()}
                      <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {locationServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-6">
                Alle onze diensten zijn beschikbaar in {location.name}.
              </p>
              <Link
                href="/diensten"
                className="inline-flex items-center px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-cosmic-900 font-semibold rounded-lg transition-colors duration-200"
              >
                Bekijk Alle Diensten
                <span className="ml-2">→</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Nearby Locations - Enhanced styling */}
      {nearbyLocations.length > 0 && (
        <section
          aria-label="Nearby Locations"
          className="py-section px-4 sm:px-6 bg-cosmic-900/30"
        >
          <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center leading-tight">
                Ook Actief in {location.region}
              </h2>
              <p className="text-slate-400 text-center max-w-3xl mx-auto">
                Naast {location.name} bedienen wij ook graag andere steden in de
                regio. Overal dezelfde kwaliteit, overal dezelfde persoonlijke
                service.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-stretch">
              {nearbyLocations.map((nearbyLocation) => (
                <Link
                  key={nearbyLocation.slug}
                  href={`/locaties/${nearbyLocation.slug}`}
                  className="rounded-2xl border border-cosmic-700/60 bg-cosmic-800/40 p-6 sm:p-7 md:p-8 hover:bg-cosmic-800/60 transition-all duration-300 hover:border-cosmic-600/80 hover:shadow-2xl hover:shadow-cyan-500/10 group relative overflow-hidden flex flex-col h-full"
                >
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-magenta-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10 flex flex-col h-full">
                    {/* Location icon */}
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 flex items-center justify-center text-2xl">
                      🏘️
                    </div>

                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 group-hover:text-cyan-300 transition-colors duration-300 leading-tight text-center">
                      {nearbyLocation.name}
                    </h3>

                    <p className="text-slate-200 leading-relaxed text-sm mb-4 flex-grow text-center">
                      {nearbyLocation.description}
                    </p>

                    <div className="text-center mt-auto">
                      <span className="inline-flex items-center text-cyan-300 hover:text-cyan-300 transition-colors duration-200 text-sm font-medium">
                        Bekijk diensten in {nearbyLocation.name}
                        <span className="ml-1 group-hover:translate-x-1 transition-transform duration-200">
                          →
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process section - matches homepage styling */}
      <section aria-label="Process" className="py-section px-4 sm:px-6">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-16 text-center leading-tight">
            Waarom Kiezen Bedrijven in {location.name} voor ProWeb Studio?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/25">
                🏛️
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                Lokale Kennis
              </h3>
              <p className="text-slate-400">
                We begrijpen de unieke karakteristieken van {location.name} als{" "}
                {location.characteristics?.[0] || "belangrijke stad"}
                en combineren dit met onze landelijke ervaring in webdesign. Van
                lokale SEO tot branche-specifieke oplossingen.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/25">
                🎯
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                SEO & Vindbaarheid
              </h3>
              <p className="text-slate-400">
                Lokale SEO-optimalisatie specifiek voor {location.name} en{" "}
                {location.region}. Wij zorgen ervoor dat uw website goed
                vindbaar is voor klanten in de regio, van{" "}
                {location.localTerms?.[0] || location.name} tot de hele
                provincie.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/25">
                🚀
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                Persoonlijke Service
              </h3>
              <p className="text-slate-400">
                Directe communicatie en persoonlijke aandacht voor uw project in{" "}
                {location.name}. We zijn altijd bereikbaar voor vragen,
                aanpassingen en ondersteuning bij uw digitale groei.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-magenta-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/25">
                📈
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                Bewezen Resultaten
              </h3>
              <p className="text-slate-400">
                Tevreden klanten door heel Nederland, waaronder succesvolle
                projecten voor bedrijven in {location.keyIndustries.join(", ")}{" "}
                in en rond {location.name}. Van startups tot enterprise.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedServices showAll={true} maxItems={6} />

      <ContentSuggestions
        customSuggestions={[
          {
            title: "Plan Een Gesprek",
            href: "/contact",
            description: `Bespreek uw website project voor ${location.name}`,
          },
          {
            title: "Bekijk Onze Werkwijze",
            href: "/werkwijze",
            description: "Ontdek hoe wij samen tot het beste resultaat komen",
          },
          {
            title: "Portfolio Inzien",
            href: "/portfolio",
            description: "Zie voorbeelden van onze professionele websites",
          },
        ]}
      />
    </main>
  );
}
