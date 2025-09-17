import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  sizes
}: OptimizedImageProps) {
  return (
    <div 
      className={`relative ${className}`}
      style={{ aspectRatio: `${width}/${height}` }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes || `(max-width: 768px) 100vw, ${width}px`}
        loading={priority ? 'eager' : 'lazy'}
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`}
        style={{
          width: '100%',
          height: 'auto',
          objectFit: 'cover'
        }}
      />
    </div>
  );
}

// Shimmer effect for placeholder
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${w}" height="${h}" fill="#f3f4f6"/>
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);
