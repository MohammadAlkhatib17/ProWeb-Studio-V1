"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { 
  ConsentPreferences,
  getConsentPreferences,
  setConsentPreferences,
  hasConsentChoice,
  defaultConsent,
} from './consent-manager';

interface CookieConsentBannerProps {
  className?: string;
}

export default function CookieConsentBanner({ className = '' }: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>(defaultConsent);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Only show banner if no consent choice has been made
    const hasChoice = hasConsentChoice();
    setIsVisible(!hasChoice);
    
    if (hasChoice) {
      // Load existing preferences
      const existingPrefs = getConsentPreferences();
      setPreferences(existingPrefs);
    }
  }, []);

  const handleAcceptAll = () => {
    setIsLoading(true);
    const allConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    
    setConsentPreferences(allConsent);
    setIsVisible(false);
    setIsLoading(false);
  };

  const handleRejectNonEssential = () => {
    setIsLoading(true);
    const minimalConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    
    setConsentPreferences(minimalConsent);
    setIsVisible(false);
    setIsLoading(false);
  };

  const handleSavePreferences = () => {
    setIsLoading(true);
    const { timestamp: _timestamp, ...prefs } = preferences;
    setConsentPreferences(prefs);
    setIsVisible(false);
    setIsLoading(false);
  };

  const handlePreferenceChange = (category: keyof Omit<ConsentPreferences, 'timestamp'>, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [category]: category === 'necessary' ? true : value, // Necessary always true
    }));
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 bg-cosmic-900/95 backdrop-blur-md border-t border-cosmic-700/50 shadow-2xl ${className}`}
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
    >
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        {!showDetails ? (
          // Simple banner view
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h2 id="cookie-banner-title" className="text-lg font-semibold text-white mb-2">
                Cookie Voorkeuren
              </h2>
              <p id="cookie-banner-description" className="text-slate-300 text-sm">
                Wij gebruiken cookies om uw ervaring te verbeteren. Noodzakelijke cookies zijn vereist voor de basisfunctionaliteit. 
                U kunt uw voorkeuren voor analytics en marketing cookies aanpassen.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 min-w-fit">
              <Button
                as="button"
                variant="secondary"
                size="normal"
                onClick={() => setShowDetails(true)}
                disabled={isLoading}
                className="text-sm px-4 py-2"
              >
                Aanpassen
              </Button>
              
              <Button
                as="button"
                variant="secondary"
                size="normal"
                onClick={handleRejectNonEssential}
                disabled={isLoading}
                className="text-sm px-4 py-2"
              >
                Alleen Noodzakelijk
              </Button>
              
              <Button
                as="button"
                variant="primary"
                size="normal"
                onClick={handleAcceptAll}
                disabled={isLoading}
                className="text-sm px-4 py-2"
              >
                Alles Accepteren
              </Button>
            </div>
          </div>
        ) : (
          // Detailed preferences view
          <div className="space-y-6">
            <div>
              <h2 id="cookie-banner-title" className="text-lg font-semibold text-white mb-2">
                Cookie Voorkeuren Aanpassen
              </h2>
              <p className="text-slate-300 text-sm">
                Kies welke cookies u wilt toestaan. Noodzakelijke cookies zijn altijd ingeschakeld.
              </p>
            </div>
            
            <div className="space-y-4">
              {/* Necessary Cookies */}
              <div className="flex items-start justify-between p-4 bg-cosmic-800/50 rounded-lg border border-cosmic-700/30">
                <div className="flex-1">
                  <h3 className="font-medium text-white mb-1">Noodzakelijke Cookies</h3>
                  <p className="text-sm text-slate-400">
                    Vereist voor basisfunctionaliteit, veiligheid en cookie voorkeuren. 
                    Kunnen niet worden uitgeschakeld.
                  </p>
                </div>
                <div className="ml-4 flex items-center">
                  <span className="text-sm text-green-400 font-medium">Altijd aan</span>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between p-4 bg-cosmic-800/50 rounded-lg border border-cosmic-700/30">
                <div className="flex-1">
                  <h3 className="font-medium text-white mb-1">Analytics Cookies</h3>
                  <p className="text-sm text-slate-400">
                    Helpen ons begrijpen hoe bezoekers onze website gebruiken via geanonimiseerde statistieken.
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

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between p-4 bg-cosmic-800/50 rounded-lg border border-cosmic-700/30">
                <div className="flex-1">
                  <h3 className="font-medium text-white mb-1">Marketing Cookies</h3>
                  <p className="text-sm text-slate-400">
                    Gebruikt voor gepersonaliseerde advertenties en het bijhouden van conversies.
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

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                as="button"
                variant="secondary"
                size="normal"
                onClick={() => setShowDetails(false)}
                disabled={isLoading}
                className="text-sm px-4 py-2"
              >
                Terug
              </Button>
              
              <Button
                as="button"
                variant="secondary"
                size="normal"
                onClick={handleRejectNonEssential}
                disabled={isLoading}
                className="text-sm px-4 py-2"
              >
                Alleen Noodzakelijk
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
        )}
      </div>
    </div>
  );
}