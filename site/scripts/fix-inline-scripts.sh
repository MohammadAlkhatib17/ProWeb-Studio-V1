#!/bin/bash

# Script to fix remaining inline scripts with nonce handling
# This will update components that still use dangerouslySetInnerHTML without nonces

echo "🔧 Fixing remaining inline scripts with nonce handling"
echo "=================================================="

SITE_DIR="/home/mohammadalkhatib/Desktop/personal/ProWeb-Studio-V1/site"

# Components that still need fixing
components=(
    "src/components/DutchMarketFAQ.tsx"
    "src/components/LocalBusinessSchema.tsx"  
    "src/components/FAQSchema.tsx"
    "src/components/ServiceSchema.tsx"
    "src/components/portfolio/PortfolioSchema.tsx"
    "src/app/locaties/page.tsx"
    "src/app/diensten/page.tsx"
    "src/app/locaties/[location]/page.tsx"
)

# Add NonceScript import if not present
add_nonce_import() {
    local file="$1"
    
    if ! grep -q "import.*NonceScript.*from.*@/lib/nonce" "$file"; then
        echo "  Adding NonceScript import to $file"
        
        # Find the last import line and add after it
        sed -i '/^import.*from/a import { NonceScript } from '\''@/lib/nonce'\'';' "$file"
    fi
}

# Function to replace inline scripts
fix_inline_scripts() {
    local file="$1"
    
    echo "Processing: $file"
    
    # Check if file has inline scripts
    if grep -q 'type="application/ld+json".*dangerouslySetInnerHTML' "$file"; then
        echo "  Found inline scripts to fix"
        add_nonce_import "$file"
        
        # This is a complex replacement, so we'll note it for manual review
        echo "  ⚠️  Manual review needed for: $file"
        echo "     Replace <script type=\"application/ld+json\" dangerouslySetInnerHTML={{__html: JSON.stringify(data)}} />"
        echo "     With: <NonceScript>{JSON.stringify(data)}</NonceScript>"
    else
        echo "  ✅ No inline scripts found"
    fi
    
    echo ""
}

# Process each component
for component in "${components[@]}"; do
    full_path="$SITE_DIR/$component"
    if [[ -f "$full_path" ]]; then
        fix_inline_scripts "$full_path"
    else
        echo "⚠️  File not found: $full_path"
    fi
done

echo "🔍 Summary of components that need manual review:"
echo "These components have inline scripts that should be converted to use NonceScript:"

for component in "${components[@]}"; do
    full_path="$SITE_DIR/$component"
    if [[ -f "$full_path" ]] && grep -q 'type="application/ld+json".*dangerouslySetInnerHTML' "$full_path"; then
        echo "  - $component"
    fi
done

echo ""
echo "✅ Import additions complete. Manual script replacements needed."
echo "💡 Pattern: Replace dangerouslySetInnerHTML scripts with <NonceScript>{JSON.stringify(data)}</NonceScript>"