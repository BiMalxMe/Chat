import mongoose from "mongoose";
import { ENV } from "./env.js";

// This variable persists across requests in the same Vercel container
let isConnected = false; 

export const connectDB = async () => {
  // 1. Prevent multiple heartbeat connections
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  try {
    const { MONGO_URI } = ENV;
    if (!MONGO_URI) throw new Error("MONGO_URI is not set");

    // 2. Set connection options for Serverless
    const db = await mongoose.connect(MONGO_URI, {
      bufferCommands: false, // Prevents the 10s "buffering timeout" error
    });

    isConnected = db.connections[0].readyState;
    console.log("MONGODB CONNECTED:", db.connection.host);
  } catch (error) {
    console.error("Error connection to MONGODB:", error.message);
    // 3. DO NOT use process.exit(1) in Vercel. 
    // It kills the function instance and results in a 500 error for the user.
    throw error; 
  }
};