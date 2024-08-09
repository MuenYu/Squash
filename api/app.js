import express from "express"

const port = process.env.Port || 3000 
const app = express()
app.use("*", (req,res)=>{
    res.json("hello world")
})
app.listen(port, ()=> console.log(`Server is running on ${port}`))