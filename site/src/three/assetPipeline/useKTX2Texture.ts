/**
 * React Hooks for KTX2 Texture Loading
 * Integrates with React Three Fiber
 */

import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { loadTexture, loadPMREMEnvironment, type TextureLoadOptions } from './KTX2Loader';
import { textureMemoryMonitor } from './textureUtils';

/**
 * Hook to load KTX2 texture with automatic fallback
 * @param path - Base path to texture (without extension)
 * @param options - Texture configuration options
 * @returns Loaded texture or null while loading
 */
export function useKTX2Texture(
  path: string | null,
  options: TextureLoadOptions = {}
): THREE.Texture | null {
  const { gl } = useThree();
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!path) {
      setTexture(null);
      return;
    }

    let disposed = false;

    const load = async () => {
      try {
        const tex = await loadTexture(path, gl, options);
        
        if (!disposed) {
          setTexture(tex);
          textureMemoryMonitor.add(path, tex);
          setError(null);
        }
      } catch (err) {
        if (!disposed) {
          console.error(`Failed to load texture: ${path}`, err);
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      }
    };

    load();

    return () => {
      disposed = true;
      if (texture) {
        texture.dispose();
        textureMemoryMonitor.remove(path);
      }
    };
  }, [path, gl]); // Intentionally omit options to prevent reloading

  if (error) {
    console.error('Texture loading error:', error);
  }

  return texture;
}

/**
 * Hook to load multiple textures at once
 * @param paths - Array of texture paths
 * @param options - Texture configuration options
 * @returns Object with loaded textures and loading state
 */
export function useKTX2Textures(
  paths: string[],
  options: TextureLoadOptions = {}
): {
  textures: (THREE.Texture | null)[];
  loaded: boolean;
  progress: number;
} {
  const { gl } = useThree();
  const [textures, setTextures] = useState<(THREE.Texture | null)[]>(
    paths.map(() => null)
  );
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    let disposed = false;
    const loadedTextures: THREE.Texture[] = [];

    const loadAll = async () => {
      const promises = paths.map(async (path, index) => {
        try {
          const tex = await loadTexture(path, gl, options);
          
          if (!disposed) {
            loadedTextures[index] = tex;
            textureMemoryMonitor.add(path, tex);
            
            setTextures((prev) => {
              const next = [...prev];
              next[index] = tex;
              return next;
            });
            
            setLoadedCount((prev) => prev + 1);
          }
          
          return tex;
        } catch (err) {
          console.error(`Failed to load texture: ${path}`, err);
          return null;
        }
      });

      await Promise.all(promises);
    };

    loadAll();

    return () => {
      disposed = true;
      loadedTextures.forEach((tex, index) => {
        if (tex) {
          tex.dispose();
          textureMemoryMonitor.remove(paths[index]);
        }
      });
    };
  }, [paths.join(','), gl]); // Use join for stable dependency

  return {
    textures,
    loaded: loadedCount === paths.length,
    progress: paths.length > 0 ? loadedCount / paths.length : 0,
  };
}

/**
 * Hook to load PMREM environment map
 * @param path - Path to equirectangular environment texture
 * @returns Loaded environment texture or null
 */
export function useKTX2Environment(path: string | null): THREE.Texture | null {
  const { gl } = useThree();
  const [envMap, setEnvMap] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!path) {
      setEnvMap(null);
      return;
    }

    let disposed = false;

    const load = async () => {
      try {
        const env = await loadPMREMEnvironment(path, gl);
        
        if (!disposed) {
          setEnvMap(env);
          textureMemoryMonitor.add(`${path}_pmrem`, env);
        }
      } catch (err) {
        console.error(`Failed to load environment: ${path}`, err);
      }
    };

    load();

    return () => {
      disposed = true;
      if (envMap) {
        envMap.dispose();
        textureMemoryMonitor.remove(`${path}_pmrem`);
      }
    };
  }, [path, gl]);

  return envMap;
}
