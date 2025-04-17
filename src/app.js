import express from "express"
import userRouter from "./router/user.router.js"
import bodyParser from "body-parser"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())

app.use(cors({
    origin: process.env.cors_origin,
    credentials: true
}))


app.use('/api/v1',userRouter)
// /api/v1/signup  - Register a new user
// /api/v1/login -  Login a registered user
// /api/v1/logout - Logged out a logged in user
// /api/v1/healthCheck - Health Check route
export { app };