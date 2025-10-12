#!/bin/bash
# Pre-commit cleanup validation script
# Prevents commits that introduce unused code or development artifacts

set -e

echo "🔍 Running pre-commit cleanup validation..."

# Check if we're in the site directory or change to it
if [[ "$(basename "$PWD")" != "site" ]]; then
  if [[ -d "site" ]]; then
    cd site
  else
    echo "ℹ️  Not in a workspace with site/ directory, skipping cleanup validation"
    exit 0
  fi
fi

# Check for common development artifacts
echo "📁 Checking for development artifacts..."

ARTIFACTS_FOUND=false

# Check for build logs
if find . -name "build.log" -o -name "*.log" -not -path "./node_modules/*" -not -path "./.next/*" | grep -q .; then
  echo "❌ Found build log files (should be in .gitignore):"
  find . -name "build.log" -o -name "*.log" -not -path "./node_modules/*" -not -path "./.next/*"
  ARTIFACTS_FOUND=true
fi

# Check for backup files (excluding build directories)
if find . \( -name "*.bak" -o -name "*.backup" -o -name "*.old" -o -name "*.tmp" -o -name "*~" \) -not -path "./node_modules/*" -not -path "./.next/*" -not -path "./reports/*" | grep -q .; then
  echo "❌ Found backup files:"
  find . \( -name "*.bak" -o -name "*.backup" -o -name "*.old" -o -name "*.tmp" -o -name "*~" \) -not -path "./node_modules/*" -not -path "./.next/*" -not -path "./reports/*"
  ARTIFACTS_FOUND=true
fi

# Check for files with spaces in names (potential dev artifacts)
if find . -name "* *" -type f -not -path "./node_modules/*" -not -path "./.next/*" | grep -q .; then
  echo "⚠️  Found files with spaces in names:"
  find . -name "* *" -type f -not -path "./node_modules/*" -not -path "./.next/*"
  echo "  (Consider renaming or verifying these are intentional)"
fi

if [ "$ARTIFACTS_FOUND" = true ]; then
  echo ""
  echo "❌ Development artifacts detected. Please clean up before committing."
  echo "   Add these file types to .gitignore if they should be ignored."
  exit 1
fi

# Run TypeScript unused locals/parameters check
echo "🔧 Checking TypeScript unused locals/parameters..."
if npx tsc --noEmit --noUnusedLocals --noUnusedParameters 2>&1 | grep -q "error TS6133\|error TS6196"; then
  echo "❌ Found unused TypeScript locals or parameters:"
  npx tsc --noEmit --noUnusedLocals --noUnusedParameters 2>&1 | grep "error TS6133\|error TS6196" || true
  echo ""
  echo "💡 Fix these before committing or add // eslint-disable-next-line @typescript-eslint/no-unused-vars"
  exit 1
fi

# Run ESLint to check for unused variables (quick check)
echo "📝 Checking for unused variables..."
LINT_OUTPUT=$(npm run lint 2>&1)
LINT_EXIT_CODE=$?

if [ $LINT_EXIT_CODE -ne 0 ]; then
  echo "❌ ESLint found issues (including potential unused variables)"
  echo "   Run 'npm run lint' to see details"
  exit 1
else
  echo "✅ No unused variables detected"
fi

echo ""
echo "✅ Pre-commit cleanup validation passed!"
echo "   No development artifacts or unused code detected."