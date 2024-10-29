import express from "express"
import { initMemcache, initRDS, errHandler } from "../shared/index.js"
import morgan from "morgan"
import cors from "cors"
import { credentialHandler } from "./middleware/cognito.js"
import { fetchHistory } from "./controller/history.js"
import { fetchProgress } from "./controller/progress.js"
import { downloadVideo } from "./controller/video.js"

// check dependencies
try {
    // check init memcache
    await initMemcache()
    // check RDS connection
    await initRDS()
} catch (err) {
    console.error(err)
    process.exit(1)
}

// initial express app and apply middlewares
const app = express()
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())
// app.use(credentialHandler)

// router configuration
app.get('/history', fetchHistory)
app.get('/progress/:taskId', fetchProgress)
app.get('/video/:videoName', downloadVideo)

// general error handler
app.use(errHandler)
app.listen(3000, () => console.log(`Server is running`));