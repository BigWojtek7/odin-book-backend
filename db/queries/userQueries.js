const pool = require('../pool');

async function getUsername(userId) {
  const { rows } = await pool.query(
    'SELECT username, is_admin FROM users WHERE id=$1',
    [userId]
  );
  return rows[0];
}

async function getUser(userId) {
  const { rows } = await pool.query(
    'SELECT users.*, followers.first_name followers.last_name FROM users INNER JOIN users ON followers.user_id = user.id',
    [userId]
  );
  return rows[0];
}

async function insertUser(
  first_name,
  last_name,
  e_mail,
  about,
  avatar_url,
  username,
  password
) {
  await pool.query(
    'INSERT INTO users (first_name, last_name, e_mail, about, avatar_url, username, password) VALUES ($1, $2, $3)',
    [first_name, last_name, e_mail, about, avatar_url, username, password]
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

module.exports = {
  getUsername,
  getUser,
  insertUser,
  getUserByUsername,
  getUserById,
};
