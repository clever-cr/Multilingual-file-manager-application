import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

export const createUser = async (req, res) => {
  try {
    const { userName, email, password, language } = req.body;
    const t = req.t;
    const userExists = await User.findOne({ userName });

    if (userExists) {
      return res.status(400).json({ message: t('user.userExists') });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
      language,
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        username: user.userName,
        email: user.email,
        language: user.language,
        message: t('user.usercreatedsuccessfully'),
      });
    } else {
      return res.status(400).json({ message: t('user.invalidData') });
    }
  } catch (error) {
    res
      .status(400)
      .json({ error: t('error_creating_user'), details: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const t = req.t;

    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(401).json({ error: req.t('invalid_email') });
    }
    const passwordMatch = await bcrypt.compare(password, userExists?.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: req.t('invalid_password') });
    }

    req.i18n.changeLanguage(userExists.language);
    return res.json({
      message: t('user.user_logged_in_successfully'),
      _id: userExists._id,
      username: userExists.userName,
      email: userExists.email,
      language: userExists.language,
      token: generateToken(userExists._id),
    });
  } catch (error) {
    return res
      .status(400)
      .json({ error: req.t('user.invalidData'), details: error.message });
  }
};
