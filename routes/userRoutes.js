import express from "express"
import { createNewUser, loginController, userLogoutController } from "../controllers/userControllers.js"
import { authorizeUser } from "../middlewares/authMiddlewares.js"

const userRoutes = express.Router()

userRoutes.post("/create-new-user", createNewUser)
userRoutes.post("/login", loginController)
userRoutes.post("/logout", authorizeUser, userLogoutController)

export default userRoutes