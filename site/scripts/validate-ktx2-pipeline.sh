#!/bin/bash

# KTX2 Texture Pipeline Validation Script
# Tests the texture pipeline setup and performance

set -e

echo "🧪 KTX2 Texture Pipeline Validation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0

# Check 1: BasisU transcoder files
echo "${BLUE}[1/6] Checking BasisU transcoder...${NC}"
if [ -f "site/public/basis/basis_transcoder.js" ] && [ -f "site/public/basis/basis_transcoder.wasm" ]; then
    JS_SIZE=$(wc -c < "site/public/basis/basis_transcoder.js" | tr -d ' ')
    WASM_SIZE=$(wc -c < "site/public/basis/basis_transcoder.wasm" | tr -d ' ')
    
    if [ $JS_SIZE -gt 1000 ] && [ $WASM_SIZE -gt 1000 ]; then
        echo "${GREEN}  ✓ Transcoder files present and valid${NC}"
    else
        echo "${RED}  ✗ Transcoder files are too small (corrupted?)${NC}"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo "${RED}  ✗ Transcoder files missing${NC}"
    echo "    Run: bash site/scripts/setup-ktx2-pipeline.sh"
    ERRORS=$((ERRORS + 1))
fi

# Check 2: Asset pipeline TypeScript files
echo ""
echo "${BLUE}[2/6] Checking asset pipeline files...${NC}"
REQUIRED_FILES=(
    "site/src/three/assetPipeline/KTX2Loader.ts"
    "site/src/three/assetPipeline/textureUtils.ts"
    "site/src/three/assetPipeline/useKTX2Texture.ts"
    "site/src/three/assetPipeline/index.ts"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "${GREEN}  ✓ ${file##*/}${NC}"
    else
        echo "${RED}  ✗ ${file##*/} missing${NC}"
        ERRORS=$((ERRORS + 1))
    fi
done

# Check 3: Component files
echo ""
echo "${BLUE}[3/6] Checking component files...${NC}"
COMPONENT_FILES=(
    "site/src/three/components/EnvironmentMap.tsx"
    "site/src/three/components/TexturedMesh.tsx"
    "site/src/three/components/index.ts"
)

for file in "${COMPONENT_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "${GREEN}  ✓ ${file##*/}${NC}"
    else
        echo "${RED}  ✗ ${file##*/} missing${NC}"
        ERRORS=$((ERRORS + 1))
    fi
done

# Check 4: Texture directories
echo ""
echo "${BLUE}[4/6] Checking texture directories...${NC}"
TEXTURE_DIRS=(
    "site/public/textures"
    "site/public/textures/environment"
    "site/public/textures/materials"
    "site/public/textures/ui"
)

for dir in "${TEXTURE_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "${GREEN}  ✓ ${dir##*/}/${NC}"
    else
        echo "${YELLOW}  ! ${dir##*/}/ missing (creating...)${NC}"
        mkdir -p "$dir"
    fi
done

# Check 5: Texture files count
echo ""
echo "${BLUE}[5/6] Checking texture files...${NC}"
KTX2_COUNT=$(find site/public/textures -name "*.ktx2" 2>/dev/null | wc -l | tr -d ' ')
WEBP_COUNT=$(find site/public/textures -name "*.webp" 2>/dev/null | wc -l | tr -d ' ')
PNG_COUNT=$(find site/public/textures -name "*.png" 2>/dev/null | wc -l | tr -d ' ')

echo "  KTX2 textures: $KTX2_COUNT"
echo "  WebP fallbacks: $WEBP_COUNT"
echo "  PNG fallbacks: $PNG_COUNT"

if [ $KTX2_COUNT -eq 0 ]; then
    echo "${YELLOW}  ! No KTX2 textures found${NC}"
    echo "    Add textures to site/public/assets/ and run:"
    echo "    node site/scripts/convert-textures.js"
else
    echo "${GREEN}  ✓ KTX2 textures present${NC}"
fi

# Check 6: TypeScript compilation
echo ""
echo "${BLUE}[6/6] Checking TypeScript compilation...${NC}"
cd site
if npm run typecheck 2>&1 | grep -q "error"; then
    echo "${RED}  ✗ TypeScript errors found${NC}"
    echo "    Run: npm run typecheck (in site directory)"
    ERRORS=$((ERRORS + 1))
else
    echo "${GREEN}  ✓ No TypeScript errors${NC}"
fi
cd ..

# Memory budget check
echo ""
echo "${BLUE}Checking texture memory budget...${NC}"
if [ $KTX2_COUNT -gt 0 ]; then
    TOTAL_SIZE=0
    while IFS= read -r -d '' file; do
        SIZE=$(wc -c < "$file" | tr -d ' ')
        TOTAL_SIZE=$((TOTAL_SIZE + SIZE))
    done < <(find site/public/textures -name "*.ktx2" -print0)
    
    TOTAL_MB=$(echo "scale=2; $TOTAL_SIZE / 1024 / 1024" | bc)
    echo "  Total KTX2 size: ${TOTAL_MB} MB"
    
    # Check if over budget (12 MB target)
    if (( $(echo "$TOTAL_MB > 12" | bc -l) )); then
        echo "${YELLOW}  ! Over budget (target: ≤12 MB)${NC}"
    else
        echo "${GREEN}  ✓ Within budget (target: ≤12 MB)${NC}"
    fi
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ]; then
    echo "${GREEN}✨ All checks passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Start dev server: npm run dev (in site directory)"
    echo "  2. Test KTX2 loading in browser console"
    echo "  3. Check texture memory: textureMemoryMonitor.logReport()"
    echo "  4. Run performance tests: npm run lighthouse"
else
    echo "${RED}✗ ${ERRORS} error(s) found${NC}"
    echo ""
    echo "Fix issues above and re-run validation."
    exit 1
fi

echo ""
echo "Performance targets:"
echo "  • Draw calls: ≤120 (desktop)"
echo "  • Texture memory: ≤12 MB"
echo "  • Lighthouse Performance: ≥90"
echo "  • Visual parity: ΔE < 3"
echo ""
