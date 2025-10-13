"use client";

import React from "react";
import { cn } from "@/lib/utils";

type CardVariant = "default" | "highlight" | "subtle";

export interface ContentCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
  interactive?: boolean;
  as?: "div" | "article" | "section";
  onClick?: () => void;
}

const ContentCard = React.forwardRef<HTMLDivElement, ContentCardProps>(
  (
    {
      children,
      variant = "default",
      className,
      interactive = true,
      as: Component = "div",
      onClick,
      ...props
    },
    ref
  ) => {
    // Base styles with radius-2xl and standard padding
    const baseStyles = "rounded-2xl p-6 md:p-8 transition-all duration-300";

    // Variant styles
    const variantStyles = {
      default:
        "glass border border-cosmic-700/50 hover:border-cyan-400/50 hover:bg-cosmic-800/50",
      highlight:
        "glass border border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 via-transparent to-magenta-500/5 hover:border-cyan-400/60 hover:shadow-2xl hover:shadow-cyan-500/10",
      subtle:
        "bg-cosmic-800/30 backdrop-blur-sm border border-cosmic-700/30 hover:border-primary-500/50 hover:bg-cosmic-800/40",
    };

    // Interactive styles
    const interactiveStyles = interactive
      ? "group relative overflow-hidden cursor-pointer"
      : "relative";

    // Hover overlay for interactive cards
    const hoverOverlay = interactive && (
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-magenta-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
    );

    return (
      <Component
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          interactiveStyles,
          className
        )}
        onClick={onClick}
        {...props}
      >
        {hoverOverlay}
        <div className="relative z-10">{children}</div>
      </Component>
    );
  }
);

ContentCard.displayName = "ContentCard";

export { ContentCard };