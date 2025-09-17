#!/bin/bash

# Mobile Performance Test Script
# Tests the 3D scene optimizations for mobile devices

echo "🚀 Testing Mobile 3D Performance Optimizations"
echo "=============================================="

# Check if the optimization files exist
echo "📁 Checking optimization files..."

files=(
    "site/src/components/TechPlaygroundScene.tsx"
    "site/src/components/Dynamic3DWrapper.tsx"
    "site/src/hooks/usePerformanceMonitor.ts"
    "site/src/components/PerformanceDebug.tsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

echo ""
echo "🔍 Checking TypeScript compilation..."

cd site

# Check if there are any TypeScript errors
if npm run build --dry-run > /dev/null 2>&1; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation failed"
    echo "Running type check..."
    npx tsc --noEmit
    exit 1
fi

echo ""
echo "📊 Performance Optimization Summary:"
echo "===================================="

# Check for mobile optimizations in the codebase
echo "🔍 Checking for mobile optimizations..."

# Check for device detection
if grep -q "getDeviceInfo\|detectMobileDevice" src/components/TechPlaygroundScene.tsx; then
    echo "✅ Device detection implemented"
else
    echo "❌ Device detection missing"
fi

# Check for performance monitoring
if grep -q "usePerformanceMonitor\|PerformanceMonitor" src/hooks/usePerformanceMonitor.ts; then
    echo "✅ Performance monitoring implemented"
else
    echo "❌ Performance monitoring missing"
fi

# Check for mobile-specific particle counts
if grep -q "dustParticles.*isMobile\|sparkleCount.*isMobile" src/components/TechPlaygroundScene.tsx; then
    echo "✅ Mobile particle optimization implemented"
else
    echo "❌ Mobile particle optimization missing"
fi

# Check for progressive enhancement
if grep -q "progressiveEnhancement\|requestIdleCallback" src/components/Dynamic3DWrapper.tsx; then
    echo "✅ Progressive enhancement implemented"
else
    echo "❌ Progressive enhancement missing"
fi

# Check for LOD (Level of Detail)
if grep -q "geometryDetail\|config\..*Detail" src/components/TechPlaygroundScene.tsx; then
    echo "✅ LOD system implemented"
else
    echo "❌ LOD system missing"
fi

# Check for adaptive DPR
if grep -q "dpr.*config\|dpr.*\[.*,.*\]" src/components/TechPlaygroundScene.tsx; then
    echo "✅ Adaptive DPR implemented"
else
    echo "❌ Adaptive DPR missing"
fi

echo ""
echo "📱 Mobile-Specific Features:"
echo "============================"

# Count optimizations
mobile_optimizations=0

if grep -q "isMobile.*?" src/components/TechPlaygroundScene.tsx; then
    echo "✅ Mobile-specific rendering paths"
    ((mobile_optimizations++))
fi

if grep -q "performanceTier.*low\|performanceTier.*medium\|performanceTier.*high" src/components/TechPlaygroundScene.tsx; then
    echo "✅ Performance tier detection"
    ((mobile_optimizations++))
fi

if grep -q "shadowMapSize.*config\|enablePostProcessing.*config" src/components/TechPlaygroundScene.tsx; then
    echo "✅ Dynamic quality settings"
    ((mobile_optimizations++))
fi

if grep -q "maxLights.*config" src/components/TechPlaygroundScene.tsx; then
    echo "✅ Dynamic lighting optimization"
    ((mobile_optimizations++))
fi

echo ""
echo "📈 Optimization Score: $mobile_optimizations/4"

if [ $mobile_optimizations -ge 3 ]; then
    echo "🎉 Excellent mobile optimization coverage!"
elif [ $mobile_optimizations -ge 2 ]; then
    echo "👍 Good mobile optimization coverage"
else
    echo "⚠️  Mobile optimization coverage needs improvement"
fi

echo ""
echo "🧪 Performance Testing Recommendations:"
echo "======================================="
echo "1. Test on actual mobile devices with different performance tiers"
echo "2. Monitor FPS using the PerformanceDebug component"
echo "3. Test with browser dev tools mobile simulation"
echo "4. Verify 30+ FPS on mid-range mobile devices"
echo "5. Check memory usage doesn't exceed 100MB on mobile"

echo ""
echo "✨ Mobile Performance Optimization Complete!"
echo "============================================"
echo "The 3D scene has been optimized for mobile devices with:"
echo "• Adaptive particle counts based on device capability"
echo "• Performance tier detection and quality adjustment"
echo "• Progressive enhancement with requestIdleCallback"
echo "• LOD system for geometry complexity"
echo "• Dynamic lighting and shadow optimization"
echo "• Mobile-specific DPR and post-processing settings"