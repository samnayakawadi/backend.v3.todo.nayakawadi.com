import express from "express"
import { createNewUser } from "../controllers/userControllers.js"

const userRoutes = express.Router()

userRoutes.post("/create-new-user", createNewUser)

export default userRoutes