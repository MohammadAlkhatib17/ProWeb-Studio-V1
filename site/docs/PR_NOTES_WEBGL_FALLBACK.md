# WebGL: Single-Context Guard + Pause/Resume (No Remount)

Summary
- Replaces remount-on-restore with a robust single-context guard and pause/resume flow.
- Eliminates flicker on normal navigation/resizes; prevents multiple active WebGL contexts.
- Keeps mobile quality caps (DPR clamp [1.0, 1.5], MSAA off ≤ 600px).
- Updates integration test to assert one canvas/context and no fallback during normal nav.

What changed
- `src/three/WebGLContextRegistry.ts`: tiny singleton to track the single active WebGL context/renderer. On a new claim, any previous renderer is disposed to avoid concurrent contexts. Dev emits one concise log per event.
- `src/components/HeroCanvas.tsx`:
  - Removes key-based remounts entirely.
  - On `webglcontextlost`: `preventDefault()`, pause frameloop, debounce 140ms before showing fallback to avoid flashes.
  - On `webglcontextrestored`: resume frameloop; hide fallback after the first next frame.
  - Claims/releases the registry and disposes renderer on unmount.
  - Dev-only single-line logs; production is silent.
- `src/components/TechPlaygroundScene.tsx`: applies the same registry guard and pause/resume with cleanup; tags canvas with `data-playground-canvas` for testing.
- `scripts/test-webgl.js`: navigates across routes, asserts max one canvas/context and no fallback on normal nav; forces context loss and verifies fallback debounce + resume without remount.

Validation
- Manual: navigate across `/`, `/diensten`, `/contact` repeatedly; no fallback flashes on desktop. Emulate Pixel 5; force context loss via `WEBGL_lose_context`; fallback appears after ~140ms, then auto-hides on restore without remount.
- Automated: `npm run test:webgl` passes locally and verifies single active canvas and debounce behavior.

Why this eliminates flicker
- Debounced fallback ensures quick resizes/nav do not flash the overlay.
- Pausing the frameloop on loss and resuming on restore keeps the same WebGL resources bound without triggering React remounts, avoiding visual resets.

Mobile quality caps
- DPR and MSAA limits remain unchanged to reduce GPU pressure on narrow/mobile devices.
