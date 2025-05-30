import express from "express"
import { connectDB } from "./config/db.js"
import { config } from "dotenv"
import userRoutes from "./routes/userRoutes.js"
import cookieParser from 'cookie-parser';

config({
    path: "./config/config.env"
})

const app = express()


// Creating the endpoints directly into the main file
app.get("/", (req, res) => {
    res.send("Server is Connected/ Tested OK v2 [GET]")
})

app.post("/", (req, res) => {
    res.send("Server is Connected/ Tested OK v2 [POST]")
})

app.put("/", (req, res) => {
    res.send("Server is Connected/ Tested OK v2 [PUT]")
})

app.delete("/", (req, res) => {
    res.send("Server is Connected/ Tested OK v2 [Delete]")
})

app.use(express.json())
app.use(cookieParser());
app.use("/users", userRoutes)

connectDB()

const port = process.env.server_port

app.listen(port, () => {
    console.log(`Server is running at ${port} port`)
})