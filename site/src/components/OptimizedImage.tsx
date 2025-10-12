// src/components/OptimizedImage.tsx
import { CSSProperties } from "react";

interface OptimizedImageProps {
  /** Base path without extension (e.g., '/assets/hero_portal_background') */
  baseSrc: string;
  /** PNG fallback path (e.g., '/assets/hero_portal_background.png') */
  fallbackSrc: string;
  /** Alt text for the image */
  alt: string;
  /** CSS classes for styling */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Loading strategy */
  loading?: "lazy" | "eager";
  /** Fetch priority */
  fetchPriority?: "high" | "low" | "auto";
  /** Sizes attribute for responsive images */
  sizes?: string;
  /** Image width */
  width?: number;
  /** Image height */
  height?: number;
}

/**
 * OptimizedImage component using Picture element to serve the best
 * image format (AVIF -> WebP -> PNG) with proper fallbacks.
 */
export default function OptimizedImage({
  baseSrc,
  fallbackSrc,
  alt,
  className = "",
  style,
  loading = "lazy",
  fetchPriority = "auto",
  sizes,
  width,
  height,
}: OptimizedImageProps) {
  return (
    <picture className={className} style={style}>
      {/* AVIF format - best compression */}
      <source srcSet={`${baseSrc}.avif`} type="image/avif" sizes={sizes} />
      {/* WebP format - good compression, wide support */}
      <source srcSet={`${baseSrc}.webp`} type="image/webp" sizes={sizes} />
      {/* PNG fallback - universal support */}
      <img
        src={fallbackSrc}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        width={width}
        height={height}
        className="w-full h-full"
        decoding="async"
      />
    </picture>
  );
}
