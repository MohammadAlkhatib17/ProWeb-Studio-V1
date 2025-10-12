import React from "react";
import { SemanticSection, DutchContentWrapper } from "../layout/SemanticLayout";

interface DutchKeywordIntegrationProps {
  content: string;
  targetKeywords: string[];
  keywordDensity?: number; // Target density between 1-2%
  cityName?: string;
  serviceName?: string;
}

// Function to calculate keyword density
function calculateKeywordDensity(text: string, keywords: string[]): number {
  const words = text.toLowerCase().split(/\s+/).length;
  let keywordCount = 0;

  keywords.forEach((keyword) => {
    let searchText = text.toLowerCase();
    let matches = 0;

    while (searchText.includes(keyword.toLowerCase())) {
      matches++;
      const index = searchText.indexOf(keyword.toLowerCase());
      searchText = searchText.substring(index + keyword.length);
    }

    keywordCount += matches;
  });

  return (keywordCount / words) * 100;
}

// Intelligently integrate keywords into content with natural flow
function integrateKeywordsNaturally(
  content: string,
  keywords: string[],
  targetDensity: number = 1.5,
  cityName?: string,
): string {
  let enhancedContent = content;
  const currentDensity = calculateKeywordDensity(content, keywords);

  // If density is too low, add natural keyword variations
  if (currentDensity < targetDensity) {
    // Add location-specific variations
    if (cityName) {
      keywords.forEach((keyword) => {
        const variations = [
          `${keyword} in ${cityName}`,
          `${cityName} ${keyword}`,
          `lokale ${keyword} ${cityName}`,
          `professionele ${keyword} ${cityName}`,
        ];

        // Replace some generic terms with location-specific ones
        variations.forEach((variation) => {
          if (Math.random() > 0.7) {
            // 30% chance to replace
            enhancedContent = enhancedContent.replace(
              new RegExp(`\\b${keyword}\\b`, "gi"),
              variation,
            );
          }
        });
      });
    }
  }

  return enhancedContent;
}

export function DutchKeywordOptimizedContent({
  content,
  targetKeywords,
  keywordDensity = 1.5,
  cityName,
  serviceName,
  ...props
}: DutchKeywordIntegrationProps & React.HTMLAttributes<HTMLDivElement>) {
  const optimizedContent = integrateKeywordsNaturally(
    content,
    targetKeywords,
    keywordDensity,
    cityName,
  );

  const actualDensity = calculateKeywordDensity(
    optimizedContent,
    targetKeywords,
  );

  return (
    <DutchContentWrapper
      cityName={cityName}
      serviceName={serviceName}
      {...props}
    >
      <div
        className="dutch-keyword-optimized"
        data-keyword-density={actualDensity.toFixed(2)}
        data-target-keywords={targetKeywords.join(",")}
        dangerouslySetInnerHTML={{ __html: optimizedContent }}
      />

      {/* Hidden keyword context for search engines */}
      <div className="sr-only" aria-hidden="true">
        <p>
          {targetKeywords
            .map((keyword) =>
              cityName
                ? `${keyword} ${cityName}, ${keyword} in ${cityName}, lokale ${keyword} ${cityName}`
                : `${keyword}, professionele ${keyword}, Nederlandse ${keyword}`,
            )
            .join(", ")}
        </p>
      </div>
    </DutchContentWrapper>
  );
}

// Business terminology integration component
export function DutchBusinessTerminology({
  children,
  industryFocus,
  cityName,
  className = "",
}: {
  children: React.ReactNode;
  industryFocus?: string[];
  cityName?: string;
  className?: string;
}) {
  const businessTerms = [
    "MKB ondernemer",
    "Nederlandse bedrijven",
    "lokale ondernemers",
    "ZZP-ers",
    "startup bedrijven",
    "corporate organisaties",
    "familiebedrijven",
    "digitale transformatie",
    "online aanwezigheid",
    "concurrentie voordeel",
    "klantenervaring",
    "conversie optimalisatie",
    "gebruiksvriendelijkheid",
    "toegankelijkheid",
    "WCAG compliant",
    "privacy wetgeving",
    "AVG compliance",
    "Nederlandse hosting",
    "domeinregistratie",
    "SSL certificaten",
    "veilige betalingen",
    "iDEAL integratie",
    "Bancontact ondersteuning",
    "KvK registratie",
    "BTW behandeling",
    "Nederlandse facturatie",
  ];

  // Industry-specific terms are available but not currently used in rendering
  // This could be extended for future industry-specific content generation

  return (
    <div
      className={`dutch-business-terminology ${className}`}
      data-business-terms={businessTerms.slice(0, 10).join(",")}
      data-industry-focus={industryFocus?.join(",")}
      data-city-context={cityName}
    >
      {children}

      {/* SEO context for business terminology */}
      <div className="sr-only" aria-hidden="true">
        <div itemScope itemType="https://schema.org/Organization">
          <span itemProp="description">
            ProWeb Studio - {businessTerms.slice(0, 5).join(", ")}
            {cityName && ` in ${cityName}`}
            {industryFocus && ` voor ${industryFocus.join(", ")}`}
          </span>
        </div>
      </div>
    </div>
  );
}

// Natural keyword integration for headings
export function KeywordOptimizedHeading({
  level,
  children,
  primaryKeyword,
  secondaryKeywords = [],
  cityName,
  className = "",
  id,
}: {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  primaryKeyword: string;
  secondaryKeywords?: string[];
  cityName?: string;
  className?: string;
  id?: string;
}) {
  // Create natural keyword variations
  const keywordVariations = [
    primaryKeyword,
    cityName ? `${primaryKeyword} ${cityName}` : null,
    cityName ? `${primaryKeyword} in ${cityName}` : null,
    `professionele ${primaryKeyword}`,
    `Nederlandse ${primaryKeyword}`,
    ...secondaryKeywords,
  ].filter(Boolean) as string[];

  const props = {
    className: `keyword-optimized-heading ${className}`,
    "data-primary-keyword": primaryKeyword,
    "data-location": cityName,
    "data-keyword-variations": keywordVariations.join(","),
    ...(id && { id }),
  };

  switch (level) {
    case 1:
      return <h1 {...props}>{children}</h1>;
    case 2:
      return <h2 {...props}>{children}</h2>;
    case 3:
      return <h3 {...props}>{children}</h3>;
    case 4:
      return <h4 {...props}>{children}</h4>;
    case 5:
      return <h5 {...props}>{children}</h5>;
    case 6:
      return <h6 {...props}>{children}</h6>;
    default:
      return <h1 {...props}>{children}</h1>;
  }
}

// Content cluster component for related topics
export function ContentCluster({
  mainTopic,
  supportingTopics,
  children,
  className = "",
}: {
  mainTopic: string;
  supportingTopics: string[];
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <SemanticSection
      as="article"
      className={`content-cluster ${className}`}
      data-main-topic={mainTopic}
      data-supporting-topics={supportingTopics.join(",")}
      aria-label={`Content cluster over ${mainTopic}`}
    >
      <div className="cluster-content">{children}</div>

      {/* Related topics for internal linking context */}
      <aside className="sr-only" aria-hidden="true">
        <nav aria-label="Gerelateerde onderwerpen">
          <h3>Gerelateerde onderwerpen:</h3>
          <ul>
            {supportingTopics.map((topic, index) => (
              <li key={index}>{topic}</li>
            ))}
          </ul>
        </nav>
      </aside>
    </SemanticSection>
  );
}

// Component for natural keyword density monitoring
export function KeywordDensityOptimizer({
  content,
  targetKeywords,
  optimalDensity = 1.5,
  maxDensity = 2.0,
  children,
}: {
  content: string;
  targetKeywords: string[];
  optimalDensity?: number;
  maxDensity?: number;
  children: React.ReactNode;
}) {
  const currentDensity = calculateKeywordDensity(content, targetKeywords);
  const densityStatus =
    currentDensity < optimalDensity
      ? "low"
      : currentDensity > maxDensity
        ? "high"
        : "optimal";

  return (
    <div
      className="keyword-density-optimized"
      data-current-density={currentDensity.toFixed(2)}
      data-optimal-density={optimalDensity}
      data-density-status={densityStatus}
      data-target-keywords={targetKeywords.join(",")}
    >
      {children}

      {/* Development helper - remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs z-50">
          <div>Keyword Density: {currentDensity.toFixed(2)}%</div>
          <div>Status: {densityStatus}</div>
          <div>Target: {optimalDensity}%</div>
        </div>
      )}
    </div>
  );
}
