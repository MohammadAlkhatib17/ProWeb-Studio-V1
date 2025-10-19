# BasisU Transcoder

This directory must contain the Basis Universal transcoder WebAssembly files required for KTX2 texture decompression.

## Required Files

- `basis_transcoder.js` - JavaScript wrapper for the transcoder
- `basis_transcoder.wasm` - WebAssembly transcoder module

## Installation

### Option 1: Download from Three.js CDN (Recommended)

```bash
cd public/basis

# Download from Three.js CDN (v0.169.0)
curl -O https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/libs/basis/basis_transcoder.js
curl -O https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/libs/basis/basis_transcoder.wasm

# Verify files
ls -lh
# Should show:
# basis_transcoder.js   (~50 KB)
# basis_transcoder.wasm (~270 KB)
```

### Option 2: Copy from node_modules

```bash
cd public/basis

# Copy from installed Three.js package
cp ../../node_modules/three/examples/jsm/libs/basis/basis_transcoder.js .
cp ../../node_modules/three/examples/jsm/libs/basis/basis_transcoder.wasm .
```

### Option 3: Download from GitHub

```bash
cd public/basis

# Download directly from Three.js repository
wget https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/jsm/libs/basis/basis_transcoder.js
wget https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/jsm/libs/basis/basis_transcoder.wasm
```

## Verification

After installation, verify the files exist:

```bash
cd public/basis
ls -lh

# Expected output:
# total 320K
# -rw-r--r-- 1 user user  52K basis_transcoder.js
# -rw-r--r-- 1 user user 268K basis_transcoder.wasm
```

## Usage

The transcoder is automatically loaded by the KTX2Loader in `src/three/assetPipeline/KTX2Loader.ts`:

```typescript
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

const loader = new KTX2Loader();
loader.setTranscoderPath('/basis/'); // Points to this directory
loader.detectSupport(renderer);
```

## Important Notes

⚠️ **Do NOT modify these files** - They are binary WebAssembly and must remain exactly as downloaded.

⚠️ **Version compatibility** - Use transcoder files from the same Three.js version as your project (currently v0.169.0).

⚠️ **CORS** - These files must be served from the same origin as your app (which they are, from `/public/basis/`).

⚠️ **Git** - These files should be committed to version control, but consider using Git LFS for the .wasm file due to its size.

## Troubleshooting

### Issue: "Failed to load transcoder"

**Causes:**
- Transcoder files missing from `/public/basis/`
- Incorrect file permissions
- CORS issues (if served from different domain)

**Solution:**
```bash
# Re-download the files
cd public/basis
curl -O https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/libs/basis/basis_transcoder.js
curl -O https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/libs/basis/basis_transcoder.wasm

# Check they're readable
ls -lh
```

### Issue: "WebAssembly instantiation failed"

**Causes:**
- Corrupted .wasm file
- Browser doesn't support WebAssembly
- Content-Type header incorrect

**Solution:**
1. Re-download the files
2. Test in a modern browser (Chrome 76+, Firefox 78+, Safari 14+)
3. Check that Next.js is serving with correct MIME type (should be automatic)

### Issue: Textures showing as solid colors

**Causes:**
- Transcoder loaded but failed to decode
- Unsupported texture format for the device
- Texture file corrupted

**Solution:**
1. Check browser console for specific errors
2. Verify KTX2 files are valid with `ktxinfo`:
   ```bash
   ktxinfo path/to/texture.ktx2
   ```
3. Ensure fallback formats (.webp, .png) exist

## Browser Support

The transcoder supports these compression formats:

| Format | Browser Support |
|--------|----------------|
| ETC1/ETC2 | Chrome 76+, Firefox 78+, Edge 79+ |
| BC1-7 (DXT) | Desktop browsers, some mobile |
| PVRTC | iOS Safari |
| ASTC | Most modern mobile devices |

The transcoder automatically selects the best format for each device.

## Performance

- **Transcoder size:** ~320 KB (compressed with gzip: ~110 KB)
- **Load time:** < 50ms on fast connection
- **Transcoding speed:** ~10-50ms per texture (GPU-accelerated)
- **Memory overhead:** ~5-10 MB during transcoding

## Links

- [Basis Universal](https://github.com/BinomialLLC/basis_universal)
- [Three.js KTX2Loader](https://threejs.org/docs/#examples/en/loaders/KTX2Loader)
- [WebAssembly](https://webassembly.org/)
