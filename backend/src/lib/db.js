import mongoose from "mongoose";
import dotenv from "dotenv";
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Databse conncetd ", conn.connection.host);
  } catch (error) {
    console.log("MongoDB Not Connected");
  }
};
