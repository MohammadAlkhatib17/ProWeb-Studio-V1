'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';


interface BreadcrumbItem {
  title: string;
  href: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

// Dutch translations for common routes
const routeTranslations: Record<string, string> = {
  'diensten': 'Diensten',
  'portfolio': 'Portfolio',
  'over-ons': 'Over Ons',
  'contact': 'Contact',
  'werkwijze': 'Werkwijze',
  'speeltuin': 'Speeltuin',
  'overzicht': 'Overzicht',
  'overzicht-site': 'Site Overzicht',
  'privacy': 'Privacy',
  'voorwaarden': 'Voorwaarden',
  'sitemap': 'Sitemap',
  // Service-specific routes
  'webdesign': 'Webdesign',
  'webshop': 'Webshop',
  'seo': 'SEO Optimalisatie',
  '3d-experiences': '3D Ervaringen',
  'maintenance': 'Onderhoud',
  // Location-specific routes
  'amsterdam': 'Amsterdam',
  'rotterdam': 'Rotterdam',
  'utrecht': 'Utrecht',
  'den-haag': 'Den Haag',
  'eindhoven': 'Eindhoven',
  'tilburg': 'Tilburg',
  'groningen': 'Groningen',
  'almere': 'Almere',
  'breda': 'Breda',
  'nijmegen': 'Nijmegen',
  'locaties': 'Locaties',
};

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const pathname = usePathname();
  
  // Generate breadcrumb items from pathname if not provided
  const breadcrumbItems = items || generateBreadcrumbItems(pathname);
  
  // Don't show breadcrumbs on homepage
  if (pathname === '/' || breadcrumbItems.length <= 1) {
    return null;
  }

  // Generate JSON-LD structured data for breadcrumbs
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://prowebstudio.nl'}${pathname}#breadcrumbs`,
    inLanguage: 'nl-NL',
    itemListElement: breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      item: {
        '@type': 'WebPage',
        '@id': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://prowebstudio.nl'}${item.href}`,
      },
    })),
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumbs"
        className={`py-4 ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1;
              
              return (
                <li key={item.href} className="flex items-center">
                  {index > 0 && (
                    <span className="text-slate-400 mx-2 select-none" aria-hidden="true">
                      →
                    </span>
                  )}
                  
                  {index === 0 ? (
                    <Link
                      href={item.href}
                      className="text-slate-400 hover:text-cyan-300 transition-colors duration-200 flex items-center"
                      aria-label="Ga naar homepage"
                    >
                      <span className="text-base" aria-hidden="true">🏠</span>
                      <span className="sr-only">{item.title}</span>
                    </Link>
                  ) : isLast ? (
                    <span 
                      className="text-white font-medium"
                      aria-current="page"
                    >
                      {item.title}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-slate-400 hover:text-cyan-300 transition-colors duration-200"
                    >
                      {item.title}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </>
  );
}

function generateBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', href: '/' }
  ];

  let currentPath = '';
  
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;
    const title = routeTranslations[segment] || 
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    
    breadcrumbs.push({
      title,
      href: currentPath,
    });
  });

  return breadcrumbs;
}