# Root Directory Setup: site/ as Project Root

## Overview

This documents the enforcement of `site/` as the root directory for all tooling and deployment configurations.

## Changes Made

### 1. CI/CD Workflow Updates

- **GitHub Actions**: Updated `.github/workflows/ci.yml` and `.github/workflows/lhci.yml`
  - Added `defaults.run.working-directory: site` to all jobs
  - Removed `--prefix site` from npm commands
  - Updated file paths to be relative to `site/`

### 2. Vercel Configuration

- **Removed** conflicting root `vercel.json`
- **Preserved** `site/vercel.json` as the authoritative deployment configuration
- **Vercel Project Settings**: Must be configured with:
  - Root Directory: `site`
  - Build Command: `npm run build:prod` (no workspace flags needed)
  - Install Command: `npm install`
  - Output Directory: `.next`

### 3. Workspace Scripts (Already Configured)

Root `package.json` provides convenience scripts that proxy to `site/`:

```json
{
  "scripts": {
    "dev": "npm run dev --workspace=site",
    "build": "npm run build --workspace=site",
    "test": "npm run test --workspace=site",
    "lint": "npm run lint --workspace=site",
    "typecheck": "npm run typecheck --workspace=site"
  }
}
```

## Development Workflow

### Option 1: Run from Repository Root (Recommended)
```bash
# From /path/to/ProWeb-Studio-V1
npm run dev
npm run build
npm run test
npm run lint
```

### Option 2: Run from site/ Directory
```bash
# From /path/to/ProWeb-Studio-V1/site
cd site
npm run dev
npm run build
npm run test
npm run lint
```

## Deployment Checklist

### Vercel Project Configuration

- [ ] Root Directory: `site`
- [ ] Framework: Next.js
- [ ] Build Command: `npm run build:prod`
- [ ] Install Command: `npm install`
- [ ] Output Directory: `.next`
- [ ] Node.js Version: 20.x

### Verification Steps

1. **Local Build Test**:
   ```bash
   npm run build  # From repo root
   ```

2. **CI Pipeline Test**:
   - Push to a feature branch
   - Verify all CI jobs pass with new working directory

3. **Deployment Test**:
   - Deploy to Vercel preview
   - Verify build succeeds with Root Directory = `site`

## Benefits

1. **Consistency**: All tooling treats `site/` as the project root
2. **Simplicity**: No workspace flags needed in CI or deployment
3. **Performance**: Shorter command execution paths
4. **Clarity**: Clear separation between monorepo structure and project root

## Migration Impact

- **Breaking**: Vercel projects must update Root Directory setting
- **Non-breaking**: Existing local development workflows continue to work
- **Improved**: CI execution is more efficient and readable

## Files Modified

- `.github/workflows/ci.yml`
- `.github/workflows/lhci.yml`
- `vercel.json` (removed from root)
- `docs/ROOT_DIRECTORY_SETUP.md` (this file)