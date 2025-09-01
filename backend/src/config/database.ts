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
  const conversationsTable = `
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      title TEXT,
      context TEXT NOT NULL,
      tone TEXT NOT NULL,
      current_tone TEXT,
      style_examples TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const messagesTable = `
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('user', 'opponent')),
      content TEXT NOT NULL,
      generated_responses TEXT,
      selected_response TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    )
  `;

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

  const styleChangesTable = `
    CREATE TABLE IF NOT EXISTS style_changes (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      from_tone TEXT,
      to_tone TEXT NOT NULL,
      message_count INTEGER,
      changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    )
  `;

  // Create tables in sequence
  db.serialize(() => {
    db.run(conversationsTable, (err) => {
      if (err) console.error('Error creating conversations table:', err);
      else console.log('Conversations table ready');
    });

    db.run(messagesTable, (err) => {
      if (err) console.error('Error creating messages table:', err);
      else console.log('Messages table ready');
    });

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

    db.run(styleChangesTable, (err) => {
      if (err) console.error('Error creating style_changes table:', err);
      else console.log('Style changes table ready');
    });

    // Create indexes after tables are created
    db.run('CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id)', (err) => {
      if (err) console.error('Error creating conversations index:', err);
    });
    
    db.run('CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id)', (err) => {
      if (err) console.error('Error creating messages index:', err);
    });
    
    db.run('CREATE INDEX IF NOT EXISTS idx_arguments_user_id ON arguments(user_id)', (err) => {
      if (err) console.error('Error creating arguments index:', err);
    });
    
    db.run('CREATE INDEX IF NOT EXISTS idx_responses_argument_id ON responses(argument_id)', (err) => {
      if (err) console.error('Error creating responses index:', err);
    });
    
    db.run('CREATE INDEX IF NOT EXISTS idx_style_changes_conversation_id ON style_changes(conversation_id)', (err) => {
      if (err) console.error('Error creating style_changes index:', err);
    });

    // Migrate existing conversations to add current_tone if it doesn't exist
    db.run(`ALTER TABLE conversations ADD COLUMN current_tone TEXT`, (err) => {
      if (!err) {
        console.log('Added current_tone column to conversations');
        // Set current_tone to initial tone for existing conversations
        db.run(`UPDATE conversations SET current_tone = tone WHERE current_tone IS NULL`);
      }
    });

    // Add custom_tone_description column if it doesn't exist
    db.run(`ALTER TABLE conversations ADD COLUMN custom_tone_description TEXT`, (err) => {
      if (!err) {
        console.log('Added custom_tone_description column to conversations');
      }
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