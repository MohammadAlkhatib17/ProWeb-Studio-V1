// Internal linking optimization utilities
import { locations, services, footerLinkGroups } from './internal-linking.config';

export interface LinkEquityAnalysis {
  totalLinks: number;
  highPriorityLinks: number;
  mediumPriorityLinks: number;
  lowPriorityLinks: number;
  linkDepth: Record<string, number>;
  recommendations: string[];
}

export interface PageLinkStrategy {
  page: string;
  requiredLinks: string[];
  suggestedLinks: string[];
  maxLinks: number;
  linkEquityDistribution: Record<string, number>;
}

// Analyze current internal linking structure
export function analyzeInternalLinking(): LinkEquityAnalysis {
  const allLinks: Array<{href: string; priority: string; source: string}> = [];
  
  // Collect all footer links
  footerLinkGroups.forEach(group => {
    group.links.forEach(link => {
      allLinks.push({
        href: link.href,
        priority: link.priority || 'medium',
        source: 'footer'
      });
    });
  });
  
  // Collect service links
  services.forEach(service => {
    allLinks.push({
      href: service.href,
      priority: 'high',
      source: 'services'
    });
  });
  
  // Collect location links
  locations.forEach(location => {
    allLinks.push({
      href: `/locaties/${location.slug}`,
      priority: 'medium',
      source: 'locations'
    });
  });
  
  // Calculate link depth (path segments)
  const linkDepth: Record<string, number> = {};
  allLinks.forEach(link => {
    const segments = link.href.split('/').filter(Boolean);
    linkDepth[link.href] = segments.length;
  });
  
  // Generate recommendations
  const recommendations: string[] = [];
  const highPriorityLinks = allLinks.filter(l => l.priority === 'high').length;
  const totalLinks = allLinks.length;
  
  if (highPriorityLinks < 5) {
    recommendations.push('Voeg meer high-priority links toe aan belangrijke service pagina\'s');
  }
  
  if (totalLinks > 100) {
    recommendations.push('Overweeg het reduceren van het totaal aantal links om link equity te concentreren');
  }
  
  const deepLinks = Object.entries(linkDepth).filter(([_, depth]) => depth > 3).length;
  if (deepLinks > totalLinks * 0.3) {
    recommendations.push('Te veel diepe links - overweeg het verplaatsen van belangrijke content naar hogere niveaus');
  }
  
  return {
    totalLinks,
    highPriorityLinks: allLinks.filter(l => l.priority === 'high').length,
    mediumPriorityLinks: allLinks.filter(l => l.priority === 'medium').length,
    lowPriorityLinks: allLinks.filter(l => l.priority === 'low').length,
    linkDepth,
    recommendations
  };
}

// Generate optimal link strategy for a specific page
export function generatePageLinkStrategy(pathname: string): PageLinkStrategy {
  const baseStrategy: PageLinkStrategy = {
    page: pathname,
    requiredLinks: [],
    suggestedLinks: [],
    maxLinks: 50,
    linkEquityDistribution: {}
  };
  
  // Core navigation links (always required)
  baseStrategy.requiredLinks = [
    '/',
    '/diensten',
    '/portfolio',
    '/contact'
  ];
  
  // Page-specific strategies
  switch (true) {
    case pathname === '/':
      // Homepage strategy
      baseStrategy.suggestedLinks = [
        '/over-ons',
        '/werkwijze',
        '/diensten/website-laten-maken',
        '/diensten/webshop-laten-maken',
        '/locaties/amsterdam',
        '/locaties/rotterdam'
      ];
      baseStrategy.linkEquityDistribution = {
        '/diensten': 0.3,
        '/portfolio': 0.2,
        '/contact': 0.2,
        '/over-ons': 0.1,
        '/locaties': 0.1,
        'other': 0.1
      };
      break;
      
    case pathname.startsWith('/diensten'):
      // Services strategy
      baseStrategy.suggestedLinks = [
        '/portfolio',
        '/werkwijze',
        '/contact',
        ...services.filter(s => s.href !== pathname).slice(0, 3).map(s => s.href),
        '/locaties/amsterdam',
        '/locaties/rotterdam'
      ];
      baseStrategy.linkEquityDistribution = {
        '/portfolio': 0.25,
        '/contact': 0.25,
        'related-services': 0.3,
        'locations': 0.1,
        'other': 0.1
      };
      break;
      
    case pathname.startsWith('/locaties'):
      // Location strategy
      const currentLocation = pathname.split('/').pop();
      const currentLocationData = locations.find(l => l.slug === currentLocation);
      
      if (currentLocationData) {
        // Add related services for this location
        baseStrategy.suggestedLinks = [
          ...currentLocationData.relatedServices.map(s => `/diensten/${s}`),
          // Add nearby locations
          ...currentLocationData.nearbyLocations.slice(0, 3).map(l => `/locaties/${l}`),
          '/contact',
          '/portfolio'
        ];
      }
      
      baseStrategy.linkEquityDistribution = {
        'local-services': 0.4,
        '/contact': 0.2,
        'nearby-locations': 0.2,
        '/portfolio': 0.1,
        'other': 0.1
      };
      break;
      
    case pathname === '/portfolio':
      // Portfolio strategy
      baseStrategy.suggestedLinks = [
        '/diensten',
        '/contact',
        '/werkwijze',
        '/over-ons',
        '/speeltuin'
      ];
      baseStrategy.linkEquityDistribution = {
        '/contact': 0.3,
        '/diensten': 0.3,
        '/werkwijze': 0.2,
        'other': 0.2
      };
      break;
      
    default:
      // Default strategy for other pages
      baseStrategy.suggestedLinks = [
        '/diensten',
        '/portfolio',
        '/contact',
        '/over-ons'
      ];
      baseStrategy.linkEquityDistribution = {
        '/diensten': 0.25,
        '/portfolio': 0.25,
        '/contact': 0.25,
        'other': 0.25
      };
  }
  
  return baseStrategy;
}

// Get contextual internal links for current page
export function getContextualLinks(pathname: string): Array<{title: string; href: string; reason: string}> {
  const links: Array<{title: string; href: string; reason: string}> = [];
  
  // Service to service linking
  if (pathname.startsWith('/diensten/')) {
    const currentService = pathname.split('/').pop();
    const serviceData = services.find(s => s.href.includes(currentService || ''));
    
    if (serviceData) {
      serviceData.relatedServices.forEach(relatedSlug => {
        const relatedService = services.find(s => s.href.includes(relatedSlug));
        if (relatedService) {
          links.push({
            title: relatedService.title,
            href: relatedService.href,
            reason: 'Complementaire dienst'
          });
        }
      });
    }
  }
  
  // Location to location linking
  if (pathname.startsWith('/locaties/')) {
    const currentLocation = pathname.split('/').pop();
    const locationData = locations.find(l => l.slug === currentLocation);
    
    if (locationData) {
      locationData.nearbyLocations.forEach(nearbySlug => {
        const nearbyLocation = locations.find(l => l.slug === nearbySlug);
        if (nearbyLocation) {
          links.push({
            title: `Webdesign ${nearbyLocation.name}`,
            href: `/locaties/${nearbyLocation.slug}`,
            reason: 'Nabijgelegen locatie'
          });
        }
      });
    }
  }
  
  // Universal high-value links
  if (!pathname.includes('/contact')) {
    links.push({
      title: 'Neem Contact Op',
      href: '/contact',
      reason: 'Belangrijke conversie pagina'
    });
  }
  
  if (!pathname.includes('/portfolio')) {
    links.push({
      title: 'Bekijk Portfolio',
      href: '/portfolio',
      reason: 'Sociale bewijs en inspiratie'
    });
  }
  
  return links.slice(0, 5); // Limit to 5 contextual links
}

// Generate sitemap with proper internal linking hierarchy
export function generateSitemapHierarchy() {
  return {
    homepage: {
      url: '/',
      priority: 1.0,
      changefreq: 'weekly',
      children: {
        services: {
          url: '/diensten',
          priority: 0.9,
          changefreq: 'monthly',
          children: services.reduce((acc, service) => {
            acc[service.href.split('/').pop() || ''] = {
              url: service.href,
              priority: 0.8,
              changefreq: 'monthly'
            };
            return acc;
          }, {} as Record<string, any>)
        },
        locations: {
          url: '/locaties',
          priority: 0.7,
          changefreq: 'monthly',
          children: locations.reduce((acc, location) => {
            acc[location.slug] = {
              url: `/locaties/${location.slug}`,
              priority: 0.6,
              changefreq: 'monthly'
            };
            return acc;
          }, {} as Record<string, any>)
        },
        portfolio: {
          url: '/portfolio',
          priority: 0.8,
          changefreq: 'weekly'
        },
        about: {
          url: '/over-ons',
          priority: 0.6,
          changefreq: 'monthly'
        },
        contact: {
          url: '/contact',
          priority: 0.9,
          changefreq: 'monthly'
        }
      }
    }
  };
}

// Validate internal link structure
export function validateInternalLinks(): Array<{issue: string; severity: 'low' | 'medium' | 'high'; recommendation: string}> {
  const issues: Array<{issue: string; severity: 'low' | 'medium' | 'high'; recommendation: string}> = [];
  
  // Check for orphaned pages (no internal links pointing to them)
  const allLinkedPages = new Set<string>();
  footerLinkGroups.forEach(group => {
    group.links.forEach(link => allLinkedPages.add(link.href));
  });
  services.forEach(service => allLinkedPages.add(service.href));
  locations.forEach(location => allLinkedPages.add(`/locaties/${location.slug}`));
  
  // Check for broken link patterns
  services.forEach(service => {
    if (service.relatedServices.length === 0) {
      issues.push({
        issue: `Service "${service.title}" heeft geen gerelateerde services`,
        severity: 'medium',
        recommendation: 'Voeg gerelateerde services toe om cross-linking te verbeteren'
      });
    }
  });
  
  // Check location linking
  locations.forEach(location => {
    if (location.nearbyLocations.length === 0) {
      issues.push({
        issue: `Locatie "${location.name}" heeft geen nabijgelegen locaties`,
        severity: 'low',
        recommendation: 'Voeg nabijgelegen locaties toe voor betere geografische linking'
      });
    }
  });
  
  return issues;
}

export default {
  analyzeInternalLinking,
  generatePageLinkStrategy,
  getContextualLinks,
  generateSitemapHierarchy,
  validateInternalLinks
};