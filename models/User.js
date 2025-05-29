import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "This field is required"],
        unique: [true, "This field is unique"],
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        lowercase: true
    },
    fullName: String,
    mobile: String,
    refreshTokens: [String]
}, {
    timestamps: true
})

export const UserModel = mongoose.model("users", userSchema)