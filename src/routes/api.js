const express = require("express");
const router = express.Router();
const { getFirestore, getAuth } = require("../config/firebase");

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

// GET /api/firebase-test
router.get("/firebase-test", async (req, res) => {
  try {
    const db = getFirestore();
    const auth = getAuth();

    // Test Firestore connection
    const testDoc = await db.collection("test").doc("connection").get();

    res.json({
      message: "Firebase connection successful!",
      firestore: "Connected",
      auth: "Connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Firebase test error:", error);
    res.status(500).json({
      error: "Firebase connection failed",
      message: error.message,
    });
  }
});

module.exports = router;
