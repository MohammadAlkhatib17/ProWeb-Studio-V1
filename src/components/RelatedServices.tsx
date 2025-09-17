import Link from 'next/link';
import { ArrowRight, Code, ShoppingCart, Palette, Search, Cpu } from 'lucide-react';
import { servicePages } from '@/lib/internal-links';
import { Card } from './ui/card';

const iconMap = {
  Code,
  ShoppingCart,
  Palette,
  Search,
  Cpu,
};

interface RelatedServicesProps {
  currentService: string;
  maxItems?: number;
}

export function RelatedServices({ currentService, maxItems = 4 }: RelatedServicesProps) {
  const current = servicePages.find(s => s.href === currentService);
  if (!current) return null;
  
  const relatedServices = current.relatedServices
    .map(href => servicePages.find(s => s.href === href))
    .filter(Boolean)
    .slice(0, maxItems) as typeof servicePages;
    
  if (relatedServices.length === 0) return null;
  
  return (
    <section className="py-12 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Gerelateerde Diensten
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedServices.map((service) => {
            const Icon = service.icon ? iconMap[service.icon as keyof typeof iconMap] : Code;
            return (
              <Card key={service.href} className="p-6 hover:shadow-lg transition-shadow">
                <Link href={service.href} className="block">
                  <Icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {service.label}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {service.description}
                  </p>
                  <span className="text-primary inline-flex items-center text-sm font-medium">
                    Meer info
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </Link>
              </Card>
            );
          })}
        </div>
        
        {/* CTA to all services */}
        <div className="text-center mt-8">
          <Link
            href="/services"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Bekijk Alle Diensten
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
