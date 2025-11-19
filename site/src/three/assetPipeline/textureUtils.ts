/**
 * Texture Utility Functions
 * Helpers for texture management, instancing, LOD, and optimization
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
 * LOD (Level of Detail) texture configuration
 */
export interface LODLevel {
  distance: number;
  texture: THREE.Texture;
  resolution: number;
}

/**
 * Create LOD texture system with multiple resolution levels
 * @param basePath - Base texture path without extension
 * @param renderer - WebGL renderer instance
 * @param levels - Array of LOD configurations [{ distance, resolution }]
 * @returns Promise resolving to LOD levels
 */
export async function createLODTexture(
  basePath: string,
  renderer: THREE.WebGLRenderer,
  levels: { distance: number; resolution: number }[] = [
    { distance: 0, resolution: 2048 },
    { distance: 10, resolution: 1024 },
    { distance: 25, resolution: 512 },
    { distance: 50, resolution: 256 },
  ]
): Promise<LODLevel[]> {
  const { loadTexture } = await import('./KTX2Loader');
  
  const lodLevels: LODLevel[] = [];
  
  for (const level of levels) {
    try {
      // Try loading resolution-specific texture first
      const path = `${basePath}_${level.resolution}`;
      const texture = await loadTexture(path, renderer, {
        anisotropy: 16,
        minFilter: THREE.LinearMipmapLinearFilter,
        generateMipmaps: true,
      });
      
      lodLevels.push({
        distance: level.distance,
        texture,
        resolution: level.resolution,
      });
    } catch {
      // Fallback to base texture
      try {
        const texture = await loadTexture(basePath, renderer, {
          anisotropy: 16,
          minFilter: THREE.LinearMipmapLinearFilter,
          generateMipmaps: true,
        });
        
        lodLevels.push({
          distance: level.distance,
          texture,
          resolution: level.resolution,
        });
      } catch (error) {
        console.warn(`Failed to load LOD level at ${level.distance}m:`, error);
      }
    }
  }
  
  return lodLevels;
}

/**
 * Select appropriate LOD level based on distance
 * @param lodLevels - Array of LOD levels
 * @param distance - Distance from camera
 * @returns Selected texture for the distance
 */
export function selectLODTexture(
  lodLevels: LODLevel[],
  distance: number
): THREE.Texture | null {
  if (lodLevels.length === 0) return null;
  
  // Sort by distance (closest first)
  const sorted = [...lodLevels].sort((a, b) => a.distance - b.distance);
  
  // Find the appropriate level
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (distance >= sorted[i].distance) {
      return sorted[i].texture;
    }
  }
  
  // Return highest quality if closer than all levels
  return sorted[0].texture;
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
  
  // Enable frustum culling for better performance
  mesh.frustumCulled = true;
  
  return mesh;
}

/**
 * Create LOD-aware instanced mesh with automatic level switching
 */
export function createLODInstancedMesh(
  geometries: THREE.BufferGeometry[], // From high to low detail
  material: THREE.Material,
  count: number,
  positions: THREE.Vector3[],
  lodDistances: number[] = [10, 25, 50], // Distance thresholds
  rotations?: THREE.Euler[],
  scales?: THREE.Vector3[]
): THREE.LOD {
  const lod = new THREE.LOD();
  
  // Create instanced mesh for each LOD level
  for (let i = 0; i < geometries.length; i++) {
    const mesh = createInstancedMesh(
      geometries[i],
      material,
      count,
      positions,
      rotations,
      scales
    );
    
    const distance = i < lodDistances.length ? lodDistances[i] : lodDistances[lodDistances.length - 1];
    lod.addLevel(mesh, distance);
  }
  
  return lod;
}

/**
 * Merge multiple geometries into a single geometry for draw call reduction
 * @param geometries - Array of geometries to merge
 * @param transforms - Optional transforms for each geometry
 * @returns Merged geometry
 */
export function mergeGeometries(
  geometries: THREE.BufferGeometry[],
  transforms?: THREE.Matrix4[]
): THREE.BufferGeometry {
  if (geometries.length === 0) {
    throw new Error('Cannot merge empty geometry array');
  }
  
  const mergedGeometry = new THREE.BufferGeometry();
  
  // Apply transforms if provided
  if (transforms && transforms.length === geometries.length) {
    geometries = geometries.map((geo, i) => {
      const clone = geo.clone();
      clone.applyMatrix4(transforms[i]);
      return clone;
    });
  }
  
  // Manual merge (BufferGeometryUtils not in core Three.js)
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  let indexOffset = 0;
  
  for (const geometry of geometries) {
    const pos = geometry.attributes.position;
    const norm = geometry.attributes.normal;
    const uv = geometry.attributes.uv;
    const idx = geometry.index;
    
    if (pos) {
      positions.push(...pos.array);
    }
    
    if (norm) {
      normals.push(...norm.array);
    }
    
    if (uv) {
      uvs.push(...uv.array);
    }
    
    if (idx) {
      const indexArray = Array.from(idx.array).map(i => i + indexOffset);
      indices.push(...indexArray);
      indexOffset += pos.count;
    }
  }
  
  mergedGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  
  if (normals.length > 0) {
    mergedGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  }
  
  if (uvs.length > 0) {
    mergedGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  }
  
  if (indices.length > 0) {
    mergedGeometry.setIndex(indices);
  }
  
  mergedGeometry.computeBoundingSphere();
  
  return mergedGeometry;
}

/**
 * Create frustum culling optimized group
 * Groups objects by distance for better culling
 */
export function createCullingGroup(
  objects: THREE.Object3D[]
): THREE.Group {
  const group = new THREE.Group();
  
  // Sort objects by distance from origin
  const sorted = [...objects].sort((a, b) => {
    const distA = a.position.length();
    const distB = b.position.length();
    return distA - distB;
  });
  
  // Create sub-groups for culling zones
  const zones = Math.ceil(sorted.length / 20); // 20 objects per zone
  
  for (let i = 0; i < zones; i++) {
    const zoneGroup = new THREE.Group();
    zoneGroup.frustumCulled = true;
    
    const start = i * 20;
    const end = Math.min(start + 20, sorted.length);
    
    for (let j = start; j < end; j++) {
      zoneGroup.add(sorted[j]);
    }
    
    group.add(zoneGroup);
  }
  
  return group;
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
 * Resource Disposal Tracker
 * Comprehensive GPU resource cleanup system
 */
export class ResourceDisposer {
  private disposedCount = {
    geometries: 0,
    materials: 0,
    textures: 0,
    renderTargets: 0,
  };
  
  private disposed = new WeakSet<
    THREE.BufferGeometry | THREE.Material | THREE.Texture
  >();
  
  /**
   * Dispose geometry safely
   */
  disposeGeometry(geometry: THREE.BufferGeometry): void {
    if (!this.disposed.has(geometry)) {
      geometry.dispose();
      this.disposed.add(geometry);
      this.disposedCount.geometries++;
    }
  }
  
  /**
   * Dispose material and its textures
   */
  disposeMaterial(material: THREE.Material): void {
    if (this.disposed.has(material)) return;
    
    // Dispose all texture properties
    Object.keys(material).forEach((key) => {
      const value = (material as unknown as Record<string, unknown>)[key];
      if (value instanceof THREE.Texture && !this.disposed.has(value)) {
        value.dispose();
        this.disposed.add(value);
        this.disposedCount.textures++;
      }
    });
    
    material.dispose();
    this.disposed.add(material);
    this.disposedCount.materials++;
  }
  
  /**
   * Dispose texture
   */
  disposeTexture(texture: THREE.Texture): void {
    if (!this.disposed.has(texture)) {
      texture.dispose();
      this.disposed.add(texture);
      this.disposedCount.textures++;
    }
  }
  
  /**
   * Dispose render target
   */
  disposeRenderTarget(renderTarget: THREE.WebGLRenderTarget): void {
    renderTarget.dispose();
    this.disposedCount.renderTargets++;
  }
  
  /**
   * Dispose entire object hierarchy
   */
  disposeObject(object: THREE.Object3D): void {
    object.traverse((child) => {
      // Dispose mesh resources
      if (child instanceof THREE.Mesh || child instanceof THREE.InstancedMesh) {
        if (child.geometry) {
          this.disposeGeometry(child.geometry);
        }
        
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => this.disposeMaterial(mat));
          } else {
            this.disposeMaterial(child.material);
          }
        }
      }
      
      // Dispose line resources
      if (child instanceof THREE.Line) {
        if (child.geometry) {
          this.disposeGeometry(child.geometry);
        }
        if (child.material) {
          this.disposeMaterial(child.material as THREE.Material);
        }
      }
      
      // Dispose point resources
      if (child instanceof THREE.Points) {
        if (child.geometry) {
          this.disposeGeometry(child.geometry);
        }
        if (child.material) {
          this.disposeMaterial(child.material as THREE.Material);
        }
      }
    });
  }
  
  /**
   * Get disposal statistics
   */
  getStats(): {
    geometries: number;
    materials: number;
    textures: number;
    renderTargets: number;
    total: number;
  } {
    const total =
      this.disposedCount.geometries +
      this.disposedCount.materials +
      this.disposedCount.textures +
      this.disposedCount.renderTargets;
    
    return {
      ...this.disposedCount,
      total,
    };
  }
  
  /**
   * Log disposal report
   */
  logReport(): void {
    const stats = this.getStats();
    console.group('🗑️ GPU Resource Disposal Report');
    console.log(`Total Resources Disposed: ${stats.total}`);
    console.log(`├─ Geometries: ${stats.geometries}`);
    console.log(`├─ Materials: ${stats.materials}`);
    console.log(`├─ Textures: ${stats.textures}`);
    console.log(`└─ Render Targets: ${stats.renderTargets}`);
    console.groupEnd();
  }
  
  /**
   * Reset statistics
   */
  reset(): void {
    this.disposedCount = {
      geometries: 0,
      materials: 0,
      textures: 0,
      renderTargets: 0,
    };
  }
}

// Singleton instance
export const resourceDisposer = new ResourceDisposer();

/**
 * Batch dispose textures and materials (legacy wrapper)
 * @deprecated Use resourceDisposer.disposeObject() instead
 */
export function disposeObject(object: THREE.Object3D): void {
  resourceDisposer.disposeObject(object);
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
 * Monitor total texture memory usage with budget enforcement
 */
export class TextureMemoryMonitor {
  private textures: Map<string, TextureCompressionInfo> = new Map();
  private budgetMB: number = 12; // Default 12MB budget
  private warningThreshold: number = 0.8; // Warn at 80%
  private lastAccessTime: Map<string, number> = new Map();
  private onBudgetExceeded?: (totalMB: number, budgetMB: number) => void;
  
  /**
   * Set memory budget in MB
   */
  setBudget(budgetMB: number, warningThreshold: number = 0.8): void {
    this.budgetMB = budgetMB;
    this.warningThreshold = warningThreshold;
  }
  
  /**
   * Set callback for budget exceeded events
   */
  onBudgetExceededCallback(
    callback: (totalMB: number, budgetMB: number) => void
  ): void {
    this.onBudgetExceeded = callback;
  }
  
  add(path: string, texture: THREE.Texture): void {
    const info = getTextureCompressionInfo(texture, path);
    this.textures.set(path, info);
    this.lastAccessTime.set(path, Date.now());
    
    this.checkBudget();
  }
  
  remove(path: string): void {
    this.textures.delete(path);
    this.lastAccessTime.delete(path);
  }
  
  /**
   * Mark texture as recently accessed
   */
  touch(path: string): void {
    if (this.textures.has(path)) {
      this.lastAccessTime.set(path, Date.now());
    }
  }
  
  /**
   * Check if memory budget is exceeded
   */
  private checkBudget(): void {
    const total = this.getTotalMemoryMB();
    const warningLevel = this.budgetMB * this.warningThreshold;
    
    if (total >= this.budgetMB) {
      console.error(
        `❌ TEXTURE BUDGET EXCEEDED: ${total.toFixed(2)} MB / ${this.budgetMB} MB`
      );
      
      if (this.onBudgetExceeded) {
        this.onBudgetExceeded(total, this.budgetMB);
      }
      
      // Auto-cleanup least recently used textures
      this.cleanupLRU();
    } else if (total >= warningLevel) {
      const percentage = ((total / this.budgetMB) * 100).toFixed(0);
      console.warn(
        `⚠️ Texture memory warning: ${total.toFixed(2)} MB / ${this.budgetMB} MB (${percentage}%)`
      );
    }
  }
  
  /**
   * Cleanup least recently used textures
   */
  private cleanupLRU(): void {
    const entries = Array.from(this.lastAccessTime.entries())
      .sort((a, b) => a[1] - b[1]); // Sort by access time (oldest first)
    
    const targetMB = this.budgetMB * this.warningThreshold;
    let currentMB = this.getTotalMemoryMB();
    let cleanedCount = 0;
    
    for (const [path] of entries) {
      if (currentMB <= targetMB) break;
      
      const info = this.textures.get(path);
      if (info) {
        this.remove(path);
        currentMB -= info.memoryMB;
        cleanedCount++;
        console.log(`🧹 Cleaned up texture: ${path} (${info.memoryMB.toFixed(2)} MB)`);
      }
    }
    
    if (cleanedCount > 0) {
      console.log(
        `✓ Cleaned ${cleanedCount} textures, freed ${(this.getTotalMemoryMB() - currentMB).toFixed(2)} MB`
      );
    }
  }
  
  getTotalMemoryMB(): number {
    let total = 0;
    this.textures.forEach((info) => {
      total += info.memoryMB;
    });
    return total;
  }
  
  /**
   * Get budget status
   */
  getBudgetStatus(): {
    used: number;
    budget: number;
    available: number;
    percentage: number;
    isOverBudget: boolean;
    isNearLimit: boolean;
  } {
    const used = this.getTotalMemoryMB();
    const available = Math.max(0, this.budgetMB - used);
    const percentage = (used / this.budgetMB) * 100;
    
    return {
      used,
      budget: this.budgetMB,
      available,
      percentage,
      isOverBudget: used > this.budgetMB,
      isNearLimit: used >= this.budgetMB * this.warningThreshold,
    };
  }
  
  getReport(): {
    total: number;
    compressed: number;
    uncompressed: number;
    textures: TextureCompressionInfo[];
    budget: {
      used: number;
      budget: number;
      available: number;
      percentage: number;
      isOverBudget: boolean;
      isNearLimit: boolean;
    };
  } {
    const textures = Array.from(this.textures.values());
    const compressed = textures.filter((t) => t.compressed);
    const uncompressed = textures.filter((t) => !t.compressed);
    
    return {
      total: this.getTotalMemoryMB(),
      compressed: compressed.reduce((sum, t) => sum + t.memoryMB, 0),
      uncompressed: uncompressed.reduce((sum, t) => sum + t.memoryMB, 0),
      textures,
      budget: this.getBudgetStatus(),
    };
  }
  
  logReport(): void {
    const report = this.getReport();
    const { budget } = report;
    
    console.group('🎨 Texture Memory Report');
    console.log(`Total: ${report.total.toFixed(2)} MB / ${budget.budget} MB (${budget.percentage.toFixed(1)}%)`);
    
    if (budget.isOverBudget) {
      console.error(`❌ OVER BUDGET by ${(budget.used - budget.budget).toFixed(2)} MB`);
    } else if (budget.isNearLimit) {
      console.warn(`⚠️ Near limit: ${budget.available.toFixed(2)} MB remaining`);
    } else {
      console.log(`✓ Available: ${budget.available.toFixed(2)} MB`);
    }
    
    console.log(`Compressed (KTX2): ${report.compressed.toFixed(2)} MB`);
    console.log(`Uncompressed: ${report.uncompressed.toFixed(2)} MB`);
    console.table(report.textures);
    console.groupEnd();
  }
}

// Singleton instance
export const textureMemoryMonitor = new TextureMemoryMonitor();
