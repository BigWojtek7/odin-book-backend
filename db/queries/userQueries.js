const pool = require('../pool');

async function getUserById(userId) {
  const { rows } = await pool.query('SELECT * FROM USERS WHERE id=$1', [
    userId,
  ]);
  return rows;
}

module.exports = {
  getUserById,
};
