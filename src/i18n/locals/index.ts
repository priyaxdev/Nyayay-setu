// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';
// import en from './locales/en.json';
// import hi from './locales/hi.json';
// import mr from './locales/mr.json';
// import bn from './locales/bn.json';
// import ta from './locales/ta.json';

// i18n
//   .use(LanguageDetector)
//   .use(initReactI18next)
//   .init({
//     resources: {
//       en: { translation: en },
//       hi: { translation: hi },
//       mr: { translation: mr },
//       bn: { translation: bn },
//       ta: { translation: ta },
//     },
//     fallbackLng: 'en',
//     interpolation: { escapeValue: false },
//   });

// export default i18n;
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './en.json';
import hi from './hi.json';
import mr from './mr.json';
import bn from './bn.json';
import ta from './ta.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      mr: { translation: mr },
      bn: { translation: bn },
      ta: { translation: ta },
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;