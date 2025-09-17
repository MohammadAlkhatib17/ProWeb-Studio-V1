import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { servicePages, caseStudies } from '@/lib/internal-links';
import { Card } from './ui/card';
import { Image } from './ui/Image';

interface RelatedCaseStudiesProps {
  currentService?: string;
  currentCaseStudy?: string;
  maxItems?: number;
}

export function RelatedCaseStudies({ 
  currentService, 
  currentCaseStudy,
  maxItems = 3 
}: RelatedCaseStudiesProps) {
  let relatedCases: typeof caseStudies = [];
  
  if (currentService) {
    const service = servicePages.find(s => s.href === currentService);
    if (service) {
      relatedCases = service.relatedCaseStudies
        .map(href => caseStudies.find(c => c.href === href))
        .filter(Boolean) as typeof caseStudies;
    }
  } else if (currentCaseStudy) {
    // Find case studies with similar tags
    const current = caseStudies.find(c => c.href === currentCaseStudy);
    if (current) {
      relatedCases = caseStudies.filter(c => 
        c.href !== currentCaseStudy &&
        c.tags?.some(tag => current.tags?.includes(tag))
      );
    }
  }
  
  relatedCases = relatedCases.slice(0, maxItems);
  
  if (relatedCases.length === 0) return null;
  
  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8">
          {currentService ? 'Relevante Projecten' : 'Vergelijkbare Projecten'}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {relatedCases.map((caseStudy) => (
            <Card key={caseStudy.href} className="overflow-hidden group">
              <Link href={caseStudy.href}>
                <div className="aspect-video relative bg-gray-100">
                  <Image
                    src={`/images/portfolio/${caseStudy.href.split('/').pop()}.jpg`}
                    alt={caseStudy.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {caseStudy.label}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {caseStudy.title}
                  </p>
                  {caseStudy.tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {caseStudy.tags.map(tag => (
                        <span 
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className="text-primary inline-flex items-center text-sm font-medium">
                    Bekijk Project
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </Link>
            </Card>
          ))}
        </div>
        
        {/* CTA to portfolio */}
        <div className="text-center mt-8">
          <Link
            href="/portfolio"
            className="inline-flex items-center px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            Bekijk Alle Projecten
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
