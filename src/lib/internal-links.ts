export interface InternalLink {
  href: string;
  label: string;
  title?: string;
  keywords?: string[];
  category?: 'service' | 'portfolio' | 'blog' | 'page';
}

export interface ServiceLink extends InternalLink {
  relatedServices: string[];
  relatedCaseStudies: string[];
  icon?: string;
  description?: string;
}

// Core pages structure for internal linking
export const corePages: InternalLink[] = [
  {
    href: '/',
    label: 'Home',
    title: 'Website Laten Maken - Homepage',
    keywords: ['home', 'website laten maken', 'webdesign'],
    category: 'page',
  },
  {
    href: '/services',
    label: 'Diensten',
    title: 'Onze Diensten - Website Development',
    keywords: ['diensten', 'services', 'website ontwikkeling'],
    category: 'page',
  },
  {
    href: '/portfolio',
    label: 'Portfolio',
    title: 'Portfolio - Gerealiseerde Projecten',
    keywords: ['portfolio', 'projecten', 'voorbeelden'],
    category: 'page',
  },
  {
    href: '/about',
    label: 'Over Ons',
    title: 'Over ProWeb Studio',
    keywords: ['over ons', 'team', 'bedrijf'],
    category: 'page',
  },
  {
    href: '/contact',
    label: 'Contact',
    title: 'Contact - Vraag Offerte Aan',
    keywords: ['contact', 'offerte', 'aanvragen'],
    category: 'page',
  },
  {
    href: '/blog',
    label: 'Blog',
    title: 'Blog - Tips & Nieuws',
    keywords: ['blog', 'nieuws', 'tips'],
    category: 'page',
  },
];

// Service pages with relationships
export const servicePages: ServiceLink[] = [
  {
    href: '/services/website-development',
    label: 'Website Development',
    title: 'Professionele Website Laten Maken',
    description: 'Custom website ontwikkeling met moderne technologieën',
    keywords: ['website development', 'website laten maken', 'maatwerk'],
    category: 'service',
    relatedServices: ['/services/web-design', '/services/e-commerce', '/services/cms-development'],
    relatedCaseStudies: ['/portfolio/tech-startup', '/portfolio/corporate-website', '/portfolio/saas-platform'],
    icon: 'Code',
  },
  {
    href: '/services/e-commerce',
    label: 'E-commerce Oplossingen',
    title: 'Webshop Laten Maken',
    description: 'Complete e-commerce platforms met payment integratie',
    keywords: ['e-commerce', 'webshop', 'online verkopen'],
    category: 'service',
    relatedServices: ['/services/website-development', '/services/payment-integration', '/services/inventory-management'],
    relatedCaseStudies: ['/portfolio/fashion-store', '/portfolio/electronics-shop', '/portfolio/food-delivery'],
    icon: 'ShoppingCart',
  },
  {
    href: '/services/web-design',
    label: 'Web Design',
    title: 'Professioneel Webdesign',
    description: 'Modern en gebruiksvriendelijk webdesign',
    keywords: ['web design', 'ui design', 'ux design'],
    category: 'service',
    relatedServices: ['/services/website-development', '/services/branding', '/services/responsive-design'],
    relatedCaseStudies: ['/portfolio/creative-agency', '/portfolio/restaurant-chain', '/portfolio/fitness-app'],
    icon: 'Palette',
  },
  {
    href: '/services/seo-optimization',
    label: 'SEO Optimalisatie',
    title: 'SEO & Zoekmachine Optimalisatie',
    description: 'Verbeter uw vindbaarheid in Google',
    keywords: ['seo', 'zoekmachine optimalisatie', 'google ranking'],
    category: 'service',
    relatedServices: ['/services/content-marketing', '/services/local-seo', '/services/technical-seo'],
    relatedCaseStudies: ['/portfolio/local-business-seo', '/portfolio/national-campaign', '/portfolio/international-seo'],
    icon: 'Search',
  },
  {
    href: '/services/web-applications',
    label: 'Web Applicaties',
    title: 'Custom Web Applicatie Development',
    description: 'Schaalbare web applicaties op maat',
    keywords: ['web applicaties', 'saas', 'custom software'],
    category: 'service',
    relatedServices: ['/services/api-development', '/services/cloud-solutions', '/services/database-design'],
    relatedCaseStudies: ['/portfolio/crm-system', '/portfolio/booking-platform', '/portfolio/analytics-dashboard'],
    icon: 'Cpu',
  },
];

// Portfolio/Case studies with service relationships
export const caseStudies = [
  {
    href: '/portfolio/tech-startup',
    label: 'TechStart Amsterdam',
    title: 'Website voor Tech Startup',
    keywords: ['tech startup', 'amsterdam', 'saas website'],
    category: 'portfolio' as const,
    relatedServices: ['/services/website-development', '/services/web-design'],
    tags: ['SaaS', 'B2B', 'Technology'],
  },
  {
    href: '/portfolio/fashion-store',
    label: 'Fashion Boutique Rotterdam',
    title: 'E-commerce Platform Fashion',
    keywords: ['fashion', 'webshop', 'rotterdam'],
    category: 'portfolio' as const,
    relatedServices: ['/services/e-commerce', '/services/payment-integration'],
    tags: ['E-commerce', 'Fashion', 'B2C'],
  },
  {
    href: '/portfolio/corporate-website',
    label: 'Corporate Finance Group',
    title: 'Zakelijke Website Financial Services',
    keywords: ['corporate', 'finance', 'zakelijk'],
    category: 'portfolio' as const,
    relatedServices: ['/services/website-development', '/services/cms-development'],
    tags: ['Corporate', 'Finance', 'B2B'],
  },
];

// Blog posts for contextual linking
export const blogPosts = [
  {
    href: '/blog/website-kosten-2024',
    label: 'Website Kosten in 2024',
    title: 'Wat kost een website laten maken in 2024?',
    keywords: ['website kosten', 'prijzen', 'tarieven'],
    category: 'blog' as const,
    relatedServices: ['/services/website-development'],
  },
  {
    href: '/blog/seo-tips-nederlands',
    label: 'SEO Tips voor Nederlandse Websites',
    title: 'Top 10 SEO Tips voor Nederlandse Bedrijven',
    keywords: ['seo tips', 'nederlands', 'zoekmachine'],
    category: 'blog' as const,
    relatedServices: ['/services/seo-optimization'],
  },
  {
    href: '/blog/webshop-starten',
    label: 'Webshop Starten Gids',
    title: 'Complete Gids: Webshop Starten in Nederland',
    keywords: ['webshop starten', 'e-commerce', 'online verkopen'],
    category: 'blog' as const,
    relatedServices: ['/services/e-commerce'],
  },
];

// Get related links for a specific page
export function getRelatedLinks(currentPath: string, limit: number = 5): InternalLink[] {
  const currentService = servicePages.find(s => s.href === currentPath);
  
  if (currentService) {
    // Return related services and case studies
    const relatedServiceLinks = currentService.relatedServices
      .map(href => servicePages.find(s => s.href === href))
      .filter(Boolean) as ServiceLink[];
      
    const relatedCaseStudyLinks = currentService.relatedCaseStudies
      .map(href => caseStudies.find(c => c.href === href))
      .filter(Boolean);
      
    return [...relatedServiceLinks, ...relatedCaseStudyLinks].slice(0, limit);
  }
  
  // For other pages, return contextually relevant links
  return [...servicePages, ...caseStudies, ...blogPosts]
    .filter(link => link.href !== currentPath)
    .slice(0, limit);
}

// Generate breadcrumb items for a path
export function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ label: 'Home', href: '/' }];
  
  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const page = [...corePages, ...servicePages, ...caseStudies, ...blogPosts]
      .find(p => p.href === currentPath);
      
    if (page) {
      breadcrumbs.push({ label: page.label, href: page.href });
    } else {
      // Format segment as label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      breadcrumbs.push({ label, href: currentPath });
    }
  }
  
  return breadcrumbs;
}

// Get contextual links based on keywords
export function getContextualLinks(keywords: string[], exclude: string[] = [], limit: number = 3) {
  const allLinks = [...servicePages, ...caseStudies, ...blogPosts];
  
  return allLinks
    .filter(link => !exclude.includes(link.href))
    .filter(link => {
      const linkKeywords = link.keywords || [];
      return keywords.some(keyword => 
        linkKeywords.some(lk => lk.toLowerCase().includes(keyword.toLowerCase()))
      );
    })
    .slice(0, limit);
}
