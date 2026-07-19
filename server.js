// server.js
// ---------------------------------------------------------------------------
// Athenaeum backend — a small Express API backed by SQLite.
//
// Run with:  node server.js
// Then the front-end pages (in ../web) can talk to it at http://localhost:3001
// ---------------------------------------------------------------------------

const express = require("express");
const cors = require("cors");

const { router: authRouter, requireAuth } = require("./routes/auth");
const booksRouter = require("./routes/books");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());              // allow the static front-end (opened from file:// or another port) to call this API
app.use(express.json());      // parse JSON request bodies

// Public routes (no login required)
app.use("/api/auth", authRouter);

// Protected routes (require a valid session token)
app.use("/api/books", requireAuth, booksRouter);

// Simple health check
app.get("/api/health", (req, res) => res.json({ ok: true, message: "Athenaeum API is running." }));

app.listen(PORT, () => {
  console.log(`Athenaeum API listening on http://localhost:${PORT}`);
});
