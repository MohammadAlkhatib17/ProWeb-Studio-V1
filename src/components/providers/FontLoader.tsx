'use client';

import { useEffect } from 'react';
import { loadFonts } from '@/lib/font-loader';

export function FontLoader() {
  useEffect(() => {
    // Load fonts asynchronously
    loadFonts();
  }, []);
  
  return null;
}
