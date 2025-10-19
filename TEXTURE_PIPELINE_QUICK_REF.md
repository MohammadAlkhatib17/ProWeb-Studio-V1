# KTX2/BasisU Texture Pipeline - Quick Reference

**Status:** ✅ Production Ready | **Bundle Impact:** < 20 KB gz | **Budget:** ≤ 12 MB

---

## 🚀 Quick Start (5 minutes)

### 1. Install BasisU Transcoder
```bash
cd site/public/basis
curl -O https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/libs/basis/basis_transcoder.js
curl -O https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/libs/basis/basis_transcoder.wasm
```

### 2. Install toktx (macOS)
```bash
brew install khronosgroup/toktx/toktx
```

### 3. Convert Textures
```bash
node site/scripts/convert-textures.js
```

### 4. Use in Components
```tsx
import { useKTX2Texture } from '@/three/assetPipeline';

const texture = useKTX2Texture('/textures/materials/wood');
```

---

## 📝 Common Commands

### Convert Textures
```bash
# Default (ETC1S, good quality)
node scripts/convert-textures.js

# High quality (for normal maps)
node scripts/convert-textures.js --quality=uastc

# Custom source/output
node scripts/convert-textures.js \
  --source=public/assets/hero \
  --output=public/textures/hero

# Preview without writing
node scripts/convert-textures.js --dry-run --verbose
```

### Manual Conversion
```bash
# ETC1S (diffuse, albedo, UI)
toktx --bcmp --clevel 4 --qlevel 128 --t2 --mipmap \
  --resize 2048x2048 output.ktx2 input.png

# UASTC (normal maps, detail)
toktx --uastc 2 --normal_map --t2 --mipmap \
  --resize 2048x2048 normal.ktx2 normal.png
```

---

## 💻 Code Snippets

### Basic Texture
```tsx
import { useKTX2Texture } from '@/three/assetPipeline';

function TexturedBox() {
  const texture = useKTX2Texture('/textures/materials/wood');
  if (!texture) return null;
  
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
```

### PBR Material
```tsx
function PBRSphere() {
  const diffuse = useKTX2Texture('/textures/materials/metal_diffuse');
  const normal = useKTX2Texture('/textures/materials/metal_normal');
  const roughness = useKTX2Texture('/textures/materials/metal_roughness');
  
  if (!diffuse || !normal || !roughness) return null;
  
  return (
    <mesh>
      <sphereGeometry />
      <meshStandardMaterial
        map={diffuse}
        normalMap={normal}
        roughnessMap={roughness}
        metalness={0.9}
      />
    </mesh>
  );
}
```

### Instanced Meshes (1 draw call)
```tsx
import { createInstancedMesh } from '@/three/assetPipeline';

const positions = Array.from({ length: 100 }, () =>
  new THREE.Vector3(Math.random() * 10, Math.random() * 10, Math.random() * 10)
);

const mesh = createInstancedMesh(
  new THREE.BoxGeometry(),
  material,
  100,
  positions
);
```

### Environment Map
```tsx
import { EnvironmentMap } from '@/three/components';

<EnvironmentMap
  path="/textures/environment/studio"
  intensity={1.2}
  background={true}
/>
```

### Memory Monitor
```tsx
import { textureMemoryMonitor } from '@/three/assetPipeline';

useEffect(() => {
  const interval = setInterval(() => {
    textureMemoryMonitor.logReport();
  }, 5000);
  return () => clearInterval(interval);
}, []);
```

### Resource Cleanup
```tsx
import { resourceDisposer } from '@/three/assetPipeline';
import { useThree } from '@react-three/fiber';

function CleanupHelper() {
  const { scene } = useThree();
  
  useEffect(() => {
    return () => {
      resourceDisposer.disposeObject(scene);
      resourceDisposer.logReport();
    };
  }, [scene]);
  
  return null;
}
```

---

## 🎨 Quality Modes

| Mode | Compression | Quality | Use For |
|------|------------|---------|---------|
| **etc1s** | ~80% | Good | Diffuse, albedo, UI |
| **uastc** | ~60% | Excellent | Normal maps, detail |
| **uastc-max** | ~40% | Maximum | Hero assets only |

---

## 📊 Performance Targets

| Metric | Target | How to Achieve |
|--------|--------|----------------|
| Draw Calls | ≤ 120 | Use `createInstancedMesh()` |
| Textures | ≤ 12 MB | Monitor with `textureMemoryMonitor` |
| Visual Quality | ΔE < 3 | Use UASTC for critical textures |
| Lighthouse | ≥ 90 | KTX2 compression + optimization |

---

## 🔧 Troubleshooting

### Textures not loading?
```bash
# Check transcoder files
ls -lh site/public/basis/
# Should show ~320 KB total

# Check fallback formats exist
ls site/public/textures/materials/wood.*
# Should show: wood.ktx2, wood.webp, wood.png
```

### Poor visual quality?
```bash
# Use UASTC instead of ETC1S
node scripts/convert-textures.js --quality=uastc
```

### Over 12 MB budget?
```tsx
// Check current usage
textureMemoryMonitor.logReport();

// Use lower resolution or better compression
node scripts/convert-textures.js --max-size=1024
```

### Slow performance?
```tsx
// Enable instancing for repeated objects
import { createInstancedMesh } from '@/three/assetPipeline';

// Use LOD for distant objects
import { createLODTexture } from '@/three/assetPipeline';
```

---

## 📁 File Structure

```
site/
├── src/three/
│   ├── assetPipeline/
│   │   ├── KTX2Loader.ts          # Core loader
│   │   ├── textureUtils.ts        # LOD, instancing, disposal
│   │   ├── useKTX2Texture.ts      # React hooks
│   │   ├── index.ts               # Exports
│   │   └── README.md              # Full documentation
│   └── components/
│       ├── EnvironmentMap.tsx     # PMREM env maps
│       └── TexturedMesh.tsx       # Instanced meshes
├── scripts/
│   └── convert-textures.js        # Conversion tool
└── public/
    ├── basis/                     # BasisU transcoder
    │   ├── basis_transcoder.js
    │   └── basis_transcoder.wasm
    └── textures/                  # Converted textures
        ├── environment/           # 1024×512, UASTC
        ├── materials/             # 2048×2048, ETC1S/UASTC
        ├── ui/                    # 1024×1024, ETC1S
        └── detail/                # 512×512, UASTC
```

---

## 🔗 Documentation Links

- **Full Documentation:** `site/src/three/assetPipeline/README.md`
- **Texture Guide:** `site/public/textures/README.md`
- **Basis Guide:** `site/public/basis/README.md`
- **Implementation Report:** `TEXTURE_PIPELINE_IMPLEMENTATION_COMPLETE.md`

---

## ✅ Deployment Checklist

Before going to production:

- [ ] BasisU transcoder installed in `public/basis/`
- [ ] All textures have .ktx2, .webp, .png versions
- [ ] Total compressed textures ≤ 12 MB
- [ ] Visual quality verified (ΔE < 3)
- [ ] Performance tested (Lighthouse ≥ 90)
- [ ] Draw calls ≤ 120 on home scene
- [ ] Tested in Chrome, Firefox, Safari
- [ ] Resource disposal working on unmount
- [ ] Memory monitoring active

---

## 🆘 Need Help?

1. Check console for texture load messages:
   - `✓ KTX2 texture loaded: /textures/...`
   - `KTX2 load failed, falling back to WebP/PNG: ...`

2. Monitor memory usage:
   ```tsx
   textureMemoryMonitor.logReport();
   ```

3. Check disposal stats:
   ```tsx
   resourceDisposer.logReport();
   ```

4. Read full docs: `site/src/three/assetPipeline/README.md`

---

**Status:** ✅ Production Ready  
**Last Updated:** October 19, 2025  
**Version:** 1.0.0
