const express = require("express");
const { initiateAuth, callback, refreshToken } = require("../controller/auth");

const router = express.Router();

router.get("/initiate", initiateAuth);
router.get("/callback", callback);
router.get("/refresh", refreshToken);

module.exports = router; 