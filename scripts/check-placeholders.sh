#!/bin/bash
# Codemod script to find and flag placeholder patterns
# This can be run periodically to detect reintroduced placeholders

echo "🔍 Checking for placeholder patterns..."

# Check for ellipsis character
echo "Checking for literal ellipsis character (…)..."
if grep -r "…" site/src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | grep -v "node_modules"; then
    echo "❌ Found literal ellipsis characters in source files"
    exit 1
fi

# Check for placeholder comments
echo "Checking for placeholder comments..."
if grep -r -i "placeholder.*actual\|TODO.*implement\|FIXME.*replace" site/src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | grep -v "node_modules"; then
    echo "⚠️  Found placeholder comments that may need implementation"
fi

# Check for placeholder API endpoints
echo "Checking for placeholder API endpoints..."
if grep -r "placeholder.*endpoint\|/api/.*placeholder\|fake.*api" site/src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | grep -v "node_modules"; then
    echo "❌ Found placeholder API endpoints"
    exit 1
fi

echo "✅ Placeholder check complete"