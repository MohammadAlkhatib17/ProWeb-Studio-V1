// Font loading utilities with subsetting and optimization

export const fontConfig = {
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  subsets: ['latin', 'latin-ext'],
  display: 'swap' as const,
};

// Generate Google Fonts URL with proper subsetting
export function getGoogleFontsUrl() {
  const weights = Object.values(fontConfig.weights).join(';');
  const subsets = fontConfig.subsets.join(',');
  
  return `https://fonts.googleapis.com/css2?family=Inter:wght@${weights}&display=${fontConfig.display}&subset=${subsets}`;
}

// Font face observer for critical text rendering
export async function loadFonts() {
  if (typeof window === 'undefined') return;
  
  try {
    // Dynamically import FontFaceObserver only on client
    const FontFaceObserver = (await import('fontfaceobserver')).default;
    
    const font = new FontFaceObserver('Inter', {
      weight: 400,
    });
    
    const fontMedium = new FontFaceObserver('Inter', {
      weight: 600,
    });
    
    // Load critical font weights
    await Promise.all([
      font.load(null, 5000),
      fontMedium.load(null, 5000),
    ]);
    
    // Add class to indicate fonts are loaded
    document.documentElement.classList.add('fonts-loaded');
  } catch (error) {
    console.warn('Font loading failed, using fallback fonts', error);
    document.documentElement.classList.add('fonts-fallback');
  }
}

// Subset text for critical rendering
export function getSubsetText() {
  return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?-_()[]{}@#$%^&*+=<>/\\|`~;:\'"';
}
