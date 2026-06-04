import db from '../config/database.js';

export const Category = {
  create: (userId, name, code, type) => {
    return new Promise((resolve, reject) => {
      // Validar se o código está entre 9500 e 9599
      if (code < 9500 || code > 9599) {
        return reject(new Error('Código deve estar entre 9500 e 9599'));
      }

      db.run(
        'INSERT INTO categories (user_id, name, code, type) VALUES (?, ?, ?, ?)',
        [userId, name, code, type],
        function(err) {
          if (err) {
            if (err.message.includes('UNIQUE')) {
              reject(new Error('Este código já existe para este usuário'));
            } else {
              reject(err);
            }
          } else {
            resolve({ id: this.lastID, user_id: userId, name, code, type });
          }
        }
      );
    });
  },

  getByUserId: (userId) => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM categories WHERE user_id = ? ORDER BY code',
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  },

  getById: (id, userId) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM categories WHERE id = ? AND user_id = ?',
        [id, userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  },

  update: (id, userId, name, code, type) => {
    return new Promise((resolve, reject) => {
      if (code < 9500 || code > 9599) {
        return reject(new Error('Código deve estar entre 9500 e 9599'));
      }

      db.run(
        'UPDATE categories SET name = ?, code = ?, type = ? WHERE id = ? AND user_id = ?',
        [name, code, type, id, userId],
        (err) => {
          if (err) {
            if (err.message.includes('UNIQUE')) {
              reject(new Error('Este código já existe para este usuário'));
            } else {
              reject(err);
            }
          } else {
            resolve({ id, user_id: userId, name, code, type });
          }
        }
      );
    });
  },

  delete: (id, userId) => {
    return new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM categories WHERE id = ? AND user_id = ?',
        [id, userId],
        (err) => {
          if (err) reject(err);
          else resolve({ success: true });
        }
      );
    });
  }
};
