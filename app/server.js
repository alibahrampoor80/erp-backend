import {default as mongoose} from 'mongoose'
import http from 'http'
import path from 'path'

import morgan from 'morgan'
import cors from "cors"
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from '../swagger.js'
import allRoutes from "./routes/router.js";
import express from 'express'
import {fileURLToPath} from 'url'
import {dirname} from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default class Application {
    #express = express
    #app = this.#express()
    #DB_URL = process.env.DB_URL

    constructor(PORT) {
        this.configDataBase()
        this.configApplication()
        this.createServer(PORT)
        this.createRoutes()
        this.errorHandler()
    }

    configApplication() {
        this.#app.use(
            cors({credentials: true, origin: process.env.ALLOW_CORS_ORIGIN})
        );
        this.#app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument,
            {
                docExpansion: "none"
            }
        ));

        this.#app.use(this.#express.json())
        this.#app.use(this.#express.urlencoded({extended: true}))
        this.#app.use(this.#express.static(path.join(__dirname, "..", "public")))
        // this.#app.use(this.#express.)
        this.#app.use(morgan('dev'))
    }

    createServer(PORT) {
        const server = http.createServer(this.#app)
        server.listen(PORT, () => {
            console.log(`server is running on http://localhost:${PORT}`)
        })
    }

    configDataBase() {
        mongoose.connect(this.#DB_URL).then(() => {
            console.log('connected to mongodb!!')
        }).catch((err) => {
            throw err
        })
    }

    errorHandler() {
        this.#app.use((req, res, next) => {
            res.status(404).json({
                status: 404,
                success: false,
                message: "آدرس مورد نطر یافت نشد"
            })
        })
        this.#app.use((err, req, res, next) => {
            const status = err?.status || 500
            const message = err?.message || "Internal error server"
            res.status(status).json({
                status,
                success: false,
                message
            })
        })
    }

    createRoutes() {
        this.#app.get("/", (req, res, next) => {
            res.json({
                message: "this is application erp - created by ali bahrampoor",
                swagger_document: `${req.protocol}://${req.get("host")}/swagger`
            })
        })
        this.#app.use("/api", allRoutes)
        // this.#app.use((err, req, res, next) => {
        //     try {
        //         this.#app.use(allRoutes)
        //     } catch (err) {
        //         next(err)
        //     }
        // })
    }
}