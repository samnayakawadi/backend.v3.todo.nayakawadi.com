import mongoose from "mongoose";

export const connectDB = () => {

    const host = process.env.mongodb_host
    const database = process.env.mongodb_database
    const username = process.env.mongodb_username
    const password = encodeURIComponent(process.env.mongodb_password)
    const authDB = process.env.mongodb_authdb

    // const url = `mongodb://${host}/${database}`
    const url = `mongodb://${username}:${password}@${host}/${database}?authSource=${authDB}`

    mongoose.connect(url).then(res => {
        console.log("MongoDb Connected")
    }).catch(err => {
        console.log("MongoDb Disconnected with error : ", err)
    })
}