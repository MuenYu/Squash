import express from "express"
import { errHandler } from "../shared/index.js"
import morgan from "morgan"
import cors from "cors"
import { register, confirmRegistration } from "./controller/register.js"
import { login } from "./controller/login.js"
import { setupMFA, verifyMFA, verifyMFAChallenge } from "./controller/mfa.js"

const port = process.env.port ?? 3000
// initial express app and apply middlewares
const app = express()
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())

// router configuration
app.get("/api/auth",(req,res)=>{res.json('ok')})
app.post("/api/auth/register", register);
app.post("/api/auth/confirm", confirmRegistration);
app.post("/api/auth/login", login);
app.post("/api/auth/setup-mfa", setupMFA);
app.post("/api/auth/verify-mfa", verifyMFA);
app.post("/api/auth/verify-mfa-challenge", verifyMFAChallenge);

// general error handler
app.use(errHandler)
app.listen(port, () => console.log(`Server is running on ${port}`));