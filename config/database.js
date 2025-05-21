/**
 * Database configuration and connection module
 * @module config/database
 */

const mongoose = require("mongoose");
const env = require("./env");

/**
 * MongoDB connection options
 * @type {Object}
 */
const MONGODB_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

/**
 * Establishes connection to MongoDB using validated environment variables
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 * @throws {Error} If MongoDB connection fails
 */
const connectDB = async () => {
  try {
    // Using validated environment variable
    const mongoUri = env.database.MONGODB_URI;

    await mongoose.connect(mongoUri, MONGODB_OPTIONS);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err instanceof Error ? err.message : "Unknown error");
    // Exit with failure
    process.exit(1);
  }
};

module.exports = connectDB; 