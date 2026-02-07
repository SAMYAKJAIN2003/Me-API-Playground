import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, '../../data/profile.db');

let db = null;

export function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

export function initializeDb() {
  const database = getDb();
  
  // Read and execute schema
  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
  database.exec(schema);
  
  console.log('✅ Database schema initialized');
  return database;
}

export function seedDb() {
  const database = getDb();
  
  // Check if already seeded
  const profileCount = database.prepare('SELECT COUNT(*) as count FROM profile').get();
  if (profileCount.count > 0) {
    console.log('ℹ️  Database already seeded, skipping...');
    return;
  }
  
  // Read and execute seed data
  const seed = readFileSync(join(__dirname, 'seed.sql'), 'utf-8');
  database.exec(seed);
  
  console.log('✅ Database seeded with initial data');
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
