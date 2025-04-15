import express from "express"
import HealthCheckRouter from "./router/user.router.js"
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

app.use('/',HealthCheckRouter)
export { app };