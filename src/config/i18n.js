import i18next from 'i18next';
import Backend from 'i18next-node-fs-backend';
import middleware from 'i18next-http-middleware';
import path from 'path';
import { __dirname } from '../utils/dirname.js';

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: path.join(__dirname, '../locales/{{lng}}/common.json'),
    },
    detection: {
      order: ['header', 'querystring', 'cookie'],
      caches: false,
    },
    preload: ['en', 'es' , 'fr'], // Preload languages
  });

export default middleware.handle(i18next);
// module.exports = i18nextMiddleware.handle(i18next);
