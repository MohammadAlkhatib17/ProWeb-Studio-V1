// src/components/HeroBackground.tsx
import { LCPOptimizedImage } from "@/components/ui/LCPOptimizedImage";

export default function HeroBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <LCPOptimizedImage
        baseSrc="/assets/hero/nebula_helix"
        fallbackSrc="/assets/hero/nebula_helix.jpg"
        alt=""
        width={1920}
        height={1080}
        fill={true}
        imageType="hero"
        generateSrcSet={false}
      />
    </div>
  );
}
