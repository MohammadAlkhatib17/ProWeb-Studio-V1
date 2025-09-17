import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  blurDataURL?: string;
  fallback?: string;
}

export function Image({ 
  src, 
  alt, 
  className, 
  priority = false,
  sizes = '100vw',
  blurDataURL,
  fallback,
  ...props 
}: ImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  
  const avifSrc = src.replace(/\.(jpg|jpeg|png|webp)$/i, '.avif');
  const webpSrc = src.replace(/\.(jpg|jpeg|png|avif)$/i, '.webp');
  
  return (
    <picture>
      <source srcSet={avifSrc} type="image/avif" />
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={imageSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoading && blurDataURL ? 'opacity-0' : 'opacity-100',
          className
        )}
        sizes={sizes}
        fetchPriority={priority ? 'high' : undefined}
        loading={priority ? undefined : 'lazy'}
        onLoad={() => setIsLoading(false)}
        onError={() => fallback && setImageSrc(fallback)}
        style={{
          ...(isLoading && blurDataURL ? {
            backgroundImage: `url(${blurDataURL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } : {}),
        }}
        {...props}
      />
    </picture>
  );
}
