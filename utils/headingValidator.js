/**
 * Validates heading hierarchy on a page
 * Ensures proper H1-H6 structure for SEO
 */
export function validateHeadingHierarchy() {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const errors = [];
  const warnings = [];
  
  // Check for H1
  const h1Elements = document.querySelectorAll('h1');
  if (h1Elements.length === 0) {
    errors.push('No H1 found on page - every page must have exactly one H1');
  } else if (h1Elements.length > 1) {
    errors.push(`Multiple H1 tags found (${h1Elements.length}) - use only one H1 per page`);
  }
  
  // Check heading hierarchy
  let previousLevel = 0;
  headings.forEach((heading, index) => {
    const currentLevel = parseInt(heading.tagName.substring(1));
    
    // Check for skipped levels
    if (previousLevel > 0 && currentLevel > previousLevel + 1) {
      warnings.push(`Heading hierarchy skip at index ${index}: ${heading.tagName} follows H${previousLevel}`);
    }
    
    // Check for empty headings
    if (!heading.textContent.trim()) {
      errors.push(`Empty ${heading.tagName} found at index ${index}`);
    }
    
    // Check heading length for SEO
    if (heading.textContent.length > 70) {
      warnings.push(`${heading.tagName} at index ${index} is too long (${heading.textContent.length} chars) - keep under 70`);
    }
    
    previousLevel = currentLevel;
  });
  
  return { errors, warnings, valid: errors.length === 0 };
}

// Run validation in development
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      const result = validateHeadingHierarchy();
      if (!result.valid) {
        // Only log in development console for debugging
        result.errors.forEach(error => console.error('❌', error));
        result.warnings.forEach(warning => console.warn('⚠️', warning));
      }
    });
  }
}
