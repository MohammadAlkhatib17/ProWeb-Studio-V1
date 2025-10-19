#!/bin/bash
# Test script for production environment validation
# Tests both success and failure scenarios

set -e

echo "🧪 Testing Production Environment Validator"
echo "==========================================="
echo ""

# Save current NODE_ENV
ORIGINAL_NODE_ENV="${NODE_ENV:-}"

# Test 1: Non-production mode should skip validation
echo "Test 1: Non-production mode (should skip)..."
NODE_ENV=development node scripts/validate-production-env.js
if [ $? -eq 0 ]; then
  echo "✅ Test 1 passed: Skipped in development mode"
else
  echo "❌ Test 1 failed: Should skip in development mode"
  exit 1
fi
echo ""

# Test 2: Production mode with valid env vars (using CI config)
echo "Test 2: Valid environment variables..."
set -a
source .env.ci
set +a
NODE_ENV=production node scripts/validate-production-env.js
if [ $? -eq 0 ]; then
  echo "✅ Test 2 passed: Valid env vars accepted"
else
  echo "❌ Test 2 failed: Valid env vars should pass"
  exit 1
fi
# Clear env vars
unset SITE_URL NEXT_PUBLIC_PLAUSIBLE_DOMAIN CONTACT_INBOX NEXT_PUBLIC_RECAPTCHA_SITE_KEY RECAPTCHA_SECRET_KEY
echo ""

# Test 3: Production mode with missing critical var
echo "Test 3: Missing critical environment variable..."
export SITE_URL=""
export NEXT_PUBLIC_PLAUSIBLE_DOMAIN=""
export CONTACT_INBOX=""
export NEXT_PUBLIC_RECAPTCHA_SITE_KEY=""
export RECAPTCHA_SECRET_KEY=""
NODE_ENV=production node scripts/validate-production-env.js 2>&1 | grep -q "not set"
if [ $? -eq 0 ]; then
  echo "✅ Test 3 passed: Missing vars detected"
else
  echo "❌ Test 3 failed: Should detect missing vars"
  exit 1
fi
echo ""

# Test 4: Production mode with placeholder values
echo "Test 4: Placeholder values detection..."
export SITE_URL="https://your_site_url_here"
export NEXT_PUBLIC_PLAUSIBLE_DOMAIN="example.com"
export CONTACT_INBOX="test@example.com"
export NEXT_PUBLIC_RECAPTCHA_SITE_KEY="placeholder"
export RECAPTCHA_SECRET_KEY="changeme"
NODE_ENV=production node scripts/validate-production-env.js 2>&1 | grep -q "placeholder"
if [ $? -eq 0 ]; then
  echo "✅ Test 4 passed: Placeholder values detected"
else
  echo "❌ Test 4 failed: Should detect placeholder values"
  exit 1
fi
echo ""

# Test 5: Next.js config loads successfully with valid env
echo "Test 5: Next.js config loading in production mode..."
set -a
source .env.ci
set +a
cd site && NODE_ENV=production node -e "import('./next.config.mjs').then(() => { console.log('Config loaded'); process.exit(0); }).catch(err => { console.error('Failed:', err.message); process.exit(1); })"
if [ $? -eq 0 ]; then
  echo "✅ Test 5 passed: Next.js config loads successfully"
else
  echo "❌ Test 5 failed: Next.js config should load with valid env"
  exit 1
fi
cd ..
echo ""

# Cleanup
unset SITE_URL
unset NEXT_PUBLIC_PLAUSIBLE_DOMAIN
unset CONTACT_INBOX
unset NEXT_PUBLIC_RECAPTCHA_SITE_KEY
unset RECAPTCHA_SECRET_KEY
rm -f site/.env.production

# Restore original NODE_ENV
if [ -n "$ORIGINAL_NODE_ENV" ]; then
  export NODE_ENV="$ORIGINAL_NODE_ENV"
else
  unset NODE_ENV
fi

echo "==========================================="
echo "✅ All tests passed!"
echo ""
