const express = require("express");
const authRoutes = require("./authRoutes");
const ghlRoutes = require("./ghlRoutes");

const router = express.Router();

// Mount auth routes under /auth
router.use("/auth", authRoutes);

// Mount GHL API routes under /api
router.use("/api", ghlRoutes);

module.exports = router; 