# E2E Testing Deployment Checklist

**Status:** Ready for Merge  
**Date:** October 19, 2025  
**Impact:** CI pipeline only (no runtime changes)

---

## ✅ Pre-Merge Validation

### Code Review
- [x] No runtime code modified (CI/test infrastructure only)
- [x] CI workflow syntax valid (YAML)
- [x] Test suite follows best practices
- [x] Documentation complete
- [x] Scripts executable (`chmod +x`)

### File Integrity
- [x] `site/package.json` - Added @playwright/test + scripts
- [x] `site/playwright.config.ts` - Created with CI-optimized settings
- [x] `site/tests/e2e/banner-canvas.spec.ts` - 7 test scenarios
- [x] `site/tests/e2e/README.md` - Full documentation
- [x] `site/scripts/verify-e2e-setup.sh` - Setup verification
- [x] `site/.gitignore` - Playwright artifacts excluded
- [x] `.github/workflows/ci.yml` - e2e-tests job added
- [x] Root docs created (3 files)

### Configuration
- [x] Playwright uses headless Chromium
- [x] Base URL set to localhost:3000
- [x] Timeout: 30s per test, 10s per assertion
- [x] Retry policy: 1 on CI, 0 locally
- [x] Web server auto-starts on demand
- [x] CI environment variables loaded

### Test Coverage
- [x] Banner visibility timing (<500ms)
- [x] Canvas presence before consent
- [x] Canvas persistence after rejection
- [x] Console error detection
- [x] Banner interactivity
- [x] Canvas dimension validation
- [x] Simultaneous rendering

---

## 🚀 Merge Requirements

### Prerequisites
- [ ] PR reviewed by at least 1 team member
- [ ] All existing CI jobs pass
- [ ] No merge conflicts with main branch

### Post-Merge Expectations
- [ ] First CI run may take longer (installing Playwright)
- [ ] Subsequent runs cached (~2.5 min total)
- [ ] E2E job appears in CI pipeline
- [ ] Tests run on every PR

---

## 📋 First Run Checklist

### Immediately After Merge
1. [ ] Monitor first CI run in Actions tab
2. [ ] Verify e2e-tests job appears
3. [ ] Check total CI time <3 minutes
4. [ ] Review test results in CI logs

### If First Run Fails
- [ ] Check CI logs for error details
- [ ] Verify .env.ci exists and is valid
- [ ] Confirm Playwright installed correctly
- [ ] Test locally with `npm run test:e2e:ci`

### Expected First Run Output
```
✓ Cookie banner visible within 500ms on fresh profile
✓ 3D canvas present before consent given
✓ Canvas remains visible after rejecting consent
✓ No console errors related to hydration or cookies
✓ Performance: banner interactive within 500ms
✓ 3D canvas has valid dimensions
✓ Both banner and canvas render simultaneously

7 passed (Xs)
```

---

## 🔧 Team Onboarding

### Developer Setup (Local Testing)
```bash
# 1. Pull latest main
git pull origin main

# 2. Navigate to site directory
cd site

# 3. Install dependencies
npm install

# 4. Install Playwright browser
npx playwright install chromium

# 5. Verify setup
./scripts/verify-e2e-setup.sh

# 6. Run tests
npm run test:e2e
```

### Understanding Test Failures
**Banner timing >500ms:**
- Check `COOKIE_BANNER_HYDRATION_QUICK_REF.md`
- Review component order in `layout.tsx`
- Profile with Chrome DevTools Performance tab

**Canvas not rendering:**
- Check `3D_CONSENT_INDEPENDENCE_QUICK_REF.md`
- Verify no consent gates in `Dynamic3DWrapper.tsx`
- Ensure WebGL not disabled

**Console errors:**
- Check for SSR/client mismatches
- Review React Suspense boundaries
- Validate cookie state management

---

## 📊 Monitoring Plan

### Week 1 (Days 1-7)
- [ ] Monitor CI duration daily
- [ ] Track test flakiness rate
- [ ] Note any timeouts or failures
- [ ] Gather team feedback

### Week 2 (Days 8-14)
- [ ] Analyze failure patterns
- [ ] Adjust timeouts if needed
- [ ] Update test selectors if components changed
- [ ] Document common issues

### Month 1 (Days 15-30)
- [ ] Optimize CI cache strategy
- [ ] Consider parallel test execution
- [ ] Add mobile viewport tests (optional)
- [ ] Review performance metrics

---

## 🎯 Success Metrics

### CI Health
- **Target:** 0% flaky tests
- **Monitor:** GitHub Actions logs
- **Action:** Investigate any retries

### Performance
- **Target:** <2.5 min average CI time
- **Monitor:** CI duration per run
- **Action:** Optimize if >3 min consistently

### Coverage
- **Target:** 100% test pass rate
- **Monitor:** PR merge rate
- **Action:** Block PRs on failure

### Developer Experience
- **Target:** <5 min local test run
- **Monitor:** Team feedback
- **Action:** Improve docs/scripts

---

## 🚨 Rollback Plan

### If E2E Tests Cause Issues

**Option 1: Disable Job (Temporary)**
```yaml
# In .github/workflows/ci.yml
e2e-tests:
  if: false  # Disable temporarily
  runs-on: ubuntu-latest
  ...
```

**Option 2: Revert Commit**
```bash
git revert HEAD~1  # Assuming E2E was last commit
git push origin main
```

**Option 3: Skip on Specific PRs**
```yaml
# Add to PR description
[skip e2e]
```

### Rollback Checklist
- [ ] Notify team in #ci-cd channel
- [ ] Document reason for rollback
- [ ] Create issue to track resolution
- [ ] Plan re-deployment timeline

---

## 🎓 Knowledge Transfer

### Documentation Locations
1. **E2E_TESTING_IMPLEMENTATION.md** - Complete implementation details
2. **E2E_TESTING_QUICK_REF.md** - Quick reference for developers
3. **site/tests/e2e/README.md** - Test suite documentation
4. **This file** - Deployment checklist

### Training Materials
- [ ] Share quick ref in #performance-optimization
- [ ] Add to onboarding docs
- [ ] Demo in next team meeting
- [ ] Update CI/CD wiki

### Support Channels
- **CI Issues:** #ci-cd
- **Test Failures:** #performance-optimization
- **Playwright Help:** #testing

---

## 📈 Future Enhancements

### Short Term (1-3 months)
- [ ] Add `data-testid` to cookie banner components
- [ ] Test accept/reject button variants
- [ ] Validate cookie settings modal

### Medium Term (3-6 months)
- [ ] Add mobile viewport tests (375x667)
- [ ] Test different network conditions (3G, 4G)
- [ ] Accessibility assertions (WCAG AA)

### Long Term (6-12 months)
- [ ] Visual regression testing
- [ ] Performance profiling integration
- [ ] Cross-browser testing (Firefox, Safari)
- [ ] Bundle size impact analysis

---

## ✅ Final Checklist

### Before Merge
- [x] All files created and verified
- [x] Verification script passes
- [x] Documentation complete
- [x] No runtime code changed
- [x] CI workflow valid
- [x] Team notified

### After Merge
- [ ] First CI run successful
- [ ] Tests pass on clean main branch
- [ ] Team can run tests locally
- [ ] Monitoring plan in place
- [ ] Support channels ready

### Communication
- [ ] Announce in #ci-cd channel
- [ ] Update sprint board
- [ ] Add to release notes
- [ ] Share quick ref guide

---

## 📞 Contacts

**Implementation:** DevOps/CI Team  
**Support:** #ci-cd, #performance-optimization  
**Documentation:** See links above  
**Issues:** GitHub Issues with `ci` label

---

**Ready to Merge:** ✅  
**Confidence Level:** High  
**Risk Level:** Low (test infrastructure only)  
**Rollback Plan:** Documented above

---

**Last Updated:** October 19, 2025  
**Next Review:** 1 week after merge
