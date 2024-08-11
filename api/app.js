import express from "express"
import user from './routes/user.js'
import cors from "cors"

// app conf
const port = process.env.Port || 3000 

// global middlewares
const app = express()
app.use(cors())
app.use(express.json())

// routers
app.use('/user',user)

app.listen(port, ()=> console.log(`Server is running on ${port}`))