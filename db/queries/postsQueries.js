const pool = require('../pool');

async function getAllPosts() {
  const { rows } = await pool.query(`SELECT posts.*, users.username, to_char(posts.date, 'DD-MM-YYYY HH24:MI:SS') AS date_format FROM posts INNER JOIN users ON posts.user_id = users.id ORDER BY posts.date DESC`);
  return rows;
}

async function getSinglePost(postId) {
  const { rows } = await pool.query('SELECT * FROM posts WHERE id = $1', [
    postId,
  ]);
  return rows[0];
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
  getSinglePost,
  insertPost,
  deletePost,
};
