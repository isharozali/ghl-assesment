/**
 * GHL Authentication Controller
 * @module controller/auth
 */

const { buildAuthUrl, exchangeCodeForToken, refreshAccessToken } = require("../services/authService");
const { Config } = require("../schema/config");

/**
 * Initiates GHL OAuth flow by redirecting to the authorization URL.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
function initiateAuth(req, res) {
  const scopes = [
    "calendars.readonly",
    "campaigns.readonly",
    "contacts.readonly"
  ];
  const authUrl = buildAuthUrl(scopes);
  return res.redirect(authUrl);
}

/**
 * Handles the OAuth callback, exchanges code for tokens, and saves them.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function callback(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({
      error: "Missing 'code' parameter in query.",
      received: req.query,
    });
  }

  try {
    const tokenResponse = await exchangeCodeForToken(code);

    if (tokenResponse.userId && tokenResponse.locationId) {
      await Config.deleteOne({
        userId: tokenResponse.userId,
        locationId: tokenResponse.locationId
      });
    }

    const newConfig = new Config({
      access_token: tokenResponse.access_token,
      token_type: tokenResponse.token_type,
      expires_in: tokenResponse.expires_in,
      refresh_token: tokenResponse.refresh_token,
      scope: tokenResponse.scope,
      refreshTokenId: tokenResponse.refreshTokenId,
      userType: tokenResponse.userType,
      companyId: tokenResponse.companyId,
      locationId: tokenResponse.locationId,
      userId: tokenResponse.userId,
    });

    await newConfig.save();
    console.log("GHL configuration saved to MongoDB");
    return res.json({ config: newConfig });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to exchange authorization code",
      details: error.data || error.message,
    });
  }
}

/**
 * Handles token refresh requests.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function refreshToken(req, res) {
  try {
    const config = await Config.findOne({});
    const tokenResponse = await refreshAccessToken(config.refresh_token);
    // Update existing config with new tokens
    if (config) {
      config.access_token = tokenResponse.access_token;
      config.token_type = tokenResponse.token_type;
      config.expires_in = tokenResponse.expires_in;
      config.refresh_token = tokenResponse.refresh_token;
      config.scope = tokenResponse.scope;
      await config.save();
      console.log("GHL configuration updated in MongoDB");
    }

    return res.json({ config: tokenResponse });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to refresh token",
      details: error.response?.data || error.message,
    });
  }
}

module.exports = {
  initiateAuth,
  callback,
  refreshToken,
}; 