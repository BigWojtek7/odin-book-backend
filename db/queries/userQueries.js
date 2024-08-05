const pool = require('../pool');

async function getUsername(userId) {
  const { rows } = await pool.query(
    'SELECT username, is_admin FROM users WHERE id=$1',
    [userId]
  );
  return rows[0];
}

async function insertUser(username, password, isAdmin) {
  await pool.query(
    'INSERT INTO users (username, password, is_admin) VALUES ($1, $2, $3)',
    [username, password, isAdmin]
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
  insertUser,
  getUserByUsername,
  getUserById,
};
