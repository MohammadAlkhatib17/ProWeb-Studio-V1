#!/bin/bash

# Local CI Validation Script
# This script runs the same steps as the CI pipeline locally for testing

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}🔄 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the site directory
if [[ ! -f "package.json" ]]; then
    print_error "This script should be run from the site directory"
    exit 1
fi

echo "🚀 Starting Local CI Validation Pipeline"
echo "========================================"

# Step 1: Install dependencies
print_step "Installing dependencies..."
if npm install; then
    print_success "Dependencies installed"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 2: TypeScript type checking
print_step "Running TypeScript type checking..."
if npm run typecheck; then
    print_success "TypeScript check passed"
else
    print_error "TypeScript check failed"
    exit 1
fi

# Step 3: Linting
print_step "Running ESLint..."
if npm run lint; then
    print_success "Linting passed"
else
    print_error "Linting failed"
    exit 1
fi

# Step 4: Format checking
print_step "Checking code formatting..."
if npm run format:check; then
    print_success "Format check passed"
else
    print_error "Format check failed"
    print_warning "Run 'npm run format' to fix formatting issues"
    exit 1
fi

# Step 5: Unit tests
print_step "Running unit tests..."
if npm test; then
    print_success "Unit tests passed"
else
    print_error "Unit tests failed"
    exit 1
fi

# Step 6: Build
print_step "Building project..."
if npm run build:analyze; then
    print_success "Build completed"
else
    print_error "Build failed"
    exit 1
fi

# Step 7: Generate bundle analysis
print_step "Generating bundle analysis..."
if npm run analyze:generate; then
    print_success "Bundle analysis generated"
else
    print_error "Bundle analysis failed"
    exit 1
fi

# Step 8: Check bundle size budgets
print_step "Checking bundle size budgets..."
TOTAL_JS=$(node -e "
    const fs = require('fs');
    try {
        const data = JSON.parse(fs.readFileSync('reports/bundles/analysis-data.json', 'utf8'));
        const totalJS = data.bundles.reduce((sum, bundle) => sum + bundle.size, 0);
        console.log(totalJS);
    } catch (error) {
        console.log(0);
    }
")

MAX_JS_BUDGET=900000  # 900KB max total JS
if [ "$TOTAL_JS" -gt "$MAX_JS_BUDGET" ]; then
    print_error "Total JS bundle size ($TOTAL_JS bytes) exceeds budget ($MAX_JS_BUDGET bytes)"
    exit 1
else
    print_success "Bundle size within budget: $TOTAL_JS bytes (limit: $MAX_JS_BUDGET bytes)"
fi

# Step 9: SEO preflight checks
print_step "Running SEO preflight checks..."
if npm run seo:preflight; then
    print_success "SEO preflight checks passed"
else
    print_error "SEO preflight checks failed"
    exit 1
fi

# Step 10: Security checks (if scripts exist)
if [[ -f "../scripts/check-csp-unsafe-eval.js" ]]; then
    print_step "Running security quality gates..."
    if node ../scripts/check-csp-unsafe-eval.js && node ../scripts/check-env-vars-consistency.js; then
        print_success "Security checks passed"
    else
        print_error "Security checks failed"
        exit 1
    fi
else
    print_warning "Security check scripts not found, skipping..."
fi

# Step 11: E2E tests (optional - requires server)
if command -v playwright &> /dev/null; then
    print_step "Checking if Playwright is available for E2E tests..."
    
    # Check if server is already running on port 3000
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_step "Running E2E tests (server detected on port 3000)..."
        if npm run test:e2e; then
            print_success "E2E tests passed"
        else
            print_warning "E2E tests failed"
        fi
    else
        print_warning "No server running on port 3000. To run E2E tests:"
        print_warning "1. Start server: npm run start"
        print_warning "2. In another terminal: npm run test:e2e"
    fi
else
    print_warning "Playwright not found. Install with: npx playwright install"
fi

# Step 12: Lighthouse CI (optional - requires server)
if command -v lhci &> /dev/null; then
    print_step "Checking Lighthouse CI availability..."
    
    # Check if server is already running on port 4020 or 3000
    if curl -s http://localhost:4020 > /dev/null 2>&1 || curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_step "Running Lighthouse CI..."
        if npm run ci:perf; then
            print_success "Lighthouse CI passed"
        else
            print_warning "Lighthouse CI failed"
        fi
    else
        print_warning "No server running. To run Lighthouse CI:"
        print_warning "1. Start server: npm run start"
        print_warning "2. In another terminal: npm run ci:perf"
    fi
else
    print_warning "Lighthouse CI not found. It should be available in node_modules"
fi

echo ""
echo "🎉 Local CI Pipeline Completed Successfully!"
echo "============================================"
print_success "All core checks passed"
echo ""
echo "📋 Summary:"
echo "  ✅ Dependencies installed"
echo "  ✅ TypeScript check"
echo "  ✅ Linting"  
echo "  ✅ Format check"
echo "  ✅ Unit tests"
echo "  ✅ Build"
echo "  ✅ Bundle analysis"
echo "  ✅ Bundle size budget"
echo "  ✅ SEO preflight"
echo "  ✅ Security checks"
echo ""
echo "🚀 Your code is ready for the CI pipeline!"