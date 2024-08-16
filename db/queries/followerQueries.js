const pool = require('../pool');

async function getFollowers(userId) {
  const { rows } = await pool.query(
    `SELECT
      U.FIRST_NAME || ' ' || U.LAST_NAME AS FOLLOWER_NAME,
      U.ID AS FOLLOWER_ID,
      AVATAR_URL,
      (
        SELECT
          COUNT(*)
        FROM
          FOLLOWERS F2
        WHERE
          F2.USER_FOLLOWER_ID = U.ID
      ) AS USER_FOLLOWERS_COUNT
    FROM
      FOLLOWERS F
      JOIN USERS U ON F.USER_FOLLOWER_ID = U.ID
    WHERE
      F.USER_ID = $1;`,
    [userId]
  );
  return rows;
}

async function getFollowersSuggestion(userId) {
  const { rows } = await pool.query(
    `SELECT
      u.ID AS USER_ID,
      u.FIRST_NAME || ' ' || u.LAST_NAME AS FULL_NAME,
      u.AVATAR_URL,
      (
        SELECT
          COUNT(*)
        FROM
          FOLLOWERS
        WHERE
          USER_ID = u.ID
      ) AS USER_FOLLOWERS_COUNT
    FROM
      USERS U
    WHERE
      U.ID != $1
      AND U.ID NOT IN (
        SELECT
          F.USER_FOLLOWER_ID
        FROM
          FOLLOWERS F
        WHERE
          F.USER_ID = $1
      )
    ORDER BY
      RANDOM()
    LIMIT
      5;`,
    [userId]
  );
  return rows;
}

async function insertFollower(userId, followerId) {
  await pool.query(
    'INSERT INTO followers (user_id, user_follower_id) VALUES ($1, $2)',
    [userId, followerId]
  );
}

async function deleteFollower(userId, followerId) {
  await pool.query(
    'DELETE FROM followers WHERE user_id=$1 AND user_follower_id=$2',
    [userId, followerId]
  );
}

module.exports = {
  getFollowers,
  getFollowersSuggestion,
  insertFollower,
  deleteFollower,
};
