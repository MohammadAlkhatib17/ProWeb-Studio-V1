'use client';

import { memo } from 'react';

interface CosmicLoaderProps {
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Optional loading message */
    message?: string;
    /** Optional submessage */
    submessage?: string;
    /** Custom class name */
    className?: string;
    /** Show minimal version (just spinner, no text) */
    minimal?: boolean;
}

/**
 * Premium 3D Loading Indicator with cosmic theme.
 * Used as Suspense fallback for all 3D scenes across the site.
 */
function CosmicLoaderComponent({
    size = 'md',
    message = 'Laden...',
    submessage,
    className = '',
    minimal = false,
}: CosmicLoaderProps) {
    const sizeClasses = {
        sm: 'w-12 h-12',
        md: 'w-20 h-20',
        lg: 'w-28 h-28',
    };

    const innerSizes = {
        sm: { ring1: 'inset-0', ring2: 'inset-1', ring3: 'inset-2', core: 'inset-3' },
        md: { ring1: 'inset-0', ring2: 'inset-2', ring3: 'inset-4', core: 'inset-6' },
        lg: { ring1: 'inset-0', ring2: 'inset-3', ring3: 'inset-6', core: 'inset-9' },
    };

    const insets = innerSizes[size];

    if (minimal) {
        return (
            <div className={`relative ${sizeClasses[size]} ${className}`}>
                {/* Outer ping ring */}
                <div className={`absolute ${insets.ring1} rounded-full border-2 border-cyan-500/30 animate-ping`} />
                {/* Primary spinning ring */}
                <div
                    className={`absolute ${insets.ring2} rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-magenta-400 border-l-transparent animate-spin`}
                />
                {/* Secondary counter-spinning ring */}
                <div
                    className={`absolute ${insets.ring3} rounded-full border-2 border-t-transparent border-r-cyan-300 border-b-transparent border-l-magenta-300 animate-spin`}
                    style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
                />
                {/* Pulsing core */}
                <div className={`absolute ${insets.core} rounded-full bg-gradient-to-br from-cyan-500 to-magenta-500 animate-pulse`} />
            </div>
        );
    }

    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <div className={`relative ${sizeClasses[size]} mx-auto mb-6`}>
                {/* Outer ping ring */}
                <div className={`absolute ${insets.ring1} rounded-full border-2 border-cyan-500/30 animate-ping`} />
                {/* Primary spinning ring */}
                <div
                    className={`absolute ${insets.ring2} rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-magenta-400 border-l-transparent animate-spin`}
                />
                {/* Secondary counter-spinning ring */}
                <div
                    className={`absolute ${insets.ring3} rounded-full border-2 border-t-transparent border-r-cyan-300 border-b-transparent border-l-magenta-300 animate-spin`}
                    style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
                />
                {/* Pulsing core */}
                <div className={`absolute ${insets.core} rounded-full bg-gradient-to-br from-cyan-500 to-magenta-500 animate-pulse`} />
            </div>
            <p className="text-cyan-300 text-sm font-medium mb-1">{message}</p>
            {submessage && <p className="text-slate-500 text-xs">{submessage}</p>}
        </div>
    );
}

export const CosmicLoader = memo(CosmicLoaderComponent);

/**
 * Full-container 3D loading fallback with backdrop.
 * Use this as the Suspense fallback for full-screen 3D scenes.
 */
export function Scene3DFallback({
    message = 'Universum Laden...',
    submessage = 'Bereid je voor op de reis',
}: {
    message?: string;
    submessage?: string;
}) {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
            <CosmicLoader size="lg" message={message} submessage={submessage} />
        </div>
    );
}

/**
 * Cosmic-themed skeleton pulse for cards/grids.
 */
export function CosmicSkeleton({ className = '' }: { className?: string }) {
    return (
        <div
            className={`bg-gradient-to-br from-cosmic-800/50 via-cosmic-900/50 to-cosmic-800/50 animate-pulse rounded-xl border border-cosmic-700/30 ${className}`}
        />
    );
}

export default CosmicLoader;
