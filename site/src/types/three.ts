/**
 * TypeScript type definitions for Three.js components
 * Centralizes types to eliminate 'any' usage in 3D components
 */

import type { ThreeEvent, RootState } from '@react-three/fiber';
import type { Mesh, Group, Object3D, Material, WebGLRenderer } from 'three';

/**
 * Three.js mesh ref type
 * Used for useRef<ThreeMeshRef>(null)
 */
export type ThreeMeshRef = Mesh;

/**
 * Three.js group ref type
 * Used for useRef<ThreeGroupRef>(null)
 */
export type ThreeGroupRef = Group;

/**
 * Three.js object ref type
 * Used for generic 3D objects
 */
export type ThreeObjectRef = Object3D;

/**
 * Material types for Three.js
 */
export type ThreeMaterial = Material | Material[];

/**
 * Three.js pointer event type
 */
export type ThreePointerEvent = ThreeEvent<PointerEvent>;

/**
 * Three.js mouse event type
 */
export type ThreeMouseEvent = ThreeEvent<MouseEvent>;

/**
 * useFrame callback state type
 */
export type FrameState = RootState;

/**
 * WebGL renderer type
 */
export type ThreeRenderer = WebGLRenderer;

/**
 * GPU tier detection result
 */
export interface GPUTier {
  tier: number;
  type: 'WEBGL' | 'WEBGL2' | 'FALLBACK';
  isMobile: boolean;
  gpu?: string;
}

/**
 * Common props for 3D components
 */
export interface ThreeComponentProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}

/**
 * Animation state for 3D components
 */
export interface AnimationState {
  time: number;
  delta: number;
  frame: number;
}
