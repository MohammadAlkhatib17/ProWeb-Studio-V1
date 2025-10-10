'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { siteConfig } from '@/config/site.config';
import { Button } from '@/components/Button';

// Check if the Cal.com URL is valid (not a placeholder)
function isValidCalcomUrl(url: string): boolean {
  if (!url) return false;
  
  // Check for common placeholder patterns
  const placeholderPatterns = [
    'your-handle',
    'your-username',
    'placeholder',
    'example',
    'demo'
  ];
  
  // Check if URL contains any placeholder patterns
  const hasPlaceholder = placeholderPatterns.some(pattern => 
    url.toLowerCase().includes(pattern)
  );
  
  // Check if it's a proper cal.com URL format (basic validation)
  const isProperFormat = url.startsWith('https://cal.com/') && url.length > 'https://cal.com/'.length;
  
  return !hasPlaceholder && isProperFormat;
}

export default function CalEmbed() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const url = siteConfig.links.calcom;
  const isValidUrl = isValidCalcomUrl(url);

  const handleClick = () => {
    if (isValidUrl) {
      setOpen(true);
    } else {
      // Route to contact page instead
      router.push('/contact');
    }
  };
  return (
    <>
      <Button
        as="button"
        onClick={handleClick}
        variant="primary"
        size="large"
      >
        Plan een call
      </Button>
      {open && isValidUrl && (
        <div className="fixed inset-0 bg-black/70 z-50 grid place-items-center p-4">
          <div className="bg-cosmic-900 rounded-xl border border-cosmic-700/60 w-full max-w-3xl h-[80vh] overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-3 border-b border-cosmic-700">
              <h2 className="text-lg font-semibold">Plan een call</h2>
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-2 border border-cosmic-700 bg-cosmic-800/60 hover:bg-cosmic-700/80 transition-colors duration-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                Sluiten
              </button>
            </div>
            <iframe src={url} className="w-full h-full" loading="lazy" />
          </div>
        </div>
      )}
    </>
  );
}
