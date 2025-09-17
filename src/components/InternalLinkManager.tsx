'use client';

import { useEffect } from 'react';
import { servicePages, blogPosts } from '@/lib/internal-links';

interface InternalLinkManagerProps {
  content: string;
  keywords?: string[];
}

export function InternalLinkManager({ content, keywords = [] }: InternalLinkManagerProps) {
  useEffect(() => {
    // Auto-link keywords to relevant pages
    const linkKeywords = () => {
      const contentElement = document.querySelector('[data-internal-links]');
      if (!contentElement) return;
      
      let html = contentElement.innerHTML;
      
      // Create a map of keywords to links
      const keywordMap = new Map();
      
      [...servicePages, ...blogPosts].forEach(page => {
        (page.keywords || []).forEach(keyword => {
          if (!keywordMap.has(keyword.toLowerCase())) {
            keywordMap.set(keyword.toLowerCase(), {
              href: page.href,
              title: page.title || page.label,
            });
          }
        });
      });
      
      // Replace keywords with links (only first occurrence)
      keywordMap.forEach((link, keyword) => {
        const regex = new RegExp(`\\b(${keyword})\\b(?![^<]*>)`, 'i');
        html = html.replace(regex, `<a href="${link.href}" title="${link.title}" class="text-primary hover:underline">$1</a>`);
      });
      
      contentElement.innerHTML = html;
    };
    
    linkKeywords();
  }, [content, keywords]);
  
  return (
    <div data-internal-links dangerouslySetInnerHTML={{ __html: content }} />
  );
}
