# KTX2/BasisU Texture Pipeline

Comprehensive texture compression system using KTX2 format with BasisU codec for optimal performance and quality in Three.js applications.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Setup](#setup)
- [Usage](#usage)
- [Texture Conversion](#texture-conversion)
- [Performance Guidelines](#performance-guidelines)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This asset pipeline integrates **KTX2Loader** with **BasisU** (Basis Universal) compression to deliver:

- **~80% smaller texture sizes** compared to PNG/WebP
- **GPU-accelerated decompression** for zero CPU overhead
- **Automatic fallback** to WebP/PNG for unsupported browsers
- **PMREM environment maps** for realistic lighting
- **Instanced rendering** support for optimal draw calls
- **Memory tracking** and optimization tools

### Compression Stats

| Format | Size | Quality | Use Case |
|--------|------|---------|----------|
| PNG | 2.5 MB | Reference | Source |
| WebP | 850 KB | High | Fallback |
| KTX2 (ETC1S) | 180 KB | Good | Default textures |
| KTX2 (UASTC) | 420 KB | Excellent | Normal maps, detail |

## ✨ Features

### Core Capabilities

- ✅ **KTX2 with BasisU compression** - Universal GPU texture format
- ✅ **Automatic format detection** - Seamless browser support detection
- ✅ **Smart fallback system** - KTX2 → WebP → PNG cascade
- ✅ **PMREM environment maps** - Pre-filtered mipmaps for IBL
- ✅ **Texture memory monitoring** - Real-time usage tracking
- ✅ **React hooks integration** - Easy React Three Fiber usage
- ✅ **Instancing support** - Efficient multi-instance rendering
- ✅ **TypeScript** - Full type safety

### Performance Targets

- ✅ Draw calls ≤ 120 (desktop)
- ✅ Total compressed textures ≤ 12 MB
- ✅ Mobile Lighthouse Performance ≥ 90
- ✅ Visual parity ΔE < 3

## 🏗️ Architecture

### Directory Structure

```
site/
├── src/three/
│   ├── assetPipeline/
│   │   ├── KTX2Loader.ts         # Core loader with fallback
│   │   ├── textureUtils.ts       # Utilities and monitoring
│   │   ├── useKTX2Texture.ts     # React hooks
│   │   └── index.ts              # Main export
│   └── components/
│       ├── EnvironmentMap.tsx    # PMREM environment component
│       ├── TexturedMesh.tsx      # Instanced mesh example
│       └── index.ts
├── public/
│   ├── textures/                 # Converted KTX2 textures
│   │   ├── environment/
│   │   ├── materials/
│   │   └── ui/
│   └── basis/                    # BasisU transcoder WASM
│       ├── basis_transcoder.js
│       └── basis_transcoder.wasm
└── scripts/
    └── convert-textures.js       # Conversion utility
```

### Data Flow

```
Source Texture (PNG/WebP)
    ↓
[Conversion Script]
    ↓
KTX2 + WebP Fallbacks
    ↓
[KTX2Loader]
    ├── Browser supports KTX2? → Load .ktx2
    └── No support? → Load .webp → .png
    ↓
[React Hook]
    ↓
Three.js Texture → GPU
```

## 🚀 Setup

### 1. Install Dependencies

The required Three.js packages are already in `package.json`:

```json
{
  "dependencies": {
    "@react-three/fiber": "^8.18.0",
    "@react-three/drei": "^9.122.0",
    "three": "^0.169.0"
  }
}
```

### 2. Download BasisU Transcoder

Download the BasisU transcoder files and place them in `public/basis/`:

```bash
# Create basis directory
mkdir -p site/public/basis

# Download from Three.js CDN
cd site/public/basis
curl -O https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/libs/basis/basis_transcoder.js
curl -O https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/libs/basis/basis_transcoder.wasm
```

Or manually download from:
- https://github.com/mrdoob/three.js/tree/dev/examples/jsm/libs/basis

### 3. Install Texture Conversion Tool

Install `toktx` from KTX-Software:

**macOS:**
```bash
brew install khronosgroup/toktx/toktx
```

**Linux:**
```bash
# Download from releases
wget https://github.com/KhronosGroup/KTX-Software/releases/download/v4.3.0/KTX-Software-4.3.0-Linux.deb
sudo dpkg -i KTX-Software-4.3.0-Linux.deb
```

**Windows:**
Download installer from: https://github.com/KhronosGroup/KTX-Software/releases

**Docker (all platforms):**
```bash
docker pull khronosgroup/ktx-software
alias toktx='docker run --rm -v $(pwd):/work khronosgroup/ktx-software toktx'
```

### 4. Verify Setup

```bash
# Check toktx is installed
toktx --version

# Verify transcoder files
ls -lh site/public/basis/
```

## 💻 Usage

### Basic Texture Loading

```tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { useKTX2Texture } from '@/three/assetPipeline';

function TexturedBox() {
  const texture = useKTX2Texture('/textures/materials/wood');
  
  if (!texture) return null; // Loading...
  
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export default function Scene() {
  return (
    <Canvas>
      <TexturedBox />
    </Canvas>
  );
}
```

### Environment Map

```tsx
import { Canvas } from '@react-three/fiber';
import { EnvironmentMap } from '@/three/components';

export default function Scene() {
  return (
    <Canvas>
      <EnvironmentMap 
        path="/textures/environment/studio"
        intensity={1.0}
        background={true}
      />
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial metalness={0.9} roughness={0.1} />
      </mesh>
    </Canvas>
  );
}
```

### Instanced Meshes

```tsx
import { TexturedMesh } from '@/three/components';

function Scene() {
  return (
    <TexturedMesh
      texturePath="/textures/materials/metal"
      count={100}
      animate={true}
    />
  );
}
```

### Advanced: Custom Texture Options

```tsx
import { useKTX2Texture } from '@/three/assetPipeline';
import * as THREE from 'three';

function CustomTexturedMesh() {
  const diffuse = useKTX2Texture('/textures/materials/brick_diffuse', {
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
    anisotropy: 16,
  });
  
  const normal = useKTX2Texture('/textures/materials/brick_normal', {
    colorSpace: THREE.NoColorSpace, // Linear for normal maps
  });
  
  const roughness = useKTX2Texture('/textures/materials/brick_roughness');
  
  if (!diffuse || !normal || !roughness) return null;
  
  return (
    <mesh>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial
        map={diffuse}
        normalMap={normal}
        roughnessMap={roughness}
        normalScale={[1, 1]}
      />
    </mesh>
  );
}
```

## 🔄 Texture Conversion

### Prerequisites

Install `toktx` from KTX-Software (required for conversion):

**macOS:**
```bash
brew install khronosgroup/toktx/toktx

# Verify installation
toktx --version
```

**Ubuntu/Debian Linux:**
```bash
# Download latest release
wget https://github.com/KhronosGroup/KTX-Software/releases/download/v4.3.2/KTX-Software-4.3.2-Linux-x86_64.deb

# Install package
sudo dpkg -i KTX-Software-4.3.2-Linux-x86_64.deb

# Verify installation
toktx --version
```

**Fedora/RHEL Linux:**
```bash
# Download latest release
wget https://github.com/KhronosGroup/KTX-Software/releases/download/v4.3.2/KTX-Software-4.3.2-Linux-x86_64.rpm

# Install package
sudo rpm -i KTX-Software-4.3.2-Linux-x86_64.rpm

# Verify installation
toktx --version
```

**Windows:**
1. Download installer from: https://github.com/KhronosGroup/KTX-Software/releases
2. Run `KTX-Software-4.3.2-Windows-x64.exe`
3. Add to PATH: `C:\Program Files\KTX-Software\bin`
4. Verify in PowerShell: `toktx --version`

**Docker (Universal):**
```bash
# Pull official image
docker pull khronosgroup/ktx-software:latest

# Create alias for easy use
alias toktx='docker run --rm -v $(pwd):/work -w /work khronosgroup/ktx-software toktx'

# Verify installation
toktx --version
```

**Optional Dependencies:**

For WebP/PNG fallback generation, install one of:

```bash
# Option 1: Sharp (recommended, installed via npm)
npm install sharp  # Already in package.json

# Option 2: ImageMagick (system-wide)
# macOS
brew install imagemagick

# Ubuntu/Debian
sudo apt install imagemagick

# Windows
# Download from: https://imagemagick.org/script/download.php
```

### Convert Existing Textures

**Basic Usage:**

```bash
# Convert all textures in public/assets
node site/scripts/convert-textures.js

# With custom directories
node site/scripts/convert-textures.js \
  --source=site/public/assets/hero \
  --output=site/public/textures/hero

# Preview without writing files
node site/scripts/convert-textures.js --dry-run --verbose
```

**Quality Modes:**

```bash
# ETC1S (default) - Best compression, good quality
node site/scripts/convert-textures.js --quality=etc1s

# UASTC - Higher quality for normal maps and detail
node site/scripts/convert-textures.js --quality=uastc

# UASTC-MAX - Maximum quality for hero textures
node site/scripts/convert-textures.js --quality=uastc-max
```

**Advanced Options:**

```bash
# Limit maximum texture size
node site/scripts/convert-textures.js --max-size=1024

# Skip fallback generation (KTX2 only)
node site/scripts/convert-textures.js --no-webp --no-png

# Verbose mode with detailed logs
node site/scripts/convert-textures.js --verbose

# Complete example
node site/scripts/convert-textures.js \
  --source=public/assets/materials \
  --output=public/textures/materials \
  --quality=uastc \
  --max-size=2048 \
  --verbose
```

### Compression Quality Modes

| Mode | Size Reduction | Quality | Best For | Use Cases |
|------|---------------|---------|----------|-----------|
| **etc1s** | ~80% | Good | Diffuse, Albedo | UI textures, backgrounds, color maps |
| **uastc** | ~60% | Excellent | Normal, Detail | Normal maps, roughness, metallic |
| **uastc-max** | ~40% | Maximum | Hero Assets | Key visuals, close-up textures |

**ETC1S (Default) - Best Compression:**
- ~80% size reduction
- Good quality for most textures
- Fast transcoding on all devices
- Recommended for: diffuse, albedo, UI textures

```bash
node site/scripts/convert-textures.js --quality=etc1s
```

**UASTC - Higher Quality:**
- ~60% size reduction
- Excellent quality preservation
- Slower transcoding, higher memory usage
- Recommended for: normal maps, detail textures, important visuals

```bash
node site/scripts/convert-textures.js --quality=uastc
```

**UASTC-MAX - Maximum Quality:**
- ~40% size reduction
- Near-lossless quality
- Use sparingly for hero assets
- Recommended for: key hero textures, marketing visuals

```bash
node site/scripts/convert-textures.js --quality=uastc-max
```

### Manual Conversion (Advanced)

For fine-grained control, use `toktx` directly:

**ETC1S compression:**
```bash
toktx --bcmp \              # BasisU ETC1S mode
  --clevel 4 \              # Compression level (0-5, higher = smaller)
  --qlevel 128 \            # Quality level (1-255, higher = better)
  --t2 \                    # KTX2 format
  --mipmap \                # Generate mipmaps
  --resize 2048x2048 \      # Resize to power-of-2
  --genmipmap \             # Generate all mipmap levels
  output.ktx2 input.png
```

**UASTC compression:**
```bash
toktx --uastc 2 \           # UASTC quality level (0-4, higher = better)
  --uastc_rdo_l 0.5 \       # Rate-distortion optimization (0.0-10.0)
  --t2 \                    # KTX2 format
  --mipmap \                # Generate mipmaps
  --resize 2048x2048 \      # Resize to power-of-2
  output.ktx2 input.png
```

**Normal map (UASTC recommended):**
```bash
toktx --uastc 2 \           # High quality for normals
  --normal_map \            # Optimize for normal data
  --t2 \                    # KTX2 format
  --mipmap \                # Generate mipmaps
  --resize 2048x2048 \      # Resize to power-of-2
  normal.ktx2 normal_input.png
```

**Cube map (environment):**
```bash
# Convert each face individually
for face in px nx py ny pz nz; do
  toktx --bcmp --clevel 4 --qlevel 128 --t2 \
    --mipmap --resize 1024x1024 \
    env_${face}.ktx2 env_${face}.png
done
```

**Batch conversion with shell script:**
```bash
#!/bin/bash
# Convert all PNGs in current directory to KTX2

for file in *.png; do
  basename="${file%.png}"
  
  # Detect if it's a normal map
  if [[ "$basename" == *"normal"* ]] || [[ "$basename" == *"_n" ]]; then
    # Use UASTC for normal maps
    toktx --uastc 2 --normal_map --t2 --mipmap \
      "${basename}.ktx2" "$file"
  else
    # Use ETC1S for other textures
    toktx --bcmp --clevel 4 --qlevel 128 --t2 --mipmap \
      "${basename}.ktx2" "$file"
  fi
  
  echo "✓ Converted: $file → ${basename}.ktx2"
done
```

### Texture Organization

Organize textures by usage for better management:

```
public/textures/
├── environment/          # Environment maps (1024×512, UASTC)
│   ├── studio.ktx2
│   ├── studio.webp
│   └── studio.png
├── materials/            # PBR material textures (2048×2048, ETC1S)
│   ├── wood_diffuse.ktx2
│   ├── wood_diffuse.webp
│   ├── wood_normal.ktx2  # UASTC for normal maps
│   ├── wood_normal.webp
│   └── ...
├── ui/                   # UI textures (1024×1024, ETC1S)
│   ├── logo.ktx2
│   ├── logo.webp
│   └── ...
└── detail/               # Detail textures (512×512, UASTC)
    ├── noise.ktx2
    └── ...
```

## 📊 Performance Guidelines

### Texture Budget

| Category | Max Size (MB) | Resolution | Format |
|----------|---------------|------------|--------|
| Environment Maps | 2.0 | 1024×512 | UASTC |
| Material Textures | 6.0 | 2048×2048 | ETC1S |
| UI Textures | 2.0 | 1024×1024 | ETC1S |
| Detail Textures | 2.0 | 512×512 | UASTC |
| **Total** | **≤12.0** | - | - |

### Draw Call Optimization

```tsx
// ❌ Bad: 100 draw calls
{Array(100).fill(0).map((_, i) => (
  <mesh key={i}>
    <boxGeometry />
    <meshStandardMaterial map={texture} />
  </mesh>
))}

// ✅ Good: 1 draw call
import { createInstancedMesh } from '@/three/assetPipeline';

const positions = Array(100).fill(0).map(() => 
  new THREE.Vector3(
    Math.random() * 10 - 5,
    Math.random() * 10 - 5,
    Math.random() * 10 - 5
  )
);

const mesh = createInstancedMesh(
  new THREE.BoxGeometry(),
  material,
  100,
  positions
);
```

### Memory Monitoring

```tsx
import { textureMemoryMonitor } from '@/three/assetPipeline';

// Log texture memory report
useEffect(() => {
  const interval = setInterval(() => {
    textureMemoryMonitor.logReport();
  }, 5000);
  
  return () => clearInterval(interval);
}, []);
```

Expected output:
```
🎨 Texture Memory Report
Total: 8.45 MB
Compressed (KTX2): 7.12 MB
Uncompressed: 1.33 MB

┌─────────┬────────────────────────────────┬────────────┬───────┬────────┬────────┬────────────┐
│ (index) │ path                           │ format     │ width │ height │ memoryMB│ compressed │
├─────────┼────────────────────────────────┼────────────┼───────┼────────┼────────┼────────────┤
│    0    │ '/textures/environment/studio' │'KTX2/BasisU'│ 1024  │  512   │  2.14  │    true    │
│    1    │ '/textures/materials/wood'     │'KTX2/BasisU'│ 2048  │  2048  │  4.21  │    true    │
└─────────┴────────────────────────────────┴────────────┴───────┴────────┴────────┴────────────┘
```

## 📚 API Reference

### loadTexture()

Load texture with automatic KTX2/fallback handling.

```typescript
loadTexture(
  basePath: string,
  renderer: THREE.WebGLRenderer,
  options?: TextureLoadOptions
): Promise<THREE.Texture>
```

**Options:**
```typescript
interface TextureLoadOptions {
  wrapS?: THREE.Wrapping;           // Default: RepeatWrapping
  wrapT?: THREE.Wrapping;           // Default: RepeatWrapping
  magFilter?: THREE.TextureFilter;  // Default: LinearFilter
  minFilter?: THREE.TextureFilter;  // Default: LinearMipmapLinearFilter
  anisotropy?: number;              // Default: 16
  colorSpace?: THREE.ColorSpace;    // Default: SRGBColorSpace
  flipY?: boolean;                  // Default: true
  mapping?: THREE.Mapping;          // Optional
}
```

### useKTX2Texture()

React hook for loading textures.

```typescript
useKTX2Texture(
  path: string | null,
  options?: TextureLoadOptions
): THREE.Texture | null
```

### loadPMREMEnvironment()

Load PMREM-processed environment map.

```typescript
loadPMREMEnvironment(
  basePath: string,
  renderer: THREE.WebGLRenderer
): Promise<THREE.Texture>
```

### createInstancedMesh()

Create optimized instanced mesh.

```typescript
createInstancedMesh(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  count: number,
  positions: THREE.Vector3[],
  rotations?: THREE.Euler[],
  scales?: THREE.Vector3[]
): THREE.InstancedMesh
```

## 🧪 Testing

### Visual Parity Test

Compare KTX2 vs original textures:

```bash
# Build and start
npm run build
npm run start

# Open in browser
# Check console for texture load confirmations
# Visual delta should be ΔE < 3
```

### Performance Test

```bash
# Run Lighthouse
npm run lighthouse

# Check Core Web Vitals
npm run perf:validate

# Expected results:
# - Performance Score: ≥90 (mobile)
# - Draw calls: ≤120 (desktop)
# - Texture memory: ≤12 MB
```

### Browser Compatibility

Test matrix:

| Browser | KTX2 Support | Fallback |
|---------|--------------|----------|
| Chrome 76+ | ✅ ETC1S/UASTC | - |
| Firefox 78+ | ✅ ETC1S/UASTC | - |
| Safari 14+ | ✅ ETC1S | WebP |
| Edge 79+ | ✅ ETC1S/UASTC | - |
| Mobile Chrome | ✅ ETC1S | - |
| iOS Safari | ✅ ETC1S | WebP |

## 🔧 Troubleshooting

### Issue: Textures not loading

**Check console for:**
```
✓ KTX2 texture loaded: /textures/environment/studio.ktx2
```

**If you see "Failed to load":**
1. Verify transcoder files in `public/basis/`
2. Check texture files exist (`.ktx2`, `.webp`, `.png`)
3. Verify file paths are correct (no extension in path)

### Issue: White/pink textures

**Causes:**
- Missing fallback files (WebP/PNG)
- Incorrect colorSpace for normal maps
- CORS issues with texture files

**Solution:**
```tsx
// For normal maps, use NoColorSpace
const normal = useKTX2Texture('/textures/normal', {
  colorSpace: THREE.NoColorSpace
});
```

### Issue: Poor performance

**Check:**
1. Total texture memory: `textureMemoryMonitor.logReport()`
2. Draw calls (should be ≤120)
3. Use instancing for repeated objects
4. Enable texture compression verification

### Issue: Conversion script fails

**Error:** `toktx: command not found`

**Solution:**
```bash
# macOS
brew install khronosgroup/toktx/toktx

# Or use Docker
docker pull khronosgroup/ktx-software
```

### Issue: Large file sizes

**Check compression quality:**
```bash
# Switch to ETC1S for better compression
node scripts/convert-textures.js --quality etc1s

# Reduce max size
node scripts/convert-textures.js --max-size 1024
```

## 📝 Next Steps

1. ✅ Convert existing PNG/WebP textures to KTX2
2. ✅ Copy BasisU transcoder to `public/basis/`
3. ✅ Update components to use `useKTX2Texture()` hook
4. ✅ Test in multiple browsers
5. ✅ Run performance benchmarks
6. ✅ Monitor texture memory usage

## 🤝 Contributing

When adding new textures:

1. Add source PNG/WebP to `public/assets/`
2. Run conversion: `node scripts/convert-textures.js`
3. Update components to use new texture paths
4. Test visual parity and performance
5. Update texture budget in this README

## 📄 License

Part of ProWeb Studio V1 - Internal use.

---

**Last Updated:** October 2025
**Performance Targets:** ≤120 draw calls, ≤12 MB textures, ≥90 Lighthouse score
