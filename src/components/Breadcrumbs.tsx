'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { generateBreadcrumbs } from '@/lib/internal-links';
import { StructuredData } from './StructuredData';

interface BreadcrumbsProps {
  customItems?: Array<{ label: string; href: string }>;
  showHome?: boolean;
}

export function Breadcrumbs({ customItems, showHome = true }: BreadcrumbsProps) {
  const pathname = usePathname();
  const items = customItems || generateBreadcrumbs(pathname);
  
  // Don't show breadcrumbs on homepage
  if (pathname === '/' && !customItems) return null;
  
  const structuredDataItems = items.map(item => ({
    name: item.label,
    url: `https://prowebstudio.nl${item.href}`,
  }));

  return (
    <>
      <StructuredData type="breadcrumb" breadcrumbs={structuredDataItems} />
      <nav 
        aria-label="Breadcrumb" 
        className="container mx-auto py-4 px-4"
      >
        <ol className="flex items-center space-x-2 text-sm flex-wrap">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0" />
              )}
              {index === items.length - 1 ? (
                <span 
                  className="text-gray-600 font-medium" 
                  aria-current="page"
                >
                  {index === 0 && showHome && (
                    <Home className="w-4 h-4 inline mr-1" />
                  )}
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-primary hover:text-primary-dark transition-colors inline-flex items-center"
                  title={`Ga naar ${item.label}`}
                >
                  {index === 0 && showHome && (
                    <Home className="w-4 h-4 mr-1" />
                  )}
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
