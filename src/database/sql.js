const INSERT_FRIEND_QRY = () =>
  `INSERT INTO Friends (userId, friendId) VALUES (?, ?)`;

const DELETE_FREIND_QRY = () =>
  `DELETE FROM Friends WHERE userId = ? and friendId = ?`;

const SEARCH_FRIEND_QYR = ({ userId, query }) =>
  `
  SELECT  U.id, U.name,
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
  GROUP BY U.id, U.name
  LIMIT 20`;
module.exports = {
  INSERT_FRIEND_QRY,
  DELETE_FREIND_QRY,
  SEARCH_FRIEND_QYR,
};
