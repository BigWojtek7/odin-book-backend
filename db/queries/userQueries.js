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
  const { rows } = await pool.query(
    'INSERT INTO users (first_name, last_name, e_mail, profession, about, avatar_url, username, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
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
  return rows[0];
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

async function getUserByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM users WHERE e_mail=$1', [
    email,
  ]);
  return rows[0];
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
  username,
  userId
) {
  await pool.query(
    'UPDATE users SET first_name = $1, last_name = $2, e_mail = $3, profession = $4, username= $5 WHERE users.id = $6',
    [first_name, last_name, e_mail, profession, username, userId]
  );
}

async function updateAbout(about, userId) {
  await pool.query('UPDATE users SET about=$1 WHERE users.id=$2', [
    about,
    userId,
  ]);
}

async function updateAvatar(avatarUrl, userId) {
  await pool.query('UPDATE users SET avatar_url=$1 WHERE users.id=$2', [
    avatarUrl,
    userId,
  ]);
}

module.exports = {
  getUser,
  insertUser,
  getUserByUsername,
  getUserById,
  getUserByEmail,
  updateAvatar,
  updateAbout,
  updatePassword,
  updateProfile,
};
