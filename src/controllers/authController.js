import user from "../models/user.js";
import bcrypt from "bcrypt";
export const createUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const users = await user.create({
      userName: req.body.userName,
      password: hashedPassword,

    });
    res.status(201).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const userExists = await user.find({ userName: req.body.userName });
    if (!userExists) {
      res.status(404).json("User doens't exists");
    }
    res.status(200).json("user logged in successfully");
  } catch (error) {
    console.log(error);
  }
};
