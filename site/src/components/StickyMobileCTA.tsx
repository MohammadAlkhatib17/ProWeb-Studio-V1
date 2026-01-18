'use client';

/**
 * StickyMobileCTA - Fixed bottom CTA bar for mobile devices
 * Improves conversion by keeping CTA always visible on mobile
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface StickyMobileCTAProps {
    dienstName: string;
    stadName: string;
}

export default function StickyMobileCTA({ dienstName, stadName }: StickyMobileCTAProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isScrollingUp, setIsScrollingUp] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show after scrolling past hero (300px)
            if (currentScrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }

            // Track scroll direction for hiding on scroll down
            if (currentScrollY < lastScrollY) {
                setIsScrollingUp(true);
            } else {
                setIsScrollingUp(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Only show on mobile and when scrolled past hero
    const shouldShow = isVisible && isScrollingUp;

    return (
        <>
            {/* Spacer to prevent content jump when CTA appears */}
            <div className="h-0 md:hidden" />

            {/* Sticky CTA Bar */}
            <div
                className={`
          fixed bottom-0 left-0 right-0 z-50 md:hidden
          bg-gradient-to-t from-cosmic-950 via-cosmic-900/95 to-cosmic-900/90
          backdrop-blur-lg border-t border-cyan-500/20
          transform transition-transform duration-300 ease-out
          ${shouldShow ? 'translate-y-0' : 'translate-y-full'}
          safe-area-inset-bottom
        `}
                style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
                <div className="px-4 py-3">
                    {/* Service context */}
                    <p className="text-xs text-slate-400 text-center mb-2 truncate">
                        {dienstName} in {stadName}
                    </p>

                    {/* Main CTA */}
                    <Link
                        href="/contact"
                        className="
              block w-full py-3 px-6
              bg-gradient-to-r from-cyan-500 to-blue-600
              hover:from-cyan-400 hover:to-blue-500
              text-white font-semibold text-center
              rounded-lg shadow-lg shadow-cyan-500/25
              transition-all duration-200
              active:scale-[0.98]
            "
                    >
                        Vraag Offerte Aan →
                    </Link>

                    {/* Secondary actions */}
                    <div className="flex justify-center gap-6 mt-3 pb-1">
                        <a
                            href="tel:+31858769583"
                            className="text-xs text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                        >
                            <span>📞</span> Bel Direct
                        </a>
                        <a
                            href="mailto:contact@prowebstudio.nl"
                            className="text-xs text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                        >
                            <span>✉️</span> E-mail
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
