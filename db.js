// db.js
// ---------------------------------------------------------------------------
// Database layer for the Athenaeum backend.
//
// Uses Node's built-in `node:sqlite` module (available from Node 22.5+),
// so there is no native module to compile and no extra database server to
// install or run — the entire database lives in a single file on disk
// (athenaeum.db), just like the C++ console app's library_data.txt, but as
// a real relational database with proper tables, constraints, and SQL.
// ---------------------------------------------------------------------------

const { DatabaseSync } = require("node:sqlite");
const path = require("path");

const DB_PATH = path.join(__dirname, "athenaeum.db");
const db = new DatabaseSync(DB_PATH);

// Enable foreign key enforcement (off by default in SQLite).
db.exec("PRAGMA foreign_keys = ON;");

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    token      TEXT PRIMARY KEY,
    user_id    INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    title            TEXT NOT NULL,
    author           TEXT NOT NULL,
    isbn             TEXT NOT NULL UNIQUE,
    total_qty        INTEGER NOT NULL,
    available_qty    INTEGER NOT NULL,
    created_by       INTEGER,
    created_at       TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
  );
`);

module.exports = db;
