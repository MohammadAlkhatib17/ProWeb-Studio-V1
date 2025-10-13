/**
 * LCP-Optimized Image Component
 * 
 * Specialized component for above-the-fold images that are likely to be LCP elements.
 * Enforces performance constraints: ≤250KB, priority loading, optimal format ordering.
 * 
 * Performance features:
 * - Enforces AVIF > WebP > PNG format ordering
 * - Automatic priority loading for LCP elements  
 * - Responsive srcset generation for optimal sizing
 * - Prevents layout shift with explicit dimensions
 * - fetchPriority="high" for modern browsers
 */

import React from "react";
import { OptimizedHeroImage } from "@/components/ui/optimized-responsive-image";
import OptimizedImage from "@/components/OptimizedImage";

interface LCPOptimizedImageProps {
  /** Base path without extension (e.g., '/assets/hero_portal_background-optimized') */
  baseSrc: string;
  /** Fallback image path for PNG */
  fallbackSrc: string;
  /** Alt text for accessibility */
  alt: string;
  /** Image width for layout shift prevention */
  width: number;
  /** Image height for layout shift prevention */
  height: number;
  /** CSS classes */
  className?: string;
  /** Whether to generate responsive srcset */
  generateSrcSet?: boolean;
  /** Image type for optimal sizing */
  imageType?: "hero" | "content" | "thumbnail";
  /** Sizes attribute for responsive images */
  sizes?: string;
  /** Whether this image fills its container */
  fill?: boolean;
}

/**
 * LCP-optimized image component that enforces performance best practices
 * for above-the-fold images targeting mobile LCP ≤ 2.0s
 */
export function LCPOptimizedImage({
  baseSrc,
  fallbackSrc,
  alt,
  width,
  height,
  className = "",
  generateSrcSet = false,
  imageType = "hero",
  sizes,
  fill = false,
}: LCPOptimizedImageProps) {
  // Use picture element for explicit format control when srcset is needed
  if (generateSrcSet) {
    return (
      <OptimizedImage
        baseSrc={baseSrc}
        fallbackSrc={fallbackSrc}
        alt={alt}
        loading="eager"
        fetchPriority="high"
        imageType={imageType}
        generateSrcSet={true}
        width={width}
        height={height}
        sizes={sizes}
        className={className}
      />
    );
  }

  // Use Next.js Image for simple cases with automatic format optimization
  if (fill) {
    return (
      <OptimizedHeroImage
        src={`${baseSrc}.avif`}
        alt={alt}
        fill
        priority={true}
        quality={90}
        placeholder="empty"
        className={className}
      />
    );
  }

  return (
    <OptimizedHeroImage
      src={`${baseSrc}.avif`}
      alt={alt}
      width={width}
      height={height}
      priority={true}
      quality={90}
      placeholder="empty"
      className={className}
    />
  );
}

export default LCPOptimizedImage;