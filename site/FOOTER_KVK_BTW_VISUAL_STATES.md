# Footer KVK/BTW: Visual States Comparison

## State 1: Both Values Present (Production)
```env
NEXT_PUBLIC_KVK=93769865
NEXT_PUBLIC_BTW=NL005041113B60
```

### Rendered Output:
```html
<div class="mt-4 text-xs text-slate-500" data-testid="company-registration-info">
  <p class="flex flex-wrap gap-x-3 gap-y-1">
    <span data-testid="kvk-info">
      <strong>KVK:</strong> 93769865
    </span>
    <span aria-hidden="true">•</span>
    <span data-testid="btw-info">
      <strong>BTW/VAT:</strong> NL005041113B60
    </span>
  </p>
</div>
```

**Visual**: `KVK: 93769865 • BTW/VAT: NL005041113B60`

---

## State 2: Only KVK Present
```env
NEXT_PUBLIC_KVK=93769865
NEXT_PUBLIC_BTW=
```

### Rendered Output:
```html
<div class="mt-4 text-xs text-slate-500" data-testid="company-registration-info">
  <p class="flex flex-wrap gap-x-3 gap-y-1">
    <span data-testid="kvk-info">
      <strong>KVK:</strong> 93769865
    </span>
  </p>
</div>
```

**Visual**: `KVK: 93769865`

---

## State 3: Only BTW Present
```env
NEXT_PUBLIC_KVK=
NEXT_PUBLIC_BTW=NL005041113B60
```

### Rendered Output:
```html
<div class="mt-4 text-xs text-slate-500" data-testid="company-registration-info">
  <p class="flex flex-wrap gap-x-3 gap-y-1">
    <span data-testid="btw-info">
      <strong>BTW/VAT:</strong> NL005041113B60
    </span>
  </p>
</div>
```

**Visual**: `BTW/VAT: NL005041113B60`

---

## State 4: No Values (Development/Staging)
```env
NEXT_PUBLIC_KVK=
NEXT_PUBLIC_BTW=
```

### Rendered Output:
```html
<!-- Nothing rendered - section completely hidden -->
```

**Visual**: *(no registration info displayed)*

---

## E2E Test Scenarios

### Scenario 1: Verify Production Display
```typescript
// When both env vars are present
test('should display KVK and BTW in production', async ({ page }) => {
  await page.goto('/');
  
  // Section should be visible
  await expect(page.getByTestId('company-registration-info')).toBeVisible();
  
  // Both values should be present
  await expect(page.getByTestId('kvk-info')).toContainText('KVK: 93769865');
  await expect(page.getByTestId('btw-info')).toContainText('BTW/VAT: NL005041113B60');
});
```

### Scenario 2: Verify Development Hiding
```typescript
// When no env vars are set
test('should hide registration section in development', async ({ page }) => {
  await page.goto('/');
  
  // Section should not exist
  await expect(page.getByTestId('company-registration-info')).not.toBeVisible();
});
```

### Scenario 3: Verify Partial Display
```typescript
// When only KVK is present
test('should display only KVK when BTW is missing', async ({ page }) => {
  await page.goto('/');
  
  await expect(page.getByTestId('company-registration-info')).toBeVisible();
  await expect(page.getByTestId('kvk-info')).toBeVisible();
  await expect(page.getByTestId('btw-info')).not.toBeVisible();
});
```

## Accessibility Validation

All states maintain WCAG 2.1 AA compliance:

- ✅ Semantic HTML structure
- ✅ Proper text contrast ratios (text-slate-500 on dark background)
- ✅ No reliance on visual separators for meaning
- ✅ Screen reader friendly (separator has aria-hidden)
- ✅ No layout shifts between states
- ✅ Text remains readable at all viewport sizes

## Key Implementation Details

1. **Conditional Wrapper**: Entire section hidden if no values present
2. **Individual Field Logic**: Each field shows independently
3. **Smart Separator**: Bullet only renders when both fields exist
4. **Test IDs**: Available at container and field level
5. **No Placeholder Text**: Previous `[Te bepalen]` removed
6. **Graceful Degradation**: No empty space left when hidden
