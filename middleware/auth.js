/**
 * Authentication middleware for GHL token validation
 * @module middleware/auth
 */

const { Config } = require("../schema/config");

/**
 * Middleware to check for valid GHL token
 * If token exists, attaches it to request object and proceeds
 * If no token exists, returns 401 Unauthorized
 * 
 * @async
 * @function requireGhlToken
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 * @returns {Promise<void>}
 */
const requireGhlToken = async (req, res, next) => {
  try {
    const config = await Config.findOne();
    
    if (!config) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
        message: "Please authenticate with GHL first by visiting /auth/initiate"
      });
    }

    // Attach token and location ID to request object for use in route handlers
    req.ghlToken = config.access_token;
    req.ghlLocationId = config.locationId;
    next();
  } catch (err) {
    console.error("Config validation error:", err instanceof Error ? err.message : "Unknown error");
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: "Failed to validate GHL configuration"
    });
  }
};

module.exports = {
  requireGhlToken
}; 