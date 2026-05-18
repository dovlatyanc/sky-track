import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ru',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    ns: ['common', 'auth', 'shop', 'cart',
       'profile','contacts','favorites','orders','news',
       'favorites_tickets','success','notFound','flight',
       'flightSchedule','flightActions','home','flightList','filters'],
    defaultNS: 'common',
  })

export default i18n