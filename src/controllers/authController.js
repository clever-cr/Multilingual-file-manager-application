import User from "../models/user.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      userName: req.body.userName,
      password: hashedPassword,
    });
    res.status(201).json({ message: req.t("user_created_successfully"), user });
  } catch (error) {
    res
      .status(400)
      .json({ error: req.t("error_creating_user"), details: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const userExists = await User.findOne({ userName: req.body.userName });
    if (!userExists) {
      return res.status(404).json({ error: req.t("user_not_found") });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      userExists.password
    );
    if (!passwordMatch) {
      return res.status(401).json({ error: req.t("invalid_password") });
    }

    res.status(200).json({ message: req.t("user_logged_in_successfully") });
  } catch (error) {
    res
      .status(400)
      .json({ error: req.t("error_logging_in"), details: error.message });
  }
};
