import React from "react";
import { designSystem, designClasses } from "@/lib/design-system";
import { Button } from "@/components/Button";
import { HeroVignetteOverlay, VignettePresets } from "@/components/ui/HeroVignetteOverlay";

interface HeroSectionProps {
  children?: React.ReactNode;
  title: string;
  description?: string;
  primaryCTA?: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  className?: string;
  backgroundContent?: React.ReactNode; // For 3D scenes or background images
  /** 
   * Vignette configuration for text contrast enhancement
   * Uses preset configurations or custom settings
   */
  vignette?: {
    preset?: keyof typeof VignettePresets;
    intensity?: "subtle" | "moderate" | "strong";
    enableBlur?: boolean;
    customOpacity?: number;
    enableEdgeVignette?: boolean;
  };
}

/**
 * Unified Hero Section Component
 * 
 * SPECIFICATIONS:
 * - Height: clamp(68vh, 64vh + 4vw, 84vh) for consistent viewport adaptation
 * - H1: Uses designSystem.typography.h1 (pageTitle) with custom mb-0 override
 * - Body: max-w-prose (~65ch) for optimal reading width
 * - Gap: 24px (1.5rem) fixed between H1 and body text
 * - CTA: 16px gap between buttons in row layout
 * - Vignette: Consistent overlay to prevent 3D mesh text occlusion
 * - Safe zone: 3D content bounded to prevent overlap on ≥360px screens
 */
export function HeroSection({
  children,
  title,
  description,
  primaryCTA,
  secondaryCTA,
  className,
  backgroundContent,
  vignette = { preset: "standard" },
}: HeroSectionProps) {
  return (
    <section
      className={designClasses(
        // Unified height specification
        "relative overflow-hidden flex items-center justify-center",
        "px-4 sm:px-6", // Horizontal padding
        className
      )}
      style={{
        minHeight: "clamp(68vh, calc(64vh + 4vw), 84vh)",
      }}
    >
      {/* 3D Background Content with Safe Bounding */}
      {backgroundContent && (
        <div className="absolute inset-0">
          {/* 3D Safe Zone Container - prevents mesh overlap on ≥360px */}
          <div 
            className="absolute inset-0"
            style={{
              // Create safe zones: 20% margin from edges on larger screens
              clipPath: "polygon(0 0, 100% 0, 100% 80%, 80% 100%, 20% 100%, 0 20%)"
            }}
          >
            {backgroundContent}
          </div>
        </div>
      )}

      {/* Enhanced Vignette Overlay for WCAG AA Contrast */}
      <HeroVignetteOverlay 
        {...(vignette.preset ? VignettePresets[vignette.preset] : {})}
        {...vignette}
      />

      {/* Content Container with proper z-index */}
      <div className={designClasses(
        "relative z-10 text-center",
        designSystem.spacing.container, // max-w-7xl mx-auto
        "flex flex-col items-center justify-center h-full py-8"
      )}>
        {/* H1 Title - Uses design system with enhanced contrast */}
        <h1 
          className={designClasses(
            // Use design system H1 but override margin-bottom for precise control
            designSystem.typography.pageTitle.replace("mb-6", "mb-0"),
            "hero-text-shadow text-high-contrast" // Enhanced contrast and shadow
          )}
        >
          {title}
        </h1>

        {/* Fixed 24px gap between H1 and body */}
        <div className="h-6" /> {/* 24px spacer */}

        {/* Body Text - max-w-prose (~65ch) for optimal readability */}
        {description && (
          <p className={designClasses(
            designSystem.typography.bodyPrimary,
            "max-w-prose text-center leading-relaxed mb-0 hero-text-shadow-subtle text-medium-contrast" // Enhanced readability
          )}>
            {description}
          </p>
        )}

        {/* CTA Section with 16px row gap */}
        {(primaryCTA || secondaryCTA) && (
          <>
            {/* Fixed gap between description and CTAs */}
            <div className="h-8" /> {/* 32px spacer for visual breathing room */}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {primaryCTA && (
                <Button href={primaryCTA.href} variant="primary" size="large">
                  {primaryCTA.text}
                </Button>
              )}
              {secondaryCTA && (
                <Button href={secondaryCTA.href} variant="secondary" size="large">
                  {secondaryCTA.text}
                </Button>
              )}
            </div>
          </>
        )}

        {/* Additional custom content */}
        {children && (
          <>
            <div className="h-6" /> {/* 24px spacer */}
            {children}
          </>
        )}
      </div>
    </section>
  );
}

/**
 * Specialized Hero variants for common use cases
 */

interface SimpleHeroProps {
  title: string;
  description: string;
  primaryCTA: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
  backgroundContent?: React.ReactNode;
  className?: string;
  vignette?: {
    preset?: keyof typeof VignettePresets;
    intensity?: "subtle" | "moderate" | "strong";
    enableBlur?: boolean;
    customOpacity?: number;
    enableEdgeVignette?: boolean;
  };
}

export function SimpleHero({ 
  title, 
  description, 
  primaryCTA, 
  secondaryCTA, 
  backgroundContent,
  className,
  vignette 
}: SimpleHeroProps) {
  return (
    <HeroSection
      title={title}
      description={description}
      primaryCTA={primaryCTA}
      secondaryCTA={secondaryCTA}
      backgroundContent={backgroundContent}
      className={className}
      vignette={vignette}
    />
  );
}

interface CustomContentHeroProps {
  title: string;
  backgroundContent?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  vignette?: {
    preset?: keyof typeof VignettePresets;
    intensity?: "subtle" | "moderate" | "strong";
    enableBlur?: boolean;
    customOpacity?: number;
    enableEdgeVignette?: boolean;
  };
}

export function CustomContentHero({ 
  title, 
  backgroundContent, 
  className, 
  children,
  vignette 
}: CustomContentHeroProps) {
  return (
    <HeroSection
      title={title}
      backgroundContent={backgroundContent}
      className={className}
      vignette={vignette}
    >
      {children}
    </HeroSection>
  );
}

// Export the main component as default
export default HeroSection;