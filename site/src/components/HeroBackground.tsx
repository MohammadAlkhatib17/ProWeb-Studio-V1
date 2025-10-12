// src/components/HeroBackground.tsx
import { HeroImage } from "@/components/ui/responsive-image";

export default function HeroBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <HeroImage
        src="/assets/hero/nebula_helix.avif"
        alt=""
        fill
        priority={true}
        quality={90}
        className="object-cover"
        sizes="100vw"
      />
    </div>
  );
}
