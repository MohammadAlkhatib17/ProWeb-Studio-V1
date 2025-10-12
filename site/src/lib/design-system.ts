// Unified Design System for ProWeb Studio
// This file contains all design tokens, component variants, and utility classes
// for consistent visual presentation across all pages

export const designSystem = {
  // Typography Hierarchy
  typography: {
    // Page Titles (H1)
    pageTitle:
      "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 glow-text leading-tight",

    // Section Titles (H2)
    sectionTitle:
      "text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white leading-tight",

    // Subsection Titles (H3)
    subsectionTitle:
      "text-lg sm:text-xl md:text-2xl font-semibold mb-3 text-cyan-300 leading-tight",

    // Card/Component Titles (H4)
    cardTitle:
      "text-base sm:text-lg md:text-xl font-semibold mb-2 text-white leading-tight",

    // Body Text - Primary
    bodyPrimary: "text-base sm:text-lg text-slate-200 leading-relaxed",

    // Body Text - Secondary (descriptions, captions)
    bodySecondary: "text-sm sm:text-base text-slate-300 leading-relaxed",

    // Subtitle/Lead Text
    subtitle: "text-base sm:text-lg md:text-xl text-cyan-300 leading-relaxed",
  },

  // Spacing System
  spacing: {
    // Page top padding (accounting for header)
    pageTop: "content-safe-top pt-20 md:pt-24",

    // Section padding
    sectionPadding: "py-12 md:py-16 lg:py-20 px-4 sm:px-6",

    // Compact section padding
    sectionPaddingCompact: "py-8 md:py-12 px-4 sm:px-6",

    // Container with consistent max-width
    container: "max-w-7xl mx-auto",

    // Content container (narrower for readability)
    contentContainer: "max-w-4xl mx-auto",

    // Component spacing
    componentSpacing: "mb-8 md:mb-12",

    // Element spacing
    elementSpacing: "mb-4 md:mb-6",
  },

  // Visual Effects
  effects: {
    // Glass morphism
    glass: "glass backdrop-blur-md bg-white/5 border border-white/10",

    // Enhanced glass with hover
    glassInteractive:
      "glass backdrop-blur-md bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-white/8 transition-all duration-300",

    // Magnetic hover effect
    magneticHover: "magnetic-hover hover:scale-105 transition-all duration-300",

    // Glow effect for important elements
    glow: "hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300",

    // Gradient backgrounds
    gradientPrimary: "bg-gradient-to-r from-cyan-500 to-magenta-500",
    gradientSubtle: "bg-gradient-to-r from-cyan-500/10 to-magenta-500/5",
  },

  // Color Palette (semantic colors)
  colors: {
    // Text Colors
    textPrimary: "text-white",
    textSecondary: "text-slate-200",
    textMuted: "text-slate-300",
    textAccent: "text-cyan-300",
    textError: "text-red-400",

    // Background Colors
    bgPrimary: "bg-cosmic-900",
    bgSecondary: "bg-cosmic-800/20",
    bgAccent: "bg-cyan-500/10",

    // Border Colors
    borderDefault: "border-cosmic-700/60",
    borderAccent: "border-cyan-500/60",
    borderHover: "border-cyan-400",
  },

  // Component Patterns
  components: {
    // Card base styles
    card: "glass p-6 rounded-lg transition-all duration-300",
    cardHover:
      "glass p-6 rounded-lg hover:border-cyan-500/50 hover:bg-white/8 transition-all duration-300",

    // Feature list styling
    featureList:
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8",

    // Hero section
    heroSection:
      "relative py-16 md:py-20 lg:py-24 px-4 sm:px-6 text-center overflow-hidden",

    // Content section
    contentSection: "py-12 md:py-16 lg:py-20 px-4 sm:px-6",

    // Two-column layout
    twoColumnGrid:
      "grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center",
  },

  // Button Variants (extending the existing Button component)
  buttons: {
    // CTA buttons should use the Button component with primary variant
    primaryCTA: "primary", // Use with Button component
    secondaryCTA: "secondary", // Use with Button component

    // Inline link styling for navigation
    inlineLink:
      "text-cyan-300 hover:text-cyan-200 underline underline-offset-4 transition-colors duration-300",
  },

  // Layout Grids
  grids: {
    // Service/feature grids
    features: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8",

    // Two column content
    twoColumn: "grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center",

    // Three column content
    threeColumn:
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8",

    // Auto-fit responsive
    autoFit:
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6",
  },
} as const;

// Utility function to combine design system classes
export function designClasses(
  ...classes: (string | undefined | null | false)[]
): string {
  return classes.filter(Boolean).join(" ");
}

// Page Layout Components
export const pageVariants = {
  // Standard page layout
  standard: `${designSystem.spacing.pageTop} relative min-h-screen`,

  // Full-height page (for hero pages)
  fullHeight: `${designSystem.spacing.pageTop} relative min-h-screen`,

  // Compact page (for forms, simple content)
  compact: `${designSystem.spacing.pageTop} relative`,
} as const;

// Common section layouts
export const sectionVariants = {
  // Hero section with centered content
  hero: `${designSystem.components.heroSection} ${designSystem.spacing.container}`,

  // Standard content section
  content: `${designSystem.components.contentSection} ${designSystem.spacing.container}`,

  // Alternate background section
  alternate: `${designSystem.components.contentSection} ${designSystem.colors.bgSecondary} ${designSystem.spacing.container}`,

  // Feature showcase section
  features: `${designSystem.components.contentSection} ${designSystem.spacing.container}`,
} as const;
