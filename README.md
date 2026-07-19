# Athenaeum — Library Management System

A library management system with three parts: a console-based C++ application, a small Node.js + SQLite backend, and a set of front-end pages that talk to that backend for real, persistent data.

## Contents

```
├── src/
│   └── LibraryManagementSystem.cpp   # Standalone C++ console application
├── server/
│   ├── server.js                     # Express API entry point
│   ├── db.js                         # SQLite schema (users, sessions, books)
│   ├── backup.js                     # One-command database backup script
│   ├── routes/
│   │   ├── auth.js                   # Signup / login / logout / session check
│   │   └── books.js                  # Book CRUD + issue/return
│   └── package.json
├── web/
│   ├── index.html                    # Marketing / landing homepage
│   ├── athenaeum-login.html          # Sign in (calls the real backend)
│   ├── athenaeum-signup.html         # Create account (calls the real backend)
│   ├── athenaeum-library.html        # Catalog UI (calls the real backend)
│   ├── athenaeum-terms.html          # Terms of Service
│   └── athenaeum-privacy.html        # Privacy Policy
└── docs/
    └── Final_report_LMS.pdf          # Full project report
```

## Two independent implementations

This repo actually contains **two separate ways to manage a library**, built to demonstrate the same core logic at two different layers:

1. **`src/LibraryManagementSystem.cpp`** — a self-contained C++ console app. Stores data in a local `library_data.txt` file. Fully independent of everything else in this repo — just compile and run it.
2. **`server/` + `web/`** — a real client-server web app. The `web/` pages are the UI; `server/` is a Node.js API backed by a SQLite database, so accounts and books persist permanently.

These two do **not** share data — they're separate demonstrations of the same problem.

## Running the C++ application

```bash
g++ -std=c++17 -O2 -Wall -o library src/LibraryManagementSystem.cpp
./library
```

## Running the web app (backend + front end)

### 1. Start the backend

Requires **Node.js 22 or newer** (for the built-in `node:sqlite` module — check with `node --version`).

```bash
cd server
npm install
node server.js
```

Leave this running — it serves the API at `http://localhost:3001`. The database file `athenaeum.db` is created automatically on first run, right there in the `server/` folder.

### 2. Open the front end

Open `web/athenaeum-signup.html` in your browser, create an account, and you'll be redirected into the catalog. From there:

- Add, search, sort, issue, and return books — every change is saved to the real database immediately
- Refreshing the page, closing the browser, or restarting the server does **not** lose your data
- Click "Log out" in the catalog header to end your session

### Backing up your data

The entire database is a single file: `server/athenaeum.db`. To back it up:

```bash
cd server
node backup.js
```

This copies the database into `server/backups/` with a timestamp, keeping the 20 most recent snapshots automatically. You can also just copy `athenaeum.db` anywhere manually (a USB drive, cloud storage folder, etc.) — it's a complete, self-contained snapshot of everything.

## API overview

| Method | Route                     | Auth required | Description              |
|--------|----------------------------|:--:|---------------------------|
| POST   | `/api/auth/signup`         | No | Create an account          |
| POST   | `/api/auth/login`          | No | Sign in, get a session token |
| POST   | `/api/auth/logout`         | Yes | End the current session   |
| GET    | `/api/auth/me`             | Yes | Get the current user       |
| GET    | `/api/books`                | Yes | List all books             |
| POST   | `/api/books`                | Yes | Add a book                 |
| DELETE | `/api/books/:id`            | Yes | Remove a book              |
| POST   | `/api/books/:id/issue`      | Yes | Issue one copy             |
| POST   | `/api/books/:id/return`     | Yes | Return one copy            |

Authenticated requests need an `Authorization: Bearer <token>` header, using the token returned from signup/login.

## Security notes

- Passwords are hashed with bcrypt before being stored — the plain-text password is never saved
- Login failures return a generic "Invalid email or password" message, without revealing which field was wrong
- Session tokens are random 256-bit values, stored server-side in a `sessions` table

## Report

`docs/Final_report_LMS.pdf` contains the full project write-up: abstract, objectives, system design, architecture diagram, testing, and results.

## License

Add a license of your choice (e.g. MIT) if you plan to make this public.
