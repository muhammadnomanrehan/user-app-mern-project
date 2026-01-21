
import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  const dbName = process.env.DB_NAME || "user_app";

  if (!uri) {
    console.warn("MONGO_URI not set in .env. Skipping DB connection.");
    return;
  }

  try {
    await mongoose.connect(uri, { dbName });
    console.log("MongodB connected");
  } catch (err) {
    console.error("MongodB connection error:", err.message);
    process.exit(1); 
  }
}
