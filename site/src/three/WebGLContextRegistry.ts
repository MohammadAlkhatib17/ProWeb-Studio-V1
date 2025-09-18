/*
 Tiny global registry to enforce a single active WebGL context across the app.
 - Ensures only one renderer/context is active at a time
 - Disposes the previous renderer on a new claim to prevent double contexts
 - Provides dev-only, concise logs
*/

import * as THREE from 'three';

type GLContext = WebGLRenderingContext | WebGL2RenderingContext;

type ActiveEntry = {
  ctx: GLContext;
  renderer: THREE.WebGLRenderer;
  canvas: HTMLCanvasElement;
  dispose: () => void;
  label?: string;
};

class Registry {
  private active: ActiveEntry | null = null;

  claim(entry: ActiveEntry) {
    // If an existing active context is present and it's not the same, dispose it first
    if (this.active && this.active.ctx !== entry.ctx) {
      try {
        if (process.env.NODE_ENV !== 'production') {
          console.info('[webgl] Disposing previous renderer before activating new context');
        }
        this.active.dispose();
      } catch {}
      this.active = null;
    }

    this.active = entry;
    if (process.env.NODE_ENV !== 'production') {
      console.info('[webgl] Active context claimed');
    }
  }

  release(by: THREE.WebGLRenderer | GLContext | HTMLCanvasElement) {
    if (!this.active) return;
    const match =
      by === this.active.renderer ||
      by === this.active.ctx ||
      by === this.active.canvas;

    if (match) {
      this.active = null;
      if (process.env.NODE_ENV !== 'production') {
        console.info('[webgl] Active context released');
      }
    }
  }

  getActive(): ActiveEntry | null {
    return this.active;
  }
}

export const WebGLContextRegistry = new Registry();
