import express from "express"
import HealthCheckRouter from "./router/blog.router.js"
import bodyParser from "body-parser"
import cors from "cors"

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(cors({
    origin: process.env.cors_origin,
    credentials: true
}))

app.use('/',HealthCheckRouter)
export { app };