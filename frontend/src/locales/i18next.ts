import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import translationEN from './en'
import translationKO from './ko'

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  ko: {
    translation: translationKO,
  },
  en: {
    translation: translationEN,
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ko',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })
  .catch((e) => {
    console.error(e)
  })

i18n.on('languageChanged', (lng) => (document.documentElement.lang = lng))

export default i18n
