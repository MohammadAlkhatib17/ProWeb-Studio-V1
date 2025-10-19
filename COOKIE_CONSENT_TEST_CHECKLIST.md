# 🍪 Cookie Consent - Manual Testing Checklist

Use this checklist to verify the cookie consent implementation in your browser.

## Pre-Test Setup

```bash
# Start development server
cd site
npm run dev

# Open in browser
http://localhost:3000
```

## ✅ Test 1: First Visit Experience

**Steps:**
1. Open browser DevTools (F12)
2. Go to Application → Cookies → http://localhost:3000
3. Delete `pws_cookie_consent` cookie (if exists)
4. Reload page (F5)

**Expected:**
- [ ] Banner appears at bottom of page
- [ ] Banner has dark backdrop overlay
- [ ] Banner slides up with smooth animation
- [ ] Text is clearly readable
- [ ] Three buttons visible: "Aanpassen", "Alleen noodzakelijk", "Alles accepteren"

**Network Tab Check:**
- [ ] NO request to `plausible.io` (analytics blocked)

---

## ✅ Test 2: Accept All Cookies

**Steps:**
1. Ensure banner is visible (if not, clear cookies and reload)
2. Click "Alles accepteren"

**Expected:**
- [ ] Banner disappears immediately
- [ ] No layout shift (CLS = 0)
- [ ] Check Application → Cookies:
  - [ ] `pws_cookie_consent` cookie exists
  - [ ] Cookie value contains `"analytics":true,"marketing":true`
  - [ ] Cookie expires in ~180 days

**Network Tab Check:**
- [ ] Request to `plausible.io/js/script.js` appears
- [ ] Script loads successfully (Status 200)

**Reload Test:**
- [ ] Reload page (F5)
- [ ] Banner does NOT reappear
- [ ] Plausible loads automatically

---

## ✅ Test 3: Only Necessary Cookies

**Steps:**
1. Clear `pws_cookie_consent` cookie
2. Reload page
3. Click "Alleen noodzakelijk"

**Expected:**
- [ ] Banner disappears
- [ ] Cookie created with `"analytics":false,"marketing":false`
- [ ] NO request to `plausible.io`
- [ ] Reload → banner stays hidden, no analytics

---

## ✅ Test 4: Granular Settings

**Steps:**
1. Clear cookies and reload
2. Click "Aanpassen" button

**Expected:**
- [ ] Settings modal opens in center
- [ ] Dark backdrop behind modal
- [ ] Modal has scroll if content overflows
- [ ] Three categories shown:
  - [ ] Noodzakelijke cookies (toggle disabled, always ON)
  - [ ] Analytische cookies (toggle enabled)
  - [ ] Marketing cookies (toggle enabled)

**Toggle Test:**
1. Toggle "Analytische cookies" ON
2. Toggle "Marketing cookies" OFF
3. Click "Voorkeuren opslaan"

**Expected:**
- [ ] Modal closes
- [ ] Cookie saved with analytics=true, marketing=false
- [ ] Plausible script loads (check Network tab)
- [ ] Reload → settings persisted

---

## ✅ Test 5: Footer Settings Control

**Steps:**
1. Ensure you have consent saved (any choice)
2. Scroll to bottom footer
3. Look for "Wijzig cookie-instellingen" link

**Expected:**
- [ ] Link visible in footer copyright section
- [ ] Link has dotted underline
- [ ] Hover → text turns cyan
- [ ] Click → settings modal opens
- [ ] Current settings reflected in toggles
- [ ] Can change and save new preferences

---

## ✅ Test 6: Keyboard Navigation

**Steps:**
1. Clear cookies, reload to show banner
2. Press `Tab` key repeatedly

**Expected:**
- [ ] Focus moves to "Aanpassen" button first
- [ ] Blue/cyan focus ring visible
- [ ] Focus ring has good contrast (≥ 3:1)
- [ ] Tab cycles through all 3 buttons
- [ ] Enter key activates focused button

**Modal Keyboard Test:**
1. Click "Aanpassen" to open modal
2. Press `Tab` repeatedly

**Expected:**
- [ ] Focus trapped in modal (cannot escape)
- [ ] Tab cycles: Close button → toggles → "Voorkeuren opslaan" → "Alles accepteren" → back to Close
- [ ] Press `Escape` key → modal closes

---

## ✅ Test 7: Accessibility Audit

**Steps:**
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select "Accessibility" only
4. Run audit

**Expected:**
- [ ] Accessibility score ≥ 95
- [ ] No errors related to:
  - [ ] ARIA attributes
  - [ ] Keyboard navigation
  - [ ] Color contrast
  - [ ] Touch target size (≥ 44px)

---

## ✅ Test 8: Performance (CLS Check)

**Steps:**
1. Clear cookies, reload
2. Open DevTools → Performance tab
3. Start recording
4. Wait for banner to appear
5. Stop recording

**Expected:**
- [ ] Layout Shift score = 0.00 or very close
- [ ] No visible "jump" when banner appears
- [ ] Banner animates smoothly from bottom

---

## ✅ Test 9: Mobile Responsive

**Steps:**
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone 12 Pro (or similar)
4. Clear cookies, reload

**Expected:**
- [ ] Banner fits screen width
- [ ] Buttons stack vertically on mobile
- [ ] Text is readable (not too small)
- [ ] Touch targets ≥ 44px (use ruler tool)
- [ ] Modal scrolls properly on small screens
- [ ] No horizontal overflow

---

## ✅ Test 10: Consent Change Event

**Steps:**
1. Open browser console
2. Run this code:
   ```javascript
   window.addEventListener('cookieConsentChange', (e) => {
     console.log('Consent changed:', e.detail);
   });
   ```
3. Open settings, change a toggle, save

**Expected:**
- [ ] Console logs event with consent object
- [ ] Event fires immediately on save
- [ ] Contains updated consent state

---

## ✅ Test 11: Consent Revocation

**Steps:**
1. Accept all cookies (analytics loads)
2. Open footer → "Wijzig cookie-instellingen"
3. Turn OFF "Analytische cookies"
4. Save preferences

**Expected:**
- [ ] Settings modal closes
- [ ] Cookie updated to analytics=false
- [ ] Reload page
- [ ] Plausible does NOT load on subsequent page load

---

## ✅ Test 12: Cross-Browser

Test in multiple browsers:

**Chrome:**
- [ ] All tests pass

**Firefox:**
- [ ] All tests pass

**Safari:**
- [ ] All tests pass

**Edge:**
- [ ] All tests pass

---

## 🐛 Common Issues & Fixes

### Issue: Banner doesn't appear
**Fix:** Clear all cookies, hard reload (Ctrl+Shift+R)

### Issue: Analytics still loads without consent
**Fix:** Check that old `<Script>` tag removed from layout.tsx, only `<ConsentAwareAnalytics>` should exist

### Issue: Settings don't persist
**Fix:** Check cookie is being set (Application → Cookies), ensure no browser privacy settings blocking cookies

### Issue: Focus ring not visible
**Fix:** Check globals.css has focus styles, ensure no CSS overriding outline

### Issue: CLS > 0.02
**Fix:** Verify `willChange: transform` on banner, check no competing animations

---

## 📊 Test Results Summary

Date: _______________  
Tester: _______________

| Test | Pass | Fail | Notes |
|------|------|------|-------|
| 1. First Visit | ☐ | ☐ | |
| 2. Accept All | ☐ | ☐ | |
| 3. Only Necessary | ☐ | ☐ | |
| 4. Granular Settings | ☐ | ☐ | |
| 5. Footer Control | ☐ | ☐ | |
| 6. Keyboard Nav | ☐ | ☐ | |
| 7. Accessibility | ☐ | ☐ | Score: ___ |
| 8. Performance CLS | ☐ | ☐ | CLS: ___ |
| 9. Mobile Responsive | ☐ | ☐ | |
| 10. Consent Event | ☐ | ☐ | |
| 11. Revocation | ☐ | ☐ | |
| 12. Cross-Browser | ☐ | ☐ | |

**Overall Status:** ☐ PASS | ☐ FAIL

---

**Next Steps After Testing:**
1. If all pass → Deploy to staging
2. If any fail → Review implementation, fix issues
3. Document any edge cases found
4. Consider A/B testing banner copy for higher consent rates
