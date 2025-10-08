import React from 'react';

export interface SemanticSectionProps {
  children: React.ReactNode;
  as?: 'article' | 'section' | 'aside' | 'main' | 'header' | 'footer' | 'nav';
  className?: string;
  id?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  role?: string;
}

export function SemanticSection({ 
  children, 
  as: Component = 'section', 
  className = '', 
  id,
  ...ariaProps 
}: SemanticSectionProps) {
  return (
    <Component 
      id={id}
      className={className}
      {...ariaProps}
    >
      {children}
    </Component>
  );
}

export interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  id?: string;
  keywords?: string[];
}

export function SemanticHeading({ 
  level, 
  children, 
  className = '', 
  id,
  keywords = [] 
}: HeadingProps) {
  // Add keyword-rich class names for SEO context
  const keywordClasses = keywords.length > 0 
    ? keywords.map(k => `keyword-${k.replace(/\s+/g, '-').toLowerCase()}`).join(' ')
    : '';
  
  const props = {
    className: `${className} ${keywordClasses}`.trim(),
    ...(id && { id })
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

export interface DutchContentWrapperProps {
  children: React.ReactNode;
  cityName?: string;
  serviceName?: string;
  className?: string;
  includeLocalSchema?: boolean;
}

export function DutchContentWrapper({ 
  children, 
  cityName, 
  serviceName,
  className = '',
  includeLocalSchema = false 
}: DutchContentWrapperProps) {
  const contextClasses = [
    cityName && `location-${cityName.toLowerCase().replace(/\s+/g, '-')}`,
    serviceName && `service-${serviceName.toLowerCase().replace(/\s+/g, '-')}`,
    'dutch-content-context'
  ].filter(Boolean).join(' ');

  return (
    <div className={`${className} ${contextClasses}`.trim()}>
      {includeLocalSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              name: `ProWeb Studio ${cityName ? `- ${cityName}` : ''}`,
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'NL',
                addressRegion: cityName
              },
              areaServed: {
                '@type': 'Country',
                name: 'Netherlands'
              },
              serviceArea: {
                '@type': 'GeoCircle',
                geoMidpoint: {
                  '@type': 'GeoCoordinates',
                  latitude: '52.3676',
                  longitude: '4.9041'
                }
              }
            })
          }}
        />
      )}
      {children}
    </div>
  );
}

// Dutch business terminology component with natural integration
export interface DutchTerminologyProps {
  terms: Array<{
    term: string;
    context: string;
    frequency?: 'high' | 'medium' | 'low';
  }>;
  children: React.ReactNode;
}

export function DutchTerminologyProvider({ terms, children }: DutchTerminologyProps) {
  return (
    <div 
      className="dutch-terminology-context"
      data-terms={terms.map(t => t.term).join(',')}
    >
      {children}
    </div>
  );
}