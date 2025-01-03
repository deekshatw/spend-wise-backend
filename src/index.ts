import express, { Express } from 'express'
import http from 'http'
import cors from 'cors'
import bodyParser from 'body-parser'
import * as dotenv from "dotenv";
import mongoose from 'mongoose'
import helloRouter from './routes/hello.routes'
import { router } from './routes/routes'

const app: Express = express()
const server = http.createServer(app)

// express configurations
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set("PORT", 3000)
app.set("BASE_URL", "localhost")
dotenv.config()

// defining the routes
app.use("/api/v1", router)

// Mongo connection
const mongoURI = process.env.MONGO_DB_URL

if (!mongoURI) {
    console.error("MongoDB connection string not found")
    process.exit(1)
}


mongoose.connect(mongoURI, {}).then(() => {
    console.log("MongoDB connected")
}).catch((err) => () => { console.error(err) })
// start the server
try {
    const port: Number = app.get("PORT")
    const baseUrl: String = app.get("BASE_URL")
    server.listen(port, (): void => {
        console.log(`Server running at http://${baseUrl}:${port}`)
    })
} catch (err) {
    console.log(err)
}

export default server