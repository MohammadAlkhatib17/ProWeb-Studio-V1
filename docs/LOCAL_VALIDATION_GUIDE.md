# Local CI/CD Validation Guide

This guide explains how to validate your CI/CD pipeline locally before pushing to GitHub.

## Quick Start

### Option 1: Using Local Validation Script (Recommended)

```bash
# From the project root
cd site
../scripts/local-ci-validation.sh
```

This script runs the same checks as the CI pipeline in the correct order.

### Option 2: Manual Step-by-Step Validation

```bash
cd site

# 1. Install dependencies
npm ci

# 2. TypeScript type checking
npm run typecheck

# 3. Linting
npm run lint

# 4. Format checking
npm run format:check

# 5. Unit tests
npm test

# 6. Build with analysis
npm run build:analyze

# 7. Generate bundle analysis
npm run analyze:generate

# 8. SEO preflight
npm run seo:preflight

# 9. E2E tests (requires running server)
npm run start &
npm run test:e2e

# 10. Lighthouse CI
npm run ci:perf
```

## Advanced Validation

### Using Act to Run GitHub Actions Locally

[Act](https://github.com/nektos/act) allows you to run GitHub Actions workflows locally using Docker.

#### Installation

```bash
# On Ubuntu/Debian
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# On macOS
brew install act

# On Windows (using Chocolatey)
choco install act-cli
```

#### Usage

```bash
# Run the entire workflow (requires Docker)
act

# Run specific job
act -j typecheck
act -j lint  
act -j unit-tests
act -j build
act -j e2e-tests
act -j lighthouse-desktop
act -j lighthouse-mobile

# Run with custom runner image (faster)
act --container-architecture linux/amd64 -P ubuntu-latest=node:20-bullseye

# Run pull request workflow
act pull_request

# Dry run (show what would run without executing)
act --dry-run
```

#### Act Configuration

Create `.actrc` in project root for custom settings:

```bash
# .actrc
--container-architecture linux/amd64
-P ubuntu-latest=node:20-bullseye
--artifact-server-path /tmp/artifacts
```

### Docker-Based Local Validation

If you prefer Docker over Act:

```bash
# Create a Docker container similar to CI environment
docker run --rm -it \
  -v "$(pwd):/workspace" \
  -w /workspace/site \
  node:20-bullseye \
  bash -c "
    npm ci && \
    npm run typecheck && \
    npm run lint && \
    npm run format:check && \
    npm test && \
    npm run build:analyze && \
    npm run analyze:generate && \
    npm run seo:preflight
  "
```

## Performance Budget Testing

### Testing Budget Failures

To test that budget failures properly fail the workflow:

1. **Temporarily increase bundle size:**
   ```javascript
   // Add this to a component to increase bundle size
   import * as largeLibrary from 'some-large-library';
   console.log(largeLibrary);
   ```

2. **Run build and check:**
   ```bash
   npm run build:analyze
   npm run analyze:generate
   
   # Check if bundle size exceeds budget
   node -e "
     const fs = require('fs');
     const data = JSON.parse(fs.readFileSync('reports/bundles/analysis-data.json', 'utf8'));
     const totalJS = data.bundles.reduce((sum, bundle) => sum + bundle.size, 0);
     const budget = 900000; // 900KB
     console.log('Total JS:', totalJS, 'Budget:', budget);
     process.exit(totalJS > budget ? 1 : 0);
   "
   ```

3. **Test Lighthouse budget failures:**
   ```bash
   # Temporarily modify budgets.json to have very strict budgets
   # Then run Lighthouse CI
   npm run ci:perf
   ```

### Bundle Analysis Local Testing

```bash
# Generate detailed bundle analysis
npm run build:analyze
npm run analyze:generate

# View bundle analyzer in browser
npx next-bundle-analyzer

# Compare bundles between branches
git checkout main
npm run build:analyze && npm run analyze:generate
cp reports/bundles/analysis-data.json main-bundle.json

git checkout your-branch
npm run build:analyze && npm run analyze:generate
npm run bundle:compare main-bundle.json reports/bundles/analysis-data.json
```

## E2E Testing Local Setup

### Prerequisites

```bash
# Install Playwright browsers
npx playwright install --with-deps

# Or install specific browsers only
npx playwright install chromium firefox webkit
```

### Running E2E Tests

```bash
# Start the application
npm run build
npm run start &

# Wait for server to be ready
sleep 5

# Run E2E tests
npm run test:e2e

# Run with UI (helpful for debugging)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug mode (step through tests)
npm run test:e2e:debug

# Kill the server when done
pkill -f "next start"
```

### E2E Test Development

```bash
# Generate tests interactively
npx playwright codegen http://localhost:3000

# Run tests against different browsers
npx playwright test --project=chromium-desktop
npx playwright test --project=mobile-chrome
npx playwright test --project=webkit-desktop
```

## Lighthouse CI Local Testing

### Prerequisites

```bash
# Lighthouse CI is already installed as dev dependency
# But you can install globally if needed
npm install -g @lhci/cli
```

### Running Lighthouse CI

```bash
# Start server (Lighthouse CI will start it automatically)
npm run ci:perf        # Desktop
npm run ci:perf:mobile # Mobile

# Or manually:
npm run lhci:collect
npm run lhci:assert

# View reports
open .lighthouseci/lhci_reports/manifest.json
```

### Lighthouse Configuration Testing

```bash
# Test desktop configuration
lhci collect --config=lighthouserc.json
lhci assert --config=lighthouserc.json

# Test mobile configuration  
lhci collect --config=lighthouserc.mobile.json
lhci assert --config=lighthouserc.mobile.json

# Upload to temporary storage for review
lhci upload --config=lighthouserc.json
```

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   ```bash
   # Kill processes on commonly used ports
   kill -9 $(lsof -t -i:3000) 2>/dev/null || true
   kill -9 $(lsof -t -i:4020) 2>/dev/null || true
   ```

2. **Node modules issues:**
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Build issues:**
   ```bash
   # Clean Next.js build
   rm -rf .next
   npm run build
   ```

4. **Playwright issues:**
   ```bash
   # Reinstall browsers
   npx playwright install --force
   ```

### Debug Commands

```bash
# Verbose output for debugging
DEBUG=* npm run test:e2e
LHCI_DEBUG=true npm run ci:perf

# Check system resources
df -h  # Disk space
free -m  # Memory
docker system df  # Docker space (if using Act)
```

### Performance Monitoring

```bash
# Monitor resource usage during tests
htop &
npm run test:e2e

# Check network usage
iftop  # If available
```

## CI/CD Best Practices

### Before Committing

1. Run local validation script
2. Test E2E flows manually
3. Check bundle size impact
4. Verify performance metrics
5. Test on different viewports

### PR Checklist

- [ ] Local CI validation passes
- [ ] Bundle size within budget
- [ ] E2E tests pass
- [ ] Lighthouse scores meet targets
- [ ] No console errors
- [ ] Performance budgets respected
- [ ] Security checks pass

### Optimization Tips

1. **Speed up local testing:**
   - Use `npm ci` instead of `npm install`
   - Cache node_modules between runs
   - Use `--bail` flag for tests to fail fast

2. **Act optimization:**
   - Use smaller base images
   - Cache Docker layers
   - Run specific jobs instead of full workflow

3. **Resource management:**
   - Close unnecessary applications
   - Use SSD for better I/O performance
   - Increase Node.js memory if needed: `NODE_OPTIONS="--max-old-space-size=8192"`

## Integration with IDE

### VS Code Tasks

Add to `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Local CI Validation",
      "type": "shell",
      "command": "../scripts/local-ci-validation.sh",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "options": {
        "cwd": "${workspaceFolder}/site"
      }
    }
  ]
}
```

### Git Hooks

Add to `.git/hooks/pre-push`:

```bash
#!/bin/bash
cd site && ../scripts/local-ci-validation.sh
```

This ensures validation runs before every push to remote repository.