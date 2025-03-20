import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI not .env");
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "coderDev",
        });

        console.log("Mongodb Connected");
    } catch (error) {
        console.error("Error Connection:", error.message);
        process.exit(1);
    }
};

export default connectDB;
