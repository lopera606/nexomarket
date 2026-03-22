'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ChevronDown, X } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  timestamp: number;
}

export default function CookieConsent() {
  const t = useTranslations('legal');
  const [consent, setConsent] = useState<CookiePreferences | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
    timestamp: Date.now(),
  });

  // Load consent from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('nexomarket-cookie-consent');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CookiePreferences;
        setConsent(parsed);
        setPreferences(parsed);
      } catch {
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    const consentData: CookiePreferences = {
      ...prefs,
      timestamp: Date.now(),
    };
    localStorage.setItem('nexomarket-cookie-consent', JSON.stringify(consentData));
    setConsent(consentData);
    setPreferences(consentData);
    setShowBanner(false);
    setIsExpanded(false);
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
      timestamp: Date.now(),
    };
    saveConsent(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
      timestamp: Date.now(),
    };
    saveConsent(onlyNecessary);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const handleToggleCategory = (category: keyof Omit<CookiePreferences, 'timestamp'>) => {
    if (category === 'necessary') return; // Necessary cannot be toggled
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Consent Banner - Simple View */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 transform transition-transform duration-500 ease-out ${
          !isExpanded ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="bg-white border-t border-gray-200 shadow-2xl">
          <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-6 sm:py-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 sm:gap-6 items-start">
              {/* Content Section */}
              <div className="sm:col-span-8">
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  {t('cookieBanner.title')}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {t('cookieBanner.description')}
                </p>
                <div className="flex flex-wrap gap-2 items-center text-xs text-gray-500">
                  <span>{t('cookies')}</span>
                  <Link
                    href="/politica-cookies"
                    className="text-[#0066FF] hover:underline font-medium"
                  >
                    {t('cookieBanner.moreInfo')}
                  </Link>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="sm:col-span-4 flex flex-col gap-3 sm:gap-2">
                <button
                  onClick={handleAcceptAll}
                  className="w-full px-4 py-2.5 bg-[#0066FF] text-white text-sm font-semibold rounded-2xl hover:bg-[#0052CC] transition-all duration-200"
                >
                  {t('cookieBanner.acceptAll')}
                </button>
                <button
                  onClick={handleRejectAll}
                  className="w-full px-4 py-2.5 bg-gray-100 text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200"
                >
                  {t('cookieBanner.rejectAll')}
                </button>
                <button
                  onClick={() => setIsExpanded(true)}
                  className="w-full px-4 py-2.5 bg-transparent border border-gray-300 text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {t('cookieBanner.customize')}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Consent Banner - Expanded View */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 transform transition-transform duration-500 ease-out ${
          isExpanded ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="bg-white border-t border-gray-200 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-8">
            {/* Header with Close Button */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('cookieBanner.title')}
                </h2>
                <p className="text-sm text-gray-600">
                  {t('cookieBanner.description')}
                </p>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                aria-label="Close cookie settings"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Cookie Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Necessary Cookies */}
              <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">
                      {t('cookieBanner.necessary')}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {t('cookieBanner.necessaryDesc')}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-not-allowed opacity-60">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled
                      className="sr-only"
                      aria-label="Necessary cookies"
                    />
                    <div className="w-11 h-6 bg-[#0066FF] rounded-full shadow-inner"></div>
                    <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow transition-transform duration-200 pointer-events-none"></div>
                  </label>
                </div>
                <span className="inline-block text-xs font-medium text-[#0066FF] bg-[#0066FF]/10 px-2.5 py-1 rounded">
                  {t('cookieBanner.necessary')}
                </span>
              </div>

              {/* Analytics Cookies */}
              <div className="border border-gray-200 rounded-lg p-5 hover:border-[#0066FF]/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">
                      {t('cookieBanner.analytics')}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {t('cookieBanner.analyticsDesc')}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={() => handleToggleCategory('analytics')}
                      className="sr-only peer"
                      aria-label="Analytics cookies"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-checked:bg-[#0066FF] rounded-full shadow-inner transition-colors duration-200"></div>
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                        preferences.analytics ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    ></div>
                  </label>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="border border-gray-200 rounded-lg p-5 hover:border-[#0066FF]/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">
                      {t('cookieBanner.marketing')}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {t('cookieBanner.marketingDesc')}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={() => handleToggleCategory('marketing')}
                      className="sr-only peer"
                      aria-label="Marketing cookies"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-checked:bg-[#0066FF] rounded-full shadow-inner transition-colors duration-200"></div>
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                        preferences.marketing ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    ></div>
                  </label>
                </div>
              </div>

              {/* Preference Cookies */}
              <div className="border border-gray-200 rounded-lg p-5 hover:border-[#0066FF]/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">
                      {t('cookieBanner.preferences')}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {t('cookieBanner.preferencesDesc')}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.preferences}
                      onChange={() => handleToggleCategory('preferences')}
                      className="sr-only peer"
                      aria-label="Preference cookies"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-checked:bg-[#0066FF] rounded-full shadow-inner transition-colors duration-200"></div>
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                        preferences.preferences ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            {/* More Info Link */}
            <div className="text-xs text-gray-600 mb-6">
              <Link
                href="/politica-cookies"
                className="text-[#0066FF] hover:underline font-medium"
              >
                {t('cookieBanner.moreInfo')}
              </Link>
            </div>

            {/* Footer Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <button
                onClick={handleRejectAll}
                className="px-4 py-3 bg-gray-100 text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                {t('cookieBanner.rejectAll')}
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-3 bg-gray-100 text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                {t('cookieBanner.acceptAll')}
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-4 py-3 bg-[#0066FF] text-white text-sm font-semibold rounded-2xl hover:bg-[#0052CC] transition-all duration-200"
              >
                {t('cookieBanner.savePreferences')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Cookie Settings Button Component
 * Can be placed in the footer to allow users to re-open cookie preferences
 */
export function CookieSettingsButton() {
  const t = useTranslations('legal');
  const [showBanner, setShowBanner] = useState(false);

  const handleClick = () => {
    setShowBanner(true);
  };

  // Re-export as separate component that triggers the banner
  if (!showBanner) {
    return (
      <button
        onClick={handleClick}
        className="text-xs text-gray-600 hover:text-[#0066FF] transition-colors"
        title="Open cookie settings"
      >
        {t('cookieBanner.customize')}
      </button>
    );
  }

  return null;
}
