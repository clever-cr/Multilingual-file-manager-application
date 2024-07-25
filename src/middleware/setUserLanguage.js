import User from '../models/user.js';

export const setUserLanguage = async (req, res, next) => {
  if (req.user) {
    const user = await User.findById(req.user._id);
    if (user) {
      req.i18n.changeLanguage(user.language);
    }
  }
  next();
};
