import express from "express";
import { register, confirmRegistration, login } from "../controller/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/confirm", confirmRegistration);
/**
 * Login API
 */
router.post("/login", login);

export default router;
