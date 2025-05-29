import express from "express"
import { createNewUser, loginController } from "../controllers/userControllers.js"

const userRoutes = express.Router()

userRoutes.post("/create-new-user", createNewUser)
userRoutes.post("/login", loginController)

export default userRoutes