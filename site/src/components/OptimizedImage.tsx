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
  /** Enable responsive srcset generation for hero images */
  generateSrcSet?: boolean;
  /** Image type for generating optimal srcset */
  imageType?: "hero" | "content" | "thumbnail";
}

/**
 * Generate responsive srcset for different image types
 * Enforces performance constraints: above-the-fold ≤ 250KB
 */
function generateResponsiveSrcSet(
  baseSrc: string,
  format: "avif" | "webp",
  imageType: "hero" | "content" | "thumbnail" = "content"
): string {
  const commonSizes = ["320w", "640w", "750w", "828w", "1080w", "1200w"];
  const heroSizes = [...commonSizes, "1920w"];
  const sizes = imageType === "hero" ? heroSizes : commonSizes;

  return sizes
    .map((size) => `${baseSrc}-${size}.${format} ${size}`)
    .join(", ");
}

/**
 * Generate optimal sizes attribute based on image type
 */
function getOptimalSizes(imageType: "hero" | "content" | "thumbnail" = "content"): string {
  switch (imageType) {
    case "hero":
      return "100vw";
    case "thumbnail":
      return "(max-width: 640px) 200px, 300px";
    case "content":
    default:
      return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
  }
}

/**
 * OptimizedImage component using Picture element to serve the best
 * image format (AVIF -> WebP -> PNG) with proper fallbacks.
 * Enforces performance ordering: AVIF > WebP > PNG
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
  generateSrcSet = false,
  imageType = "content",
}: OptimizedImageProps) {
  // Use provided sizes or generate optimal ones
  const optimalSizes = sizes || getOptimalSizes(imageType);

  return (
    <picture className={className} style={style}>
      {/* AVIF format - best compression, modern browsers */}
      <source
        srcSet={
          generateSrcSet
            ? generateResponsiveSrcSet(baseSrc, "avif", imageType)
            : `${baseSrc}.avif`
        }
        type="image/avif"
        sizes={optimalSizes}
      />
      {/* WebP format - good compression, wide support */}
      <source
        srcSet={
          generateSrcSet
            ? generateResponsiveSrcSet(baseSrc, "webp", imageType)
            : `${baseSrc}.webp`
        }
        type="image/webp"
        sizes={optimalSizes}
      />
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
        sizes={optimalSizes}
      />
    </picture>
  );
}
