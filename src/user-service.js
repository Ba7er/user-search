const { db } = require('./database');

// to find 1st and 2nd connection
//
const search = async (params) => {
  const { query, userId } = params;
  return new Promise((resolve, reject) => {
    db.all(
      // `SELECT id, name, id in (SELECT friendId from Friends where userId = ${userId}) as connection from Users where name LIKE '${query}%' LIMIT 20;`,
      `SELECT DISTINCT U.id, U.name,
  CASE
    WHEN F1.friendId IS NOT NULL THEN 1
    WHEN F2.friendId IS NOT NULL THEN 2
    WHEN F3.friendId IS NOT NULL THEN 3
    WHEN F4.friendId IS NOT NULL THEN 4
    ELSE 0
  END AS connection
FROM Users U
LEFT JOIN Friends F1 ON U.id = F1.friendId AND F1.userId = ${userId}
LEFT JOIN Friends F2 ON U.id = F2.friendId AND F2.userId IN (SELECT friendId FROM Friends WHERE userId = ${userId})
LEFT JOIN Friends F3 ON U.id = F3.friendId AND F3.userId IN (SELECT friendId FROM Friends WHERE userId IN (SELECT friendId FROM Friends WHERE userId = ${userId}))
LEFT JOIN Friends F4 ON U.id = F4.friendId AND F4.userId IN (SELECT friendId FROM Friends WHERE userId IN (SELECT friendId FROM Friends WHERE userId IN (SELECT friendId FROM Friends WHERE userId = ${userId})))
WHERE U.name LIKE '${query}%'
LIMIT 20;
`,
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
