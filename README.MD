## Running the App

To run the app, follow these steps:

1. Install the required dependencies: `npm install`
2. Run the app: `node index.js`

## Database Layout

The database layout remains unchanged, but three indexes have been created to enhance querying performance:

1. Index created on the `userId` column in the Friends table:

```sql
CREATE INDEX idx_friends_userId ON Friends (userId);
```

2. Index created on the `friendId` column in the Friends table:

```sql
CREATE INDEX idx_friends_userId ON Friends (userId);
```

3. Index created on the name column in the Users table:

```sql
CREATE INDEX idx_users_name ON Users (name);
```

## Search API

The Search API supports fetching users with connection levels 1st, 2nd, 3rd, and 4th. The query used to implement this feature in the initial setup has been replaced with the following query:

```sql
SELECT U.id, U.name,
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
  LIMIT 20
```

## Limitation Factors

In the current database layout, the Friends table captures direct friendships between two users. However, it does not provide a direct way to determine higher-level connections or relationships between users.

To traverse the friendship graph and determine higher-level connections, additional queries or self-joins on the Friends table are required. This limitation arises because the database schema does not inherently capture or represent these higher-level relationships.

## Additional Recommendations

Creating a third table that holds all connection levels as columns for each user, with each column containing a JSON structure of user IDs, can be one way to represent and store connection levels

```sql
CREATE TABLE ConnectionLevels (
  user_id INTEGER PRIMARY KEY,
  level_1 TEXT,
  level_2 TEXT,
  level_3 TEXT,
)
```

In this table, each column (level_1, level_2, level_3, etc.) represents a different connection level. The values in these columns can be stored as JSON structures that contain the user IDs at that particular connection level.

```cmd
user_id | level_1 | level_2 | level_3
--------+-----------------+-----------------------------
1 | [2, 3, 4] | [5, 6, 7, 8, 9] | [10, 11, 12, 13, 14]
```

While this approach allows for quick retrieval of connection levels for a specific user, it has some considerations:

1. Increased storage requirements: Storing connection levels as JSON structures can increase the storage requirements compared to a normalized schema. Depending on the size of the dataset, this may impact the overall storage capacity.
2. Data consistency and synchronization: Whenever friendships are established or removed, the ConnectionLevels table needs to be updated accordingly to reflect the changes. This adds complexity to the data management process and requires careful synchronization.
3. Query performance: While retrieving connection levels for a specific user is fast in this denormalized schema, querying for more complex relationships or performing aggregations across multiple users can be challenging. JSON parsing and manipulation can introduce performance overhead, especially with larger datasets.
4. Data integrity and validation: Since the connection levels are stored as JSON structures, it is essential to ensure the integrity and validity of the data. It may require additional checks and validation during data insertion or updates.
