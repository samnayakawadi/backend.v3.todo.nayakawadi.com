import express from "express"
import { createNewUser, loginController, refreshTokenController, userLogoutController, userProfileController } from "../controllers/userControllers.js"
import { authorizeUser } from "../middlewares/authMiddlewares.js"

const userRoutes = express.Router()

userRoutes.post("/create-new-user", createNewUser)
userRoutes.post("/login", loginController)
userRoutes.post("/logout", authorizeUser, userLogoutController)
userRoutes.get("/refresh", refreshTokenController)
userRoutes.get("/profile", authorizeUser, userProfileController)

export default userRoutes