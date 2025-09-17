import type { Config } from 'tailwindcss';

const config: Config = {
  // ...existing code...
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontWeight: {
        // Only include weights we're actually loading
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      // ...existing code...
    },
  },
  // ...existing code...
};

export default config;