import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import tr from './locales/tr.json';
import de from './locales/de.json';

export const supportedLocales = ['tr', 'en', 'de'];
export const resources = {
  en: { translation: en },
  tr: { translation: tr },
  de: { translation: de },
};

export function createI18nInstance(locale = 'tr') {
  const language = supportedLocales.includes(locale) ? locale : 'tr';
  const instance = createInstance();

  instance.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: 'tr',
    supportedLngs: supportedLocales,
    initImmediate: false,
    interpolation: { escapeValue: false },
  });

  return instance;
}
