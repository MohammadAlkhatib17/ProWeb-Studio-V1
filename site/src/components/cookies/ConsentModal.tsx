"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { 
  ConsentPreferences,
  getConsentPreferences,
  setConsentPreferences,
  defaultConsent,
} from './consent-manager';

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsentModal({ isOpen, onClose }: ConsentModalProps) {
  const [preferences, setPreferences] = useState<ConsentPreferences>(defaultConsent);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load current preferences when modal opens
      const currentPrefs = getConsentPreferences();
      setPreferences(currentPrefs);
    }
  }, [isOpen]);

  const handlePreferenceChange = (category: keyof Omit<ConsentPreferences, 'timestamp'>, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [category]: category === 'necessary' ? true : value, // Necessary always true
    }));
  };

  const handleSavePreferences = () => {
    setIsLoading(true);
    const { timestamp: _timestamp, ...prefs } = preferences;
    setConsentPreferences(prefs);
    setIsLoading(false);
    onClose();
  };

  const handleRejectAll = () => {
    setIsLoading(true);
    const minimalConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setConsentPreferences(minimalConsent);
    setIsLoading(false);
    onClose();
  };

  const handleAcceptAll = () => {
    setIsLoading(true);
    const allConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setConsentPreferences(allConsent);
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-labelledby="consent-modal-title"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="relative bg-cosmic-900 border border-cosmic-700/50 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 id="consent-modal-title" className="text-xl font-semibold text-white">
              Cookie Voorkeuren Beheren
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cosmic-900"
              aria-label="Sluiten"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-slate-300 text-sm">
            Beheer uw cookie voorkeuren. U kunt op elk moment uw keuze wijzigen. 
            Noodzakelijke cookies blijven altijd ingeschakeld voor de basisfunctionaliteit van de website.
          </p>
          
          <div className="space-y-4">
            {/* Necessary Cookies */}
            <div className="p-4 bg-cosmic-800/50 rounded-lg border border-cosmic-700/30">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-white mb-2">Noodzakelijke Cookies</h3>
                  <p className="text-sm text-slate-400 mb-2">
                    Deze cookies zijn essentieel voor het functioneren van de website. 
                    Ze zorgen voor basisfuncties zoals navigatie, veiligheid en toegang tot beveiligde gebieden.
                  </p>
                  <p className="text-xs text-slate-500">
                    Voorbeelden: Sessie cookies, veiligheidscookies, cookie voorkeuren
                  </p>
                </div>
                <div className="ml-4 flex items-center">
                  <span className="text-sm text-green-400 font-medium">Altijd aan</span>
                </div>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="p-4 bg-cosmic-800/50 rounded-lg border border-cosmic-700/30">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-white mb-2">Analytics Cookies</h3>
                  <p className="text-sm text-slate-400 mb-2">
                    Deze cookies helpen ons begrijpen hoe bezoekers de website gebruiken door 
                    geanonimiseerde statistieken te verzamelen. Geen persoonlijke gegevens worden opgeslagen.
                  </p>
                  <p className="text-xs text-slate-500">
                    Voorbeelden: Google Analytics, paginabezoeken, gebruikersgedrag
                  </p>
                </div>
                <div className="ml-4 flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                      className="sr-only"
                      aria-describedby="analytics-desc"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${
                      preferences.analytics ? 'bg-cyan-500' : 'bg-cosmic-600'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                        preferences.analytics ? 'translate-x-5' : 'translate-x-0.5'
                      } mt-0.5`} />
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Marketing Cookies */}
            <div className="p-4 bg-cosmic-800/50 rounded-lg border border-cosmic-700/30">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-white mb-2">Marketing Cookies</h3>
                  <p className="text-sm text-slate-400 mb-2">
                    Deze cookies worden gebruikt om relevante advertenties te tonen en 
                    de effectiviteit van marketingcampagnes te meten.
                  </p>
                  <p className="text-xs text-slate-500">
                    Voorbeelden: Facebook Pixel, Google Ads conversie tracking, retargeting pixels
                  </p>
                </div>
                <div className="ml-4 flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                      className="sr-only"
                      aria-describedby="marketing-desc"
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${
                      preferences.marketing ? 'bg-cyan-500' : 'bg-cosmic-600'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                        preferences.marketing ? 'translate-x-5' : 'translate-x-0.5'
                      } mt-0.5`} />
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-cosmic-700/30">
            <Button
              as="button"
              variant="secondary"
              size="normal"
              onClick={handleRejectAll}
              disabled={isLoading}
              className="text-sm px-4 py-2"
            >
              Alleen Noodzakelijk
            </Button>
            
            <Button
              as="button"
              variant="secondary"
              size="normal"
              onClick={handleAcceptAll}
              disabled={isLoading}
              className="text-sm px-4 py-2"
            >
              Alles Accepteren
            </Button>
            
            <Button
              as="button"
              variant="primary"
              size="normal"
              onClick={handleSavePreferences}
              disabled={isLoading}
              className="text-sm px-4 py-2"
            >
              Voorkeuren Opslaan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}