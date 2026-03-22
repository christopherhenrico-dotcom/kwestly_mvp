import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function initDb() {
  const db = new Database(join(__dirname, '../../data/kwestly.db'));
  
  db.pragma('journal_mode = WAL');

  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      github_id TEXT,
      github_username TEXT,
      avatar_url TEXT,
      execution_score INTEGER DEFAULT 0,
      total_earned REAL DEFAULT 0,
      quests_completed INTEGER DEFAULT 0,
      rank TEXT DEFAULT 'bronze',
      wallet_address TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Quests table
  db.exec(`
    CREATE TABLE IF NOT EXISTS quests (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      bounty REAL NOT NULL,
      difficulty TEXT DEFAULT 'easy',
      min_score INTEGER DEFAULT 0,
      ttl_hours INTEGER DEFAULT 4,
      status TEXT DEFAULT 'open',
      poster_id TEXT NOT NULL,
      worker_id TEXT,
      accepted_at TEXT,
      expires_at TEXT,
      submission_url TEXT,
      submission_notes TEXT,
      submitted_at TEXT,
      reviewed_at TEXT,
      payment_tx TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (poster_id) REFERENCES users(id),
      FOREIGN KEY (worker_id) REFERENCES users(id)
    )
  `);

  // Submissions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      quest_id TEXT NOT NULL,
      worker_id TEXT NOT NULL,
      submission_type TEXT DEFAULT 'pr_link',
      pr_url TEXT,
      notes TEXT,
      status TEXT DEFAULT 'pending',
      reviewed_by TEXT,
      reviewed_at TEXT,
      rejection_reason TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quest_id) REFERENCES quests(id),
      FOREIGN KEY (worker_id) REFERENCES users(id),
      FOREIGN KEY (reviewed_by) REFERENCES users(id)
    )
  `);

  // Transactions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      quest_id TEXT,
      worker_id TEXT NOT NULL,
      amount REAL NOT NULL,
      tx_hash TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quest_id) REFERENCES quests(id),
      FOREIGN KEY (worker_id) REFERENCES users(id)
    )
  `);

  // Notifications table
  db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT DEFAULT 'system',
      title TEXT NOT NULL,
      message TEXT,
      read INTEGER DEFAULT 0,
      link TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_quests_status ON quests(status);
    CREATE INDEX IF NOT EXISTS idx_quests_worker ON quests(worker_id);
    CREATE INDEX IF NOT EXISTS idx_quests_poster ON quests(poster_id);
    CREATE INDEX IF NOT EXISTS idx_submissions_quest ON submissions(quest_id);
    CREATE INDEX IF NOT EXISTS idx_submissions_worker ON submissions(worker_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_worker ON transactions(worker_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
  `);

  console.log('Database initialized');
  return db;
}
