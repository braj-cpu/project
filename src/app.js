import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import
import userRouter from "./routes/user.routes.js"
//routes declaration (its done using middleware)
app.use("/api/v1/users", userRouter)// /api/v1/users pe jane p control userRouter ko chala jayega
// http://localhost:8000/users/register ye complete path hoga


export {app}


