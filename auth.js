// routes/auth.js
// ---------------------------------------------------------------------------
// Handles account creation, login, and session-token verification.
//
// Passwords are never stored in plain text — bcryptjs hashes them before
// they touch the database, and only the hash is saved. On login, the
// submitted password is re-hashed and compared to the stored hash.
//
// Sessions use a simple random token (not JWT) stored in a `sessions` table,
// mapped to a user_id. The front end stores this token and sends it back
// on every request in an `Authorization: Bearer <token>` header.
// ---------------------------------------------------------------------------

const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const db = require("../db");

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

// ---------------------------------------------------------------------------
// POST /api/auth/signup
// ---------------------------------------------------------------------------
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Name is required." });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "A valid email is required." });
  }
  if (!password || password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const passwordHash = bcrypt.hashSync(password, 10);

  const result = db
    .prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)")
    .run(name.trim(), email.toLowerCase(), passwordHash);

  const userId = result.lastInsertRowid;
  const token = generateToken();
  db.prepare("INSERT INTO sessions (token, user_id) VALUES (?, ?)").run(token, userId);

  return res.status(201).json({
    token,
    user: { id: userId, name: name.trim(), email: email.toLowerCase() },
  });
});

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------
router.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    // Deliberately vague — never reveal whether the email or the password
    // was the specific thing that was wrong.
    return res.status(400).json({ error: "Invalid email or password." });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const passwordMatches = bcrypt.compareSync(password, user.password_hash);
  if (!passwordMatches) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const token = generateToken();
  db.prepare("INSERT INTO sessions (token, user_id) VALUES (?, ?)").run(token, user.id);

  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// ---------------------------------------------------------------------------
// POST /api/auth/logout
// ---------------------------------------------------------------------------
router.post("/logout", (req, res) => {
  const token = extractToken(req);
  if (token) {
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
  }
  return res.json({ ok: true });
});

// ---------------------------------------------------------------------------
// GET /api/auth/me — returns the currently logged-in user, if any
// ---------------------------------------------------------------------------
router.get("/me", (req, res) => {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: "Not signed in." });

  const session = db
    .prepare(
      `SELECT users.id, users.name, users.email
       FROM sessions JOIN users ON users.id = sessions.user_id
       WHERE sessions.token = ?`
    )
    .get(token);

  if (!session) return res.status(401).json({ error: "Session expired or invalid." });

  return res.json({ user: session });
});

// ---------------------------------------------------------------------------
// Helper: extract "Authorization: Bearer <token>" from the request
// ---------------------------------------------------------------------------
function extractToken(req) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme === "Bearer" && token) return token;
  return null;
}

// ---------------------------------------------------------------------------
// Middleware: protects a route, requiring a valid session token.
// Attaches req.user = { id, name, email } when valid.
// ---------------------------------------------------------------------------
function requireAuth(req, res, next) {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: "Sign in required." });

  const session = db
    .prepare(
      `SELECT users.id, users.name, users.email
       FROM sessions JOIN users ON users.id = sessions.user_id
       WHERE sessions.token = ?`
    )
    .get(token);

  if (!session) return res.status(401).json({ error: "Session expired or invalid. Please sign in again." });

  req.user = session;
  next();
}

module.exports = { router, requireAuth };
