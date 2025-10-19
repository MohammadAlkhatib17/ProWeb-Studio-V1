# Bundle Analyzer Quick Reference

## Overview

Automated bundle size analysis and enforcement in CI/CD pipeline. Analyzes per-route JS/CSS sizes, enforces budgets, and provides PR feedback.

## Features

- ✅ Per-route bundle size tracking
- ✅ Budget enforcement from `budgets.json`
- ✅ Automated PR comments with delta comparison
- ✅ Downloadable artifacts for deep analysis
- ✅ CI failure on budget violations
- ✅ Override mechanism with labels

## Usage

### Local Analysis

```bash
# Build with bundle analyzer
npm run build:analyze

# Generate bundle report
npm run analyze:report

# View report
cat ../reports/bundles/bundle-report.md
```

### CI/CD Integration

The bundle analyzer runs automatically on:
- ✅ All pull requests (comparison vs main)
- ✅ Main branch builds (baseline tracking)

## PR Workflow

### Automatic Analysis

When you open a PR:
1. CI builds both your branch and main
2. Generates bundle reports for each
3. Compares sizes per-route
4. Posts comment with detailed breakdown
5. Uploads artifacts for download

### Understanding the PR Comment

```markdown
## 📦 Bundle Size Report

### Per-Route Comparison
| Route | Current | Baseline | Delta | Change % | Status |
|-------|---------|----------|-------|----------|--------|
| /     | 450 KB  | 430 KB   | +20 KB| +4.7%   | ⚠️     |
```

**Status Icons:**
- ❌ Regression (exceeds threshold)
- ✅ Improvement (size reduced)
- ⚠️ Significant change (within threshold)
- ➖ No significant change
- 🆕 New route
- 🗑️ Removed route

### Budget Violations

If any route exceeds its budget in `budgets.json`, the CI check will fail:

```markdown
### ⚠️ Budget Violations
- **/diensten** (script): 950 KB exceeds 900 KB budget by 50 KB
```

### Override Mechanism

If you need to override the check:

1. Add the `bundle-size-override` label to your PR
2. Document justification in a comment
3. CI will pass but show the override status

**Valid Override Reasons:**
- New feature requiring additional dependencies
- Critical security/performance library updates
- Temporary increase with optimization plan in place
- Business-critical functionality with approved trade-offs

## Configuration

### Budget Thresholds

Edit `site/budgets.json`:

```json
{
  "path": "/",
  "resourceSizes": [
    { "resourceType": "total", "budget": 1500 },
    { "resourceType": "script", "budget": 900 },
    { "resourceType": "image", "budget": 500 }
  ]
}
```

**Resource Types:**
- `script` - JavaScript bundle size (KB)
- `total` - Total page weight including CSS, JS, etc. (KB)
- `image` - Images loaded on route (KB)

### Regression Threshold

Set in `.github/workflows/ci.yml`:

```yaml
env:
  BUNDLE_SIZE_THRESHOLD: 5 # Percentage threshold (default: 5%)
```

Or override per-run:
```bash
BUNDLE_SIZE_THRESHOLD=10 npm run bundle:compare-pr
```

## Scripts Reference

### Package.json Scripts

```json
{
  "analyze": "ANALYZE=true next build",
  "build:analyze": "ANALYZE=true next build",
  "analyze:generate": "node scripts/analyze-bundle-data.js",
  "analyze:report": "node analyze-bundle.js",
  "bundle:compare": "node scripts/bundle-compare.js",
  "bundle:compare-pr": "node scripts/bundle-compare-pr.js"
}
```

### Script Purposes

| Script | Purpose | Output |
|--------|---------|--------|
| `analyze` | Build with bundle analyzer enabled | HTML report |
| `analyze:report` | Generate per-route report | JSON + MD |
| `bundle:compare-pr` | Compare and generate PR comment | MD comment |

## Artifacts

### Downloadable from PR Checks

1. Navigate to PR → Checks → bundle-size-check
2. Scroll to Artifacts section
3. Download `bundle-analysis-reports`

**Contents:**
- `bundle-report-current.json` - Your branch analysis
- `bundle-report-base.json` - Main branch baseline
- `bundle-report-current.md` - Formatted current report
- `bundle-report-base.md` - Formatted baseline report
- `pr-comment.md` - Generated PR comment

### Report Schema

```json
{
  "timestamp": "2025-10-19T...",
  "routeSizes": [
    {
      "route": "/",
      "jsSize": 450000,
      "cssSize": 50000,
      "totalSize": 500000,
      "files": {
        "js": ["static/chunks/pages/index-xxx.js"],
        "css": ["static/css/xxx.css"]
      }
    }
  ],
  "violations": [],
  "warnings": [],
  "totalSize": 5000000
}
```

## Troubleshooting

### CI Failing with "Bundle size regression"

**Check:**
1. Review PR comment for affected routes
2. Download artifacts for detailed analysis
3. Compare specific chunks that increased
4. Identify the source (new dependency, code change)

**Solutions:**
- Remove unused imports
- Use dynamic imports for large components
- Split large routes into smaller chunks
- Update budgets if increase is justified

### No PR Comment Posted

**Possible causes:**
1. PR from fork (limited permissions)
2. GitHub token permissions issue
3. Report generation failed

**Debug:**
1. Check workflow logs for errors
2. Download artifacts to see if reports generated
3. Verify `pull-requests: write` permission in workflow

### Budget Too Strict

**Adjust budgets:**
1. Edit `site/budgets.json`
2. Increase budget for specific route
3. Document reason in commit message
4. Consider if optimization is better option

### False Positives

**Common causes:**
- Build cache differences
- Non-deterministic chunk hashing
- Dependency version changes

**Solutions:**
- Clear `.next` directory before build
- Lock dependency versions
- Check for build-time environment differences

## Performance Impact

### CI Time Budget

**Target:** < 3 minutes additional time

**Actual Breakdown:**
- Base build: ~60s
- Current build: ~60s
- Report generation: ~5s
- Comparison: ~2s
- **Total: ~2min 7s** ✅

### Optimization Tips

- Parallel builds (if resources allow)
- Cache node_modules between steps
- Skip analysis on draft PRs (optional)

## Best Practices

### For Developers

1. **Run locally before pushing**
   ```bash
   npm run build:analyze
   npm run analyze:report
   ```

2. **Check bundle before adding dependencies**
   ```bash
   npm install <package>
   npm run build:analyze
   # Compare before/after
   ```

3. **Use dynamic imports for large features**
   ```typescript
   const HeavyComponent = dynamic(() => import('./HeavyComponent'))
   ```

4. **Monitor PR comments consistently**
   - Review bundle changes in every PR
   - Flag unexpected increases
   - Document intentional increases

### For Reviewers

1. Check bundle report in PR comments
2. Question significant increases without explanation
3. Verify override labels have documented justification
4. Suggest optimizations when appropriate

## Integration with Other Tools

### Lighthouse CI

Bundle analysis complements LHCI metrics:
- Bundle size → JavaScript execution time
- Route budgets → Performance scores
- Track both for complete picture

### Next.js Bundle Analyzer

HTML visualizations available after build:
```bash
npm run build:analyze
# Opens browser with interactive treemap
```

## References

- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Web Performance Budgets](https://web.dev/performance-budgets-101/)
- [budgets.json Schema](./budgets.json)
- [CI Workflow](./.github/workflows/ci.yml)

## Support

Issues or questions:
1. Check workflow logs first
2. Review this document
3. Check artifacts for detailed data
4. Open issue with workflow URL and context
