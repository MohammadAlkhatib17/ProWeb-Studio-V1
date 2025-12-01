import React from 'react';

import Image, { ImageProps } from 'next/image';

import { getOptimalImageStrategy, getResponsiveImageSizes } from '@/lib/web-vitals-optimization';

// Simple className utility function
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

interface OptimizedResponsiveImageProps extends Omit<ImageProps, 'src' | 'alt'> {
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
  /**
   * Image type for size optimization
   */
  imageType?: 'hero' | 'content' | 'thumbnail' | 'gallery';
  /**
   * Enable advanced Core Web Vitals optimizations
   */
  optimizeForCWV?: boolean;
}

/**
 * Enhanced responsive image component optimized for Core Web Vitals
 * Includes Dutch market-specific optimizations and advanced performance features
 */
export function OptimizedResponsiveImage({
  src,
  alt,
  className,
  priority = false,
  quality,
  responsiveSizes,
  isLCP = false,
  aspectRatio,
  imageType = 'content',
  optimizeForCWV = true,
  width,
  height,
  ...props
}: OptimizedResponsiveImageProps) {
  // Get optimal loading strategy based on device capabilities
  const loadingStrategy: {
    loading?: 'lazy' | 'eager';
    quality?: number;
    placeholder?: 'blur' | 'empty';
  } = optimizeForCWV ? getOptimalImageStrategy(isLCP) : {};
  
  // Use intelligent size calculation if not provided
  const sizes = responsiveSizes || getResponsiveImageSizes(imageType);
  
  // Determine quality based on image type and user preferences
  const imageQuality = quality || loadingStrategy.quality || (isLCP ? 90 : 75);
  
  // Ensure dimensions are provided to prevent layout shift
  const hasExplicitDimensions = (width && height) || props.fill;
  
  if (!hasExplicitDimensions && !aspectRatio && optimizeForCWV) {
    console.warn(`OptimizedResponsiveImage: ${src} should have explicit width/height or aspectRatio to prevent layout shift`);
  }

  const imageProps: ImageProps = {
    src,
    alt,
    sizes,
    priority: priority || isLCP,
    quality: imageQuality,
    loading: loadingStrategy.loading || (priority || isLCP ? 'eager' : 'lazy'),
    ...(width && { width }),
    ...(height && { height }),
    className: cn(
      'transition-opacity duration-300',
      aspectRatio && `aspect-[${aspectRatio}]`,
      // Ensure proper object-fit for responsive images
      !props.fill && 'h-auto w-full max-w-full',
      // Add subtle enhancement for better perceived performance
      'will-change-transform',
      className
    ),
    // Add fetchPriority for LCP elements in supporting browsers
    ...(isLCP && { fetchPriority: 'high' as 'high' | 'low' | 'auto' }),
    // Enhanced placeholder strategy
    placeholder: loadingStrategy.placeholder || 'blur',
    // Add optimized loading attributes
    decoding: 'async',
    ...props,
  };

  return (
    <div 
      className={cn(
        'relative overflow-hidden',
        aspectRatio && 'w-full',
        // Optimize for CLS prevention
        optimizeForCWV && 'before:content-[\"\"] before:block before:pb-[var(--aspect-ratio)] before:w-full'
      )}
      style={{
        '--aspect-ratio': aspectRatio ? `${(parseInt(aspectRatio.split('/')[1]) / parseInt(aspectRatio.split('/')[0])) * 100}%` : undefined,
      } as React.CSSProperties & { '--aspect-ratio'?: string }}
    >
      <Image 
        {...imageProps} 
        alt={alt}
        className={cn(
          imageProps.className,
          aspectRatio && 'absolute inset-0 w-full h-full object-cover'
        )}
      />
    </div>
  );
}

interface OptimizedHeroImageProps extends Omit<OptimizedResponsiveImageProps, 'responsiveSizes' | 'isLCP' | 'imageType'> {
  /**
   * Hero images are typically LCP elements and need specific sizing
   */
  priority?: boolean;
}

/**
 * Specialized component for hero/banner images
 * Optimized for above-the-fold content and LCP performance
 */
export function OptimizedHeroImage({ 
  priority = true, 
  quality = 90,
  optimizeForCWV = true,
  ...props 
}: OptimizedHeroImageProps) {
  return (
    <OptimizedResponsiveImage
      {...props}
      priority={priority}
      quality={quality}
      isLCP={true}
      imageType="hero"
      optimizeForCWV={optimizeForCWV}
      responsiveSizes="100vw"
    />
  );
}

interface OptimizedThumbnailImageProps extends Omit<OptimizedResponsiveImageProps, 'responsiveSizes' | 'imageType'> {
  size?: 'sm' | 'md' | 'lg';
  width: number;
  height: number;
}

/**
 * Optimized thumbnail component for cards, galleries, etc.
 * Requires explicit dimensions to prevent layout shift
 */
export function OptimizedThumbnailImage({ 
  size = 'md',
  quality = 80,
  width,
  height,
  optimizeForCWV = true,
  ...props 
}: OptimizedThumbnailImageProps) {
  const sizeMap = {
    sm: '(max-width: 640px) 150px, 200px',
    md: '(max-width: 640px) 200px, 300px', 
    lg: '(max-width: 640px) 300px, 400px',
  };

  return (
    <OptimizedResponsiveImage
      {...props}
      width={width}
      height={height}
      quality={quality}
      responsiveSizes={sizeMap[size]}
      imageType="thumbnail"
      optimizeForCWV={optimizeForCWV}
      priority={false}
    />
  );
}

interface OptimizedBackgroundImageProps extends Omit<OptimizedResponsiveImageProps, 'fill' | 'sizes' | 'imageType'> {
  /**
   * Background images should fill their container
   */
  containerClassName?: string;
}

/**
 * Optimized background image component
 * Uses fill prop for absolute positioning
 */
export function OptimizedBackgroundImage({ 
  priority = false,
  quality = 75,
  className,
  optimizeForCWV = true,
  ...props 
}: OptimizedBackgroundImageProps) {
  return (
    <OptimizedResponsiveImage
      {...props}
      fill
      priority={priority}
      quality={quality}
      responsiveSizes="100vw"
      imageType="content"
      optimizeForCWV={optimizeForCWV}
      className={cn(
        'object-cover object-center',
        className
      )}
    />
  );
}

interface OptimizedAvatarImageProps extends Omit<OptimizedResponsiveImageProps, 'responsiveSizes' | 'imageType'> {
  size?: number;
}

/**
 * Optimized avatar/profile image component
 */
export function OptimizedAvatarImage({ 
  size = 64,
  quality = 85,
  aspectRatio = '1/1',
  optimizeForCWV = true,
  ...props 
}: OptimizedAvatarImageProps) {
  return (
    <OptimizedResponsiveImage
      {...props}
      width={size}
      height={size}
      quality={quality}
      aspectRatio={aspectRatio}
      responsiveSizes={`${size}px`}
      imageType="thumbnail"
      optimizeForCWV={optimizeForCWV}
      className={cn(
        'rounded-full',
        props.className
      )}
    />
  );
}

export { OptimizedResponsiveImage as default };