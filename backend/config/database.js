import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import bcrypt from 'bcryptjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '../data');

if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const dbPath = join(dataDir, 'cash-app.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados SQLite ✅');
    initializeDatabase();
  }
});

function migrateCategoriesTable() {
  db.get(
    "SELECT sql FROM sqlite_master WHERE type='table' AND name='categories'",
    (err, row) => {
      if (err || !row) return;

      if (row.sql.includes('UNIQUE(user_id, code, type)')) return;

      db.serialize(() => {
        db.run(`
          CREATE TABLE IF NOT EXISTS categories_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            code INTEGER NOT NULL,
            type TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE(user_id, code, type)
          )
        `);
        db.run('INSERT INTO categories_new SELECT * FROM categories');
        db.run('DROP TABLE categories');
        db.run('ALTER TABLE categories_new RENAME TO categories', (migrateErr) => {
          if (!migrateErr) {
            console.log('Migração de categorias concluída ✅');
          }
        });
      });
    }
  );
}

function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, () => {
    db.get('SELECT * FROM users WHERE email = ?', ['admin@edu.com'], (err, row) => {
      if (!row) {
        const hashedPassword = bcrypt.hashSync('admin1234', 10);
        db.run(
          'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
          ['Admin Teste', 'admin@edu.com', hashedPassword],
          () => {
            console.log('Usuário admin criado para teste ✅');
          }
        );
      }
    });
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      code INTEGER NOT NULL,
      type TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, code, type)
    )
  `, () => {
    migrateCategoriesTable();
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      date DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    )
  `);
}

export default db;
