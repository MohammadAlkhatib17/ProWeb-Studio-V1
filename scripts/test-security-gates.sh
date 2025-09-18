#!/bin/bash

# Test script to validate the security quality gates work correctly

echo "🧪 Testing Security Quality Gates"
echo "=================================="
echo

# Test 1: Test CSP unsafe-eval detection
echo "📝 Test 1: CSP unsafe-eval detection"
echo "Creating test CSP config with unsafe-eval..."

# Create a temporary test file with unsafe-eval
cat > test-csp-violation.js << 'EOF'
// Test CSP configuration with unsafe-eval
const cspPolicy = "script-src 'self' 'unsafe-eval' https://example.com";
EOF

# Temporarily add this to the CSP check patterns by creating a test version
cp scripts/check-csp-unsafe-eval.js scripts/check-csp-unsafe-eval-test.js

# Modify test script to include test file
sed -i 's/CSP_CONFIG_FILES = \[/CSP_CONFIG_FILES = [\n  "test-csp-violation.js",/' scripts/check-csp-unsafe-eval-test.js

echo "Running CSP check (should fail)..."
if node scripts/check-csp-unsafe-eval-test.js 2>/dev/null; then
    echo "❌ Test failed: Should have detected unsafe-eval"
else
    echo "✅ Test passed: CSP unsafe-eval detection works"
fi

# Cleanup
rm -f test-csp-violation.js scripts/check-csp-unsafe-eval-test.js

echo

# Test 2: Test environment variable consistency
echo "📝 Test 2: Environment variable consistency"
echo "Testing with current clean state..."

if node scripts/check-env-vars-consistency.js > /dev/null 2>&1; then
    echo "✅ Test passed: Environment variables are consistent"
else
    echo "❌ Test failed: Environment variables should be consistent now"
fi

echo

# Test 3: Test the full CI pipeline simulation
echo "📝 Test 3: Full CI pipeline simulation"
echo "Running complete security quality gates..."

echo "🔒 Running security quality gates..."
echo "🛡️ Checking CSP for unsafe-eval directive..."
CSP_RESULT=$(node scripts/check-csp-unsafe-eval.js 2>&1)
CSP_EXIT_CODE=$?

echo "🔧 Checking environment variable consistency..."
ENV_RESULT=$(node scripts/check-env-vars-consistency.js 2>&1)
ENV_EXIT_CODE=$?

if [ $CSP_EXIT_CODE -eq 0 ] && [ $ENV_EXIT_CODE -eq 0 ]; then
    echo "✅ All security quality gates passed!"
    echo
    echo "🎉 Security Quality Gates Implementation Complete!"
    echo
    echo "Summary of protections added:"
    echo "• CSP unsafe-eval detection prevents security regressions"
    echo "• Environment variable consistency ensures deployment validation accuracy"
    echo "• CI pipeline will fail if violations are detected"
    echo "• Comprehensive documentation and troubleshooting guides provided"
else
    echo "❌ Some security quality gates failed"
    if [ $CSP_EXIT_CODE -ne 0 ]; then
        echo "   CSP check failed"
    fi
    if [ $ENV_EXIT_CODE -ne 0 ]; then
        echo "   Environment variable check failed"
    fi
fi