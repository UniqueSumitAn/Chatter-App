// db.js
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI not set in environment variables");
}

// Cache connection (important for Vercel serverless)
let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null, logged: false };
}

async function connectDB() {
  if (cached.conn) {
    // Avoid duplicate logs
    if (!cached.logged) {
      console.log("📡 MongoDB already connected (cached)");
      cached.logged = true;
    }
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000, // for debugging
      })
      .then((mongooseInstance) => {
        console.log("✅ MongoDB Connected Successfully");
        cached.logged = true; // ensure log only once
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;
