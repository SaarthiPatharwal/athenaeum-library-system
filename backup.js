// backup.js
// ---------------------------------------------------------------------------
// Creates a timestamped copy of athenaeum.db inside a "backups" folder.
//
// Run it with:   node backup.js
//
// Each run creates a new file like:  backups/athenaeum-2026-07-16_18-30-05.db
// Nothing is ever overwritten, so you build up a history of snapshots you
// can restore from if anything ever gets corrupted or deleted by mistake.
// ---------------------------------------------------------------------------

const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "athenaeum.db");
const BACKUP_DIR = path.join(__dirname, "backups");

if (!fs.existsSync(DB_PATH)) {
  console.error("No athenaeum.db found yet — run the server and add some data first.");
  process.exit(1);
}

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

// Build a filesystem-safe timestamp, e.g. 2026-07-16_18-30-05
const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const timestamp =
  `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
  `_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

const backupPath = path.join(BACKUP_DIR, `athenaeum-${timestamp}.db`);

fs.copyFileSync(DB_PATH, backupPath);

console.log(`Backup created: backups/athenaeum-${timestamp}.db`);

// Optional housekeeping: keep only the 20 most recent backups so the folder
// doesn't grow forever. Comment this block out if you'd rather keep everything.
const files = fs
  .readdirSync(BACKUP_DIR)
  .filter((f) => f.startsWith("athenaeum-") && f.endsWith(".db"))
  .map((f) => ({ name: f, time: fs.statSync(path.join(BACKUP_DIR, f)).mtimeMs }))
  .sort((a, b) => b.time - a.time);

const MAX_BACKUPS = 20;
if (files.length > MAX_BACKUPS) {
  const toDelete = files.slice(MAX_BACKUPS);
  toDelete.forEach((f) => fs.unlinkSync(path.join(BACKUP_DIR, f.name)));
  console.log(`Cleaned up ${toDelete.length} old backup(s), keeping the most recent ${MAX_BACKUPS}.`);
}
