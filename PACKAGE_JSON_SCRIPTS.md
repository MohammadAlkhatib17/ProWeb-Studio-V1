# Package.json Script Additions

Add these scripts to your `site/package.json` for easy access to texture pipeline tools.

## Scripts to Add

```json
{
  "scripts": {
    "setup:textures": "bash scripts/setup-ktx2-pipeline.sh",
    "convert:textures": "node scripts/convert-textures.js",
    "validate:textures": "bash scripts/validate-ktx2-pipeline.sh",
    "textures:help": "node scripts/convert-textures.js --help"
  }
}
```

## Usage

```bash
# Initial setup - downloads transcoder
npm run setup:textures

# Convert textures from public/assets to public/textures
npm run convert:textures

# Validate the entire pipeline
npm run validate:textures

# Show conversion help
npm run textures:help
```

## Custom Conversion Examples

```bash
# Convert with UASTC (higher quality)
npm run convert:textures -- --quality uastc

# Convert specific directory
npm run convert:textures -- --source public/assets/hero --output public/textures/hero

# Limit texture size
npm run convert:textures -- --max-size 1024
```

## Integration with CI/CD

Add to your CI pipeline (e.g., `.github/workflows/ci.yml`):

```yaml
- name: Setup KTX2 Pipeline
  run: npm run setup:textures

- name: Validate Textures
  run: npm run validate:textures

- name: Build
  run: npm run build
```

## Pre-commit Hook

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Validate texture pipeline before commit
if [ -d "site/public/textures" ]; then
  cd site && npm run validate:textures
fi
```

---

**Note:** These are optional conveniences. All scripts can be run directly:
- `bash site/scripts/setup-ktx2-pipeline.sh`
- `node site/scripts/convert-textures.js`
- `bash site/scripts/validate-ktx2-pipeline.sh`
