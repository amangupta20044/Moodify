const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()

app.use(express.json())
app.use(cookieParser())

//importing routes
const authRoutes = require("./routes/auth.routes")
const songRoutes = require("./routes/song.routes")
//using routes
app.use("/api/auth",authRoutes)
app.use("/api/songs",songRoutes)




module.exports = app
