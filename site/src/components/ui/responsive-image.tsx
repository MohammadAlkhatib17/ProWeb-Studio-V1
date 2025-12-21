import Image, { ImageProps } from 'next/image';

// Simple className utility function
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface ResponsiveImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  quality?: number;
  /**
   * Responsive sizes for different viewport widths
   * Default provides good coverage for most use cases
   */
  responsiveSizes?: string;
  /**
   * Whether this image is likely to be the LCP element
   * Enables additional optimizations like fetchpriority="high"
   */
  isLCP?: boolean;
  /**
   * Aspect ratio to prevent layout shift
   * Format: "16/9", "4/3", "1/1", etc.
   */
  aspectRatio?: string;
}

/**
 * Optimized responsive image component with Next.js Image
 * Includes best practices for Core Web Vitals:
 * - Automatic format selection (AVIF/WebP)
 * - Responsive sizing
 * - Loading optimization
 * - Layout shift prevention with explicit dimensions
 */
export function ResponsiveImage({
  src,
  alt,
  className,
  priority = false,
  quality = 85,
  responsiveSizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  isLCP = false,
  aspectRatio,
  width,
  height,
  ...props
}: ResponsiveImageProps) {
  // Ensure dimensions are provided to prevent layout shift
  const hasExplicitDimensions = (width && height) || props.fill;

  if (!hasExplicitDimensions && !aspectRatio) {
    console.warn(`ResponsiveImage: ${src} should have explicit width/height or aspectRatio to prevent layout shift`);
  }

  const imageProps: ImageProps = {
    src,
    alt,
    sizes: responsiveSizes,
    priority: priority || isLCP,
    quality,
    ...(width && { width }),
    ...(height && { height }),
    className: cn(
      'transition-opacity duration-300',
      aspectRatio && `aspect-[${aspectRatio}]`,
      // Ensure proper object-fit for responsive images
      !props.fill && 'h-auto w-full max-w-full',
      className
    ),
    // Add fetchPriority for LCP elements in supporting browsers
    ...(isLCP && { fetchPriority: 'high' as const }),
    ...props,
  };

  // Ensure alt prop is always provided
  if (!imageProps.alt) {
    imageProps.alt = '';
  }

  return <Image {...imageProps} />;
}

interface HeroImageProps extends Omit<ResponsiveImageProps, 'responsiveSizes' | 'isLCP'> {
  /**
   * Hero images are typically LCP elements and need specific sizing
   */
  priority?: boolean;
}

/**
 * Specialized component for hero/banner images
 * Optimized for above-the-fold content and LCP performance
 */
export function HeroImage({
  priority = true,
  quality = 90,
  ...props
}: HeroImageProps) {
  return (
    <ResponsiveImage
      {...props}
      priority={priority}
      quality={quality}
      isLCP={true}
      responsiveSizes="100vw"
    />
  );
}

interface ThumbnailImageProps extends Omit<ResponsiveImageProps, 'responsiveSizes'> {
  size?: 'sm' | 'md' | 'lg';
  width: number;
  height: number;
}

/**
 * Optimized thumbnail component for cards, galleries, etc.
 * Requires explicit dimensions to prevent layout shift
 */
export function ThumbnailImage({
  size = 'md',
  quality = 80,
  width,
  height,
  ...props
}: ThumbnailImageProps) {
  const sizeMap = {
    sm: '(max-width: 640px) 150px, 200px',
    md: '(max-width: 640px) 200px, 300px',
    lg: '(max-width: 640px) 300px, 400px',
  };

  return (
    <ResponsiveImage
      {...props}
      width={width}
      height={height}
      quality={quality}
      responsiveSizes={sizeMap[size]}
      priority={false}
    />
  );
}

interface BackgroundImageProps extends Omit<ResponsiveImageProps, 'fill' | 'sizes'> {
  /**
   * Background images should fill their container
   */
  containerClassName?: string;
}

/**
 * Optimized background image component
 * Uses fill prop for absolute positioning
 */
export function BackgroundImage({
  priority = false,
  quality = 75,
  className,
  alt = '',
  ...props
}: BackgroundImageProps) {
  return (
    <ResponsiveImage
      {...props}
      alt={alt}
      fill
      priority={priority}
      quality={quality}
      responsiveSizes="100vw"
      className={cn(
        'object-cover object-center',
        className
      )}
    />
  );
}

interface AvatarImageProps extends Omit<ResponsiveImageProps, 'responsiveSizes'> {
  size?: number;
}

/**
 * Optimized avatar/profile image component
 */
export function AvatarImage({
  size = 64,
  quality = 85,
  aspectRatio = '1/1',
  ...props
}: AvatarImageProps) {
  return (
    <ResponsiveImage
      {...props}
      width={size}
      height={size}
      quality={quality}
      aspectRatio={aspectRatio}
      responsiveSizes={`${size}px`}
      className={cn(
        'rounded-full',
        props.className
      )}
    />
  );
}

export { ResponsiveImage as default };