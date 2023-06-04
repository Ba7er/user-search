const {
  DELETE_FREIND_QRY,
  INSERT_FRIEND_QRY,
  SEARCH_FRIEND_QYR,
} = require('./sql');
class UserService {
  constructor(database) {
    const { db } = database;
    this.db = db;
  }

  runQuery(query, values) {
    return this.db.run(query, values, (err) => {
      if (err) {
        this.db.run('ROLLBACK');
        throw new Error({ message: 'Error during query', err });
      }
    });
  }

  execTransaction(operation, values) {
    return new Promise((res, rej) => {
      this.db.run('BEGIN TRANSACTION', (err) => {
        if (err) {
          rej(err);
        }

        for (let i = 0; i < 2; i++) {
          const qry =
            operation === 'INSERT'
              ? INSERT_FRIEND_QRY()
              : operation === 'DELETE'
              ? DELETE_FREIND_QRY()
              : null;

          this.runQuery(qry, values[i]);
          if (i === 0) {
            this.db.run('COMMIT');
            res();
          }
        }
      });
    });
  }

  async addFriend({ userId, friendId }) {
    return this.execTransaction('INSERT', [
      [userId, friendId],
      [friendId, userId],
    ]);
  }

  async removeFriend({ userId, friendId }) {
    return this.execTransaction('DELETE', [
      [userId, friendId],
      [friendId, userId],
    ]);
  }

  async search(params) {
    const { query, userId } = params;
    return new Promise((resolve, reject) => {
      this.db.all(SEARCH_FRIEND_QYR({ userId, query }), (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }
}

module.exports = UserService;
