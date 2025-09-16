'use client';
import Link from 'next/link';
import React from 'react';
import { useMobileLogoDock } from '@/hooks/useMobileLogoDock';

export default function LogoDock({
  href = '/',
  children,
}: {
  href?: string;
  children: React.ReactNode; // pass the existing logo component here
}) {
  const { isMobile, condensed } = useMobileLogoDock();

  // Base anchor: relative so ::before can wrap the glyph; generous hit-area.
  const base =
    'relative inline-flex items-center justify-center rounded-xl select-none ' +
    'align-middle leading-none text-white';

  // Neon/glass badge that SURROUNDS the icon (never below it)
  const badge =
    'before:content-[""] before:absolute before:-inset-[6px] before:rounded-[12px] ' +
    'before:bg-white/8 before:backdrop-blur-md before:ring-1 before:ring-white/15 ' +
    'before:shadow-[0_0_0_1px_rgba(255,255,255,.06),0_0_22px_rgba(34,211,238,.28)]';

  // Focus outline that hugs the badge
  const focus =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 ' +
    'focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900';

  // Sizing: ensure min 40×40 tap target, but DO NOT scale the inner logo graphic directly.
  const sizeMobile = condensed ? 'w-11 h-11' : 'w-10 h-10';
  const sizeDesktop = 'md:w-10 md:h-10';

  // Mobile dock: fixed + safe-areas; Desktop: static. Transform origin top-left.
  const motion =
    (isMobile
      ? 'fixed left-[max(8px,env(safe-area-inset-left))] top-[max(8px,env(safe-area-inset-top))] z-50 ' +
        'will-change-transform transition-transform duration-300 ease-out ' +
        (condensed ? 'scale-110 -translate-x-[2px] -translate-y-[1px]' : 'scale-100')
      : 'md:static md:scale-100') +
    ' [transform-origin:top_left]';

  return (
    <Link href={href} aria-label="Home"
      className={[base, badge, focus, motion, sizeMobile, sizeDesktop].join(' ')}
    >
      {/* Keep the existing logo exactly as-is */}
      <span className="relative z-[1] block min-w-[40px] min-h-[40px]">
        <span className="absolute inset-0 flex items-center justify-center">
          {children}
        </span>
      </span>
    </Link>
  );
}