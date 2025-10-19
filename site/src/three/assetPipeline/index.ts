/**
 * Asset Pipeline - Main Export
 * KTX2/BasisU texture loading with automatic fallback
 */

export {
  isKTX2Supported,
  getKTX2Loader,
  loadTexture,
  loadCubeMap,
  loadPMREMEnvironment,
  preloadTextures,
  clearTextureCache,
  disposeKTX2Loader,
  type TextureLoadOptions,
} from './KTX2Loader';

export {
  getOptimalTextureSize,
  estimateTextureMemory,
  createInstancedMesh,
  getTextureCompressionInfo,
  disposeObject,
  createOptimizedMaterial,
  TextureMemoryMonitor,
  textureMemoryMonitor,
  type TextureCompressionInfo,
} from './textureUtils';

export { useKTX2Texture, useKTX2Environment } from './useKTX2Texture';
