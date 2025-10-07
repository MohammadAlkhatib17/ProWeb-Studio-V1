/**
 * Optimized Geometry Cache System
 * 
 * Precomputes and caches geometries to reduce runtime overhead
 * This provides similar benefits to compressed GLTF models
 */

import * as THREE from 'three';

interface CachedGeometry {
  geometry: THREE.BufferGeometry;
  vertices: number;
  faces: number;
  memoryUsage: number;
  compressionRatio?: number;
}

interface GeometryConfig {
  detail?: number;
  segments?: number;
  radius?: number;
  cacheKey?: string;
}

export class GeometryCache {
  private static instance: GeometryCache;
  private cache = new Map<string, CachedGeometry>();
  private originalSizes = new Map<string, number>();
  private stats = {
    cacheHits: 0,
    cacheMisses: 0,
    totalMemorySaved: 0,
    compressionRatio: 0
  };

  static getInstance(): GeometryCache {
    if (!GeometryCache.instance) {
      GeometryCache.instance = new GeometryCache();
    }
    return GeometryCache.instance;
  }

  /**
   * Get or create optimized hexagonal prism geometry
   */
  getHexagonalPrism(config: GeometryConfig = {}): CachedGeometry {
    const key = `hexPrism_${config.detail || 1}_${config.radius || 1}`;
    
    if (this.cache.has(key)) {
      this.stats.cacheHits++;
      return this.cache.get(key)!;
    }

    this.stats.cacheMisses++;
    
    // Create optimized hexagonal prism
    const shape = new THREE.Shape();
    const radius = config.radius || 1;
    const detail = config.detail || 1;
    
    // Create hexagon with optimized vertex count
    const vertices = Math.max(6, Math.min(12, 6 * detail));
    for (let i = 0; i < vertices; i++) {
      const angle = (i / vertices) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }
    shape.closePath();

    const extrudeSettings = {
      depth: 0.5,
      bevelEnabled: true,
      bevelSegments: Math.max(1, Math.floor(2 * detail)),
      steps: Math.max(1, Math.floor(2 * detail)),
      bevelSize: 0.1,
      bevelThickness: 0.1
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const cached = this.optimizeAndCache(key, geometry);
    
    return cached;
  }

  /**
   * Get or create optimized torus knot geometry
   */
  getTorusKnot(config: GeometryConfig = {}): CachedGeometry {
    const detail = config.detail || 1;
    const radius = config.radius || 1;
    const key = `torusKnot_${detail}_${radius}`;
    
    if (this.cache.has(key)) {
      this.stats.cacheHits++;
      return this.cache.get(key)!;
    }

    this.stats.cacheMisses++;
    
    // Create with LOD-based detail
    const tubularSegments = Math.max(64, Math.min(200, 100 * detail));
    const radialSegments = Math.max(8, Math.min(32, 16 * detail));
    
    const geometry = new THREE.TorusKnotGeometry(
      radius, 
      radius * 0.3, 
      tubularSegments, 
      radialSegments, 
      2, 
      3
    );
    
    return this.optimizeAndCache(key, geometry);
  }

  /**
   * Get or create optimized polyhedron
   */
  getPolyhedron(type: 'octahedron' | 'dodecahedron' | 'tetrahedron', config: GeometryConfig = {}): CachedGeometry {
    const detail = config.detail || 0;
    const radius = config.radius || 1;
    const key = `${type}_${detail}_${radius}`;
    
    if (this.cache.has(key)) {
      this.stats.cacheHits++;
      return this.cache.get(key)!;
    }

    this.stats.cacheMisses++;
    
    let geometry: THREE.BufferGeometry;
    
    switch (type) {
      case 'octahedron':
        geometry = new THREE.OctahedronGeometry(radius, detail);
        break;
      case 'dodecahedron':
        geometry = new THREE.DodecahedronGeometry(radius, detail);
        break;
      case 'tetrahedron':
        geometry = new THREE.TetrahedronGeometry(radius, detail);
        break;
    }
    
    return this.optimizeAndCache(key, geometry);
  }

  /**
   * Get or create optimized sphere
   */
  getSphere(config: GeometryConfig = {}): CachedGeometry {
    const detail = config.detail || 1;
    const radius = config.radius || 1;
    const key = `sphere_${detail}_${radius}`;
    
    if (this.cache.has(key)) {
      this.stats.cacheHits++;
      return this.cache.get(key)!;
    }

    this.stats.cacheMisses++;
    
    // Create with adaptive detail levels
    const widthSegments = Math.max(8, Math.min(64, 32 * detail));
    const heightSegments = Math.max(6, Math.min(32, 16 * detail));
    
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    return this.optimizeAndCache(key, geometry);
  }

  /**
   * Get or create optimized torus
   */
  getTorus(config: GeometryConfig = {}): CachedGeometry {
    const detail = config.detail || 1;
    const radius = config.radius || 1;
    const key = `torus_${detail}_${radius}`;
    
    if (this.cache.has(key)) {
      this.stats.cacheHits++;
      return this.cache.get(key)!;
    }

    this.stats.cacheMisses++;
    
    const radialSegments = Math.max(8, Math.min(32, 16 * detail));
    const tubularSegments = Math.max(16, Math.min(64, 32 * detail));
    
    const geometry = new THREE.TorusGeometry(radius, radius * 0.3, radialSegments, tubularSegments);
    return this.optimizeAndCache(key, geometry);
  }

  /**
   * Get or create optimized tube geometry for ribbons
   */
  getTube(path: THREE.Curve<THREE.Vector3>, config: GeometryConfig = {}): CachedGeometry {
    const detail = config.detail || 1;
    const radius = config.radius || 0.2;
    const key = `tube_${path.constructor.name}_${detail}_${radius}`;
    
    if (this.cache.has(key)) {
      this.stats.cacheHits++;
      return this.cache.get(key)!;
    }

    this.stats.cacheMisses++;
    
    const tubularSegments = Math.max(32, Math.min(200, 100 * detail));
    const radialSegments = Math.max(6, Math.min(16, 8 * detail));
    
    const geometry = new THREE.TubeGeometry(path, tubularSegments, radius, radialSegments, false);
    return this.optimizeAndCache(key, geometry);
  }

  /**
   * Optimize geometry and add to cache
   */
  private optimizeAndCache(key: string, geometry: THREE.BufferGeometry): CachedGeometry {
    const originalSize = this.calculateGeometrySize(geometry);
    this.originalSizes.set(key, originalSize);

    // Apply optimizations
    geometry.computeBoundingSphere();
    geometry.computeBoundingBox();
    
    // Compute vertex normals if not present
    if (!geometry.attributes.normal) {
      geometry.computeVertexNormals();
    }

    // Optimize index buffer
    if (!geometry.index && geometry.attributes.position) {
      geometry.setIndex(this.generateOptimizedIndices(geometry));
    }

    // Merge vertices (remove duplicates)
    geometry = this.mergeVertices(geometry);

    const optimizedSize = this.calculateGeometrySize(geometry);
    const compressionRatio = (originalSize - optimizedSize) / originalSize * 100;

    const cached: CachedGeometry = {
      geometry,
      vertices: geometry.attributes.position.count,
      faces: geometry.index ? geometry.index.count / 3 : geometry.attributes.position.count / 3,
      memoryUsage: optimizedSize,
      compressionRatio
    };

    this.cache.set(key, cached);
    this.stats.totalMemorySaved += (originalSize - optimizedSize);
    this.updateCompressionStats();

    return cached;
  }

  /**
   * Generate optimized indices for non-indexed geometry
   */
  private generateOptimizedIndices(geometry: THREE.BufferGeometry): THREE.BufferAttribute {
    const positionAttribute = geometry.attributes.position;
    const vertexCount = positionAttribute.count;
    const indices: number[] = [];

    // Simple indexing for triangle-based geometry
    for (let i = 0; i < vertexCount; i++) {
      indices.push(i);
    }

    return new THREE.BufferAttribute(new Uint32Array(indices), 1);
  }

  /**
   * Merge duplicate vertices
   */
  private mergeVertices(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
    const precision = 4;
    const hashToIndex: { [hash: string]: number } = {};
    const indices: number[] = [];
    const vertices: number[] = [];
    const normals: number[] = [];
    
    const positionAttribute = geometry.attributes.position;
    const normalAttribute = geometry.attributes.normal;
    
    for (let i = 0; i < positionAttribute.count; i++) {
      const vertex = new THREE.Vector3().fromBufferAttribute(positionAttribute, i);
      const hash = `${Math.round(vertex.x * Math.pow(10, precision))}_${Math.round(vertex.y * Math.pow(10, precision))}_${Math.round(vertex.z * Math.pow(10, precision))}`;
      
      if (hashToIndex[hash] !== undefined) {
        indices.push(hashToIndex[hash]);
      } else {
        vertices.push(vertex.x, vertex.y, vertex.z);
        if (normalAttribute) {
          const normal = new THREE.Vector3().fromBufferAttribute(normalAttribute, i);
          normals.push(normal.x, normal.y, normal.z);
        }
        hashToIndex[hash] = vertices.length / 3 - 1;
        indices.push(hashToIndex[hash]);
      }
    }

    const newGeometry = new THREE.BufferGeometry();
    newGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    if (normals.length > 0) {
      newGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    }
    newGeometry.setIndex(indices);

    return newGeometry;
  }

  /**
   * Calculate approximate memory usage of geometry
   */
  private calculateGeometrySize(geometry: THREE.BufferGeometry): number {
    let size = 0;
    
    Object.keys(geometry.attributes).forEach(key => {
      const attribute = geometry.attributes[key];
      size += attribute.array.byteLength;
    });
    
    if (geometry.index) {
      size += geometry.index.array.byteLength;
    }
    
    return size;
  }

  /**
   * Update compression statistics
   */
  private updateCompressionStats(): void {
    let totalOriginal = 0;
    let totalOptimized = 0;
    
    this.cache.forEach((cached, key) => {
      const original = this.originalSizes.get(key) || 0;
      totalOriginal += original;
      totalOptimized += cached.memoryUsage;
    });
    
    this.stats.compressionRatio = totalOriginal > 0 
      ? ((totalOriginal - totalOptimized) / totalOriginal) * 100 
      : 0;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      ...this.stats,
      cacheSize: this.cache.size,
      totalMemoryUsage: Array.from(this.cache.values()).reduce((sum, cached) => sum + cached.memoryUsage, 0),
      averageCompressionRatio: this.stats.compressionRatio
    };
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.forEach(cached => {
      cached.geometry.dispose();
    });
    this.cache.clear();
    this.originalSizes.clear();
    this.stats = {
      cacheHits: 0,
      cacheMisses: 0,
      totalMemorySaved: 0,
      compressionRatio: 0
    };
  }

  /**
   * Get cache usage report
   */
  getReport(): {
    summary: any;
    geometries: Array<{
      key: string;
      vertices: number;
      faces: number;
      memoryUsage: string;
      compressionRatio: string;
    }>;
  } {
    const stats = this.getStats();
    
    return {
      summary: {
        cacheSize: stats.cacheSize,
        cacheHitRate: `${((stats.cacheHits / (stats.cacheHits + stats.cacheMisses)) * 100).toFixed(1)}%`,
        totalMemoryUsage: this.formatBytes(stats.totalMemoryUsage),
        memorySaved: this.formatBytes(stats.totalMemorySaved),
        averageCompression: `${stats.averageCompressionRatio.toFixed(1)}%`
      },
      geometries: Array.from(this.cache.entries()).map(([key, cached]) => ({
        key,
        vertices: cached.vertices,
        faces: cached.faces,
        memoryUsage: this.formatBytes(cached.memoryUsage),
        compressionRatio: `${(cached.compressionRatio || 0).toFixed(1)}%`
      }))
    };
  }

  /**
   * Format bytes to human readable format
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Export singleton instance
export const geometryCache = GeometryCache.getInstance();