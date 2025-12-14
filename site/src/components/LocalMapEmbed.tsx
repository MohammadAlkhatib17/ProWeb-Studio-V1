import React from 'react';

interface LocalMapEmbedProps {
    cityName: string;
    lat?: number;
    lng?: number;
}

export default function LocalMapEmbed({ cityName, lat, lng }: LocalMapEmbedProps) {
    // Fallback if no coordinates provided, just search by city name
    const mapSrc = lat && lng
        ? `https://maps.google.com/maps?q=${lat},${lng}&hl=nl&z=13&output=embed`
        : `https://maps.google.com/maps?q=${encodeURIComponent(cityName)},Netherlands&hl=nl&z=13&output=embed`;

    return (
        <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-cosmic-900 group">
            {/* Decorative overlay prevents interaction until hover/click if desired, 
          but here we want interaction. We add a loading skeleton though. */}

            <div className="absolute inset-0 bg-cosmic-800 animate-pulse -z-10" />

            <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={mapSrc}
                title={`Kaart van ${cityName}`}
                loading="lazy"
                className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700 opacity-80 hover:opacity-100"
            />

            {/* Brand overlay */}
            <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/30 text-xs font-mono text-cyan-400 pointer-events-none">
                Active in {cityName} Region
            </div>
        </div>
    );
}
