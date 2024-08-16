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
  insertUser,
  getUserByUsername,
  getUserById,
  updatePassword,
  updateProfile,
};
