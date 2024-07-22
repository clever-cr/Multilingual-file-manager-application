import { Router } from 'express';
import passport from 'passport';
import * as authController from "../controllers/authController"


const router = Router();
router.route("/register").post(authController.createUser)