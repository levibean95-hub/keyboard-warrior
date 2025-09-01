import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const sqlite = sqlite3.verbose();
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database.db');

let db: sqlite3.Database;

export const setupDatabase = (): void => {
  // Ensure directory exists
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new sqlite.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err);
      process.exit(1);
    }
    console.log('Connected to SQLite database');
    createTables();
  });
};

const createTables = (): void => {
  const argumentsTable = `
    CREATE TABLE IF NOT EXISTS arguments (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      title TEXT NOT NULL,
      context TEXT NOT NULL,
      tone TEXT NOT NULL,
      style_examples TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const responsesTable = `
    CREATE TABLE IF NOT EXISTS responses (
      id TEXT PRIMARY KEY,
      argument_id TEXT NOT NULL,
      content TEXT NOT NULL,
      tone TEXT NOT NULL,
      generated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      password_hash TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create tables in sequence
  db.serialize(() => {
    db.run(argumentsTable, (err) => {
      if (err) console.error('Error creating arguments table:', err);
      else console.log('Arguments table ready');
    });

    db.run(responsesTable, (err) => {
      if (err) console.error('Error creating responses table:', err);
      else console.log('Responses table ready');
    });

    db.run(usersTable, (err) => {
      if (err) console.error('Error creating users table:', err);
      else console.log('Users table ready');
    });

    // Create indexes after tables are created
    db.run('CREATE INDEX IF NOT EXISTS idx_arguments_user_id ON arguments(user_id)', (err) => {
      if (err) console.error('Error creating arguments index:', err);
    });
    
    db.run('CREATE INDEX IF NOT EXISTS idx_responses_argument_id ON responses(argument_id)', (err) => {
      if (err) console.error('Error creating responses index:', err);
    });
  });
};

export const getDatabase = (): sqlite3.Database => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

export const closeDatabase = (): void => {
  if (db) {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed');
      }
    });
  }
};