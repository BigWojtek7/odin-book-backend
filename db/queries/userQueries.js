const pool = require('../pool');

async function getUser(userId) {
  const { rows } = await pool.query(
    `SELECT
      U.ID AS USER_ID,
      U.FIRST_NAME || ' ' || U.LAST_NAME AS FULL_NAME,
      U.AVATAR_URL,
      U.Profession,
      U.ABOUT AS ABOUT,
      (
        SELECT
          COUNT(*)
        FROM
          FOLLOWERS
        WHERE
          USER_ID = U.ID
      ) AS USER_FOLLOWERS_COUNT
    FROM
      USERS U
    WHERE
      U.ID = $1`,
    [userId]
  );
  return rows[0];
}

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

async function getRequests(userId) {
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
      Requests R
      JOIN USERS U ON R.user_sender_id = U.ID
    WHERE
      R.USER_ID = $1;`,
    [userId]
  );
  return rows;
}

async function getAllUser() {
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
      U.ID != 4
      AND U.ID NOT IN (
        SELECT
          F.USER_FOLLOWER_ID
        FROM
          FOLLOWERS F
        WHERE
          F.USER_ID = 4
      )
    ORDER BY
      RANDOM()
    LIMIT
      5;`
  );
  return rows;
}

async function insertUser(
  first_name,
  last_name,
  e_mail,
  profession,
  about,
  avatar_url,
  username,
  password
) {
  await pool.query(
    'INSERT INTO users (first_name, last_name, e_mail, profession, about, avatar_url, username, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    [
      first_name,
      last_name,
      e_mail,
      profession,
      about,
      avatar_url,
      username,
      password,
    ]
  );
}

async function getUserByUsername(username) {
  const { rows } = await pool.query('SELECT * FROM users WHERE username=$1', [
    username,
  ]);
  return rows[0];
}

async function getUserById(userId) {
  const { rows } = await pool.query('SELECT * FROM users WHERE id=$1', [
    userId,
  ]);
  return rows;
}

async function insertFollower(userId, followerId) {
  await pool.query(
    'INSERT INTO followers (user_id, user_follower_id) VALUES ($1, $2)',
    [userId, followerId]
  );
}

async function deleteRequest(userId) {
  await pool.query(
    'DELETE FROM requests WHERE user_id=$1',
    [userId]
  );
}

module.exports = {
  getUser,
  getFollowers,
  getRequests,
  insertUser,
  insertFollower,
  deleteRequest,
  getUserByUsername,
  getUserById,
  getAllUser,
};
