import express from "express";
import { login } from "../controller/userController.js";

const router = express.Router();

/**
 * Login API
 */
router.post("/login", login);

export default router;
