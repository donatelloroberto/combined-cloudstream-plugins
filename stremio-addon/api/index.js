/**
 * Vercel serverless entry point for the Stremio addon.
 * This file re-exports the addon interface for serverless deployment.
 */

const { addonBuilder } = require("stremio-addon-sdk");

// Re-use the same builder from server.js by requiring it.
// For Vercel, we export a handler function instead of calling serveHTTP.
const { getRouter } = require("stremio-addon-sdk");

// Load the addon definition (same as server.js but without serveHTTP)
const serverModule = require("../server");

module.exports = serverModule;
