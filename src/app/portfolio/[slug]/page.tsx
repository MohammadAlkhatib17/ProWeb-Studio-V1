import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { caseStudies } from '@/lib/internal-links';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { RelatedCaseStudies } from '@/components/RelatedCaseStudies';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Portfolio Item',
};

export default function PortfolioItemPage({ params }: { params: { slug: string } }) {
  const casePath = `/portfolio/${params.slug}`;
  const caseStudy = caseStudies.find(c => c.href === casePath);
  
  if (!caseStudy) {
    notFound();
  }
  
  return (
    <>
      <Breadcrumbs />
      
      <section className="py-20">
        <div className="container">
          {/* Back to portfolio link */}
          <Link
            href="/portfolio"
            className="inline-flex items-center text-primary hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug naar Portfolio
          </Link>
          
          <h1 className="text-4xl font-bold mb-6">{caseStudy.label}</h1>
          <p className="text-xl text-gray-600 mb-8">{caseStudy.title}</p>
          
          {/* Tags with links to related content */}
          {caseStudy.tags && (
            <div className="flex flex-wrap gap-2 mb-8">
              {caseStudy.tags.map(tag => (
                <Link
                  key={tag}
                  href={`/portfolio?tag=${tag.toLowerCase()}`}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
          
          {/* Related services used */}
          <div className="mb-8">
            <h3 className="font-semibold mb-2">Gebruikte Diensten:</h3>
            <div className="flex flex-wrap gap-2">
              {caseStudy.relatedServices.map(serviceHref => {
                const service = servicePages.find(s => s.href === serviceHref);
                return service ? (
                  <Link
                    key={serviceHref}
                    href={serviceHref}
                    className="text-primary hover:underline"
                  >
                    {service.label}
                  </Link>
                ) : null;
              })}
            </div>
          </div>
          
          {/* Case study content */}
          <div className="prose prose-lg max-w-none">
            {/* Content would be loaded dynamically */}
            <p>Case study details would go here...</p>
          </div>
          
          {/* CTA to contact */}
          <div className="mt-12 p-8 bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg">
            <h2 className="text-2xl font-bold mb-4">
              Geïnteresseerd in een vergelijkbaar project?
            </h2>
            <p className="mb-6">
              We helpen u graag met uw project. Neem contact op voor een vrijblijvend gesprek.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Uw Project
              <ExternalLink className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Related case studies */}
      <RelatedCaseStudies currentCaseStudy={casePath} />
    </>
  );
}