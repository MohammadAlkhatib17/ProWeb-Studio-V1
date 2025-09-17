'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface CalcomFacadeProps {
  calLink: string;
  buttonText?: string;
  className?: string;
}

export function CalcomFacade({ 
  calLink, 
  buttonText = 'Book a Call',
  className = ''
}: CalcomFacadeProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      // Dynamically load Cal.com script only when needed
      const script = document.createElement('script');
      script.src = 'https://app.cal.com/embed/embed.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <button
        onClick={() => setIsLoaded(true)}
        className={`cal-facade-button ${className}`}
        style={{ minHeight: '48px' }} // Prevent CLS
      >
        {buttonText}
      </button>
    );
  }

  return (
    <button
      data-cal-link={calLink}
      data-cal-config='{"theme":"light"}'
      className={className}
      style={{ minHeight: '48px' }}
    >
      {buttonText}
    </button>
  );
}
