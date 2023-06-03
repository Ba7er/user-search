const { db } = require('./database');

const search = async (params) => {
  const { query, userId } = params;
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT id, name, id in (SELECT friendId from Friends where userId = ${userId}) as connection from Users where name LIKE '${query}%' LIMIT 20;`,
      (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      }
    );
  });
};

const addFriend = async (params) => {
  const { userId, friendId } = params;
  return new Promise((resolve, reject) => {
    db.run('BEGIN TRANSACTION', (err) => {
      if (err) {
        reject(err);
      }

      const insertStatements = [
        'INSERT INTO Friends (userId, friendId) VALUES (?, ?)',
        'INSERT INTO Friends (userId, friendId) VALUES (?, ?)',
      ];

      const values = [
        [userId, friendId],
        [friendId, userId],
      ];

      for (let i = 0; i < insertStatements.length; i++) {
        db.run(insertStatements[i], values[i], (err, data) => {
          if (err) {
            db.run('ROLLBACK');
            reject(err);
          }

          if (i === insertStatements.length - 1) {
            db.run('COMMIT');
            resolve(data);
          }
        });
      }
    });
  });
};

const removeFriend = async (params) => {
  const { userId, friendId } = params;
  return new Promise((resolve, reject) => {
    db.run('BEGIN TRANSACTION', (err) => {
      if (err) {
        reject(err);
      }

      const insertStatements = [
        'DELETE FROM Friends WHERE userId = ? and friendId = ?',
        'DELETE FROM Friends WHERE userId = ? and friendId = ?',
      ];

      const values = [
        [userId, friendId],
        [friendId, userId],
      ];

      for (let i = 0; i < insertStatements.length; i++) {
        db.run(insertStatements[i], values[i], (err, data) => {
          if (err) {
            db.run('ROLLBACK');
            reject(err);
          }

          if (i === insertStatements.length - 1) {
            db.run('COMMIT');
            resolve(data);
          }
        });
      }
    });
  });
};

module.exports = {
  search,
  addFriend,
  removeFriend,
};
