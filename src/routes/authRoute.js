import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { authenticateLogin } from "../middleware/verifyUser.js";

const route = Router();
route.route("/register").post(authController.createUser);
route.post("/login", authenticateLogin);
export default route;
