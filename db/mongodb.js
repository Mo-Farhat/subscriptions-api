import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";
import { NODE_ENV } from "../config/env.js";

if (!DB_URI) {
    throw new Error('Please provide DB_URI in the environment variables')
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI)
        console.log('Database connected ' + NODE_ENV)
    } catch (error) {
        console.log('Database connection error', error)
    }
}

export default connectToDatabase;