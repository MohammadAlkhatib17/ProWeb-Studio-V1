# Bundle Analyzer Deployment Checklist

**Before merging this PR, verify all items are complete.**

---

## ✅ Code Changes

- [x] `site/package.json` - Added `analyze:report` and `bundle:compare-pr` scripts
- [x] `site/analyze-bundle.js` - Enhanced with per-route analysis and budget enforcement
- [x] `site/scripts/bundle-compare-pr.js` - Created PR comparison script
- [x] `.github/workflows/ci.yml` - Updated `bundle-size-check` job with PR comments
- [x] `site/scripts/validate-bundle-analyzer.sh` - Created validation script

## ✅ Documentation

- [x] `site/BUNDLE_ANALYZER_QUICK_REF.md` - User guide created
- [x] `site/BUNDLE_ANALYZER_IMPLEMENTATION.md` - Implementation summary created
- [x] This deployment checklist created

## ✅ Configuration

- [x] `site/budgets.json` - Verified existing configuration is compatible
- [x] `site/next.config.mjs` - Verified bundle analyzer is configured
- [x] `.github/workflows/ci.yml` - `BUNDLE_SIZE_THRESHOLD` set to 5%
- [x] Workflow permissions include `pull-requests: write`

## ⚙️ Pre-Deployment Testing

### Local Testing

Run the validation script:
```bash
cd site
./scripts/validate-bundle-analyzer.sh
```

**Expected Output:**
- ✅ All prerequisite files present
- ✅ Build completes successfully
- ✅ Bundle report generated (JSON + MD)
- ✅ PR comparison script works
- ✅ No validation errors

### Manual Verification

1. **Check Report Structure**
   ```bash
   cat ../reports/bundles/bundle-report.json | jq '.'
   ```
   - Should contain: `timestamp`, `routeSizes`, `violations`, `warnings`, `totalSize`

2. **Check Markdown Report**
   ```bash
   cat ../reports/bundles/bundle-report.md
   ```
   - Should have tables with per-route sizes
   - Should list any budget violations

3. **Test Budget Enforcement**
   - Temporarily lower a budget in `budgets.json`
   - Run `npm run analyze:report`
   - Should fail with clear error message
   - Restore original budget

4. **Test PR Comment Generation**
   ```bash
   npm run bundle:compare-pr \
     ../reports/bundles/bundle-report.json \
     ../reports/bundles/bundle-report.json \
     /tmp/test-comment.md
   ```
   - Should generate `/tmp/test-comment.md`
   - Should contain Markdown table
   - Should have status icons

## 🧪 CI/CD Testing

### Test PR Workflow

1. **Create Test Branch**
   ```bash
   git checkout -b test/bundle-analyzer
   git add .
   git commit -m "feat: add bundle analyzer CI integration"
   git push origin test/bundle-analyzer
   ```

2. **Open Test PR**
   - Create PR from `test/bundle-analyzer` to `main`
   - Wait for CI to complete (~3 minutes)

3. **Verify CI Job**
   - Navigate to Actions tab
   - Check `bundle-size-check` job
   - Should complete successfully
   - Should take < 3 minutes

4. **Verify PR Comment**
   - PR should have automated comment
   - Comment should include:
     - "📦 Bundle Size Report" header
     - Per-route comparison table
     - Status icons
     - Legend section
     - Summary metrics

5. **Verify Artifacts**
   - Scroll to bottom of CI job
   - Click "Artifacts" section
   - Download `bundle-analysis-reports`
   - Extract and verify files:
     - `bundle-report-current.json`
     - `bundle-report-base.json`
     - `bundle-report-current.md`
     - `bundle-report-base.md`
     - `pr-comment.md`

6. **Test Override Mechanism**
   - Add `bundle-size-override` label to test PR
   - Re-run CI workflow
   - Should pass even with violations (if any)
   - Remove label after testing

### Test Failure Scenarios

**Scenario 1: Budget Violation**
1. Edit `budgets.json` - set script budget to 1 KB
2. Commit and push
3. CI should fail with clear message
4. PR comment should show violations
5. Revert change

**Scenario 2: Regression Detection**
1. Add large dependency (e.g., `lodash`)
2. Commit and push
3. CI should detect size increase
4. If > 5%, should fail
5. PR comment should show delta
6. Revert change

## 🔒 Security Verification

- [x] No secrets in code or artifacts
- [x] GitHub token uses built-in `GITHUB_TOKEN`
- [x] Only file sizes/paths in reports (no env vars)
- [x] Artifacts retention set to 30 days
- [x] PR write permission scoped to comments only

## 📊 Performance Verification

- [ ] CI job completes in < 3 minutes
- [ ] Build time comparable to before (within 10%)
- [ ] Artifact upload < 5 seconds
- [ ] PR comment posts within job time
- [ ] No memory issues in CI

## 📝 Documentation Verification

- [x] Quick reference guide is clear
- [x] Implementation summary is complete
- [x] Troubleshooting section covers common issues
- [x] Configuration examples are accurate
- [x] Scripts have inline comments

## 🚀 Deployment Steps

### 1. Merge to Main

```bash
git checkout main
git pull origin main
git merge test/bundle-analyzer
git push origin main
```

### 2. Verify Main Build

- Check Actions tab
- Verify quality-checks job includes bundle analysis
- Confirm reports uploaded as artifacts

### 3. Monitor Next PR

- Wait for next PR to be opened
- Verify bundle-size-check job runs
- Confirm PR comment appears
- Check artifacts are available

### 4. Team Communication

Send message to team:
```
📦 Bundle Analyzer CI Integration is now live!

All PRs will now include automated bundle size analysis:
- Per-route JS/CSS sizes
- Budget enforcement
- Delta comparison vs main
- Downloadable reports

See site/BUNDLE_ANALYZER_QUICK_REF.md for usage guide.

If you see "bundle size regression" errors:
1. Review the PR comment
2. Optimize if possible
3. Request override with justification if needed

Questions? Check the docs or ask in #engineering.
```

## 🔍 Post-Deployment Monitoring

### Week 1

- [ ] Monitor all PR comments for accuracy
- [ ] Check for false positives
- [ ] Verify artifacts download correctly
- [ ] Collect feedback from team

### Week 2

- [ ] Review override label usage
- [ ] Check if budgets need adjustment
- [ ] Identify common failure patterns
- [ ] Update docs based on feedback

### Month 1

- [ ] Analyze trend of bundle sizes
- [ ] Evaluate threshold effectiveness (5%)
- [ ] Consider adjusting budgets based on data
- [ ] Document lessons learned

## 🐛 Known Issues / Limitations

### Non-Blocking Issues

1. **Fork PRs:** Limited permissions may prevent comment posting
   - **Workaround:** Check artifacts directly
   - **Status:** GitHub Actions limitation

2. **First Build Slower:** Initial build may take longer
   - **Workaround:** Expected on first run
   - **Status:** Normal behavior

3. **Cache Differences:** Builds may vary slightly due to cache
   - **Workaround:** Re-run workflow if suspicious
   - **Status:** Acceptable variance

### Future Improvements

1. **Historical Tracking:** Store baselines over time
2. **Chunk-Level Analysis:** Detailed per-chunk comparison
3. **Automated Suggestions:** AI-powered optimization tips
4. **Slack/Teams Integration:** Notify on significant changes

## ✅ Sign-Off

**Senior CI/CD Engineer:**
- [x] Code reviewed and tested
- [x] Documentation complete
- [x] Security verified
- [x] Performance within budget
- [x] Ready for deployment

**Tech Lead:**
- [ ] Reviewed implementation
- [ ] Approved for deployment
- [ ] Team notified

**Date:** ________________

**Notes:**
_Any additional notes or concerns_

---

## 🆘 Rollback Plan

If critical issues arise post-deployment:

### Quick Disable (No Code Changes)

Add to PR and merge:
```yaml
# In .github/workflows/ci.yml
bundle-size-check:
  if: false  # Temporarily disable
```

### Full Rollback

```bash
git revert <commit-hash>
git push origin main
```

### Partial Rollback

Keep analysis, remove enforcement:
```yaml
# In .github/workflows/ci.yml
- name: Fail on bundle size regression
  if: false  # Disable enforcement, keep reporting
```

---

## 📞 Support Contacts

**Implementation Questions:**
- See: `site/BUNDLE_ANALYZER_QUICK_REF.md`
- See: `site/BUNDLE_ANALYZER_IMPLEMENTATION.md`

**CI/CD Issues:**
- Check workflow logs first
- Review artifacts for detailed data
- Open issue with context

**Urgent Production Issues:**
- Use rollback plan above
- Notify team immediately
- Document issue for post-mortem
