const express = require("express");
const router = express.Router();

// Import Firebase with error handling
let db;
try {
  const firebase = require("../config/firebase");
  db = firebase.db;
} catch (error) {
  console.warn("⚠️ Firebase not available, some features may be limited");
  db = null;
}

// Simple JWT-like token generation
function generateToken() {
  return "token_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
}

// POST /api/auth/login
router.post("/auth/login", (req, res) => {
  console.log("Login attempt:", req.body);
  const { username, password } = req.body;

  // Use environment variables for credentials
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "password";

  console.log("Expected credentials:", {
    adminUsername,
    adminPassword: adminPassword ? "***" : "undefined",
  });

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
    if (!db) {
      return res.status(500).json({ error: "Firebase not available" });
    }

    // Test Firestore connection
    const testDoc = await db.collection("test").doc("connection").get();

    res.json({
      message: "Firebase connection successful!",
      firestore: "Connected",
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
router.get("/url", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Firebase not available" });
    }

    // Fetch all documents from the "urls" collection
    const urlsSnapshot = await db.collection("urls").get();

    if (urlsSnapshot.empty) {
      return res.status(404).json({ error: "No URLs found in Firestore" });
    }

    // Convert to array and pick one at random
    const urls = [];
    urlsSnapshot.forEach((doc) => {
      urls.push({ id: doc.id, ...doc.data() });
    });

    const randomUrl = urls[Math.floor(Math.random() * urls.length)];

    res.json({
      url: randomUrl.url,
      timestamp: new Date().toISOString(),
      totalUrls: urls.length,
    });
  } catch (error) {
    console.error("Error fetching URL from Firestore:", error);
    res.status(500).json({ error: "Failed to fetch URL from database" });
  }
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

// Simple auth middleware
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "unauthorized" });
  }
  // For now, accept any Bearer token
  next();
}

// GET /api/urls - Return all URLs with their document IDs
router.get("/urls", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Firebase not available" });
    }

    const urlsSnapshot = await db.collection("urls").get();
    const urls = [];
    urlsSnapshot.forEach((doc) => {
      urls.push({ id: doc.id, ...doc.data() });
    });

    res.json(urls);
  } catch (error) {
    console.error("Error fetching URLs:", error);
    res.status(500).json({ error: "Failed to fetch URLs" });
  }
});

// POST /api/urls - Add a new URL
router.post("/urls", requireAuth, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Firebase not available" });
    }

    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const newUrl = {
      url,
      active: true,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("urls").add(newUrl);
    const createdUrl = { id: docRef.id, ...newUrl };

    res.status(201).json(createdUrl);
  } catch (error) {
    console.error("Error creating URL:", error);
    res.status(500).json({ error: "Failed to create URL" });
  }
});

// PUT /api/urls/:id - Update a URL by document ID
router.put("/urls/:id", requireAuth, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Firebase not available" });
    }

    const { id } = req.params;
    const { url, active } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const urlRef = db.collection("urls").doc(id);
    const urlDoc = await urlRef.get();

    if (!urlDoc.exists) {
      return res.status(404).json({ error: "URL not found" });
    }

    const updateData = {
      url,
      updatedAt: new Date().toISOString(),
    };

    if (active !== undefined) {
      updateData.active = active;
    }

    await urlRef.update(updateData);

    const updatedDoc = await urlRef.get();
    const updatedUrl = { id: updatedDoc.id, ...updatedDoc.data() };

    res.json(updatedUrl);
  } catch (error) {
    console.error("Error updating URL:", error);
    res.status(500).json({ error: "Failed to update URL" });
  }
});

// DELETE /api/urls/:id - Delete a URL by document ID
router.delete("/urls/:id", requireAuth, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: "Firebase not available" });
    }

    const { id } = req.params;
    const urlRef = db.collection("urls").doc(id);
    const urlDoc = await urlRef.get();

    if (!urlDoc.exists) {
      return res.status(404).json({ error: "URL not found" });
    }

    await urlRef.delete();
    res.json({ success: true, message: "URL deleted successfully" });
  } catch (error) {
    console.error("Error deleting URL:", error);
    res.status(500).json({ error: "Failed to delete URL" });
  }
});

module.exports = router;
