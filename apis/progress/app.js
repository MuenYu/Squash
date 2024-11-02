import express from "express"
import { initMemcache, errHandler } from "../shared/index.js"
import morgan from "morgan"
import cors from "cors"
import { credentialHandler } from "./middleware/cognito.js"
import { fetchProgress } from "./controller/progress.js"

// check dependencies
try {
    // check init memcache
    await initMemcache()
} catch (err) {
    console.error(err)
    process.exit(1)
}

const port = process.env.port ?? 3000
// initial express app and apply middlewares
const app = express()
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())
app.use(credentialHandler)

// router configuration
app.get('/api/progress/:taskId', fetchProgress)

// general error handler
app.use(errHandler)
app.listen(port, () => console.log(`Server is running on ${port}`));