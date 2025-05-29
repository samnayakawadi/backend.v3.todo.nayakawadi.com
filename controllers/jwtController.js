import jwt from "jsonwebtoken"

export const generateAccessToken = async (id) => {
    const accessToken = await jwt.sign({
        id
    }, process.env.jwt_access_token_secret, {
        expiresIn: '5m'
    })
    return accessToken
}

export const generateRefreshToken = async (id) => {
    const refreshToken = await jwt.sign({
        id
    }, process.env.jwt_refresh_token_secret, {
        expiresIn: '7d'
    })
    return refreshToken
}