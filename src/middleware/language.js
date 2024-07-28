export const setLanguage = (req, res, next) => {
  const lang = req.headers['accept-language'] || 'en';
  req.language = lang;
  req.i18n.changeLanguage(lang);
  next();
};
export default setLanguage;
