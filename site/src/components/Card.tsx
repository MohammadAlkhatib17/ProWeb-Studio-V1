"use client";

import { useState } from "react";
import { designSystem } from "@/lib/design-system";

interface CardProps {
  title: string;
  category: string;
  description: string;
  metrics: string;
}

export default function Card({
  title,
  category,
  description,
  metrics,
}: CardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (y - 0.5) * 12,
      y: (x - 0.5) * -12,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      className="glass p-6 sm:p-7 md:p-8 rounded-xl cursor-pointer transition-all duration-300 hover:border-cyan-500/60 hover:shadow-2xl hover:shadow-cyan-500/20 group relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.03 : 1})`,
        transition:
          "transform 0.3s cubic-bezier(0.23, 1, 0.320, 1), border-color 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      {/* Animated gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-transparent to-magenta-500/8 rounded-xl transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Subtle glow effect */}
      <div
        className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10">
        <span className={`${designSystem.typography.bodySecondary} text-cyan-300 font-medium tracking-wide uppercase mb-3 block group-hover:text-cyan-300 transition-colors duration-300`}>
          {category}
        </span>
        <h3 className={`${designSystem.typography.subsectionTitle} group-hover:text-cyan-300 transition-colors duration-300`}>
          {title}
        </h3>
        <p className={`${designSystem.typography.bodySecondary} text-slate-200 mb-6`}>
          {description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-magenta-400 font-semibold text-base sm:text-lg group-hover:text-magenta-300 transition-colors duration-300">
            {metrics}
          </span>
          <span className="text-cyan-300 text-base sm:text-lg md:text-xl group-hover:translate-x-1 transition-transform duration-300">
            →
          </span>
        </div>
      </div>

      {/* Animated border effect */}
      <div
        className={`absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-cyan-500/20 via-transparent to-magenta-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        style={{
          background: isHovered
            ? "linear-gradient(45deg, rgba(0, 255, 255, 0.1), transparent, rgba(255, 0, 255, 0.1))"
            : "transparent",
          backgroundSize: "200% 200%",
          animation: isHovered ? "gradientShift 3s ease infinite" : "none",
        }}
      />
    </div>
  );
}
