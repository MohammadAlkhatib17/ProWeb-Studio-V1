'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Hook to detect the first user input and defer non-critical listeners
 * This helps reduce INP (Interaction to Next Paint) outliers
 */
export function useFirstInput() {
  const [hasFirstInput, setHasFirstInput] = useState(false);
  const listenerAdded = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || listenerAdded.current) return;

    const handleFirstInput = () => {
      setHasFirstInput(true);
      // Remove listeners once first input is detected
      window.removeEventListener('pointerdown', handleFirstInput, { passive: true } as AddEventListenerOptions);
      window.removeEventListener('keydown', handleFirstInput, { passive: true } as AddEventListenerOptions);
      window.removeEventListener('touchstart', handleFirstInput, { passive: true } as AddEventListenerOptions);
    };

    // Listen for first meaningful user interaction
    window.addEventListener('pointerdown', handleFirstInput, { passive: true });
    window.addEventListener('keydown', handleFirstInput, { passive: true });
    window.addEventListener('touchstart', handleFirstInput, { passive: true });

    listenerAdded.current = true;

    return () => {
      if (listenerAdded.current) {
        window.removeEventListener('pointerdown', handleFirstInput);
        window.removeEventListener('keydown', handleFirstInput);
        window.removeEventListener('touchstart', handleFirstInput);
      }
    };
  }, []);

  return hasFirstInput;
}

/**
 * Hook to defer initialization of non-critical features until first input
 * @param callback Function to run after first input
 * @param immediate Whether to run immediately if no first input after timeout
 * @param timeout Timeout in ms to run callback anyway (default: 3000ms)
 */
export function useDeferredInit(
  callback: () => void,
  immediate: boolean = false,
  timeout: number = 3000
) {
  const hasFirstInput = useFirstInput();
  const initialized = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (initialized.current) return;

    if (hasFirstInput || immediate) {
      callback();
      initialized.current = true;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    } else {
      // Fallback timeout to ensure features still load
      timeoutRef.current = setTimeout(() => {
        if (!initialized.current) {
          callback();
          initialized.current = true;
        }
      }, timeout);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [hasFirstInput, callback, immediate, timeout]);
}