import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en.json';
import zhTW from '../locales/zh-TW.json';

export const SUPPORTED_LANGUAGES = ['zh-TW', 'en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      'zh-TW': { translation: zhTW },
    },
    // Default UI language. Falls through to `fallbackLng` only when a key
    // is missing from this resource — not when the language itself is unset.
    lng: 'zh-TW',
    fallbackLng: 'en',
    supportedLngs: ['zh-TW', 'en'],
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
    detection: {
      // Only honor an explicit prior user choice (localStorage). Skip navigator
      // so a non-Chinese browser doesn't override the zh-TW default for new
      // visitors — Taiwan is the primary audience.
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'austria-reise-lang',
    },
  });

export default i18n;
