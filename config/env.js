/**
 * Environment variable validation schema
 * @module config/env
 */

// Load environment variables from .env file
require("dotenv").config();

const { z } = require("zod");

/**
 * Environment variable schema definition
 */
const envSchema = z.object({
  // Server configuration
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.string().default("3000"),

  // MongoDB configuration
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  // GHL OAuth configuration
  GHL_CLIENT_ID: z.string().min(1, "GHL_CLIENT_ID is required"),
  GHL_CLIENT_SECRET: z.string().min(1, "GHL_CLIENT_SECRET is required"),
  GHL_REDIRECT_URI: z.string().url("GHL_REDIRECT_URI must be a valid URL"),
});

/**
 * Parse and validate environment variables
 */
const parsedEnv = envSchema.parse(process.env);

/**
 * Structured environment configuration
 */
const env = {
  server: {
    NODE_ENV: parsedEnv.NODE_ENV,
    PORT: parsedEnv.PORT,
  },
  database: {
    MONGODB_URI: parsedEnv.MONGODB_URI,
  },
  ghl: {
    GHL_CLIENT_ID: parsedEnv.GHL_CLIENT_ID,
    GHL_CLIENT_SECRET: parsedEnv.GHL_CLIENT_SECRET,
    GHL_REDIRECT_URI: parsedEnv.GHL_REDIRECT_URI,
  },
};

module.exports = env; 