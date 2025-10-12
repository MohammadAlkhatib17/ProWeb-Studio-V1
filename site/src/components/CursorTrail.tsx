"use client";

import { useEffect, useRef, useCallback } from "react";
import { useDeferredInit } from "@/hooks/useFirstInput";

// Utility function to detect low-end devices
function isLowEndDevice(): boolean {
  if (typeof window === "undefined") return false;

  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 0;
  if (cores > 0 && cores <= 2) return true;

  // Check memory (if available)
  const memory = (navigator as { deviceMemory?: number }).deviceMemory;
  if (memory && memory <= 2) return true;

  // Check connection type for mobile detection
  const connection = (navigator as { connection?: { effectiveType?: string } })
    .connection;
  if (
    connection &&
    (connection.effectiveType === "slow-2g" ||
      connection.effectiveType === "2g")
  ) {
    return true;
  }

  return false;
}

// Throttle function for high-frequency events
function throttle<T extends (...args: never[]) => void>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Array<{ x: number; y: number; life: number }>>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const cleanupRef = useRef<() => void>();

  const initializeCursorTrail = useCallback(() => {
    if (typeof window === "undefined") return;

    // Early return for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    // Early return for low-end devices
    if (isLowEndDevice()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      particles.current.push({
        x: e.clientX,
        y: e.clientY,
        life: 1,
      });
      if (particles.current.length > 30) particles.current.shift();
    };

    // Throttle mousemove to reduce INP impact
    const throttledMouseMove = throttle(handleMouseMove, 16); // ~60fps
    window.addEventListener("mousemove", throttledMouseMove, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter((p) => {
        p.life -= 0.02;
        return p.life > 0;
      });

      particles.current.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.life * 0.5;
        ctx.fillStyle = `rgb(0, 255, 255)`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "cyan";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Store cleanup function
    cleanupRef.current = () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", throttledMouseMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Defer cursor trail initialization until first user input
  useDeferredInit(initializeCursorTrail, false, 2000);

  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
