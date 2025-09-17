import { Image } from '@/components/ui/Image';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Hero background image with priority loading */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Hero background"
          className="w-full h-full object-cover"
          priority={true}
          sizes="100vw"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
        />
      </div>
      
      {/* ...existing code... */}
      
      {/* Hero content image */}
      <Image
        src="/images/hero-illustration.png"
        alt="Hero illustration"
        className="w-full max-w-lg"
        priority={true}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      
      {/* ...existing code... */}
    </section>
  );
}