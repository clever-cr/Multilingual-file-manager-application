import { Router } from "express";
import passport from "passport";
import * as authController from "../controllers/authController.js";

const route = Router();
route.route("/register").post(authController.createUser);
route.route("/login").get(authController.login)
export default route;
