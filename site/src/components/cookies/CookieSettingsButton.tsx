/**
 * Cookie Settings Button
 * Footer control to reopen cookie preferences modal
 */

'use client';

import { useCookieConsent } from './useCookieConsent';

export default function CookieSettingsButton() {
  const { openSettings } = useCookieConsent();

  return (
    <button
      onClick={openSettings}
      className="text-sm text-slate-400 hover:text-cyan-300 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cosmic-900 rounded underline decoration-dotted underline-offset-4"
      aria-label="Cookie-instellingen wijzigen"
    >
      Wijzig cookie-instellingen
    </button>
  );
}
