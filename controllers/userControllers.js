import { UserModel } from "../models/User.js"
import bcrypt from "bcrypt"
import { generateAccessToken, generateRefreshToken } from "./jwtController.js"
import jwt from "jsonwebtoken"

export const createNewUser = async (req, res) => {

    try {
        const { username, password, email, fullName, mobile } = req.body

        const existingUser = await UserModel.findOne({
            $or: [{ email }, { username }]
        })

        if (existingUser) {
            res.status(409).json({
                status: "failed",
                message: "Username or Email already exists.",
                desciption: "You can try with another username or email.",
                code: 409,
                errorCode: "USER-201-FAILED"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await UserModel.create({
            username,
            password: hashedPassword,
            email,
            fullName,
            mobile
        })

        // res.send("User has been created in the database")
        res.json({
            message: "User has been created"
        })
    } catch (error) {
        res.status(500).json({
            message: "There has been Internal Server Error : " + error
        })
    }

}

export const loginController = async (req, res) => {

    try {
        // Getting data from the client (POSTMAN/React)
        const {
            email,
            password
        } = req.body

        // Check wether email exists or not
        const existingUser = await UserModel.findOne({
            email
        })

        // How to check wether the user exists or not
        if (!existingUser) {
            res.status(409).json({
                status: "failed",
                message: "Email does not exists",
                description: "Try with some another email address",
                code: 409,
                errorCode: "USER-LOGIN-EMAIL"
            })
        }
        else {
            // Check the password
            const isPasswordValid = await bcrypt.compare(password, existingUser.password)

            if (isPasswordValid) {

                // Generating the access token
                const accessToken = await generateAccessToken(existingUser.id)

                // Generating the refresh token
                const refreshToken = await generateRefreshToken(existingUser.id)

                existingUser.refreshTokens.push(refreshToken)

                await existingUser.save()

                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "Strict", // Strict, Lax, None
                    maxAge: 1000 * 1 * 60 * 60 * 24 * 7
                })

                // Give the success response
                res.json({
                    status: "completed",
                    message: "User logged in",
                    description: "User email exists & password is matched with the hashed password",
                    code: 200,
                    data: {
                        accessToken
                    }
                })
            }
            else {

                // Give the error response for the wrong password
                res.status(401).json({
                    status: "failed",
                    message: "Password is Incorrect",
                    description: "Try with some another password",
                    code: 401,
                    errorCode: "USER-LOGIN-PASSWORD"
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Internal Server Error",
            description: error,
            code: 500,
            errorCode: "USER-LOGIN-ISR"
        })
    }

}

export const userLogoutController = async (req, res) => {

    const user = req.user

    const existingUser = await UserModel.findOne({
        _id: user._id
    })

    const { refreshToken } = req.cookies

    existingUser.refreshTokens = existingUser.refreshTokens.filter(dbRefreshToken => refreshToken !== dbRefreshToken)

    await existingUser.save()

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "Strict" // Strict, Lax, None
    })
    res.json({
        status: "completed",
        message: "User logged out",
        description: "",
        code: 200
    })
}

export const refreshTokenController = async (req, res) => {

    try {
        const { refreshToken } = req.cookies

        if (refreshToken) {
            //  Logical Part Here

            const decodedToken = await jwt.verify(refreshToken, process.env.jwt_refresh_token_secret)

            const existingUser = await UserModel.findOne({
                _id: decodedToken.id
            })

            if (existingUser) {

                if (existingUser.refreshTokens.includes(refreshToken)) {
                    const newAccessToken = await generateAccessToken(existingUser.id)

                    res.json({
                        status: "completed",
                        message: "New Access Token is Generated",
                        desciption: "",
                        code: 200,
                        data: {
                            accessToken: newAccessToken
                        }
                    })
                }
                else {
                    res.status(401).json({
                        status: "failed",
                        message: "Refresh Token is Not in DB",
                        desciption: "Your session is over. Please login again",
                        code: 401,
                        errorCode: "REFRESH-TOKEN-REMOVED"
                    })
                }
            }
            else {
                res.status(404).json({
                    status: "failed",
                    message: "User does not exists",
                    description: "You are not allowed to perform any operation as the user has been deleted from the database",
                    code: 404,
                    errorCode: "USER-REMOVED"
                })
            }

        }
        else {
            res.status(401).json({
                status: "failed",
                message: "Refresh Token is Not Found",
                description: "Please login to generate a new refreshToken",
                code: 401,
                errorCode: "REFRESH-EXPIRED"
            })
        }
    } catch (error) {

        if (error.name === "JsonWebTokenError") {
            res.status(401).json({
                status: "failed",
                message: "Authentication Error",
                description: "Something wrong with JWT",
                code: 401,
                errorCode: "REFRESH-EXPIRED"
            })
        }

        res.status(500).json({
            status: "failed",
            message: "Internal Server Error",
            description: error,
            code: 500,
            errorCode: "REFRESH-EXPIRED"
        })
    }

}

export const userProfileController = async (req, res) => {
    const user = req.user

    res.json({
        status: "completed",
        message: "User details fetch successfully",
        description: "",
        code: 200,
        data: user
    })

    res.send("Here are the user profile details")
}