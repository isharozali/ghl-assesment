/**
 * GHL API routes
 * @module routes/ghlRoutes
 */

const express = require("express");
const router = express.Router();
const { getCalendars, getContacts, getCampaigns } = require("../controller/ghl");
const { requireGhlToken } = require("../middleware/auth");

// Apply authentication middleware to all GHL API routes
router.use(requireGhlToken);

// GHL API endpoints
router.get("/calendars", getCalendars);
router.get("/contacts", getContacts);
router.get("/campaigns", getCampaigns);

module.exports = router;
