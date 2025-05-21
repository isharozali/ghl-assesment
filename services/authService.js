/**
 * GHL Authentication Service
 * Handles all GHL OAuth and API authentication operations
 * @module services/authService
 */

const axios = require("axios");
const env = require("../config/env");
console.log(env, "env");

/**
 * GHL API Configuration
 * @type {Object}
 */
const config = {
    redirectUri: env.ghl.GHL_REDIRECT_URI,
    clientId: env.ghl.GHL_CLIENT_ID,
    clientSecret: env.ghl.GHL_CLIENT_SECRET,
    apiBaseUrl: "https://services.leadconnectorhq.com",
    authBaseUrl: "https://marketplace.leadconnectorhq.com",
};

// Validate required configuration
const missingConfig = Object.entries(config)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

if (missingConfig.length > 0) {
    throw new Error(
        `Missing required GHL configuration: ${missingConfig.join(", ")}`
    );
}

/**
 * Makes an authenticated request to the GHL API
 * @param {string} endpoint - The GHL API endpoint (e.g., '/calendars/')
 * @param {string} accessToken - The GHL access token
 * @param {string} locationId - The GHL location ID
 * @returns {Promise<object>} The API response data
 */
async function makeGhlRequest(endpoint, accessToken, locationId) {
    try {
        const { data } = await axios({
            method: "GET",
            url: `${config.apiBaseUrl}${endpoint}`,
            params: { locationId },
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${accessToken}`,
                Version: "2021-04-15",
            },
        });
        return data;
    } catch (error) {
        const enhancedError = new Error(
            `GHL API request failed: ${error.response?.data?.message || error.message}`
        );
        enhancedError.status = error.response?.status;
        enhancedError.data = error.response?.data;
        throw enhancedError;
    }
}

/**
 * Exchanges an authorization code for tokens
 * @param {string} code - The authorization code
 * @returns {Promise<object>} Token response
 */
async function exchangeCodeForToken(code) {
    try {
        const body = {
            client_id: config.clientId,
            client_secret: config.clientSecret,
            grant_type: "authorization_code",
            code,
            user_type: "Location",
            redirect_uri: config.redirectUri,
        };

        const { data: tokenData } = await axios({
            method: "POST",
            url: `${config.apiBaseUrl}/oauth/token`,
            data: body,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        return tokenData;
    } catch (error) {
        const enhancedError = new Error(
            `Token exchange failed: ${error.response?.data?.error_description || error.message}`
        );
        enhancedError.status = error.response?.status;
        enhancedError.data = error.response?.data?.error_description;
        throw enhancedError;
    }
}

/**
 * Refreshes an access token using a refresh token
 * @param {string} refreshToken - The refresh token
 * @returns {Promise<object>} Token response
 */
async function refreshAccessToken(refreshToken) {
    try {
        const body = {
            client_id: config.clientId,
            client_secret: config.clientSecret,
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            user_type: "Location",
            redirect_uri: config.redirectUri,
        };

        const { data: tokenData } = await axios({
            method: "POST",
            url: `${config.apiBaseUrl}/oauth/token`,
            data: body,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        return tokenData;
    } catch (error) {
        const enhancedError = new Error(
            `Token refresh failed: ${error.response?.data?.error_description || error.message}`
        );
        enhancedError.status = error.response?.status;
        enhancedError.data = error.response?.data?.error_description;
        throw enhancedError;
    }
}

/**
 * Builds the GHL OAuth authorization URL
 * @param {string[]} scopes - Array of OAuth scopes
 * @returns {string} Authorization URL
 */
function buildAuthUrl(scopes) {
    return `${config.authBaseUrl} / oauth / chooselocation ? response_type = code & redirect_uri=${encodeURIComponent(config.redirectUri)
        }& client_id=${config.clientId}& scope=${encodeURIComponent(scopes.join(" "))} `;
}

module.exports = {
    getGhlConfig: () => config,
    buildAuthUrl,
    exchangeCodeForToken,
    refreshAccessToken,
    makeGhlRequest,
}; 