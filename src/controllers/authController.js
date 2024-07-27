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
    console.log('yoooo');
    const { userName, email, password, language } = req.body;
    const t = req.t;
    const userExists = await User.findOne({ userName });
    console.log(userExists);

    // if (userExists) {
    //   res.status(400).json({ message: t('user.userExists') });
    //   return;
    // }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      userName,
      email,
      password,
      language,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.userName,
        email: user.email,
        language: user.language,
        message: t('user.usercreatedsuccessfully'),
        // token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: t('user.invalidData') });
    }

    // const user = await User.create({
    //   userName: req.body.userName,
    //   password: hashedPassword,
    // });
    // res.status(201).json({ message: req.t('user_created_successfully'), user });
  } catch (error) {
    console.log('error', error);
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
    console.log('user Exists', userExists);
    // return res.status(401).json({ message: t('user.userExists') });
    // if (!userExists) {
    //   return res.status(404).json({ error: req.t('user_not_found') });
    // }

    const passwordMatch = await bcrypt.compare(password, userExists.password);
    console.log('passwordd', passwordMatch);
    // if (!passwordMatch) {
    //   return res.status(401).json({ error: req.t('invalid_password') });
    // }

    if (userExists) {
      req.i18n.changeLanguage(userExists.language);
      return res.json({
        _id: userExists._id,
        username: userExists.userName,
        email: userExists.email,
        language: userExists.language,
        token: generateToken(userExists._id),
      });
    } else {
      return res.status(401).json({ message: t('user.invalidEmailPassword') });
    }

    return res.status(200).json({ message: t('user.user_logged_in_successfully') });
  } catch (error) {
    return res
      .status(400)
      .json({ error: req.t('user.invalidData'), details: error.message });
  }
};
