
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import * as Localization from 'expo-localization';

import ru from './locales/ru.json';
import en from './locales/en.json';
import es from './locales/es.json';
import de from './locales/de.json';

const resources = { ru: {translation: ru}, en: {translation: en}, es: {translation: es}, de: {translation: de} };

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
