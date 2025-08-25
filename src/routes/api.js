const express = require("express");
const router = express.Router();

// Import Firebase with error handling
let getFirestore, getAuth;
try {
  const firebase = require("../config/firebase");
  getFirestore = firebase.getFirestore;
  getAuth = firebase.getAuth;
} catch (error) {
  console.warn("⚠️ Firebase not available, some features may be limited");
  getFirestore = () => null;
  getAuth = () => null;
}

// Simple JWT-like token generation
function generateToken() {
  return 'token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

// POST /api/auth/login
router.post("/auth/login", (req, res) => {
  console.log("Login attempt:", req.body);
  const { username, password } = req.body;
  
  // Use environment variables for credentials
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "password";
  
  console.log("Expected credentials:", { adminUsername, adminPassword: adminPassword ? "***" : "undefined" });
  
  if (username === adminUsername && password === adminPassword) {
    const token = generateToken();
    console.log("Login successful, token generated");
    res.json({ token });
  } else {
    console.log("Login failed: invalid credentials");
    res.status(401).json({ error: "Invalid credentials" });
  }
});

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

// In-memory storage for URLs (replace with database later)
let urls = [
  { id: '1', url: 'https://www.google.com', active: true },
  { id: '2', url: 'https://www.youtube.com', active: true },
  { id: '3', url: 'https://www.github.com', active: false }
];

// Simple auth middleware
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  // For now, accept any Bearer token
  next();
}

// GET /api/urls
router.get("/urls", requireAuth, (req, res) => {
  res.json(urls);
});

// POST /api/urls
router.post("/urls", requireAuth, (req, res) => {
  const { url, active } = req.body;
  const newUrl = {
    id: Date.now().toString(),
    url,
    active: active !== undefined ? active : true
  };
  urls.push(newUrl);
  res.json(newUrl);
});

// PATCH /api/urls/:id
router.patch("/urls/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const { url, active } = req.body;
  
  const urlIndex = urls.findIndex(u => u.id === id);
  if (urlIndex === -1) {
    return res.status(404).json({ error: 'URL not found' });
  }
  
  if (url !== undefined) urls[urlIndex].url = url;
  if (active !== undefined) urls[urlIndex].active = active;
  
  res.json(urls[urlIndex]);
});

// DELETE /api/urls/:id
router.delete("/urls/:id", requireAuth, (req, res) => {
  const { id } = req.params;
  const urlIndex = urls.findIndex(u => u.id === id);
  
  if (urlIndex === -1) {
    return res.status(404).json({ error: 'URL not found' });
  }
  
  urls.splice(urlIndex, 1);
  res.json({ success: true });
});

module.exports = router;
