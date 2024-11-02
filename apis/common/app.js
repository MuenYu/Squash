import express from "express"
import { initMemcache, initRDS, errHandler } from "../shared/index.js"
import morgan from "morgan"
import cors from "cors"
import { credentialHandler } from "./middleware/cognito.js"
import { fetchHistory } from "./controller/history.js"
import { downloadVideo, uploadAndCompress, compress, fetchUploadVideos } from "./controller/video.js"
import { uploadHandler } from "./middleware/upload.js"

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

const port = process.env.port ?? 3000
// initial express app and apply middlewares
const app = express()
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())

// router configuration
app.get('/api/common', (req,res)=>{res.json('ok')})
app.get('/api/common/history', credentialHandler, fetchHistory)
app.get('/api/common/videos', credentialHandler, fetchUploadVideos)
app.get('/api/common/videos/:videoName', credentialHandler, downloadVideo)
app.post('/api/common/videos/compress', credentialHandler, uploadHandler, uploadAndCompress)
app.post('/api/common/videos/:videoName/compress', credentialHandler, compress)

// general error handler
app.use(errHandler)
app.listen(port, () => console.log(`Server is running on ${port}`));