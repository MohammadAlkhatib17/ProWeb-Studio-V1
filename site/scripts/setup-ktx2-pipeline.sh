#!/bin/bash

# KTX2 Texture Pipeline - Setup Script
# Downloads BasisU transcoder and sets up the texture pipeline

set -e

echo "🎨 Setting up KTX2 Texture Pipeline..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Base directory
BASE_DIR="site"
PUBLIC_DIR="$BASE_DIR/public"
BASIS_DIR="$PUBLIC_DIR/basis"

# Create directories
echo "${BLUE}Creating directories...${NC}"
mkdir -p "$BASIS_DIR"
mkdir -p "$PUBLIC_DIR/textures/environment"
mkdir -p "$PUBLIC_DIR/textures/materials"
mkdir -p "$PUBLIC_DIR/textures/ui"

# Download BasisU transcoder from Three.js CDN
echo "${BLUE}Downloading BasisU transcoder...${NC}"

THREE_VERSION="0.169.0"
CDN_BASE="https://cdn.jsdelivr.net/npm/three@${THREE_VERSION}/examples/jsm/libs/basis"

cd "$BASIS_DIR"

# Download JavaScript transcoder
if [ ! -f "basis_transcoder.js" ]; then
    echo "  Downloading basis_transcoder.js..."
    curl -sL -o basis_transcoder.js "$CDN_BASE/basis_transcoder.js"
    echo "${GREEN}  ✓ Downloaded basis_transcoder.js${NC}"
else
    echo "  ✓ basis_transcoder.js already exists"
fi

# Download WASM transcoder
if [ ! -f "basis_transcoder.wasm" ]; then
    echo "  Downloading basis_transcoder.wasm..."
    curl -sL -o basis_transcoder.wasm "$CDN_BASE/basis_transcoder.wasm"
    echo "${GREEN}  ✓ Downloaded basis_transcoder.wasm${NC}"
else
    echo "  ✓ basis_transcoder.wasm already exists"
fi

cd - > /dev/null

# Verify files
echo ""
echo "${BLUE}Verifying installation...${NC}"

if [ -f "$BASIS_DIR/basis_transcoder.js" ] && [ -f "$BASIS_DIR/basis_transcoder.wasm" ]; then
    JS_SIZE=$(wc -c < "$BASIS_DIR/basis_transcoder.js" | tr -d ' ')
    WASM_SIZE=$(wc -c < "$BASIS_DIR/basis_transcoder.wasm" | tr -d ' ')
    
    echo "${GREEN}✓ BasisU transcoder installed successfully${NC}"
    echo "  basis_transcoder.js:   $(numfmt --to=iec-i --suffix=B $JS_SIZE)"
    echo "  basis_transcoder.wasm: $(numfmt --to=iec-i --suffix=B $WASM_SIZE)"
else
    echo "${RED}✗ Installation failed${NC}"
    exit 1
fi

# Check for toktx
echo ""
echo "${BLUE}Checking for texture conversion tool...${NC}"

if command -v toktx &> /dev/null; then
    TOKTX_VERSION=$(toktx --version 2>&1 | head -n 1)
    echo "${GREEN}✓ toktx found: ${TOKTX_VERSION}${NC}"
else
    echo "${RED}✗ toktx not found${NC}"
    echo ""
    echo "To convert textures, install KTX-Software:"
    echo "  macOS:   brew install khronosgroup/toktx/toktx"
    echo "  Linux:   https://github.com/KhronosGroup/KTX-Software/releases"
    echo "  Docker:  docker pull khronosgroup/ktx-software"
    echo ""
    echo "Or skip conversion and use pre-converted textures."
fi

# Create sample placeholder textures
echo ""
echo "${BLUE}Creating sample placeholder textures...${NC}"

# Create a simple gradient PNG using ImageMagick (if available)
if command -v convert &> /dev/null; then
    # Sample environment map
    if [ ! -f "$PUBLIC_DIR/textures/environment/studio.png" ]; then
        convert -size 1024x512 gradient:skyblue-white \
            "$PUBLIC_DIR/textures/environment/studio.png" 2>/dev/null || true
        echo "${GREEN}  ✓ Created studio.png${NC}"
    fi
    
    # Sample material texture
    if [ ! -f "$PUBLIC_DIR/textures/materials/grid.png" ]; then
        convert -size 512x512 pattern:checkerboard \
            "$PUBLIC_DIR/textures/materials/grid.png" 2>/dev/null || true
        echo "${GREEN}  ✓ Created grid.png${NC}"
    fi
else
    echo "  ImageMagick not found - skipping sample texture generation"
    echo "  You can add your own textures to public/textures/"
fi

# Create README in textures directory
cat > "$PUBLIC_DIR/textures/README.md" << 'EOF'
# Textures Directory

Place your texture files here in the following structure:

```
textures/
├── environment/          # HDR/environment maps
│   ├── studio.ktx2
│   ├── studio.webp
│   └── studio.png
├── materials/            # PBR material textures
│   ├── wood_diffuse.ktx2
│   ├── wood_diffuse.webp
│   ├── wood_normal.ktx2
│   └── wood_normal.webp
└── ui/                   # UI textures
    ├── icon.ktx2
    └── icon.webp
```

## Converting Textures

Run the conversion script to generate KTX2 textures:

```bash
node site/scripts/convert-textures.js
```

This will:
1. Find all PNG/WebP in public/assets/
2. Convert to KTX2 with BasisU compression
3. Generate WebP fallbacks
4. Place results in public/textures/

## File Naming

When using textures in code, omit the extension:

```tsx
// ✅ Correct - no extension
useKTX2Texture('/textures/materials/wood')

// ❌ Wrong - don't include extension
useKTX2Texture('/textures/materials/wood.ktx2')
```

The loader will automatically try: `.ktx2` → `.webp` → `.png`
EOF

echo "${GREEN}  ✓ Created textures/README.md${NC}"

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "${GREEN}✨ Setup Complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Directory structure:"
echo "  $BASIS_DIR/           (BasisU transcoder ✓)"
echo "  $PUBLIC_DIR/textures/  (Texture directory ✓)"
echo ""
echo "Next steps:"
echo "  1. Add your textures to public/assets/"
echo "  2. Convert: node site/scripts/convert-textures.js"
echo "  3. Use in code: useKTX2Texture('/textures/your-texture')"
echo "  4. Test: npm run dev"
echo ""
echo "Documentation: site/src/three/assetPipeline/README.md"
echo ""
