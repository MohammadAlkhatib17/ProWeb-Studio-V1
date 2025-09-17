import { generateReviewSchema } from '@/lib/schema';
import Script from 'next/script';
import { TestimonialCard } from './TestimonialCard';
import { Star } from './Star';

interface Testimonial {
  id: string;
  author: string;
  company: string;
  content: string;
  rating: number;
  date: string;
}

export function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      id: '1',
      author: 'Jan van der Berg',
      company: 'TechStart Amsterdam',
      content: 'ProWeb Studio delivered an exceptional website that exceeded our expectations.',
      rating: 5,
      date: '2024-01-15',
    },
    {
      id: '2',
      author: 'Marie de Vries',
      company: 'Fashion Boutique Rotterdam',
      content: 'Professional team with great attention to detail. Highly recommended!',
      rating: 5,
      date: '2024-02-20',
    },
    // ...existing code...
  ];

  const averageRating = testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length;

  return (
    <section className="py-20 bg-gray-50" data-speakable>
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12" data-speakable>
          What Our Clients Say
        </h2>
        
        {/* Aggregate rating display */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center">
            <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
            <div className="ml-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">Based on {testimonials.length} reviews</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id}>
              <TestimonialCard testimonial={testimonial} />
              <Script
                id={`review-schema-${testimonial.id}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(generateReviewSchema({
                    author: testimonial.author,
                    rating: testimonial.rating,
                    reviewBody: testimonial.content,
                    datePublished: testimonial.date,
                  }))
                }}
                strategy="afterInteractive"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}