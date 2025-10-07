/**
 * Type definitions for 3D optimization components
 */

import { BufferGeometry } from 'three';

export interface CacheStats {
  cacheHits: number;
  cacheMisses: number;
  totalMemorySaved: number;
  compressionRatio: number;
  cacheSize: number;
  totalMemoryUsage: number;
  averageCompressionRatio: number;
}

export interface CacheReport {
  summary: {
    cacheSize: number;
    cacheHitRate: string;
    totalMemoryUsage: string;
    memorySaved: string;
    averageCompression: string;
  };
  geometries: Array<{
    key: string;
    vertices: number;
    faces: number;
    memoryUsage: string;
    compressionRatio: string;
  }>;
}

export interface OptimizedGeometryProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  metalness?: number;
  roughness?: number;
  detail?: number;
}

export interface GeometryConfig {
  detail?: number;
  segments?: number;
  radius?: number;
  cacheKey?: string;
}

export interface CachedGeometry {
  geometry: BufferGeometry;
  vertices: number;
  faces: number;
  memoryUsage: number;
  compressionRatio?: number;
}