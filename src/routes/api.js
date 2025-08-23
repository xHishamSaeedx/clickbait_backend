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

// GET /api/url
router.get("/url", (req, res) => {
  // Array of possible redirect URLs
  const redirectUrls = [
    "https://www.google.com",
    "https://www.youtube.com",
    "https://www.github.com",
    "https://www.stackoverflow.com",
    "https://www.reddit.com",
    "https://www.wikipedia.org",
    "https://www.amazon.com",
    "https://www.netflix.com",
  ];

  // Randomly select a URL
  const randomUrl =
    redirectUrls[Math.floor(Math.random() * redirectUrls.length)];

  res.json({
    url: randomUrl,
    timestamp: new Date().toISOString(),
    totalUrls: redirectUrls.length,
  });
});

// GET /api/redirect-config
router.get("/redirect-config", (req, res) => {
  res.json({
    mandatory: true,
    maxRedirectsPerDay: 2,
    minTimeBetweenRedirects: 24, // hours
    enabled: true,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
