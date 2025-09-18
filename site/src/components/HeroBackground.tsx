// src/components/HeroBackground.tsx
export default function HeroBackground() {
  return (
    <picture className="fixed inset-0 -z-10 pointer-events-none">
      <source srcSet="/assets/hero/nebula_helix.avif" type="image/avif" />
      {/* Use a guaranteed existing PNG fallback to avoid 404s */}
      <img
        src="/assets/hero_portal_background.png"
        alt=""
        className="w-full h-full object-cover"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
    </picture>
  );
}
