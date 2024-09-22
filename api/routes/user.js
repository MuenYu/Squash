import express from "express";
import { register, confirmRegistration, login, setupMFA, verifyMFA, 
    verifyMFAChallenge, handleGoogleAuth, getGoogleSignInUrl } from "../controller/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/confirm", confirmRegistration);
/**
 * Login API
 */
router.post("/login", login);
router.post("/setup-mfa", setupMFA);
router.post("/verify-mfa", verifyMFA);
router.post("/verify-mfa-challenge", verifyMFAChallenge);
router.post("/google", handleGoogleAuth);
router.get("/google-signin-url", getGoogleSignInUrl);

export default router;
