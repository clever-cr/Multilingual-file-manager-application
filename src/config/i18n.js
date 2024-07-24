
import i18next from 'i18next';
import i18nextMiddleware  from "i18next-http-middleware";
import Backend from "i18next-fs-backend";
import path from "path"


i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(__dirname, 'locales/{{lng}}/{{ns}}.json'),
    },
    fallbackLng: 'en',
    preload: ['en', 'es'], 
    saveMissing: true,
    debug: true,
  });

module.exports = i18next;
