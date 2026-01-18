/**
 * useWebGLRecovery Hook
 * 
 * Centralized WebGL context loss handling for React Three Fiber applications.
 * Provides graceful degradation and recovery mechanisms.
 * 
 * @module hooks/useWebGLRecovery
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface WebGLRecoveryState {
    /** Whether WebGL context is currently lost */
    isContextLost: boolean;
    /** Number of recovery attempts made */
    recoveryAttempts: number;
    /** Whether we should show fallback UI */
    showFallback: boolean;
    /** Error message if any */
    error: string | null;
}

export interface UseWebGLRecoveryOptions {
    /** Maximum recovery attempts before showing fallback */
    maxRecoveryAttempts?: number;
    /** Callback when context is lost */
    onContextLost?: () => void;
    /** Callback when context is restored */
    onContextRestored?: () => void;
    /** Callback when recovery fails */
    onRecoveryFailed?: () => void;
}

/**
 * Hook for managing WebGL context loss and recovery
 * 
 * @example
 * ```tsx
 * const { isContextLost, showFallback, registerCanvas } = useWebGLRecovery({
 *   onRecoveryFailed: () => console.error('3D not supported')
 * });
 * 
 * return showFallback ? <FallbackUI /> : <Canvas ref={registerCanvas} />;
 * ```
 */
export function useWebGLRecovery(options: UseWebGLRecoveryOptions = {}) {
    const {
        maxRecoveryAttempts = 3,
        onContextLost,
        onContextRestored,
        onRecoveryFailed,
    } = options;

    const [state, setState] = useState<WebGLRecoveryState>({
        isContextLost: false,
        recoveryAttempts: 0,
        showFallback: false,
        error: null,
    });

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const handleContextLost = useCallback((event: Event) => {
        event.preventDefault(); // Allow automatic restoration attempt

        setState(prev => {
            const newAttempts = prev.recoveryAttempts + 1;
            const shouldFallback = newAttempts >= maxRecoveryAttempts;

            if (shouldFallback) {
                onRecoveryFailed?.();
            } else {
                onContextLost?.();
            }

            return {
                isContextLost: true,
                recoveryAttempts: newAttempts,
                showFallback: shouldFallback,
                error: shouldFallback
                    ? 'WebGL context could not be recovered. Showing fallback content.'
                    : 'WebGL context lost. Attempting recovery...',
            };
        });

        // Log for debugging (removed in production by Next.js compiler)
        console.warn('[WebGL Recovery] Context lost, attempt:', state.recoveryAttempts + 1);
    }, [maxRecoveryAttempts, onContextLost, onRecoveryFailed, state.recoveryAttempts]);

    const handleContextRestored = useCallback(() => {
        setState({
            isContextLost: false,
            recoveryAttempts: 0,
            showFallback: false,
            error: null,
        });

        onContextRestored?.();
        console.info('[WebGL Recovery] Context restored successfully');
    }, [onContextRestored]);

    /**
     * Register a canvas element for WebGL recovery handling
     */
    const registerCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
        // Cleanup previous listeners
        if (canvasRef.current) {
            canvasRef.current.removeEventListener('webglcontextlost', handleContextLost);
            canvasRef.current.removeEventListener('webglcontextrestored', handleContextRestored);
        }

        canvasRef.current = canvas;

        if (canvas) {
            canvas.addEventListener('webglcontextlost', handleContextLost, { passive: false });
            canvas.addEventListener('webglcontextrestored', handleContextRestored);
        }
    }, [handleContextLost, handleContextRestored]);

    /**
     * Manually trigger recovery attempt (e.g., via user action)
     */
    const attemptRecovery = useCallback(() => {
        if (!canvasRef.current || !state.showFallback) return false;

        // Reset state to try again
        setState(prev => ({
            ...prev,
            showFallback: false,
            error: 'Retrying WebGL initialization...',
        }));

        // Force reload the component (consumer should re-render Canvas)
        return true;
    }, [state.showFallback]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (canvasRef.current) {
                canvasRef.current.removeEventListener('webglcontextlost', handleContextLost);
                canvasRef.current.removeEventListener('webglcontextrestored', handleContextRestored);
            }
        };
    }, [handleContextLost, handleContextRestored]);

    return {
        ...state,
        registerCanvas,
        attemptRecovery,
    };
}

/**
 * Check if WebGL is supported in current browser
 */
export function isWebGLSupported(): boolean {
    if (typeof window === 'undefined') return true; // SSR assumption

    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        return !!gl;
    } catch {
        return false;
    }
}

/**
 * Check if WebGL2 is supported
 */
export function isWebGL2Supported(): boolean {
    if (typeof window === 'undefined') return true;

    try {
        const canvas = document.createElement('canvas');
        return !!canvas.getContext('webgl2');
    } catch {
        return false;
    }
}

export default useWebGLRecovery;
