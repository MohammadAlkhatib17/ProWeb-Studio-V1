'use client';

import Link from 'next/link';
import type { Dienst } from '@/config/diensten.config';

interface GlassmorphicServiceCardProps {
  dienst: Dienst;
  stadSlug: string;
}

export default function GlassmorphicServiceCard({ dienst, stadSlug }: GlassmorphicServiceCardProps) {
  return (
    <Link
      href={`/steden/${stadSlug}/${dienst.slug}`}
      className="group relative overflow-hidden rounded-2xl 
                 bg-cosmic-800/20 backdrop-blur-xl 
                 border border-cosmic-700/30 
                 hover:border-cyan-400/60 
                 transition-all duration-500 ease-out
                 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/20"
    >
      {/* Gradient overlay on hover */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-magenta-500/5 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      />

      <div className="relative p-8">
        {/* Header with icon and delivery badge */}
        <div className="flex items-start justify-between mb-6">
          <div
            className="text-5xl transform group-hover:scale-110 
                       transition-transform duration-300 will-change-transform"
            aria-hidden="true"
          >
            {dienst.icon}
          </div>
          <span
            className="px-3 py-1 text-xs font-medium
                       bg-cyan-500/20 backdrop-blur-sm 
                       border border-cyan-400/30 text-cyan-300 rounded-full
                       group-hover:bg-cyan-500/30 transition-colors duration-300"
          >
            {dienst.deliveryTime}
          </span>
        </div>

        {/* Service title with gradient hover effect */}
        <h3
          className="text-2xl font-bold text-white mb-4 
                     group-hover:text-transparent group-hover:bg-gradient-to-r 
                     group-hover:from-cyan-300 group-hover:to-blue-400 
                     group-hover:bg-clip-text transition-all duration-300"
        >
          {dienst.name}
        </h3>

        {/* Description with consistent height */}
        <p className="text-slate-300 leading-relaxed mb-6 min-h-[4rem]">{dienst.shortDescription}</p>

        {/* Footer with pricing and animated arrow */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-sm font-semibold text-cyan-300">Vanaf {dienst.pricing.from}</span>
          <span
            className="text-cyan-300 transform group-hover:translate-x-2 
                       transition-transform duration-300 text-xl will-change-transform"
            aria-hidden="true"
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
