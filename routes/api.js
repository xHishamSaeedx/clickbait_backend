const express = require("express");
const router = express.Router();

// GET /api
router.get("/", (req, res) => {
  res.json({ message: "API is working!" });
});

// GET /api/status
router.get("/status", (req, res) => {
  res.json({
    status: "running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

module.exports = router;
