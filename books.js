// routes/books.js
// ---------------------------------------------------------------------------
// All book operations. Every route here requires a valid session token
// (enforced by the requireAuth middleware, wired up in server.js), so only
// signed-in users can view or modify the catalog.
// ---------------------------------------------------------------------------

const express = require("express");
const db = require("../db");

const router = express.Router();

// ---------------------------------------------------------------------------
// GET /api/books — list the full catalog
// ---------------------------------------------------------------------------
router.get("/", (req, res) => {
  const books = db
    .prepare("SELECT * FROM books ORDER BY title COLLATE NOCASE ASC")
    .all();
  return res.json({ books });
});

// ---------------------------------------------------------------------------
// POST /api/books — add a new book
// body: { title, author, isbn, quantity }
// ---------------------------------------------------------------------------
router.post("/", (req, res) => {
  const { title, author, isbn, quantity } = req.body || {};

  if (!title || !title.trim() || !author || !author.trim() || !isbn || !isbn.trim()) {
    return res.status(400).json({ error: "Title, author, and ISBN are required." });
  }
  const qty = parseInt(quantity, 10);
  if (!Number.isFinite(qty) || qty < 1) {
    return res.status(400).json({ error: "Quantity must be a whole number of at least 1." });
  }

  const existing = db.prepare("SELECT id FROM books WHERE isbn = ?").get(isbn.trim());
  if (existing) {
    return res.status(409).json({ error: `A book with ISBN ${isbn} already exists.` });
  }

  const result = db
    .prepare(
      `INSERT INTO books (title, author, isbn, total_qty, available_qty, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(title.trim(), author.trim(), isbn.trim(), qty, qty, req.user.id);

  const book = db.prepare("SELECT * FROM books WHERE id = ?").get(result.lastInsertRowid);
  return res.status(201).json({ book });
});

// ---------------------------------------------------------------------------
// DELETE /api/books/:id — remove a book by its internal ID
// ---------------------------------------------------------------------------
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existing = db.prepare("SELECT id FROM books WHERE id = ?").get(id);
  if (!existing) return res.status(404).json({ error: "Book not found." });

  db.prepare("DELETE FROM books WHERE id = ?").run(id);
  return res.json({ ok: true });
});

// ---------------------------------------------------------------------------
// POST /api/books/:id/issue — issue one copy
// ---------------------------------------------------------------------------
router.post("/:id/issue", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const book = db.prepare("SELECT * FROM books WHERE id = ?").get(id);
  if (!book) return res.status(404).json({ error: "Book not found." });

  if (book.available_qty <= 0) {
    return res.status(409).json({ error: "No copies of this book are currently available." });
  }

  db.prepare("UPDATE books SET available_qty = available_qty - 1 WHERE id = ?").run(id);
  const updated = db.prepare("SELECT * FROM books WHERE id = ?").get(id);
  return res.json({ book: updated });
});

// ---------------------------------------------------------------------------
// POST /api/books/:id/return — return one copy
// ---------------------------------------------------------------------------
router.post("/:id/return", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const book = db.prepare("SELECT * FROM books WHERE id = ?").get(id);
  if (!book) return res.status(404).json({ error: "Book not found." });

  if (book.available_qty >= book.total_qty) {
    return res.status(409).json({ error: "All copies of this book are already on the shelf." });
  }

  db.prepare("UPDATE books SET available_qty = available_qty + 1 WHERE id = ?").run(id);
  const updated = db.prepare("SELECT * FROM books WHERE id = ?").get(id);
  return res.json({ book: updated });
});

module.exports = router;
