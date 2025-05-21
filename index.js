/**
 * Main application entry point
 * @module index
 */

const express = require("express");
const connectDB = require("./config/database");
const router = require("./routes");
const env = require("./config/env");

const app = express();

// Mount the combined router (which internally mounts /auth and /api)
app.use(router);

// Using validated environment variables
const port = env.server.PORT;
const nodeEnv = env.server.NODE_ENV;

app.listen(port, () => {
  console.log(`OAuth App Listening on http://localhost:${port} in ${nodeEnv} mode`);
  connectDB();
});
