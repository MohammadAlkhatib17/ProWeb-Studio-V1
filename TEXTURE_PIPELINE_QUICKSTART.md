# KTX2/BasisU Texture Pipeline - Quick Start

Get up and running with compressed textures in 5 minutes.

## 🚀 Quick Setup

### Step 1: Run Setup Script

```bash
# From project root
bash site/scripts/setup-ktx2-pipeline.sh
```

This will:
- ✅ Download BasisU transcoder files
- ✅ Create texture directories
- ✅ Set up folder structure

### Step 2: Install Conversion Tool (Optional)

**If you need to convert textures:**

```bash
# macOS
brew install khronosgroup/toktx/toktx

# Or use Docker
docker pull khronosgroup/ktx-software
```

**Skip if:** You already have `.ktx2` textures or don't need compression yet.

### Step 3: Add Sample Textures

Place your PNG/WebP textures in:

```bash
site/public/assets/
├── hero_background.png
├── material_wood.png
└── environment_studio.png
```

### Step 4: Convert to KTX2

```bash
node site/scripts/convert-textures.js
```

Output:
```
🎨 Texture Conversion to KTX2/BasisU
Found 3 texture(s) to convert

[1/3] hero_background.png... ✓ 82.3% smaller
[2/3] material_wood.png... ✓ 78.9% smaller
[3/3] environment_studio.png... ✓ 85.1% smaller

✨ Done! Textures are in: public/textures
```

### Step 5: Use in Your Code

```tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { useKTX2Texture } from '@/three/assetPipeline';

function MyComponent() {
  // Automatically loads .ktx2 with fallback to .webp/.png
  const texture = useKTX2Texture('/textures/materials/wood');
  
  if (!texture) return null; // Loading...
  
  return (
    <Canvas>
      <mesh>
        <boxGeometry />
        <meshStandardMaterial map={texture} />
      </mesh>
    </Canvas>
  );
}
```

### Step 6: Verify

```bash
# Validate setup
bash site/scripts/validate-ktx2-pipeline.sh

# Start dev server
cd site
npm run dev
```

Open browser console and look for:
```
✓ KTX2 texture loaded: /textures/materials/wood.ktx2
```

## 📊 Performance Monitoring

In browser console:

```javascript
// Import in your component
import { textureMemoryMonitor } from '@/three/assetPipeline';

// Log memory report
textureMemoryMonitor.logReport();
```

Output:
```
🎨 Texture Memory Report
Total: 3.45 MB
Compressed (KTX2): 3.12 MB
Uncompressed: 0.33 MB
```

## 🎯 Common Use Cases

### Environment Map

```tsx
import { EnvironmentMap } from '@/three/components';

<Canvas>
  <EnvironmentMap 
    path="/textures/environment/studio"
    intensity={1.0}
  />
  {/* Your 3D objects */}
</Canvas>
```

### Instanced Meshes

```tsx
import { TexturedMesh } from '@/three/components';

<Canvas>
  <TexturedMesh
    texturePath="/textures/materials/metal"
    count={100}
    animate={true}
  />
</Canvas>
```

### Demo Scene

```tsx
import { KTX2DemoScene } from '@/three';

export default function Page() {
  return <KTX2DemoScene useTextures={true} />;
}
```

## ✅ Validation Checklist

- [ ] Transcoder files in `public/basis/`
- [ ] Asset pipeline files in `src/three/assetPipeline/`
- [ ] Textures converted to `.ktx2`
- [ ] Fallback `.webp` files present
- [ ] No TypeScript errors
- [ ] Browser console shows KTX2 loads
- [ ] Total texture memory ≤ 12 MB

## 🆘 Troubleshooting

### "Failed to load texture"

**Check:**
1. Files exist: `.ktx2`, `.webp`, `.png`
2. Path is correct (no extension in code)
3. Transcoder files in `public/basis/`

### "White textures"

**Fix:**
```tsx
// For normal maps, use NoColorSpace
const normal = useKTX2Texture('/textures/normal', {
  colorSpace: THREE.NoColorSpace
});
```

### "toktx: command not found"

**Install:**
```bash
brew install khronosgroup/toktx/toktx
# or use Docker
```

## 📚 Full Documentation

See: [site/src/three/assetPipeline/README.md](../src/three/assetPipeline/README.md)

## 🎉 You're Done!

Your texture pipeline is ready. Next steps:

1. Convert your existing textures
2. Update components to use `useKTX2Texture()`
3. Monitor performance with `textureMemoryMonitor`
4. Run Lighthouse tests

**Performance targets:**
- Draw calls: ≤120
- Texture memory: ≤12 MB
- Lighthouse: ≥90

---

**Need help?** Check the full README or console logs for detailed error messages.
