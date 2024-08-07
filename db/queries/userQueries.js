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
    `SELECT 
      u1.first_name || ' ' || u1.last_name AS user_full_name,
      u1.avatar_url AS user_avatar_url,
      u1.about AS user_about,
      (SELECT COUNT(*) FROM followers WHERE user_id = u1.id) AS user_followers_count,
      array_agg(
        json_build_object(
          'follower_full_name', u2.first_name || ' ' || u2.last_name,
          'follower_avatar_url', u2.avatar_url,
          'follower_count', (SELECT COUNT(*) FROM followers WHERE user_id = u2.id)
        )
      ) AS followers
    FROM 
      followers f
    JOIN 
      users u1 ON f.user_id = u1.id
    JOIN 
      users u2 ON f.user_follower_id = u2.id
    WHERE 
      u1.id = $1
    GROUP BY 
      u1.id;`,
    [userId]
  );
  return rows;
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
