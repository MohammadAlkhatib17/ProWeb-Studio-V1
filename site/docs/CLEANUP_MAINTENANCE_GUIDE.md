# Cleanup Maintenance Guide

## Overview
This guide provides comprehensive instructions for maintaining code cleanliness and preventing regression of our cleanup efforts in the ProWeb Studio V1 project.

## Quick Start

### For Developers
```bash
# Check your code before committing
npm run cleanup:check

# Run full cleanup validation
npm run cleanup:validate

# Generate cleanup inventory report
npm run cleanup:inventory
```

### For Code Reviews
- ✅ Run `npm run cleanup:check` locally before pushing
- ✅ Check CI cleanup-validation job passes
- ✅ Verify no new unreferenced files in PR diff
- ✅ Ensure .gitignore covers any new generated files

## Automated Systems

### CI Pipeline Quality Gates
Our CI pipeline includes automated cleanup validation:

**Location**: `.github/workflows/ci.yml` → `cleanup-validation` job

**Checks performed**:
- TypeScript unused locals/parameters detection
- ESLint unused variables detection  
- Cleanup inventory thresholds validation
- Development artifacts prevention

**Thresholds** (prevents significant regression):
- Max unreferenced files: 120 (current: ~113)
- Max unused dependencies: 25 (current: ~18)

### Pre-commit Validation
**Script**: `scripts/pre-commit-cleanup-check.sh`
**Trigger**: `npm run cleanup:check`

**Validates**:
- No build logs or temp files in source
- No backup files in source directories  
- No unused TypeScript locals/parameters
- ESLint passes without unused variable warnings

## Manual Maintenance Tasks

### Weekly Tasks
1. **Review Cleanup Inventory**
   ```bash
   npm run cleanup:inventory
   # Review reports/cleanup-inventory-summary.md
   ```

2. **Check for New Unused Dependencies**
   ```bash
   # After adding/removing packages
   npm run cleanup:inventory
   # Review "Potentially Unused Deps" section
   ```

### Monthly Tasks  
1. **Comprehensive Cleanup Review**
   - Analyze trends in unreferenced files count
   - Review false positives in asset detection
   - Update thresholds if needed

2. **Documentation Audit**
   - Remove outdated docs in docs/ directory
   - Consolidate overlapping documentation
   - Update README files for accuracy

## Common False Positives

### Next.js Framework Files
**Never delete these** even if marked "unreferenced":
- `src/middleware.ts` - Next.js middleware (automatic)
- `src/app/layout.tsx` - App Router layout (automatic)
- `src/app/globals.css` - Global styles (Next.js convention)
- `public/robots.txt` - SEO (framework convention)

### Dynamic Imports & Lazy Loading
Components may appear unused but are loaded via:
```typescript
// Dynamic import
const HeroScene = dynamic(() => import("@/three/HeroScene"))

// Lazy loading  
const DynamicPortalScene = lazy(() => import("../three/PortalScene"))

// String-based imports (runtime)
const Component = await import(\`@/components/\${componentName}\`)
```

### Multi-Format Assets
Images with multiple formats may show false positives:
```
/assets/hero/nebula_helix.avif  ← Primary (modern browsers)
/assets/hero/nebula_helix.webp  ← Fallback (older browsers) 
/assets/hero/nebula_helix.jpg   ← Final fallback (all browsers)
```
All three are needed for responsive image optimization.

### Build Tools & Type Definitions
These don't require explicit imports:
- `@types/*` packages - TypeScript type definitions
- `@vercel/speed-insights` - Runtime injection via Next.js
- `sharp` - Next.js image optimization (automatic)
- `@lhci/cli` - CLI tool, not imported in code

## Troubleshooting

### CI Cleanup Validation Fails

**Error**: "Too many unreferenced files"
```bash
# 1. Check what changed
git diff main -- '*.ts' '*.tsx' '*.js' '*.jsx'

# 2. Generate current inventory  
npm run cleanup:inventory

# 3. Review new files in diff
# Are they legitimately needed?
```

**Error**: "Found unused TypeScript locals"
```bash
# 1. Run TypeScript check locally
npx tsc --noEmit --noUnusedLocals --noUnusedParameters

# 2. Fix unused variables or add exemption
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _unusedVar = someValue;
```

**Error**: "Development artifacts detected"
```bash
# 1. Check what artifacts exist
npm run cleanup:check

# 2. Remove artifacts or update .gitignore
rm build.log
echo "build.log" >> .gitignore
```

### Pre-commit Hook Fails

**Setup pre-commit hook** (optional):
```bash
# Add to .git/hooks/pre-commit
#!/bin/bash
cd site && npm run cleanup:check
```

**Manual validation**:
```bash
# Run before each commit
npm run cleanup:check
```

## Safe Deletion Guidelines

### Before Deleting Any File

1. **Search for references**:
   ```bash
   grep -r "filename" --include="*.ts" --include="*.tsx" .
   ```

2. **Check for dynamic imports**:
   ```bash
   grep -r "import.*filename\|require.*filename" .
   ```

3. **Test build**:
   ```bash
   # Move file temporarily
   mv file.ts file.ts.backup
   
   # Test TypeScript compilation
   npm run typecheck
   
   # Test full build
   npm run build
   
   # If successful, delete permanently
   rm file.ts.backup
   ```

4. **Check framework conventions**:
   - Next.js special files (middleware, layout, globals)
   - Public assets (robots.txt, manifest.json, etc.)
   - Configuration files (tailwind.config.ts, etc.)

### Deletion Verification Checklist
- [ ] File has no direct imports/requires
- [ ] File has no dynamic imports (search for filename strings)
- [ ] TypeScript compilation passes without file
- [ ] Build completes successfully without file  
- [ ] Tests pass without file
- [ ] Not a Next.js framework convention file
- [ ] Not a configuration file used by build tools

## Updating Thresholds

When cleanup work reduces counts significantly:

### CI Thresholds  
Edit `.github/workflows/ci.yml`:
```yaml
MAX_UNREFERENCED_FILES=120  # Reduce based on actual cleanup
MAX_UNUSED_DEPS=25          # Reduce based on dependency cleanup
```

### Inventory Configuration
Edit `scripts/cleanup-inventory.ts` to:
- Add new file patterns to ignore
- Improve false positive detection
- Add framework-specific awareness

## Best Practices

### Development Workflow
1. **Before adding dependencies**: Check if similar functionality exists
2. **Before creating files**: Ensure they have clear purpose and usage
3. **Before committing**: Run `npm run cleanup:check`
4. **Before merging**: Ensure CI cleanup validation passes

### Code Organization  
1. **Group related files**: Keep components, tests, and types together
2. **Use barrel exports**: Centralize imports via index.ts files
3. **Document dynamic imports**: Add comments explaining runtime loading
4. **Name files clearly**: Avoid ambiguous names that appear unused

### Asset Management
1. **Multi-format images**: Keep all formats (.avif, .webp, .jpg)
2. **Optimize before adding**: Use next/image optimization
3. **Document asset usage**: Comment complex asset loading patterns
4. **Regular asset audits**: Review large assets for optimization

## Integration with Development Tools

### VSCode Settings
Add to `.vscode/settings.json`:
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "off",
  "typescript.suggest.autoImports": false,
  "eslint.workingDirectories": ["site"]
}
```

### Package.json Scripts
Key scripts for cleanup maintenance:
```json
{
  "cleanup:check": "./scripts/pre-commit-cleanup-check.sh",
  "cleanup:validate": "npm run cleanup:inventory && npm run cleanup:check", 
  "cleanup:inventory": "tsx scripts/cleanup-inventory.ts"
}
```

### Git Hooks (Optional)
```bash
# .git/hooks/pre-commit
#!/bin/bash
echo "🔍 Running cleanup validation..."
cd site && npm run cleanup:check
```

## Monitoring & Metrics

### Track Cleanup Progress
- Monitor unreferenced files count over time
- Track bundle size changes
- Review dependency additions/removals
- Measure CI build performance

### Regular Reports
- Weekly cleanup inventory reports
- Monthly trend analysis  
- Quarterly comprehensive audits
- Annual cleanup strategy reviews

## Escalation Procedures

### When Thresholds Are Exceeded
1. **Immediate**: Check if it's legitimate growth or regression
2. **Short-term**: Clean up obvious issues manually
3. **Long-term**: Improve automated detection and prevention

### When CI Consistently Fails
1. **Investigate patterns**: What types of issues are recurring?
2. **Improve tooling**: Enhance scripts or add new checks
3. **Update guidelines**: Share learnings with team
4. **Adjust thresholds**: If growth is legitimate and controlled

## Future Enhancements

### Phase 2 Improvements
1. **Framework-aware analysis**: Better Next.js pattern detection
2. **Dependency usage tracking**: More accurate unused dependency detection  
3. **Asset optimization**: Automated image format conversion
4. **Performance correlation**: Link cleanup to bundle size improvements

### Advanced Tooling
1. **Custom ESLint rules**: Project-specific unused code detection
2. **Bundle analysis integration**: Correlate cleanup with performance
3. **Automated PR comments**: Report cleanup impact on PRs
4. **Dashboard integration**: Visual cleanup metrics tracking