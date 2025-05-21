/**
 * GHL API Interface
 * Handles all GHL API operations (calendars, contacts, campaigns)
 * @module controller/ghl
 */

const { makeGhlRequest } = require("../services/authService");

/**
 * Get calendars from GHL API
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
exports.getCalendars = async (req, res) => {
  const { ghlToken, ghlLocationId } = req;

  try {
    const data = await makeGhlRequest("/calendars/", ghlToken, ghlLocationId);
    res.json(data);
  } catch (error) {
    console.error("Error fetching calendars:", error.message);
    res.status(error.status || 500).json({ 
      error: "Failed to fetch calendars",
      details: error.data || error.message 
    });
  }
};

/**
 * Get contacts from GHL API
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
exports.getContacts = async (req, res) => {
  const { ghlToken, ghlLocationId } = req;

  try {
    const data = await makeGhlRequest("/contacts/", ghlToken, ghlLocationId);
    res.json(data);
  } catch (error) {
    console.error("Error fetching contacts:", error.message);
    res.status(error.status || 500).json({ 
      error: "Failed to fetch contacts",
      details: error.data || error.message 
    });
  }
};

/**
 * Get campaigns from GHL API
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
exports.getCampaigns = async (req, res) => {
  const { ghlToken, ghlLocationId } = req;

  try {
    const data = await makeGhlRequest("/campaigns/", ghlToken, ghlLocationId);
    res.json(data);
  } catch (error) {
    console.error("Error fetching campaigns:", error.message);
    res.status(error.status || 500).json({ 
      error: "Failed to fetch campaigns",
      details: error.data || error.message 
    });
  }
}; 