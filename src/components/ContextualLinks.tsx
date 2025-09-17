'use client';

import Link from 'next/link';
import { getContextualLinks } from '@/lib/internal-links';

interface ContextualLinksProps {
  keywords: string[];
  currentPath?: string;
  className?: string;
  inline?: boolean;
}

export function ContextualLinks({ 
  keywords, 
  currentPath = '',
  className = '',
  inline = false
}: ContextualLinksProps) {
  const links = getContextualLinks(keywords, [currentPath]);
  
  if (links.length === 0) return null;
  
  if (inline) {
    return (
      <span className={className}>
        Zie ook:{' '}
        {links.map((link, index) => (
          <span key={link.href}>
            <Link
              href={link.href}
              className="text-primary hover:underline"
              title={link.title}
            >
              {link.label}
            </Link>
            {index < links.length - 1 && ', '}
          </span>
        ))}
      </span>
    );
  }
  
  return (
    <aside className={`bg-blue-50 p-4 rounded-lg ${className}`}>
      <h3 className="font-semibold mb-2">Gerelateerde Onderwerpen</h3>
      <ul className="space-y-1">
        {links.map(link => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-primary hover:underline text-sm"
              title={link.title}
            >
              → {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
