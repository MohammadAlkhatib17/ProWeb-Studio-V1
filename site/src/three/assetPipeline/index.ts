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
  createLODInstancedMesh,
  mergeGeometries,
  createCullingGroup,
  getTextureCompressionInfo,
  disposeObject,
  createOptimizedMaterial,
  createLODTexture,
  selectLODTexture,
  ResourceDisposer,
  resourceDisposer,
  TextureMemoryMonitor,
  textureMemoryMonitor,
  type TextureCompressionInfo,
  type LODLevel,
} from './textureUtils';

export { useKTX2Texture, useKTX2Environment } from './useKTX2Texture';
