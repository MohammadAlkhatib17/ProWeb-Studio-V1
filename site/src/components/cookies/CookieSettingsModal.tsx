/**
 * Cookie Settings Modal
 * Granular consent controls with accessibility
 * Allows users to manage individual cookie categories
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useCookieConsent } from './useCookieConsent';
import { Button } from '@/components/Button';
import type { ConsentState } from './types';

interface CategoryConfig {
  id: keyof ConsentState;
  label: string;
  description: string;
  required: boolean;
}

const CATEGORIES: CategoryConfig[] = [
  {
    id: 'necessary',
    label: 'Noodzakelijke cookies',
    description:
      'Deze cookies zijn essentieel voor de basisfunctionaliteit van de website. Ze kunnen niet worden uitgeschakeld.',
    required: true,
  },
  {
    id: 'analytics',
    label: 'Analytische cookies',
    description:
      'Helpen ons te begrijpen hoe bezoekers de website gebruiken, zodat we de ervaring kunnen verbeteren. We gebruiken privacy-vriendelijke analytics zonder persoonlijke data.',
    required: false,
  },
  {
    id: 'marketing',
    label: 'Marketing cookies',
    description:
      'Worden gebruikt om gerichte content en advertenties te tonen die relevant zijn voor jouw interesses.',
    required: false,
  },
];

export default function CookieSettingsModal() {
  const {
    consent: initialConsent,
    showSettings,
    closeSettings,
    updateConsent,
  } = useCookieConsent();
  
  const [localConsent, setLocalConsent] = useState<ConsentState>(initialConsent);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Sync local state with global consent
  useEffect(() => {
    setLocalConsent(initialConsent);
  }, [initialConsent]);

  // Focus management
  useEffect(() => {
    if (showSettings && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [showSettings]);

  // ESC key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showSettings) {
        closeSettings();
      }
    };

    if (showSettings) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
    
    return undefined;
  }, [showSettings, closeSettings]);

  // Focus trap
  useEffect(() => {
    if (!showSettings || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modal.addEventListener('keydown', handleTab);
    return () => modal.removeEventListener('keydown', handleTab);
  }, [showSettings]);

  const handleToggle = (category: keyof ConsentState) => {
    if (category === 'necessary') return; // Can't toggle necessary
    
    setLocalConsent((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSave = () => {
    updateConsent(localConsent);
    closeSettings();
  };

  const handleAcceptAll = () => {
    const allAccepted: ConsentState = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setLocalConsent(allAccepted);
    updateConsent(allAccepted);
    closeSettings();
  };

  if (!showSettings) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
        onClick={closeSettings}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-settings-title"
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      >
        <div
          className="bg-cosmic-900 border border-cosmic-700 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          style={{
            willChange: 'transform',
          }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-cosmic-900 border-b border-cosmic-700 px-6 py-4 flex items-center justify-between">
            <h2
              id="cookie-settings-title"
              className="text-xl font-semibold text-white"
            >
              Cookie-instellingen
            </h2>
            <button
              ref={closeButtonRef}
              onClick={closeSettings}
              className="text-slate-400 hover:text-white transition-colors p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
              aria-label="Sluiten"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            <p className="text-sm text-slate-300 leading-relaxed">
              Beheer jouw cookie-voorkeuren. Je kunt je keuzes op elk moment
              aanpassen via de footer van onze website.
            </p>

            {/* Categories */}
            <div className="space-y-4">
              {CATEGORIES.map((category) => (
                <div
                  key={category.id}
                  className="bg-cosmic-800/40 border border-cosmic-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-2">
                        {category.label}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                    
                    {/* Toggle Switch */}
                    <div className="flex-shrink-0">
                      <button
                        role="switch"
                        aria-checked={localConsent[category.id]}
                        aria-label={`${category.label} ${localConsent[category.id] ? 'uitschakelen' : 'inschakelen'}`}
                        disabled={category.required}
                        onClick={() => handleToggle(category.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-cosmic-900 ${
                          localConsent[category.id]
                            ? 'bg-cyan-500'
                            : 'bg-slate-600'
                        } ${category.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            localConsent[category.id] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  
                  {category.required && (
                    <p className="mt-2 text-xs text-cyan-400">
                      Altijd actief
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-cosmic-900 border-t border-cosmic-700 px-6 py-4 flex flex-col sm:flex-row gap-3">
            <Button
              as="button"
              onClick={handleSave}
              variant="primary"
              className="flex-1 min-h-[44px]"
            >
              Voorkeuren opslaan
            </Button>
            <Button
              as="button"
              onClick={handleAcceptAll}
              variant="secondary"
              className="flex-1 min-h-[44px]"
            >
              Alles accepteren
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
