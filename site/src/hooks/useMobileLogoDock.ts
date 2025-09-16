'use client';
import { useEffect, useState } from 'react';

export function useMobileLogoDock() {
  const [isMobile, setIsMobile] = useState(false);
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    const isM = () => window.innerWidth < 768;
    const updateMobile = () => setIsMobile(isM());
    const updateScroll = () => setCondensed(isM() && window.scrollY > 24);

    let raf: number | null = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        updateScroll();
        raf = null;
      });
    };

    updateMobile();
    updateScroll();

    window.addEventListener('resize', updateMobile, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', updateMobile);
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return { isMobile, condensed };
}