# Cookie Consent - Visual Test Checklist

Use this checklist to manually verify cookie consent implementation in the browser.

## 🧪 Test Scenarios

### 1. First Visit (No Consent Cookie)

**Steps:**
1. Open browser in incognito/private mode
2. Clear all cookies: `document.cookie = ""`
3. Navigate to: `http://localhost:3000`

**Expected:**
- [ ] Cookie banner appears at bottom of page immediately (no flash)
- [ ] Backdrop overlay visible (dark transparent layer)
- [ ] Three buttons visible: "Aanpassen", "Alleen noodzakelijk", "Alles accepteren"
- [ ] Banner text in Dutch: "🍪 Wij respecteren jouw privacy"
- [ ] No layout shift (CLS should be 0.00)

**Check Network Tab:**
- [ ] NO request to `plausible.io`
- [ ] NO request to Vercel Analytics
- [ ] NO request to Speed Insights

**Check Browser Console:**
```javascript
// Run in console - should all be undefined
console.log(window.plausible); // undefined
console.log(window.va);        // undefined
```

---

### 2. Accept All Cookies

**Steps:**
1. With banner visible, click **"Alles accepteren"**

**Expected:**
- [ ] Banner disappears immediately
- [ ] Cookie saved: check with `document.cookie` (contains `pws_cookie_consent`)
- [ ] Analytics scripts load in Network tab
- [ ] Plausible script tag added to DOM

**Check Network Tab (after 2-3 seconds):**
- [ ] Request to `https://plausible.io/js/script.js` ✅
- [ ] Vercel Analytics loaded ✅
- [ ] Speed Insights loaded ✅

**Check Browser Console:**
```javascript
// Cookie should exist
console.log(document.cookie.includes('pws_cookie_consent')); // true

// Decode cookie
const cookie = document.cookie.split('; ').find(c => c.startsWith('pws_cookie_consent='));
if (cookie) {
  const data = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
  console.log(data);
  // Expected:
  // {
  //   version: 1,
  //   timestamp: <number>,
  //   consent: {
  //     necessary: true,
  //     analytics: true,
  //     marketing: true
  //   }
  // }
}
```

---

### 3. Reject Optional Cookies

**Steps:**
1. Clear cookies and refresh
2. Click **"Alleen noodzakelijk"**

**Expected:**
- [ ] Banner disappears
- [ ] Cookie saved with analytics/marketing = false
- [ ] NO analytics scripts load

**Check Network Tab:**
- [ ] NO request to Plausible ❌
- [ ] NO Vercel Analytics ❌
- [ ] NO Speed Insights ❌

**Check Cookie:**
```javascript
const cookie = document.cookie.split('; ').find(c => c.startsWith('pws_cookie_consent='));
const data = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
console.log(data.consent);
// Expected:
// {
//   necessary: true,
//   analytics: false,  ← rejected
//   marketing: false   ← rejected
// }
```

---

### 4. Granular Consent via Settings

**Steps:**
1. Clear cookies and refresh
2. Click **"Aanpassen"** button
3. Settings modal should open

**Expected:**
- [ ] Modal appears with dark overlay
- [ ] Title: "Cookie-instellingen"
- [ ] Three categories listed:
  - Noodzakelijke cookies (locked ON)
  - Analytische cookies (toggle)
  - Marketing cookies (toggle)
- [ ] "Necessary" toggle is disabled (cannot be turned off)
- [ ] Other toggles are interactive

**Steps (continued):**
4. Toggle **Analytische cookies** ON
5. Leave **Marketing cookies** OFF
6. Click **"Voorkeuren opslaan"**

**Expected:**
- [ ] Modal closes
- [ ] Analytics scripts load
- [ ] Marketing scripts do NOT load

**Check Cookie:**
```javascript
const cookie = document.cookie.split('; ').find(c => c.startsWith('pws_cookie_consent='));
const data = JSON.parse(decodeURIComponent(cookie.split('=')[1]));
console.log(data.consent);
// Expected:
// {
//   necessary: true,
//   analytics: true,   ← accepted
//   marketing: false   ← rejected
// }
```

---

### 5. Footer Control - Change Consent

**Steps:**
1. With consent already saved (from previous test)
2. Scroll to footer
3. Find "Wijzig cookie-instellingen" link
4. Click it

**Expected:**
- [ ] Settings modal opens (same as before)
- [ ] Current choices reflected in toggles
- [ ] Can change preferences
- [ ] Changes saved immediately

**Test Revoking Consent:**
1. Toggle **Analytische cookies** OFF
2. Save

**Expected:**
- [ ] Analytics globals cleaned up: `window.plausible` → `undefined`
- [ ] No more analytics requests

---

### 6. Returning Visitor (Consent Exists)

**Steps:**
1. With consent cookie saved (from previous tests)
2. Refresh page OR close and reopen browser
3. Navigate to site

**Expected:**
- [ ] Banner does NOT appear (consent already given)
- [ ] Scripts load immediately based on saved preferences
- [ ] Footer control still accessible

**Check Network Tab:**
- If analytics=true: Scripts load ✅
- If analytics=false: No scripts ❌

---

### 7. Keyboard Navigation

**Steps:**
1. Clear cookies and refresh
2. Use **Tab** key to navigate banner

**Expected:**
- [ ] Can tab through all three buttons
- [ ] Focus indicator visible on each button
- [ ] Focus order: Aanpassen → Alleen noodzakelijk → Alles accepteren
- [ ] Pressing **Enter** activates focused button
- [ ] Pressing **Escape** closes banner (if consent exists elsewhere)

**Settings Modal:**
1. Open settings with keyboard (Tab + Enter on "Aanpassen")
2. Tab through modal controls

**Expected:**
- [ ] Focus trap keeps focus within modal
- [ ] Can toggle switches with Space/Enter
- [ ] Tab cycles: Close button → toggles → Save button → Accept All button → back to Close
- [ ] Escape closes modal

---

### 8. Mobile Responsiveness

**Steps:**
1. Open DevTools → Device toolbar (Cmd+Shift+M / Ctrl+Shift+M)
2. Select mobile device (iPhone 12, Pixel 5, etc.)
3. Clear cookies and refresh

**Expected:**
- [ ] Banner stacks vertically on mobile
- [ ] Buttons stack vertically on mobile
- [ ] All text readable (no overflow)
- [ ] Touch targets ≥ 44px (easy to tap)
- [ ] Modal scrollable if content overflows

---

### 9. Accessibility - Screen Reader

**Steps:**
1. Enable screen reader (VoiceOver on Mac, NVDA on Windows)
2. Clear cookies and navigate to site

**Expected:**
- [ ] Banner announced as dialog
- [ ] Title and description read
- [ ] Button labels clear: "Cookie-instellingen aanpassen", etc.
- [ ] Modal structure navigable
- [ ] Toggle states announced: "on" or "off"

---

### 10. Performance - CLS

**Steps:**
1. Open DevTools → Performance tab
2. Start recording
3. Clear cookies and hard refresh (Cmd+Shift+R)
4. Stop recording after 5 seconds

**Expected:**
- [ ] CLS (Cumulative Layout Shift) ≤ 0.02
- [ ] Banner appears without shifting content
- [ ] No "jank" or visual jumps

**Lighthouse:**
1. Open DevTools → Lighthouse tab
2. Run audit (Desktop, Navigation)

**Expected:**
- [ ] Accessibility score ≥ 95
- [ ] No major CLS issues
- [ ] Interactive elements labeled

---

## 🐛 Common Issues

### Banner Flashes on Load
❌ **Problem**: Banner appears briefly then disappears  
✅ **Solution**: Verify `useCookieConsent` reads cookie synchronously (not in useEffect)

### Scripts Load Without Consent
❌ **Problem**: Plausible loads immediately  
✅ **Solution**: Check `ConsentAwareAnalytics` returns `null` when no consent

### Cookie Not Persisting
❌ **Problem**: Banner shows every visit  
✅ **Solution**: Check cookie attributes (SameSite, Path, Max-Age)

### Modal Not Opening
❌ **Problem**: Click "Aanpassen" → nothing happens  
✅ **Solution**: Verify `showSettings` state changes in hook

### CLS > 0.02
❌ **Problem**: Content jumps when banner appears  
✅ **Solution**: Add `willChange: transform` and synchronous initial state

---

## ✅ Sign-Off Checklist

- [ ] First visit: banner appears, scripts blocked
- [ ] Accept all: scripts load immediately
- [ ] Reject all: no optional scripts load
- [ ] Granular consent: only chosen scripts load
- [ ] Footer control: can change consent anytime
- [ ] Returning visitor: no banner, scripts load per saved consent
- [ ] Keyboard navigation: fully accessible
- [ ] Mobile: responsive, touch-friendly
- [ ] Screen reader: properly announced
- [ ] Performance: CLS ≤ 0.02, Lighthouse ≥ 95

---

**Tested By**: _______________  
**Date**: _______________  
**Browser**: _______________  
**Status**: ✅ PASS / ❌ FAIL

---

## Developer Notes

**Cookie Name**: `pws_cookie_consent`  
**Expiry**: 180 days (15552000 seconds)  
**Path**: `/`  
**SameSite**: `Lax`  
**Secure**: Yes (on HTTPS)

**Test Command**:
```bash
npm test -- cookies/__tests__ --run
```

**Clear Cookie (Console)**:
```javascript
document.cookie = 'pws_cookie_consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
```

**Check Consent (Console)**:
```javascript
document.cookie.split('; ').find(c => c.startsWith('pws_cookie_consent='))
```
