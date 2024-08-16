const pool = require('../pool');

async function getUser(userId) {
  const { rows } = await pool.query(
    `SELECT
      U.ID AS USER_ID,
      U.FIRST_NAME,
      U.LAST_NAME,
      U.E_MAIL,
      U.USERNAME,
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

async function getRequestsReceived(userId) {
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

async function getRequestsSent(userId) {
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
      JOIN USERS U ON R.user_id = U.ID
    WHERE
      R.USER_SENDER_ID = $1;`,
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
  await pool.query('DELETE FROM requests WHERE user_id=$1', [userId]);
}

async function deleteFollower(userId, followerId) {
  await pool.query(
    'DELETE FROM followers WHERE user_id=$1 AND user_follower_id=$2',
    [userId, followerId]
  );
}

async function updatePassword(password, userId) {
  await pool.query('UPDATE users SET password = $1 WHERE users.id = $2', [
    password,
    userId,
  ]);
}

async function updateProfile(
  first_name,
  last_name,
  e_mail,
  profession,
  about,
  username,
  userId
) {
  await pool.query(
    'UPDATE users SET first_name = $1, last_name = $2, e_mail = $3, profession = $4, about = $5, username= $6 WHERE users.id = $7',
    [first_name, last_name, e_mail, profession, about, username, userId]
  );
}

module.exports = {
  getUser,
  getFollowers,
  getRequestsReceived,
  getRequestsSent,
  insertUser,
  insertFollower,
  deleteRequest,
  deleteFollower,
  getUserByUsername,
  getUserById,
  getFollowersSuggestion,
  updatePassword,
  updateProfile,
};
