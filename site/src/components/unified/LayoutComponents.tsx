import React from "react";
import { designSystem, designClasses } from "@/lib/design-system";

// Page Layout Component for consistent page structure
interface PageLayoutProps {
  children: React.ReactNode;
  variant?: "standard" | "fullHeight" | "compact";
  className?: string;
}

export function PageLayout({
  children,
  variant = "standard",
  className,
}: PageLayoutProps) {
  const baseClasses =
    variant === "standard"
      ? designSystem.spacing.pageTop + " relative min-h-screen"
      : variant === "fullHeight"
        ? designSystem.spacing.pageTop + " relative min-h-screen"
        : designSystem.spacing.pageTop + " relative";

  return (
    <main className={designClasses(baseClasses, className)}>{children}</main>
  );
}

// Section Layout Component for consistent section structure
interface SectionLayoutProps {
  children: React.ReactNode;
  variant?: "hero" | "content" | "alternate" | "features" | "compact";
  className?: string;
  id?: string;
}

export function SectionLayout({
  children,
  variant = "content",
  className,
  id,
}: SectionLayoutProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "hero":
        return designClasses(
          designSystem.components.heroSection,
          designSystem.spacing.container,
        );
      case "content":
        return designClasses(
          designSystem.components.contentSection,
          designSystem.spacing.container,
        );
      case "alternate":
        return designClasses(
          designSystem.components.contentSection,
          designSystem.colors.bgSecondary,
          designSystem.spacing.container,
        );
      case "features":
        return designClasses(
          designSystem.components.contentSection,
          designSystem.spacing.container,
        );
      case "compact":
        return designClasses(
          designSystem.spacing.sectionPaddingCompact,
          designSystem.spacing.container,
        );
      default:
        return designClasses(
          designSystem.components.contentSection,
          designSystem.spacing.container,
        );
    }
  };

  return (
    <section id={id} className={designClasses(getVariantClasses(), className)}>
      {children}
    </section>
  );
}

// Typography Components for consistent text styling
interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function PageTitle({
  children,
  className,
  as: Component = "h1",
}: TypographyProps) {
  return (
    <Component
      className={designClasses(designSystem.typography.pageTitle, className)}
    >
      {children}
    </Component>
  );
}

export function SectionTitle({
  children,
  className,
  as: Component = "h2",
}: TypographyProps) {
  return (
    <Component
      className={designClasses(designSystem.typography.sectionTitle, className)}
    >
      {children}
    </Component>
  );
}

export function SubsectionTitle({
  children,
  className,
  as: Component = "h3",
}: TypographyProps) {
  return (
    <Component
      className={designClasses(
        designSystem.typography.subsectionTitle,
        className,
      )}
    >
      {children}
    </Component>
  );
}

export function CardTitle({
  children,
  className,
  as: Component = "h4",
}: TypographyProps) {
  return (
    <Component
      className={designClasses(designSystem.typography.cardTitle, className)}
    >
      {children}
    </Component>
  );
}

export function BodyText({
  children,
  className,
  variant = "primary",
}: TypographyProps & { variant?: "primary" | "secondary" }) {
  const variantClass =
    variant === "primary"
      ? designSystem.typography.bodyPrimary
      : designSystem.typography.bodySecondary;

  return <p className={designClasses(variantClass, className)}>{children}</p>;
}

export function Subtitle({ children, className }: TypographyProps) {
  return (
    <p className={designClasses(designSystem.typography.subtitle, className)}>
      {children}
    </p>
  );
}

// Feature Card Component for consistent feature presentation
interface FeatureCardProps {
  title: string;
  description: string;
  icon?: string;
  features?: string[];
  className?: string;
  interactive?: boolean;
}

export function FeatureCard({
  title,
  description,
  icon,
  features,
  className,
  interactive = true,
}: FeatureCardProps) {
  const cardClasses = interactive
    ? designSystem.components.cardHover
    : designSystem.components.card;

  return (
    <div className={designClasses(cardClasses, className)}>
      {icon && <div className="text-3xl md:text-4xl mb-4">{icon}</div>}
      <CardTitle className="mb-3">{title}</CardTitle>
      <BodyText variant="secondary" className="mb-4">
        {description}
      </BodyText>
      {features && features.length > 0 && (
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li
              key={index}
              className="text-sm text-slate-300 flex items-center"
            >
              <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 flex-shrink-0"></span>
              {feature}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Grid Layouts for consistent content organization
interface GridLayoutProps {
  children: React.ReactNode;
  variant?: "features" | "twoColumn" | "threeColumn" | "autoFit";
  className?: string;
}

export function GridLayout({
  children,
  variant = "features",
  className,
}: GridLayoutProps) {
  const getGridClasses = () => {
    switch (variant) {
      case "features":
        return designSystem.grids.features;
      case "twoColumn":
        return designSystem.grids.twoColumn;
      case "threeColumn":
        return designSystem.grids.threeColumn;
      case "autoFit":
        return designSystem.grids.autoFit;
      default:
        return designSystem.grids.features;
    }
  };

  return (
    <div className={designClasses(getGridClasses(), className)}>{children}</div>
  );
}

// CTA Section Component for consistent call-to-action sections
interface CTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  variant?: "primary" | "secondary";
  className?: string;
}

export function CTASection({
  title,
  description,
  buttonText,
  buttonHref,
  variant = "primary",
  className,
}: CTASectionProps) {
  return (
    <SectionLayout
      variant="content"
      className={designClasses("text-center", className)}
    >
      <SectionTitle className="mb-6">{title}</SectionTitle>
      <BodyText className="mb-8 max-w-3xl mx-auto">{description}</BodyText>
      <a
        href={buttonHref}
        className={designClasses(
          "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 min-h-[44px] px-8 py-3.5 text-base",
          variant === "primary"
            ? "bg-gradient-to-r from-cyan-500 to-magenta-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/40 text-black"
            : "border border-cyan-500/60 hover:bg-cyan-500/10 hover:border-cyan-400 text-cyan-100 hover:shadow-lg hover:shadow-cyan-500/30",
        )}
      >
        {buttonText}
      </a>
    </SectionLayout>
  );
}
