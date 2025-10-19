# Texture Assets

This directory contains optimized KTX2/BasisU compressed textures with fallback formats.

## Directory Structure

```
textures/
├── environment/     # Environment maps (1024×512, UASTC)
├── materials/       # PBR material textures (2048×2048, ETC1S/UASTC)
├── ui/              # UI/overlay textures (1024×1024, ETC1S)
└── detail/          # Detail/noise textures (512×512, UASTC)
```

## Texture Format Convention

For each texture, provide three versions:

1. **`.ktx2`** - Primary compressed format (KTX2/BasisU)
2. **`.webp`** - Fallback for older browsers
3. **`.png`** - Final fallback for maximum compatibility

### Example:
```
textures/environment/
├── studio.ktx2      # ~180 KB (KTX2 compressed)
├── studio.webp      # ~850 KB (WebP fallback)
└── studio.png       # ~2.5 MB (PNG fallback)
```

## Adding New Textures

### Option 1: Use Conversion Script (Recommended)

```bash
# Place source textures in public/assets/
# Then run conversion script
node scripts/convert-textures.js

# Or with custom options
node scripts/convert-textures.js \
  --source=public/assets/my-textures \
  --output=public/textures/materials \
  --quality=uastc
```

### Option 2: Manual Conversion

```bash
# ETC1S for diffuse/albedo
toktx --bcmp --clevel 4 --qlevel 128 --t2 --mipmap \
  --resize 2048x2048 \
  public/textures/materials/wood.ktx2 \
  source/wood.png

# UASTC for normal maps
toktx --uastc 2 --normal_map --t2 --mipmap \
  --resize 2048x2048 \
  public/textures/materials/wood_normal.ktx2 \
  source/wood_normal.png

# Create WebP fallback
convert source/wood.png -resize 2048x2048\> -quality 90 \
  public/textures/materials/wood.webp
```

## Usage in Components

```tsx
import { useKTX2Texture } from '@/three/assetPipeline';

function MyComponent() {
  // Automatic KTX2 → WebP → PNG fallback
  const texture = useKTX2Texture('/textures/materials/wood');
  
  if (!texture) return null; // Loading...
  
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
```

## Memory Budget

**Target: ≤ 12 MB total compressed textures**

Current allocation:
- Environment maps: 2.0 MB
- Material textures: 6.0 MB
- UI textures: 2.0 MB
- Detail textures: 2.0 MB

Monitor usage:
```tsx
import { textureMemoryMonitor } from '@/three/assetPipeline';

// Log memory report every 5 seconds
useEffect(() => {
  const interval = setInterval(() => {
    textureMemoryMonitor.logReport();
  }, 5000);
  return () => clearInterval(interval);
}, []);
```

## Quality Guidelines

### When to use ETC1S (~80% compression)
- ✅ Diffuse/albedo color maps
- ✅ UI textures and overlays
- ✅ Background textures
- ✅ Non-critical detail textures

### When to use UASTC (~60% compression)
- ✅ Normal maps (preserve detail)
- ✅ Roughness/metallic maps
- ✅ Ambient occlusion maps
- ✅ Hero textures (close-up views)
- ✅ Environment maps

### When to use UASTC-MAX (~40% compression)
- ✅ Key marketing/hero assets
- ✅ Extremely close-up textures
- ⚠️ Use sparingly (large file sizes)

## Texture Naming Convention

Follow these patterns for automatic detection:

- `*_diffuse.ktx2` - Diffuse/albedo maps (ETC1S)
- `*_normal.ktx2` - Normal maps (UASTC)
- `*_roughness.ktx2` - Roughness maps (UASTC)
- `*_metallic.ktx2` - Metallic maps (UASTC)
- `*_ao.ktx2` - Ambient occlusion (ETC1S)
- `*_emissive.ktx2` - Emissive maps (ETC1S)

## Verification Checklist

Before deploying new textures:

- [ ] All textures have .ktx2, .webp, and .png versions
- [ ] Total compressed size ≤ 12 MB
- [ ] Visual quality: ΔE < 3 (compare in browser)
- [ ] Mipmaps generated for all textures
- [ ] Normal maps use UASTC compression
- [ ] File names follow naming convention
- [ ] Textures load correctly in Chrome, Firefox, Safari
- [ ] Mobile performance tested (Lighthouse ≥ 90)

## Troubleshooting

### Textures not loading?
1. Check browser console for errors
2. Verify BasisU transcoder in `/public/basis/`
3. Ensure fallback formats (.webp, .png) exist
4. Check file paths (no extension in code)

### Poor visual quality?
1. Use UASTC instead of ETC1S
2. Increase `--qlevel` for ETC1S (max 255)
3. Use `--uastc 4` for maximum UASTC quality
4. Check source texture is high resolution

### Large file sizes?
1. Use ETC1S instead of UASTC where possible
2. Reduce `--max-size` resolution
3. Lower `--qlevel` slightly (128 → 96)
4. Compress source textures before conversion

### Slow loading?
1. Preload critical textures with `preloadTextures()`
2. Use LOD system for distant objects
3. Enable texture atlasing where possible
4. Reduce total texture count

## Links

- [KTX-Software](https://github.com/KhronosGroup/KTX-Software)
- [Basis Universal](https://github.com/BinomialLLC/basis_universal)
- [Asset Pipeline Documentation](../src/three/assetPipeline/README.md)
