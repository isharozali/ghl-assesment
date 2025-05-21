/**
 * GHL Configuration Schema
 * Stores GHL OAuth tokens and related configuration
 * @module schema/config
 */

const { Schema, model } = require("mongoose");

/**
 * GHL Configuration Schema
 * @typedef {Object} GhlConfig
 * @property {string} access_token - GHL access token
 * @property {string} token_type - Token type (usually "Bearer")
 * @property {number} expires_in - Token expiration time in seconds
 * @property {string} refresh_token - GHL refresh token
 * @property {string} scope - Granted OAuth scopes
 * @property {string} refreshTokenId - GHL refresh token ID
 * @property {string} userType - User type (e.g., "Location")
 * @property {string} companyId - GHL company ID
 * @property {string} locationId - GHL location ID
 * @property {string} userId - GHL user ID
 */
const configSchema = new Schema(
  {
    access_token: {
      type: String,
      required: true,
    },
    token_type: {
      type: String,
      required: true,
      default: "Bearer",
    },
    expires_in: {
      type: Number,
      required: true,
    },
    refresh_token: {
      type: String,
      required: true,
    },
    scope: {
      type: String,
      required: true,
    },
    refreshTokenId: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
    },
    companyId: {
      type: String,
      required: true,
    },
    locationId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { 
    timestamps: true,
    // Ensure only one config document exists
    collection: "ghl_config"
  }
);

// Create a compound index to ensure uniqueness
configSchema.index({ userId: 1, locationId: 1 }, { unique: true });

const Config = model("Config", configSchema);

module.exports = { Config }; 