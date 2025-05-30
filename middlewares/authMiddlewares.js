import jwt from "jsonwebtoken"
import { UserModel } from "../models/User.js"

export const authorizeUser = async (req, res, next) => {
    try {
        let token = req.headers.authorization

        token = token.split(" ")[1]

        if (token) {

            const decodedToken = jwt.verify(token, process.env.jwt_access_token_secret)

            const existingUser = await UserModel.findOne({ _id: decodedToken.id }).select("-password -refreshTokens")

            if (existingUser) {
                req.user = existingUser
                next()
            }
            else {
                res.status(401).json({
                    status: "failed",
                    message: "User does not exists",
                    description: "",
                    code: 401,
                    errorCode: "USER-NOT-FOUND"
                })
            }

        }
        else {
            res.status(401).json({
                status: "failed",
                message: "Token is not present",
                description: "Please provide a token",
                code: 401,
                errorCode: "TOKEN-NOT-FOUND"
            })
        }
    } catch (error) {

        if (error.name === "TokenExpiredError") {
            res.status(401).json({
                status: "failed",
                message: "Token Expired",
                description: "Please get a new accessToken using the refreshToken",
                code: 401,
                errorCode: "TOKEN-EXPIRED"
            })
        }

        res.status(500).json({
            status: "failed",
            message: "Internal Server Error",
            description: error,
            code: 500,
            errorCode: "AUTH-MID-ISE"
        })
    }
}