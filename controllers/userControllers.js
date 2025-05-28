import { UserModel } from "../models/User.js"

export const createNewUser = async (req, res) => {

    try {
        const { username, password, email, fullName, mobile } = req.body

        const existingUser = await UserModel.findOne({
            $or: [{ email }, { username }]
        })

        if (existingUser) {
            res.status(409).json({
                message: "Username or Email already exists. Please try with the new username"
            })
        }

        const newUser = await UserModel.create({
            username,
            password,
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