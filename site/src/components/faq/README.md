# FAQ Components

Accessible, mobile-optimized FAQ accordion components with full keyboard navigation and zero Cumulative Layout Shift (CLS).

## Features

✅ **Mobile-First Design**: Full-width rectangular rows on mobile (no card boxes)  
✅ **Single-Open Mode**: Only one item expanded at a time (configurable)  
✅ **Full Accessibility**: WCAG 2.1 AA compliant with complete ARIA support  
✅ **Keyboard Navigation**: Tab, Enter/Space, Arrow keys, Home/End  
✅ **Zero CLS**: Measured height transitions prevent layout shifts  
✅ **Dutch Language**: Dutch ARIA labels and content  
✅ **URL Hash Sync**: Deep linking support (`#faq=item-id`)  
✅ **Motion-Safe**: Respects `prefers-reduced-motion`  
✅ **48px Tap Targets**: Mobile-friendly touch targets  
✅ **SEO Optimized**: Structured data ready  

## Installation

```tsx
import { Accordion, AccordionItem } from '@/components/faq';
```

## Basic Usage

```tsx
export default function MyFAQ() {
  return (
    <Accordion type="single" defaultOpenId="item-1">
      <AccordionItem
        id="item-1"
        question="Hoe werkt dit?"
        answer="Dit is een eenvoudig antwoord."
        keywords={['demo', 'test']}
      />
      <AccordionItem
        id="item-2"
        question="Wat kost het?"
        answer="De prijs varieert per project."
        keywords={['prijs', 'kosten']}
      />
    </Accordion>
  );
}
```

## Components

### `<Accordion>`

Container component that manages accordion state.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'single' \| 'multiple'` | `'single'` | Single-open or multiple items open |
| `defaultOpenId` | `string \| null` | `null` | Default open item ID |
| `className` | `string` | `''` | Additional CSS classes |
| `children` | `React.ReactNode` | - | AccordionItem components |

**Example:**

```tsx
<Accordion type="single" defaultOpenId="business-1">
  {/* items */}
</Accordion>
```

### `<AccordionItem>`

Individual FAQ item with question and answer.

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | ✅ | Unique identifier |
| `question` | `string` | ✅ | Question text |
| `answer` | `string` | ✅ | Answer text |
| `keywords` | `string[]` | ❌ | Optional SEO keywords |

**Example:**

```tsx
<AccordionItem
  id="business-growth-1"
  question="Hoe zorgt een professionele website voor meer omzet?"
  answer="Een professionele website verhoogt uw omzet door..."
  keywords={["omzet", "ROI", "groei"]}
/>
```

## Advanced Usage

### Categorized FAQ

```tsx
const categories = ['Business Growth', 'Technical', 'Pricing'];

return (
  <div className="w-full max-w-none px-4 sm:px-5 md:max-w-2xl md:mx-auto">
    {categories.map((category) => (
      <div key={category} className="mb-12">
        <h3 className="text-xl md:text-2xl font-bold mb-4 text-cyan-300 pb-2 border-b border-white/10 sticky top-20 bg-cosmic-950/95 backdrop-blur-sm py-2 z-10">
          {category}
        </h3>
        
        <Accordion type="single">
          {faqs
            .filter(faq => faq.category === category)
            .map((faq, index) => (
              <AccordionItem
                key={`${category}-${index}`}
                id={`${category.toLowerCase().replace(/\s+/g, '-')}-${index + 1}`}
                question={faq.question}
                answer={faq.answer}
                keywords={faq.keywords}
              />
            ))}
        </Accordion>
      </div>
    ))}
  </div>
);
```

### Deep Linking

Items can be opened via URL hash:

```
https://example.com/diensten#faq=business-growth-1
```

The accordion will automatically:
1. Open the specified item
2. Scroll to it smoothly
3. Update the URL when items are toggled

## Styling

### Mobile Layout (Full-Bleed)

```tsx
<div className="w-full max-w-none px-4 sm:px-5 md:max-w-2xl md:mx-auto">
  <Accordion type="single">
    {/* items */}
  </Accordion>
</div>
```

- **Mobile**: Full viewport width with safe padding (`px-4 sm:px-5`)
- **Desktop**: Centered with max-width (`md:max-w-2xl md:mx-auto`)

### Category Headers (Sticky)

```tsx
<h3 className="text-xl md:text-2xl font-bold mb-4 text-cyan-300 pb-2 border-b border-white/10 sticky top-20 bg-cosmic-950/95 backdrop-blur-sm py-2 z-10">
  {category}
</h3>
```

### Custom Styling

Override styles via className:

```tsx
<Accordion className="custom-accordion-styles">
  {/* items */}
</Accordion>
```

## Accessibility

### ARIA Attributes

- `aria-expanded`: Indicates open/closed state
- `aria-controls`: Links button to panel
- `aria-label`: Dutch labels ("Toon antwoord" / "Verberg antwoord")
- `role="region"`: Marks answer panel as a region
- `aria-labelledby`: Links panel back to button

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move focus between buttons |
| `Enter` / `Space` | Toggle item open/closed |
| `ArrowDown` | Focus next item |
| `ArrowUp` | Focus previous item |
| `Home` | Focus first item |
| `End` | Focus last item |

### Focus Management

Visible focus rings with proper contrast:

```css
focus:outline-none 
focus-visible:ring-2 
focus-visible:ring-cyan-400 
focus-visible:ring-offset-2 
focus-visible:ring-offset-cosmic-950
```

## Performance

### Zero CLS

Uses measured height transitions:

```tsx
const [height, setHeight] = useState<number | 'auto'>(0);

// Measure before transitioning
useEffect(() => {
  if (isOpen) {
    setHeight(panelRef.current.scrollHeight);
    // Set to 'auto' after animation
    setTimeout(() => setHeight('auto'), 150);
  } else {
    setHeight(panelRef.current.scrollHeight);
    requestAnimationFrame(() => setHeight(0));
  }
}, [isOpen]);
```

### Bundle Size

- **Accordion.tsx**: ~2 KB gzipped
- **Item.tsx**: ~3 KB gzipped
- **Total**: ~5 KB gzipped (well under 6 KB budget)

### Animations

Smooth 150ms transitions with motion-safe support:

```css
transition-[height,opacity] 
duration-150 
ease-out 
motion-reduce:transition-none
```

## Testing

Run tests:

```bash
npm test src/components/faq
```

Test coverage includes:
- ✅ Rendering all items
- ✅ Toggle open/closed
- ✅ Single-open mode
- ✅ ARIA attributes
- ✅ Keyboard navigation
- ✅ Tap target sizes
- ✅ Keywords display

## Browser Support

- ✅ Chrome/Edge (last 2 versions)
- ✅ Safari (last 2 versions)
- ✅ Firefox (last 2 versions)
- ✅ iOS Safari 15+
- ✅ Android Chrome (last 2 versions)

## Migration from Old FAQ

### Before (details/summary)

```tsx
<details className="group bg-neutral-800/30 border ...">
  <summary className="flex items-center ...">
    <h4>{question}</h4>
    <ChevronDown />
  </summary>
  <div>
    <p>{answer}</p>
  </div>
</details>
```

### After (Accordion)

```tsx
<Accordion type="single">
  <AccordionItem
    id="unique-id"
    question={question}
    answer={answer}
    keywords={keywords}
  />
</Accordion>
```

## Best Practices

1. **Use unique IDs**: Ensure each item has a unique `id` prop
2. **Keep answers concise**: Aim for 2-3 sentences max
3. **Add keywords**: Helps with SEO and context
4. **Group by category**: Use category headers for better UX
5. **Test keyboard nav**: Verify all keys work as expected
6. **Check mobile layout**: Ensure full-width on mobile
7. **Monitor CLS**: Use Lighthouse to verify zero CLS

## Troubleshooting

### Items not opening

Ensure the Accordion has proper context:

```tsx
// ✅ Good
<Accordion type="single">
  <AccordionItem {...props} />
</Accordion>

// ❌ Bad - Item outside Accordion
<AccordionItem {...props} />
```

### Multiple items open in single mode

Check that `type="single"` is set on Accordion:

```tsx
<Accordion type="single"> {/* Not 'multiple' */}
```

### Jerky animations

Ensure no conflicting transitions or height constraints on parent elements.

### Focus not visible

Check that focus-visible styles aren't being overridden globally.

## Related Components

- `FAQSection.tsx` - Section wrapper for FAQ
- `FAQSchema.tsx` - Structured data for SEO
- `DutchMarketFAQ.tsx` - Example implementation

## License

Part of ProWeb Studio V1 - Internal use only.
