import express from "express"
import { errHandler } from "../shared/index.js"
import morgan from "morgan"
import cors from "cors"
import { register, confirmRegistration } from "./controller/register.js"
import { login } from "./controller/login.js"
import { setupMFA, verifyMFA, verifyMFAChallenge } from "./controller/mfa.js"

// initial express app and apply middlewares
const app = express()
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())

// router configuration
app.post("/register", register);
app.post("/confirm", confirmRegistration);
app.post("/login", login);
app.post("/setup-mfa", setupMFA);
app.post("/verify-mfa", verifyMFA);
app.post("/verify-mfa-challenge", verifyMFAChallenge);

// general error handler
app.use(errHandler)
app.listen(3000, () => console.log(`Server is running`));