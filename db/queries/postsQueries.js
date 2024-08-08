const pool = require('../pool');

async function getAllPosts() {
  const { rows } = await pool.query(
    `SELECT posts.*, users.username, to_char(posts.date, 'DD-MM-YYYY HH24:MI:SS') AS date_format FROM posts INNER JOIN users ON posts.user_id = users.id ORDER BY posts.date DESC`
  );
  return rows;
}

async function getUserPosts(userId) {
  const { rows } = await pool.query(
    `SELECT posts.*, users.first_name || ' ' || users.last_name AS "full_name", to_char(posts.date, 'DD-MM-YYYY HH24:MI:SS') AS date_format FROM posts INNER JOIN users ON posts.user_id = users.id WHERE posts.user_id = $1 ORDER BY posts.date DESC`,
    [userId]
  );
  return rows;
}

async function getFollowersPosts(userId) {
  const { rows } = await pool.query(
    `SELECT 
      p.id AS post_id,
      u.first_name || ' ' || u.last_name AS author_name,
      to_char(p.date, 'DD-MM-YYYY HH24:MI:SS') AS post_date,
      p.content AS post_content
    FROM 
      posts p
    JOIN 
      users u ON p.user_id = u.id
    WHERE 
      p.user_id = $1
      OR p.user_id IN (SELECT f.user_follower_id FROM followers f WHERE f.user_id = $1)
    ORDER BY 
      p.date DESC`,
    [userId]
  );
  return rows;
}

async function insertPost(title, content, date, user) {
  await pool.query(
    'INSERT INTO posts(title, content, date, user_id) VALUES($1, $2, $3, $4)',
    [title, content, date, user]
  );
}

async function deletePost(postId) {
  await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
}

module.exports = {
  getAllPosts,
  getUserPosts,
  getFollowersPosts,
  insertPost,
  deletePost,
};
