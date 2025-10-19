/**
 * KTX2Loader with BasisU Integration
 * Provides compressed texture loading with automatic fallback to WebP/PNG
 * Optimized for performance with PMREM environment support
 */

import * as THREE from 'three';
import { KTX2Loader as ThreeKTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

// Cache for loaded textures to prevent duplicate loads
const textureCache = new Map<string, Promise<THREE.Texture>>();

// Check for KTX2 support
let ktx2Supported: boolean | null = null;

/**
 * Check if browser supports KTX2/BasisU compressed textures
 */
export function isKTX2Supported(): boolean {
  if (ktx2Supported !== null) return ktx2Supported;

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  if (!gl || !(gl instanceof WebGLRenderingContext || gl instanceof WebGL2RenderingContext)) {
    ktx2Supported = false;
    return false;
  }

  // Check for required extensions
  const hasETC = !!gl.getExtension('WEBGL_compressed_texture_etc1') || 
                 !!gl.getExtension('WEBGL_compressed_texture_etc');
  const hasS3TC = !!gl.getExtension('WEBGL_compressed_texture_s3tc');
  const hasASTC = !!gl.getExtension('WEBGL_compressed_texture_astc');
  const hasPVRTC = !!gl.getExtension('WEBGL_compressed_texture_pvrtc');

  ktx2Supported = hasETC || hasS3TC || hasASTC || hasPVRTC;
  
  return ktx2Supported;
}

/**
 * Initialize KTX2 loader with BasisU transcoder
 */
let ktx2LoaderInstance: ThreeKTX2Loader | null = null;

export function getKTX2Loader(renderer: THREE.WebGLRenderer): ThreeKTX2Loader {
  if (!ktx2LoaderInstance) {
    ktx2LoaderInstance = new ThreeKTX2Loader();
    
    // Set transcoder path (served from public directory)
    ktx2LoaderInstance.setTranscoderPath('/basis/');
    
    // Detect backend automatically
    ktx2LoaderInstance.detectSupport(renderer);
  }
  
  return ktx2LoaderInstance;
}

/**
 * Texture configuration options
 */
export interface TextureLoadOptions {
  /** Texture wrapping mode */
  wrapS?: THREE.Wrapping;
  wrapT?: THREE.Wrapping;
  /** Magnification filter */
  magFilter?: THREE.MagnificationTextureFilter;
  /** Minification filter */
  minFilter?: THREE.MinificationTextureFilter;
  /** Generate mipmaps (only for fallback textures) */
  generateMipmaps?: boolean;
  /** Anisotropy level */
  anisotropy?: number;
  /** Color space */
  colorSpace?: THREE.ColorSpace;
  /** Flip Y axis */
  flipY?: boolean;
  /** Enable PMREM processing for environment maps */
  isPMREM?: boolean;
  /** Texture mapping mode */
  mapping?: THREE.Mapping;
}

/**
 * Load texture with KTX2 and automatic fallback
 * @param basePath - Base path without extension (e.g., '/textures/environment/studio')
 * @param renderer - WebGL renderer instance
 * @param options - Texture configuration options
 * @returns Promise resolving to loaded texture
 */
export async function loadTexture(
  basePath: string,
  renderer: THREE.WebGLRenderer,
  options: TextureLoadOptions = {}
): Promise<THREE.Texture> {
  const cacheKey = `${basePath}-${JSON.stringify(options)}`;
  
  // Return cached texture if available
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const loadPromise = (async () => {
    const supported = isKTX2Supported();
    
    // Try KTX2 first if supported
    if (supported) {
      try {
        const ktx2Path = `${basePath}.ktx2`;
        const loader = getKTX2Loader(renderer);
        
        const texture = await new Promise<THREE.Texture>((resolve, reject) => {
          loader.load(
            ktx2Path,
            (tex) => resolve(tex),
            undefined,
            (error) => reject(error)
          );
        });
        
        applyTextureOptions(texture, options);
        
        console.log(`✓ KTX2 texture loaded: ${ktx2Path}`);
        return texture;
      } catch (error) {
        console.warn(`KTX2 load failed, falling back to WebP/PNG: ${basePath}`, error);
      }
    }

    // Fallback to WebP, then PNG
    const fallbackExtensions = ['webp', 'png'];
    const loader = new THREE.TextureLoader();
    
    for (const ext of fallbackExtensions) {
      try {
        const fallbackPath = `${basePath}.${ext}`;
        
        const texture = await new Promise<THREE.Texture>((resolve, reject) => {
          loader.load(
            fallbackPath,
            (tex) => resolve(tex),
            undefined,
            (error) => reject(error)
          );
        });
        
        applyTextureOptions(texture, options);
        
        console.log(`✓ Fallback texture loaded: ${fallbackPath}`);
        return texture;
      } catch (error) {
        if (ext === fallbackExtensions[fallbackExtensions.length - 1]) {
          throw new Error(`Failed to load texture: ${basePath}`);
        }
      }
    }
    
    throw new Error(`No valid texture found for: ${basePath}`);
  })();

  textureCache.set(cacheKey, loadPromise);
  return loadPromise;
}

/**
 * Apply texture configuration options
 */
function applyTextureOptions(texture: THREE.Texture, options: TextureLoadOptions): void {
  const {
    wrapS = THREE.RepeatWrapping,
    wrapT = THREE.RepeatWrapping,
    magFilter = THREE.LinearFilter,
    minFilter = THREE.LinearMipmapLinearFilter,
    generateMipmaps = true,
    anisotropy = 16,
    colorSpace = THREE.SRGBColorSpace,
    flipY = true,
    mapping,
  } = options;

  texture.wrapS = wrapS;
  texture.wrapT = wrapT;
  texture.magFilter = magFilter;
  texture.minFilter = minFilter;
  texture.generateMipmaps = generateMipmaps;
  texture.anisotropy = anisotropy;
  texture.colorSpace = colorSpace;
  texture.flipY = flipY;
  if (mapping !== undefined) {
    texture.mapping = mapping;
  }
  texture.needsUpdate = true;
}

/**
 * Load cube map texture with KTX2 support
 * @param basePath - Base path to cube map faces (without _px, _nx, etc.)
 * @param renderer - WebGL renderer instance
 * @param options - Texture configuration options
 */
export async function loadCubeMap(
  basePath: string,
  renderer: THREE.WebGLRenderer,
  options: TextureLoadOptions = {}
): Promise<THREE.CubeTexture> {
  const faces = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
  
  const textures = await Promise.all(
    faces.map(face => loadTexture(`${basePath}_${face}`, renderer, options))
  );

  const cubeTexture = new THREE.CubeTexture(
    textures.map(t => t.image)
  );

  applyTextureOptions(cubeTexture as any, options);
  
  return cubeTexture;
}

/**
 * Load PMREM environment map
 * @param basePath - Path to equirectangular HDR/EXR or cube map
 * @param renderer - WebGL renderer instance
 */
export async function loadPMREMEnvironment(
  basePath: string,
  renderer: THREE.WebGLRenderer
): Promise<THREE.Texture> {
  const texture = await loadTexture(basePath, renderer, {
    mapping: THREE.EquirectangularReflectionMapping,
    colorSpace: THREE.LinearSRGBColorSpace,
    generateMipmaps: false,
    isPMREM: true,
  });

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  
  const envMap = pmremGenerator.fromEquirectangular(texture).texture;
  
  texture.dispose();
  pmremGenerator.dispose();

  return envMap;
}

/**
 * Preload textures for better performance
 * @param paths - Array of texture base paths
 * @param renderer - WebGL renderer instance
 */
export async function preloadTextures(
  paths: string[],
  renderer: THREE.WebGLRenderer
): Promise<void> {
  await Promise.all(
    paths.map(path => loadTexture(path, renderer))
  );
  
  console.log(`✓ Preloaded ${paths.length} textures`);
}

/**
 * Clear texture cache (useful for memory management)
 */
export function clearTextureCache(): void {
  textureCache.clear();
  console.log('✓ Texture cache cleared');
}

/**
 * Dispose KTX2 loader and cleanup resources
 */
export function disposeKTX2Loader(): void {
  if (ktx2LoaderInstance) {
    ktx2LoaderInstance.dispose();
    ktx2LoaderInstance = null;
  }
  clearTextureCache();
  console.log('✓ KTX2 loader disposed');
}
