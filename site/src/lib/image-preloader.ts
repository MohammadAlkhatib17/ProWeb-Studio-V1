/**
 * Image preloader utility for critical images that impact LCP
 * Generates preload link tags for the most optimal image formats
 */

export interface PreloadImageConfig {
  src: string;
  sizes?: string;
  priority?: "high" | "low";
  type?:
    | "image/avif"
    | "image/webp"
    | "image/jpeg"
    | "image/png"
    | "image/svg+xml";
}

/**
 * Generates a preload link element for critical images
 * Should be used in page metadata for above-the-fold images
 */
export function generateImagePreload({
  src,
  sizes = "100vw",
  priority = "high",
  type = "image/avif",
}: PreloadImageConfig) {
  return {
    rel: "preload",
    as: "image",
    href: src,
    ...(sizes && { imageSizes: sizes }),
    ...(priority && { fetchPriority: priority }),
    ...(type && { type }),
  };
}

/**
 * Creates responsive srcSet for manual preloading
 * Useful for critical images with known dimensions
 */
export function generateResponsiveSrcSet(
  baseSrc: string,
  widths: number[] = [640, 750, 828, 1080, 1200, 1920],
  format: "avif" | "webp" | "jpg" = "avif",
): string {
  return widths
    .map((width) => {
      const src = baseSrc.replace(/\.(jpg|jpeg|png|webp|avif)$/i, `.${format}`);
      return `${src}?w=${width} ${width}w`;
    })
    .join(", ");
}

/**
 * Critical image sources that should be preloaded
 * Add your LCP images here
 */
export const CRITICAL_IMAGES = {
  // Hero backgrounds
  heroPortal: "/assets/hero_portal_background.avif",
  servicesNebula: "/assets/nebula_services_background.avif",
  contactBeacon: "/assets/glowing_beacon_contact.avif",

  // Logo and branding
  logoIcon: "/assets/logo/logo-proweb-icon.svg",

  // Team/About images
  teamCoreStar: "/assets/team_core_star.webp",
} as const;

/**
 * Generates preload configurations for all critical images
 */
export function getCriticalImagePreloads(): PreloadImageConfig[] {
  return [
    // Hero images - highest priority
    {
      src: CRITICAL_IMAGES.heroPortal,
      sizes: "100vw",
      priority: "high",
      type: "image/avif",
    },
    {
      src: CRITICAL_IMAGES.servicesNebula,
      sizes: "100vw",
      priority: "high",
      type: "image/avif",
    },
    {
      src: CRITICAL_IMAGES.contactBeacon,
      sizes: "100vw",
      priority: "high",
      type: "image/avif",
    },
    // Logo - medium priority
    {
      src: CRITICAL_IMAGES.logoIcon,
      sizes: "48px",
      priority: "high",
      type: "image/svg+xml",
    },
  ];
}

/**
 * Hook to preload images programmatically
 * Useful for dynamic image loading
 */
export function useImagePreloader() {
  const preloadImage = (src: string, priority: "high" | "low" = "low") => {
    if (typeof window === "undefined") return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = src;
    if (priority === "high") {
      link.setAttribute("fetchpriority", "high"); // Note: DOM attribute remains lowercase
    }

    document.head.appendChild(link);
  };

  const preloadImages = (
    images: string[],
    priority: "high" | "low" = "low",
  ) => {
    images.forEach((src) => preloadImage(src, priority));
  };

  return { preloadImage, preloadImages };
}

/**
 * Automatically preload critical images based on route
 */
export function getRouteSpecificPreloads(
  pathname: string,
): PreloadImageConfig[] {
  const preloads: PreloadImageConfig[] = [];

  switch (pathname) {
    case "/":
      preloads.push({
        src: CRITICAL_IMAGES.heroPortal,
        sizes: "100vw",
        priority: "high",
        type: "image/avif",
      });
      break;

    case "/diensten":
      preloads.push({
        src: CRITICAL_IMAGES.servicesNebula,
        sizes: "100vw",
        priority: "high",
        type: "image/avif",
      });
      break;

    case "/contact":
      preloads.push({
        src: CRITICAL_IMAGES.contactBeacon,
        sizes: "100vw",
        priority: "high",
        type: "image/avif",
      });
      break;
  }

  return preloads;
}
