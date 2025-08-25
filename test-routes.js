const express = require("express");
const app = express();

// Middleware
app.use(express.json());

// Simple test routes
app.post("/api/auth/login", (req, res) => {
  console.log("Login endpoint hit:", req.body);
  const { username, password } = req.body;
  
  // Use environment variables for credentials
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "password";
  
  if (username === adminUsername && password === adminPassword) {
    const token = 'token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.get("/api", (req, res) => {
  res.json({ message: "API is working!" });
});

app.listen(3001, () => {
  console.log("Test server running on port 3001");
  console.log("Test with: curl -X POST http://localhost:3001/api/auth/login -H 'Content-Type: application/json' -d '{\"username\":\"admin\",\"password\":\"password\"}'");
});
