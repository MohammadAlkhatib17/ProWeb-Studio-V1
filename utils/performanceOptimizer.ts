export function deferScript(src: string, id?: string): void {
  if (typeof window === 'undefined') return;
  
  // Wait for idle time to load non-critical scripts
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => loadScript(src, id));
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => loadScript(src, id), 1);
  }
}

function loadScript(src: string, id?: string): void {
  const existingScript = id ? document.getElementById(id) : null;
  if (existingScript) return;
  
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.defer = true;
  if (id) script.id = id;
  
  document.body.appendChild(script);
}

export function lazyLoadComponent(
  componentLoader: () => Promise<any>,
  options?: { rootMargin?: string }
): Promise<any> {
  return new Promise((resolve) => {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            componentLoader().then(resolve);
          }
        },
        { rootMargin: options?.rootMargin || '50px' }
      );
      
      // Create a placeholder element to observe
      const placeholder = document.createElement('div');
      document.body.appendChild(placeholder);
      observer.observe(placeholder);
    } else {
      // Fallback for older browsers
      componentLoader().then(resolve);
    }
  });
}
