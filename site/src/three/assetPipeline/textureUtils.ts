/**
 * Texture Utility Functions
 * Helpers for texture management, instancing, and optimization
 */

import * as THREE from 'three';

/**
 * Calculate optimal texture size based on device capabilities
 */
export function getOptimalTextureSize(
  originalWidth: number,
  originalHeight: number,
  maxSize: number = 2048
): { width: number; height: number } {
  const scale = Math.min(1, maxSize / Math.max(originalWidth, originalHeight));
  
  return {
    width: Math.pow(2, Math.floor(Math.log2(originalWidth * scale))),
    height: Math.pow(2, Math.floor(Math.log2(originalHeight * scale))),
  };
}

/**
 * Estimate texture memory usage
 */
export function estimateTextureMemory(
  width: number,
  height: number,
  format: THREE.PixelFormat = THREE.RGBAFormat,
  mipmaps: boolean = true
): number {
  let bytesPerPixel = 4; // RGBA
  
  if (format === THREE.RGBFormat) bytesPerPixel = 3;
  if (format === THREE.RedFormat) bytesPerPixel = 1;
  
  let totalBytes = width * height * bytesPerPixel;
  
  // Add mipmap memory (approximately 33% more)
  if (mipmaps) {
    totalBytes *= 1.33;
  }
  
  return totalBytes;
}

/**
 * Create instanced mesh with optimized geometry
 */
export function createInstancedMesh(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  count: number,
  positions: THREE.Vector3[],
  rotations?: THREE.Euler[],
  scales?: THREE.Vector3[]
): THREE.InstancedMesh {
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  
  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const rotation = new THREE.Quaternion();
  const scale = new THREE.Vector3(1, 1, 1);
  
  for (let i = 0; i < count; i++) {
    position.copy(positions[i] || new THREE.Vector3());
    
    if (rotations && rotations[i]) {
      rotation.setFromEuler(rotations[i]);
    }
    
    if (scales && scales[i]) {
      scale.copy(scales[i]);
    }
    
    matrix.compose(position, rotation, scale);
    mesh.setMatrixAt(i, matrix);
  }
  
  mesh.instanceMatrix.needsUpdate = true;
  
  return mesh;
}

/**
 * Texture compression info for monitoring
 */
export interface TextureCompressionInfo {
  path: string;
  format: string;
  width: number;
  height: number;
  memoryMB: number;
  compressed: boolean;
}

/**
 * Get compression info for a texture
 */
export function getTextureCompressionInfo(
  texture: THREE.Texture,
  path: string
): TextureCompressionInfo {
  const isCompressed = texture instanceof THREE.CompressedTexture;
  const width = texture.image?.width || 0;
  const height = texture.image?.height || 0;
  
  let format = 'RGBA';
  if (texture.format === THREE.RGBFormat) format = 'RGB';
  if (texture.format === THREE.RedFormat) format = 'RED';
  
  // Use a compatible pixel format for memory estimation
  const pixelFormat = 
    texture.format === THREE.RGBFormat ? THREE.RGBFormat :
    texture.format === THREE.RedFormat ? THREE.RedFormat :
    THREE.RGBAFormat;
  
  const memoryBytes = estimateTextureMemory(width, height, pixelFormat, true);
  
  return {
    path,
    format: isCompressed ? 'KTX2/BasisU' : format,
    width,
    height,
    memoryMB: memoryBytes / (1024 * 1024),
    compressed: isCompressed,
  };
}

/**
 * Batch dispose textures and materials
 */
export function disposeObject(object: THREE.Object3D): void {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.geometry) {
        child.geometry.dispose();
      }
      
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => disposeMaterial(material));
        } else {
          disposeMaterial(child.material);
        }
      }
    }
  });
}

/**
 * Dispose material and its textures
 */
function disposeMaterial(material: THREE.Material): void {
  material.dispose();
  
  // Dispose all texture properties
  Object.keys(material).forEach((key) => {
    const value = (material as any)[key];
    if (value instanceof THREE.Texture) {
      value.dispose();
    }
  });
}

/**
 * Create optimized material with texture
 */
export function createOptimizedMaterial(
  texture: THREE.Texture,
  options: {
    metalness?: number;
    roughness?: number;
    normalMap?: THREE.Texture;
    roughnessMap?: THREE.Texture;
    aoMap?: THREE.Texture;
    emissive?: THREE.Color | string;
    emissiveIntensity?: number;
  } = {}
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    map: texture,
    metalness: options.metalness ?? 0.5,
    roughness: options.roughness ?? 0.5,
    normalMap: options.normalMap,
    roughnessMap: options.roughnessMap,
    aoMap: options.aoMap,
    emissive: options.emissive ? new THREE.Color(options.emissive) : undefined,
    emissiveIntensity: options.emissiveIntensity ?? 1,
  });
}

/**
 * Monitor total texture memory usage
 */
export class TextureMemoryMonitor {
  private textures: Map<string, TextureCompressionInfo> = new Map();
  
  add(path: string, texture: THREE.Texture): void {
    const info = getTextureCompressionInfo(texture, path);
    this.textures.set(path, info);
  }
  
  remove(path: string): void {
    this.textures.delete(path);
  }
  
  getTotalMemoryMB(): number {
    let total = 0;
    this.textures.forEach((info) => {
      total += info.memoryMB;
    });
    return total;
  }
  
  getReport(): {
    total: number;
    compressed: number;
    uncompressed: number;
    textures: TextureCompressionInfo[];
  } {
    const textures = Array.from(this.textures.values());
    const compressed = textures.filter((t) => t.compressed);
    const uncompressed = textures.filter((t) => !t.compressed);
    
    return {
      total: this.getTotalMemoryMB(),
      compressed: compressed.reduce((sum, t) => sum + t.memoryMB, 0),
      uncompressed: uncompressed.reduce((sum, t) => sum + t.memoryMB, 0),
      textures,
    };
  }
  
  logReport(): void {
    const report = this.getReport();
    console.group('🎨 Texture Memory Report');
    console.log(`Total: ${report.total.toFixed(2)} MB`);
    console.log(`Compressed (KTX2): ${report.compressed.toFixed(2)} MB`);
    console.log(`Uncompressed: ${report.uncompressed.toFixed(2)} MB`);
    console.table(report.textures);
    console.groupEnd();
  }
}

// Singleton instance
export const textureMemoryMonitor = new TextureMemoryMonitor();
