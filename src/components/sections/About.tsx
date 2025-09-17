import { Container } from '@/components/ui/Container';
import { Image } from '@/components/ui/Image';
import { getImageSizes } from '@/lib/image-utils';

export function About() {
  return (
    <section id="about" className="py-20">
      <Container>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Image
              src="/images/about-team.jpg"
              alt="Our team at work"
              className="rounded-lg shadow-lg"
              sizes={getImageSizes('full')}
              priority={true}
            />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold leading-tight mb-4">
              About Us
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              We are a team of passionate individuals who love what we do. Our
              mission is to deliver the best service possible to our clients.
            </p>
            <p className="text-lg text-gray-700">
              With years of experience in the industry, we have the knowledge and
              expertise to help you achieve your goals. Let's work together to
              create something amazing.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}