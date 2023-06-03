const db = require('./database');

const search = async (params) => {
  const { query, userId } = params;
  return await db.all(
    `SELECT id, name, id in (SELECT friendId from Friends where userId = ${userId}) as connection from Users where name LIKE '${query}%' LIMIT 20;`
  );
};

module.exports = {
  search,
};
