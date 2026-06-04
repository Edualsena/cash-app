import db from '../config/database.js';

export const Transaction = {
  create: (userId, categoryId, amount, type, description, date) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO transactions (user_id, category_id, amount, type, description, date) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, categoryId, amount, type, description, date],
        function(err) {
          if (err) reject(err);
          else resolve({
            id: this.lastID,
            user_id: userId,
            category_id: categoryId,
            amount,
            type,
            description,
            date
          });
        }
      );
    });
  },

  getByUserId: (userId, limit = 100) => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT t.*, c.name as category_name, c.code as category_code
         FROM transactions t
         JOIN categories c ON t.category_id = c.id
         WHERE t.user_id = ?
         ORDER BY t.date DESC
         LIMIT ?`,
        [userId, limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  },

  getByUserIdAndDate: (userId, startDate, endDate) => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT t.*, c.name as category_name, c.code as category_code
         FROM transactions t
         JOIN categories c ON t.category_id = c.id
         WHERE t.user_id = ? AND t.date BETWEEN ? AND ?
         ORDER BY t.date DESC`,
        [userId, startDate, endDate],
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
        `SELECT t.*, c.name as category_name, c.code as category_code
         FROM transactions t
         JOIN categories c ON t.category_id = c.id
         WHERE t.id = ? AND t.user_id = ?`,
        [id, userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  },

  delete: (id, userId) => {
    return new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM transactions WHERE id = ? AND user_id = ?',
        [id, userId],
        (err) => {
          if (err) reject(err);
          else resolve({ success: true });
        }
      );
    });
  },

  getDailySummary: (userId, date) => {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT
          COALESCE(SUM(CASE WHEN type = 'entrada' THEN amount ELSE 0 END), 0) as total_entrada,
          COALESCE(SUM(CASE WHEN type = 'saída' THEN amount ELSE 0 END), 0) as total_saida
         FROM transactions
         WHERE user_id = ? AND date = ?`,
        [userId, date],
        (err, row) => {
          if (err) reject(err);
          else {
            const data = row || { total_entrada: 0, total_saida: 0 };
            data.saldo = data.total_entrada - data.total_saida;
            resolve(data);
          }
        }
      );
    });
  }
};
