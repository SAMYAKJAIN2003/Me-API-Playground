import { initializeDb, seedDb } from './database.js';
import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure data directory exists
const dataDir = join(__dirname, '../../data');
mkdirSync(dataDir, { recursive: true });

console.log('🔧 Initializing database...');
initializeDb();
seedDb();
console.log('🎉 Database setup complete!');
